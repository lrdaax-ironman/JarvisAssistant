const $ = (id) => document.getElementById(id);

const app = $("app");
const input = $("command-input");
const commandSearch = $("command-search");
const sendBtn = $("send-btn");
const voiceBtn = $("voice-btn");
const responseBox = $("assistant-response");
const historyList = $("history-list");
const statusText = $("status");
const core = $("core");
const coreLabel = $("core-label");
const clearHistoryBtn = $("clear-history-btn");
const welcomeSequence = $("welcome-sequence");
const welcomeMessage = $("welcome-message");
const mobileModeBadge = $("mobile-mode-badge");
const mobileMenuToggle = $("mobile-menu-toggle");
const mobileNavigation = $("mobile-navigation");
const pwaState = $("pwa-state");
const pwaDetail = $("pwa-detail");
const pwaInstallableState = $("pwa-installable-state");
const installPwaBtn = $("install-pwa-btn");
const bridgeQuickState = $("bridge-quick-state");
const bridgeQuickAddress = $("bridge-quick-address");
const bridgeQuickDevices = $("bridge-quick-devices");
const bridgeOnboarding = $("bridge-onboarding");
const bridgeOnboardingState = $("bridge-onboarding-state");
const bridgeOnboardingDevices = $("bridge-onboarding-devices");
const bridgeOnboardingAddress = $("bridge-onboarding-address");
const bridgeOnboardingCode = $("bridge-onboarding-code");
const bridgeCopyAddressBtn = $("bridge-copy-address");
const bridgeRevealCodeBtn = $("bridge-reveal-code");
const bridgeRefreshOnboardingBtn = $("bridge-refresh-onboarding");
const bridgeRotateOnboardingBtn = $("bridge-rotate-onboarding");
const bridgeOnboardingQr = $("bridge-onboarding-qr");
const bridgeQrPlaceholder = $("bridge-qr-placeholder");
const bridgeDeviceList = $("bridge-device-list");
const backupHealthBadge = $("backup-health-badge");
const backupStorageHealth = $("backup-storage-health");
const backupLatestDate = $("backup-latest-date");
const backupLatestFile = $("backup-latest-file");
const backupCount = $("backup-count");
const backupDataCount = $("backup-data-count");
const backupCenterMessage = $("backup-center-message");
const createBackupBtn = $("create-backup-btn");
const exportBackupBtn = $("export-backup-btn");
const importBackupBtn = $("import-backup-btn");
const diagnoseStorageBtn = $("diagnose-storage-btn");
const proactiveModeBadge = $("proactive-mode-badge");
const notificationNavCount = $("notification-nav-count");
const commandStatusNotifications = $("command-status-notifications");
const commandStatusBackground = $("command-status-background");
const notificationCenterBadge = $("notification-center-badge");
const notificationUnreadCount = $("notification-unread-count");
const notificationActiveCount = $("notification-active-count");
const notificationWindowsState = $("notification-windows-state");
const notificationWindowsDetail = $("notification-windows-detail");
const notificationStartupState = $("notification-startup-state");
const notificationStartupDetail = $("notification-startup-detail");
const notificationList = $("notification-list");
const toggleWindowsNotificationsBtn = $("toggle-windows-notifications-btn");
const toggleStartupBtn = $("toggle-startup-btn");
const toggleCloseToTrayBtn = $("toggle-close-to-tray-btn");
const markNotificationsReadBtn = $("mark-notifications-read-btn");
const clearNotificationsBtn = $("clear-notifications-btn");

const currentTime = $("current-time");
const currentDate = $("current-date");
const systemState = $("system-state");
const systemDetail = $("system-detail");
const voiceState = $("voice-state");
const voiceDetail = $("voice-detail");
const microState = $("micro-state");
const microDetail = $("micro-detail");
const microAccess = $("micro-access");
const speechRecognitionState = $("speech-recognition-state");
const speechRecognitionDetail = $("speech-recognition-detail");
const voiceErrorState = $("voice-error-state");
const focusState = $("focus-state");
const focusDetail = $("focus-detail");
const aiState = $("ai-state");
const aiDetail = $("ai-detail");
const voiceSelect = $("voice-select");
const voiceName = $("voice-name");
const voiceSettingsSummary = $("voice-settings-summary");
const speechRate = $("speech-rate");
const speechRateValue = $("speech-rate-value");
const speechPitch = $("speech-pitch");
const speechPitchValue = $("speech-pitch-value");
const speechVolume = $("speech-volume");
const speechVolumeValue = $("speech-volume-value");
const settingsPanel = $("settings-panel");
const settingsStatus = $("settings-status");
const saveSettingsBtn = $("save-settings-btn");
const resetSettingsBtn = $("reset-settings-btn");
const workModeBadge = $("work-mode-badge");
const activeModuleBadge = $("active-module-badge");
const aiModeBadge = $("ai-mode-badge");
const memoryModeBadge = $("memory-mode-badge");
const organizationModeBadge = $("organization-mode-badge");
const modulesPanel = $("modules-panel");
const moduleSummary = $("module-summary");
const memoryPanel = $("memory-panel");
const memoryCount = $("memory-count");
const notesCount = $("notes-count");
const latestMemory = $("latest-memory");
const showMemoryBtn = $("show-memory-btn");
const clearMemoryBtn = $("clear-memory-btn");
const showNotesBtn = $("show-notes-btn");
const clearNotesBtn = $("clear-notes-btn");
const organizationPanel = $("organization-panel");
const taskCount = $("task-count");
const priorityCount = $("priority-count");
const reminderCount = $("reminder-count");
const latestNoteOrg = $("latest-note-org");
const showTasksBtn = $("show-tasks-btn");
const showPrioritiesBtn = $("show-priorities-btn");
const showRemindersBtn = $("show-reminders-btn");
const todayBtn = $("today-btn");
const briefingModeBadge = $("briefing-mode-badge");
const briefingDate = $("briefing-date");
const briefingPriority = $("briefing-priority");
const briefingTaskCount = $("briefing-task-count");
const briefingReminderCount = $("briefing-reminder-count");
const briefingNextPlanning = $("briefing-next-planning");
const briefingFocus = $("briefing-focus");
const bilanSummary = $("bilan-summary");
const bilanWins = $("bilan-wins");
const bilanBlockers = $("bilan-blockers");
const showBilanBtn = $("show-bilan-btn");
const eveningRoutineBtn = $("evening-routine-btn");
const analyticsModeBadge = $("analytics-mode-badge");
const analyticsTotalTasks = $("analytics-total-tasks");
const analyticsPriorities = $("analytics-priorities");
const analyticsReminders = $("analytics-reminders");
const analyticsFocus = $("analytics-focus");
const analyticsNotes = $("analytics-notes");
const analyticsPlanning = $("analytics-planning");
const analyticsScore = $("analytics-score");
const analyticsScoreRing = $("analytics-score-ring");
const analyticsScoreLabel = $("analytics-score-label");
const analyticsLastActivity = $("analytics-last-activity");
const weeklyCompletedTasks = $("weekly-completed-tasks");
const weeklyFocusSessions = $("weekly-focus-sessions");
const weeklyFocusMinutes = $("weekly-focus-minutes");
const weeklyNotes = $("weekly-notes");
const weeklyLogs = $("weekly-logs");
const weeklyPriorities = $("weekly-priorities");
const showDashboardBtn = $("show-dashboard-btn");
const showWeeklyBtn = $("show-weekly-btn");
const automationModeBadge = $("automation-mode-badge");
const automationStartupStatus = $("automation-startup-status");
const automationWorkStatus = $("automation-work-status");
const automationRemindersStatus = $("automation-reminders-status");
const automationEveningStatus = $("automation-evening-status");
const automationFocusStatus = $("automation-focus-status");
const automationSummary = $("automation-summary");
const resetAutomationsBtn = $("reset-automations-btn");
const activeModeLabel = $("active-mode-label");
const commandStatusVoice = $("command-status-voice");
const commandStatusMemory = $("command-status-memory");
const commandStatusTasks = $("command-status-tasks");
const commandStatusReminders = $("command-status-reminders");
const commandStatusAutomations = $("command-status-automations");
const commandStatusActivity = $("command-status-activity");
const commandCenterTaskCount = $("command-center-task-count");
const commandCenterReminderCount = $("command-center-reminder-count");
const commandCenterPlanningCount = $("command-center-planning-count");
const commandCenterMemoryCount = $("command-center-memory-count");
const commandCenterNoteCount = $("command-center-note-count");
const commandCenterVoiceSpeed = $("command-center-voice-speed");
const commandCenterVoicePitch = $("command-center-voice-pitch");
const commandCenterVoiceVolume = $("command-center-voice-volume");
const commandCenterAutomationState = $("command-center-automation-state");
const commandCenterStartupAutomation = $("command-center-startup-automation");
const commandCenterWorkAutomation = $("command-center-work-automation");
const commandCenterReminderAutomation = $("command-center-reminder-automation");
const commandCenterEveningAutomation = $("command-center-evening-automation");
const commandCenterFocusAutomation = $("command-center-focus-automation");
const desktopApi = window.jarvisDesktop || null;
const aiApi = window.jarvisAPI || null;

const moduleCards = [...document.querySelectorAll("[data-module-card]")];
const profileCards = [...document.querySelectorAll("[data-mode-card]")];
const moduleStatusElements = {
  work: $("module-work-status"),
  sport: $("module-sport-status"),
  watch: $("module-watch-status"),
  finance: $("module-finance-status"),
  routines: $("module-routines-status"),
  apps: $("module-apps-status")
};

const metricElements = {
  cpu: { bar: $("cpu-bar"), value: $("cpu-value") },
  memory: { bar: $("memory-bar"), value: $("memory-value") },
  network: { value: $("network-value") }
};

const SETTINGS_STORAGE_KEY = "jarvisAssistant.settings.v2";
const HISTORY_STORAGE_KEY = "jarvisAssistant.history.v2";
const HISTORY_LIMIT = 20;
const LOCAL_AI_MODEL = "llama3.2:3b";
const APP_VERSION = "V4.6.2";
const DEFAULT_SETTINGS = {
  voiceName: "",
  voiceLang: "",
  speechRate: 1,
  speechPitch: 0.9,
  speechVolume: 1,
  preferences: { workMode: false }
};
const MODULE_LABELS = {
  work: "Travail",
  sport: "Sport",
  watch: "Veille IA",
  finance: "Finance",
  routines: "Routines",
  apps: "Apps rapides"
};
const QUICK_LINKS = {
  google: "https://www.google.com",
  youtube: "https://www.youtube.com",
  github: "https://github.com/lrdaax-ironman/JarvisAssistant",
  calendar: "https://calendar.google.com"
};
const DEFAULT_INTERFACE_PREFERENCES = {
  activeMode: "standard",
  theme: "cyan",
  animations: true,
  compactMode: false,
  reducedMotion: false
};
const MODE_LABELS = {
  standard: "Standard",
  work: "Travail",
  focus: "Focus",
  night: "Nuit",
  sport: "Sport",
  ai: "IA",
  hud: "Full HUD"
};
const MODE_RESPONSES = {
  standard: "Mode standard active monsieur.",
  work: "Mode travail active. Environnement optimise pour la productivite.",
  focus: "Mode focus active. Je reduis les distractions.",
  night: "Mode nuit active. Luminosite reduite.",
  sport: "Mode sport active. Preparation de l'espace entrainement.",
  ai: "Mode IA active. Je mets l'intelligence locale au premier plan.",
  hud: "Mode Full HUD active."
};
const MODE_CLASSES = ["mode-standard", "mode-work", "mode-focus", "mode-night", "mode-sport", "mode-ai", "mode-hud"];
const THEME_CLASSES = ["theme-cyan", "theme-blue", "theme-green", "theme-violet"];
const availableCommands = [
  "aide",
  "heure",
  "date",
  "mode analyse",
  "ouvre google",
  "ouvrir google",
  "clear",
  "presentation",
  "statut",
  "veille",
  "focus",
  "stop",
  "reset",
  "voix",
  "change voix",
  "plus lentement",
  "plus vite",
  "voix grave",
  "voix normale",
  "ouvre calculatrice",
  "ouvre navigateur",
  "ouvre documents",
  "ouvrir documents",
  "ouvre bureau",
  "ouvrir bureau",
  "infos systeme",
  "plein ecran",
  "fenetre",
  "minimise",
  "ferme jarvis",
  "bonjour jarvis",
  "routine du matin",
  "routine matin",
  "mode travail",
  "parametres",
  "sauvegarde",
  "reset parametres",
  "modules",
  "accueil",
  "module travail",
  "routine travail",
  "ouvrir outils travail",
  "module sport",
  "seance du jour",
  "timer repos",
  "objectif physique",
  "module veille",
  "veille ia",
  "idee linkedin",
  "tendance du jour",
  "module finance",
  "budget",
  "epargne",
  "investissement",
  "module routines",
  "routine soir",
  "check journee",
  "mode focus",
  "module apps",
  "ouvrir youtube",
  "ouvrir github",
  "ouvrir calendrier",
  "mode ia",
  "test ia",
  "stop ia",
  "aide ia",
  "modele ia",
  "modèle ia",
  "ollama statut",
  "souviens-toi que",
  "souviens toi que",
  "note",
  "affiche memoire",
  "affiche mémoire",
  "cherche memoire",
  "cherche mémoire",
  "qu'est-ce que tu sais sur moi",
  "qu’est-ce que tu sais sur moi",
  "oublie",
  "vide memoire",
  "vide mémoire",
  "affiche notes",
  "vide notes",
  "cherche note",
  "supprime note",
  "ajoute tache",
  "ajoute tâche",
  "mes taches",
  "mes tâches",
  "taches du jour",
  "tâches du jour",
  "termine tache",
  "termine tâche",
  "supprime tache",
  "supprime tâche",
  "vide taches",
  "vide tâches",
  "priorite",
  "priorité",
  "mes priorites",
  "mes priorités",
  "rappelle-moi",
  "rappel dans",
  "mes rappels",
  "supprime rappel",
  "vide rappels",
  "aujourd'hui",
  "ajoute planning",
  "planning",
  "planning du jour",
  "vide planning",
  "bilan journee",
  "resume journee",
  "victoire",
  "blocage",
  "focus 25",
  "focus 50",
  "stop focus",
  "sessions focus",
  "plan d'action",
  "organise ma journee",
  "aide-moi a prioriser",
  "que dois-je faire maintenant",
  "dashboard",
  "mes stats",
  "score productivite",
  "resume semaine",
  "progression",
  "analyse journee",
  "analyse mes stats",
  "comment je peux m'ameliorer",
  "que dois-je prioriser",
  "automatisations",
  "active briefing demarrage",
  "desactive briefing demarrage",
  "active automatisation travail",
  "desactive automatisation travail",
  "active rappels automatiques",
  "desactive rappels automatiques",
  "active routine soir automatique",
  "desactive routine soir automatique",
  "active focus automatique",
  "desactive focus automatique",
  "reset automatisations",
  "lance briefing",
  "lance routine soir",
  "que dois-je automatiser",
  "optimise ma journee",
  "automatise ma routine",
  "comment mieux organiser jarvis",
  "centre de commandes",
  "ouvre cockpit",
  "organisation",
  "memoire",
  "statut ia",
  "tester ia",
  "changer modele ia",
  "tester voix",
  "voix suivante",
  "reset voix",
  "parametres voix",
  "ouvre module travail",
  "ouvre module sport",
  "ouvre module veille",
  "ouvre module finance",
  "ouvre module routines",
  "ouvre module apps",
  "ouvre organisation",
  "voir taches",
  "voir priorites",
  "voir rappels",
  "voir planning",
  "ouvre automatisations",
  "active toutes les automatisations",
  "desactive toutes les automatisations",
  "ouvre memoire",
  "resume memoire",
  "raccourcis desktop",
  "etat systeme",
  "diagnostic jarvis",
  "scan systeme",
  "sante jarvis",
  "parametres avances",
  "reset jarvis",
  "vider historique",
  "vider toutes les donnees",
  "confirmer reset total",
  "mode standard",
  "mode actuel",
  "reset mode",
  "mode nuit",
  "mode sport",
  "mode hud",
  "full hud",
  "test micro",
  "statut micro",
  "aide vocale",
  "redemarre ecoute",
  "version mobile",
  "mode mobile",
  "installer jarvis",
  "statut web",
  "deploiement",
  "debug mobile",
  "rafraichir mobile",
  "bridge statut",
  "adresse bridge",
  "code bridge",
  "nouveau code bridge",
  "aide bridge",
  "sauvegarde jarvis",
  "centre sauvegarde",
  "exporte sauvegarde",
  "importe sauvegarde",
  "diagnostic stockage",
  "a propos jarvis",
  "centre notifications",
  "mes notifications",
  "statut proactif",
  "active notifications",
  "desactive notifications",
  "lancement automatique",
  "desactive lancement automatique",
  "mode arriere-plan",
  "desactive mode arriere-plan",
  "marque notifications lues",
  "fonctionnalites mobile",
  "fonctionnalites desktop",
  "reduis animations",
  "active animations",
  "theme cyan",
  "theme bleu",
  "theme vert",
  "theme violet",
  "que peux-tu faire",
  "aide-moi a utiliser jarvis",
  "explique mes modules",
  "optimise jarvis",
  "diagnostic intelligent",
  "aujourd’hui"
];

let isListening = false;
let activeRecognition = null;
let isLocalTranscribing = false;
let microphoneStatus = "unknown";
let speechRecognitionStatus = "idle";
let lastVoiceError = "";
let deferredInstallPrompt = null;
let isMobileModeActive = false;
let speechToken = 0;
let analysisTimers = [];
let veilleTimers = [];
let focusInterval = null;
let focusEndsAt = 0;
let restTimerInterval = null;
let restEndsAt = 0;
let availableVoices = [];
let selectedVoiceIndex = 0;
let currentSpeechRate = 1;
let currentSpeechPitch = 0.9;
let currentSpeechVolume = 1;
let voiceProfileInitialized = false;
let preferredVoiceName = "";
let preferredVoiceLang = "";
let historyEntries = [];
let isWorkMode = false;
let isAiFallbackEnabled = true;
let isAiThinking = false;
let activeModuleKey = "";
let memoryEntries = [];
let noteEntries = [];
let taskEntries = [];
let reminderEntries = [];
let planningEntries = [];
let dailyLogEntries = [];
let focusSessionEntries = [];
let activeFocusSessionId = "";
let analyticsSummary = null;
let weeklySummary = null;
let productivityScore = null;
let activeCommandCategory = "ai";
let interfacePreferences = { ...DEFAULT_INTERFACE_PREFERENCES };
let notificationEntries = [];
let proactiveStatus = {
  backgroundActive: false,
  closeToTray: true,
  notificationsEnabled: true,
  notificationsSupported: false,
  launchAtStartup: false,
  launchAtStartupActive: false,
  packaged: false,
  snoozeMinutes: 10
};
let automationSettings = {
  startupBriefing: false,
  workModeAutomation: false,
  automaticReminders: true,
  eveningRoutine: false,
  focusAutomation: true,
  lastStartupBriefingDate: null,
  lastEveningRoutineDate: null
};
let pendingTotalReset = false;

function normalizeCommand(command) {
  return command
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ");
}

function clampNumber(value, min, max, fallback) {
  const number = Number(value);
  if (!Number.isFinite(number)) return fallback;
  return Math.max(min, Math.min(max, number));
}

function readJsonStorage(key, fallback) {
  try {
    const storedValue = window.localStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : fallback;
  } catch (_error) {
    return fallback;
  }
}

function writeJsonStorage(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (_error) {
    return false;
  }
}

function setSettingsStatus(message) {
  if (settingsStatus) settingsStatus.textContent = message;
}

function safeBindElement(element, eventName, handler, options) {
  if (!element || typeof element.addEventListener !== "function") return false;
  element.addEventListener(eventName, handler, options);
  return true;
}

function safeBindButton(id, handler) {
  return safeBindElement(document.getElementById(id), "click", handler);
}

function getDesktopApi() {
  return isDesktopElectron() && desktopApi && desktopApi.isDesktop ? desktopApi : null;
}

function isDesktopElectron() {
  return Boolean(desktopApi && desktopApi.isDesktop);
}

function isMobileViewport() {
  return window.innerWidth <= 768;
}

function isMobileUserAgent() {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(window.navigator.userAgent || "");
}

function isMobileExperience() {
  return isMobileViewport() || isMobileUserAgent();
}

function isPwaStandalone() {
  return window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;
}

function setPwaStatus(state, detail = "", installable = "") {
  if (pwaState) pwaState.textContent = state;
  if (pwaDetail) pwaDetail.textContent = detail;
  if (pwaInstallableState) pwaInstallableState.textContent = installable;
}

function closeMobileMenu() {
  if (app) app.classList.remove("mobile-nav-open");
  if (document.body) document.body.classList.remove("mobile-nav-open");
  if (mobileMenuToggle) mobileMenuToggle.setAttribute("aria-expanded", "false");
}

function toggleMobileMenu() {
  const nextOpen = !(app && app.classList.contains("mobile-nav-open"));
  if (app) app.classList.toggle("mobile-nav-open", nextOpen);
  if (document.body) document.body.classList.toggle("mobile-nav-open", nextOpen);
  if (mobileMenuToggle) mobileMenuToggle.setAttribute("aria-expanded", String(nextOpen));
}

function applyMobileMode() {
  isMobileModeActive = isMobileExperience();
  if (app) app.classList.toggle("mobile-mode", isMobileModeActive);
  if (document.body) document.body.classList.toggle("mobile-mode", isMobileModeActive);
  if (mobileModeBadge) mobileModeBadge.hidden = !isMobileModeActive;
  if (!isMobileModeActive) closeMobileMenu();

  const modeText = isMobileModeActive ? "Mode mobile actif" : "Mode desktop";
  const installText = isPwaStandalone()
    ? "Installee"
    : deferredInstallPrompt
      ? "Installable"
      : "Ajouter a l'ecran d'accueil";
  setPwaStatus("PWA prete", modeText, installText);
  if (installPwaBtn) installPwaBtn.hidden = !deferredInstallPrompt || isPwaStandalone();
}

function updateMobileMode() {
  applyMobileMode();
}

function isCssLoaded() {
  const styleLink = document.querySelector('link[rel="stylesheet"][href*="style.css"]');
  if (!styleLink) return false;
  if (!app) return true;
  const computed = window.getComputedStyle(app);
  return computed.display === "grid" || computed.display === "block";
}

function getMobileDebugMessage() {
  const buttonStatus = [
    `Envoyer=${Boolean(sendBtn) ? "oui" : "non"}`,
    `Micro=${Boolean(voiceBtn) ? "oui" : "non"}`,
    `Menu=${Boolean(mobileMenuToggle) ? "oui" : "non"}`,
    `Installer=${Boolean(installPwaBtn) ? "oui" : "non"}`
  ].join(", ");

  return [
    "Diagnostic mobile JARVIS.",
    `Largeur ecran : ${window.innerWidth}px.`,
    `Mode mobile actif : ${isMobileModeActive ? "oui" : "non"}.`,
    `PWA detectee : ${isPwaStandalone() ? "oui" : "non"}.`,
    `window.jarvisAPI disponible : ${window.jarvisAPI ? "oui" : "non"}.`,
    `Service worker actif : ${navigator.serviceWorker && navigator.serviceWorker.controller ? "oui" : "non"}.`,
    `Boutons principaux : ${buttonStatus}.`,
    `CSS charge : ${isCssLoaded() ? "oui" : "non"}.`
  ].join("\n");
}

function refreshMobileInterface() {
  applyMobileMode();
  closeMobileMenu();
  updateMobileMode();
  return "Actualisation de l'interface mobile.";
}

async function registerJarvisServiceWorker() {
  if (!("serviceWorker" in navigator)) {
    setPwaStatus("PWA limitee", "Service worker indisponible", "Navigateur incompatible");
    return;
  }

  if (!["http:", "https:"].includes(window.location.protocol)) {
    setPwaStatus("PWA prete", "Service worker actif en version web", "Electron desktop");
    return;
  }

  try {
    await navigator.serviceWorker.register("service-worker.js");
    updateMobileMode();
  } catch (error) {
    console.error("Service worker JARVIS indisponible:", error);
    setPwaStatus("PWA limitee", "Service worker non enregistre", "Mode en ligne uniquement");
  }
}

async function requestPwaInstall() {
  if (!deferredInstallPrompt) {
    return "Sur mobile, utilisez le bouton Installer JARVIS ou l'option Ajouter a l'ecran d'accueil.";
  }

  deferredInstallPrompt.prompt();
  const choice = await deferredInstallPrompt.userChoice;
  deferredInstallPrompt = null;
  updateMobileMode();

  return choice && choice.outcome === "accepted"
    ? "Installation de JARVIS lancee."
    : "Installation de JARVIS annulee. Vous pourrez reessayer depuis le navigateur.";
}

function getMobileVersionMessage() {
  return [
    `Version mobile ${APP_VERSION} : JARVIS peut etre ouvert dans un navigateur mobile et ajoute a l'ecran d'accueil.`,
    `Mode mobile : ${isMobileModeActive ? "actif" : "inactif"}.`,
    `PWA : ${isPwaStandalone() ? "installee" : deferredInstallPrompt ? "installable" : "prete, selon le navigateur"}.`,
    "Les commandes desktop affichent un message propre sur mobile."
  ].join("\n");
}

function getMobileFeaturesMessage() {
  return [
    "Fonctionnalites mobile : commandes texte, interface tactile, consultation des modules, dashboard, memoire locale navigateur et mode PWA.",
    "Limites : les raccourcis Windows, la fenetre Electron et Ollama local desktop restent reserves a la version desktop."
  ].join("\n");
}

