const { app, BrowserWindow, ipcMain, shell, session } = require("electron");
const { spawn } = require("node:child_process");
const fs = require("node:fs/promises");
const os = require("node:os");
const path = require("node:path");
const { createJarvisBridge } = require("./bridge-server");

const APP_TITLE = "JARVIS Assistant";
const OLLAMA_URL = "http://localhost:11434/api/chat";
const OLLAMA_STATUS_URL = "http://localhost:11434/api/tags";
const OLLAMA_MODEL = "llama3.2:3b";
const OLLAMA_UNAVAILABLE_MESSAGE = "Ollama ne semble pas lancé. Ouvrez Ollama ou lancez la commande ollama serve.";
const OLLAMA_MODEL_MISSING_MESSAGE = "Le modèle IA local n’est pas disponible. Installez-le avec : ollama pull llama3.2:3b";
const JARVIS_SYSTEM_PROMPT = [
  "Tu es JARVIS, un assistant personnel de bureau en fran\u00e7ais.",
  "Tu r\u00e9ponds de mani\u00e8re claire, concise, professionnelle et l\u00e9g\u00e8rement futuriste.",
  "Tu appelles l'utilisateur \"monsieur\" de temps en temps, sans en abuser.",
  "Tu aides \u00e0 organiser le travail, expliquer, r\u00e9sumer, cr\u00e9er des id\u00e9es et accompagner les routines.",
  "Tu ne pr\u00e9tends pas contr\u00f4ler le monde r\u00e9el sans commande desktop explicite."
].join(" ");
const OPENABLE_FOLDERS = {
  documents: "documents",
  desktop: "desktop"
};
const MEMORY_FILE_NAME = "jarvis-memory.json";
const VOICE_TRANSCRIBE_SCRIPT = path.join(__dirname, "voice", "transcribe.py");
const VOICE_PYTHON_MISSING_MESSAGE = "Python est introuvable. Installez Python depuis python.org et cochez Add Python to PATH.";
const VOICE_DEPENDENCIES_MISSING_MESSAGE = "Dependances vocales absentes. Lancez : python -m pip install sounddevice scipy faster-whisper";
const VOICE_NO_SPEECH_MESSAGE = "Aucune voix detectee. Reessayez en parlant clairement.";
const DEFAULT_AUTOMATION_SETTINGS = {
  startupBriefing: false,
  workModeAutomation: false,
  automaticReminders: true,
  eveningRoutine: false,
  focusAutomation: true,
  lastStartupBriefingDate: null,
  lastEveningRoutineDate: null
};
const DEFAULT_PREFERENCES = {
  activeMode: "standard",
  theme: "cyan",
  animations: true,
  compactMode: false,
  reducedMotion: false
};
const EMPTY_MEMORY_DATA = {
  memories: [],
  notes: [],
  tasks: [],
  reminders: [],
  dailyLogs: [],
  planning: [],
  focusSessions: [],
  automations: DEFAULT_AUTOMATION_SETTINGS,
  preferences: DEFAULT_PREFERENCES
};
let jarvisBridge = null;

app.commandLine.appendSwitch("enable-features", "MediaStream");

function configurePermissions() {
  // Autorise uniquement les permissions media utiles au micro.
  const allowedMediaPermissions = new Set(["media", "microphone", "audioCapture"]);

  session.defaultSession.setPermissionRequestHandler((_webContents, permission, callback, details) => {
    const allowed = allowedMediaPermissions.has(permission);
    console.log("[JARVIS permissions] Permission demandee :", permission, details, "Autorisee :", allowed);
    callback(allowed);
  });

  if (typeof session.defaultSession.setPermissionCheckHandler === "function") {
    session.defaultSession.setPermissionCheckHandler((_webContents, permission, requestingOrigin, details) => {
      const allowed = allowedMediaPermissions.has(permission);
      console.log("[JARVIS permissions] Verification permission :", permission, requestingOrigin, details, "Autorisee :", allowed);
      return allowed;
    });
  }
}

function isSafeExternalUrl(url) {
  // Les liens externes partent dans le navigateur Windows, jamais dans JARVIS.
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.protocol === "https:" || parsedUrl.protocol === "http:";
  } catch (_error) {
    return false;
  }
}

function getWindowFromEvent(event) {
  return BrowserWindow.fromWebContents(event.sender);
}

function openWindowsCalculator() {
  if (process.platform !== "win32") {
    return { ok: false, message: "La calculatrice Windows est disponible uniquement sur Windows." };
  }

  const calculator = spawn("calc.exe", [], {
    detached: true,
    stdio: "ignore"
  });

  calculator.unref();
  return { ok: true };
}

async function openSystemFolder(folderKey) {
  const safeFolderKey = OPENABLE_FOLDERS[folderKey];

  if (!safeFolderKey) {
    return { ok: false, message: "Dossier non autorise." };
  }

  const folderPath = app.getPath(safeFolderKey);
  const errorMessage = await shell.openPath(folderPath);

  return errorMessage ? { ok: false, message: errorMessage } : { ok: true, path: folderPath };
}

function getSimpleSystemInfo() {
  const cpus = os.cpus();

  return {
    ok: true,
    platform: process.platform,
    release: os.release(),
    arch: process.arch,
    hostname: os.hostname(),
    cpuModel: cpus[0] ? cpus[0].model : "CPU inconnu",
    cpuCount: cpus.length,
    totalMemoryGb: Number((os.totalmem() / 1024 / 1024 / 1024).toFixed(1)),
    freeMemoryGb: Number((os.freemem() / 1024 / 1024 / 1024).toFixed(1)),
    electron: process.versions.electron,
    chrome: process.versions.chrome
  };
}

function createLocalId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function getMemoryFilePath() {
  return path.join(app.getPath("userData"), MEMORY_FILE_NAME);
}

