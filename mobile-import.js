const IMPORT_TYPES = new Set(["tasks", "notes", "reminders", "planning", "memories"]);

function validIso(value, fallback) {
  if (typeof value !== "string") return fallback;
  const date = new Date(value);
  return Number.isFinite(date.getTime()) ? date.toISOString() : fallback;
}

function mergeMobileItem(data, payload, { now = () => new Date(), createId } = {}) {
  const type = payload && payload.type;
  const item = payload && payload.item;
  const sourceId = payload && payload.sourceId;
  if (!IMPORT_TYPES.has(type) || !item || typeof item !== "object") {
    return { ok: false, message: "Element mobile invalide." };
  }
  if (typeof sourceId !== "string" || !/^[a-zA-Z0-9:_-]{1,200}$/.test(sourceId)) {
    return { ok: false, message: "Identifiant de transfert invalide." };
  }
  if (typeof createId !== "function") throw new TypeError("Un generateur d'identifiant est requis.");

  const title = typeof item.content === "string" ? item.content.trim() : typeof item.title === "string" ? item.title.trim() : "";
  if (!title || title.length > 1200) return { ok: false, message: "Le texte mobile doit contenir entre 1 et 1200 caracteres." };

  if (!Array.isArray(data.mobileImports)) data.mobileImports = [];
  if (data.mobileImports.includes(sourceId)) return { ok: true, imported: false, duplicate: true };
  if (!Array.isArray(data[type])) data[type] = [];

  const currentIso = now().toISOString();
  const createdAt = validIso(item.createdAt, currentIso);
  const idPrefix = { tasks: "task", notes: "note", reminders: "reminder", planning: "planning", memories: "memory" }[type];
  const id = createId(idPrefix);
  let imported;

  if (type === "tasks") {
    const completed = item.status === "completed";
    imported = {
      id, title, status: completed ? "completed" : "todo", priority: "normal",
      createdAt, completedAt: completed ? validIso(item.completedAt, currentIso) : null, dueAt: null
    };
  } else if (type === "reminders") {
    imported = {
      id, title, createdAt, remindAt: null, done: Boolean(item.done),
      notifiedAt: null, completedAt: item.done ? validIso(item.completedAt, currentIso) : null
    };
  } else if (type === "planning") {
    const date = typeof item.date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(item.date)
      ? item.date : createdAt.slice(0, 10);
    imported = { id, title, date, time: null, type: "other", createdAt };
  } else if (type === "memories") {
    imported = { id, content: title, category: "general", createdAt, updatedAt: createdAt };
  } else {
    imported = { id, content: title, createdAt };
  }

  data[type].unshift(imported);
  data.mobileImports.push(sourceId);
  return { ok: true, imported: true, duplicate: false, item: imported };
}

module.exports = { mergeMobileItem };