function getDesktopFeaturesMessage() {
  return [
    "Fonctionnalites desktop : Ollama local, commandes Windows, dossiers, calculatrice, navigateur, plein ecran Electron, minimisation, memoire locale Electron et automatisations.",
    "La version mobile garde l'interface et les commandes compatibles, avec messages propres pour le reste."
  ].join("\n");
}

function getWebStatusMessage() {
  return isDesktopElectron()
    ? "Vous utilisez la version desktop de JARVIS."
    : "Vous utilisez la version web/mobile de JARVIS.";
}

async function getBridgeStatusMessage(detail = "status") {
  const api = getBridgeApi();
  if (!api) return "Le Bridge JARVIS est disponible uniquement dans la version desktop V4.6.";

  try {
    const status = await api.getBridgeStatus();
    if (!status || !status.running) {
      const reason = status && status.lastError ? ` ${status.lastError}` : "";
      return `Bridge JARVIS indisponible.${reason} Relancez l'application et verifiez le pare-feu Windows.`;
    }

    const address = Array.isArray(status.addresses) && status.addresses.length
      ? status.addresses[0]
      : `http://localhost:${status.port || 3210}/mobile.html`;
    const code = status.pairingCode || "indisponible";

    if (detail === "address") {
      return `Adresse mobile Bridge : ${address}\nOuvrez-la sur un telephone connecte au meme Wi-Fi.`;
    }
    if (detail === "code") {
      return `Code d'association Bridge : ${code}. Ce code change apres chaque nouvelle association.`;
    }

    return [
      "Bridge JARVIS actif.",
      `Adresse mobile : ${address}`,
      "Code d'association protege. Tapez code bridge pour l'afficher.",
      `Appareils associes : ${Number(status.connectedDevices) || 0}.`
    ].join("\n");
  } catch (error) {
    return `Impossible de lire le statut du Bridge : ${error.message || "erreur inconnue"}.`;
  }
}

async function rotateBridgePairingCode() {
  const api = getBridgeApi();
  if (!api || typeof api.rotateBridgeCode !== "function") {
    return "Le Bridge JARVIS est disponible uniquement dans la version desktop V4.6.";
  }

  try {
    const status = await api.rotateBridgeCode();
    return status && status.running
      ? `Nouveau code d'association Bridge : ${status.pairingCode}.`
      : "Le Bridge JARVIS est indisponible.";
  } catch (error) {
    return `Impossible de renouveler le code Bridge : ${error.message || "erreur inconnue"}.`;
  }
}

function getBridgeHelpMessage() {
  return [
    "Bridge JARVIS V4.6 : ouvrez Version mobile dans le header pour lancer le guide de connexion.",
    "Connectez le PC et le telephone au meme Wi-Fi, ouvrez l'adresse affichee, puis revelez le code d'association.",
    "Le Bridge donne acces a Ollama et aux donnees d'organisation locales, sans exposer les commandes Windows a distance."
  ].join("\n");
}

function getDeploymentMessage() {
  return [
    "Deploiement web : la version web de JARVIS peut etre deployee sur Vercel ou Netlify comme application statique.",
    "Les fichiers essentiels sont a la racine : index.html, style.css, script.js, manifest.json et service-worker.js.",
    "Les fonctions desktop, Ollama local et commandes Windows restent reservees a Electron.",
    "Sur navigateur web/mobile, JARVIS affiche des messages propres si une fonction desktop est indisponible."
  ].join("\n");
}

function getDesktopOnlyMessage() {
  return "Cette fonctionnalite est disponible uniquement sur la version desktop.";
}

function getAiApi() {
  return aiApi && typeof aiApi.askOllama === "function" ? aiApi : null;
}

function getBridgeApi() {
  return aiApi && typeof aiApi.getBridgeStatus === "function" ? aiApi : null;
}

function getBackupApi() {
  return aiApi && typeof aiApi.getBackupStatus === "function" ? aiApi : null;
}

function getProactiveApi() {
  return aiApi && typeof aiApi.listNotifications === "function" ? aiApi : null;
}

let bridgeCodeVisible = false;
let currentBridgeAddress = "";

function renderProtectedBridgeCode(code) {
  if (!bridgeOnboardingCode) return;
  const safeCode = String(code || "");
  bridgeOnboardingCode.dataset.code = safeCode;
  bridgeOnboardingCode.textContent = bridgeCodeVisible && safeCode ? safeCode : "••••••";
  if (bridgeRevealCodeBtn) bridgeRevealCodeBtn.textContent = bridgeCodeVisible ? "Masquer le code" : "Afficher le code";
}

function renderBridgeOnboardingStatus(status) {
  const running = Boolean(status && status.running);
  const addresses = running && Array.isArray(status.addresses) ? status.addresses : [];
  const address = addresses[0] || (running ? `http://localhost:${status.port || 3210}/mobile.html` : "");
  const devices = running ? Number(status.connectedDevices) || 0 : 0;
  currentBridgeAddress = address;

  if (bridgeQuickState) bridgeQuickState.textContent = running ? "Bridge actif" : "Bridge indisponible";
  if (bridgeQuickAddress) bridgeQuickAddress.textContent = address || "Relancez JARVIS desktop";
  if (bridgeQuickDevices) bridgeQuickDevices.textContent = running
    ? `${devices} appareil${devices > 1 ? "s" : ""} associe${devices > 1 ? "s" : ""} · Code protege`
    : "Connexion locale inactive";

  if (bridgeOnboardingState) {
    bridgeOnboardingState.textContent = running ? "Bridge pret" : "Bridge indisponible";
    bridgeOnboardingState.dataset.tone = running ? "ready" : "error";
  }
  if (bridgeOnboardingDevices) {
    bridgeOnboardingDevices.textContent = `${devices} appareil${devices > 1 ? "s" : ""} associe${devices > 1 ? "s" : ""}`;
  }
  if (bridgeOnboardingAddress) {
    bridgeOnboardingAddress.textContent = address || (status && status.lastError) || "Adresse locale indisponible";
  }
  renderBridgeDevices(running && Array.isArray(status.devices) ? status.devices : []);
  renderProtectedBridgeCode(running ? status.pairingCode : "");
}

function renderBridgeDevices(devices) {
  if (!bridgeDeviceList) return;
  bridgeDeviceList.textContent = "";
  if (!devices.length) {
    const emptyState = document.createElement("p");
    emptyState.textContent = "Aucun appareil associe.";
    bridgeDeviceList.appendChild(emptyState);
    return;
  }

  devices.forEach((device) => {
    const row = document.createElement("div");
    row.className = "bridge-device-row";
    const details = document.createElement("div");
    const name = document.createElement("strong");
    const meta = document.createElement("small");
    const revokeButton = document.createElement("button");
    name.textContent = device.name || "Appareil mobile";
    meta.textContent = `${device.platform || "Navigateur"} · Vu ${formatDateTime(device.lastSeenAt)}`;
    revokeButton.type = "button";
    revokeButton.textContent = "Revoquer";
    revokeButton.dataset.bridgeDeviceId = device.id || "";
    details.append(name, meta);
    row.append(details, revokeButton);
    bridgeDeviceList.appendChild(row);
  });
}

function renderBridgeQrCode(result) {
  const available = Boolean(result && result.ok && result.dataUrl);
  if (bridgeOnboardingQr) {
    bridgeOnboardingQr.hidden = !available;
    bridgeOnboardingQr.src = available ? result.dataUrl : "";
  }
  if (bridgeQrPlaceholder) bridgeQrPlaceholder.hidden = available;
}

async function refreshBridgeOnboarding() {
  const api = getBridgeApi();
  if (!api) {
    renderBridgeOnboardingStatus({ running: false, lastError: "Version desktop requise" });
    return null;
  }

  try {
    const status = await api.getBridgeStatus();
    renderBridgeOnboardingStatus(status || { running: false });
    if (status && status.running && typeof api.getBridgeQrCode === "function") {
      renderBridgeQrCode(await api.getBridgeQrCode());
    } else {
      renderBridgeQrCode(null);
    }
    return status;
  } catch (error) {
    renderBridgeOnboardingStatus({ running: false, lastError: error.message || "Erreur Bridge" });
    renderBridgeQrCode(null);
    return null;
  }
}

async function openBridgeOnboarding() {
  if (!bridgeOnboarding) return;
  bridgeCodeVisible = false;
  bridgeOnboarding.hidden = false;
  document.body.classList.add("bridge-dialog-open");
  await refreshBridgeOnboarding();
  const closeButton = bridgeOnboarding.querySelector("[data-close-bridge-onboarding]");
  if (closeButton) closeButton.focus();
}

function closeBridgeOnboarding() {
  if (!bridgeOnboarding) return;
  bridgeCodeVisible = false;
  renderProtectedBridgeCode(bridgeOnboardingCode ? bridgeOnboardingCode.dataset.code : "");
  bridgeOnboarding.hidden = true;
  document.body.classList.remove("bridge-dialog-open");
}

async function copyBridgeAddress() {
  if (!currentBridgeAddress) {
    respond("Adresse Bridge indisponible. Relancez JARVIS puis actualisez.", false);
    return;
  }

  try {
    await navigator.clipboard.writeText(currentBridgeAddress);
    respond("Adresse Bridge copiee. Ouvrez-la sur le telephone connecte au meme Wi-Fi.", false);
  } catch (_error) {
    const temporaryInput = document.createElement("textarea");
    temporaryInput.value = currentBridgeAddress;
    temporaryInput.style.position = "fixed";
    temporaryInput.style.opacity = "0";
    document.body.appendChild(temporaryInput);
    temporaryInput.select();
    document.execCommand("copy");
    temporaryInput.remove();
    respond("Adresse Bridge copiee.", false);
  }
}

async function revokeBridgeDevice(deviceId) {
  const api = getBridgeApi();
  if (!api || typeof api.revokeBridgeDevice !== "function" || !deviceId) return;
  const result = await api.revokeBridgeDevice(deviceId);
  await refreshBridgeOnboarding();
  respond(result && result.revoked ? "Appareil mobile revoque." : "Appareil mobile introuvable.", false);
}

function setBackupCenterMessage(message, tone = "idle") {
  if (backupCenterMessage) {
    backupCenterMessage.textContent = message;
    backupCenterMessage.dataset.tone = tone;
  }
}

async function refreshBackupStatus() {
  const api = getBackupApi();
  if (!api) {
    if (backupStorageHealth) backupStorageHealth.textContent = "Desktop requis";
    if (backupHealthBadge) {
      backupHealthBadge.textContent = "Indisponible sur le web";
      backupHealthBadge.dataset.tone = "error";
    }
    return null;
  }

  try {
    const status = await api.getBackupStatus();
    const health = status && status.storage ? status.storage.health : "error";
    const healthLabels = {
      healthy: "Stockage sain",
      recoverable: "Sauvegarde recuperable",
      empty: "Stockage initial",
      error: "Attention requise"
    };
    const healthLabel = healthLabels[health] || "Etat inconnu";
    if (backupStorageHealth) backupStorageHealth.textContent = healthLabel;
    if (backupHealthBadge) {
      backupHealthBadge.textContent = healthLabel;
      backupHealthBadge.dataset.tone = health === "healthy" || health === "empty" ? "ready" : "error";
    }
    if (backupLatestDate) backupLatestDate.textContent = status.latest ? formatDateTime(status.latest.createdAt) : "Aucune";
    if (backupLatestFile) backupLatestFile.textContent = status.latest ? status.latest.fileName : "Creation quotidienne active";
    if (backupCount) backupCount.textContent = String(Number(status.count) || 0);
    if (backupDataCount) backupDataCount.textContent = String(Number(status.totalItems) || 0);
    return status;
  } catch (error) {
    setBackupCenterMessage(`Diagnostic indisponible : ${error.message || "erreur inconnue"}.`, "error");
    return null;
  }
}

async function createBackupFromInterface() {
  const api = getBackupApi();
  if (!api || typeof api.createBackup !== "function") return getDesktopOnlyMessage();
  try {
    const result = await api.createBackup("manual");
    await refreshBackupStatus();
    const message = result && result.ok ? "Sauvegarde locale JARVIS creee." : "Sauvegarde locale impossible.";
    setBackupCenterMessage(message, result && result.ok ? "ready" : "error");
    return message;
  } catch (error) {
    const message = `Sauvegarde locale impossible : ${error.message || "erreur inconnue"}.`;
    setBackupCenterMessage(message, "error");
    return message;
  }
}

async function exportBackupFromInterface() {
  const api = getBackupApi();
  if (!api || typeof api.exportBackup !== "function") return getDesktopOnlyMessage();
  try {
    const result = await api.exportBackup();
    if (result && result.canceled) return "Export de la sauvegarde annule.";
    const message = result && result.ok ? `Sauvegarde exportee : ${result.fileName}.` : "Export de la sauvegarde impossible.";
    setBackupCenterMessage(message, result && result.ok ? "ready" : "error");
    return message;
  } catch (error) {
    const message = `Export impossible : ${error.message || "erreur inconnue"}.`;
    setBackupCenterMessage(message, "error");
    return message;
  }
}

async function importBackupFromInterface() {
  const api = getBackupApi();
  if (!api || typeof api.importBackup !== "function") return getDesktopOnlyMessage();
  try {
    const result = await api.importBackup();
    if (result && result.canceled) return "Restauration annulee.";
    if (!result || !result.ok) return "Restauration de la sauvegarde impossible.";
    await Promise.all([
      refreshLocalMemory(),
      refreshOrganization(),
      refreshPlanningData(),
      refreshAnalytics(),
      refreshAutomationSettings(),
      loadInterfacePreferences(),
      refreshBackupStatus(),
      refreshNotificationCenter()
    ]);
    const message = `Sauvegarde restauree : ${Number(result.totalItems) || 0} elements locaux recharges.`;
    setBackupCenterMessage(message, "ready");
    return message;
  } catch (error) {
    const message = `Restauration impossible : ${error.message || "erreur inconnue"}.`;
    setBackupCenterMessage(message, "error");
    return message;
  }
}

async function diagnoseStorageFromInterface() {
  const api = getBackupApi();
  if (!api || typeof api.diagnoseStorage !== "function") return getDesktopOnlyMessage();
  try {
    const diagnostic = await api.diagnoseStorage();
    const labels = {
      healthy: "Stockage principal valide et operationnel.",
      recoverable: "Stockage principal a restaurer, sauvegarde valide disponible.",
      empty: "Stockage local pret pour une premiere utilisation.",
      error: "Stockage local illisible. Une intervention est requise."
    };
    const message = labels[diagnostic.health] || "Diagnostic de stockage termine.";
    setBackupCenterMessage(message, diagnostic.health === "error" ? "error" : "ready");
    await refreshBackupStatus();
    return message;
  } catch (error) {
    const message = `Diagnostic impossible : ${error.message || "erreur inconnue"}.`;
    setBackupCenterMessage(message, "error");
    return message;
  }
}

async function getAboutJarvisMessage() {
  const api = getBackupApi();
  if (!api || typeof api.getAppInfo !== "function") return `JARVIS Assistant ${APP_VERSION}, version web/mobile.`;
  const info = await api.getAppInfo();
  return `JARVIS Assistant V${info.version}. Electron ${info.electron}, ${info.platform} ${info.architecture}. Mode local actif.`;
}

function getNotificationStatusLabel(status) {
  return {
    active: "Action requise",
    completed: "Termine",
    snoozed: "Reporte",
    read: "Lu"
  }[status] || "Information";
}

function renderNotificationList() {
  if (!notificationList) return;
  notificationList.textContent = "";
  if (!notificationEntries.length) {
    const empty = document.createElement("p");
    empty.className = "notification-empty-state";
    empty.textContent = "Aucune notification locale.";
    notificationList.appendChild(empty);
    return;
  }

  notificationEntries.forEach((notification) => {
    const item = document.createElement("article");
    const header = document.createElement("header");
    const title = document.createElement("strong");
    const date = document.createElement("time");
    const message = document.createElement("p");
    const footer = document.createElement("footer");
    const state = document.createElement("small");
    const actions = document.createElement("div");

    item.className = `notification-item${notification.readAt ? "" : " is-unread"}`;
    title.textContent = notification.title || "JARVIS";
    date.textContent = formatDateTime(notification.createdAt);
    date.dateTime = notification.createdAt || "";
    message.textContent = notification.message || "Notification locale";
    state.textContent = getNotificationStatusLabel(notification.status);
    state.dataset.tone = notification.status || "read";
    actions.className = "notification-item-actions";

    if (notification.type === "reminder" && notification.status === "active" && notification.entityId) {
      const completeButton = document.createElement("button");
      const snoozeButton = document.createElement("button");
      completeButton.type = "button";
      completeButton.textContent = "Terminer";
      completeButton.dataset.notificationAction = "complete";
      snoozeButton.type = "button";
      snoozeButton.textContent = `Reporter ${proactiveStatus.snoozeMinutes || 10} min`;
      snoozeButton.dataset.notificationAction = "snooze";
      [completeButton, snoozeButton].forEach((button) => {
        button.dataset.notificationId = notification.id || "";
        button.dataset.reminderId = notification.entityId || "";
      });
      actions.append(completeButton, snoozeButton);
    }

    if (!notification.readAt) {
      const readButton = document.createElement("button");
      readButton.type = "button";
      readButton.textContent = "Marquer lu";
      readButton.dataset.notificationAction = "read";
      readButton.dataset.notificationId = notification.id || "";
      actions.appendChild(readButton);
    }

    header.append(title, date);
    footer.append(state, actions);
    item.append(header, message, footer);
    notificationList.appendChild(item);
  });
}

function updateProactiveDashboard(listResult = {}) {
  const unread = Number(listResult.unread) || 0;
  const active = Number(listResult.active) || 0;
  if (notificationUnreadCount) notificationUnreadCount.textContent = String(unread);
  if (notificationActiveCount) notificationActiveCount.textContent = String(active);
  if (notificationNavCount) {
    notificationNavCount.textContent = String(unread);
    notificationNavCount.hidden = unread === 0;
  }
  if (commandStatusNotifications) commandStatusNotifications.textContent = `${unread} non lue${unread > 1 ? "s" : ""}`;
  if (commandStatusBackground) commandStatusBackground.textContent = proactiveStatus.backgroundActive ? "Arriere-plan actif" : "Arriere-plan inactif";
  if (notificationWindowsState) notificationWindowsState.textContent = proactiveStatus.notificationsEnabled ? "Activees" : "Desactivees";
  if (notificationWindowsDetail) notificationWindowsDetail.textContent = proactiveStatus.notificationsSupported ? "Prises en charge" : "Non prises en charge";
  if (notificationStartupState) notificationStartupState.textContent = proactiveStatus.launchAtStartup ? "Active" : "Desactive";
  if (notificationStartupDetail) {
    notificationStartupDetail.textContent = proactiveStatus.packaged
      ? proactiveStatus.launchAtStartupActive ? "Enregistre dans Windows" : "Application installee"
      : "Actif apres installation";
  }
  if (notificationCenterBadge) {
    notificationCenterBadge.textContent = proactiveStatus.backgroundActive ? "Mode proactif actif" : "Mode proactif indisponible";
    notificationCenterBadge.dataset.tone = proactiveStatus.backgroundActive ? "active" : "error";
  }
  if (proactiveModeBadge) proactiveModeBadge.hidden = !proactiveStatus.backgroundActive;
  if (toggleWindowsNotificationsBtn) {
    toggleWindowsNotificationsBtn.textContent = proactiveStatus.notificationsEnabled ? "Desactiver les notifications" : "Activer les notifications";
  }
  if (toggleStartupBtn) {
    toggleStartupBtn.textContent = proactiveStatus.launchAtStartup ? "Desactiver au demarrage" : "Activer au demarrage";
  }
  if (toggleCloseToTrayBtn) {
    toggleCloseToTrayBtn.textContent = `Fermer vers le tray : ${proactiveStatus.closeToTray ? "actif" : "inactif"}`;
  }
  renderNotificationList();
}

async function refreshNotificationCenter(preloadedResult = null) {
  const api = getProactiveApi();
  if (!api) {
    proactiveStatus = { ...proactiveStatus, backgroundActive: false };
    notificationEntries = [];
    updateProactiveDashboard({ unread: 0, active: 0 });
    return null;
  }

  try {
    const [listResult, statusResult] = await Promise.all([
      preloadedResult || api.listNotifications(100),
      api.getProactiveStatus()
    ]);
    notificationEntries = listResult && Array.isArray(listResult.notifications) ? listResult.notifications : [];
    proactiveStatus = { ...proactiveStatus, ...(statusResult || {}) };
    updateProactiveDashboard(listResult || {});
    return { listResult, statusResult };
  } catch (_error) {
    proactiveStatus = { ...proactiveStatus, backgroundActive: false };
    updateProactiveDashboard({ unread: 0, active: 0 });
    return null;
  }
}

async function setProactiveSetting(key, value) {
  const api = getProactiveApi();
  if (!api || typeof api.updateProactiveSetting !== "function") return getDesktopOnlyMessage();
  const result = await api.updateProactiveSetting(key, value);
  await refreshNotificationCenter();
  if (!result || !result.ok) return result && result.message ? result.message : "Reglage proactif indisponible.";
  if (key === "notificationsEnabled") return value ? "Notifications Windows activees." : "Notifications Windows desactivees.";
  if (key === "launchAtStartup") {
    return value
      ? proactiveStatus.packaged ? "Lancement automatique Windows active." : "Lancement automatique enregistre. Il sera applique a la version installee."
      : "Lancement automatique Windows desactive.";
  }
  return value ? "Mode arriere-plan actif." : "Fermeture vers le tray desactivee.";
}

async function runNotificationAction(action, reminderId, notificationId) {
  const api = getProactiveApi();
  if (!api) return getDesktopOnlyMessage();
  let result;
  if (action === "complete") {
    result = await api.completeReminderFromNotification(reminderId, notificationId);
  } else if (action === "snooze") {
    result = await api.snoozeReminderFromNotification(reminderId, notificationId);
  } else {
    result = await api.markNotificationRead(notificationId);
  }
  await Promise.all([refreshNotificationCenter(), refreshOrganization()]);
  if (!result || !result.ok) return result && result.message ? result.message : "Action impossible.";
  if (action === "complete") return "Rappel termine monsieur.";
  if (action === "snooze") return `Rappel reporte de ${result.minutes || proactiveStatus.snoozeMinutes || 10} minutes.`;
  return "Notification marquee comme lue.";
}

function formatProactiveStatus() {
  return [
    `Mode proactif : ${proactiveStatus.backgroundActive ? "actif" : "inactif"}.`,
    `Notifications Windows : ${proactiveStatus.notificationsEnabled ? "activees" : "desactivees"}.`,
    `Fermeture vers le tray : ${proactiveStatus.closeToTray ? "active" : "desactivee"}.`,
    `Lancement automatique : ${proactiveStatus.launchAtStartup ? "active" : "desactive"}.`,
    `${notificationEntries.filter((item) => !item.readAt).length} notification(s) non lue(s).`
  ].join("\n");
}

function getMemoryApi() {
  return aiApi && typeof aiApi.addMemory === "function" ? aiApi : null;
}

function getOrganizationApi() {
  return aiApi && typeof aiApi.addTask === "function" ? aiApi : null;
}

function getPlanningApi() {
  return aiApi && typeof aiApi.addPlanningItem === "function" ? aiApi : null;
}

function getAnalyticsApi() {
  return aiApi && typeof aiApi.getAnalyticsSummary === "function" ? aiApi : null;
}

function getAutomationApi() {
  return aiApi && typeof aiApi.getAutomationSettings === "function" ? aiApi : null;
}

function getPreferencesApi() {
  return aiApi && typeof aiApi.getPreferences === "function" ? aiApi : null;
}

function getVoiceTranscriptionApi() {
  return window.jarvisAPI && typeof window.jarvisAPI.transcribeVoice === "function" ? window.jarvisAPI : null;
}

function getLocalDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatMemoryList(items, emptyMessage) {
  if (!items || !items.length) return emptyMessage;
  return items.map((item, index) => `${index + 1}. ${item.content}`).join("\n");
}

function formatDateTime(value) {
  if (!value) return "sans horaire";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "sans horaire";
  return date.toLocaleString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  });
}

function formatTaskList(tasks, emptyMessage) {
  if (!tasks || !tasks.length) return emptyMessage;
  return tasks.map((task, index) => {
    const status = task.status === "completed" ? "terminee" : "a faire";
    const priority = task.priority === "high" ? "priorite haute" : `priorite ${task.priority || "normal"}`;
    return `${index + 1}. [${status}] ${task.title} - ${priority}`;
  }).join("\n");
}

function formatReminderList(reminders, emptyMessage) {
  if (!reminders || !reminders.length) return emptyMessage;
  return reminders.map((reminder, index) => {
    const status = reminder.done ? "fait" : "actif";
    return `${index + 1}. [${status}] ${reminder.title} - ${formatDateTime(reminder.remindAt)}`;
  }).join("\n");
}

function formatPlanningList(items, emptyMessage) {
  if (!items || !items.length) return emptyMessage;
  return items
    .slice()
    .sort((a, b) => `${a.date} ${a.time || "99:99"}`.localeCompare(`${b.date} ${b.time || "99:99"}`))
    .map((item, index) => `${index + 1}. ${item.date}${item.time ? ` a ${item.time}` : ""} - ${item.title}`)
    .join("\n");
}

