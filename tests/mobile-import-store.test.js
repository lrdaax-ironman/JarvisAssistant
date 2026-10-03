const assert = require("node:assert/strict");
const fs = require("node:fs/promises");
const os = require("node:os");
const path = require("node:path");
const test = require("node:test");
const { createMemoryStore } = require("../memory-store");
const { mergeMobileItems } = require("../mobile-import");

test("le lot importe reste dans le fichier PC apres relecture", async () => {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), "jarvis-mobile-import-"));
  const filePath = path.join(directory, "jarvis-memory.json");
  const defaults = { tasks: [], notes: [], reminders: [], planning: [], memories: [], mobileImports: [] };
  const store = createMemoryStore({ filePath, defaults });
  const payload = {
    deviceId: "telephone-1",
    items: [{ type: "notes", item: { id: "note-1", content: "Note mobile" } }]
  };

  try {
    const options = { createId: (prefix) => `${prefix}-desktop` };
    const first = await store.mutate((data) => mergeMobileItems(data, payload, options));
    assert.equal(first.imported, 1);
    assert.equal((await store.read()).notes[0].content, "Note mobile");
    assert.equal(JSON.parse(await fs.readFile(filePath, "utf8")).mobileImports.length, 1);

    const retry = await store.mutate((data) => mergeMobileItems(data, payload, options));
    assert.deepEqual(retry, { ok: true, imported: 0, duplicates: 1 });
    assert.equal((await store.read()).notes.length, 1);
  } finally {
    await fs.rm(directory, { recursive: true, force: true });
  }
});
