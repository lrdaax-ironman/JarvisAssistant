const app = document.getElementById("app");
const input = document.getElementById("command-input");
const sendBtn = document.getElementById("send-btn");
const voiceBtn = document.getElementById("voice-btn");
const responseBox = document.getElementById("assistant-response");
const historyList = document.getElementById("history-list");
const statusText = document.getElementById("status");
const core = document.getElementById("core");
const coreLabel = document.getElementById("core-label");
const clearHistoryBtn = document.getElementById("clear-history-btn");
const welcomeSequence = document.getElementById("welcome-sequence");
const welcomeMessage = document.getElementById("welcome-message");

const currentTime = document.getElementById("current-time");
const currentDate = document.getElementById("current-date");
const systemState = document.getElementById("system-state");
const systemDetail = document.getElementById("system-detail");
const voiceState = document.getElementById("voice-state");
const voiceDetail = document.getElementById("voice-detail");
const focusState = document.getElementById("focus-state");
const focusDetail = document.getElementById("focus-detail");
const voiceSelect = document.getElementById("voice-select");
const voiceName = document.getElementById("voice-name");
const voiceSettingsSummary = document.getElementById("voice-settings-summary");
const speechRate = document.getElementById("speech-rate");
const speechRateValue = document.getElementById("speech-rate-value");
const speechPitch = document.getElementById("speech-pitch");
const speechPitchValue = document.getElementById("speech-pitch-value");
const speechVolume = document.getElementById("speech-volume");
const speechVolumeValue = document.getElementById("speech-volume-value");
const settingsPanel = document.getElementById("settings-panel");
const settingsStatus = document.getElementById("settings-status");
const saveSettingsBtn = document.getElementById("save-settings-btn");
const resetSettingsBtn = document.getElementById("reset-settings-btn");
const workModeBadge = document.getElementById("work-mode-badge");
const desktopApi = window.jarvisDesktop || null;

const SETTINGS_STORAGE_KEY = "jarvisAssistant.settings.v2";
const HISTORY_STORAGE_KEY = "jarvisAssistant.history.v2";
const HISTORY_LIMIT = 20;
const DEFAULT_SETTINGS = {
  voiceName: "",
  voiceLang: "",
  speechRate: 1,
  speechPitch: 0.9,
  speechVolume: 1,
  preferences: {
    workMode: false
  }
};

const metricElements = {
  cpu: {
    bar: document.getElementById("cpu-bar"),
    value: document.getElementById("cpu-value"),
    base: 58
  },
  memory: {
    bar: document.getElementById("memory-bar"),
    value: document.getElementById("memory-value"),
    base: 44
  },
  network: {
    bar: document.getElementById("network-bar"),
    value: document.getElementById("network-value"),
    base: 82
  }
};

const availableCommands = [
  "aide",
  "heure",
  "date",
  "mode analyse",
  "ouvre google",
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
  "ouvre bureau",
  "infos systeme",
  "plein ecran",
  "fenetre",
  "minimise",
  "ferme jarvis",
  "bonjour jarvis",
  "routine du matin",
  "mode travail",
  "parametres",
  "sauvegarde",
  "reset parametres"
];

let isListening = false;
let activeRecognition = null;
let speechToken = 0;
let analysisTimers = [];
let veilleTimers = [];
let focusInterval = null;
let focusEndsAt = 0;
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

// Normalise les commandes vocales et clavier sans changer les commandes supportees.
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

function buildSettingsPayload() {
  const selectedVoice = getSelectedVoice();

  return {
    voiceName: selectedVoice ? selectedVoice.name : preferredVoiceName,
    voiceLang: selectedVoice ? selectedVoice.lang : preferredVoiceLang,
    speechRate: currentSpeechRate,
    speechPitch: currentSpeechPitch,
    speechVolume: currentSpeechVolume,
    preferences: {
      workMode: isWorkMode
    }
  };
}

function saveSettings(statusMessage = "Reglages sauvegardes") {
  const saved = writeJsonStorage(SETTINGS_STORAGE_KEY, buildSettingsPayload());
  setSettingsStatus(saved ? statusMessage : "Sauvegarde indisponible");
  return saved;
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

  if (shouldPersist) {
    saveSettings("Reglages reinitialises");
  } else {
    setSettingsStatus("Reglages par defaut");
  }
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

    if (result && result.ok === false) {
      return `Action desktop impossible : ${result.message || "operation refusee"}.`;
    }

    return successMessage;
  } catch (error) {
    return `Action desktop impossible : ${error.message || "erreur inconnue"}.`;
  }
}