function normalizeMemoryData(data) {
  const memories = Array.isArray(data && data.memories) ? data.memories : [];
  const notes = Array.isArray(data && data.notes) ? data.notes : [];
  const tasks = Array.isArray(data && data.tasks) ? data.tasks : [];
  const reminders = Array.isArray(data && data.reminders) ? data.reminders : [];
  const dailyLogs = Array.isArray(data && data.dailyLogs) ? data.dailyLogs : [];
  const planning = Array.isArray(data && data.planning) ? data.planning : [];
  const focusSessions = Array.isArray(data && data.focusSessions) ? data.focusSessions : [];

  return {
    memories: memories
      .filter((memory) => memory && typeof memory.content === "string")
      .map((memory) => ({
        id: typeof memory.id === "string" ? memory.id : createLocalId("memory"),
        content: memory.content,
        category: typeof memory.category === "string" ? memory.category : "general",
        createdAt: typeof memory.createdAt === "string" ? memory.createdAt : new Date().toISOString(),
        updatedAt: typeof memory.updatedAt === "string" ? memory.updatedAt : memory.createdAt || new Date().toISOString()
      })),
    notes: notes
      .filter((note) => note && typeof note.content === "string")
      .map((note) => ({
        id: typeof note.id === "string" ? note.id : createLocalId("note"),
        content: note.content,
        createdAt: typeof note.createdAt === "string" ? note.createdAt : new Date().toISOString()
      })),
    tasks: tasks
      .filter((task) => task && typeof task.title === "string")
      .map((task) => ({
        id: typeof task.id === "string" ? task.id : createLocalId("task"),
        title: task.title,
        status: task.status === "completed" ? "completed" : "todo",
        priority: normalizeTaskPriority(task.priority),
        createdAt: typeof task.createdAt === "string" ? task.createdAt : new Date().toISOString(),
        completedAt: typeof task.completedAt === "string" ? task.completedAt : null,
        dueAt: typeof task.dueAt === "string" ? task.dueAt : null
      })),
    reminders: reminders
      .filter((reminder) => reminder && typeof reminder.title === "string")
      .map((reminder) => ({
        id: typeof reminder.id === "string" ? reminder.id : createLocalId("reminder"),
        title: reminder.title,
        createdAt: typeof reminder.createdAt === "string" ? reminder.createdAt : new Date().toISOString(),
        remindAt: typeof reminder.remindAt === "string" ? reminder.remindAt : null,
        done: Boolean(reminder.done)
      })),
    dailyLogs: dailyLogs
      .filter((log) => log && (typeof log.summary === "string" || Array.isArray(log.wins) || Array.isArray(log.blockers)))
      .map((log) => ({
        id: typeof log.id === "string" ? log.id : createLocalId("daily"),
        date: normalizeDateKey(log.date),
        summary: typeof log.summary === "string" ? log.summary : "",
        mood: typeof log.mood === "string" ? log.mood : "",
        energy: typeof log.energy === "string" ? log.energy : "",
        wins: normalizeTextArray(log.wins),
        blockers: normalizeTextArray(log.blockers),
        createdAt: typeof log.createdAt === "string" ? log.createdAt : new Date().toISOString()
      })),
    planning: planning
      .filter((item) => item && typeof item.title === "string")
      .map((item) => ({
        id: typeof item.id === "string" ? item.id : createLocalId("planning"),
        title: item.title,
        date: normalizeDateKey(item.date),
        time: typeof item.time === "string" && /^\d{2}:\d{2}$/.test(item.time) ? item.time : null,
        type: normalizePlanningType(item.type),
        createdAt: typeof item.createdAt === "string" ? item.createdAt : new Date().toISOString()
      })),
    focusSessions: focusSessions
      .filter((session) => session && typeof session.startedAt === "string")
      .map((session) => ({
        id: typeof session.id === "string" ? session.id : createLocalId("focus"),
        duration: normalizeDuration(session.duration),
        startedAt: session.startedAt,
        endedAt: typeof session.endedAt === "string" ? session.endedAt : null,
        status: normalizeFocusStatus(session.status)
      })),
    automations: normalizeAutomationSettings(data && data.automations),
    preferences: normalizePreferences(data && data.preferences)
  };
}

async function writeMemoryData(data) {
  const normalizedData = normalizeMemoryData(data);
  await fs.mkdir(app.getPath("userData"), { recursive: true });
  await fs.writeFile(getMemoryFilePath(), JSON.stringify(normalizedData, null, 2), "utf8");
  return normalizedData;
}

async function readMemoryData() {
  try {
    const rawData = await fs.readFile(getMemoryFilePath(), "utf8");
    return normalizeMemoryData(JSON.parse(rawData));
  } catch (error) {
    if (error.code === "ENOENT") {
      return writeMemoryData(EMPTY_MEMORY_DATA);
    }

    console.error("Erreur memoire locale:", error);
    return writeMemoryData(EMPTY_MEMORY_DATA);
  }
}

function sanitizeLocalText(content, maxLength = 1200) {
  return typeof content === "string" ? content.trim().slice(0, maxLength) : "";
}

function normalizeTextArray(values) {
  return Array.isArray(values)
    ? values.map((value) => sanitizeLocalText(value, 500)).filter(Boolean)
    : [];
}

function getLocalDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function normalizeDateKey(value) {
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  return getLocalDateKey();
}

function normalizePlanningType(type) {
  const safeType = sanitizeLocalText(type, 30).toLowerCase();
  return ["work", "personal", "sport", "routine", "other"].includes(safeType) ? safeType : "other";
}

function normalizeDuration(duration) {
  const number = Number(duration);
  if (!Number.isFinite(number)) return 25;
  return Math.max(1, Math.min(180, Math.round(number)));
}

function normalizeFocusStatus(status) {
  return ["running", "completed", "cancelled"].includes(status) ? status : "running";
}

function normalizeAutomationSettings(settings) {
  const source = settings && typeof settings === "object" ? settings : {};
  return {
    startupBriefing: Boolean(source.startupBriefing),
    workModeAutomation: Boolean(source.workModeAutomation),
    automaticReminders: typeof source.automaticReminders === "boolean" ? source.automaticReminders : true,
    eveningRoutine: Boolean(source.eveningRoutine),
    focusAutomation: typeof source.focusAutomation === "boolean" ? source.focusAutomation : true,
    lastStartupBriefingDate: typeof source.lastStartupBriefingDate === "string" ? source.lastStartupBriefingDate : null,
    lastEveningRoutineDate: typeof source.lastEveningRoutineDate === "string" ? source.lastEveningRoutineDate : null
  };
}