function formatDailyLog(log) {
  if (!log) return "Aucun bilan enregistre pour aujourd'hui. Vous pouvez dire : bilan journee ...";
  const wins = log.wins && log.wins.length ? log.wins.map((win) => `- ${win}`).join("\n") : "- Aucune victoire notee";
  const blockers = log.blockers && log.blockers.length ? log.blockers.map((blocker) => `- ${blocker}`).join("\n") : "- Aucun blocage note";
  return [
    `Bilan du ${log.date}`,
    `Resume : ${log.summary || "Aucun resume detaille."}`,
    "Victoires :",
    wins,
    "Blocages :",
    blockers
  ].join("\n");
}

function formatFocusSessions(sessions, emptyMessage) {
  if (!sessions || !sessions.length) return emptyMessage;
  return sessions.slice(0, 10).map((session, index) => {
    const startedAt = formatDateTime(session.startedAt);
    return `${index + 1}. ${session.duration} min - ${session.status} - ${startedAt}`;
  }).join("\n");
}

function formatLastActivity(value) {
  return value ? formatDateTime(value) : "aucune activite";
}

function formatAnalyticsSummary(summary) {
  if (!summary) return "Statistiques locales indisponibles.";
  return [
    "Voici vos statistiques locales.",
    `Taches : ${summary.totalTasks} total, ${summary.activeTasks} en cours, ${summary.completedTasks} terminees.`,
    `Priorites actives : ${summary.activePriorities}. Rappels actifs : ${summary.activeReminders}, dont ${summary.dueReminders} dus.`,
    `Notes : ${summary.notes}. Memoires : ${summary.memories}. Planning du jour : ${summary.todayPlanning}.`,
    `Focus : ${summary.focusSessions} session(s), ${summary.focusMinutes} minute(s) terminees.`,
    `Bilans de journee : ${summary.dailyLogs}. Derniere activite : ${formatLastActivity(summary.lastActivity)}.`
  ].join("\n");
}

function formatWeeklySummary(weekly) {
  if (!weekly) return "Resume semaine indisponible.";
  return [
    "Resume local des 7 derniers jours.",
    `Taches terminees : ${weekly.completedTasks}.`,
    `Sessions focus : ${weekly.focusSessions}. Temps focus : ${weekly.focusMinutes} minute(s).`,
    `Notes creees : ${weekly.notesCreated}. Bilans ajoutes : ${weekly.dailyLogs}.`,
    `Priorites restantes : ${weekly.remainingPriorities}.`
  ].join("\n");
}

function formatProductivityScore(productivity) {
  if (!productivity) return "Score de productivite indisponible.";
  return [
    "Voici votre score de productivite indicatif.",
    productivity.message,
    `Detail : taches ${productivity.breakdown.tasks}, priorites ${productivity.breakdown.priorities}, focus ${productivity.breakdown.focus}, bilan ${productivity.breakdown.dailyLog}, rappels ${productivity.breakdown.reminders}.`
  ].join("\n");
}

function buildProgressionSummary() {
  const summary = analyticsSummary || {};
  const score = productivityScore ? productivityScore.score : 0;
  const advancing = [
    summary.completedTasks ? `${summary.completedTasks} tache(s) terminee(s)` : "",
    summary.focusMinutes ? `${summary.focusMinutes} minute(s) de focus` : "",
    summary.dailyLogs ? `${summary.dailyLogs} bilan(s) enregistre(s)` : ""
  ].filter(Boolean).join(", ") || "peu de signaux termines pour le moment";
  const waiting = [
    summary.activeTasks ? `${summary.activeTasks} tache(s) en cours` : "",
    summary.activePriorities ? `${summary.activePriorities} priorite(s)` : "",
    summary.todayPlanning ? `${summary.todayPlanning} element(s) au planning du jour` : ""
  ].filter(Boolean).join(", ") || "rien de critique en attente";
  const attention = summary.dueReminders
    ? `${summary.dueReminders} rappel(s) dus meritent attention`
    : score < 50 ? "un bloc focus court peut relancer la dynamique" : "dynamique stable";

  return [
    "Synthese de progression.",
    `Ce qui avance : ${advancing}.`,
    `Ce qui reste en attente : ${waiting}.`,
    `A surveiller : ${attention}.`
  ].join("\n");
}

function automationLabel(value) {
  return value ? "Active" : "Inactive";
}

function hasActiveAutomation() {
  return Boolean(
    automationSettings.startupBriefing ||
    automationSettings.workModeAutomation ||
    automationSettings.automaticReminders ||
    automationSettings.eveningRoutine ||
    automationSettings.focusAutomation
  );
}

function formatAutomationSettings() {
  return [
    hasActiveAutomation() ? "Automatisations disponibles :" : "Aucune automatisation active.",
    `Briefing demarrage : ${automationLabel(automationSettings.startupBriefing)}.`,
    `Mode travail automatique : ${automationLabel(automationSettings.workModeAutomation)}.`,
    `Rappels automatiques : ${automationLabel(automationSettings.automaticReminders)}.`,
    `Routine soir automatique : ${automationLabel(automationSettings.eveningRoutine)}.`,
    `Focus automatique : ${automationLabel(automationSettings.focusAutomation)}.`
  ].join("\n");
}

function normalizeInterfacePreferences(preferences = {}) {
  const activeMode = typeof preferences.activeMode === "string" ? normalizeCommand(preferences.activeMode) : "standard";
  const theme = typeof preferences.theme === "string" ? normalizeCommand(preferences.theme) : "cyan";

  return {
    activeMode: Object.prototype.hasOwnProperty.call(MODE_LABELS, activeMode) ? activeMode : "standard",
    theme: ["cyan", "blue", "green", "violet"].includes(theme) ? theme : "cyan",
    animations: typeof preferences.animations === "boolean" ? preferences.animations : true,
    compactMode: Boolean(preferences.compactMode),
    reducedMotion: Boolean(preferences.reducedMotion)
  };
}

function applyPreferenceClasses() {
  const targets = [document.body, app].filter(Boolean);
  targets.forEach((target) => {
    target.classList.remove(...MODE_CLASSES, ...THEME_CLASSES);
    target.classList.add(`mode-${interfacePreferences.activeMode}`, `theme-${interfacePreferences.theme}`);
    target.classList.toggle("reduced-motion", interfacePreferences.reducedMotion || !interfacePreferences.animations);
    target.classList.toggle("compact-mode", interfacePreferences.compactMode);
  });

  profileCards.forEach((card) => {
    const active = card.dataset.modeCard === interfacePreferences.activeMode;
    card.classList.toggle("is-active", active);
    const button = card.querySelector("[data-mode-profile]");
    if (button) button.textContent = active ? "Actif" : "Activer";
  });

  if (activeModeLabel) {
    activeModeLabel.textContent = `Mode ${MODE_LABELS[interfacePreferences.activeMode] || "Standard"} / theme ${interfacePreferences.theme}`;
  }
}

function applyModeSideEffects(mode) {
  if (mode === "work") {
    setWorkMode(true, false);
    setActiveModule("work", "Profil travail");
  } else if (mode === "standard") {
    setWorkMode(false, false);
    activeModuleKey = "";
    if (activeModuleBadge) activeModuleBadge.hidden = true;
    if (moduleSummary) moduleSummary.textContent = "Accueil actif";
    moduleCards.forEach((card) => card.classList.remove("is-active", "is-resting"));
    setSystemStatus("Systeme en ligne", "Noyau stable");
  } else if (mode === "focus") {
    setWorkMode(false, false);
    setActiveModule("routines", "Profil focus");
    setSystemStatus("Mode focus actif", "Distractions reduites");
  } else if (mode === "sport") {
    setWorkMode(false, false);
    setActiveModule("sport", "Profil sport");
  } else if (mode === "ai") {
    setAiMode(true, "IA locale au premier plan");
    showCommandCenterTab("ai");
    scrollToPanel("command-center-panel");
  } else if (mode === "night") {
    setSystemStatus("Mode nuit actif", "Luminosite reduite");
  } else if (mode === "hud") {
    setSystemStatus("Full HUD actif", "Decorations renforcees");
  }
}

async function persistInterfacePreference(key, value) {
  const api = getPreferencesApi();
  if (!api) return { ok: false };

  try {
    return await api.updatePreference(key, value);
  } catch (_error) {
    return { ok: false };
  }
}

async function activateInterfaceMode(mode, shouldPersist = true) {
  const safeMode = Object.prototype.hasOwnProperty.call(MODE_LABELS, mode) ? mode : "standard";
  interfacePreferences = normalizeInterfacePreferences({ ...interfacePreferences, activeMode: safeMode });
  applyPreferenceClasses();
  applyModeSideEffects(safeMode);

  if (shouldPersist) {
    const result = await persistInterfacePreference("activeMode", safeMode);
    if (result && result.preferences) {
      interfacePreferences = normalizeInterfacePreferences(result.preferences);
      applyPreferenceClasses();
    }
  }

  return MODE_RESPONSES[safeMode] || MODE_RESPONSES.standard;
}

async function activateTheme(theme, shouldPersist = true) {
  const safeTheme = ["cyan", "blue", "green", "violet"].includes(theme) ? theme : "cyan";
  interfacePreferences = normalizeInterfacePreferences({ ...interfacePreferences, theme: safeTheme });
  applyPreferenceClasses();

  if (shouldPersist) {
    const result = await persistInterfacePreference("theme", safeTheme);
    if (result && result.preferences) {
      interfacePreferences = normalizeInterfacePreferences(result.preferences);
      applyPreferenceClasses();
    }
  }

  return `Theme ${safeTheme} active.`;
}

async function setReducedMotionPreference(reduced) {
  interfacePreferences = normalizeInterfacePreferences({
    ...interfacePreferences,
    reducedMotion: reduced,
    animations: !reduced
  });
  applyPreferenceClasses();

  const api = getPreferencesApi();
  if (api) {
    await api.updatePreference("reducedMotion", reduced);
    const result = await api.updatePreference("animations", !reduced);
    if (result && result.preferences) {
      interfacePreferences = normalizeInterfacePreferences(result.preferences);
      applyPreferenceClasses();
    }
  }

  return reduced ? "Animations reduites. Interface stabilisee." : "Animations activees.";
}

async function resetInterfaceMode() {
  const api = getPreferencesApi();
  if (api) {
    try {
      const result = await api.resetPreferences();
      interfacePreferences = normalizeInterfacePreferences(result && result.preferences ? result.preferences : DEFAULT_INTERFACE_PREFERENCES);
    } catch (_error) {
      interfacePreferences = { ...DEFAULT_INTERFACE_PREFERENCES };
    }
  } else {
    interfacePreferences = { ...DEFAULT_INTERFACE_PREFERENCES };
  }

  applyPreferenceClasses();
  applyModeSideEffects("standard");
  return "Mode standard active monsieur.";
}

async function loadInterfacePreferences() {
  const api = getPreferencesApi();
  if (api) {
    try {
      const result = await api.getPreferences();
      interfacePreferences = normalizeInterfacePreferences(result && result.preferences ? result.preferences : DEFAULT_INTERFACE_PREFERENCES);
    } catch (_error) {
      interfacePreferences = { ...DEFAULT_INTERFACE_PREFERENCES };
    }
  }

  applyPreferenceClasses();
  applyModeSideEffects(interfacePreferences.activeMode);
}

function showCommandCenterTab(tabKey) {
  activeCommandCategory = tabKey || activeCommandCategory;
  document.querySelectorAll(".left-sidebar [data-nav-target]").forEach((button) => {
    button.classList.remove("is-active");
  });
  document.querySelectorAll("[data-command-center-tab]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.commandCenterTab === activeCommandCategory);
  });
  document.querySelectorAll("[data-command-panel]").forEach((view) => {
    const active = view.dataset.commandPanel === activeCommandCategory;
    view.hidden = !active;
    view.classList.toggle("is-active", active);
  });
}

function updateCommandCenterStatus() {
  const openTasks = taskEntries.filter((task) => task.status !== "completed");
  const openReminders = reminderEntries.filter((reminder) => !reminder.done);
  const todayPlanning = planningEntries.filter((item) => item.date === getLocalDateKey());
  const automationCount = [
    automationSettings.startupBriefing,
    automationSettings.workModeAutomation,
    automationSettings.automaticReminders,
    automationSettings.eveningRoutine,
    automationSettings.focusAutomation
  ].filter(Boolean).length;

  if (commandStatusVoice) commandStatusVoice.textContent = preferredVoiceName || "Profil actif";
  if (commandStatusMemory) commandStatusMemory.textContent = `${memoryEntries.length} mem. / ${noteEntries.length} notes`;
  if (commandStatusTasks) commandStatusTasks.textContent = String(openTasks.length);
  if (commandStatusReminders) commandStatusReminders.textContent = String(openReminders.length);
  if (commandStatusAutomations) commandStatusAutomations.textContent = `${automationCount}/5 actives`;
  if (commandStatusActivity) commandStatusActivity.textContent = analyticsSummary ? formatLastActivity(analyticsSummary.lastActivity) : "--";
  if (commandCenterTaskCount) commandCenterTaskCount.textContent = String(openTasks.length);
  if (commandCenterReminderCount) commandCenterReminderCount.textContent = String(openReminders.length);
  if (commandCenterPlanningCount) commandCenterPlanningCount.textContent = String(todayPlanning.length);
  if (commandCenterMemoryCount) commandCenterMemoryCount.textContent = String(memoryEntries.length);
  if (commandCenterNoteCount) commandCenterNoteCount.textContent = String(noteEntries.length);
  if (commandCenterVoiceSpeed) commandCenterVoiceSpeed.textContent = currentSpeechRate.toFixed(2);
  if (commandCenterVoicePitch) commandCenterVoicePitch.textContent = currentSpeechPitch.toFixed(2);
  if (commandCenterVoiceVolume) commandCenterVoiceVolume.textContent = currentSpeechVolume.toFixed(2);
  if (commandCenterAutomationState) commandCenterAutomationState.textContent = automationCount ? `${automationCount} active(s)` : "Aucune active";
  if (commandCenterStartupAutomation) commandCenterStartupAutomation.textContent = automationLabel(automationSettings.startupBriefing);
  if (commandCenterWorkAutomation) commandCenterWorkAutomation.textContent = automationLabel(automationSettings.workModeAutomation);
  if (commandCenterReminderAutomation) commandCenterReminderAutomation.textContent = automationLabel(automationSettings.automaticReminders);
  if (commandCenterEveningAutomation) commandCenterEveningAutomation.textContent = automationLabel(automationSettings.eveningRoutine);
  if (commandCenterFocusAutomation) commandCenterFocusAutomation.textContent = automationLabel(automationSettings.focusAutomation);
}

function findTextMatch(items, query, fieldName) {
  const safeQuery = normalizeCommand(query || "");
  if (!safeQuery) return null;
  return items.find((item) => normalizeCommand(item[fieldName] || "").includes(safeQuery));
}

function parseReminderCommand(command) {
  const text = command.trim();
  const normalized = normalizeCommand(text);
  const minuteMatch = normalized.match(/^rappel dans (\d+) minutes?\s+(.+)$/);
  if (minuteMatch) {
    const minutes = Math.max(1, Math.min(1440, Number(minuteMatch[1])));
    const title = text.replace(/^rappel\s+dans\s+\d+\s+minutes?\s+/i, "").trim();
    return {
      title,
      remindAt: new Date(Date.now() + minutes * 60 * 1000).toISOString(),
      message: `Rappel programme dans ${minutes} minute${minutes > 1 ? "s" : ""}.`
    };
  }

  return {
    title: text.replace(/^rappelle[- ]moi\s+(de\s+)?/i, "").trim(),
    remindAt: null,
    message: "Rappel ajoute monsieur."
  };
}