function formatSystemInfo(info) {
  if (!info || info.ok === false) {
    return "Impossible de lire les informations systeme pour le moment.";
  }

  return `Infos systeme : ${info.platform} ${info.release}, architecture ${info.arch}, machine ${info.hostname}. CPU : ${info.cpuCount} coeur(s), ${info.cpuModel}. Memoire : ${info.freeMemoryGb} Go libres sur ${info.totalMemoryGb} Go. Electron ${info.electron}, Chrome ${info.chrome}.`;
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

  if (!voiceProfileInitialized) {
    selectedVoiceIndex = preferredIndex >= 0 ? preferredIndex : defaultIndex >= 0 ? defaultIndex : 0;
    voiceProfileInitialized = true;
  } else if (selectedVoiceIndex >= availableVoices.length) {
    selectedVoiceIndex = preferredIndex >= 0 ? preferredIndex : defaultIndex >= 0 ? defaultIndex : 0;
  }
  populateVoiceSelect();
}

function changeVoice(step = 1) {
  if (!availableVoices.length) {
    return "Aucune voix alternative n'est disponible dans ce navigateur pour le moment.";
  }

  selectedVoiceIndex = (selectedVoiceIndex + step + availableVoices.length) % availableVoices.length;
  voiceSelect.value = String(selectedVoiceIndex);
  updateVoiceSummary();

  const selectedVoice = getSelectedVoice();
  preferredVoiceName = selectedVoice.name;
  preferredVoiceLang = selectedVoice.lang || "";
  return `Je m'en occupe. Nouvelle voix active : ${selectedVoice.name}.`;
}

function setDefaultVoiceProfile(shouldPersist = true) {
  const defaultIndex = availableVoices.findIndex((voice) => voice.default);
  selectedVoiceIndex = defaultIndex >= 0 ? defaultIndex : 0;
  currentSpeechRate = 1;
  currentSpeechPitch = 0.9;
  currentSpeechVolume = 1;
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
  return currentSpeechRate.toFixed(2);
}

function setSpeechPitch(value) {
  currentSpeechPitch = Math.max(0.6, Math.min(1.4, Number(value.toFixed(2))));
  updateVoiceSummary();
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

// Pilote l'etat visuel du micro et la carte de statut vocal.
function setListening(active) {
  isListening = active;
  core.classList.toggle("is-listening", active);
  app.classList.toggle("is-listening", active);
  voiceBtn.classList.toggle("is-listening", active);

  if (active) {
    coreLabel.textContent = "LISTEN";
    setSystemStatus("Ecoute en cours...", "Canal vocal ouvert");
    setVoiceStatus("Ecoute", "Micro actif");
  } else {
    coreLabel.textContent = core.classList.contains("is-speaking") ? "TALK" : "ONLINE";
    if (isWorkMode) {
      setSystemStatus("Mode travail active", "Animations reduites");
    } else {
      setSystemStatus("Systeme en ligne", "Noyau stable");
    }
    if (!core.classList.contains("is-speaking")) {
      setVoiceStatus("Repos", "Micro inactif");
    }
  }
}

function stopSpeech() {
  speechToken += 1;
  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
  setSpeaking(false);
}

// Utilise uniquement l'API navigateur native de synthese vocale.
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
  utterance.lang = "fr-FR";
  utterance.rate = currentSpeechRate;
  utterance.pitch = currentSpeechPitch;
  utterance.volume = currentSpeechVolume;

  const selectedVoice = getSelectedVoice();
  if (selectedVoice) {
    utterance.voice = selectedVoice;
    utterance.lang = selectedVoice.lang || "fr-FR";
  }

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
  historyEntries.forEach((entry) => {
    historyList.append(createHistoryItem(entry));
  });
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
  const time = new Date().toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit"
  });

  historyEntries.unshift({ command, response, time });

  if (historyEntries.length > HISTORY_LIMIT) {
    historyEntries = historyEntries.slice(0, HISTORY_LIMIT);
  }

  renderHistory();
  saveHistory();
}

function clearHistory() {
  historyEntries = [];
  historyList.innerHTML = "";
  saveHistory();
}

// Les cartes dashboard restent locales et ne dependent d'aucune API externe.
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

function setWorkMode(active, shouldPersist = true) {
  isWorkMode = active;
  app.classList.toggle("is-work-mode", active);
  workModeBadge.hidden = !active;

  if (active) {
    setSystemStatus("Mode travail active", "Animations reduites");
  }

  if (shouldPersist) {
    saveSettings(active ? "Mode travail sauvegarde" : "Mode standard sauvegarde");
  }
}