function normalizePreferences(preferences) {
  const source = preferences && typeof preferences === "object" ? preferences : {};
  const activeMode = sanitizeLocalText(source.activeMode, 30).toLowerCase();
  const theme = sanitizeLocalText(source.theme, 30).toLowerCase();

  return {
    activeMode: ["standard", "work", "focus", "night", "sport", "ai", "hud"].includes(activeMode) ? activeMode : "standard",
    theme: ["cyan", "blue", "green", "violet"].includes(theme) ? theme : "cyan",
    animations: typeof source.animations === "boolean" ? source.animations : true,
    compactMode: Boolean(source.compactMode),
    reducedMotion: Boolean(source.reducedMotion)
  };
}

function normalizeTaskPriority(priority) {
  const safePriority = sanitizeLocalText(priority, 20).toLowerCase();
  return ["low", "normal", "high"].includes(safePriority) ? safePriority : "normal";
}

function isTodayDate(isoDate) {
  if (!isoDate) return false;
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return false;
  return date.toDateString() === new Date().toDateString();
}

function isWithinLastDays(isoDate, days) {
  if (!isoDate) return false;
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return false;
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - (days - 1));
  return date >= start;
}

function buildLocalContextSummary(data) {
  const lines = [];
  const memories = data.memories.slice(0, 5);
  const tasks = data.tasks.filter((task) => task.status !== "completed").slice(0, 5);
  const priorities = data.tasks
    .filter((task) => task.status !== "completed" && task.priority === "high")
    .slice(0, 3);
  const reminders = data.reminders.filter((reminder) => !reminder.done).slice(0, 3);
  const planning = data.planning.filter((item) => item.date === getLocalDateKey()).slice(0, 3);

  memories.forEach((memory) => lines.push(`- Memoire : ${memory.content}`));
  priorities.forEach((task) => lines.push(`- Priorite : ${task.title}`));
  tasks.forEach((task) => lines.push(`- Tache : ${task.title}`));
  reminders.forEach((reminder) => lines.push(`- Rappel : ${reminder.title}`));
  planning.forEach((item) => lines.push(`- Planning : ${item.time ? `${item.time} - ` : ""}${item.title}`));

  if (!lines.length) return "";
  return ["Contexte local de l'utilisateur :", ...lines].join("\n");
}

async function getLocalContextForAi() {
  const data = await readMemoryData();
  return buildLocalContextSummary(data);
}

async function addMemory(content, category = "general") {
  const safeContent = sanitizeLocalText(content);
  if (!safeContent) return { ok: false, message: "Memoire vide." };

  const data = await readMemoryData();
  const now = new Date().toISOString();
  const memory = {
    id: createLocalId("memory"),
    content: safeContent,
    category: sanitizeLocalText(category, 80) || "general",
    createdAt: now,
    updatedAt: now
  };

  data.memories.unshift(memory);
  await writeMemoryData(data);
  return { ok: true, memory, memories: data.memories };
}

async function listMemories() {
  const data = await readMemoryData();
  return { ok: true, memories: data.memories };
}

async function searchMemory(query) {
  const safeQuery = sanitizeLocalText(query, 200).toLowerCase();
  const data = await readMemoryData();
  const memories = safeQuery
    ? data.memories.filter((memory) => memory.content.toLowerCase().includes(safeQuery))
    : data.memories;

  return { ok: true, memories };
}

async function deleteMemory(id) {
  const safeId = sanitizeLocalText(id, 120);
  const data = await readMemoryData();
  const beforeCount = data.memories.length;
  data.memories = data.memories.filter((memory) => memory.id !== safeId);
  await writeMemoryData(data);
  return { ok: true, deleted: beforeCount - data.memories.length, memories: data.memories };
}

async function clearMemory() {
  const data = await readMemoryData();
  data.memories = [];
  await writeMemoryData(data);
  return { ok: true, memories: [] };
}

async function addNote(content) {
  const safeContent = sanitizeLocalText(content);
  if (!safeContent) return { ok: false, message: "Note vide." };

  const data = await readMemoryData();
  const note = {
    id: createLocalId("note"),
    content: safeContent,
    createdAt: new Date().toISOString()
  };

  data.notes.unshift(note);
  await writeMemoryData(data);
  return { ok: true, note, notes: data.notes };
}

async function listNotes() {
  const data = await readMemoryData();
  return { ok: true, notes: data.notes };
}

async function searchNotes(query) {
  const safeQuery = sanitizeLocalText(query, 200).toLowerCase();
  const data = await readMemoryData();
  const notes = safeQuery
    ? data.notes.filter((note) => note.content.toLowerCase().includes(safeQuery))
    : data.notes;

  return { ok: true, notes };
}

async function deleteNote(id) {
  const safeId = sanitizeLocalText(id, 120);
  const data = await readMemoryData();
  const beforeCount = data.notes.length;
  data.notes = data.notes.filter((note) => note.id !== safeId);
  await writeMemoryData(data);
  return { ok: true, deleted: beforeCount - data.notes.length, notes: data.notes };
}

async function clearNotes() {
  const data = await readMemoryData();
  data.notes = [];
  await writeMemoryData(data);
  return { ok: true, notes: [] };
}

async function addTask(title, options = {}) {
  const safeTitle = sanitizeLocalText(title);
  if (!safeTitle) return { ok: false, message: "Tache vide." };

  const data = await readMemoryData();
  const task = {
    id: createLocalId("task"),
    title: safeTitle,
    status: "todo",
    priority: normalizeTaskPriority(options && options.priority),
    createdAt: new Date().toISOString(),
    completedAt: null,
    dueAt: typeof options.dueAt === "string" ? options.dueAt : null
  };

  data.tasks.unshift(task);
  await writeMemoryData(data);
  return { ok: true, task, tasks: data.tasks };
}

async function listTasks() {
  const data = await readMemoryData();
  return { ok: true, tasks: data.tasks };
}