function parsePlanningCommand(command) {
  let title = command.trim().replace(/^ajoute\s+planning\s+/i, "").trim();
  const lowerTitle = normalizeCommand(title);
  const now = new Date();
  let date = getLocalDateKey(now);
  let time = null;

  if (/\bdemain\b/.test(lowerTitle)) {
    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);
    date = getLocalDateKey(tomorrow);
    title = title.replace(/\bdemain\b/i, "").trim();
  } else if (/\baujourd[' ]?hui\b/.test(lowerTitle)) {
    title = title.replace(/\baujourd[' ]?hui\b/i, "").trim();
  }

  const timeMatch = title.match(/\b(\d{1,2})h(?:(\d{2}))?\b/i);
  if (timeMatch) {
    const hours = String(Math.max(0, Math.min(23, Number(timeMatch[1])))).padStart(2, "0");
    const minutes = String(Math.max(0, Math.min(59, Number(timeMatch[2] || 0)))).padStart(2, "0");
    time = `${hours}:${minutes}`;
    title = title.replace(timeMatch[0], "").trim();
  }

  return {
    title: title || "Element de planning",
    date,
    time,
    type: "other"
  };
}

function setMemoryBadge(active = true) {
  if (!memoryModeBadge) return;
  memoryModeBadge.hidden = !active;
}

function updateMemoryDashboard() {
  if (memoryCount) memoryCount.textContent = String(memoryEntries.length);
  if (notesCount) notesCount.textContent = String(noteEntries.length);
  if (latestMemory) {
    latestMemory.textContent = memoryEntries[0]
      ? memoryEntries[0].content
      : "Aucune memoire enregistree";
  }
  setMemoryBadge(true);
  updateCommandCenterStatus();
}

async function refreshLocalMemory() {
  const memoryApi = getMemoryApi();
  if (!memoryApi) {
    updateMemoryDashboard();
    return;
  }

  try {
    const [memoryResult, noteResult] = await Promise.all([
      memoryApi.listMemories(),
      memoryApi.listNotes()
    ]);
    memoryEntries = memoryResult && Array.isArray(memoryResult.memories) ? memoryResult.memories : [];
    noteEntries = noteResult && Array.isArray(noteResult.notes) ? noteResult.notes : [];
    updateMemoryDashboard();
  } catch (_error) {
    if (latestMemory) latestMemory.textContent = "Memoire locale indisponible";
  }
}

async function addLocalMemory(content) {
  const memoryApi = getMemoryApi();
  if (!memoryApi) return "Memoire locale indisponible. Lancez JARVIS avec npm start.";
  const result = await memoryApi.addMemory(content);
  await refreshLocalMemory();
  return result && result.ok
    ? "C'est note monsieur. J'ai ajoute cette information a ma memoire locale."
    : result.message || "Memoire locale indisponible.";
}

async function addLocalNote(content) {
  const memoryApi = getMemoryApi();
  if (!memoryApi) return "Notes locales indisponibles. Lancez JARVIS avec npm start.";
  const result = await memoryApi.addNote(content);
  await refreshLocalMemory();
  updateOrganizationDashboard();
  return result && result.ok ? "Note enregistree monsieur." : result.message || "Note locale indisponible.";
}

async function listLocalMemories() {
  await refreshLocalMemory();
  return memoryEntries.length
    ? `Voici les informations enregistrees dans ma memoire locale.\n${formatMemoryList(memoryEntries, "")}`
    : "Je n'ai encore aucune information memorisee sur vous, monsieur.";
}

async function listLocalNotes() {
  await refreshLocalMemory();
  return noteEntries.length
    ? `Notes locales :\n${formatMemoryList(noteEntries, "")}`
    : "Aucune note locale enregistree.";
}

async function searchLocalMemory(query) {
  const memoryApi = getMemoryApi();
  if (!memoryApi) return "Memoire locale indisponible. Lancez JARVIS avec npm start.";
  const result = await memoryApi.searchMemory(query);
  const memories = result && Array.isArray(result.memories) ? result.memories : [];
  return memories.length
    ? `Resultats memoire pour "${query}" :\n${formatMemoryList(memories, "")}`
    : `Aucun resultat memoire pour "${query}".`;
}

async function forgetLocalMemory(query) {
  const memoryApi = getMemoryApi();
  if (!memoryApi) return "Memoire locale indisponible. Lancez JARVIS avec npm start.";
  const result = await memoryApi.searchMemory(query);
  const memories = result && Array.isArray(result.memories) ? result.memories : [];
  if (!memories.length) return `Je n'ai trouve aucun element memoire correspondant a "${query}".`;

  await Promise.all(memories.map((memory) => memoryApi.deleteMemory(memory.id)));
  await refreshLocalMemory();
  return "J'ai supprime les elements correspondants de ma memoire locale.";
}

async function clearLocalMemory() {
  const memoryApi = getMemoryApi();
  if (!memoryApi) return "Memoire locale indisponible. Lancez JARVIS avec npm start.";
  await memoryApi.clearMemory();
  await refreshLocalMemory();
  return "Memoire locale videe.";
}

async function clearLocalNotes() {
  const memoryApi = getMemoryApi();
  if (!memoryApi) return "Notes locales indisponibles. Lancez JARVIS avec npm start.";
  await memoryApi.clearNotes();
  await refreshLocalMemory();
  updateOrganizationDashboard();
  return "Notes locales videes.";
}

function setOrganizationBadge(active = true) {
  if (!organizationModeBadge) return;
  organizationModeBadge.hidden = !active;
}

function updateOrganizationDashboard() {
  const openTasks = taskEntries.filter((task) => task.status !== "completed");
  const priorities = openTasks.filter((task) => task.priority === "high");
  const openReminders = reminderEntries.filter((reminder) => !reminder.done);

  if (taskCount) taskCount.textContent = String(openTasks.length);
  if (priorityCount) priorityCount.textContent = String(priorities.length);
  if (reminderCount) reminderCount.textContent = String(openReminders.length);
  if (latestNoteOrg) latestNoteOrg.textContent = noteEntries[0] ? noteEntries[0].content : "Aucune note locale";
  setOrganizationBadge(true);
  updateCommandCenterStatus();
}

async function refreshOrganization() {
  const organizationApi = getOrganizationApi();
  if (!organizationApi) {
    updateOrganizationDashboard();
    updateBriefingDashboard();
    return;
  }

  try {
    const [taskResult, reminderResult] = await Promise.all([
      organizationApi.listTasks(),
      organizationApi.listReminders()
    ]);
    taskEntries = taskResult && Array.isArray(taskResult.tasks) ? taskResult.tasks : [];
    reminderEntries = reminderResult && Array.isArray(reminderResult.reminders) ? reminderResult.reminders : [];
    updateOrganizationDashboard();
    updateBriefingDashboard();
  } catch (_error) {
    if (latestNoteOrg) latestNoteOrg.textContent = "Organisation locale indisponible";
  }
}

async function addLocalTask(title, options = {}) {
  const organizationApi = getOrganizationApi();
  if (!organizationApi) return "Organisation locale indisponible. Lancez JARVIS avec npm start.";
  const result = await organizationApi.addTask(title, options);
  await refreshOrganization();
  return result && result.ok ? "Tache ajoutee monsieur." : result.message || "Tache locale indisponible.";
}

async function listLocalTasks() {
  await refreshOrganization();
  const openTasks = taskEntries.filter((task) => task.status !== "completed");
  return openTasks.length
    ? `Voici vos taches en cours.\n${formatTaskList(openTasks, "")}`
    : "Aucune tache en cours, monsieur.";
}

async function listTodayTasks() {
  const organizationApi = getOrganizationApi();
  if (!organizationApi) return "Organisation locale indisponible. Lancez JARVIS avec npm start.";
  const result = await organizationApi.getTodayTasks();
  const tasks = result && Array.isArray(result.tasks) ? result.tasks : [];
  return tasks.length
    ? `Voici les taches prevues aujourd'hui.\n${formatTaskList(tasks, "")}`
    : "Aucune tache prevue aujourd'hui, monsieur.";
}

async function completeLocalTask(query) {
  const organizationApi = getOrganizationApi();
  if (!organizationApi) return "Organisation locale indisponible. Lancez JARVIS avec npm start.";
  await refreshOrganization();
  const task = findTextMatch(taskEntries.filter((item) => item.status !== "completed"), query, "title");
  if (!task) return `Je n'ai trouve aucune tache correspondant a "${query}".`;
  await organizationApi.completeTask(task.id);
  await refreshOrganization();
  return "Tache terminee monsieur.";
}

async function deleteLocalTask(query) {
  const organizationApi = getOrganizationApi();
  if (!organizationApi) return "Organisation locale indisponible. Lancez JARVIS avec npm start.";
  await refreshOrganization();
  const task = findTextMatch(taskEntries, query, "title");
  if (!task) return `Je n'ai trouve aucune tache correspondant a "${query}".`;
  await organizationApi.deleteTask(task.id);
  await refreshOrganization();
  return "Tache supprimee.";
}

async function clearLocalTasks() {
  const organizationApi = getOrganizationApi();
  if (!organizationApi) return "Organisation locale indisponible. Lancez JARVIS avec npm start.";
  await organizationApi.clearTasks();
  await refreshOrganization();
  return "Liste de taches videe.";
}

async function saveLocalPriority(query) {
  const organizationApi = getOrganizationApi();
  if (!organizationApi) return "Organisation locale indisponible. Lancez JARVIS avec npm start.";
  await refreshOrganization();
  const task = findTextMatch(taskEntries.filter((item) => item.status !== "completed"), query, "title");
  if (task) {
    await organizationApi.setTaskPriority(task.id, "high");
  } else {
    await organizationApi.addTask(query, { priority: "high" });
  }
  await refreshOrganization();
  return "Priorite enregistree monsieur.";
}

async function listLocalPriorities() {
  await refreshOrganization();
  const priorities = taskEntries.filter((task) => task.status !== "completed" && task.priority === "high");
  return priorities.length
    ? `Voici vos priorites.\n${formatTaskList(priorities, "")}`
    : "Aucune priorite haute enregistree.";
}

async function searchLocalNotes(query) {
  const memoryApi = getMemoryApi();
  if (!memoryApi || typeof memoryApi.searchNotes !== "function") return "Recherche de notes indisponible.";
  const result = await memoryApi.searchNotes(query);
  const notes = result && Array.isArray(result.notes) ? result.notes : [];
  return notes.length
    ? `Resultats notes pour "${query}" :\n${formatMemoryList(notes, "")}`
    : `Aucune note trouvee pour "${query}".`;
}

async function deleteLocalNote(query) {
  const memoryApi = getMemoryApi();
  if (!memoryApi || typeof memoryApi.deleteNote !== "function") return "Suppression de note indisponible.";
  await refreshLocalMemory();
  const note = findTextMatch(noteEntries, query, "content");
  if (!note) return `Je n'ai trouve aucune note correspondant a "${query}".`;
  await memoryApi.deleteNote(note.id);
  await refreshLocalMemory();
  updateOrganizationDashboard();
  return "Note supprimee.";
}

async function addLocalReminderFromCommand(command) {
  const organizationApi = getOrganizationApi();
  if (!organizationApi) return "Organisation locale indisponible. Lancez JARVIS avec npm start.";
  const parsed = parseReminderCommand(command);
  const result = await organizationApi.addReminder(parsed.title, parsed.remindAt);
  await refreshOrganization();
  return result && result.ok ? parsed.message : result.message || "Rappel local indisponible.";
}

async function listLocalReminders() {
  await refreshOrganization();
  const reminders = reminderEntries.filter((reminder) => !reminder.done);
  return reminders.length
    ? `Voici vos rappels.\n${formatReminderList(reminders, "")}`
    : "Aucun rappel actif, monsieur.";
}

async function deleteLocalReminder(query) {
  const organizationApi = getOrganizationApi();
  if (!organizationApi) return "Organisation locale indisponible. Lancez JARVIS avec npm start.";
  await refreshOrganization();
  const reminder = findTextMatch(reminderEntries, query, "title");
  if (!reminder) return `Je n'ai trouve aucun rappel correspondant a "${query}".`;
  await organizationApi.deleteReminder(reminder.id);
  await refreshOrganization();
  return "Rappel supprime.";
}

async function clearLocalReminders() {
  const organizationApi = getOrganizationApi();
  if (!organizationApi) return "Organisation locale indisponible. Lancez JARVIS avec npm start.";
  await organizationApi.clearReminders();
  await refreshOrganization();
  return "Rappels vides.";
}

async function buildTodayDashboard() {
  await Promise.all([refreshLocalMemory(), refreshOrganization(), refreshPlanningData()]);
  const openTasks = taskEntries.filter((task) => task.status !== "completed").slice(0, 5);
  const priorities = taskEntries.filter((task) => task.status !== "completed" && task.priority === "high").slice(0, 3);
  const reminders = reminderEntries.filter((reminder) => !reminder.done).slice(0, 3);
  const todayPlanning = planningEntries.filter((item) => item.date === getLocalDateKey()).slice(0, 3);
  const date = new Date();

  return [
    "Voici votre tableau de bord du jour, monsieur.",
    `Date : ${date.toLocaleDateString("fr-FR")}. Heure : ${date.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}.`,
    `Taches en cours : ${openTasks.length ? openTasks.map((task) => task.title).join(", ") : "aucune"}.`,
    `Priorites : ${priorities.length ? priorities.map((task) => task.title).join(", ") : "aucune"}.`,
    `Rappels : ${reminders.length ? reminders.map((reminder) => reminder.title).join(", ") : "aucun"}.`,
    `Planning : ${todayPlanning.length ? todayPlanning.map((item) => `${item.time || "--:--"} ${item.title}`).join(", ") : "aucun element"}.`,
    `Derniere note : ${noteEntries[0] ? noteEntries[0].content : "aucune note locale"}.`
  ].join("\n");
}

async function checkDueReminders() {
  if (!automationSettings.automaticReminders) return;
  const organizationApi = getOrganizationApi();
  if (!organizationApi || typeof organizationApi.getDueReminders !== "function") return;

  try {
    const result = await organizationApi.getDueReminders();
    const dueReminders = result && Array.isArray(result.reminders) ? result.reminders : [];
    if (!dueReminders.length) return;

    await refreshOrganization();
    dueReminders.forEach((reminder) => {
      const message = `Rappel monsieur : ${reminder.title}`;
      respondDisplay(message, message);
      addHistory("rappel du", message);
      if ("Notification" in window && window.Notification.permission === "granted") {
        new window.Notification("JARVIS - Rappel", { body: reminder.title });
      } else if ("Notification" in window && window.Notification.permission === "default") {
        window.Notification.requestPermission().then((permission) => {
          if (permission === "granted") new window.Notification("JARVIS - Rappel", { body: reminder.title });
        });
      }
    });
  } catch (_error) {
    // Verification silencieuse : l'interface reste utilisable si le stockage local est occupe.
  }
}

function updateBriefingBadge(active = true) {
  if (!briefingModeBadge) return;
  briefingModeBadge.hidden = !active;
}

function updateBriefingDashboard() {
  const today = getLocalDateKey();
  const openTasks = taskEntries.filter((task) => task.status !== "completed");
  const priorities = openTasks.filter((task) => task.priority === "high");
  const reminders = reminderEntries.filter((reminder) => !reminder.done);
  const todayPlanning = planningEntries
    .filter((item) => item.date === today)
    .sort((a, b) => (a.time || "99:99").localeCompare(b.time || "99:99"));
  const runningFocus = focusSessionEntries.find((session) => session.status === "running");
  const todayLog = dailyLogEntries.find((log) => log.date === today);

  if (briefingDate) briefingDate.textContent = new Date().toLocaleDateString("fr-FR", { weekday: "long", day: "2-digit", month: "long" });
  if (briefingPriority) briefingPriority.textContent = priorities[0] ? priorities[0].title : openTasks[0] ? openTasks[0].title : "Aucune priorite";
  if (briefingTaskCount) briefingTaskCount.textContent = String(openTasks.length);
  if (briefingReminderCount) briefingReminderCount.textContent = String(reminders.length);
  if (briefingNextPlanning) briefingNextPlanning.textContent = todayPlanning[0] ? `${todayPlanning[0].time || "--:--"} - ${todayPlanning[0].title}` : "Aucun element aujourd'hui";
  if (briefingFocus) briefingFocus.textContent = runningFocus ? `${runningFocus.duration} min en cours` : "Aucune session active";
  if (bilanSummary) bilanSummary.textContent = todayLog && todayLog.summary ? todayLog.summary : "Aucun resume pour aujourd'hui";
  if (bilanWins) bilanWins.textContent = todayLog && todayLog.wins.length ? todayLog.wins.join(" | ") : "Aucune victoire notee";
  if (bilanBlockers) bilanBlockers.textContent = todayLog && todayLog.blockers.length ? todayLog.blockers.join(" | ") : "Aucun blocage note";
  updateBriefingBadge(true);
  updateCommandCenterStatus();
}

async function refreshPlanningData() {
  const api = getPlanningApi();
  if (!api) {
    updateBriefingDashboard();
    return;
  }

  try {
    const [planningResult, logResult, focusResult] = await Promise.all([
      api.listPlanning(),
      api.listDailyLogs(),
      api.listFocusSessions()
    ]);
    planningEntries = planningResult && Array.isArray(planningResult.planning) ? planningResult.planning : [];
    dailyLogEntries = logResult && Array.isArray(logResult.dailyLogs) ? logResult.dailyLogs : [];
    focusSessionEntries = focusResult && Array.isArray(focusResult.focusSessions) ? focusResult.focusSessions : [];
    const runningFocus = focusSessionEntries.find((session) => session.status === "running");
    activeFocusSessionId = runningFocus ? runningFocus.id : "";
    updateBriefingDashboard();
  } catch (_error) {
    if (briefingNextPlanning) briefingNextPlanning.textContent = "Briefing indisponible";
  }
}

function updateAnalyticsDashboard() {
  const summary = analyticsSummary || {};
  const weekly = weeklySummary || {};
  const productivity = productivityScore || { score: 0 };

  if (analyticsTotalTasks) analyticsTotalTasks.textContent = `${summary.completedTasks || 0}/${summary.totalTasks || 0}`;
  if (analyticsPriorities) analyticsPriorities.textContent = String(summary.activePriorities || 0);
  if (analyticsReminders) analyticsReminders.textContent = `${summary.activeReminders || 0} actifs`;
  if (analyticsFocus) analyticsFocus.textContent = `${summary.focusMinutes || 0} min`;
  if (analyticsNotes) analyticsNotes.textContent = String(summary.notes || 0);
  if (analyticsPlanning) analyticsPlanning.textContent = String(summary.todayPlanning || 0);
  if (analyticsScore) analyticsScore.textContent = `${productivity.score || 0}/100`;
  if (analyticsScoreLabel) analyticsScoreLabel.textContent = productivity.score >= 70 ? "Bonne dynamique" : productivity.score >= 45 ? "A consolider" : "A structurer";
  if (analyticsLastActivity) analyticsLastActivity.textContent = `Derniere activite : ${formatLastActivity(summary.lastActivity)}`;
  if (analyticsScoreRing) analyticsScoreRing.style.setProperty("--score", `${productivity.score || 0}%`);

  if (weeklyCompletedTasks) weeklyCompletedTasks.textContent = String(weekly.completedTasks || 0);
  if (weeklyFocusSessions) weeklyFocusSessions.textContent = String(weekly.focusSessions || 0);
  if (weeklyFocusMinutes) weeklyFocusMinutes.textContent = `${weekly.focusMinutes || 0} min`;
  if (weeklyNotes) weeklyNotes.textContent = String(weekly.notesCreated || 0);
  if (weeklyLogs) weeklyLogs.textContent = String(weekly.dailyLogs || 0);
  if (weeklyPriorities) weeklyPriorities.textContent = String(weekly.remainingPriorities || 0);
  if (analyticsModeBadge) analyticsModeBadge.hidden = false;
  updateCommandCenterStatus();
}

async function refreshAnalytics() {
  const api = getAnalyticsApi();
  if (!api) {
    updateAnalyticsDashboard();
    return;
  }

  try {
    const [summaryResult, weeklyResult, productivityResult] = await Promise.all([
      api.getAnalyticsSummary(),
      api.getWeeklySummary(),
      api.getProductivityScore()
    ]);
    analyticsSummary = summaryResult && summaryResult.summary ? summaryResult.summary : null;
    weeklySummary = weeklyResult && weeklyResult.weekly ? weeklyResult.weekly : null;
    productivityScore = productivityResult && productivityResult.productivity ? productivityResult.productivity : null;
    updateAnalyticsDashboard();
  } catch (_error) {
    if (analyticsLastActivity) analyticsLastActivity.textContent = "Analytics indisponibles";
  }
}

async function showDashboardSummary() {
  await refreshAnalytics();
  return [
    "Voici votre dashboard personnel, monsieur.",
    formatAnalyticsSummary(analyticsSummary),
    productivityScore ? productivityScore.message : ""
  ].filter(Boolean).join("\n");
}

async function showStatsSummary() {
  await refreshAnalytics();
  return formatAnalyticsSummary(analyticsSummary);
}

async function showProductivityScore() {
  await refreshAnalytics();
  return formatProductivityScore(productivityScore);
}

async function showWeeklySummary() {
  await refreshAnalytics();
  return formatWeeklySummary(weeklySummary);
}

async function showProgressionSummary() {
  await refreshAnalytics();
  return buildProgressionSummary();
}

async function askAnalyticsAnalysis(command) {
  const api = getAiApi();
  if (!api) return "IA locale indisponible. Lancez JARVIS avec npm start.";
  await Promise.all([refreshLocalMemory(), refreshOrganization(), refreshPlanningData(), refreshAnalytics()]);
  const todayLog = dailyLogEntries.find((log) => log.date === getLocalDateKey());
  const prompt = [
    "Tu es JARVIS. Analyse les statistiques locales en francais.",
    "Reponds avec 3 observations maximum et 3 recommandations maximum. Ton clair, direct, utile.",
    `Demande utilisateur : ${command}`,
    `Stats : ${JSON.stringify(analyticsSummary || {})}`,
    `Semaine : ${JSON.stringify(weeklySummary || {})}`,
    `Score : ${productivityScore ? productivityScore.score : 0}/100`,
    `Taches : ${taskEntries.filter((task) => task.status !== "completed").slice(0, 5).map((task) => task.title).join(" | ") || "aucune"}`,
    `Priorites : ${taskEntries.filter((task) => task.status !== "completed" && task.priority === "high").slice(0, 3).map((task) => task.title).join(" | ") || "aucune"}`,
    `Rappels : ${reminderEntries.filter((reminder) => !reminder.done).slice(0, 3).map((reminder) => reminder.title).join(" | ") || "aucun"}`,
    `Planning : ${planningEntries.filter((item) => item.date === getLocalDateKey()).slice(0, 5).map((item) => `${item.time || "--:--"} ${item.title}`).join(" | ") || "aucun"}`,
    `Bilan : ${todayLog ? todayLog.summary : "aucun"}`
  ].join("\n");

  await askAiForCommand(prompt, normalizeCommand(command));
  return "";
}

function updateAutomationDashboard() {
  if (automationStartupStatus) automationStartupStatus.textContent = automationLabel(automationSettings.startupBriefing);
  if (automationWorkStatus) automationWorkStatus.textContent = automationLabel(automationSettings.workModeAutomation);
  if (automationRemindersStatus) automationRemindersStatus.textContent = automationLabel(automationSettings.automaticReminders);
  if (automationEveningStatus) automationEveningStatus.textContent = automationLabel(automationSettings.eveningRoutine);
  if (automationFocusStatus) automationFocusStatus.textContent = automationLabel(automationSettings.focusAutomation);
  if (automationSummary) automationSummary.textContent = hasActiveAutomation() ? "Automatisations locales pretes" : "Aucune automatisation active.";
  if (automationModeBadge) automationModeBadge.hidden = !hasActiveAutomation();
  document.querySelectorAll("[data-automation-key]").forEach((button) => {
    const key = button.dataset.automationKey;
    const nextValue = !Boolean(automationSettings[key]);
    button.textContent = nextValue ? "Activer" : "Desactiver";
    button.dataset.automationValue = String(nextValue);
  });
  updateCommandCenterStatus();
}

async function refreshAutomationSettings() {
  const api = getAutomationApi();
  if (!api) {
    updateAutomationDashboard();
    return;
  }

  try {
    const result = await api.getAutomationSettings();
    if (result && result.automations) automationSettings = { ...automationSettings, ...result.automations };
    updateAutomationDashboard();
  } catch (_error) {
    if (automationSummary) automationSummary.textContent = "Automatisations indisponibles";
  }
}

async function setAutomationSetting(key, value) {
  const api = getAutomationApi();
  if (!api) return "Automatisations indisponibles. Lancez JARVIS avec npm start.";
  const result = await api.updateAutomationSetting(key, value);
  if (result && result.automations) automationSettings = { ...automationSettings, ...result.automations };
  updateAutomationDashboard();
  return result && result.ok ? "" : result.message || "Automatisation indisponible.";
}

async function toggleAutomation(key, value, enabledMessage, disabledMessage) {
  const errorMessage = await setAutomationSetting(key, value);
  if (errorMessage) return errorMessage;
  return value ? enabledMessage : disabledMessage;
}

async function resetAutomationSettingsLocal() {
  const api = getAutomationApi();
  if (!api) return "Automatisations indisponibles. Lancez JARVIS avec npm start.";
  const result = await api.resetAutomationSettings();
  if (result && result.automations) automationSettings = { ...automationSettings, ...result.automations };
  updateAutomationDashboard();
  return "Automatisations reinitialisees.";
}

async function runStartupAutomation() {
  await refreshAutomationSettings();
  if (!automationSettings.startupBriefing || automationSettings.lastStartupBriefingDate === getLocalDateKey()) return;
  const message = await buildMorningBriefing();
  respondDisplay(`${message}\n\nMode travail disponible si vous souhaitez lancer une session structuree.`, "Briefing de demarrage lance monsieur.");
  addHistory("briefing demarrage", message);
  await setAutomationSetting("lastStartupBriefingDate", getLocalDateKey());
}

async function runEveningAutomationIfNeeded() {
  await refreshAutomationSettings();
  const now = new Date();
  if (!automationSettings.eveningRoutine || automationSettings.lastEveningRoutineDate === getLocalDateKey()) return;
  if (now.getHours() < 20 || (now.getHours() === 20 && now.getMinutes() < 30)) return;
  const message = await buildEveningBriefing();
  respondDisplay(`${message}\n\nVous pouvez dire : bilan journee ... pour enregistrer le resume.`, "Routine soir automatique disponible monsieur.");
  addHistory("routine soir automatique", message);
  await setAutomationSetting("lastEveningRoutineDate", getLocalDateKey());
}

async function buildAutomatedWorkModeMessage() {
  await Promise.all([refreshOrganization(), refreshPlanningData()]);
  const priorities = taskEntries.filter((task) => task.status !== "completed" && task.priority === "high");
  const todayTasks = taskEntries.filter((task) => task.status !== "completed").slice(0, 5);
  const toolsMessage = await openWorkTools();
  return [
    "Mode travail automatique active, monsieur.",
    `Priorites : ${priorities.length ? priorities.slice(0, 3).map((task) => task.title).join(", ") : "aucune priorite haute"}.`,
    `Taches du jour : ${todayTasks.length ? todayTasks.map((task) => task.title).join(", ") : "aucune tache en cours"}.`,
    toolsMessage,
    "Session focus de 25 minutes disponible avec focus 25."
  ].join("\n");
}

async function askAutomationAdvice(command) {
  const api = getAiApi();
  if (!api) return "IA locale indisponible. Lancez JARVIS avec npm start.";
  await Promise.all([refreshAutomationSettings(), refreshOrganization(), refreshPlanningData()]);
  const prompt = [
    "Tu es JARVIS. Propose au maximum 3 recommandations d'automatisation locale, claires et utiles.",
    `Automatisations : ${JSON.stringify(automationSettings)}`,
    `Taches : ${taskEntries.filter((task) => task.status !== "completed").slice(0, 5).map((task) => task.title).join(" | ") || "aucune"}`,
    `Priorites : ${taskEntries.filter((task) => task.status !== "completed" && task.priority === "high").slice(0, 3).map((task) => task.title).join(" | ") || "aucune"}`,
    `Planning aujourd'hui : ${planningEntries.filter((item) => item.date === getLocalDateKey()).slice(0, 5).map((item) => `${item.time || "--:--"} ${item.title}`).join(" | ") || "aucun"}`,
    "Routines disponibles : briefing demarrage, mode travail, rappels automatiques, routine soir, focus automatique.",
    `Demande utilisateur : ${command}`
  ].join("\n");
  await askAiForCommand(prompt, normalizeCommand(command));
  return "";
}

function scrollToPanel(panelId) {
  const panel = $(panelId);
  if (!panel) return "Section introuvable.";
  panel.scrollIntoView({ behavior: "smooth", block: "start" });
  panel.classList.add("is-highlighted");
  window.setTimeout(() => panel.classList.remove("is-highlighted"), 1600);
  return "Section affichee, monsieur.";
}

function updateNavState(targetId) {
  document.querySelectorAll(".left-sidebar [data-command-center-tab]").forEach((button) => {
    button.classList.remove("is-active");
  });
  document.querySelectorAll("[data-nav-target]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.navTarget === targetId);
  });
}

function navigateToSection(targetId, response = "Navigation effectuee, monsieur.") {
  updateNavState(targetId);
  const message = scrollToPanel(targetId);
  return message === "Section introuvable." ? message : response;
}

function activateModuleByKey(moduleKey) {
  const labels = {
    work: "Module travail active.",
    sport: "Module sport active.",
    watch: "Module veille IA active.",
    finance: "Module finance active.",
    routines: "Module routines active.",
    apps: "Module applications rapides active."
  };
  setActiveModule(moduleKey, "Module actif");
  scrollToPanel("modules-panel");
  return labels[moduleKey] || "Module active.";
}

async function setAllAutomations(value) {
  const keys = ["startupBriefing", "workModeAutomation", "automaticReminders", "eveningRoutine", "focusAutomation"];
  for (const key of keys) {
    await setAutomationSetting(key, value);
  }
  return value ? "Toutes les automatisations sont activees, monsieur." : "Toutes les automatisations sont desactivees.";
}

async function memorySummary() {
  await refreshLocalMemory();
  return [
    "Resume memoire locale.",
    `Memoires : ${memoryEntries.length}. Notes : ${noteEntries.length}.`,
    `Derniere memoire : ${memoryEntries[0] ? memoryEntries[0].content : "aucune"}.`,
    `Derniere note : ${noteEntries[0] ? noteEntries[0].content : "aucune"}.`
  ].join("\n");
}

async function runJarvisDiagnostic() {
  await Promise.all([refreshLocalMemory(), refreshOrganization(), refreshAutomationSettings(), refreshAnalytics(), refreshNotificationCenter()]);
  let ollamaStatus = "indisponible";
  const api = getAiApi();
  if (api && typeof api.getOllamaStatus === "function") {
    try {
      const status = await api.getOllamaStatus();
      ollamaStatus = status && status.ok ? "disponible" : "indisponible";
    } catch (_error) {
      ollamaStatus = "indisponible";
    }
  }

  return [
    `Diagnostic JARVIS ${APP_VERSION}.`,
    `Electron actif : ${getDesktopApi() ? "oui" : "non"}.`,
    `Ollama : ${ollamaStatus}.`,
    `Memoire locale : ${getMemoryApi() ? "active" : "indisponible"} (${memoryEntries.length} memoire(s), ${noteEntries.length} note(s)).`,
    `Taches : ${taskEntries.length}. Rappels : ${reminderEntries.length}.`,
    `Automatisations actives : ${hasActiveAutomation() ? "oui" : "non"}.`,
    `Mode proactif : ${proactiveStatus.backgroundActive ? "actif" : "inactif"}, ${notificationEntries.filter((item) => !item.readAt).length} notification(s) non lue(s).`,
    `Derniere activite : ${analyticsSummary ? formatLastActivity(analyticsSummary.lastActivity) : "inconnue"}.`
  ].join("\n");
}

async function globalSearch(query) {
  const safeQuery = normalizeCommand(query);
  if (!safeQuery) return "Recherche vide. Precisez un terme, monsieur.";
  await Promise.all([refreshLocalMemory(), refreshOrganization(), refreshPlanningData(), refreshNotificationCenter()]);
  const matchText = (text) => normalizeCommand(text || "").includes(safeQuery);
  const groups = [
    ["Memoire", memoryEntries.filter((item) => matchText(item.content)).map((item) => item.content)],
    ["Notes", noteEntries.filter((item) => matchText(item.content)).map((item) => item.content)],
    ["Taches", taskEntries.filter((item) => matchText(item.title)).map((item) => item.title)],
    ["Rappels", reminderEntries.filter((item) => matchText(item.title)).map((item) => item.title)],
    ["Planning", planningEntries.filter((item) => matchText(item.title)).map((item) => `${item.date} ${item.time || "--:--"} ${item.title}`)],
    ["Notifications", notificationEntries.filter((item) => matchText(item.title) || matchText(item.message)).map((item) => item.message)],
    ["Historique", historyEntries.filter((item) => matchText(item.command) || matchText(item.response)).map((item) => item.command)]
  ];
  const lines = groups
    .filter(([, items]) => items.length)
    .flatMap(([label, items]) => [`${label} :`, ...items.slice(0, 5).map((item) => `- ${item}`)]);

  return lines.length ? `Resultats pour "${query}" :\n${lines.join("\n")}` : `Aucun resultat trouve pour "${query}".`;
}

async function confirmTotalReset() {
  if (!pendingTotalReset) return "Aucune demande de reset total en attente.";
  pendingTotalReset = false;
  const memoryApi = getMemoryApi();
  const organizationApi = getOrganizationApi();
  const planningApi = getPlanningApi();
  if (memoryApi) {
    await memoryApi.clearMemory();
    await memoryApi.clearNotes();
  }
  if (organizationApi) {
    await organizationApi.clearTasks();
    await organizationApi.clearReminders();
  }
  if (planningApi) {
    await planningApi.clearPlanning();
    await planningApi.clearDailyLogs();
    await planningApi.clearFocusSessions();
  }
  const proactiveApi = getProactiveApi();
  if (proactiveApi && typeof proactiveApi.clearNotifications === "function") {
    await proactiveApi.clearNotifications();
  }
  clearHistory();
  await resetAutomationSettingsLocal();
  await Promise.all([refreshLocalMemory(), refreshOrganization(), refreshPlanningData(), refreshAnalytics(), refreshNotificationCenter()]);
  return "Reset total confirme. Donnees locales videes.";
}

async function askCommandCenterHelp(command) {
  const api = getAiApi();
  if (!api) return "IA locale indisponible. Lancez JARVIS avec npm start.";
  await Promise.all([refreshAutomationSettings(), refreshOrganization(), refreshLocalMemory(), refreshAnalytics()]);
  const prompt = [
    "Tu es JARVIS. Explique clairement comment utiliser Jarvis sans etre trop long.",
    "Reponse structuree, utile, orientee centre de commandes.",
    `Modules : ${Object.values(MODULE_LABELS).join(", ")}`,
    `Automatisations actives : ${hasActiveAutomation() ? "oui" : "non"}`,
    `Organisation : ${taskEntries.filter((task) => task.status !== "completed").length} taches en cours, ${reminderEntries.filter((reminder) => !reminder.done).length} rappels actifs`,
    `Memoire : ${memoryEntries.length} memoires, ${noteEntries.length} notes`,
    `Systeme : ${getDesktopApi() ? "Electron actif" : "mode navigateur"}, version ${APP_VERSION}`,
    `Demande : ${command}`
  ].join("\n");
  await askAiForCommand(prompt, normalizeCommand(command));
  return "";
}

async function addLocalPlanning(command) {
  const api = getPlanningApi();
  if (!api) return "Planning local indisponible. Lancez JARVIS avec npm start.";
  const item = parsePlanningCommand(command);
  const result = await api.addPlanningItem(item);
  await refreshPlanningData();
  return result && result.ok ? "Element ajoute au planning, monsieur." : result.message || "Planning local indisponible.";
}

async function listLocalPlanning(onlyToday = false) {
  const api = getPlanningApi();
  if (!api) return "Planning local indisponible. Lancez JARVIS avec npm start.";
  const result = onlyToday ? await api.getTodayPlanning() : await api.listPlanning();
  const planning = result && Array.isArray(result.planning) ? result.planning : [];
  await refreshPlanningData();
  return planning.length
    ? `${onlyToday ? "Voici votre planning du jour." : "Voici votre planning enregistre."}\n${formatPlanningList(planning, "")}`
    : onlyToday ? "Aucun element prevu aujourd'hui." : "Aucun element de planning enregistre.";
}

async function clearLocalPlanning() {
  const api = getPlanningApi();
  if (!api) return "Planning local indisponible. Lancez JARVIS avec npm start.";
  await api.clearPlanning();
  await refreshPlanningData();
  return "Planning vide.";
}

async function addLocalDailyLog(summary) {
  const api = getPlanningApi();
  if (!api) return "Bilan local indisponible. Lancez JARVIS avec npm start.";
  const result = await api.addDailyLog({ date: getLocalDateKey(), summary });
  await refreshPlanningData();
  return result && result.ok ? "Bilan de journee enregistre monsieur." : result.message || "Bilan local indisponible.";
}

async function addDailyLogItem(type, content) {
  const api = getPlanningApi();
  if (!api) return "Bilan local indisponible. Lancez JARVIS avec npm start.";
  const payload = { date: getLocalDateKey(), wins: [], blockers: [] };
  if (type === "win") payload.wins = [content];
  if (type === "blocker") payload.blockers = [content];
  const result = await api.addDailyLog(payload);
  await refreshPlanningData();
  return result && result.ok
    ? type === "win" ? "Victoire ajoutee au bilan du jour." : "Blocage ajoute au bilan du jour."
    : result.message || "Bilan local indisponible.";
}

async function showTodayDailyLog() {
  const api = getPlanningApi();
  if (!api) return "Bilan local indisponible. Lancez JARVIS avec npm start.";
  const result = await api.getTodayDailyLog();
  await refreshPlanningData();
  return result && result.log
    ? `Voici le resume enregistre pour aujourd'hui.\n${formatDailyLog(result.log)}`
    : "Aucun resume enregistre pour aujourd'hui. Vous pouvez dire : bilan journee ...";
}

async function listFocusSessionsLocal() {
  const api = getPlanningApi();
  if (!api) return "Sessions focus indisponibles. Lancez JARVIS avec npm start.";
  const result = await api.listFocusSessions();
  const sessions = result && Array.isArray(result.focusSessions) ? result.focusSessions : [];
  await refreshPlanningData();
  return sessions.length ? `Sessions focus enregistrees :\n${formatFocusSessions(sessions, "")}` : "Aucune session focus enregistree.";
}

async function buildMorningBriefing() {
  await Promise.all([refreshLocalMemory(), refreshOrganization(), refreshPlanningData()]);
  const todayPlanning = planningEntries.filter((item) => item.date === getLocalDateKey());
  const openTasks = taskEntries.filter((task) => task.status !== "completed");
  const priorities = openTasks.filter((task) => task.priority === "high");
  const reminders = reminderEntries.filter((reminder) => !reminder.done);
  const mainPriority = priorities[0] || openTasks[0];
  const now = new Date();

  return [
    "Routine du matin lancee monsieur. Voici votre briefing.",
    `Date : ${now.toLocaleDateString("fr-FR")}. Heure : ${now.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}.`,
    `Taches du jour : ${openTasks.length ? openTasks.slice(0, 5).map((task) => task.title).join(", ") : "aucune"}.`,
    `Priorites : ${priorities.length ? priorities.slice(0, 3).map((task) => task.title).join(", ") : "aucune"}.`,
    `Rappels actifs : ${reminders.length ? reminders.slice(0, 3).map((reminder) => reminder.title).join(", ") : "aucun"}.`,
    `Planning du jour : ${todayPlanning.length ? todayPlanning.slice(0, 3).map((item) => `${item.time || "--:--"} ${item.title}`).join(", ") : "aucun element"}.`,
    `Priorite principale suggeree : ${mainPriority ? mainPriority.title : "definir une tache importante"}`
  ].join("\n");
}

async function buildEveningBriefing() {
  await Promise.all([refreshLocalMemory(), refreshOrganization(), refreshPlanningData()]);
  const completedTasks = taskEntries.filter((task) => task.status === "completed").slice(0, 5);
  const openTasks = taskEntries.filter((task) => task.status !== "completed").slice(0, 5);
  const todayNotes = noteEntries.filter((note) => note.createdAt && note.createdAt.slice(0, 10) === getLocalDateKey()).slice(0, 5);
  const reminders = reminderEntries.filter((reminder) => !reminder.done).slice(0, 5);

  return [
    "Routine du soir lancee. Faisons le point sur la journee.",
    `Taches terminees : ${completedTasks.length ? completedTasks.map((task) => task.title).join(", ") : "aucune"}.`,
    `Taches restantes : ${openTasks.length ? openTasks.map((task) => task.title).join(", ") : "aucune"}.`,
    `Notes du jour : ${todayNotes.length ? todayNotes.map((note) => note.content).join(" | ") : "aucune"}.`,
    `Rappels non termines : ${reminders.length ? reminders.map((reminder) => reminder.title).join(", ") : "aucun"}.`,
    "Question de bilan : qu'est-ce qui a avance aujourd'hui, et quelle est la prochaine action utile ?"
  ].join("\n");
}

async function askLocalActionPlan(command) {
  const api = getAiApi();
  if (!api) return "IA locale indisponible. Lancez JARVIS avec npm start.";
  await Promise.all([refreshLocalMemory(), refreshOrganization(), refreshPlanningData()]);
  const prompt = [
    "Tu es JARVIS. Propose un plan d'action local en francais, court, structure, avec 3 a 5 actions maximum.",
    "Contexte local :",
    `Memoires : ${memoryEntries.slice(0, 5).map((item) => item.content).join(" | ") || "aucune"}`,
    `Taches : ${taskEntries.filter((item) => item.status !== "completed").slice(0, 5).map((item) => item.title).join(" | ") || "aucune"}`,
    `Priorites : ${taskEntries.filter((item) => item.status !== "completed" && item.priority === "high").slice(0, 3).map((item) => item.title).join(" | ") || "aucune"}`,
    `Rappels : ${reminderEntries.filter((item) => !item.done).slice(0, 3).map((item) => item.title).join(" | ") || "aucun"}`,
    `Planning aujourd'hui : ${planningEntries.filter((item) => item.date === getLocalDateKey()).slice(0, 5).map((item) => `${item.time || "--:--"} ${item.title}`).join(" | ") || "aucun"}`,
    `Demande utilisateur : ${command}`
  ].join("\n");

  await askAiForCommand(prompt, normalizeCommand(command));
  return "";
}

function setAiVisualStatus(label, detail, state = "active") {
  if (aiState) aiState.textContent = label;
  if (aiDetail) aiDetail.textContent = detail;
  if (aiModeBadge) {
    aiModeBadge.textContent = label.toUpperCase();
    aiModeBadge.hidden = false;
  }
  app.classList.toggle("is-ai-thinking", state === "thinking");
  app.classList.toggle("is-ai-error", state === "error");
}

function setAiMode(enabled, detail = "") {
  isAiFallbackEnabled = enabled;
  const label = enabled ? "IA locale : Ollama" : "IA locale pausee";
  const statusDetail = detail || (enabled ? "Questions naturelles envoyees a Ollama" : "Commandes locales uniquement");
  setAiVisualStatus(label, statusDetail, enabled ? "active" : "paused");
}

function getAiHelpMessage() {
  return "Mode IA locale : les commandes connues restent executees localement. Les questions naturelles ou demandes inconnues sont envoyees a Ollama sur votre PC. Utilisez test ia pour verifier la connexion, modele ia pour afficher le modele, et ollama statut pour tester le service.";
}

async function askAiForCommand(command, historyCommand = command) {
  const api = getAiApi();

  if (!api) {
    const unavailableMessage = isMobileExperience()
      ? "L'IA locale Ollama est disponible sur la version desktop. Une passerelle mobile pourra etre ajoutee plus tard."
      : "Module IA locale indisponible. Lancez JARVIS avec npm start dans Electron.";
    setAiVisualStatus("Ollama indisponible", "Pont IA locale indisponible", "error");
    respond(unavailableMessage);
    addHistory(historyCommand, unavailableMessage);
    input.value = "";
    return;
  }

  isAiThinking = true;
  sendBtn.disabled = true;
  input.disabled = true;
  stopSpeech();
  setAiVisualStatus("Réflexion en cours", "IA locale en réflexion...", "thinking");
  setSystemStatus("Réflexion en cours", "Ollama actif");
  responseBox.textContent = "IA locale en réflexion...";
  pulseResponse();

  try {
    const aiResponse = await api.askOllama(command);
    const message = typeof aiResponse === "string" && aiResponse.trim()
      ? aiResponse.trim()
      : "Reponse IA locale vide.";
    const isError = message.startsWith("Ollama ne semble pas") || message.startsWith("Le modèle IA local") || message.startsWith("Erreur IA locale");
    setAiVisualStatus(isError ? "Ollama indisponible" : "Ollama connecté", isError ? "Action requise" : "Réponse IA reçue", isError ? "error" : "active");
    setSystemStatus(isError ? "Ollama indisponible" : "Ollama connecté", isError ? "Vérification requise" : "IA locale active");
    respond(message);
    addHistory(historyCommand, message);
  } catch (error) {
    const message = `Erreur IA locale. ${error.message || "La demande n'a pas pu etre traitee."}`;
    setAiVisualStatus("Ollama indisponible", "Connexion interrompue", "error");
    setSystemStatus("Ollama indisponible", "Connexion interrompue");
    respond(message);
    addHistory(historyCommand, message);
  } finally {
    isAiThinking = false;
    sendBtn.disabled = false;
    input.disabled = false;
    input.value = "";
    input.focus();
  }
}

async function runDesktopAction(methodName, successMessage, ...args) {
  const desktop = getDesktopApi();
  if (!desktop || typeof desktop[methodName] !== "function") {
    return getDesktopOnlyMessage();
  }

  try {
    const result = await desktop[methodName](...args);
    return result && result.ok === false
      ? `Action desktop impossible : ${result.message || "operation refusee"}.`
      : successMessage;
  } catch (error) {
    return `Action desktop impossible : ${error.message || "erreur inconnue"}.`;
  }
}

async function openExternalUrl(url, successMessage) {
  const desktop = getDesktopApi();
  if (desktop && typeof desktop.openUrl === "function") {
    try {
      const result = await desktop.openUrl(url);
      return result && result.ok === false
        ? `Ouverture impossible : ${result.message || "lien refuse"}.`
        : successMessage;
    } catch (error) {
      return `Ouverture impossible : ${error.message || "erreur inconnue"}.`;
    }
  }

  window.open(url, "_blank");
  return successMessage;
}

function openQuickLink(linkKey, successMessage) {
  const url = QUICK_LINKS[linkKey];
  return url ? openExternalUrl(url, successMessage) : Promise.resolve("Lien rapide introuvable.");
}

function formatSystemLabel(label) {
  const cleaned = label.replace(/^Systeme\s+/i, "");
  return cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
}

function setSystemStatus(label, detail = "Noyau stable") {
  statusText.textContent = label;
  systemState.textContent = formatSystemLabel(label);
  systemDetail.textContent = detail;
}

function setVoiceStatus(label, detail = "Micro inactif") {
  voiceState.textContent = label;
  voiceDetail.textContent = detail;
}

function setMicroStatus(status, detail = "") {
  microphoneStatus = status;
  const labels = {
    unknown: "Non teste",
    testing: "Test en cours",
    available: "Disponible",
    unavailable: "Indisponible",
    listening: "Ecoute en cours",
    error: "Erreur"
  };
  const accessLabels = {
    unknown: "Diagnostic",
    testing: "Diagnostic",
    available: "Accessible",
    unavailable: "Bloque",
    listening: "Actif",
    error: "Erreur"
  };

  if (microState) microState.textContent = labels[status] || labels.unknown;
  if (microDetail) microDetail.textContent = detail || "Commande : test micro";
  if (microAccess) microAccess.textContent = accessLabels[status] || accessLabels.unknown;
  if (voiceBtn) voiceBtn.classList.toggle("is-testing", status === "testing");
  if (app) {
    app.classList.toggle("is-micro-listening", status === "listening");
    app.classList.toggle("is-micro-testing", status === "testing");
    app.classList.toggle("is-micro-error", status === "error" || status === "unavailable");
  }
}

function setSpeechRecognitionStatus(status, detail = "") {
  speechRecognitionStatus = status;
  const labels = {
    idle: "En attente",
    available: "Disponible",
    unavailable: "Indisponible",
    listening: "Ecoute active",
    error: "Erreur"
  };

  if (speechRecognitionState) speechRecognitionState.textContent = labels[status] || labels.idle;
  if (speechRecognitionDetail) speechRecognitionDetail.textContent = detail || "Web Speech non lance";
}

function setVoiceError(message = "") {
  lastVoiceError = message;
  if (voiceErrorState) voiceErrorState.textContent = message || "Aucune erreur";
}

function hasWebSpeechRecognition() {
  return Boolean(window.SpeechRecognition || window.webkitSpeechRecognition);
}

function formatSystemInfo(info) {
  if (!info || info.ok === false) return "Impossible de lire les informations systeme pour le moment.";
  return `Infos systeme : ${info.platform} ${info.release}, architecture ${info.arch}, machine ${info.hostname}. CPU : ${info.cpuCount} coeur(s), ${info.cpuModel}. Memoire : ${info.freeMemoryGb} Go libres sur ${info.totalMemoryGb} Go. Electron ${info.electron}, Chrome ${info.chrome}.`;
}

function getSelectedVoice() {
  return availableVoices[selectedVoiceIndex] || null;
}

function updateVoiceSummary() {
  const selectedVoice = getSelectedVoice();
  const name = selectedVoice ? selectedVoice.name : "Voix navigateur";
  const lang = selectedVoice && selectedVoice.lang ? ` (${selectedVoice.lang})` : "";

  voiceName.textContent = name;
  voiceSettingsSummary.textContent = `Vitesse ${currentSpeechRate.toFixed(2)} / Pitch ${currentSpeechPitch.toFixed(2)} / Volume ${currentSpeechVolume.toFixed(2)}`;
  speechRateValue.textContent = currentSpeechRate.toFixed(2);
  speechPitchValue.textContent = currentSpeechPitch.toFixed(2);
  speechVolumeValue.textContent = currentSpeechVolume.toFixed(2);
  speechRate.value = currentSpeechRate;
  speechPitch.value = currentSpeechPitch;
  speechVolume.value = currentSpeechVolume;
  setVoiceStatus("Repos", `${name}${lang}`);
}

function populateVoiceSelect() {
  voiceSelect.innerHTML = "";

  if (!availableVoices.length) {
    const option = document.createElement("option");
    option.value = "";
    option.textContent = "Voix par defaut du navigateur";
    voiceSelect.append(option);
    updateVoiceSummary();
    return;
  }

  availableVoices.forEach((voice, index) => {
    const option = document.createElement("option");
    option.value = String(index);
    option.textContent = `${voice.name} - ${voice.lang}`;
    voiceSelect.append(option);
  });

  voiceSelect.value = String(selectedVoiceIndex);
  updateVoiceSummary();
}

function loadBrowserVoices() {
  if (!("speechSynthesis" in window)) {
    populateVoiceSelect();
    return;
  }

  availableVoices = window.speechSynthesis.getVoices();
  const defaultIndex = availableVoices.findIndex((voice) => voice.default);
  const preferredIndex = availableVoices.findIndex((voice) => {
    return voice.name === preferredVoiceName && (!preferredVoiceLang || voice.lang === preferredVoiceLang);
  });

  if (!voiceProfileInitialized || selectedVoiceIndex >= availableVoices.length) {
    selectedVoiceIndex = preferredIndex >= 0 ? preferredIndex : defaultIndex >= 0 ? defaultIndex : 0;
    voiceProfileInitialized = true;
  }

  populateVoiceSelect();
}

function changeVoice(step = 1) {
  if (!availableVoices.length) return "Aucune voix alternative n'est disponible dans ce navigateur pour le moment.";

  selectedVoiceIndex = (selectedVoiceIndex + step + availableVoices.length) % availableVoices.length;
  voiceSelect.value = String(selectedVoiceIndex);
  const selectedVoice = getSelectedVoice();
  preferredVoiceName = selectedVoice.name;
  preferredVoiceLang = selectedVoice.lang || "";
  updateVoiceSummary();
  saveSettings("Voix sauvegardee");
  return `Je m'en occupe. Nouvelle voix active : ${selectedVoice.name}.`;
}

function setDefaultVoiceProfile(shouldPersist = true) {
  const defaultIndex = availableVoices.findIndex((voice) => voice.default);
  selectedVoiceIndex = defaultIndex >= 0 ? defaultIndex : 0;
  currentSpeechRate = DEFAULT_SETTINGS.speechRate;
  currentSpeechPitch = DEFAULT_SETTINGS.speechPitch;
  currentSpeechVolume = DEFAULT_SETTINGS.speechVolume;
  const selectedVoice = getSelectedVoice();
  preferredVoiceName = selectedVoice ? selectedVoice.name : "";
  preferredVoiceLang = selectedVoice ? selectedVoice.lang || "" : "";
  voiceSelect.value = availableVoices.length ? String(selectedVoiceIndex) : "";
  updateVoiceSummary();
  if (shouldPersist) saveSettings("Profil vocal sauvegarde");
}

function changeSpeechRate(delta) {
  currentSpeechRate = Math.max(0.7, Math.min(1.4, Number((currentSpeechRate + delta).toFixed(2))));
  updateVoiceSummary();
  saveSettings("Vitesse sauvegardee");
  return currentSpeechRate.toFixed(2);
}

function setSpeechPitch(value) {
  currentSpeechPitch = Math.max(0.6, Math.min(1.4, Number(value.toFixed(2))));
  updateVoiceSummary();
  saveSettings("Pitch sauvegarde");
  return currentSpeechPitch.toFixed(2);
}

function setResponding(active) {
  responseBox.classList.toggle("is-responding", active);
  app.classList.toggle("is-responding", active);
}

function pulseResponse() {
  setResponding(false);
  window.setTimeout(() => setResponding(true), 20);
  window.setTimeout(() => setResponding(false), 950);
}

function setSpeaking(active) {
  core.classList.toggle("is-speaking", active);
  app.classList.toggle("is-speaking", active);

  if (active) {
    coreLabel.textContent = "TALK";
    setVoiceStatus("Synthese", "Assistant en parole");
  } else if (!isListening) {
    coreLabel.textContent = "ONLINE";
    setVoiceStatus("Repos", "Micro inactif");
  }
}

function setListening(active) {
  isListening = active;
  core.classList.toggle("is-listening", active);
  app.classList.toggle("is-listening", active);
  voiceBtn.classList.toggle("is-listening", active);

  if (active) {
    voiceBtn.classList.remove("is-error");
    coreLabel.textContent = "LISTEN";
    setSystemStatus("Ecoute en cours...", "Canal vocal ouvert");
    setVoiceStatus("Ecoute", "Micro actif");
    setMicroStatus("listening", "Flux audio actif");
    setSpeechRecognitionStatus("listening", "Ecoute en cours...");
    return;
  }

  coreLabel.textContent = core.classList.contains("is-speaking") ? "TALK" : "ONLINE";
  setSystemStatus(isWorkMode ? "Mode travail active" : "Systeme en ligne", isWorkMode ? "Animations reduites" : "Noyau stable");
  if (!core.classList.contains("is-speaking")) setVoiceStatus("Repos", "Micro inactif");
  if (microphoneStatus === "listening") setMicroStatus("available", "Micro disponible");
  if (speechRecognitionStatus === "listening") setSpeechRecognitionStatus("idle", "Web Speech en attente");
}

function stopSpeech() {
  speechToken += 1;
  if ("speechSynthesis" in window) window.speechSynthesis.cancel();
  setSpeaking(false);
}

function speak(text) {
  const token = ++speechToken;
  setSpeaking(true);

  if (!("speechSynthesis" in window)) {
    window.setTimeout(() => {
      if (token === speechToken) setSpeaking(false);
    }, 900);
    return;
  }

  const utterance = new SpeechSynthesisUtterance(text);
  const selectedVoice = getSelectedVoice();
  utterance.lang = selectedVoice ? selectedVoice.lang || "fr-FR" : "fr-FR";
  utterance.voice = selectedVoice || null;
  utterance.rate = currentSpeechRate;
  utterance.pitch = currentSpeechPitch;
  utterance.volume = currentSpeechVolume;
  utterance.onend = () => {
    if (token === speechToken) setSpeaking(false);
  };
  utterance.onerror = () => {
    if (token === speechToken) setSpeaking(false);
  };

  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
}

function respond(message, shouldSpeak = true) {
  responseBox.textContent = message;
  pulseResponse();
  if (shouldSpeak) speak(message);
}

function respondDisplay(displayMessage, spokenMessage) {
  responseBox.textContent = displayMessage;
  pulseResponse();
  if (spokenMessage) speak(spokenMessage);
}

function createHistoryItem(entry) {
  const item = document.createElement("li");
  const timeElement = document.createElement("span");
  const contentElement = document.createElement("div");
  const commandElement = document.createElement("div");
  const responseElement = document.createElement("div");

  item.className = "history-item";
  timeElement.className = "history-time";
  commandElement.className = "history-command";
  responseElement.className = "history-response";
  timeElement.textContent = entry.time;
  commandElement.textContent = `> ${entry.command}`;
  responseElement.textContent = entry.response;
  contentElement.append(commandElement, responseElement);
  item.append(timeElement, contentElement);
  return item;
}

function renderHistory() {
  historyList.innerHTML = "";
  historyEntries.forEach((entry) => historyList.append(createHistoryItem(entry)));
}

function saveHistory() {
  writeJsonStorage(HISTORY_STORAGE_KEY, historyEntries.slice(0, HISTORY_LIMIT));
}

function loadStoredHistory() {
  const storedHistory = readJsonStorage(HISTORY_STORAGE_KEY, []);
  historyEntries = Array.isArray(storedHistory)
    ? storedHistory
        .filter((entry) => entry && typeof entry.command === "string" && typeof entry.response === "string")
        .slice(0, HISTORY_LIMIT)
    : [];
  renderHistory();
}

function addHistory(command, response) {
  const time = new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
  historyEntries.unshift({ command, response, time });
  historyEntries = historyEntries.slice(0, HISTORY_LIMIT);
  renderHistory();
  saveHistory();
}

function clearHistory() {
  historyEntries = [];
  renderHistory();
  saveHistory();
}

function updateClock() {
  const now = new Date();
  currentTime.textContent = now.toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  });
  currentDate.textContent = now.toLocaleDateString("fr-FR", {
    weekday: "short",
    day: "2-digit",
    month: "short"
  });
}