function revealSettingsPanel() {
  settingsPanel.classList.add("is-highlighted");
  settingsPanel.scrollIntoView({ behavior: "smooth", block: "start" });
  setSettingsStatus("Panneau parametres affiche");
  window.setTimeout(() => settingsPanel.classList.remove("is-highlighted"), 1800);
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

function stopFocusTimer(resetCard = true) {
  if (focusInterval) {
    window.clearInterval(focusInterval);
    focusInterval = null;
  }
  focusEndsAt = 0;
  if (resetCard) updateFocusCard();
}

function clearTimedSequences() {
  analysisTimers.forEach((timer) => window.clearTimeout(timer));
  veilleTimers.forEach((timer) => window.clearTimeout(timer));
  analysisTimers = [];
  veilleTimers = [];
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
    const now = new Date();
    message = `Bien recu monsieur. Il est ${now.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}.`;
  } else if (cleanCommand === "date") {
    const today = new Date();
    message = `Bien recu monsieur. Nous sommes le ${today.toLocaleDateString("fr-FR")}.`;
  } else if (cleanCommand === "ouvre google") {
    message = "Je m'en occupe. Ouverture de Google.";
    window.open("https://www.google.com", "_blank");
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
    message = "Bien recu monsieur. Je suis JARVIS, votre assistant personnel. Je peux afficher l'heure, ouvrir des outils Windows, lancer une analyse locale, rester en veille, demarrer un focus de 25 minutes, gerer ma voix et tenir l'historique des commandes.";
  } else if (cleanCommand === "bonjour jarvis") {
    message = "Bonjour monsieur. Tous les systemes sont operationnels.";
  } else if (cleanCommand === "routine du matin") {
    message = buildMorningRoutine();
  } else if (cleanCommand === "mode travail") {
    setWorkMode(true);
    message = "Mode travail active. Je reduis les animations et je peux lancer un minuteur de concentration avec la commande focus.";
  } else if (cleanCommand === "parametres") {
    revealSettingsPanel();
    message = "Je m'en occupe. Panneau parametres affiche.";
  } else if (cleanCommand === "sauvegarde") {
    const saved = saveSettings("Reglages sauvegardes manuellement");
    message = saved ? "Commande executee. Reglages sauvegardes localement." : "Sauvegarde impossible pour le moment.";
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
  } else if (cleanCommand === "focus") {
    message = "Bien recu monsieur. Mode focus lance pour 25 minutes. Je garde le minuteur actif sur le dashboard.";
    startFocusTimer();
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
    const rate = changeSpeechRate(-0.1);
    message = `Bien recu monsieur. Je parlerai plus lentement. Vitesse actuelle : ${rate}.`;
  } else if (cleanCommand === "plus vite") {
    const rate = changeSpeechRate(0.1);
    message = `Bien recu monsieur. J'augmente la vitesse. Vitesse actuelle : ${rate}.`;
  } else if (cleanCommand === "voix grave") {
    const pitch = setSpeechPitch(0.7);
    message = `Je m'en occupe. Voix plus grave activee. Pitch actuel : ${pitch}.`;
  } else if (cleanCommand === "voix normale") {
    setDefaultVoiceProfile();
    message = "Commande executee. Voix, vitesse et pitch remis au profil par defaut.";
  } else if (cleanCommand === "ouvre calculatrice") {
    message = await runDesktopAction("openCalculator", "Je m'en occupe. Ouverture de la calculatrice Windows.");
  } else if (cleanCommand === "ouvre navigateur") {
    message = await runDesktopAction("openBrowser", "Je m'en occupe. Ouverture du navigateur par defaut.");
  } else if (cleanCommand === "ouvre documents") {
    message = await runDesktopAction("openFolder", "Je m'en occupe. Ouverture du dossier Documents.", "documents");
  } else if (cleanCommand === "ouvre bureau") {
    message = await runDesktopAction("openFolder", "Je m'en occupe. Ouverture du Bureau Windows.", "desktop");
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
    message = `Commande "${cleanCommand}" non reconnue. Essayez "aide" pour voir les commandes, ou utilisez "presentation" pour decouvrir mes capacites.`;
  }

  respond(message);
  addHistory(cleanCommand, message);
  input.value = "";
}

function buildStatusReport() {
  const focusText = focusInterval ? `focus actif (${focusState.textContent} restantes)` : "focus inactif";
  const desktopText = getDesktopApi() ? "desktop Electron actif" : "mode navigateur";
  const workModeText = isWorkMode ? "mode travail actif" : "mode travail inactif";
  return `Statut complet : ${systemState.textContent}. Vocal : ${voiceState.textContent}. ${desktopText}. ${workModeText}. CPU ${metricElements.cpu.value.textContent}, memoire ${metricElements.memory.value.textContent}, reseau ${metricElements.network.value.textContent}. ${focusText}. Historique : ${historyEntries.length} entree(s).`;
}