async function completeTask(id) {
  const safeId = sanitizeLocalText(id, 120);
  const data = await readMemoryData();
  const task = data.tasks.find((item) => item.id === safeId);
  if (!task) return { ok: false, message: "Tache introuvable.", tasks: data.tasks };

  task.status = "completed";
  task.completedAt = new Date().toISOString();
  await writeMemoryData(data);
  return { ok: true, task, tasks: data.tasks };
}

async function deleteTask(id) {
  const safeId = sanitizeLocalText(id, 120);
  const data = await readMemoryData();
  const beforeCount = data.tasks.length;
  data.tasks = data.tasks.filter((task) => task.id !== safeId);
  await writeMemoryData(data);
  return { ok: true, deleted: beforeCount - data.tasks.length, tasks: data.tasks };
}

async function clearTasks() {
  const data = await readMemoryData();
  data.tasks = [];
  await writeMemoryData(data);
  return { ok: true, tasks: [] };
}

async function setTaskPriority(id, priority) {
  const safeId = sanitizeLocalText(id, 120);
  const data = await readMemoryData();
  const task = data.tasks.find((item) => item.id === safeId);
  if (!task) return { ok: false, message: "Tache introuvable.", tasks: data.tasks };

  task.priority = normalizeTaskPriority(priority);
  await writeMemoryData(data);
  return { ok: true, task, tasks: data.tasks };
}

async function getTodayTasks() {
  const data = await readMemoryData();
  const tasks = data.tasks.filter((task) => task.status !== "completed" && (isTodayDate(task.dueAt) || task.priority === "high"));
  return { ok: true, tasks };
}

async function addReminder(title, remindAt) {
  const safeTitle = sanitizeLocalText(title);
  if (!safeTitle) return { ok: false, message: "Rappel vide." };

  const data = await readMemoryData();
  const reminder = {
    id: createLocalId("reminder"),
    title: safeTitle,
    createdAt: new Date().toISOString(),
    remindAt: typeof remindAt === "string" && remindAt ? remindAt : null,
    done: false
  };

  data.reminders.unshift(reminder);
  await writeMemoryData(data);
  return { ok: true, reminder, reminders: data.reminders };
}

async function listReminders() {
  const data = await readMemoryData();
  return { ok: true, reminders: data.reminders };
}

async function deleteReminder(id) {
  const safeId = sanitizeLocalText(id, 120);
  const data = await readMemoryData();
  const beforeCount = data.reminders.length;
  data.reminders = data.reminders.filter((reminder) => reminder.id !== safeId);
  await writeMemoryData(data);
  return { ok: true, deleted: beforeCount - data.reminders.length, reminders: data.reminders };
}

async function clearReminders() {
  const data = await readMemoryData();
  data.reminders = [];
  await writeMemoryData(data);
  return { ok: true, reminders: [] };
}

async function getDueReminders() {
  const data = await readMemoryData();
  const now = Date.now();
  const dueReminders = data.reminders.filter((reminder) => {
    if (reminder.done || !reminder.remindAt) return false;
    const dueAt = new Date(reminder.remindAt).getTime();
    return Number.isFinite(dueAt) && dueAt <= now;
  });

  dueReminders.forEach((reminder) => {
    reminder.done = true;
  });

  if (dueReminders.length) await writeMemoryData(data);
  return { ok: true, reminders: dueReminders };
}

async function addPlanningItem(item = {}) {
  const safeTitle = sanitizeLocalText(item.title);
  if (!safeTitle) return { ok: false, message: "Element de planning vide." };

  const data = await readMemoryData();
  const planningItem = {
    id: createLocalId("planning"),
    title: safeTitle,
    date: normalizeDateKey(item.date),
    time: typeof item.time === "string" && /^\d{2}:\d{2}$/.test(item.time) ? item.time : null,
    type: normalizePlanningType(item.type),
    createdAt: new Date().toISOString()
  };

  data.planning.unshift(planningItem);
  await writeMemoryData(data);
  return { ok: true, item: planningItem, planning: data.planning };
}

async function listPlanning() {
  const data = await readMemoryData();
  return { ok: true, planning: data.planning };
}

async function getTodayPlanning() {
  const data = await readMemoryData();
  const today = getLocalDateKey();
  return { ok: true, planning: data.planning.filter((item) => item.date === today) };
}

async function deletePlanningItem(id) {
  const safeId = sanitizeLocalText(id, 120);
  const data = await readMemoryData();
  const beforeCount = data.planning.length;
  data.planning = data.planning.filter((item) => item.id !== safeId);
  await writeMemoryData(data);
  return { ok: true, deleted: beforeCount - data.planning.length, planning: data.planning };
}

async function clearPlanning() {
  const data = await readMemoryData();
  data.planning = [];
  await writeMemoryData(data);
  return { ok: true, planning: [] };
}

function mergeDailyLog(existingLog, incomingLog) {
  return {
    ...existingLog,
    summary: sanitizeLocalText(incomingLog.summary) || existingLog.summary,
    mood: sanitizeLocalText(incomingLog.mood, 80) || existingLog.mood,
    energy: sanitizeLocalText(incomingLog.energy, 80) || existingLog.energy,
    wins: [...existingLog.wins, ...normalizeTextArray(incomingLog.wins)],
    blockers: [...existingLog.blockers, ...normalizeTextArray(incomingLog.blockers)]
  };
}

async function addDailyLog(log = {}) {
  const data = await readMemoryData();
  const targetDate = normalizeDateKey(log.date);
  const existingLog = data.dailyLogs.find((item) => item.date === targetDate);

  if (existingLog) {
    Object.assign(existingLog, mergeDailyLog(existingLog, log));
    await writeMemoryData(data);
    return { ok: true, log: existingLog, dailyLogs: data.dailyLogs };
  }

  const dailyLog = {
    id: createLocalId("daily"),
    date: targetDate,
    summary: sanitizeLocalText(log.summary),
    mood: sanitizeLocalText(log.mood, 80),
    energy: sanitizeLocalText(log.energy, 80),
    wins: normalizeTextArray(log.wins),
    blockers: normalizeTextArray(log.blockers),
    createdAt: new Date().toISOString()
  };

  data.dailyLogs.unshift(dailyLog);
  await writeMemoryData(data);
  return { ok: true, log: dailyLog, dailyLogs: data.dailyLogs };
}