function setMetric(name, value) {
  const metric = metricElements[name];
  if (!Number.isFinite(value)) {
    metric.bar.style.width = "0%";
    metric.value.textContent = "--";
    return;
  }
  const safeValue = Math.max(0, Math.min(100, Math.round(value)));
  metric.bar.style.width = `${safeValue}%`;
  metric.value.textContent = `${safeValue}%`;
}

async function updateMetrics() {
  const api = getDesktopApi();
  if (!api || typeof api.getSystemMetrics !== "function") {
    setMetric("cpu", null);
    setMetric("memory", null);
    metricElements.network.value.textContent = "Desktop";
    return null;
  }

  try {
    const metrics = await api.getSystemMetrics();
    setMetric("cpu", metrics.cpuPercent);
    setMetric("memory", metrics.memoryPercent);
    metricElements.network.value.textContent = metrics.lanAvailable ? "Connecte" : "Indisponible";
    return metrics;
  } catch (error) {
    console.error("Mesures systeme indisponibles :", error);
    setMetric("cpu", null);
    setMetric("memory", null);
    metricElements.network.value.textContent = "Indisponible";
    return null;
  }
}

async function updateFocusCard() {
  if (!focusInterval) {
    focusState.textContent = "Inactif";
    focusDetail.textContent = "Aucun minuteur actif";
    updateBriefingDashboard();
    return;
  }

  const remaining = Math.max(0, Math.ceil((focusEndsAt - Date.now()) / 1000));
  const minutes = String(Math.floor(remaining / 60)).padStart(2, "0");
  const seconds = String(remaining % 60).padStart(2, "0");
  focusState.textContent = `${minutes}:${seconds}`;
  focusDetail.textContent = "Session de concentration";
  updateBriefingDashboard();

  if (remaining <= 0) {
    await completeActiveFocusSession("completed");
    stopFocusTimer();
    respond("Session focus terminee. Vous pouvez faire une pause de 5 minutes.");
  }
}