// Simulation volontairement locale pour garder le projet ouvrable en simple fichier HTML.
function startAnalysisMode() {
  clearTimedSequences();

  coreLabel.textContent = "SCAN";
  setSystemStatus("Analyse en cours...", "Diagnostics actifs");
  respond("Analyse en cours.");

  const steps = [
    { delay: 800, text: "Scan CPU termine...", metrics: { cpu: 76, memory: 49, network: 88 } },
    { delay: 1600, text: "Scan memoire termine...", metrics: { cpu: 64, memory: 52, network: 90 } },
    { delay: 2400, text: "Scan reseau termine...", metrics: { cpu: 61, memory: 46, network: 94 } }
  ];

  steps.forEach((step) => {
    const timer = window.setTimeout(() => {
      responseBox.textContent = step.text;
      pulseResponse();
      Object.entries(step.metrics).forEach(([name, value]) => setMetric(name, value));
    }, step.delay);
    analysisTimers.push(timer);
  });

  const finalTimer = window.setTimeout(() => {
    coreLabel.textContent = "ONLINE";
    setSystemStatus("Systeme en ligne", "Aucun probleme critique");
    respond("Analyse terminee. Aucun probleme critique detecte.");
  }, 3400);

  analysisTimers.push(finalTimer);
}

function startWatchMode() {
  clearTimedSequences();
  coreLabel.textContent = "WATCH";
  setSystemStatus("Veille active", "Priorites locales en analyse");
  respond("Je reste en veille. Analyse des signaux importants en cours.");

  const steps = [
    "Verification agenda local simulee...",
    "Priorites detectees : focus, maintenance, commandes vocales.",
    "Alerte critique : aucune. Systeme disponible."
  ];

  steps.forEach((text, index) => {
    const timer = window.setTimeout(() => {
      responseBox.textContent = text;
      pulseResponse();
    }, 900 + index * 900);
    veilleTimers.push(timer);
  });

  const finalTimer = window.setTimeout(() => {
    coreLabel.textContent = "ONLINE";
    setSystemStatus("Systeme en ligne", "Veille terminee");
    respond("Veille terminee. Rien d'urgent a signaler.");
  }, 3900);

  veilleTimers.push(finalTimer);
}

function resetInterface() {
  clearTimedSequences();
  stopFocusTimer();
  stopSpeech();
  clearHistory();
  input.value = "";
  setDefaultVoiceProfile();
  setWorkMode(false);
  coreLabel.textContent = "ONLINE";
  setListening(false);
  setResponding(false);
  setSystemStatus("Systeme en ligne", "Noyau stable");
  setVoiceStatus("Repos", "Micro inactif");
  responseBox.textContent = "Bonjour monsieur. Systeme pret.";
  updateClock();
  updateMetrics();
}

function initWelcomeSequence() {
  const bootMessages = [
    "Connexion au noyau principal...",
    "Calibration des modules vocaux...",
    "Interface operationnelle."
  ];

  bootMessages.forEach((message, index) => {
    window.setTimeout(() => {
      welcomeMessage.textContent = message;
    }, index * 700);
  });

  window.setTimeout(() => {
    welcomeSequence.classList.add("is-hidden");
    respond("Bonjour monsieur. JARVIS est en ligne. Dites presentation pour connaitre mes capacites.");
  }, 2600);
}

function startVoiceRecognition() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    respond("La reconnaissance vocale n'est pas disponible sur ce navigateur.");
    return;
  }

  if (activeRecognition) {
    return;
  }

  const recognition = new SpeechRecognition();
  activeRecognition = recognition;
  recognition.lang = "fr-FR";
  recognition.interimResults = false;

  recognition.onresult = (event) => {
    const command = event.results[0][0].transcript;
    input.value = command;
    handleCommand(command);
  };

  recognition.onerror = () => {
    respond("Je n'ai pas compris la commande vocale. Essayez une commande courte, comme aide, statut ou focus.");
  };

  recognition.onend = () => {
    if (activeRecognition === recognition) {
      activeRecognition = null;
    }
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

sendBtn.addEventListener("click", () => {
  handleCommand(input.value);
});

input.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    handleCommand(input.value);
  }
});

document.addEventListener("keydown", (event) => {
  if (!event.ctrlKey || event.altKey || event.metaKey) {
    return;
  }

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
    const command = button.dataset.command;
    input.value = command;
    handleCommand(command);
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
if (!isWorkMode) {
  setSystemStatus("Systeme en ligne", "Noyau stable");
}
updateVoiceSummary();
updateFocusCard();
initWelcomeSequence();

window.setInterval(updateClock, 1000);
window.setInterval(updateMetrics, 3000);

if ("speechSynthesis" in window) {
  window.speechSynthesis.onvoiceschanged = loadBrowserVoices;
}
