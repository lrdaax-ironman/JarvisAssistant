const { contextBridge, ipcRenderer } = require("electron");

const allowedFolders = ["documents", "desktop"];

function subscribeToMain(channel, callback) {
  if (typeof callback !== "function") return () => {};
  const listener = (_event, payload) => callback(payload);
  ipcRenderer.on(channel, listener);
  return () => ipcRenderer.removeListener(channel, listener);
}

// Pont minimal entre Electron et l'interface, sans exposer Node.js.
contextBridge.exposeInMainWorld("jarvisDesktop", {
  isDesktop: true,
  platform: process.platform,
  versions: {
    chrome: process.versions.chrome,
    electron: process.versions.electron
  },
  openCalculator: () => ipcRenderer.invoke("jarvis:open-calculator"),
  openBrowser: () => ipcRenderer.invoke("jarvis:open-browser"),
  openUrl: (url) => {
    try {
      const parsedUrl = new URL(url);
      if (parsedUrl.protocol !== "https:" && parsedUrl.protocol !== "http:") {
        return Promise.resolve({ ok: false, message: "URL non autorisee." });
      }

      return ipcRenderer.invoke("jarvis:open-url", parsedUrl.toString());
    } catch (_error) {
      return Promise.resolve({ ok: false, message: "URL invalide." });
    }
  },
  openFolder: (folderKey) => {
    if (!allowedFolders.includes(folderKey)) {
      return Promise.resolve({ ok: false, message: "Dossier non autorise." });
    }

    return ipcRenderer.invoke("jarvis:open-folder", folderKey);
  },
  getSystemInfo: () => ipcRenderer.invoke("jarvis:get-system-info"),
  setFullScreen: (enabled) => ipcRenderer.invoke("jarvis:set-fullscreen", Boolean(enabled)),
  minimize: () => ipcRenderer.invoke("jarvis:minimize"),
  hideToTray: () => ipcRenderer.invoke("jarvis:hide-to-tray"),
  closeApp: () => ipcRenderer.invoke("jarvis:close-app")
});