async function startFocusTimer(duration = 25) {
  if (activeFocusSessionId) await completeActiveFocusSession("cancelled");
  stopFocusTimer(false);
  const safeDuration = Math.max(1, Math.min(180, Number(duration) || 25));
  const api = getPlanningApi();
  if (automationSettings.focusAutomation && api && typeof api.addFocusSession === "function") {
    const result = await api.addFocusSession({ duration: safeDuration, startedAt: new Date().toISOString() });
    activeFocusSessionId = result && result.session ? result.session.id : "";
    await refreshPlanningData();
  }
  focusEndsAt = Date.now() + safeDuration * 60 * 1000;
  focusInterval = window.setInterval(updateFocusCard, 1000);
  updateFocusCard();
  setSystemStatus("Mode focus actif", `Minuteur ${safeDuration} minutes`);
}

function stopFocusTimer(resetCard = true) {
  if (focusInterval) window.clearInterval(focusInterval);
  focusInterval = null;
  focusEndsAt = 0;
  if (resetCard) updateFocusCard();
}

async function completeActiveFocusSession(status = "completed") {
  const api = getPlanningApi();
  if (!api || !activeFocusSessionId || typeof api.completeFocusSession !== "function") return;
  await api.completeFocusSession(activeFocusSessionId, status);
  activeFocusSessionId = "";
  await refreshPlanningData();
}

async function cancelActiveFocusSession() {
  if (!focusInterval && !activeFocusSessionId) return "Aucune session focus active.";
  await completeActiveFocusSession("cancelled");
  stopFocusTimer();
  return "Session focus arretee.";
}

function setWorkMode(active, shouldPersist = true) {
  isWorkMode = active;
  app.classList.toggle("is-work-mode", active);
  workModeBadge.hidden = !active;
  if (active) setSystemStatus("Mode travail active", "Animations reduites");
  if (shouldPersist) saveSettings(active ? "Mode travail sauvegarde" : "Mode standard sauvegarde");
}

function setModuleStatus(moduleKey, message) {
  if (moduleStatusElements[moduleKey]) moduleStatusElements[moduleKey].textContent = message;
}

function setActiveModule(moduleKey, statusMessage = "Module actif") {
  activeModuleKey = moduleKey;
  moduleCards.forEach((card) => card.classList.toggle("is-active", card.dataset.moduleCard === moduleKey));

  if (!moduleKey) return;
  const label = MODULE_LABELS[moduleKey] || "Module";
  activeModuleBadge.textContent = `MODULE ${label.toUpperCase()}`;
  activeModuleBadge.hidden = false;
  moduleSummary.textContent = `${label} actif`;
  setModuleStatus(moduleKey, statusMessage);
}

function showModulesPanel() {
  modulesPanel.classList.add("is-highlighted");
  modulesPanel.scrollIntoView({ behavior: "smooth", block: "start" });
  window.setTimeout(() => modulesPanel.classList.remove("is-highlighted"), 1800);
}

function returnHomeView() {
  activeModuleKey = "";
  activeModuleBadge.hidden = true;
  moduleSummary.textContent = "Accueil actif";
  moduleCards.forEach((card) => card.classList.remove("is-active", "is-resting"));
  setSystemStatus(isWorkMode ? "Mode travail active" : "Systeme en ligne", isWorkMode ? "Animations reduites" : "Noyau stable");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function buildMorningRoutine() {
  const now = new Date();
  const time = now.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
  const date = now.toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric"
  });
  const suggestion = isWorkMode
    ? "Suggestion : gardez le mode travail actif et lancez focus pour une session de concentration."
    : "Suggestion : commencez par vos priorites, puis lancez mode travail ou focus si vous voulez une session concentree.";
  return `Routine du matin : il est ${time}. Nous sommes le ${date}. Statut systeme : ${systemState.textContent}. ${suggestion}`;
}

function buildWorkPriorities() {
  return "Priorites du jour : definir une tache principale, traiter les messages importants, reserver un bloc focus, puis verifier les livrables en fin de session.";
}

function buildSportSession() {
  return "Seance du jour : echauffement 8 minutes, pompes ou developpe 4 series, squats 4 series, gainage 3 series, retour au calme 5 minutes. Hydratation et progression controlee.";
}

function buildWatchIdeas() {
  return "Pistes IA : automatiser une tache repetitive, comparer assistants vocaux locaux, creer un mini workflow no-code pour gagner du temps.";
}

function buildLinkedInIdea() {
  return "Idee LinkedIn : raconter comment un assistant personnel local peut aider a structurer une journee sans dependance a une API externe.";
}

function buildFinanceSummary() {
  return "Finance : suivez vos depenses, verifiez votre epargne, controlez vos investissements et gardez vos objectifs visibles. Ceci reste un suivi general, pas un conseil financier personnalise.";
}

function buildEveningRoutine() {
  return "Routine soir : bilan rapide de la journee, notez une victoire, preparez la priorite de demain, puis deconnexion progressive.";
}

function buildDailyCheck() {
  return "Check journee : quelles sont les trois priorites restantes, quel est votre niveau d'energie, quelle tache merite un bloc focus maintenant ?";
}

function moduleListMessage() {
  return "Modules disponibles : Travail, Sport, Veille IA, Finance, Routines, Apps rapides.";
}

function stopRestTimer(resetCard = true) {
  if (restTimerInterval) window.clearInterval(restTimerInterval);
  restTimerInterval = null;
  restEndsAt = 0;

  if (resetCard) {
    setModuleStatus("sport", "Pret");
    $("module-card-sport").classList.remove("is-resting");
  }
}

function updateRestTimer() {
  if (!restTimerInterval) return;
  const remaining = Math.max(0, Math.ceil((restEndsAt - Date.now()) / 1000));
  setModuleStatus("sport", `Repos : ${remaining}s`);

  if (remaining <= 0) {
    stopRestTimer(false);
    setModuleStatus("sport", "Repos termine");
    $("module-card-sport").classList.remove("is-resting");
    respond("Timer repos termine. Reprise possible.");
  }
}

function startRestTimer() {
  stopRestTimer(false);
  setActiveModule("sport", "Repos : 90s");
  $("module-card-sport").classList.add("is-resting");
  restEndsAt = Date.now() + 90 * 1000;
  restTimerInterval = window.setInterval(updateRestTimer, 1000);
  updateRestTimer();
}

async function openWorkTools() {
  setActiveModule("work", "Ouverture outils");
  setWorkMode(true);
  const results = await Promise.all([
    openQuickLink("google", "Navigateur pret."),
    openQuickLink("github", "GitHub ouvert."),
    openQuickLink("calendar", "Calendrier ouvert.")
  ]);
  const failed = results.some((result) => result.startsWith("Ouverture impossible"));
  return failed
    ? "Module travail active, mais un outil n'a pas pu etre ouvert."
    : "Module travail active. Je prepare votre environnement.";
}

async function openAppShortcut(target) {
  setActiveModule("apps", "Raccourci lance");

  if (target === "documents") {
    return runDesktopAction("openFolder", "Je m'en occupe. Ouverture du dossier Documents.", "documents");
  }

  if (target === "desktop") {
    return runDesktopAction("openFolder", "Je m'en occupe. Ouverture du Bureau Windows.", "desktop");
  }

  const messages = {
    google: "Je m'en occupe. Ouverture de Google.",
    youtube: "Je m'en occupe. Ouverture de YouTube.",
    github: "Je m'en occupe. Ouverture de GitHub.",
    calendar: "Je m'en occupe. Ouverture du calendrier."
  };

  return openQuickLink(target, messages[target] || "Raccourci ouvert.");
}

function buildStatusReport() {
  const focusText = focusInterval ? `focus actif (${focusState.textContent} restantes)` : "focus inactif";
  const desktopText = getDesktopApi() ? "desktop Electron actif" : "mode navigateur";
  const workModeText = isWorkMode ? "mode travail actif" : "mode travail inactif";
  const aiText = isAiFallbackEnabled ? `IA locale Ollama active (${LOCAL_AI_MODEL})` : "IA locale en pause";
  const moduleText = activeModuleKey ? `module ${MODULE_LABELS[activeModuleKey]} actif` : "aucun module actif";
  const restText = restTimerInterval ? `repos sport actif (${moduleStatusElements.sport.textContent})` : "repos sport inactif";
  return `Statut complet : ${systemState.textContent}. Vocal : ${voiceState.textContent}. ${desktopText}. ${workModeText}. ${aiText}. ${moduleText}. CPU ${metricElements.cpu.value.textContent}, memoire ${metricElements.memory.value.textContent}, LAN ${metricElements.network.value.textContent}. ${focusText}. ${restText}. Historique : ${historyEntries.length} entree(s).`;
}

function clearTimedSequences() {
  analysisTimers.forEach((timer) => window.clearTimeout(timer));
  veilleTimers.forEach((timer) => window.clearTimeout(timer));
  analysisTimers = [];
  veilleTimers = [];
}

async function startAnalysisMode() {
  clearTimedSequences();
  coreLabel.textContent = "SCAN";
  setSystemStatus("Mesures en cours...", "Lecture locale");
  const metrics = await updateMetrics();
  coreLabel.textContent = "ONLINE";
  if (!metrics) {
    setSystemStatus("Mesures indisponibles", "Version desktop requise");
    respond("Les mesures systeme sont disponibles uniquement dans JARVIS desktop.");
    return;
  }
  setSystemStatus("Mesures actualisees", "CPU, memoire et LAN locaux");
  respond(`Mesures locales : CPU ${metricElements.cpu.value.textContent}, memoire ${metricElements.memory.value.textContent}, LAN ${metricElements.network.value.textContent}. Ce controle ne remplace pas un diagnostic Windows.`);
}

function startWatchMode() {
  clearTimedSequences();
  setActiveModule("watch", "Veille active");
  coreLabel.textContent = "WATCH";
  setSystemStatus("Veille active", "Priorites locales en analyse");
  respond("Je reste en veille. Analyse des signaux importants en cours.");

  ["Verification agenda local simulee...", "Priorites detectees : focus, maintenance, commandes vocales.", "Alerte critique : aucune. Systeme disponible."].forEach((text, index) => {
    const timer = window.setTimeout(() => {
      responseBox.textContent = text;
      pulseResponse();
    }, 900 + index * 900);
    veilleTimers.push(timer);
  });

  veilleTimers.push(window.setTimeout(() => {
    coreLabel.textContent = "ONLINE";
    setSystemStatus("Systeme en ligne", "Veille terminee");
    respond("Veille terminee. Rien d'urgent a signaler.");
  }, 3900));
}

function buildSettingsPayload() {
  const selectedVoice = getSelectedVoice();
  return {
    voiceName: selectedVoice ? selectedVoice.name : preferredVoiceName,
    voiceLang: selectedVoice ? selectedVoice.lang : preferredVoiceLang,
    speechRate: currentSpeechRate,
    speechPitch: currentSpeechPitch,
    speechVolume: currentSpeechVolume,
    preferences: { workMode: isWorkMode }
  };
}

function saveSettings(statusMessage = "Reglages sauvegardes") {
  const saved = writeJsonStorage(SETTINGS_STORAGE_KEY, buildSettingsPayload());
  setSettingsStatus(saved ? statusMessage : "Sauvegarde indisponible");
  return saved;
}

function loadStoredSettings() {
  const storedSettings = readJsonStorage(SETTINGS_STORAGE_KEY, DEFAULT_SETTINGS);
  const preferences = storedSettings.preferences || {};
  currentSpeechRate = clampNumber(storedSettings.speechRate, 0.7, 1.4, DEFAULT_SETTINGS.speechRate);
  currentSpeechPitch = clampNumber(storedSettings.speechPitch, 0.6, 1.4, DEFAULT_SETTINGS.speechPitch);
  currentSpeechVolume = clampNumber(storedSettings.speechVolume, 0, 1, DEFAULT_SETTINGS.speechVolume);
  preferredVoiceName = typeof storedSettings.voiceName === "string" ? storedSettings.voiceName : "";
  preferredVoiceLang = typeof storedSettings.voiceLang === "string" ? storedSettings.voiceLang : "";
  setWorkMode(Boolean(preferences.workMode), false);
}

function resetSettingsToDefault(shouldPersist = true) {
  preferredVoiceName = "";
  preferredVoiceLang = "";
  currentSpeechRate = DEFAULT_SETTINGS.speechRate;
  currentSpeechPitch = DEFAULT_SETTINGS.speechPitch;
  currentSpeechVolume = DEFAULT_SETTINGS.speechVolume;
  setDefaultVoiceProfile(false);
  setWorkMode(false, false);
  updateVoiceSummary();
  if (shouldPersist) saveSettings("Reglages reinitialises");
  else setSettingsStatus("Reglages par defaut");
}

function resetInterface() {
  clearTimedSequences();
  stopFocusTimer();
  stopRestTimer();
  stopSpeech();
  clearHistory();
  input.value = "";
  setDefaultVoiceProfile();
  setWorkMode(false);
  setAiMode(true, "Questions naturelles envoyees a Ollama");
  returnHomeView();
  coreLabel.textContent = "ONLINE";
  setListening(false);
  setResponding(false);
  setSystemStatus("Systeme en ligne", "Noyau stable");
  setVoiceStatus("Repos", "Micro inactif");
  responseBox.textContent = "Bonjour monsieur. Systeme pret.";
  updateClock();
  updateMetrics();
}

function commandListMessage() {
  return `Commandes disponibles : ${availableCommands.join(", ")}.`;
}

