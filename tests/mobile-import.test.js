const assert = require("node:assert/strict");
const test = require("node:test");
const { mergeMobileItem } = require("../mobile-import");

function fixture() {
  const data = { tasks: [], notes: [], reminders: [], planning: [], memories: [], mobileImports: [] };
  let nextId = 0;
  const options = {
    now: () => new Date("2026-10-01T12:00:00.000Z"),
    createId: (prefix) => `${prefix}-${++nextId}`
  };
  return { data, options };
}

test("importe un element mobile une seule fois sans supprimer la source", () => {
  const { data, options } = fixture();
  const source = { id: "1", content: "Finir JARVIS", status: "completed", createdAt: "2026-09-30T10:00:00Z" };
  const payload = { type: "tasks", sourceId: "device-1:tasks:1", item: source };

  assert.equal(mergeMobileItem(data, payload, options).imported, true);
  assert.equal(mergeMobileItem(data, payload, options).duplicate, true);
  assert.equal(data.tasks.length, 1);
  assert.equal(data.tasks[0].status, "completed");
  assert.equal(data.tasks[0].title, "Finir JARVIS");
  assert.equal(source.status, "completed");
  assert.deepEqual(data.mobileImports, ["device-1:tasks:1"]);
});

test("importe notes, rappels, planning et memoires avec leurs champs attendus", () => {
  const { data, options } = fixture();
  const values = [
    ["notes", "Idee locale"],
    ["reminders", "Boire de l'eau"],
    ["planning", "Sport"],
    ["memories", "J'aime les reponses directes"]
  ];
  for (const [type, content] of values) {
    const result = mergeMobileItem(data, {
      type,
      sourceId: `device-1:${type}:1`,
      item: { content, createdAt: "2026-09-30T10:00:00Z" }
    }, options);
    assert.equal(result.ok, true);
    assert.equal(data[type].length, 1);
  }
  assert.equal(data.reminders[0].remindAt, null);
  assert.equal(data.planning[0].date, "2026-09-30");
  assert.equal(data.memories[0].category, "general");
});

test("refuse un transfert invalide sans modifier les donnees", () => {
  const { data, options } = fixture();
  assert.equal(mergeMobileItem(data, { type: "settings", sourceId: "x", item: { content: "Non" } }, options).ok, false);
  assert.equal(mergeMobileItem(data, { type: "notes", sourceId: "bad id", item: { content: "Non" } }, options).ok, false);
  assert.equal(mergeMobileItem(data, { type: "notes", sourceId: "valid", item: { content: "a".repeat(1201) } }, options).ok, false);
  assert.equal(data.mobileImports.length, 0);
  assert.equal(data.notes.length, 0);
});