async function listDailyLogs() {
  const data = await readMemoryData();
  return { ok: true, dailyLogs: data.dailyLogs };
}

async function getTodayDailyLog() {
  const data = await readMemoryData();
  const today = getLocalDateKey();
  return { ok: true, log: data.dailyLogs.find((item) => item.date === today) || null };
}

async function clearDailyLogs() {
  const data = await readMemoryData();
  data.dailyLogs = [];
  await writeMemoryData(data);
  return { ok: true, dailyLogs: [] };
}

async function addFocusSession(session = {}) {
  const data = await readMemoryData();
  const focusSession = {
    id: createLocalId("focus"),
    duration: normalizeDuration(session.duration),
    startedAt: typeof session.startedAt === "string" ? session.startedAt : new Date().toISOString(),
    endedAt: null,
    status: "running"
  };

  data.focusSessions.unshift(focusSession);
  await writeMemoryData(data);
  return { ok: true, session: focusSession, focusSessions: data.focusSessions };
}

async function listFocusSessions() {
  const data = await readMemoryData();
  return { ok: true, focusSessions: data.focusSessions };
}

async function completeFocusSession(id, status = "completed") {
  const safeId = sanitizeLocalText(id, 120);
  const data = await readMemoryData();
  const session = data.focusSessions.find((item) => item.id === safeId);
  if (!session) return { ok: false, message: "Session focus introuvable.", focusSessions: data.focusSessions };

  session.status = status === "cancelled" ? "cancelled" : "completed";
  session.endedAt = new Date().toISOString();
  await writeMemoryData(data);
  return { ok: true, session, focusSessions: data.focusSessions };
}

async function clearFocusSessions() {
  const data = await readMemoryData();
  data.focusSessions = [];
  await writeMemoryData(data);
  return { ok: true, focusSessions: [] };
}

function collectActivityDates(data) {
  const dates = [];
  data.memories.forEach((item) => dates.push(item.updatedAt, item.createdAt));
  data.notes.forEach((item) => dates.push(item.createdAt));
  data.tasks.forEach((item) => dates.push(item.completedAt, item.createdAt));
  data.reminders.forEach((item) => dates.push(item.remindAt, item.createdAt));
  data.planning.forEach((item) => dates.push(item.createdAt));
  data.dailyLogs.forEach((item) => dates.push(item.createdAt));
  data.focusSessions.forEach((item) => dates.push(item.endedAt, item.startedAt));

  return dates
    .filter(Boolean)
    .map((value) => new Date(value))
    .filter((date) => !Number.isNaN(date.getTime()))
    .sort((a, b) => b.getTime() - a.getTime());
}

function calculateAnalyticsSummary(data) {
  const now = Date.now();
  const today = getLocalDateKey();
  const totalTasks = data.tasks.length;
  const completedTasks = data.tasks.filter((task) => task.status === "completed").length;
  const activeTasks = data.tasks.filter((task) => task.status !== "completed").length;
  const activePriorities = data.tasks.filter((task) => task.status !== "completed" && task.priority === "high").length;
  const activeReminders = data.reminders.filter((reminder) => !reminder.done).length;
  const dueReminders = data.reminders.filter((reminder) => {
    if (reminder.done || !reminder.remindAt) return false;
    const dueAt = new Date(reminder.remindAt).getTime();
    return Number.isFinite(dueAt) && dueAt <= now;
  }).length;
  const todayPlanning = data.planning.filter((item) => item.date === today).length;
  const focusMinutes = data.focusSessions
    .filter((session) => session.status === "completed")
    .reduce((total, session) => total + normalizeDuration(session.duration), 0);
  const activityDates = collectActivityDates(data);

  return {
    totalTasks,
    activeTasks,
    completedTasks,
    activePriorities,
    activeReminders,
    dueReminders,
    notes: data.notes.length,
    memories: data.memories.length,
    todayPlanning,
    focusSessions: data.focusSessions.length,
    focusMinutes,
    dailyLogs: data.dailyLogs.length,
    lastActivity: activityDates[0] ? activityDates[0].toISOString() : null
  };
}

function calculateWeeklySummary(data) {
  const completedTasks = data.tasks.filter((task) => task.status === "completed" && isWithinLastDays(task.completedAt, 7));
  const focusSessions = data.focusSessions.filter((session) => isWithinLastDays(session.startedAt, 7));
  const notes = data.notes.filter((note) => isWithinLastDays(note.createdAt, 7));
  const dailyLogs = data.dailyLogs.filter((log) => isWithinLastDays(log.createdAt, 7));
  const remainingPriorities = data.tasks.filter((task) => task.status !== "completed" && task.priority === "high");
  const focusMinutes = focusSessions
    .filter((session) => session.status === "completed")
    .reduce((total, session) => total + normalizeDuration(session.duration), 0);

  return {
    completedTasks: completedTasks.length,
    focusSessions: focusSessions.length,
    focusMinutes,
    notesCreated: notes.length,
    dailyLogs: dailyLogs.length,
    remainingPriorities: remainingPriorities.length
  };
}

