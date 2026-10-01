const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");
const routing = require("../mobile-command-routing");
const { mergeMobileItem } = require("../mobile-import");

const mobileSource = fs.readFileSync(path.join(__dirname, "..", "mobile.js"), "utf8");

function createMobilePage({ initialStorage = {}, bridge = null } = {}) {
  const values = new Map(Object.entries(initialStorage));
  const elements = new Map();
  const handlers = new Map();
  const desktopData = bridge && bridge.data;
  const blobs = new Map();
  let downloadedContents = null;

  function element(id) {
    if (!elements.has(id)) {
      elements.set(id, {
        id, value: "", textContent: "", innerHTML: "", hidden: false, disabled: false, dataset: {},
        listeners: {},
        addEventListener(name, callback) { this.listeners[name] = callback; }
      });
    }
    return elements.get(id);
  }

  const storage = {
    getItem(key) { return values.has(key) ? values.get(key) : null; },
    setItem(key, value) { values.set(key, String(value)); },
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
    querySelectorAll: () => [],
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
    let result;
    if (pathname === "/bridge/status") result = { ok: true, bridge: true, authenticated: true };
    else if (pathname === "/bridge/data") result = { ok: true, data: desktopData };
    else if (pathname === "/bridge/summary") result = { ok: true, summary: { counts: {}, ollama: { ok: true } } };
    else if (pathname === "/bridge/import-item") {
      result = mergeMobileItem(desktopData, JSON.parse(options.body), {
        createId: (prefix) => `${prefix}-${desktopData.mobileImports.length + 1}`
      });
    } else throw new Error(`Route inattendue : ${pathname}`);
    return { ok: result.ok, status: result.ok ? 200 : 400, text: async () => JSON.stringify(result) };
  }

  vm.runInNewContext(mobileSource, {
    window, document, navigator, localStorage: storage, fetch: fetchBridge,
    location: { protocol: "https:", hostname: "localhost" }, AbortController, console, Date, Math,
    Blob: FakeBlob, URL: urlApi
  });

  return { element, storage, desktopData, downloaded: () => downloadedContents, init: () => handlers.get("DOMContentLoaded")() };
}

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

  await page.element("local-transfer-button").listeners.click();
  assert.equal(desktopData.notes.length, 1);
  assert.equal(page.element("notes-count").textContent, "1 note");
  assert.equal(JSON.parse(page.storage.getItem("jarvis-mobile:notes")).length, 1);

  await page.element("local-transfer-button").listeners.click();
  assert.equal(desktopData.notes.length, 1);
  assert.match(page.element("assistant-response").innerHTML, /1 deja presents/);

  page.element("bridge-disconnect-button").listeners.click();
  assert.equal(page.element("notes-count").textContent, "1 note");
  assert.equal(page.element("local-transfer-panel").hidden, false);
  assert.equal(page.element("local-export-button").hidden, false);
  assert.equal(page.element("local-transfer-button").hidden, true);
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