async function handleCommand(command) {
  const cleanCommand = normalizeCommand(command);
  if (!cleanCommand) return;
  if (isAiThinking) return;

  let message = "";

  if (cleanCommand === "mode standard") {
    message = await activateInterfaceMode("standard");
  } else if (cleanCommand === "mode travail") {
    message = await activateInterfaceMode("work");
  } else if (cleanCommand === "mode focus") {
    message = await activateInterfaceMode("focus");
  } else if (cleanCommand === "mode nuit") {
    message = await activateInterfaceMode("night");
  } else if (cleanCommand === "mode sport") {
    message = await activateInterfaceMode("sport");
  } else if (cleanCommand === "mode ia") {
    message = await activateInterfaceMode("ai");
  } else if (cleanCommand === "mode hud" || cleanCommand === "full hud") {
    message = await activateInterfaceMode("hud");
  } else if (cleanCommand === "mode actuel") {
    message = `Mode actif : ${MODE_LABELS[interfacePreferences.activeMode] || "Standard"}. Theme : ${interfacePreferences.theme}. Animations : ${interfacePreferences.reducedMotion || !interfacePreferences.animations ? "reduites" : "actives"}.`;
  } else if (cleanCommand === "reset mode") {
    message = await resetInterfaceMode();
  } else if (cleanCommand === "reduis animations") {
    message = await setReducedMotionPreference(true);
  } else if (cleanCommand === "active animations") {
    message = await setReducedMotionPreference(false);
  } else if (cleanCommand === "theme cyan") {
    message = await activateTheme("cyan");
  } else if (cleanCommand === "theme bleu") {
    message = await activateTheme("blue");
  } else if (cleanCommand === "theme vert") {
    message = await activateTheme("green");
  } else if (cleanCommand === "theme violet") {
    message = await activateTheme("violet");
  } else if (cleanCommand === "test micro") {
    const result = await testMicro(false);
    message = result.message;
  } else if (cleanCommand === "statut micro") {
    message = getMicroStatusMessage();
  } else if (cleanCommand === "aide vocale") {
    message = getVoiceHelpMessage();
  } else if (cleanCommand === "redemarre ecoute" || cleanCommand === "redemarre l'ecoute") {
    message = await restartVoiceRecognition();
  } else if (cleanCommand === "version mobile") {
    if (isDesktopElectron()) {
      await openBridgeOnboarding();
      message = await getBridgeStatusMessage("status");
    } else {
      message = getMobileVersionMessage();
    }
  } else if (cleanCommand === "mode mobile") {
    updateMobileMode();
    message = isMobileModeActive
      ? "Mode mobile actif. Interface tactile optimisee."
      : "Mode mobile pret. Il s'activera automatiquement sur ecran mobile.";
  } else if (cleanCommand === "installer jarvis") {
    message = await requestPwaInstall();
  } else if (cleanCommand === "statut web") {
    message = getWebStatusMessage();
  } else if (cleanCommand === "deploiement") {
    message = getDeploymentMessage();
  } else if (cleanCommand === "debug mobile") {
    message = getMobileDebugMessage();
  } else if (cleanCommand === "rafraichir mobile") {
    message = refreshMobileInterface();
  } else if (cleanCommand === "bridge statut") {
    message = await getBridgeStatusMessage("status");
  } else if (cleanCommand === "adresse bridge") {
    message = await getBridgeStatusMessage("address");
  } else if (cleanCommand === "code bridge") {
    message = await getBridgeStatusMessage("code");
  } else if (cleanCommand === "nouveau code bridge") {
    message = await rotateBridgePairingCode();
  } else if (cleanCommand === "aide bridge") {
    message = getBridgeHelpMessage();
  } else if (cleanCommand === "fonctionnalites mobile") {
    message = getMobileFeaturesMessage();
  } else if (cleanCommand === "fonctionnalites desktop") {
    message = getDesktopFeaturesMessage();
  } else if (cleanCommand === "aide") {
    message = `Bien recu monsieur. ${commandListMessage()}`;
  } else if (cleanCommand.startsWith("souviens-toi que ") || cleanCommand.startsWith("souviens toi que ")) {
    const memoryContent = command.trim().replace(/^souviens[- ]toi\s+que\s+/i, "").trim();
    message = await addLocalMemory(memoryContent);
  } else if (cleanCommand.startsWith("note ")) {
    const noteContent = command.trim().slice(5).trim();
    message = await addLocalNote(noteContent);
  } else if (cleanCommand === "affiche memoire") {
    message = await listLocalMemories();
    respondDisplay(message, memoryEntries.length ? "Voici les informations enregistrees dans ma memoire locale." : message);
    addHistory(cleanCommand, message);
    input.value = "";
    return;
  } else if (cleanCommand === "qu'est-ce que tu sais sur moi" || cleanCommand === "qu’est-ce que tu sais sur moi" || cleanCommand === "quest-ce que tu sais sur moi") {
    message = await listLocalMemories();
  } else if (cleanCommand.startsWith("cherche memoire ")) {
    const query = command.trim().replace(/^cherche\s+m[ée]moire\s+/i, "").trim();
    message = await searchLocalMemory(query);
    respondDisplay(message, "Voici les resultats trouves dans ma memoire locale.");
    addHistory(cleanCommand, message);
    input.value = "";
    return;
  } else if (cleanCommand.startsWith("oublie ")) {
    const query = command.trim().slice(7).trim();
    message = await forgetLocalMemory(query);
  } else if (cleanCommand === "vide memoire") {
    message = await clearLocalMemory();
  } else if (cleanCommand === "affiche notes") {
    message = await listLocalNotes();
    respondDisplay(message, noteEntries.length ? "Voici les notes locales." : message);
    addHistory(cleanCommand, message);
    input.value = "";
    return;
  } else if (cleanCommand.startsWith("cherche note ")) {
    const query = command.trim().replace(/^cherche\s+note\s+/i, "").trim();
    message = await searchLocalNotes(query);
    respondDisplay(message, "Voici les resultats trouves dans vos notes locales.");
    addHistory(cleanCommand, message);
    input.value = "";
    return;
  } else if (cleanCommand.startsWith("supprime note ")) {
    const query = command.trim().replace(/^supprime\s+note\s+/i, "").trim();
    message = await deleteLocalNote(query);
  } else if (cleanCommand === "vide notes") {
    message = await clearLocalNotes();
  } else if (cleanCommand.startsWith("ajoute tache ")) {
    const title = command.trim().replace(/^ajoute\s+t[âa]che\s+/i, "").trim();
    message = await addLocalTask(title);
  } else if (cleanCommand === "mes taches") {
    message = await listLocalTasks();
    respondDisplay(message, "Voici vos taches en cours.");
    addHistory(cleanCommand, message);
    input.value = "";
    return;
  } else if (cleanCommand === "taches du jour") {
    message = await listTodayTasks();
    respondDisplay(message, "Voici les taches prevues aujourd'hui.");
    addHistory(cleanCommand, message);
    input.value = "";
    return;
  } else if (cleanCommand.startsWith("termine tache ")) {
    const query = command.trim().replace(/^termine\s+t[âa]che\s+/i, "").trim();
    message = await completeLocalTask(query);
  } else if (cleanCommand.startsWith("supprime tache ")) {
    const query = command.trim().replace(/^supprime\s+t[âa]che\s+/i, "").trim();
    message = await deleteLocalTask(query);
  } else if (cleanCommand === "vide taches") {
    message = await clearLocalTasks();
  } else if (cleanCommand.startsWith("priorite ")) {
    const query = command.trim().replace(/^priorit[ée]\s+/i, "").trim();
    message = await saveLocalPriority(query);
  } else if (cleanCommand === "mes priorites") {
    message = await listLocalPriorities();
    respondDisplay(message, "Voici vos priorites.");
    addHistory(cleanCommand, message);
    input.value = "";
    return;
  } else if (cleanCommand.startsWith("rappel dans ") || cleanCommand.startsWith("rappelle-moi ") || cleanCommand.startsWith("rappelle moi ")) {
    message = await addLocalReminderFromCommand(command);
  } else if (cleanCommand === "mes rappels") {
    message = await listLocalReminders();
    respondDisplay(message, "Voici vos rappels.");
    addHistory(cleanCommand, message);
    input.value = "";
    return;
  } else if (cleanCommand.startsWith("supprime rappel ")) {
    const query = command.trim().replace(/^supprime\s+rappel\s+/i, "").trim();
    message = await deleteLocalReminder(query);
  } else if (cleanCommand === "vide rappels") {
    message = await clearLocalReminders();
  } else if (cleanCommand === "aujourd'hui" || cleanCommand === "aujourd’hui") {
    message = await buildTodayDashboard();
    respondDisplay(message, "Voici votre tableau de bord du jour, monsieur.");
    addHistory(cleanCommand, message);
    input.value = "";
    return;
  } else if (cleanCommand.startsWith("ajoute planning ")) {
    message = await addLocalPlanning(command);
  } else if (cleanCommand === "planning") {
    message = await listLocalPlanning(false);
    respondDisplay(message, "Voici votre planning enregistre.");
    addHistory(cleanCommand, message);
    input.value = "";
    return;
  } else if (cleanCommand === "planning du jour") {
    message = await listLocalPlanning(true);
    respondDisplay(message, "Voici votre planning du jour.");
    addHistory(cleanCommand, message);
    input.value = "";
    return;
  } else if (cleanCommand === "vide planning") {
    message = await clearLocalPlanning();
  } else if (cleanCommand === "routine matin" || cleanCommand === "routine du matin") {
    setActiveModule("routines", "Routine matin");
    message = await buildMorningBriefing();
    respondDisplay(message, "Routine du matin lancee monsieur. Voici votre briefing.");
    addHistory(cleanCommand, message);
    input.value = "";
    return;
  } else if (cleanCommand === "routine soir") {
    setActiveModule("routines", "Routine soir");
    message = await buildEveningBriefing();
    respondDisplay(message, "Routine du soir lancee. Faisons le point sur la journee.");
    addHistory(cleanCommand, message);
    input.value = "";
    return;
  } else if (cleanCommand.startsWith("bilan journee ")) {
    const summary = command.trim().replace(/^bilan\s+journ[Ã©e]e\s+/i, "").trim();
    message = await addLocalDailyLog(summary);
  } else if (cleanCommand === "resume journee") {
    message = await showTodayDailyLog();
    respondDisplay(message, "Voici le resume enregistre pour aujourd'hui.");
    addHistory(cleanCommand, message);
    input.value = "";
    return;
  } else if (cleanCommand.startsWith("victoire ")) {
    const content = command.trim().replace(/^victoire\s+/i, "").trim();
    message = await addDailyLogItem("win", content);
  } else if (cleanCommand.startsWith("blocage ")) {
    const content = command.trim().replace(/^blocage\s+/i, "").trim();
    message = await addDailyLogItem("blocker", content);
  } else if (cleanCommand === "focus 25" || cleanCommand === "focus 50") {
    const duration = cleanCommand === "focus 50" ? 50 : 25;
    setActiveModule("routines", `Focus ${duration} minutes`);
    await startFocusTimer(duration);
    message = `Session focus de ${duration} minutes lancee monsieur.`;
  } else if (cleanCommand === "stop focus") {
    message = await cancelActiveFocusSession();
  } else if (cleanCommand === "sessions focus") {
    message = await listFocusSessionsLocal();
    respondDisplay(message, "Voici vos sessions focus enregistrees.");
    addHistory(cleanCommand, message);
    input.value = "";
    return;
  } else if ((cleanCommand.startsWith("plan d") && cleanCommand.includes("action")) || cleanCommand === "organise ma journee" || cleanCommand === "aide-moi a prioriser" || cleanCommand === "aide moi a prioriser" || cleanCommand === "que dois-je faire maintenant") {
    await askLocalActionPlan(command.trim());
    return;
  } else if (cleanCommand === "dashboard") {
    message = await showDashboardSummary();
    respondDisplay(message, "Voici votre dashboard personnel, monsieur.");
    addHistory(cleanCommand, message);
    input.value = "";
    return;
  } else if (cleanCommand === "mes stats") {
    message = await showStatsSummary();
    respondDisplay(message, "Voici vos statistiques locales.");
    addHistory(cleanCommand, message);
    input.value = "";
    return;
  } else if (cleanCommand === "score productivite") {
    message = await showProductivityScore();
    respondDisplay(message, "Voici votre score de productivite indicatif.");
    addHistory(cleanCommand, message);
    input.value = "";
    return;
  } else if (cleanCommand === "resume semaine") {
    message = await showWeeklySummary();
    respondDisplay(message, "Voici votre resume local de la semaine.");
    addHistory(cleanCommand, message);
    input.value = "";
    return;
  } else if (cleanCommand === "progression") {
    message = await showProgressionSummary();
    respondDisplay(message, "Voici votre synthese de progression.");
    addHistory(cleanCommand, message);
    input.value = "";
    return;
  } else if (cleanCommand === "analyse journee" || cleanCommand === "analyse mes stats" || (cleanCommand.startsWith("comment je peux") && cleanCommand.includes("ameliorer")) || cleanCommand === "que dois-je prioriser") {
    await askAnalyticsAnalysis(command.trim());
    return;
  } else if (cleanCommand === "automatisations") {
    await refreshAutomationSettings();
    message = formatAutomationSettings();
    respondDisplay(message, hasActiveAutomation() ? "Automatisations locales affichees." : "Aucune automatisation active.");
    addHistory(cleanCommand, message);
    input.value = "";
    return;
  } else if (cleanCommand === "active briefing demarrage") {
    message = await toggleAutomation("startupBriefing", true, "Briefing au demarrage active, monsieur.", "Briefing au demarrage desactive.");
  } else if (cleanCommand === "desactive briefing demarrage") {
    message = await toggleAutomation("startupBriefing", false, "Briefing au demarrage active, monsieur.", "Briefing au demarrage desactive.");
  } else if (cleanCommand === "active automatisation travail") {
    message = await toggleAutomation("workModeAutomation", true, "Automatisation travail activee, monsieur.", "Automatisation travail desactivee.");
  } else if (cleanCommand === "desactive automatisation travail") {
    message = await toggleAutomation("workModeAutomation", false, "Automatisation travail activee, monsieur.", "Automatisation travail desactivee.");
  } else if (cleanCommand === "active rappels automatiques") {
    message = await toggleAutomation("automaticReminders", true, "Rappels automatiques actives, monsieur.", "Rappels automatiques desactives.");
  } else if (cleanCommand === "desactive rappels automatiques") {
    message = await toggleAutomation("automaticReminders", false, "Rappels automatiques actives, monsieur.", "Rappels automatiques desactives.");
  } else if (cleanCommand === "active routine soir automatique") {
    message = await toggleAutomation("eveningRoutine", true, "Routine soir automatique activee, monsieur.", "Routine soir automatique desactivee.");
  } else if (cleanCommand === "desactive routine soir automatique") {
    message = await toggleAutomation("eveningRoutine", false, "Routine soir automatique activee, monsieur.", "Routine soir automatique desactivee.");
  } else if (cleanCommand === "active focus automatique") {
    message = await toggleAutomation("focusAutomation", true, "Focus automatique active, monsieur.", "Focus automatique desactive.");
  } else if (cleanCommand === "desactive focus automatique") {
    message = await toggleAutomation("focusAutomation", false, "Focus automatique active, monsieur.", "Focus automatique desactive.");
  } else if (cleanCommand === "reset automatisations") {
    message = await resetAutomationSettingsLocal();
  } else if (cleanCommand === "lance briefing") {
    message = await buildMorningBriefing();
    respondDisplay(message, "Briefing lance monsieur.");
    addHistory(cleanCommand, message);
    input.value = "";
    return;
  } else if (cleanCommand === "lance routine soir") {
    message = await buildEveningBriefing();
    respondDisplay(message, "Routine soir lancee monsieur.");
    addHistory(cleanCommand, message);
    input.value = "";
    return;
  } else if (cleanCommand === "que dois-je automatiser" || cleanCommand === "optimise ma journee" || cleanCommand === "automatise ma routine" || cleanCommand === "comment mieux organiser jarvis") {
    await askAutomationAdvice(command.trim());
    return;
  } else if (cleanCommand === "centre de commandes" || cleanCommand === "ouvre cockpit") {
    message = navigateToSection("command-center-panel", "Centre de commandes affiche, monsieur.");
  } else if (cleanCommand === "accueil") {
    returnHomeView();
    message = "Retour accueil. Modules en veille.";
  } else if (cleanCommand === "organisation" || cleanCommand === "ouvre organisation") {
    message = navigateToSection("organization-panel", "Panneau organisation affiche.");
  } else if (cleanCommand === "memoire" || cleanCommand === "ouvre memoire") {
    message = navigateToSection("memory-panel", "Panneau memoire locale affiche.");
  } else if (cleanCommand === "ouvre automatisations") {
    message = navigateToSection("automation-panel", "Panneau automatisations affiche.");
  } else if (cleanCommand === "parametres" || cleanCommand === "parametres voix") {
    message = navigateToSection("settings-panel", "Parametres affiches.");
  } else if (cleanCommand === "parametres avances") {
    message = navigateToSection("advanced-settings-panel", "Parametres avances affiches.");
  } else if (cleanCommand === "centre sauvegarde" || cleanCommand === "sauvegardes") {
    await refreshBackupStatus();
    message = navigateToSection("backup-panel", "Centre de sauvegarde affiche.");
  } else if (cleanCommand === "centre notifications" || cleanCommand === "mes notifications") {
    await refreshNotificationCenter();
    message = navigateToSection("notification-panel", "Centre de notifications affiche, monsieur.");
  } else if (cleanCommand === "statut proactif") {
    await refreshNotificationCenter();
    message = formatProactiveStatus();
    respondDisplay(message, "Voici le statut du mode proactif.");
    addHistory(cleanCommand, message);
    input.value = "";
    return;
  } else if (cleanCommand === "active notifications") {
    message = await setProactiveSetting("notificationsEnabled", true);
  } else if (cleanCommand === "desactive notifications") {
    message = await setProactiveSetting("notificationsEnabled", false);
  } else if (cleanCommand === "lancement automatique" || cleanCommand === "active lancement automatique") {
    message = await setProactiveSetting("launchAtStartup", true);
  } else if (cleanCommand === "desactive lancement automatique") {
    message = await setProactiveSetting("launchAtStartup", false);
  } else if (cleanCommand === "mode arriere-plan" || cleanCommand === "active mode arriere-plan") {
    message = await setProactiveSetting("closeToTray", true);
  } else if (cleanCommand === "desactive mode arriere-plan") {
    message = await setProactiveSetting("closeToTray", false);
  } else if (cleanCommand === "marque notifications lues") {
    const api = getProactiveApi();
    if (api && typeof api.markAllNotificationsRead === "function") await api.markAllNotificationsRead();
    await refreshNotificationCenter();
    message = api ? "Toutes les notifications sont marquees comme lues." : getDesktopOnlyMessage();
  } else if (cleanCommand === "statut ia") {
    const api = getAiApi();
    message = api && typeof api.getOllamaStatus === "function"
      ? await api.getOllamaStatus().then((status) => status && status.ok ? `IA locale connectee. Modele : ${status.model || LOCAL_AI_MODEL}.` : status.message || "IA locale indisponible.")
      : "IA locale indisponible.";
  } else if (cleanCommand === "tester ia") {
    await askAiForCommand("Confirme en une phrase courte que JARVIS IA locale fonctionne.", cleanCommand);
    return;
  } else if (cleanCommand === "changer modele ia") {
    message = `Changement de modele prepare. Modele actuel : ${LOCAL_AI_MODEL}. La structure est prete pour une future selection locale.`;
  } else if (cleanCommand === "tester voix") {
    message = "Test vocal JARVIS. Systeme audio operationnel, monsieur.";
  } else if (cleanCommand === "voix suivante") {
    message = changeVoice();
  } else if (cleanCommand === "reset voix") {
    setDefaultVoiceProfile();
    saveSettings("Voix reinitialisee");
    message = "Voix reinitialisee.";
  } else if (cleanCommand.startsWith("ouvre module ")) {
    const moduleName = cleanCommand.replace("ouvre module ", "");
    const map = { travail: "work", sport: "sport", veille: "watch", finance: "finance", routines: "routines", apps: "apps" };
    message = activateModuleByKey(map[moduleName] || "");
  } else if (cleanCommand === "voir taches") {
    message = await listLocalTasks();
    respondDisplay(message, "Voici vos taches en cours.");
    addHistory(cleanCommand, message);
    input.value = "";
    return;
  } else if (cleanCommand === "voir priorites") {
    message = await listLocalPriorities();
    respondDisplay(message, "Voici vos priorites.");
    addHistory(cleanCommand, message);
    input.value = "";
    return;
  } else if (cleanCommand === "voir rappels") {
    message = await listLocalReminders();
    respondDisplay(message, "Voici vos rappels.");
    addHistory(cleanCommand, message);
    input.value = "";
    return;
  } else if (cleanCommand === "voir planning") {
    message = await listLocalPlanning(true);
    respondDisplay(message, "Voici votre planning du jour.");
    addHistory(cleanCommand, message);
    input.value = "";
    return;
  } else if (cleanCommand === "active toutes les automatisations") {
    message = await setAllAutomations(true);
  } else if (cleanCommand === "desactive toutes les automatisations") {
    message = await setAllAutomations(false);
  } else if (cleanCommand === "resume memoire") {
    message = await memorySummary();
    respondDisplay(message, "Voici le resume de la memoire locale.");
    addHistory(cleanCommand, message);
    input.value = "";
    return;
  } else if (cleanCommand === "raccourcis desktop") {
    message = navigateToSection("command-center-panel", "Raccourcis desktop disponibles dans le centre de commandes.");
  } else if (cleanCommand === "etat systeme" || cleanCommand === "diagnostic jarvis" || cleanCommand === "scan systeme" || cleanCommand === "sante jarvis") {
    message = await runJarvisDiagnostic();
    respondDisplay(message, "Diagnostic JARVIS affiche.");
    addHistory(cleanCommand, message);
    input.value = "";
    return;
  } else if (cleanCommand === "reset jarvis") {
    resetInterface();
    message = "Interface JARVIS reinitialisee.";
  } else if (cleanCommand === "vider historique") {
    clearHistory();
    message = "Historique vide.";
  } else if (cleanCommand === "vider toutes les donnees") {
    pendingTotalReset = true;
    message = "Cette action supprimera les donnees locales. Veuillez confirmer avec : confirmer reset total.";
  } else if (cleanCommand === "confirmer reset total") {
    message = await confirmTotalReset();
  } else if (cleanCommand.startsWith("cherche ")) {
    const query = command.trim().replace(/^cherche\s+/i, "").trim();
    message = await globalSearch(query);
    respondDisplay(message, "Recherche globale terminee.");
    addHistory(cleanCommand, message);
    input.value = "";
    return;
  } else if (cleanCommand === "que peux-tu faire" || cleanCommand === "aide-moi a utiliser jarvis" || cleanCommand === "explique mes modules" || cleanCommand === "optimise jarvis" || cleanCommand === "diagnostic intelligent") {
    await askCommandCenterHelp(command.trim());
    return;
  } else if (cleanCommand === "mode ia") {
    setAiMode(true, "Questions naturelles envoyees a Ollama");
    message = "Mode IA locale actif. Les commandes connues restent locales, et les questions naturelles seront envoyees a Ollama.";
  } else if (cleanCommand === "aide ia") {
    message = getAiHelpMessage();
  } else if (cleanCommand === "modele ia" || cleanCommand === "modèle ia") {
    message = `Modele IA local utilise : ${LOCAL_AI_MODEL}.`;
  } else if (cleanCommand === "ollama statut") {
    const api = getAiApi();
    if (!api || typeof api.getOllamaStatus !== "function") {
      message = "Ollama ne semble pas lancé. Ouvrez Ollama ou lancez la commande ollama serve.";
      setAiVisualStatus("Ollama indisponible", "Pont IA locale indisponible", "error");
    } else {
      try {
        const status = await api.getOllamaStatus();
        message = status && status.ok
          ? `Ollama connecté. Modele actif : ${status.model || LOCAL_AI_MODEL}.`
          : status.message || "Ollama indisponible pour le moment.";
        setAiVisualStatus(status && status.ok ? "Ollama connecté" : "Ollama indisponible", status && status.ok ? `Modele ${status.model || LOCAL_AI_MODEL}` : "Action requise", status && status.ok ? "active" : "error");
      } catch (_error) {
        message = "Ollama ne semble pas lancé. Ouvrez Ollama ou lancez la commande ollama serve.";
        setAiVisualStatus("Ollama indisponible", "Connexion interrompue", "error");
      }
    }
  } else if (cleanCommand === "stop ia") {
    setAiMode(false, "Commandes locales uniquement");
    message = "Mode IA locale suspendu. Je reste disponible pour les commandes locales uniquement.";
  } else if (cleanCommand === "test ia") {
    if (!isAiFallbackEnabled) setAiMode(true, "Test de connexion Ollama");
    await askAiForCommand("Reponds en une phrase courte pour confirmer que la connexion Ollama de JARVIS fonctionne.", cleanCommand);
    return;
  } else if (cleanCommand === "heure") {
    message = `Bien recu monsieur. Il est ${new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}.`;
  } else if (cleanCommand === "date") {
    message = `Bien recu monsieur. Nous sommes le ${new Date().toLocaleDateString("fr-FR")}.`;
  } else if (cleanCommand === "ouvre google" || cleanCommand === "ouvrir google") {
    message = await openAppShortcut("google");
  } else if (cleanCommand === "mode analyse") {
    message = "Bien recu monsieur. Analyse en cours.";
    addHistory(cleanCommand, message);
    await startAnalysisMode();
    input.value = "";
    return;
  } else if (cleanCommand === "clear") {
    clearHistory();
    respond("Commande executee. Historique vide.");
    input.value = "";
    return;
  } else if (cleanCommand === "presentation") {
    message = "Bien recu monsieur. Je suis JARVIS, votre assistant personnel. Je peux afficher l'heure, ouvrir des outils Windows, lancer une analyse locale, rester en veille, demarrer un focus de 25 minutes, gerer ma voix, tenir l'historique et activer des modules personnels.";
  } else if (cleanCommand === "bonjour jarvis") {
    message = "Bonjour monsieur. Tous les systemes sont operationnels.";
  } else if (cleanCommand === "routine du matin" || cleanCommand === "routine matin") {
    setActiveModule("routines", "Routine matin");
    message = buildMorningRoutine();
  } else if (cleanCommand === "module travail" || cleanCommand === "mode travail") {
    setActiveModule("work", "Focus pret");
    setWorkMode(true);
    message = automationSettings.workModeAutomation
      ? await buildAutomatedWorkModeMessage()
      : `Module travail active. Je prepare votre environnement. ${buildWorkPriorities()}`;
  } else if (cleanCommand === "routine travail") {
    setActiveModule("work", "Routine lancee");
    setWorkMode(true);
    message = `Module travail active. ${buildWorkPriorities()} Vous pouvez lancer mode focus pour une session de 25 minutes.`;
  } else if (cleanCommand === "ouvrir outils travail") {
    message = await openWorkTools();
  } else if (cleanCommand === "module sport") {
    setActiveModule("sport", "Seance preparee");
    message = `Module sport active. Preparation de la seance. ${buildSportSession()}`;
  } else if (cleanCommand === "seance du jour") {
    setActiveModule("sport", "Seance du jour");
    message = buildSportSession();
  } else if (cleanCommand === "timer repos") {
    startRestTimer();
    message = "Module sport active. Timer repos lance pour 90 secondes.";
  } else if (cleanCommand === "objectif physique") {
    setActiveModule("sport", "Objectif actif");
    message = "Objectif physique : regularite, technique propre, progression mesurable et recuperation. Pensez echauffement, hydratation et carnet de progression.";
  } else if (cleanCommand === "module veille" || cleanCommand === "veille ia") {
    setActiveModule("watch", "Veille locale");
    message = `Module veille active. Voici quelques pistes a explorer. ${buildWatchIdeas()} ${buildLinkedInIdea()}`;
  } else if (cleanCommand === "idee linkedin") {
    setActiveModule("watch", "Idee LinkedIn");
    message = buildLinkedInIdea();
  } else if (cleanCommand === "tendance du jour") {
    setActiveModule("watch", "Tendance locale");
    message = "Tendance du jour simulee : assistants personnels locaux, automatisation de bureau et workflows IA sans dependance externe.";
  } else if (cleanCommand === "module finance") {
    setActiveModule("finance", "Suivi actif");
    message = `Module finance active. Pensez a verifier votre budget et vos objectifs. ${buildFinanceSummary()}`;
  } else if (cleanCommand === "budget") {
    setActiveModule("finance", "Budget");
    message = "Budget : verifiez les depenses fixes, les depenses variables et ce qui peut etre optimise cette semaine.";
  } else if (cleanCommand === "epargne") {
    setActiveModule("finance", "Epargne");
    message = "Epargne : controlez le montant mis de cote, la regularite et l'alignement avec vos objectifs.";
  } else if (cleanCommand === "investissement") {
    setActiveModule("finance", "Investissements");
    message = "Investissement : verifiez vos positions avec prudence. Je ne donne pas de conseil financier personnalise.";
  } else if (cleanCommand === "module routines") {
    setActiveModule("routines", "Routines pretes");
    message = "Module routines active. Je peux lancer routine matin, routine soir, check journee ou mode focus.";
  } else if (cleanCommand === "routine soir") {
    setActiveModule("routines", "Routine soir");
    message = buildEveningRoutine();
  } else if (cleanCommand === "check journee") {
    setActiveModule("routines", "Check journee");
    message = buildDailyCheck();
  } else if (cleanCommand === "mode focus" || cleanCommand === "focus") {
    setActiveModule("routines", "Focus 25 minutes");
    await startFocusTimer(25);
    message = cleanCommand === "focus"
      ? "Bien recu monsieur. Mode focus lance pour 25 minutes. Je garde le minuteur actif sur le dashboard."
      : "Mode focus active. Minuteur de concentration lance pour 25 minutes.";
  } else if (cleanCommand === "module apps") {
    setActiveModule("apps", "Raccourcis prets");
    message = "Module apps active. Raccourcis disponibles : ouvrir google, ouvrir youtube, ouvrir github, ouvrir calendrier, ouvrir documents, ouvrir bureau.";
  } else if (cleanCommand === "ouvrir youtube") {
    message = await openAppShortcut("youtube");
  } else if (cleanCommand === "ouvrir github") {
    message = await openAppShortcut("github");
  } else if (cleanCommand === "ouvrir calendrier") {
    message = await openAppShortcut("calendar");
  } else if (cleanCommand === "modules") {
    showModulesPanel();
    message = moduleListMessage();
  } else if (cleanCommand === "accueil") {
    returnHomeView();
    message = "Retour accueil. Modules en veille.";
  } else if (cleanCommand === "parametres") {
    settingsPanel.classList.add("is-highlighted");
    settingsPanel.scrollIntoView({ behavior: "smooth", block: "start" });
    setSettingsStatus("Panneau parametres affiche");
    window.setTimeout(() => settingsPanel.classList.remove("is-highlighted"), 1800);
    message = "Je m'en occupe. Panneau parametres affiche.";
  } else if (cleanCommand === "sauvegarde jarvis") {
    message = await createBackupFromInterface();
  } else if (cleanCommand === "exporte sauvegarde") {
    message = await exportBackupFromInterface();
  } else if (cleanCommand === "importe sauvegarde" || cleanCommand === "restaure sauvegarde") {
    message = await importBackupFromInterface();
  } else if (cleanCommand === "diagnostic stockage") {
    message = await diagnoseStorageFromInterface();
  } else if (cleanCommand === "a propos jarvis") {
    message = await getAboutJarvisMessage();
  } else if (cleanCommand === "sauvegarde") {
    message = saveSettings("Reglages sauvegardes manuellement")
      ? "Commande executee. Reglages sauvegardes localement."
      : "Sauvegarde impossible pour le moment.";
  } else if (cleanCommand === "reset parametres") {
    resetSettingsToDefault(true);
    message = "Commande executee. Parametres voix et interface remis par defaut.";
  } else if (cleanCommand === "statut") {
    message = `Bien recu monsieur. ${buildStatusReport()}`;
  } else if (cleanCommand === "veille") {
    message = "Je reste en veille. Analyse des signaux importants en cours.";
    addHistory(cleanCommand, message);
    startWatchMode();
    input.value = "";
    return;
  } else if (cleanCommand === "stop") {
    message = "Commande executee. Synthese vocale arretee.";
    stopSpeech();
    respond(message, false);
    addHistory(cleanCommand, message);
    input.value = "";
    return;
  } else if (cleanCommand === "reset") {
    message = "Commande executee. Interface remise a l'etat initial.";
    resetInterface();
    respond(message);
    input.value = "";
    return;
  } else if (cleanCommand === "voix") {
    const selectedVoice = getSelectedVoice();
    const name = selectedVoice ? selectedVoice.name : "la voix par defaut du navigateur";
    const lang = selectedVoice && selectedVoice.lang ? ` en ${selectedVoice.lang}` : "";
    message = `Bien recu monsieur. J'utilise ${name}${lang}, avec une vitesse ${currentSpeechRate.toFixed(2)} et un pitch ${currentSpeechPitch.toFixed(2)}.`;
  } else if (cleanCommand === "change voix") {
    message = changeVoice();
  } else if (cleanCommand === "plus lentement") {
    message = `Bien recu monsieur. Je parlerai plus lentement. Vitesse actuelle : ${changeSpeechRate(-0.1)}.`;
  } else if (cleanCommand === "plus vite") {
    message = `Bien recu monsieur. J'augmente la vitesse. Vitesse actuelle : ${changeSpeechRate(0.1)}.`;
  } else if (cleanCommand === "voix grave") {
    message = `Je m'en occupe. Voix plus grave activee. Pitch actuel : ${setSpeechPitch(0.7)}.`;
  } else if (cleanCommand === "voix normale") {
    setDefaultVoiceProfile();
    message = "Commande executee. Voix, vitesse et pitch remis au profil par defaut.";
  } else if (cleanCommand === "ouvre calculatrice") {
    message = await runDesktopAction("openCalculator", "Je m'en occupe. Ouverture de la calculatrice Windows.");
  } else if (cleanCommand === "ouvre navigateur") {
    message = await runDesktopAction("openBrowser", "Je m'en occupe. Ouverture du navigateur par defaut.");
  } else if (cleanCommand === "ouvre documents" || cleanCommand === "ouvrir documents") {
    message = await openAppShortcut("documents");
  } else if (cleanCommand === "ouvre bureau" || cleanCommand === "ouvrir bureau") {
    message = await openAppShortcut("desktop");
  } else if (cleanCommand === "infos systeme") {
    const desktop = getDesktopApi();
    if (!desktop || typeof desktop.getSystemInfo !== "function") {
      message = getDesktopOnlyMessage();
    } else {
      try {
        message = `Bien recu monsieur. ${formatSystemInfo(await desktop.getSystemInfo())}`;
      } catch (error) {
        message = `Impossible de lire les informations systeme : ${error.message || "erreur inconnue"}.`;
      }
    }
  } else if (cleanCommand === "plein ecran") {
    message = await runDesktopAction("setFullScreen", "Commande executee. Passage en plein ecran.", true);
  } else if (cleanCommand === "fenetre") {
    message = await runDesktopAction("setFullScreen", "Commande executee. Retour en mode fenetre.", false);
  } else if (cleanCommand === "minimise") {
    message = await runDesktopAction("minimize", "Commande executee. Fenetre minimisee.");
  } else if (cleanCommand === "ferme jarvis") {
    const desktop = getDesktopApi();
    if (!desktop || typeof desktop.closeApp !== "function") {
      message = getDesktopOnlyMessage();
    } else {
      message = "Bien recu monsieur. Fermeture de JARVIS.";
      respond(message);
      addHistory(cleanCommand, message);
      input.value = "";
      window.setTimeout(() => desktop.closeApp(), 900);
      return;
    }
  } else {
    if (isAiFallbackEnabled) {
      await askAiForCommand(command.trim(), cleanCommand);
      return;
    }

    message = `Commande "${cleanCommand}" non reconnue. Essayez "aide" pour voir les commandes, ou utilisez "modules" pour afficher les modules personnels.`;
  }

  respond(message);
  addHistory(cleanCommand, message);
  input.value = "";
}

function hasLocalTranscriptionApi() {
  return Boolean(getVoiceTranscriptionApi());
}

async function testMicro(shouldRespond = true) {
  const localVoiceAvailable = hasLocalTranscriptionApi();
  const message = localVoiceAvailable
    ? [
        "Transcription locale Python/Whisper active.",
        "JARVIS utilise maintenant le bouton micro pour enregistrer environ 5 secondes, transcrire en local, puis executer la commande reconnue.",
        "Si la premiere transcription est lente, c'est normal : le modele Whisper local peut se charger au premier lancement."
      ].join("\n")
    : [
        "Transcription locale indisponible dans cette fenetre Electron.",
        "Verifiez que preload.js expose window.jarvisAPI.transcribeVoice()."
      ].join("\n");

  setMicroStatus(localVoiceAvailable ? "available" : "unavailable", localVoiceAvailable ? "Transcription locale Python/Whisper" : "API vocale absente");
  setSpeechRecognitionStatus(localVoiceAvailable ? "available" : "unavailable", localVoiceAvailable ? "Transcription locale active" : "Transcription locale indisponible");
  setVoiceError(localVoiceAvailable ? "" : "transcribeVoice indisponible");
  if (voiceBtn) voiceBtn.classList.toggle("is-error", !localVoiceAvailable);
  if (shouldRespond) respond(message);
  return { ok: localVoiceAvailable, message };
}