function calculateProductivityScore(data) {
  const totalTasks = data.tasks.length;
  const completedTasks = data.tasks.filter((task) => task.status === "completed").length;
  const completedPriorities = data.tasks.filter((task) => task.status === "completed" && task.priority === "high").length;
  const focusCompleted = data.focusSessions.filter((session) => session.status === "completed" && isWithinLastDays(session.startedAt, 7)).length;
  const todayLog = data.dailyLogs.find((log) => log.date === getLocalDateKey());
  const activeReminders = data.reminders.filter((reminder) => !reminder.done);
  const overdueReminders = activeReminders.filter((reminder) => {
    if (!reminder.remindAt) return false;
    const dueAt = new Date(reminder.remindAt).getTime();
    return Number.isFinite(dueAt) && dueAt <= Date.now();
  });

  const taskScore = totalTasks ? Math.min(30, Math.round((completedTasks / totalTasks) * 30)) : 8;
  const priorityScore = Math.min(20, completedPriorities * 10 + (data.tasks.some((task) => task.priority === "high") ? 0 : 6));
  const focusScore = Math.min(20, focusCompleted * 7);
  const logScore = todayLog ? 15 : 0;
  const reminderScore = activeReminders.length ? Math.max(0, 15 - overdueReminders.length * 5) : 12;
  const score = Math.max(0, Math.min(100, taskScore + priorityScore + focusScore + logScore + reminderScore));

  return {
    score,
    message: `Score indicatif : ${score}/100. ${score >= 70 ? "Bonne dynamique, monsieur." : score >= 45 ? "Base correcte, monsieur. Quelques priorites meritent attention." : "Journee a structurer, monsieur. Un focus court peut relancer la dynamique."}`,
    breakdown: {
      tasks: taskScore,
      priorities: priorityScore,
      focus: focusScore,
      dailyLog: logScore,
      reminders: reminderScore
    }
  };
}

async function getAnalyticsSummary() {
  const data = await readMemoryData();
  return { ok: true, summary: calculateAnalyticsSummary(data) };
}

async function getWeeklySummary() {
  const data = await readMemoryData();
  return { ok: true, weekly: calculateWeeklySummary(data) };
}

async function getProductivityScore() {
  const data = await readMemoryData();
  return { ok: true, productivity: calculateProductivityScore(data) };
}

async function getAutomationSettings() {
  const data = await readMemoryData();
  return { ok: true, automations: data.automations };
}

async function updateAutomationSetting(key, value) {
  const safeKey = sanitizeLocalText(key, 80);
  if (!Object.prototype.hasOwnProperty.call(DEFAULT_AUTOMATION_SETTINGS, safeKey)) {
    return { ok: false, message: "Automatisation inconnue." };
  }

  const data = await readMemoryData();
  if (safeKey.startsWith("last")) {
    data.automations[safeKey] = typeof value === "string" && value ? value : null;
  } else {
    data.automations[safeKey] = Boolean(value);
  }

  await writeMemoryData(data);
  return { ok: true, automations: data.automations };
}

async function resetAutomationSettings() {
  const data = await readMemoryData();
  data.automations = { ...DEFAULT_AUTOMATION_SETTINGS };
  await writeMemoryData(data);
  return { ok: true, automations: data.automations };
}

async function getPreferences() {
  const data = await readMemoryData();
  return { ok: true, preferences: data.preferences };
}

async function updatePreference(key, value) {
  const safeKey = sanitizeLocalText(key, 80);
  if (!Object.prototype.hasOwnProperty.call(DEFAULT_PREFERENCES, safeKey)) {
    return { ok: false, message: "Preference inconnue." };
  }

  const data = await readMemoryData();
  const nextPreferences = { ...data.preferences };

  if (safeKey === "activeMode") {
    nextPreferences.activeMode = sanitizeLocalText(value, 30).toLowerCase();
  } else if (safeKey === "theme") {
    nextPreferences.theme = sanitizeLocalText(value, 30).toLowerCase();
  } else {
    nextPreferences[safeKey] = Boolean(value);
  }

  data.preferences = normalizePreferences(nextPreferences);
  await writeMemoryData(data);
  return { ok: true, preferences: data.preferences };
}

async function resetPreferences() {
  const data = await readMemoryData();
  data.preferences = { ...DEFAULT_PREFERENCES };
  await writeMemoryData(data);
  return { ok: true, preferences: data.preferences };
}

function normalizeOllamaMessage(message) {
  return typeof message === "string" ? message.trim().slice(0, 4000) : "";
}

function isMissingOllamaModel(errorText) {
  return /model.*not found|not found.*model|pull/i.test(errorText);
}

async function askJarvisOllama(message) {
  const safeMessage = normalizeOllamaMessage(message);

  if (!safeMessage) {
    return "Demande IA locale vide. Precisez votre question, monsieur.";
  }

  try {
    const localContext = await getLocalContextForAi();
    const systemContent = localContext
      ? `${JARVIS_SYSTEM_PROMPT}\n\n${localContext}`
      : JARVIS_SYSTEM_PROMPT;

    const response = await fetch(OLLAMA_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: OLLAMA_MODEL,
        stream: false,
        messages: [
          {
            role: "system",
            content: systemContent
          },
          {
            role: "user",
            content: safeMessage
          }
        ]
      })
    });

    const responseText = await response.text();
    let payload = null;
    try {
      payload = responseText ? JSON.parse(responseText) : null;
    } catch (_error) {
      payload = null;
    }

    if (!response.ok) {
      const errorText = payload && payload.error ? payload.error : responseText;
      return isMissingOllamaModel(errorText) ? OLLAMA_MODEL_MISSING_MESSAGE : "Erreur IA locale. Ollama n'a pas pu traiter la demande.";
    }

    const answer = payload && payload.message && typeof payload.message.content === "string"
      ? payload.message.content.trim()
      : "";

    return answer || "Ollama a répondu, mais aucun texte exploitable n'a été retourné.";
  } catch (error) {
    const code = error && error.cause && error.cause.code ? error.cause.code : "";
    if (code === "ECONNREFUSED" || code === "ECONNRESET" || code === "ENOTFOUND" || error.name === "TypeError") {
      return OLLAMA_UNAVAILABLE_MESSAGE;
    }

    console.error("Erreur Ollama:", error);
    return "Erreur IA locale. La connexion à Ollama a échoué.";
  }
}

function getOllamaConfig() {
  return {
    ok: true,
    model: OLLAMA_MODEL,
    url: OLLAMA_URL
  };
}

