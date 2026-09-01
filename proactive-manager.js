const crypto = require("node:crypto");

const DEFAULT_NOTIFICATION_RETENTION = 100;
const DEFAULT_SNOOZE_MINUTES = 10;

function cloneJson(value) {
  return JSON.parse(JSON.stringify(value));
}

function normalizeMinutes(value) {
  const minutes = Number(value);
  if (!Number.isFinite(minutes)) return DEFAULT_SNOOZE_MINUTES;
  return Math.max(1, Math.min(24 * 60, Math.round(minutes)));
}

function createProactiveManager({
  store,
  now = () => new Date(),
  retention = DEFAULT_NOTIFICATION_RETENTION
}) {
  if (!store || typeof store.read !== "function" || typeof store.mutate !== "function") {
    throw new TypeError("Un stockage transactionnel est requis pour le mode proactif.");
  }

  const maxNotifications = Math.max(10, Number(retention) || DEFAULT_NOTIFICATION_RETENTION);

  function ensureCollections(data) {
    if (!Array.isArray(data.reminders)) data.reminders = [];
    if (!Array.isArray(data.notifications)) data.notifications = [];
  }

  function updateRelatedNotifications(data, reminderId, status, actionedAt) {
    data.notifications.forEach((notification) => {
      if (notification.entityId !== reminderId || notification.status !== "active") return;
      notification.status = status;
      notification.actionedAt = actionedAt;
      notification.readAt = notification.readAt || actionedAt;
    });
  }

  async function claimDueReminders() {
    const currentDate = now();
    const currentTime = currentDate.getTime();
    const currentIso = currentDate.toISOString();

    return store.mutate((data) => {
      ensureCollections(data);
      const claimed = [];
      const notifications = [];

      data.reminders.forEach((reminder) => {
        if (reminder.done || reminder.notifiedAt || !reminder.remindAt) return;
        const remindAt = new Date(reminder.remindAt).getTime();
        if (!Number.isFinite(remindAt) || remindAt > currentTime) return;

        reminder.notifiedAt = currentIso;
        const notification = {
          id: crypto.randomUUID(),
          type: "reminder",
          title: "Rappel JARVIS",
          message: String(reminder.title || "Rappel"),
          entityId: String(reminder.id || ""),
          createdAt: currentIso,
          readAt: null,
          actionedAt: null,
          status: "active"
        };
        data.notifications.unshift(notification);
        notifications.push(cloneJson(notification));
        claimed.push(cloneJson(reminder));
      });

      data.notifications = data.notifications.slice(0, maxNotifications);
      return { ok: true, reminders: claimed, notifications };
    });
  }

  async function listNotifications(limit = maxNotifications) {
    const data = await store.read();
    const notifications = Array.isArray(data.notifications) ? data.notifications : [];
    const safeLimit = Math.max(1, Math.min(maxNotifications, Number(limit) || maxNotifications));
    const items = notifications.slice(0, safeLimit).map(cloneJson);
    return {
      ok: true,
      notifications: items,
      unread: notifications.filter((item) => !item.readAt).length,
      active: notifications.filter((item) => item.status === "active").length
    };
  }

  async function markRead(notificationId) {
    const safeId = String(notificationId || "");
    const currentIso = now().toISOString();
    return store.mutate((data) => {
      ensureCollections(data);
      const notification = data.notifications.find((item) => item.id === safeId);
      if (!notification) return { ok: false, message: "Notification introuvable." };
      notification.readAt = notification.readAt || currentIso;
      return { ok: true, notification: cloneJson(notification) };
    });
  }

  async function markAllRead() {
    const currentIso = now().toISOString();
    return store.mutate((data) => {
      ensureCollections(data);
      data.notifications.forEach((notification) => {
        notification.readAt = notification.readAt || currentIso;
      });
      return { ok: true, count: data.notifications.length };
    });
  }

  async function clearNotifications() {
    return store.mutate((data) => {
      ensureCollections(data);
      const count = data.notifications.length;
      data.notifications = [];
      return { ok: true, cleared: count };
    });
  }

  async function completeReminder(reminderId) {
    const safeId = String(reminderId || "");
    const currentIso = now().toISOString();
    return store.mutate((data) => {
      ensureCollections(data);
      const reminder = data.reminders.find((item) => item.id === safeId);
      if (!reminder) return { ok: false, message: "Rappel introuvable." };
      reminder.done = true;
      reminder.completedAt = currentIso;
      updateRelatedNotifications(data, safeId, "completed", currentIso);
      return { ok: true, reminder: cloneJson(reminder) };
    });
  }

  async function snoozeReminder(reminderId, minutes = DEFAULT_SNOOZE_MINUTES) {
    const safeId = String(reminderId || "");
    const safeMinutes = normalizeMinutes(minutes);
    const currentDate = now();
    const currentIso = currentDate.toISOString();
    const nextDate = new Date(currentDate.getTime() + safeMinutes * 60 * 1000);

    return store.mutate((data) => {
      ensureCollections(data);
      const reminder = data.reminders.find((item) => item.id === safeId);
      if (!reminder) return { ok: false, message: "Rappel introuvable." };
      reminder.done = false;
      reminder.completedAt = null;
      reminder.notifiedAt = null;
      reminder.remindAt = nextDate.toISOString();
      updateRelatedNotifications(data, safeId, "snoozed", currentIso);
      return { ok: true, minutes: safeMinutes, reminder: cloneJson(reminder) };
    });
  }

  return {
    claimDueReminders,
    clearNotifications,
    completeReminder,
    listNotifications,
    markAllRead,
    markRead,
    snoozeReminder
  };
}

module.exports = {
  DEFAULT_SNOOZE_MINUTES,
  createProactiveManager
};
