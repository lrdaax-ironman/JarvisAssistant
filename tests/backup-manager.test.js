const assert = require("node:assert/strict");
const fs = require("node:fs/promises");
const os = require("node:os");
const path = require("node:path");
const test = require("node:test");
const { createBackupManager } = require("../backup-manager");
const { createMemoryStore } = require("../memory-store");

async function createFixture() {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), "jarvis-backup-manager-"));
  const store = createMemoryStore({
    filePath: path.join(directory, "jarvis-memory.json"),
    defaults: { tasks: [], notes: [] },
    normalize: (data) => ({
      tasks: Array.isArray(data && data.tasks) ? data.tasks : [],
      notes: Array.isArray(data && data.notes) ? data.notes : []
    })
  });
  const manager = createBackupManager({
    store,
    backupDirectory: path.join(directory, "backups"),
    appVersion: "4.4.0-test",
    normalizeData: (data) => ({
      tasks: Array.isArray(data && data.tasks) ? data.tasks : [],
      notes: Array.isArray(data && data.notes) ? data.notes : []
    })
  });
  return { directory, manager, store };
}

test("cree et inventorie une sauvegarde locale versionnee", async (t) => {
  const fixture = await createFixture();
  t.after(() => fs.rm(fixture.directory, { recursive: true, force: true }));
  await fixture.store.write({ tasks: [{ id: "1", title: "Tester V4.4" }], notes: [] });

  const backup = await fixture.manager.create("manual");
  const payload = JSON.parse(await fs.readFile(backup.path, "utf8"));
  const status = await fixture.manager.getStatus();

  assert.equal(payload.format, "jarvis-assistant-backup");
  assert.equal(payload.schemaVersion, 1);
  assert.equal(payload.appVersion, "4.4.0-test");
  assert.equal(payload.data.tasks[0].title, "Tester V4.4");
  assert.equal(status.count, 1);
  assert.equal(status.storage.health, "healthy");
});

test("exporte puis restaure une sauvegarde avec filet de securite", async (t) => {
  const fixture = await createFixture();
  t.after(() => fs.rm(fixture.directory, { recursive: true, force: true }));
  const exportPath = path.join(fixture.directory, "export-jarvis.json");
  await fixture.store.write({ tasks: [{ id: "old", title: "Etat exporte" }], notes: [] });
  await fixture.manager.exportTo(exportPath);
  await fixture.store.write({ tasks: [{ id: "new", title: "Etat courant" }], notes: [] });

  const imported = await fixture.manager.importFrom(exportPath);
  assert.equal((await fixture.store.read()).tasks[0].title, "Etat exporte");
  assert.match(imported.safetyBackup.fileName, /before-import/);

  const safetyPayload = JSON.parse(await fs.readFile(imported.safetyBackup.path, "utf8"));
  assert.equal(safetyPayload.data.tasks[0].title, "Etat courant");
});

test("refuse un JSON qui n'est pas une sauvegarde JARVIS", async (t) => {
  const fixture = await createFixture();
  t.after(() => fs.rm(fixture.directory, { recursive: true, force: true }));
  const invalidPath = path.join(fixture.directory, "invalid.json");
  await fixture.store.write({ tasks: [{ id: "safe", title: "A conserver" }], notes: [] });
  await fs.writeFile(invalidPath, JSON.stringify({ tasks: [] }), "utf8");

  await assert.rejects(() => fixture.manager.importFrom(invalidPath), /pas une sauvegarde JARVIS/i);
  assert.equal((await fixture.store.read()).tasks[0].title, "A conserver");
});
