const input = document.getElementById("command-input");
const sendBtn = document.getElementById("send-btn");
const voiceBtn = document.getElementById("voice-btn");
const responseBox = document.getElementById("assistant-response");
const historyList = document.getElementById("history-list");
const statusText = document.getElementById("status");

function speak(text) {
  if (!("speechSynthesis" in window)) return;

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "fr-FR";
  utterance.rate = 1;
  utterance.pitch = 0.9;

  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
}

function addHistory(command) {
  const li = document.createElement("li");
  li.textContent = `> ${command}`;
  historyList.prepend(li);

  if (historyList.children.length > 10) {
    historyList.removeChild(historyList.lastChild);
  }
}

function respond(message) {
  responseBox.textContent = message;
  speak(message);
}

function handleCommand(command) {
  const cleanCommand = command.trim().toLowerCase();

  if (!cleanCommand) return;

  addHistory(cleanCommand);

  if (cleanCommand === "aide") {
    respond("Commandes disponibles : aide, heure, date, mode analyse, ouvre google, clear.");
  } else if (cleanCommand === "heure") {
    const now = new Date();
    respond(`Il est ${now.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}.`);
  } else if (cleanCommand === "date") {
    const today = new Date();
    respond(`Nous sommes le ${today.toLocaleDateString("fr-FR")}.`);
  } else if (cleanCommand === "ouvre google") {
    respond("Ouverture de Google.");
    window.open("https://www.google.com", "_blank");
  } else if (cleanCommand === "mode analyse") {
    startAnalysisMode();
  } else if (cleanCommand === "clear") {
    historyList.innerHTML = "";
    respond("Historique vidé.");
  } else {
    respond("Commande non reconnue. Dites aide pour afficher les commandes disponibles.");
  }

  input.value = "";
}

function startAnalysisMode() {
  statusText.textContent = "Analyse en cours...";
  respond("Analyse système en cours.");

  setTimeout(() => {
    responseBox.textContent = "Scan CPU terminé...";
  }, 800);

  setTimeout(() => {
    responseBox.textContent = "Scan mémoire terminé...";
  }, 1600);

  setTimeout(() => {
    responseBox.textContent = "Scan réseau terminé...";
  }, 2400);

  setTimeout(() => {
    statusText.textContent = "Système en ligne";
    respond("Analyse terminée. Aucun problème critique détecté.");
  }, 3400);
}

sendBtn.addEventListener("click", () => {
  handleCommand(input.value);
});

input.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    handleCommand(input.value);
  }
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

  statusText.textContent = "Écoute en cours...";
  recognition.start();

  recognition.onresult = (event) => {
    const command = event.results[0][0].transcript;
    input.value = command;
    handleCommand(command);
  };

  recognition.onerror = () => {
    respond("Je n'ai pas compris la commande vocale.");
  };

  recognition.onend = () => {
    statusText.textContent = "Système en ligne";
  };
});
