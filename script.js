const $ = (id) => document.getElementById(id);

const app = $("app");
const input = $("command-input");
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

const currentTime = $("current-time");
const currentDate = $("current-date");
const systemState = $("system-state");
const systemDetail = $("system-detail");
const voiceState = $("voice-state");
const voiceDetail = $("voice-detail");
const focusState = $("focus-state");
const focusDetail = $("focus-detail");
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
const modulesPanel = $("modules-panel");
const moduleSummary = $("module-summary");
const desktopApi = window.jarvisDesktop || null;

const moduleCards = [...document.querySelectorAll("[data-module-card]")];
const moduleStatusElements = {
  work: $("module-work-status"),
  sport: $("module-sport-status"),
  watch: $("module-watch-status"),
  finance: $("module-finance-status"),
  routines: $("module-routines-status"),
  apps: $("module-apps-status")
};

const metricElements = {
  cpu: { bar: $("cpu-bar"), value: $("cpu-value"), base: 58 },
  memory: { bar: $("memory-bar"), value: $("memory-value"), base: 44 },
  network: { bar: $("network-bar"), value: $("network-value"), base: 82 }
};

const SETTINGS_STORAGE_KEY = "jarvisAssistant.settings.v2";
const HISTORY_STORAGE_KEY = "jarvisAssistant.history.v2";
const HISTORY_LIMIT = 20;
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
  "ouvrir calendrier"
];

let isListening = false;
let activeRecognition = null;
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
let activeModuleKey = "";

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
  settingsStatus.textContent = message;
}

function getDesktopApi() {
  return desktopApi && desktopApi.isDesktop ? desktopApi : null;
}

async function runDesktopAction(methodName, successMessage, ...args) {
  const desktop = getDesktopApi();
  if (!desktop || typeof desktop[methodName] !== "function") {
    return "Module desktop indisponible. Lancez JARVIS avec npm start pour utiliser cette commande.";
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
    coreLabel.textContent = "LISTEN";
    setSystemStatus("Ecoute en cours...", "Canal vocal ouvert");
    setVoiceStatus("Ecoute", "Micro actif");
    return;
  }

  coreLabel.textContent = core.classList.contains("is-speaking") ? "TALK" : "ONLINE";
  setSystemStatus(isWorkMode ? "Mode travail active" : "Systeme en ligne", isWorkMode ? "Animations reduites" : "Noyau stable");
  if (!core.classList.contains("is-speaking")) setVoiceStatus("Repos", "Micro inactif");
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
  const safeValue = Math.max(8, Math.min(100, value));
  metric.bar.style.width = `${safeValue}%`;
  metric.value.textContent = `${safeValue}%`;
}

function updateMetrics() {
  const time = Date.now() / 1000;
  setMetric("cpu", Math.round(metricElements.cpu.base + Math.sin(time / 3) * 10));
  setMetric("memory", Math.round(metricElements.memory.base + Math.cos(time / 4) * 8));
  setMetric("network", Math.round(metricElements.network.base + Math.sin(time / 5) * 6));
}

function updateFocusCard() {
  if (!focusInterval) {
    focusState.textContent = "Inactif";
    focusDetail.textContent = "Aucun minuteur actif";
    return;
  }

  const remaining = Math.max(0, Math.ceil((focusEndsAt - Date.now()) / 1000));
  const minutes = String(Math.floor(remaining / 60)).padStart(2, "0");
  const seconds = String(remaining % 60).padStart(2, "0");
  focusState.textContent = `${minutes}:${seconds}`;
  focusDetail.textContent = "Session de concentration";

  if (remaining <= 0) {
    stopFocusTimer();
    respond("Session focus terminee. Vous pouvez faire une pause.");
  }
}

function startFocusTimer() {
  stopFocusTimer(false);
  focusEndsAt = Date.now() + 25 * 60 * 1000;
  focusInterval = window.setInterval(updateFocusCard, 1000);
  updateFocusCard();
  setSystemStatus("Mode focus actif", "Minuteur 25 minutes");
}

