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
  "reset"
];

let isListening = false;
let speechToken = 0;
let analysisTimers = [];
let veilleTimers = [];
let focusInterval = null;
let focusEndsAt = 0;

// Normalise les commandes vocales et clavier sans changer les commandes supportees.
function normalizeCommand(command) {
  return command
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ");
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
    setSystemStatus("Systeme en ligne", "Noyau stable");
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
  utterance.rate = 1;
  utterance.pitch = 0.9;

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

function addHistory(command, response) {
  const item = document.createElement("li");
  const time = new Date().toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit"
  });

  const timeElement = document.createElement("span");
  const contentElement = document.createElement("div");
  const commandElement = document.createElement("div");
  const responseElement = document.createElement("div");

  item.className = "history-item";
  timeElement.className = "history-time";
  commandElement.className = "history-command";
  responseElement.className = "history-response";

  timeElement.textContent = time;
  commandElement.textContent = `> ${command}`;
  responseElement.textContent = response;

  contentElement.append(commandElement, responseElement);
  item.append(timeElement, contentElement);
  historyList.prepend(item);

  if (historyList.children.length > 16) {
    historyList.removeChild(historyList.lastChild);
  }
}

function clearHistory() {
  historyList.innerHTML = "";
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

function handleCommand(command) {
  const cleanCommand = normalizeCommand(command);

  if (!cleanCommand) return;

  let message = "";

  if (cleanCommand === "aide") {
    message = commandListMessage();
  } else if (cleanCommand === "heure") {
    const now = new Date();
    message = `Il est ${now.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}.`;
  } else if (cleanCommand === "date") {
    const today = new Date();
    message = `Nous sommes le ${today.toLocaleDateString("fr-FR")}.`;
  } else if (cleanCommand === "ouvre google") {
    message = "Ouverture de Google.";
    window.open("https://www.google.com", "_blank");
  } else if (cleanCommand === "mode analyse") {
    message = "Analyse systeme en cours.";
    addHistory(cleanCommand, message);
    startAnalysisMode();
    input.value = "";
    return;
  } else if (cleanCommand === "clear") {
    clearHistory();
    respond("Historique vide.");
    input.value = "";
    return;
  } else if (cleanCommand === "presentation") {
    message = "Je suis JARVIS. Je peux afficher l'heure, la date, ouvrir Google, lancer une analyse locale, surveiller les informations importantes, demarrer un focus de 25 minutes, lire mes reponses et tenir un historique des commandes.";
  } else if (cleanCommand === "statut") {
    message = buildStatusReport();
  } else if (cleanCommand === "veille") {
    message = "Veille locale active. Analyse des signaux importants en cours.";
    addHistory(cleanCommand, message);
    startWatchMode();
    input.value = "";
    return;
  } else if (cleanCommand === "focus") {
    message = "Mode focus lance pour 25 minutes. Je garde le minuteur actif sur le dashboard.";
    startFocusTimer();
  } else if (cleanCommand === "stop") {
    message = "Synthese vocale arretee.";
    stopSpeech();
    respond(message, false);
    addHistory(cleanCommand, message);
    input.value = "";
    return;
  } else if (cleanCommand === "reset") {
    message = "Interface remise a l'etat initial.";
    resetInterface();
    respond(message);
    addHistory(cleanCommand, message);
    input.value = "";
    return;
  } else {
    message = `Commande "${cleanCommand}" non reconnue. Essayez "aide" pour voir les commandes, ou utilisez "presentation" pour decouvrir mes capacites.`;
  }

  respond(message);
  addHistory(cleanCommand, message);
  input.value = "";
}

function buildStatusReport() {
  const focusText = focusInterval ? `focus actif (${focusState.textContent} restantes)` : "focus inactif";
  return `Statut complet : ${systemState.textContent}. Vocal : ${voiceState.textContent}. CPU ${metricElements.cpu.value.textContent}, memoire ${metricElements.memory.value.textContent}, reseau ${metricElements.network.value.textContent}. ${focusText}. Historique : ${historyList.children.length} entree(s).`;
}

// Simulation volontairement locale pour garder le projet ouvrable en simple fichier HTML.
function startAnalysisMode() {
  clearTimedSequences();

  coreLabel.textContent = "SCAN";
  setSystemStatus("Analyse en cours...", "Diagnostics actifs");
  respond("Analyse systeme en cours.");

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
  respond("Veille locale active. Analyse des signaux importants en cours.");

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

sendBtn.addEventListener("click", () => {
  handleCommand(input.value);
});

input.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    handleCommand(input.value);
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

voiceBtn.addEventListener("click", () => {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    respond("La reconnaissance vocale n'est pas disponible sur ce navigateur.");
    return;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = "fr-FR";
  recognition.interimResults = false;

  setListening(true);
  recognition.start();

  recognition.onresult = (event) => {
    const command = event.results[0][0].transcript;
    input.value = command;
    handleCommand(command);
  };

  recognition.onerror = () => {
    respond("Je n'ai pas compris la commande vocale. Essayez une commande courte, comme aide, statut ou focus.");
  };

  recognition.onend = () => {
    setListening(false);
  };
});

updateClock();
updateMetrics();
setSystemStatus("Systeme en ligne", "Noyau stable");
setVoiceStatus("Repos", "Micro inactif");
updateFocusCard();
initWelcomeSequence();

window.setInterval(updateClock, 1000);
window.setInterval(updateMetrics, 3000);
