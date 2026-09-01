const assert = require("node:assert/strict");
const fs = require("node:fs/promises");
const os = require("node:os");
const path = require("node:path");
const test = require("node:test");
const { createMemoryStore } = require("../memory-store");
const { createProactiveManager } = require("../proactive-manager");

async function createFixture() {
  const directory = await fs.mkdtemp(path.join(os.tmpdir(), "jarvis-proactive-"));
  const store = createMemoryStore({
    filePath: path.join(directory, "jarvis-memory.json"),
    defaults: { reminders: [], notifications: [] },
    normalize: (data) => ({
      reminders: Array.isArray(data && data.reminders) ? data.reminders : [],
      notifications: Array.isArray(data && data.notifications) ? data.notifications : []
    })
  });
  let currentDate = new Date("2026-09-01T10:00:00.000Z");
  const manager = createProactiveManager({ store, now: () => new Date(currentDate) });
  return {
    directory,
    manager,
    setNow(value) {
      currentDate = new Date(value);
    },
    store
  };
}

test("reclame un rappel du une seule fois et cree une notification persistante", async (t) => {
  const fixture = await createFixture();
  t.after(() => fs.rm(fixture.directory, { recursive: true, force: true }));
  await fixture.store.write({
    reminders: [{ id: "r1", title: "Tester JARVIS", remindAt: "2026-09-01T09:59:00.000Z", done: false }],
    notifications: []
  });

  const firstClaim = await fixture.manager.claimDueReminders();
  const secondClaim = await fixture.manager.claimDueReminders();
  const status = await fixture.manager.listNotifications();

  assert.equal(firstClaim.reminders.length, 1);
  assert.equal(secondClaim.reminders.length, 0);
  assert.equal(status.notifications.length, 1);
  assert.equal(status.unread, 1);
  assert.equal(status.notifications[0].entityId, "r1");
});

test("termine un rappel depuis une action de notification", async (t) => {
  const fixture = await createFixture();
  t.after(() => fs.rm(fixture.directory, { recursive: true, force: true }));
  await fixture.store.write({
    reminders: [{ id: "r2", title: "Finaliser la V4.5", remindAt: "2026-09-01T09:00:00.000Z", done: false }],
    notifications: []
  });
  await fixture.manager.claimDueReminders();

  const result = await fixture.manager.completeReminder("r2");
  const data = await fixture.store.read();

  assert.equal(result.ok, true);
  assert.equal(data.reminders[0].done, true);
  assert.equal(data.notifications[0].status, "completed");
  assert.ok(data.notifications[0].readAt);
});

test("reprogramme un rappel et le rend de nouveau eligible apres le delai", async (t) => {
  const fixture = await createFixture();
  t.after(() => fs.rm(fixture.directory, { recursive: true, force: true }));
  await fixture.store.write({
    reminders: [{ id: "r3", title: "Faire une pause", remindAt: "2026-09-01T09:00:00.000Z", done: false }],
    notifications: []
  });
  await fixture.manager.claimDueReminders();
  await fixture.manager.snoozeReminder("r3", 10);

  assert.equal((await fixture.manager.claimDueReminders()).reminders.length, 0);
  fixture.setNow("2026-09-01T10:11:00.000Z");
  assert.equal((await fixture.manager.claimDueReminders()).reminders.length, 1);

  const data = await fixture.store.read();
  assert.equal(data.notifications[0].status, "active");
  assert.equal(data.notifications[1].status, "snoozed");
});