async function getOllamaStatus() {
  try {
    const response = await fetch(OLLAMA_STATUS_URL, {
      method: "GET",
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(5000)
    });

    const responseText = await response.text();
    let payload = null;
    try {
      payload = responseText ? JSON.parse(responseText) : null;
    } catch (_error) {
      payload = null;
    }

    if (!response.ok) {
      const errorText = payload && payload.error ? payload.error : responseText;
      return {
        ok: false,
        message: isMissingOllamaModel(errorText) ? OLLAMA_MODEL_MISSING_MESSAGE : "Ollama indisponible pour le moment."
      };
    }

    const models = payload && Array.isArray(payload.models) ? payload.models : [];
    const modelInstalled = models.some((item) => item && (item.name === OLLAMA_MODEL || item.model === OLLAMA_MODEL));
    if (!modelInstalled) {
      return {
        ok: false,
        model: OLLAMA_MODEL,
        message: OLLAMA_MODEL_MISSING_MESSAGE
      };
    }

    return {
      ok: true,
      model: OLLAMA_MODEL,
      message: "Ollama connecté."
    };
  } catch (error) {
    return {
      ok: false,
      message: OLLAMA_UNAVAILABLE_MESSAGE
    };
  }
}

function getVoiceTranscriptionFailure(command, code, stderr, error) {
  const errorText = String(stderr || "");
  const normalizedError = errorText.toLowerCase();

  if (error && error.code === "ENOENT") {
    return {
      ok: false,
      reason: "python-missing",
      message: VOICE_PYTHON_MISSING_MESSAGE,
      command
    };
  }

  if (normalizedError.includes("missing_dependency") || normalizedError.includes("no module named")) {
    return {
      ok: false,
      reason: "missing-dependency",
      message: VOICE_DEPENDENCIES_MISSING_MESSAGE,
      stderr: errorText,
      command
    };
  }

  if (normalizedError.includes("python was not found") || normalizedError.includes("python est introuvable")) {
    return {
      ok: false,
      reason: "python-missing",
      message: VOICE_PYTHON_MISSING_MESSAGE,
      stderr: errorText,
      command
    };
  }

  if (normalizedError.includes("no_speech")) {
    return {
      ok: false,
      reason: "no-speech",
      message: VOICE_NO_SPEECH_MESSAGE,
      stderr: errorText,
      command
    };
  }

  if (normalizedError.includes("microphone_error")) {
    return {
      ok: false,
      reason: "microphone-error",
      message: "Micro local indisponible. Verifiez le peripherique audio Windows.",
      stderr: errorText,
      command
    };
  }

  return {
    ok: false,
    reason: "transcription-error",
    message: errorText.trim() ? `Erreur transcription vocale : ${errorText.trim()}` : `Erreur transcription vocale. Code ${code}.`,
    stderr: errorText,
    command
  };
}

function runVoiceTranscriptionWith(command) {
  return new Promise((resolve) => {
    let stdout = "";
    let stderr = "";
    let settled = false;
    const child = spawn(command, [VOICE_TRANSCRIBE_SCRIPT], {
      cwd: __dirname,
      windowsHide: true,
      stdio: ["ignore", "pipe", "pipe"]
    });

    const timeout = setTimeout(() => {
      if (settled) return;
      settled = true;
      child.kill();
      resolve({
        ok: false,
        reason: "timeout",
        message: "Transcription vocale trop longue. Reessayez en parlant plus clairement.",
        command
      });
    }, 180000);

    child.stdout.on("data", (chunk) => {
      stdout += chunk.toString("utf8");
    });

    child.stderr.on("data", (chunk) => {
      stderr += chunk.toString("utf8");
    });

    child.on("error", (error) => {
      if (settled) return;
      settled = true;
      clearTimeout(timeout);
      resolve(getVoiceTranscriptionFailure(command, null, stderr, error));
    });

    child.on("close", (code) => {
      if (settled) return;
      settled = true;
      clearTimeout(timeout);
      const text = stdout.trim();

      if (code === 0 && text) {
        resolve({
          ok: true,
          text,
          message: "Transcription terminee.",
          command
        });
        return;
      }

      if (code === 0 && !text) {
        resolve({
          ok: false,
          reason: "no-speech",
          message: VOICE_NO_SPEECH_MESSAGE,
          stderr,
          command
        });
        return;
      }

      resolve(getVoiceTranscriptionFailure(command, code, stderr, null));
    });
  });
}

async function transcribeVoiceLocal() {
  const pythonResult = await runVoiceTranscriptionWith("python");
  if (pythonResult.ok) return pythonResult;

  const shouldTryPy = ["python-missing", "missing-dependency", "transcription-error"].includes(pythonResult.reason);
  if (!shouldTryPy) return pythonResult;

  const pyResult = await runVoiceTranscriptionWith("py");
  if (pyResult.ok) return pyResult;

  if (pythonResult.reason === "missing-dependency" || pyResult.reason === "missing-dependency") {
    return pythonResult.reason === "missing-dependency" ? pythonResult : pyResult;
  }

  if (pythonResult.reason === "python-missing" && pyResult.reason === "python-missing") {
    return pythonResult;
  }

  return pyResult.reason === "python-missing" ? pythonResult : pyResult;
}

