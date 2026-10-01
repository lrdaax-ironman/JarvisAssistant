const assert = require("node:assert/strict");
const fs = require("node:fs/promises");
const os = require("node:os");
const path = require("node:path");
const test = require("node:test");
const { createJarvisBridge } = require("../bridge-server");
const { mergeMobileItem } = require("../mobile-import");

test("Bridge serves mobile, pairs a device and protects local data", async () => {
  const rootDir = await fs.mkdtemp(path.join(os.tmpdir(), "jarvis-bridge-"));
  const previousCode = process.env.JARVIS_BRIDGE_PAIR_CODE;
  process.env.JARVIS_BRIDGE_PAIR_CODE = "123456";
  await fs.writeFile(path.join(rootDir, "mobile.html"), "<h1>JARVIS Mobile</h1>", "utf8");
  await fs.writeFile(path.join(rootDir, "mobile-command-routing.js"), "window.routingLoaded = true;", "utf8");

  const data = {
    tasks: [],
    notes: [],
    reminders: [],
    planning: [],
    memories: [],
    mobileImports: []
  };

  const bridge = createJarvisBridge({
    rootDir,
    host: "127.0.0.1",
    port: 0,
    version: "4.5.0-test",
    model: "test-model",
    readData: async () => data,
    getOllamaStatus: async () => ({ ok: true, model: "test-model" }),
    askAi: async (message) => `Reponse: ${message}`,
    addTask: async (title) => {
      const task = { id: "task-1", title, status: "todo", priority: "normal", createdAt: new Date().toISOString() };
      data.tasks.unshift(task);
      return { ok: true, task };
    },
    completeTask: async (id) => {
      const task = data.tasks.find((item) => item.id === id);
      if (task) task.status = "completed";
      return { ok: Boolean(task), task };
    },
    addNote: async () => ({ ok: true }),
    addReminder: async () => ({ ok: true }),
    addPlanningItem: async () => ({ ok: true }),
    addMemory: async () => ({ ok: true }),
    importMobileItem: async (payload) => mergeMobileItem(data, payload, {
      createId: (prefix) => `${prefix}-imported`
    })
  });

  try {
    const started = await bridge.start();
    const baseUrl = `http://127.0.0.1:${started.port}`;

    const mobileResponse = await fetch(`${baseUrl}/mobile.html`);
    assert.equal(mobileResponse.status, 200);
    assert.match(await mobileResponse.text(), /JARVIS Mobile/);
    assert.match(mobileResponse.headers.get("content-security-policy"), /connect-src 'self'/);
    assert.equal((await fetch(`${baseUrl}/mobile-command-routing.js`)).status, 200);

    const blockedData = await fetch(`${baseUrl}/bridge/data`);
    assert.equal(blockedData.status, 401);

    const invalidPair = await fetch(`${baseUrl}/bridge/pair`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: "000000" })
    });
    assert.equal(invalidPair.status, 401);

    const pairResponse = await fetch(`${baseUrl}/bridge/pair`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code: "123456",
        device: { name: "Telephone test", platform: "Test OS" }
      })
    });
    assert.equal(pairResponse.status, 200);
    const pair = await pairResponse.json();
    assert.equal(pair.ok, true);
    assert.ok(pair.token);

    const authHeaders = {
      Authorization: `Bearer ${pair.token}`,
      "Content-Type": "application/json"
    };
    const addTaskResponse = await fetch(`${baseUrl}/bridge/tasks`, {
      method: "POST",
      headers: authHeaders,
      body: JSON.stringify({ title: "Tester le Bridge" })
    });
    assert.equal(addTaskResponse.status, 200);

    const dataResponse = await fetch(`${baseUrl}/bridge/data`, { headers: authHeaders });
    const dataPayload = await dataResponse.json();
    assert.equal(dataPayload.data.tasks[0].title, "Tester le Bridge");

    const importBody = JSON.stringify({
      type: "notes",
      sourceId: "telephone-1:notes:1",
      item: { id: "1", content: "Note hors ligne", createdAt: "2026-09-30T10:00:00Z" }
    });
    const firstImport = await fetch(`${baseUrl}/bridge/import-item`, {
      method: "POST", headers: authHeaders, body: importBody
    });
    const secondImport = await fetch(`${baseUrl}/bridge/import-item`, {
      method: "POST", headers: authHeaders, body: importBody
    });
    assert.equal((await firstImport.json()).imported, true);
    assert.equal((await secondImport.json()).duplicate, true);
    assert.equal(data.notes.length, 1);

    const aiResponse = await fetch(`${baseUrl}/bridge/ai`, {
      method: "POST",
      headers: authHeaders,
      body: JSON.stringify({ message: "Bonjour" })
    });
    const aiPayload = await aiResponse.json();
    assert.equal(aiPayload.response, "Reponse: Bonjour");

    const status = bridge.getStatus();
    assert.equal(status.connectedDevices, 1);
    assert.equal(status.devices[0].name, "Telephone test");
    assert.equal(status.devices[0].platform, "Test OS");

    const revoked = bridge.revokeDevice(status.devices[0].id);
    assert.equal(revoked.revoked, true);
    assert.equal(bridge.getStatus().connectedDevices, 0);
    assert.equal((await fetch(`${baseUrl}/bridge/data`, { headers: authHeaders })).status, 401);

    const crossOriginResponse = await fetch(`${baseUrl}/bridge/status`, {
      headers: { Origin: "https://example.com" }
    });
    assert.equal(crossOriginResponse.status, 403);
  } finally {
    await bridge.stop();
    await fs.rm(rootDir, { recursive: true, force: true });
    if (previousCode === undefined) delete process.env.JARVIS_BRIDGE_PAIR_CODE;
    else process.env.JARVIS_BRIDGE_PAIR_CODE = previousCode;
  }
});
