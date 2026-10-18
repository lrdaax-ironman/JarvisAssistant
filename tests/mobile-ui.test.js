const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");
const routing = require("../mobile-command-routing");
const { mergeMobileItem, mergeMobileItems } = require("../mobile-import");

const mobileSource = fs.readFileSync(path.join(__dirname, "..", "mobile.js"), "utf8");
const mobileMarkup = fs.readFileSync(path.join(__dirname, "..", "mobile.html"), "utf8");
const cardCommands = [...new Set([...mobileMarkup.matchAll(/data-mobile-command="([^"]+)"/g)].map((match) => match[1]))];

function createMobilePage({ initialStorage = {}, bridge = null, origin = { protocol: "https:", hostname: "jarvis.example" }, failStorageKeyOnce = null } = {}) {
  const values = new Map(Object.entries(initialStorage));
  const elements = new Map();
  const handlers = new Map();
  const commandButtons = new Map(cardCommands.map((command) => [command, {
    dataset: { mobileCommand: command },
    listeners: {},
    addEventListener(name, callback) { this.listeners[name] = callback; }
  }]));
  const desktopData = bridge && bridge.data;
  const blobs = new Map();
  let downloadedContents = null;
  let nextImportedId = 0;
  let failingKey = failStorageKeyOnce;
  const bridgeCalls = [];

  function element(id) {
    if (!elements.has(id)) {
      elements.set(id, {
        id, value: "", textContent: "", innerHTML: "", hidden: false, disabled: false, dataset: {},
        listeners: {},
        scrollCalls: 0,
        scrollIntoView() { this.scrollCalls += 1; },
        addEventListener(name, callback) { this.listeners[name] = callback; }
      });
    }
    return elements.get(id);
  }

  const storage = {
    getItem(key) { return values.has(key) ? values.get(key) : null; },
    setItem(key, value) {
      if (key === failingKey) {
        failingKey = null;
        throw new Error("Storage full");
      }
      values.set(key, String(value));
    },
    removeItem(key) { values.delete(key); }
  };
  const navigator = { platform: "Test", standalone: false };
  const window = {
    JarvisMobileCommands: routing,
    navigator,
    crypto: { randomUUID: () => "device-123" },
    matchMedia: () => ({ matches: false }),
    setTimeout: () => 1,
    clearTimeout: () => {},
    addEventListener: (name, callback) => handlers.set(name, callback)
  };
  const document = {
    getElementById: element,
    querySelectorAll: (selector) => selector === "[data-mobile-command]" ? [...commandButtons.values()] : [],
    body: { appendChild() {} },
    createElement: () => ({
      href: "", download: "",
      click() { downloadedContents = blobs.get(this.href); },
      remove() {}
    }),
    documentElement: { classList: { add() {} } },
    addEventListener: (name, callback) => handlers.set(name, callback)
  };
  class FakeBlob {
    constructor(parts) { this.contents = parts.join(""); }
  }
  const urlApi = {
    createObjectURL(blob) {
      const url = `blob:test-${blobs.size + 1}`;
      blobs.set(url, blob.contents);
      return url;
    },
    revokeObjectURL() {}
  };

  async function fetchBridge(pathname, options = {}) {
    if (!bridge) throw new Error("Bridge hors ligne");
    bridgeCalls.push(pathname);
    let result;
    if (pathname === "/bridge/status") result = { ok: true, bridge: true, authenticated: true };
    else if (pathname === "/bridge/data") result = { ok: true, data: desktopData };
    else if (pathname === "/bridge/export-mobile") result = { ok: true, export: bridge.exportPayload };
    else if (pathname === "/bridge/summary") result = { ok: true, summary: { counts: {}, ollama: { ok: true } } };
    else if (pathname === "/bridge/import-batch" && bridge.legacyImport) {
      result = { ok: false, message: "Route Bridge introuvable." };
      return { ok: false, status: 404, text: async () => JSON.stringify(result) };
    } else if (pathname === "/bridge/import-batch") {
      if (bridge.importGate) await bridge.importGate;
      result = mergeMobileItems(desktopData, JSON.parse(options.body), {
        createId: (prefix) => `${prefix}-${++nextImportedId}`
      });
    } else if (pathname === "/bridge/import-item") {
      result = mergeMobileItem(desktopData, JSON.parse(options.body), {
        createId: (prefix) => `${prefix}-${++nextImportedId}`
      });
    } else throw new Error(`Route inattendue : ${pathname}`);
    return { ok: result.ok, status: result.ok ? 200 : 400, text: async () => JSON.stringify(result) };
  }

  vm.runInNewContext(mobileSource, {
    window, document, navigator, localStorage: storage, fetch: fetchBridge,
    location: origin, AbortController, console, Date, Math,
    Blob: FakeBlob, URL: urlApi
  });

  return {
    element, storage, desktopData, bridgeCalls,
    commandButton: (command) => commandButtons.get(command),
    downloaded: () => downloadedContents,
    init: () => handlers.get("DOMContentLoaded")()
  };
}

test("les cartes mobiles affichent leur reponse dans la zone visible", async () => {
  const page = createMobilePage();
  await page.init();
  const response = page.element("assistant-response");
  const cards = ["ia", "taches", "notes", "rappels", "planning", "memoire", "mode mobile", "parametres"];

  for (const command of cards) {
    const button = page.commandButton(command);
    assert.equal(typeof button.listeners.click, "function", `${command} doit etre cliquable`);
    await button.listeners.click();
    assert.match(response.innerHTML, /<strong>.+<\/strong>/);
  }

  assert.equal(response.scrollCalls, cards.length);
  await page.commandButton("aide").listeners.click();
  assert.match(response.innerHTML, /Aide mobile/);
  assert.equal(response.scrollCalls, cards.length + 1);
});

test("parcours mobile autonome : note locale et commande desktop bloquee", async () => {
  const page = createMobilePage();
  await page.init();
  const input = page.element("command-input");
  const submit = page.element("command-form").listeners.submit;

  input.value = "note Tester Jarvis";
  submit({ preventDefault() {} });
  await new Promise(setImmediate);
  const notes = JSON.parse(page.storage.getItem("jarvis-mobile:notes"));
  assert.equal(notes.length, 1);
  assert.equal(notes[0].content, "Tester Jarvis");

  input.value = "ouvre documents";
  submit({ preventDefault() {} });
  await new Promise(setImmediate);
  assert.match(page.element("assistant-response").innerHTML, /uniquement sur la version desktop/);
});

test("parcours Bridge : affichage PC, import volontaire et reconnexion sans doublons", async () => {
  const localNotes = [{ id: "offline-1", content: "Note du telephone", createdAt: "2026-09-30T10:00:00Z" }];
  const desktopData = { tasks: [], notes: [], reminders: [], planning: [], memories: [], mobileImports: [] };
  const page = createMobilePage({
    initialStorage: {
      "jarvis-mobile:bridge-token": "token-test",
      "jarvis-mobile:notes": JSON.stringify(localNotes)
    },
    bridge: { data: desktopData }
  });
  await page.init();

  assert.equal(page.element("notes-count").textContent, "0 note");
  assert.equal(page.element("local-transfer-panel").hidden, false);
  assert.match(page.element("local-transfer-count").textContent, /1 element/);

  const summaryCallsBeforeImport = page.bridgeCalls.filter((path) => path === "/bridge/summary").length;
  await page.element("local-transfer-button").listeners.click();
  assert.equal(desktopData.notes.length, 1);
  assert.equal(page.element("notes-count").textContent, "1 note");
  assert.equal(JSON.parse(page.storage.getItem("jarvis-mobile:notes")).length, 1);
  assert.ok(page.bridgeCalls.includes("/bridge/import-batch"));
  assert.equal(page.bridgeCalls.filter((path) => path === "/bridge/summary").length, summaryCallsBeforeImport);

  await page.element("local-transfer-button").listeners.click();
  assert.equal(desktopData.notes.length, 1);
  assert.match(page.element("assistant-response").innerHTML, /1 deja presents/);

  page.element("bridge-disconnect-button").listeners.click();
  assert.equal(page.element("notes-count").textContent, "1 note");
  assert.equal(page.element("local-transfer-panel").hidden, false);
  assert.equal(page.element("local-export-button").hidden, false);
  assert.equal(page.element("local-transfer-button").hidden, true);
});

test("l'import indique immediatement qu'il travaille avant la reponse du PC", async () => {
  let releaseImport;
  const importGate = new Promise((resolve) => { releaseImport = resolve; });
  const desktopData = { tasks: [], notes: [], reminders: [], planning: [], memories: [], mobileImports: [] };
  const page = createMobilePage({
    initialStorage: {
      "jarvis-mobile:bridge-token": "token-test",
      "jarvis-mobile:notes": JSON.stringify([{ id: "offline-1", content: "Note en attente" }])
    },
    bridge: { data: desktopData, importGate }
  });
  await page.init();

  const pending = page.element("local-transfer-button").listeners.click();
  assert.match(page.element("assistant-response").innerHTML, /Import en cours/);
  assert.equal(page.element("local-transfer-button").disabled, true);
  releaseImport();
  await pending;
  assert.match(page.element("assistant-response").innerHTML, /Import termine/);
  assert.equal(page.element("local-transfer-button").disabled, false);
});

test("l'import reste compatible avec un Bridge qui ne connait que l'ancienne route", async () => {
  const desktopData = { tasks: [], notes: [], reminders: [], planning: [], memories: [], mobileImports: [] };
  const page = createMobilePage({
    initialStorage: {
      "jarvis-mobile:bridge-token": "token-test",
      "jarvis-mobile:notes": JSON.stringify([{ id: "offline-1", content: "Ancienne connexion" }])
    },
    bridge: { data: desktopData, legacyImport: true }
  });
  await page.init();
  await page.element("local-transfer-button").listeners.click();
  assert.equal(desktopData.notes[0].content, "Ancienne connexion");
  assert.ok(page.bridgeCalls.includes("/bridge/import-item"));
  assert.match(page.element("assistant-response").innerHTML, /Import termine/);
});

test("parcours inter-origines : charge un export Vercel dans le Bridge", async () => {
  const localNotes = [{ id: "offline-1", content: "Note Vercel", createdAt: "2026-09-30T10:00:00Z" }];
  const vercelPage = createMobilePage({ initialStorage: {
    "jarvis-mobile:bridge-token": "secret-a-ne-pas-exporter",
    "jarvis-mobile:notes": JSON.stringify(localNotes)
  } });
  await vercelPage.init();
  vercelPage.element("local-export-button").listeners.click();
  const exported = JSON.parse(vercelPage.downloaded());
  assert.equal(exported.format, "jarvis-mobile-v1");
  assert.equal(exported.items.length, 1);
  assert.doesNotMatch(vercelPage.downloaded(), /secret-a-ne-pas-exporter/);

  const desktopData = { tasks: [], notes: [], reminders: [], planning: [], memories: [], mobileImports: [] };
  const page = createMobilePage({
    initialStorage: { "jarvis-mobile:bridge-token": "token-test" },
    bridge: { data: desktopData }
  });
  await page.init();
  assert.equal(page.element("local-transfer-panel").hidden, false);
  assert.equal(page.element("local-transfer-button").hidden, true);

  await page.element("local-load-input").listeners.change({
    target: { files: [{ size: 200, text: async () => JSON.stringify(exported) }] }
  });
  assert.equal(page.element("local-transfer-button").hidden, false);

  await page.element("local-transfer-button").listeners.click();
  assert.equal(desktopData.notes[0].content, "Note Vercel");
  assert.deepEqual(desktopData.mobileImports, ["device-123:notes:offline-1"]);
  assert.equal(page.element("local-transfer-button").hidden, true);
});

test("parcours PC vers PWA : export, apercu, import volontaire et reprise sans doublons", async () => {
  const desktopExport = {
    format: "jarvis-desktop-v1", exportedAt: "2026-10-18T10:00:00Z",
    items: [
      { type: "tasks", item: { id: "task-1", title: "Livrer V4.7", status: "completed", priority: "high", completedAt: "2026-10-18T10:00:00Z" } },
      { type: "notes", item: { id: "note-1", content: "Note PC" } },
      { type: "reminders", item: { id: "reminder-1", title: "Verifier demain", remindAt: "2026-10-19T10:00:00Z", done: false } },
      { type: "planning", item: { id: "planning-1", title: "Rendez-vous", date: "2026-10-19", time: "10:30", type: "personal" } },
      { type: "memories", item: { id: "memory-1", content: "Projet Jarvis", category: "general" } }
    ]
  };
  const bridgePage = createMobilePage({
    initialStorage: { "jarvis-mobile:bridge-token": "secret-a-ne-pas-exporter" },
    bridge: { data: { tasks: [], notes: [], reminders: [], planning: [], memories: [] }, exportPayload: desktopExport },
    origin: { protocol: "http:", hostname: "192.168.1.20" }
  });
  await bridgePage.init();
  assert.equal(bridgePage.element("desktop-export-button").hidden, false);
  await bridgePage.element("desktop-export-button").listeners.click();
  assert.ok(bridgePage.bridgeCalls.includes("/bridge/export-mobile"));
  assert.doesNotMatch(bridgePage.downloaded(), /secret-a-ne-pas-exporter/);
  assert.equal(JSON.parse(bridgePage.downloaded()).items.length, 5);

  const pwaPage = createMobilePage({ initialStorage: {
    "jarvis-mobile:notes": JSON.stringify([{ id: "local-note", content: "Original mobile" }])
  } });
  await pwaPage.init();
  assert.equal(pwaPage.element("local-load-button").hidden, false);
  assert.equal(pwaPage.element("phone-import-button").hidden, true);
  const file = { size: 1000, text: async () => bridgePage.downloaded() };
  await pwaPage.element("local-load-input").listeners.change({ target: { files: [file] } });
  assert.match(pwaPage.element("assistant-response").innerHTML, /depuis le PC/);
  assert.equal(pwaPage.element("phone-import-button").hidden, false);
  assert.equal(pwaPage.element("local-transfer-button").hidden, true);
  await pwaPage.element("phone-import-button").listeners.click();
  assert.match(pwaPage.element("assistant-response").innerHTML, /5 element\(s\) copies/);
  assert.equal(JSON.parse(pwaPage.storage.getItem("jarvis-mobile:notes")).length, 2);
  assert.equal(JSON.parse(pwaPage.storage.getItem("jarvis-mobile:tasks"))[0].status, "completed");
  assert.equal(JSON.parse(pwaPage.storage.getItem("jarvis-mobile:reminders"))[0].remindAt, "2026-10-19T10:00:00Z");
  assert.equal(JSON.parse(pwaPage.storage.getItem("jarvis-mobile:planning"))[0].time, "10:30");

  await pwaPage.element("local-load-input").listeners.change({ target: { files: [file] } });
  await pwaPage.element("phone-import-button").listeners.click();
  assert.match(pwaPage.element("assistant-response").innerHTML, /5 deja presents/);
  assert.equal(JSON.parse(pwaPage.storage.getItem("jarvis-mobile:notes")).length, 2);
});

test("un export invalide ne peut pas importer de donnees PC", async () => {
  const page = createMobilePage();
  await page.init();
  await page.element("local-load-input").listeners.change({ target: {
    files: [{ size: 100, text: async () => JSON.stringify({
      format: "jarvis-desktop-v1", items: [{ type: "unknown", item: { id: "x" } }]
    }) }]
  } });
  assert.match(page.element("assistant-response").innerHTML, /Export refuse/);
  assert.equal(page.element("phone-import-button").hidden, true);
});

test("un import PC interrompu reprend sans dupliquer les categories deja sauvegardees", async () => {
  const page = createMobilePage({ failStorageKeyOnce: "jarvis-mobile:notes" });
  await page.init();
  const file = { size: 300, text: async () => JSON.stringify({
    format: "jarvis-desktop-v1", items: [
      { type: "tasks", item: { id: "task-pc", title: "A faire" } },
      { type: "notes", item: { id: "note-pc", content: "A retenir" } }
    ]
  }) };
  await page.element("local-load-input").listeners.change({ target: { files: [file] } });
  await page.element("phone-import-button").listeners.click();
  assert.match(page.element("assistant-response").innerHTML, /Import interrompu/);
  assert.equal(JSON.parse(page.storage.getItem("jarvis-mobile:tasks")).length, 1);
  assert.equal(page.storage.getItem("jarvis-mobile:notes"), null);

  await page.element("local-load-input").listeners.change({ target: { files: [file] } });
  await page.element("phone-import-button").listeners.click();
  assert.match(page.element("assistant-response").innerHTML, /1 deja presents/);
  assert.equal(JSON.parse(page.storage.getItem("jarvis-mobile:tasks")).length, 1);
  assert.equal(JSON.parse(page.storage.getItem("jarvis-mobile:notes")).length, 1);
});