function stopFocusTimer(resetCard = true) {
  if (focusInterval) window.clearInterval(focusInterval);
  focusInterval = null;
  focusEndsAt = 0;
  if (resetCard) updateFocusCard();
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
  const moduleText = activeModuleKey ? `module ${MODULE_LABELS[activeModuleKey]} actif` : "aucun module actif";
  const restText = restTimerInterval ? `repos sport actif (${moduleStatusElements.sport.textContent})` : "repos sport inactif";
  return `Statut complet : ${systemState.textContent}. Vocal : ${voiceState.textContent}. ${desktopText}. ${workModeText}. ${moduleText}. CPU ${metricElements.cpu.value.textContent}, memoire ${metricElements.memory.value.textContent}, reseau ${metricElements.network.value.textContent}. ${focusText}. ${restText}. Historique : ${historyEntries.length} entree(s).`;
}

function clearTimedSequences() {
  analysisTimers.forEach((timer) => window.clearTimeout(timer));
  veilleTimers.forEach((timer) => window.clearTimeout(timer));
  analysisTimers = [];
  veilleTimers = [];
}

function startAnalysisMode() {
  clearTimedSequences();
  coreLabel.textContent = "SCAN";
  setSystemStatus("Analyse en cours...", "Diagnostics actifs");
  respond("Analyse en cours.");

  [
    { delay: 800, text: "Scan CPU termine...", metrics: { cpu: 76, memory: 49, network: 88 } },
    { delay: 1600, text: "Scan memoire termine...", metrics: { cpu: 64, memory: 52, network: 90 } },
    { delay: 2400, text: "Scan reseau termine...", metrics: { cpu: 61, memory: 46, network: 94 } }
  ].forEach((step) => {
    const timer = window.setTimeout(() => {
      responseBox.textContent = step.text;
      pulseResponse();
      Object.entries(step.metrics).forEach(([name, value]) => setMetric(name, value));
    }, step.delay);
    analysisTimers.push(timer);
  });

  analysisTimers.push(window.setTimeout(() => {
    coreLabel.textContent = "ONLINE";
    setSystemStatus("Systeme en ligne", "Aucun probleme critique");
    respond("Analyse terminee. Aucun probleme critique detecte.");
  }, 3400));
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

  let message = "";

  if (cleanCommand === "aide") {
    message = `Bien recu monsieur. ${commandListMessage()}`;
  } else if (cleanCommand === "heure") {
    message = `Bien recu monsieur. Il est ${new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}.`;
  } else if (cleanCommand === "date") {
    message = `Bien recu monsieur. Nous sommes le ${new Date().toLocaleDateString("fr-FR")}.`;
  } else if (cleanCommand === "ouvre google" || cleanCommand === "ouvrir google") {
    message = await openAppShortcut("google");
  } else if (cleanCommand === "mode analyse") {
    message = "Bien recu monsieur. Analyse en cours.";
    addHistory(cleanCommand, message);
    startAnalysisMode();
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
    message = `Module travail active. Je prepare votre environnement. ${buildWorkPriorities()}`;
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
    startFocusTimer();
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
      message = "Module desktop indisponible. Lancez JARVIS avec npm start pour lire les informations systeme.";
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
      message = "Module desktop indisponible. Fermeture disponible uniquement avec npm start.";
    } else {
      message = "Bien recu monsieur. Fermeture de JARVIS.";
      respond(message);
      addHistory(cleanCommand, message);
      input.value = "";
      window.setTimeout(() => desktop.closeApp(), 900);
      return;
    }
  } else {
    message = `Commande "${cleanCommand}" non reconnue. Essayez "aide" pour voir les commandes, ou utilisez "modules" pour afficher les modules personnels.`;
  }

  respond(message);
  addHistory(cleanCommand, message);
  input.value = "";
}

