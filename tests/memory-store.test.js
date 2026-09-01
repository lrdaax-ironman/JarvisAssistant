const assert = require("node:assert/strict");
const fs = require("node:fs/promises");
const os = require("node:os");
const path = require("node:path");
const test = require("node:test");
const { createMemoryStore } = require("../memory-store");

async function createFixture(options = {}) {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), "jarvis-memory-store-"));
  const filePath = path.join(directory, "jarvis-memory.json");
  const store = createMemoryStore({
    filePath,
    defaults: { tasks: [], counter: 0 },
    normalize: (data) => ({
      tasks: Array.isArray(data && data.tasks) ? data.tasks : [],
      counter: Number.isFinite(data && data.counter) ? data.counter : 0
    }),
    ...options
  });

  return { directory, filePath, store };
}

test("initialise le stockage uniquement lorsque le fichier et sa sauvegarde sont absents", async (t) => {
  const fixture = await createFixture();
  t.after(() => fs.rm(fixture.directory, { recursive: true, force: true }));

  assert.deepEqual(await fixture.store.read(), { tasks: [], counter: 0 });
  assert.deepEqual(JSON.parse(await fs.readFile(fixture.filePath, "utf8")), { tasks: [], counter: 0 });
});

test("serialise les mutations concurrentes sans perdre de mise a jour", async (t) => {
  const fixture = await createFixture();
  t.after(() => fs.rm(fixture.directory, { recursive: true, force: true }));

  await fixture.store.read();
  await Promise.all(Array.from({ length: 30 }, () => fixture.store.mutate((data) => {
    data.counter += 1;
  })));

  assert.equal((await fixture.store.read()).counter, 30);
});

test("recupere une sauvegarde valide et conserve le fichier principal corrompu", async (t) => {
  const fixture = await createFixture();
  t.after(() => fs.rm(fixture.directory, { recursive: true, force: true }));

  await fixture.store.write({ tasks: [], counter: 4 });
  await fixture.store.write({ tasks: [], counter: 5 });
  await fs.writeFile(fixture.filePath, "{json-invalide", "utf8");

  const recovered = await fixture.store.read();
  assert.equal(recovered.counter, 4);
  assert.equal(await fs.readFile(`${fixture.filePath}.corrupt`, "utf8"), "{json-invalide");
  assert.equal(JSON.parse(await fs.readFile(fixture.filePath, "utf8")).counter, 4);
});

test("refuse d'effacer une memoire corrompue sans sauvegarde valide", async (t) => {
  const fixture = await createFixture();
  t.after(() => fs.rm(fixture.directory, { recursive: true, force: true }));
  await fs.mkdir(fixture.directory, { recursive: true });
  await fs.writeFile(fixture.filePath, "{memoire-cassee", "utf8");

  await assert.rejects(() => fixture.store.read(), /aucune sauvegarde valide/i);
  assert.equal(await fs.readFile(fixture.filePath, "utf8"), "{memoire-cassee");
  assert.equal(await fs.readFile(`${fixture.filePath}.corrupt`, "utf8"), "{memoire-cassee");
});

test("echoue sans remplacer le fichier principal lorsqu'une ecriture atomique est refusee", async (t) => {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), "jarvis-memory-store-failure-"));
  const filePath = path.join(directory, "jarvis-memory.json");
  t.after(() => fs.rm(directory, { recursive: true, force: true }));

  const baseStore = createMemoryStore({ filePath, defaults: { tasks: [], counter: 0 } });
  await baseStore.write({ tasks: [], counter: 7 });

  const refusingFs = {
    ...fs,
    async rename(source, destination) {
      if (source === `${filePath}.tmp` && destination === filePath) {
        const error = new Error("Ecriture refusee");
        error.code = "EACCES";
        throw error;
      }
      return fs.rename(source, destination);
    }
  };
  const store = createMemoryStore({ filePath, defaults: { tasks: [], counter: 0 }, fsApi: refusingFs });

  await assert.rejects(() => store.mutate((data) => {
    data.counter = 99;
  }), /Ecriture refusee/);
  assert.equal(JSON.parse(await fs.readFile(filePath, "utf8")).counter, 7);
});

test("fournit un diagnostic sans exposer ni modifier les donnees", async (t) => {
  const fixture = await createFixture();
  t.after(() => fs.rm(fixture.directory, { recursive: true, force: true }));
  await fixture.store.write({ tasks: [], counter: 2 });
  await fixture.store.write({ tasks: [], counter: 3 });

  const diagnostic = await fixture.store.diagnose();
  assert.equal(diagnostic.health, "healthy");
  assert.equal(diagnostic.primary.valid, true);
  assert.equal(diagnostic.backup.valid, true);
  assert.equal(diagnostic.corrupt.exists, false);
  assert.equal((await fixture.store.read()).counter, 3);
});