async function testBrowserMicrophoneAccess(shouldRespond = true) {
  setMicroStatus("testing", "Demande d'acces au micro...");
  setVoiceError("");
  if (voiceBtn) voiceBtn.classList.remove("is-error");

  if (!navigator.mediaDevices || typeof navigator.mediaDevices.getUserMedia !== "function") {
    const message = "navigator.mediaDevices n\u2019est pas disponible dans cette fenetre Electron.";
    setMicroStatus("unavailable", "navigator.mediaDevices indisponible");
    setVoiceError(message);
    if (voiceBtn) voiceBtn.classList.add("is-error");
    if (shouldRespond) respond(message);
    return { ok: false, message };
  }

  let stream = null;
  try {
    stream = await navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true
      }
    });

    const audioTracks = stream.getAudioTracks();

    if (!audioTracks.length) {
      const message = "Aucun peripherique audio detecte.";
      stream.getTracks().forEach((track) => track.stop());
      setMicroStatus("unavailable", "Aucune piste audio detectee");
      setVoiceError(message);
      if (voiceBtn) voiceBtn.classList.add("is-error");
      if (shouldRespond) respond(message);
      return { ok: false, message };
    }

    const audioTrack = audioTracks[0];
    const microphoneName = audioTrack.label || "micro audio";
    const message = `Micro detecte et accessible : ${microphoneName}.`;
    stream.getTracks().forEach((track) => track.stop());
    setMicroStatus("available", microphoneName);
    setVoiceError("");
    if (voiceBtn) voiceBtn.classList.remove("is-error");
    if (shouldRespond) respond(message);
    return { ok: true, message, microphoneName };
  } catch (error) {
    if (stream) stream.getTracks().forEach((track) => track.stop());
    console.error("Erreur test micro :", error);

    const errorName = error && error.name ? error.name : "Erreur inconnue";
    let message = `Impossible d\u2019acceder au micro : ${errorName}`;
    if (errorName === "NotAllowedError") {
      message = "Acces micro refuse. Verifiez les permissions Windows.";
    } else if (errorName === "NotFoundError") {
      message = "Aucun micro detecte.";
    } else if (errorName === "NotReadableError") {
      message = "Le micro est deja utilise par une autre application.";
    }

    setMicroStatus("error", errorName);
    setVoiceError(message);
    if (voiceBtn) voiceBtn.classList.add("is-error");
    if (shouldRespond) respond(message);
    return { ok: false, message, error };
  }
}

async function testMicrophoneAccess(shouldRespond = true) {
  return testBrowserMicrophoneAccess(shouldRespond);
}

function getVoiceRecognitionErrorMessage(errorCode) {
  if (errorCode === "not-allowed") return "Micro refuse. Verifiez les permissions Windows ou Electron.";
  if (errorCode === "no-speech") return "Aucune voix detectee. Reessayez en parlant plus clairement.";
  if (errorCode === "audio-capture") return "Aucun micro detecte.";
  if (errorCode === "network") return "La reconnaissance vocale Web Speech ne fonctionne pas correctement dans Electron. Utilisez le mode texte ou activez le fallback local.";
  return "Erreur de reconnaissance vocale. Consultez la console pour le detail.";
}

function startLocalVoiceFallback(shouldRespond = true) {
  const message = "Fallback vocal local non encore active. Le micro est detecte, mais la transcription locale n'est pas installee.";
  setSpeechRecognitionStatus("unavailable", "Fallback local non installe");
  if (shouldRespond) respond(message);
  return message;
}

function getMicroStatusMessage() {
  const microLabels = {
    unknown: "non teste",
    testing: "test en cours",
    available: "disponible",
    unavailable: "indisponible",
    listening: "ecoute en cours",
    error: "erreur"
  };
  const recognitionLabels = {
    idle: "en attente",
    available: "disponible",
    unavailable: "indisponible",
    listening: "ecoute en cours",
    error: "erreur"
  };

  const localVoiceStatus = hasLocalTranscriptionApi() ? "active" : "indisponible";

  return [
    `Transcription locale Python/Whisper : ${localVoiceStatus}.`,
    `Micro : ${microLabels[microphoneStatus] || "non teste"}.`,
    `Reconnaissance vocale : ${recognitionLabels[speechRecognitionStatus] || "en attente"}.`,
    `Derniere erreur vocale : ${lastVoiceError || "aucune"}.`
  ].join("\n");
}

function getVoiceHelpMessage() {
  return [
    "Aide vocale JARVIS.",
    "Utilisez le bouton micro ou Ctrl+M pour lancer une transcription locale Python/Whisper.",
    "Parlez pendant l'enregistrement de 5 secondes. JARVIS placera le texte transcrit dans le champ puis executera la commande.",
    "Commandes utiles : test micro, statut micro, redemarre ecoute.",
    "Si Python/Whisper est indisponible, JARVIS tente encore Web Speech en fallback secondaire.",
    "Installation dependances : python -m pip install sounddevice scipy faster-whisper"
  ].join("\n");
}

async function startVoiceRecognition() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    setSpeechRecognitionStatus("unavailable", "Web Speech indisponible dans Electron");
    const message = "La reconnaissance vocale Web Speech n'est pas disponible dans cette version desktop.";
    const microResult = await testMicrophoneAccess(false);
    if (microResult.ok) {
      respond(`${message}\n${startLocalVoiceFallback(false)}`);
    } else {
      respond(message);
    }
    return;
  }
  if (activeRecognition) return;

  const microResult = await testMicrophoneAccess(false);
  if (!microResult.ok) {
    respond(microResult.message);
    return;
  }

  const recognition = new SpeechRecognition();
  activeRecognition = recognition;
  recognition.lang = "fr-FR";
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.onstart = () => {
    setVoiceError("");
    setListening(true);
  };

  recognition.onresult = (event) => {
    const result = event.results && event.results[0] && event.results[0][0];
    const command = result && result.transcript ? result.transcript.trim() : "";
    if (!command) {
      const message = "Aucune voix detectee. Reessayez en parlant plus clairement.";
      setVoiceError(message);
      respond(message);
      return;
    }

    input.value = command;
    setSpeechRecognitionStatus("available", `Commande recue : ${command}`);
    handleCommand(command);
  };

  recognition.onerror = (event) => {
    const errorCode = event && event.error ? event.error : "unknown";
    const message = getVoiceRecognitionErrorMessage(errorCode);
    console.error("Erreur reconnaissance vocale:", errorCode, event);
    setVoiceError(errorCode);
    setMicroStatus(errorCode === "audio-capture" ? "unavailable" : "error", message);
    setSpeechRecognitionStatus("error", message);
    voiceBtn.classList.add("is-error");
    respond(message);
  };

  recognition.onend = () => {
    if (activeRecognition === recognition) activeRecognition = null;
    setListening(false);
    if (speechRecognitionStatus !== "error") voiceBtn.classList.remove("is-error");
  };

  try {
    setSpeechRecognitionStatus("available", "Demarrage de l'ecoute...");
    recognition.start();
  } catch (error) {
    activeRecognition = null;
    setListening(false);
    setMicroStatus("error", error.message || "Demarrage impossible");
    setSpeechRecognitionStatus("error", "Demarrage impossible");
    setVoiceError(error.message || "demarrage impossible");
    voiceBtn.classList.add("is-error");
    respond(`Micro indisponible : ${error.message || "demarrage impossible"}.`);
  }
}

async function startLocalVoiceTranscription() {
  if (!hasLocalTranscriptionApi()) {
    const message = "Transcription locale indisponible. JARVIS tente le fallback Web Speech si disponible.";
    setMicroStatus("unavailable", "transcribeVoice indisponible");
    setSpeechRecognitionStatus("unavailable", "Transcription locale absente");
    setVoiceError("transcribeVoice indisponible");
    if (voiceBtn) voiceBtn.classList.add("is-error");
    respond(message, false);
    return { ok: false, fallbackAllowed: true, message };
  }

  if (isLocalTranscribing) {
    const message = "Transcription locale deja en cours.";
    respond(message, false);
    return { ok: false, fallbackAllowed: false, message };
  }

  isLocalTranscribing = true;
  setListening(true);
  setMicroStatus("listening", "Transcription locale Python/Whisper");
  setSpeechRecognitionStatus("listening", "Ecoute locale en cours...");
  setVoiceStatus("Transcription", "Ecoute locale en cours...");
  setVoiceError("");
  respond("Ecoute locale en cours...", false);

  try {
    const voiceApi = getVoiceTranscriptionApi();
    if (!voiceApi) {
      throw new Error("transcribeVoice indisponible");
    }

    const result = await voiceApi.transcribeVoice();
    const text = typeof result === "string" ? result.trim() : String((result && result.text) || "").trim();
    const message = result && typeof result === "object" && result.message ? result.message : "Transcription terminee.";

    if (!text) {
      const reason = result && typeof result === "object" ? result.reason : "";
      const fallbackAllowed = ["python-missing", "missing-dependency", "transcription-error", "timeout"].includes(reason);
      const errorMessage = message || "Aucune voix detectee. Reessayez en parlant clairement.";
      setMicroStatus(fallbackAllowed ? "unavailable" : "error", reason || "Aucun texte reconnu");
      setSpeechRecognitionStatus("error", "Erreur transcription");
      setVoiceError(errorMessage);
      if (voiceBtn) voiceBtn.classList.add("is-error");
      respond(errorMessage);
      return { ok: false, fallbackAllowed, message: errorMessage };
    }

    input.value = text;
    setMicroStatus("available", "Transcription terminee");
    setSpeechRecognitionStatus("available", `Transcription terminee : ${text}`);
    setVoiceError("");
    if (voiceBtn) voiceBtn.classList.remove("is-error");
    await handleCommand(text);
    return { ok: true, fallbackAllowed: false, text };
  } catch (error) {
    const message = error && error.message ? `Erreur transcription locale : ${error.message}` : "Erreur transcription locale.";
    console.error("Erreur transcription locale:", error);
    setMicroStatus("error", "Erreur transcription");
    setSpeechRecognitionStatus("error", "Erreur transcription");
    setVoiceError(message);
    if (voiceBtn) voiceBtn.classList.add("is-error");
    respond(message);
    return { ok: false, fallbackAllowed: true, message };
  } finally {
    isLocalTranscribing = false;
    setListening(false);
  }
}

async function startVoiceInput() {
  const localResult = await startLocalVoiceTranscription();
  if (localResult.ok || !localResult.fallbackAllowed) return;

  setSpeechRecognitionStatus("available", "Fallback Web Speech en cours...");
  respond("Transcription locale indisponible. Tentative Web Speech.", false);
  await startVoiceRecognition();
}

async function restartVoiceRecognition() {
  if (activeRecognition) {
    const recognition = activeRecognition;
    activeRecognition = null;
    try {
      recognition.stop();
    } catch (_error) {
      // L'instance peut deja etre fermee par Electron.
    }
  }

  setListening(false);
  await startVoiceInput();
  return "Ecoute redemarree.";
}

async function toggleMicrophone() {
  if (isLocalTranscribing) {
    respond("Transcription locale deja en cours.", false);
    return;
  }

  if (activeRecognition) {
    const recognition = activeRecognition;
    activeRecognition = null;
    setListening(false);
    recognition.stop();
    respond("Micro desactive.", false);
    return;
  }

  await startVoiceInput();
}

function initWelcomeSequence() {
  ["Connexion au noyau principal...", "Calibration des modules vocaux...", "Interface operationnelle."].forEach((message, index) => {
    window.setTimeout(() => {
      welcomeMessage.textContent = message;
    }, index * 700);
  });

  window.setTimeout(() => {
    welcomeSequence.classList.add("is-hidden");
    respond("Bonjour monsieur. JARVIS est en ligne. Dites presentation pour connaitre mes capacites.");
  }, 2600);
}

safeBindElement(sendBtn, "click", () => handleCommand(input ? input.value : ""));
safeBindElement(input, "keydown", (event) => {
  if (event.key === "Enter") handleCommand(input.value);
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeMobileMenu();
    return;
  }

  if (!event.ctrlKey || event.altKey || event.metaKey) return;
  const key = event.key.toLowerCase();

  if (key === "j") {
    event.preventDefault();
    input.focus();
    input.select();
    respond("Canal de commande focalise.", false);
  } else if (key === "m") {
    event.preventDefault();
    toggleMicrophone();
  }
});
safeBindElement(mobileMenuToggle, "click", toggleMobileMenu);
safeBindElement(clearHistoryBtn, "click", () => {
  clearHistory();
  respond("Historique vide.");
});
safeBindElement(showMemoryBtn, "click", async () => {
  const message = await listLocalMemories();
  respondDisplay(message, memoryEntries.length ? "Voici les informations enregistrees dans ma memoire locale." : message);
  addHistory("affiche memoire", message);
});
safeBindElement(clearMemoryBtn, "click", async () => {
  const message = await clearLocalMemory();
  respond(message);
  addHistory("vide memoire", message);
});
safeBindElement(showNotesBtn, "click", async () => {
  const message = await listLocalNotes();
  respondDisplay(message, noteEntries.length ? "Voici les notes locales." : message);
  addHistory("affiche notes", message);
});
safeBindElement(clearNotesBtn, "click", async () => {
  const message = await clearLocalNotes();
  respond(message);
  addHistory("vide notes", message);
});
safeBindElement(showTasksBtn, "click", async () => {
  const message = await listLocalTasks();
  respondDisplay(message, "Voici vos taches en cours.");
  addHistory("mes taches", message);
});
safeBindElement(showPrioritiesBtn, "click", async () => {
  const message = await listLocalPriorities();
  respondDisplay(message, "Voici vos priorites.");
  addHistory("mes priorites", message);
});
safeBindElement(showRemindersBtn, "click", async () => {
  const message = await listLocalReminders();
  respondDisplay(message, "Voici vos rappels.");
  addHistory("mes rappels", message);
});
safeBindElement(todayBtn, "click", async () => {
  const message = await buildTodayDashboard();
  respondDisplay(message, "Voici votre tableau de bord du jour, monsieur.");
  addHistory("aujourd'hui", message);
});
safeBindElement(showBilanBtn, "click", async () => {
  const message = await showTodayDailyLog();
  respondDisplay(message, "Voici le resume enregistre pour aujourd'hui.");
  addHistory("resume journee", message);
});
safeBindElement(eveningRoutineBtn, "click", async () => {
  const message = await buildEveningBriefing();
  respondDisplay(message, "Routine du soir lancee. Faisons le point sur la journee.");
  addHistory("routine soir", message);
});
safeBindElement(showDashboardBtn, "click", async () => {
  const message = await showDashboardSummary();
  respondDisplay(message, "Voici votre dashboard personnel, monsieur.");
  addHistory("dashboard", message);
});
safeBindElement(showWeeklyBtn, "click", async () => {
  const message = await showWeeklySummary();
  respondDisplay(message, "Voici votre resume local de la semaine.");
  addHistory("resume semaine", message);
});
safeBindElement(resetAutomationsBtn, "click", async () => {
  const message = await resetAutomationSettingsLocal();
  respond(message);
  addHistory("reset automatisations", message);
});
document.querySelectorAll("[data-automation-key]").forEach((button) => {
  button.addEventListener("click", async () => {
    const key = button.dataset.automationKey;
    const nextValue = button.dataset.automationValue === "true";
    const message = await toggleAutomation(key, nextValue, "Automatisation activee, monsieur.", "Automatisation desactivee.");
    respond(message);
    addHistory(`automation ${key}`, message);
  });
});
document.querySelectorAll("[data-nav-target]").forEach((button) => {
  button.addEventListener("click", () => {
    const targetId = button.dataset.navTarget;
    updateNavState(targetId);
    if (targetId === "app") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      closeMobileMenu();
      return;
    }
    scrollToPanel(targetId);
    closeMobileMenu();
  });
});
document.querySelectorAll("[data-command-center-tab]").forEach((button) => {
  button.addEventListener("click", () => {
    showCommandCenterTab(button.dataset.commandCenterTab);
    if (button.closest(".left-sidebar") || button.closest(".top-tabs")) {
      scrollToPanel("command-center-panel");
    }
    if (button.closest(".left-sidebar")) closeMobileMenu();
  });
});
document.querySelectorAll("[data-mode-profile]").forEach((button) => {
  button.addEventListener("click", async () => {
    const mode = button.dataset.modeProfile;
    const message = await activateInterfaceMode(mode);
    respond(message);
    addHistory(`mode ${mode}`, message);
  });
});
document.querySelectorAll("[data-theme-profile]").forEach((button) => {
  button.addEventListener("click", async () => {
    const theme = button.dataset.themeProfile;
    const message = await activateTheme(theme);
    respond(message);
    addHistory(`theme ${theme}`, message);
  });
});
document.querySelectorAll("[data-command]").forEach((button) => {
  button.addEventListener("click", () => {
    if (input) input.value = button.dataset.command;
    handleCommand(button.dataset.command);
    closeMobileMenu();
  });
});
document.querySelectorAll("[data-open-bridge-onboarding]").forEach((button) => {
  button.addEventListener("click", openBridgeOnboarding);
});
document.querySelectorAll("[data-close-bridge-onboarding]").forEach((button) => {
  button.addEventListener("click", closeBridgeOnboarding);
});
safeBindElement(bridgeCopyAddressBtn, "click", copyBridgeAddress);
safeBindElement(bridgeRevealCodeBtn, "click", () => {
  bridgeCodeVisible = !bridgeCodeVisible;
  renderProtectedBridgeCode(bridgeOnboardingCode ? bridgeOnboardingCode.dataset.code : "");
});
safeBindElement(bridgeRefreshOnboardingBtn, "click", refreshBridgeOnboarding);
safeBindElement(bridgeRotateOnboardingBtn, "click", async () => {
  const message = await rotateBridgePairingCode();
  bridgeCodeVisible = false;
  await refreshBridgeOnboarding();
  respond(message, false);
});
safeBindElement(bridgeDeviceList, "click", async (event) => {
  const button = event.target.closest("[data-bridge-device-id]");
  if (button) await revokeBridgeDevice(button.dataset.bridgeDeviceId);
});
safeBindElement(createBackupBtn, "click", async () => {
  const message = await createBackupFromInterface();
  respond(message, false);
  addHistory("sauvegarde jarvis", message);
});
safeBindElement(exportBackupBtn, "click", async () => {
  const message = await exportBackupFromInterface();
  respond(message, false);
  addHistory("exporte sauvegarde", message);
});
safeBindElement(importBackupBtn, "click", async () => {
  const message = await importBackupFromInterface();
  respond(message, false);
  addHistory("importe sauvegarde", message);
});
safeBindElement(diagnoseStorageBtn, "click", async () => {
  const message = await diagnoseStorageFromInterface();
  respond(message, false);
  addHistory("diagnostic stockage", message);
});
safeBindElement(notificationList, "click", async (event) => {
  const button = event.target.closest("[data-notification-action]");
  if (!button) return;
  const message = await runNotificationAction(
    button.dataset.notificationAction,
    button.dataset.reminderId || "",
    button.dataset.notificationId || ""
  );
  respond(message, false);
  addHistory(`notification ${button.dataset.notificationAction}`, message);
});
safeBindElement(toggleWindowsNotificationsBtn, "click", async () => {
  const message = await setProactiveSetting("notificationsEnabled", !proactiveStatus.notificationsEnabled);
  respond(message, false);
});
safeBindElement(toggleStartupBtn, "click", async () => {
  const message = await setProactiveSetting("launchAtStartup", !proactiveStatus.launchAtStartup);
  respond(message, false);
});
safeBindElement(toggleCloseToTrayBtn, "click", async () => {
  const message = await setProactiveSetting("closeToTray", !proactiveStatus.closeToTray);
  respond(message, false);
});
safeBindElement(markNotificationsReadBtn, "click", async () => {
  const api = getProactiveApi();
  if (api && typeof api.markAllNotificationsRead === "function") await api.markAllNotificationsRead();
  await refreshNotificationCenter();
  respond(api ? "Toutes les notifications sont marquees comme lues." : getDesktopOnlyMessage(), false);
});
safeBindElement(clearNotificationsBtn, "click", async () => {
  const api = getProactiveApi();
  if (api && typeof api.clearNotifications === "function") await api.clearNotifications();
  await refreshNotificationCenter();
  respond(api ? "Centre de notifications vide." : getDesktopOnlyMessage(), false);
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && bridgeOnboarding && !bridgeOnboarding.hidden) {
    closeBridgeOnboarding();
  }
});
if (installPwaBtn) {
  installPwaBtn.addEventListener("click", async () => {
    const message = await requestPwaInstall();
    respond(message);
    addHistory("installer jarvis", message);
  });
}
if (commandSearch) {
  commandSearch.addEventListener("input", () => {
    const query = normalizeCommand(commandSearch.value);
    document.querySelectorAll(".command-list li").forEach((item) => {
      const button = item.querySelector("[data-command]");
      const searchable = normalizeCommand(`${button?.textContent || ""} ${button?.dataset.command || ""}`);
      item.hidden = query ? !searchable.includes(query) : false;
    });
  });
}
safeBindElement(voiceBtn, "click", toggleMicrophone);
safeBindElement(voiceSelect, "change", () => {
  const nextIndex = Number(voiceSelect.value);
  selectedVoiceIndex = Number.isFinite(nextIndex) ? nextIndex : 0;
  const selectedVoice = getSelectedVoice();
  preferredVoiceName = selectedVoice ? selectedVoice.name : "";
  preferredVoiceLang = selectedVoice ? selectedVoice.lang || "" : "";
  updateVoiceSummary();
  saveSettings("Voix sauvegardee");
  respond("Bien recu monsieur. Voix mise a jour.");
});
safeBindElement(speechRate, "input", () => {
  currentSpeechRate = Number(speechRate.value);
  updateVoiceSummary();
});
safeBindElement(speechRate, "change", () => {
  saveSettings("Vitesse sauvegardee");
  respond(`Commande executee. Vitesse de parole reglee sur ${currentSpeechRate.toFixed(2)}.`);
});
safeBindElement(speechPitch, "input", () => {
  currentSpeechPitch = Number(speechPitch.value);
  updateVoiceSummary();
});
safeBindElement(speechPitch, "change", () => {
  saveSettings("Pitch sauvegarde");
  respond(`Commande executee. Pitch vocal regle sur ${currentSpeechPitch.toFixed(2)}.`);
});
safeBindElement(speechVolume, "input", () => {
  currentSpeechVolume = Number(speechVolume.value);
  updateVoiceSummary();
});
safeBindElement(speechVolume, "change", () => {
  saveSettings("Volume sauvegarde");
  respond(`Commande executee. Volume vocal regle sur ${currentSpeechVolume.toFixed(2)}.`);
});
safeBindElement(saveSettingsBtn, "click", () => {
  const saved = saveSettings("Reglages sauvegardes manuellement");
  respond(saved ? "Commande executee. Reglages sauvegardes localement." : "Sauvegarde impossible.", false);
});
safeBindElement(resetSettingsBtn, "click", () => {
  resetSettingsToDefault(true);
  respond("Commande executee. Parametres remis par defaut.");
});

window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();
  deferredInstallPrompt = event;
  updateMobileMode();
});

window.addEventListener("appinstalled", () => {
  deferredInstallPrompt = null;
  updateMobileMode();
});

window.addEventListener("resize", updateMobileMode);

loadStoredSettings();
loadStoredHistory();
refreshLocalMemory();
refreshOrganization();
refreshPlanningData();
refreshAnalytics();
refreshAutomationSettings();
refreshBridgeOnboarding();
refreshBackupStatus();
refreshNotificationCenter();
updateClock();
updateMetrics();
updateMobileMode();
registerJarvisServiceWorker();
loadBrowserVoices();
setAiMode(true, "Questions naturelles envoyees a Ollama");
setMicroStatus("unknown", "Commande : test micro");
setSpeechRecognitionStatus(hasLocalTranscriptionApi() ? "available" : hasWebSpeechRecognition() ? "available" : "unavailable", hasLocalTranscriptionApi() ? "Transcription locale Python/Whisper active" : hasWebSpeechRecognition() ? "Fallback Web Speech disponible" : "Transcription vocale indisponible");
loadInterfacePreferences();
if (!isWorkMode) setSystemStatus("Systeme en ligne", "Noyau stable");
updateVoiceSummary();
updateFocusCard();
initWelcomeSequence();
window.setTimeout(runStartupAutomation, 1500);
window.setTimeout(runEveningAutomationIfNeeded, 2500);

window.setInterval(updateClock, 1000);
window.setInterval(updateMetrics, 3000);
window.setInterval(runEveningAutomationIfNeeded, 60000);
window.setInterval(refreshBridgeOnboarding, 30000);
if ("speechSynthesis" in window) window.speechSynthesis.onvoiceschanged = loadBrowserVoices;

const proactiveApi = getProactiveApi();
if (proactiveApi && typeof proactiveApi.onNotificationsChanged === "function") {
  proactiveApi.onNotificationsChanged((status) => refreshNotificationCenter(status));
}
if (proactiveApi && typeof proactiveApi.onOrganizationChanged === "function") {
  proactiveApi.onOrganizationChanged(() => refreshOrganization());
}
if (proactiveApi && typeof proactiveApi.onNavigateRequest === "function") {
  proactiveApi.onNavigateRequest((request) => {
    const target = request && request.target;
    if (!target) return;
    if (target === "notification-panel") refreshNotificationCenter();
    navigateToSection(target, "Navigation Electron effectuee.");
  });
}