function startVoiceRecognition() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    respond("La reconnaissance vocale n'est pas disponible sur ce navigateur.");
    return;
  }
  if (activeRecognition) return;

  const recognition = new SpeechRecognition();
  activeRecognition = recognition;
  recognition.lang = "fr-FR";
  recognition.interimResults = false;
  recognition.onresult = (event) => {
    const command = event.results[0][0].transcript;
    input.value = command;
    handleCommand(command);
  };
  recognition.onerror = () => respond("Je n'ai pas compris la commande vocale. Essayez une commande courte, comme aide, statut ou modules.");
  recognition.onend = () => {
    if (activeRecognition === recognition) activeRecognition = null;
    setListening(false);
  };

  try {
    setListening(true);
    recognition.start();
  } catch (error) {
    activeRecognition = null;
    setListening(false);
    respond(`Micro indisponible : ${error.message || "demarrage impossible"}.`);
  }
}

function toggleMicrophone() {
  if (activeRecognition) {
    const recognition = activeRecognition;
    activeRecognition = null;
    setListening(false);
    recognition.stop();
    respond("Micro desactive.", false);
    return;
  }

  startVoiceRecognition();
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

sendBtn.addEventListener("click", () => handleCommand(input.value));
input.addEventListener("keydown", (event) => {
  if (event.key === "Enter") handleCommand(input.value);
});
document.addEventListener("keydown", (event) => {
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
clearHistoryBtn.addEventListener("click", () => {
  clearHistory();
  respond("Historique vide.");
});
document.querySelectorAll("[data-command]").forEach((button) => {
  button.addEventListener("click", () => {
    input.value = button.dataset.command;
    handleCommand(button.dataset.command);
  });
});
voiceBtn.addEventListener("click", toggleMicrophone);
voiceSelect.addEventListener("change", () => {
  const nextIndex = Number(voiceSelect.value);
  selectedVoiceIndex = Number.isFinite(nextIndex) ? nextIndex : 0;
  const selectedVoice = getSelectedVoice();
  preferredVoiceName = selectedVoice ? selectedVoice.name : "";
  preferredVoiceLang = selectedVoice ? selectedVoice.lang || "" : "";
  updateVoiceSummary();
  saveSettings("Voix sauvegardee");
  respond("Bien recu monsieur. Voix mise a jour.");
});
speechRate.addEventListener("input", () => {
  currentSpeechRate = Number(speechRate.value);
  updateVoiceSummary();
});
speechRate.addEventListener("change", () => {
  saveSettings("Vitesse sauvegardee");
  respond(`Commande executee. Vitesse de parole reglee sur ${currentSpeechRate.toFixed(2)}.`);
});
speechPitch.addEventListener("input", () => {
  currentSpeechPitch = Number(speechPitch.value);
  updateVoiceSummary();
});
speechPitch.addEventListener("change", () => {
  saveSettings("Pitch sauvegarde");
  respond(`Commande executee. Pitch vocal regle sur ${currentSpeechPitch.toFixed(2)}.`);
});
speechVolume.addEventListener("input", () => {
  currentSpeechVolume = Number(speechVolume.value);
  updateVoiceSummary();
});
speechVolume.addEventListener("change", () => {
  saveSettings("Volume sauvegarde");
  respond(`Commande executee. Volume vocal regle sur ${currentSpeechVolume.toFixed(2)}.`);
});
saveSettingsBtn.addEventListener("click", () => {
  const saved = saveSettings("Reglages sauvegardes manuellement");
  respond(saved ? "Commande executee. Reglages sauvegardes localement." : "Sauvegarde impossible.", false);
});
resetSettingsBtn.addEventListener("click", () => {
  resetSettingsToDefault(true);
  respond("Commande executee. Parametres remis par defaut.");
});

loadStoredSettings();
loadStoredHistory();
updateClock();
updateMetrics();
loadBrowserVoices();
if (!isWorkMode) setSystemStatus("Systeme en ligne", "Noyau stable");
updateVoiceSummary();
updateFocusCard();
initWelcomeSequence();

window.setInterval(updateClock, 1000);
window.setInterval(updateMetrics, 3000);
if ("speechSynthesis" in window) window.speechSynthesis.onvoiceschanged = loadBrowserVoices;
