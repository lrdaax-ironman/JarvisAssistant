const IMPORT_TYPES = new Set(["tasks", "notes", "reminders", "planning", "memories"]);
const MAX_IMPORT_BATCH = 50;

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

function mergeMobileItems(data, payload, options = {}) {
  const deviceId = payload && payload.deviceId;
  const items = payload && payload.items;
  if (typeof deviceId !== "string" || !/^[a-zA-Z0-9_-]{1,80}$/.test(deviceId)) {
    return { ok: false, message: "Identifiant du telephone invalide." };
  }
  if (!Array.isArray(items) || items.length < 1 || items.length > MAX_IMPORT_BATCH) {
    return { ok: false, message: `Envoyez entre 1 et ${MAX_IMPORT_BATCH} elements par lot.` };
  }

  const working = { mobileImports: [...(Array.isArray(data.mobileImports) ? data.mobileImports : [])] };
  for (const type of IMPORT_TYPES) working[type] = [...(Array.isArray(data[type]) ? data[type] : [])];

  let imported = 0;
  let duplicates = 0;
  for (const [index, entry] of items.entries()) {
    const item = entry && entry.item;
    if (!item || typeof item !== "object" || Array.isArray(item)
      || typeof item.id !== "string" || !/^[a-zA-Z0-9_-]{1,70}$/.test(item.id)) {
      return { ok: false, message: `Identifiant mobile invalide (element ${index + 1}).` };
    }
    const result = mergeMobileItem(working, {
      type: entry.type,
      item,
      sourceId: `${deviceId}:${entry.type}:${item.id}`
    }, options);
    if (!result.ok) return { ok: false, message: `${result.message} (element ${index + 1}).` };
    if (result.imported) imported += 1;
    else duplicates += 1;
  }

  for (const type of IMPORT_TYPES) data[type] = working[type];
  data.mobileImports = working.mobileImports;
  return { ok: true, imported, duplicates };
}

module.exports = { mergeMobileItem, mergeMobileItems, MAX_IMPORT_BATCH };