function registerAiIpcHandlers() {
  ipcMain.handle("ask-ollama", (_event, message) => askJarvisOllama(message));
  ipcMain.handle("jarvis:get-ollama-config", () => getOllamaConfig());
  ipcMain.handle("jarvis:get-ollama-status", () => getOllamaStatus());
  ipcMain.handle("voice:transcribe", () => transcribeVoiceLocal());
  ipcMain.handle("memory:add", (_event, content, category) => addMemory(content, category));
  ipcMain.handle("memory:list", () => listMemories());
  ipcMain.handle("memory:search", (_event, query) => searchMemory(query));
  ipcMain.handle("memory:delete", (_event, id) => deleteMemory(id));
  ipcMain.handle("memory:clear", () => clearMemory());
  ipcMain.handle("note:add", (_event, content) => addNote(content));
  ipcMain.handle("note:list", () => listNotes());
  ipcMain.handle("note:search", (_event, query) => searchNotes(query));
  ipcMain.handle("note:delete", (_event, id) => deleteNote(id));
  ipcMain.handle("note:clear", () => clearNotes());
  ipcMain.handle("task:add", (_event, title, options) => addTask(title, options));
  ipcMain.handle("task:list", () => listTasks());
  ipcMain.handle("task:complete", (_event, id) => completeTask(id));
  ipcMain.handle("task:delete", (_event, id) => deleteTask(id));
  ipcMain.handle("task:clear", () => clearTasks());
  ipcMain.handle("task:setPriority", (_event, id, priority) => setTaskPriority(id, priority));
  ipcMain.handle("task:today", () => getTodayTasks());
  ipcMain.handle("reminder:add", (_event, title, remindAt) => addReminder(title, remindAt));
  ipcMain.handle("reminder:list", () => listReminders());
  ipcMain.handle("reminder:delete", (_event, id) => deleteReminder(id));
  ipcMain.handle("reminder:clear", () => clearReminders());
  ipcMain.handle("reminder:due", () => getDueReminders());
  ipcMain.handle("planning:add", (_event, item) => addPlanningItem(item));
  ipcMain.handle("planning:list", () => listPlanning());
  ipcMain.handle("planning:today", () => getTodayPlanning());
  ipcMain.handle("planning:delete", (_event, id) => deletePlanningItem(id));
  ipcMain.handle("planning:clear", () => clearPlanning());
  ipcMain.handle("dailyLog:add", (_event, log) => addDailyLog(log));
  ipcMain.handle("dailyLog:list", () => listDailyLogs());
  ipcMain.handle("dailyLog:today", () => getTodayDailyLog());
  ipcMain.handle("dailyLog:clear", () => clearDailyLogs());
  ipcMain.handle("focus:addSession", (_event, session) => addFocusSession(session));
  ipcMain.handle("focus:listSessions", () => listFocusSessions());
  ipcMain.handle("focus:completeSession", (_event, id, status) => completeFocusSession(id, status));
  ipcMain.handle("focus:clearSessions", () => clearFocusSessions());
  ipcMain.handle("analytics:getSummary", () => getAnalyticsSummary());
  ipcMain.handle("analytics:getWeeklySummary", () => getWeeklySummary());
  ipcMain.handle("analytics:getProductivityScore", () => getProductivityScore());
  ipcMain.handle("automation:getSettings", () => getAutomationSettings());
  ipcMain.handle("automation:updateSetting", (_event, key, value) => updateAutomationSetting(key, value));
  ipcMain.handle("automation:resetSettings", () => resetAutomationSettings());
  ipcMain.handle("preferences:get", () => getPreferences());
  ipcMain.handle("preferences:update", (_event, key, value) => updatePreference(key, value));
  ipcMain.handle("preferences:reset", () => resetPreferences());
  ipcMain.handle("bridge:get-status", () => jarvisBridge
    ? jarvisBridge.getStatus()
    : { ok: false, running: false, addresses: [], pairingCode: "", connectedDevices: 0 });
  ipcMain.handle("bridge:rotate-code", () => jarvisBridge
    ? jarvisBridge.rotatePairingCode()
    : { ok: false, running: false, message: "Bridge JARVIS indisponible." });
}

async function startJarvisBridge() {
  jarvisBridge = createJarvisBridge({
    rootDir: __dirname,
    version: app.getVersion(),
    model: OLLAMA_MODEL,
    askAi: askJarvisOllama,
    getOllamaStatus,
    readData: readMemoryData,
    addMemory,
    addNote,
    addTask,
    completeTask,
    addReminder,
    addPlanningItem
  });

  try {
    return await jarvisBridge.start();
  } catch (error) {
    console.error("[JARVIS Bridge] Demarrage impossible:", error);
    return jarvisBridge.getStatus();
  }
}

function registerDesktopIpcHandlers() {
  ipcMain.handle("jarvis:open-calculator", () => openWindowsCalculator());

  ipcMain.handle("jarvis:open-browser", async () => {
    await shell.openExternal("https://www.google.com");
    return { ok: true };
  });

  ipcMain.handle("jarvis:open-url", async (_event, url) => {
    if (!isSafeExternalUrl(url)) {
      return { ok: false, message: "URL non autorisee." };
    }

    await shell.openExternal(url);
    return { ok: true };
  });

  ipcMain.handle("jarvis:open-folder", (_event, folderKey) => openSystemFolder(folderKey));
  ipcMain.handle("jarvis:get-system-info", () => getSimpleSystemInfo());

  ipcMain.handle("jarvis:set-fullscreen", (event, enabled) => {
    const window = getWindowFromEvent(event);
    if (!window) return { ok: false, message: "Fenetre introuvable." };

    window.setFullScreen(Boolean(enabled));
    return { ok: true, fullScreen: window.isFullScreen() };
  });

  ipcMain.handle("jarvis:minimize", (event) => {
    const window = getWindowFromEvent(event);
    if (!window) return { ok: false, message: "Fenetre introuvable." };

    window.minimize();
    return { ok: true };
  });

  ipcMain.handle("jarvis:close-app", (event) => {
    const window = getWindowFromEvent(event);
    if (!window) return { ok: false, message: "Fenetre introuvable." };

    window.close();
    return { ok: true };
  });
}

function createMainWindow() {
  // Fenetre desktop securisee : pas de Node.js direct dans l'interface.
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 820,
    minWidth: 960,
    minHeight: 680,
    title: APP_TITLE,
    backgroundColor: "#020817",
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
      webSecurity: true
    }
  });

  mainWindow.loadFile(path.join(__dirname, "index.html"));

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (isSafeExternalUrl(url)) {
      shell.openExternal(url);
    }

    return { action: "deny" };
  });

  mainWindow.webContents.on("will-navigate", (event, url) => {
    const currentUrl = mainWindow.webContents.getURL();

    if (url === currentUrl) {
      return;
    }

    event.preventDefault();

    if (isSafeExternalUrl(url)) {
      shell.openExternal(url);
    }
  });
}

app.whenReady().then(async () => {
  configurePermissions();
  registerAiIpcHandlers();
  registerDesktopIpcHandlers();
  await startJarvisBridge();
  createMainWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    }
  });
});

app.on("before-quit", () => {
  if (jarvisBridge) {
    jarvisBridge.stop().catch((error) => console.error("[JARVIS Bridge] Arret incomplet:", error));
  }
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