contextBridge.exposeInMainWorld("jarvisAPI", {
  askOllama: (message) => {
    if (typeof message !== "string") {
      return Promise.resolve("Demande IA locale invalide.");
    }

    return ipcRenderer.invoke("ask-ollama", message);
  },
  getOllamaConfig: () => ipcRenderer.invoke("jarvis:get-ollama-config"),
  getOllamaStatus: () => ipcRenderer.invoke("jarvis:get-ollama-status"),
  transcribeVoice: () => ipcRenderer.invoke("voice:transcribe"),
  addMemory: (content) => ipcRenderer.invoke("memory:add", String(content || "")),
  listMemories: () => ipcRenderer.invoke("memory:list"),
  searchMemory: (query) => ipcRenderer.invoke("memory:search", String(query || "")),
  deleteMemory: (id) => ipcRenderer.invoke("memory:delete", String(id || "")),
  clearMemory: () => ipcRenderer.invoke("memory:clear"),
  addNote: (content) => ipcRenderer.invoke("note:add", String(content || "")),
  listNotes: () => ipcRenderer.invoke("note:list"),
  searchNotes: (query) => ipcRenderer.invoke("note:search", String(query || "")),
  deleteNote: (id) => ipcRenderer.invoke("note:delete", String(id || "")),
  clearNotes: () => ipcRenderer.invoke("note:clear"),
  addTask: (title, options = {}) => ipcRenderer.invoke("task:add", String(title || ""), {
    priority: String((options && options.priority) || "normal"),
    dueAt: options && typeof options.dueAt === "string" ? options.dueAt : null
  }),
  listTasks: () => ipcRenderer.invoke("task:list"),
  completeTask: (id) => ipcRenderer.invoke("task:complete", String(id || "")),
  deleteTask: (id) => ipcRenderer.invoke("task:delete", String(id || "")),
  clearTasks: () => ipcRenderer.invoke("task:clear"),
  setTaskPriority: (id, priority) => ipcRenderer.invoke("task:setPriority", String(id || ""), String(priority || "normal")),
  getTodayTasks: () => ipcRenderer.invoke("task:today"),
  addReminder: (title, remindAt) => ipcRenderer.invoke("reminder:add", String(title || ""), typeof remindAt === "string" ? remindAt : null),
  listReminders: () => ipcRenderer.invoke("reminder:list"),
  deleteReminder: (id) => ipcRenderer.invoke("reminder:delete", String(id || "")),
  clearReminders: () => ipcRenderer.invoke("reminder:clear"),
  getDueReminders: () => ipcRenderer.invoke("reminder:due"),
  addPlanningItem: (item = {}) => ipcRenderer.invoke("planning:add", {
    title: String((item && item.title) || ""),
    date: String((item && item.date) || ""),
    time: item && typeof item.time === "string" ? item.time : null,
    type: String((item && item.type) || "other")
  }),
  listPlanning: () => ipcRenderer.invoke("planning:list"),
  getTodayPlanning: () => ipcRenderer.invoke("planning:today"),
  deletePlanningItem: (id) => ipcRenderer.invoke("planning:delete", String(id || "")),
  clearPlanning: () => ipcRenderer.invoke("planning:clear"),
  addDailyLog: (log = {}) => ipcRenderer.invoke("dailyLog:add", {
    date: String((log && log.date) || ""),
    summary: String((log && log.summary) || ""),
    mood: String((log && log.mood) || ""),
    energy: String((log && log.energy) || ""),
    wins: Array.isArray(log && log.wins) ? log.wins.map((item) => String(item || "")) : [],
    blockers: Array.isArray(log && log.blockers) ? log.blockers.map((item) => String(item || "")) : []
  }),
  listDailyLogs: () => ipcRenderer.invoke("dailyLog:list"),
  getTodayDailyLog: () => ipcRenderer.invoke("dailyLog:today"),
  clearDailyLogs: () => ipcRenderer.invoke("dailyLog:clear"),
  addFocusSession: (session = {}) => ipcRenderer.invoke("focus:addSession", {
    duration: Number((session && session.duration) || 25),
    startedAt: String((session && session.startedAt) || "")
  }),
  listFocusSessions: () => ipcRenderer.invoke("focus:listSessions"),
  completeFocusSession: (id, status) => ipcRenderer.invoke("focus:completeSession", String(id || ""), String(status || "completed")),
  clearFocusSessions: () => ipcRenderer.invoke("focus:clearSessions"),
  getAnalyticsSummary: () => ipcRenderer.invoke("analytics:getSummary"),
  getWeeklySummary: () => ipcRenderer.invoke("analytics:getWeeklySummary"),
  getProductivityScore: () => ipcRenderer.invoke("analytics:getProductivityScore"),
  getAutomationSettings: () => ipcRenderer.invoke("automation:getSettings"),
  updateAutomationSetting: (key, value) => ipcRenderer.invoke("automation:updateSetting", String(key || ""), value),
  resetAutomationSettings: () => ipcRenderer.invoke("automation:resetSettings"),
  getPreferences: () => ipcRenderer.invoke("preferences:get"),
  updatePreference: (key, value) => ipcRenderer.invoke("preferences:update", String(key || ""), value),
  resetPreferences: () => ipcRenderer.invoke("preferences:reset"),
  listNotifications: (limit = 100) => ipcRenderer.invoke("notification:list", Number(limit) || 100),
  markNotificationRead: (id) => ipcRenderer.invoke("notification:mark-read", String(id || "")),
  markAllNotificationsRead: () => ipcRenderer.invoke("notification:mark-all-read"),
  clearNotifications: () => ipcRenderer.invoke("notification:clear"),
  completeReminderFromNotification: (reminderId, notificationId) => ipcRenderer.invoke(
    "notification:complete-reminder",
    String(reminderId || ""),
    String(notificationId || "")
  ),
  snoozeReminderFromNotification: (reminderId, notificationId) => ipcRenderer.invoke(
    "notification:snooze-reminder",
    String(reminderId || ""),
    String(notificationId || "")
  ),
  getProactiveStatus: () => ipcRenderer.invoke("proactive:get-status"),
  updateProactiveSetting: (key, value) => ipcRenderer.invoke("proactive:update-setting", String(key || ""), Boolean(value)),
  onNotificationsChanged: (callback) => subscribeToMain("jarvis:notifications-changed", callback),
  onOrganizationChanged: (callback) => subscribeToMain("jarvis:organization-changed", callback),
  onNavigateRequest: (callback) => subscribeToMain("jarvis:navigate", callback),
  getBackupStatus: () => ipcRenderer.invoke("backup:get-status"),
  createBackup: (label = "manual") => ipcRenderer.invoke("backup:create", String(label || "manual")),
  exportBackup: () => ipcRenderer.invoke("backup:export"),
  importBackup: () => ipcRenderer.invoke("backup:import"),
  diagnoseStorage: () => ipcRenderer.invoke("storage:diagnose"),
  getBridgeStatus: () => ipcRenderer.invoke("bridge:get-status"),
  rotateBridgeCode: () => ipcRenderer.invoke("bridge:rotate-code"),
  getBridgeQrCode: () => ipcRenderer.invoke("bridge:get-qr"),
  revokeBridgeDevice: (deviceId) => ipcRenderer.invoke("bridge:revoke-device", String(deviceId || "")),
  getAppInfo: () => ipcRenderer.invoke("jarvis:get-app-info")
});
