const { contextBridge, ipcRenderer } = require("electron");

const allowedFolders = ["documents", "desktop"];
const jarvisAiRendererScript = `
(() => {
  const $ = (id) => document.getElementById(id);
  const normalize = (value) => String(value || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\\u0300-\\u036f]/g, "")
    .replace(/\\s+/g, " ");

  const aiCommands = ["mode ia", "test ia", "stop ia", "aide ia"];
  let aiEnabled = true;
  let aiThinking = false;

  function ensureAiStyles() {
    if ($("jarvis-ai-v3-styles")) return;
    const style = document.createElement("style");
    style.id = "jarvis-ai-v3-styles";
    style.textContent = [
      ".ai-mode-badge{color:var(--teal);border-color:rgba(73,255,200,.5);background:rgba(73,255,200,.1);box-shadow:0 0 22px rgba(73,255,200,.14)}",
      ".ai-card{border-color:rgba(73,255,200,.32)}",
      ".app.is-ai-thinking .ai-card,.app.is-ai-thinking .response-box{border-color:rgba(255,200,87,.68);box-shadow:0 0 28px rgba(255,200,87,.16),inset 0 0 22px rgba(255,200,87,.08)}",
      ".app.is-ai-thinking .ai-mode-badge,.app.is-ai-thinking .status-pill{color:var(--amber);border-color:rgba(255,200,87,.56);background:rgba(255,200,87,.1)}",
      ".app.is-ai-error .ai-card,.app.is-ai-error .response-box{border-color:rgba(255,89,100,.68);box-shadow:0 0 28px rgba(255,89,100,.16),inset 0 0 22px rgba(255,89,100,.08)}",
      ".app.is-ai-error .ai-mode-badge{color:var(--red);border-color:rgba(255,89,100,.6);background:rgba(255,89,100,.1)}"
    ].join("");
    document.head.append(style);
  }

  function ensureAiInterface() {
    ensureAiStyles();

    const headerStatus = document.querySelector(".header-status");
    if (headerStatus && !$("ai-mode-badge")) {
      const badge = document.createElement("span");
      badge.id = "ai-mode-badge";
      badge.className = "mode-badge ai-mode-badge";
      badge.textContent = "MODE IA ACTIF";
      const statusPill = headerStatus.querySelector(".status-pill");
      headerStatus.insertBefore(badge, statusPill || null);
    }

    const commandList = document.querySelector(".command-list");
    if (commandList && !commandList.querySelector('[data-command="mode ia"]')) {
      aiCommands.forEach((command) => {
        const item = document.createElement("li");
        const button = document.createElement("button");
        button.type = "button";
        button.dataset.command = command;
        button.textContent = command;
        button.addEventListener("click", () => {
          const input = $("command-input");
          if (input) input.value = command;
          window.handleCommand(command);
        });
        item.append(button);
        commandList.append(item);
      });
    }

    const cards = document.querySelector(".dashboard-cards");
    if (cards && !$("ai-state")) {
      const card = document.createElement("article");
      card.className = "dashboard-card dashboard-card-wide ai-card";
      card.innerHTML = '<span>Mode IA</span><strong id="ai-state">Mode IA actif</strong><small id="ai-detail">Questions naturelles activ\\u00e9es</small>';
      const voiceCard = cards.querySelector(".voice-card");
      cards.insertBefore(card, voiceCard || null);
    }
  }

  function setAiVisualStatus(label, detail, state = "active") {
    const app = $("app");
    const badge = $("ai-mode-badge");
    const aiState = $("ai-state");
    const aiDetail = $("ai-detail");

    if (badge) {
      badge.textContent = label.toUpperCase();
      badge.hidden = false;
    }
    if (aiState) aiState.textContent = label;
    if (aiDetail) aiDetail.textContent = detail;
    if (app) {
      app.classList.toggle("is-ai-thinking", state === "thinking");
      app.classList.toggle("is-ai-error", state === "error");
    }
  }

  function setSystem(label, detail) {
    if (typeof window.setSystemStatus === "function") {
      window.setSystemStatus(label, detail);
      return;
    }
    const status = $("status");
    const systemState = $("system-state");
    const systemDetail = $("system-detail");
    if (status) status.textContent = label;
    if (systemState) systemState.textContent = label;
    if (systemDetail) systemDetail.textContent = detail;
  }

  function respondWithHistory(command, message, shouldSpeak = true) {
    if (typeof window.respond === "function") window.respond(message, shouldSpeak);
    else {
      const responseBox = $("assistant-response");
      if (responseBox) responseBox.textContent = message;
    }
    if (typeof window.addHistory === "function") window.addHistory(command, message);
  }

  function getAiHelpMessage() {
    return "Mode IA : les commandes connues restent ex\\u00e9cut\\u00e9es localement. Les questions naturelles ou demandes inconnues sont envoy\\u00e9es \\u00e0 l'IA via OpenAI. Utilisez test ia pour v\\u00e9rifier la connexion, stop ia pour revenir aux commandes locales, et mode ia pour r\\u00e9activer l'IA.";
  }

  function getAvailableCommands() {
    try {
      if (Array.isArray(availableCommands)) return availableCommands;
    } catch (_error) {
      return Array.isArray(window.availableCommands) ? window.availableCommands : [];
    }

    return Array.isArray(window.availableCommands) ? window.availableCommands : [];
  }

  function setAiMode(enabled, detail) {
    aiEnabled = enabled;
    setAiVisualStatus(enabled ? "Mode IA actif" : "IA pausee", detail || (enabled ? "Questions naturelles activ\\u00e9es" : "Commandes locales uniquement"), enabled ? "active" : "paused");
  }

  async function askAi(message, historyCommand) {
    if (!window.jarvisAPI || typeof window.jarvisAPI.askAI !== "function") {
      const unavailableMessage = "Module IA indisponible. Lancez JARVIS avec npm start dans Electron.";
      setAiVisualStatus("Erreur IA", "Pont IA indisponible", "error");
      respondWithHistory(historyCommand, unavailableMessage);
      return;
    }

    const input = $("command-input");
    const sendBtn = $("send-btn");
    const responseBox = $("assistant-response");
    aiThinking = true;
    if (sendBtn) sendBtn.disabled = true;
    if (input) input.disabled = true;
    if (typeof window.stopSpeech === "function") window.stopSpeech();
    setAiVisualStatus("R\\u00e9flexion en cours", "IA en r\\u00e9flexion...", "thinking");
    setSystem("R\\u00e9flexion en cours", "Mode IA actif");
    if (responseBox) responseBox.textContent = "IA en r\\u00e9flexion...";
    if (typeof window.pulseResponse === "function") window.pulseResponse();

    try {
      const response = await window.jarvisAPI.askAI(message);
      const answer = typeof response === "string" && response.trim() ? response.trim() : "R\\u00e9ponse IA vide.";
      const isError = answer.startsWith("Cl\\u00e9 API absente") || answer.startsWith("Erreur IA");
      setAiVisualStatus(isError ? "Erreur IA" : "R\\u00e9ponse IA re\\u00e7ue", isError ? "Action requise" : "Transmission termin\\u00e9e", isError ? "error" : "active");
      setSystem(isError ? "Erreur IA" : "R\\u00e9ponse IA re\\u00e7ue", isError ? "V\\u00e9rification requise" : "Mode IA actif");
      respondWithHistory(historyCommand, answer);
    } catch (error) {
      const answer = "Erreur IA. " + (error.message || "La demande n'a pas pu \\u00eatre trait\\u00e9e.");
      setAiVisualStatus("Erreur IA", "Connexion interrompue", "error");
      setSystem("Erreur IA", "Connexion interrompue");
      respondWithHistory(historyCommand, answer);
    } finally {
      aiThinking = false;
      if (sendBtn) sendBtn.disabled = false;
      if (input) {
        input.disabled = false;
        input.value = "";
        input.focus();
      }
    }
  }

  function installAiCommandRouter() {
    if (window.__jarvisAiV3Installed) return;
    window.__jarvisAiV3Installed = true;

    const originalHandleCommand = window.handleCommand;
    if (typeof originalHandleCommand !== "function") return;
    const commandList = getAvailableCommands();
    if (Array.isArray(commandList)) {
      aiCommands.forEach((command) => {
        if (!commandList.includes(command)) commandList.push(command);
      });
    }

    const enhancedHandleCommand = async (command) => {
      const cleanCommand = normalize(command);
      if (!cleanCommand || aiThinking) return;

      if (cleanCommand === "mode ia") {
        setAiMode(true, "Questions naturelles activ\\u00e9es");
        respondWithHistory(cleanCommand, "Mode IA actif. Les commandes connues restent locales, et les questions naturelles seront envoy\\u00e9es \\u00e0 l'IA.");
        const input = $("command-input");
        if (input) input.value = "";
        return;
      }

      if (cleanCommand === "aide ia") {
        const message = getAiHelpMessage();
        respondWithHistory(cleanCommand, message);
        const input = $("command-input");
        if (input) input.value = "";
        return;
      }

      if (cleanCommand === "stop ia") {
        setAiMode(false, "Commandes locales uniquement");
        respondWithHistory(cleanCommand, "Mode IA suspendu. Je reste disponible pour les commandes locales uniquement.");
        const input = $("command-input");
        if (input) input.value = "";
        return;
      }

      if (cleanCommand === "test ia") {
        if (!aiEnabled) setAiMode(true, "Test de connexion");
        await askAi("R\\u00e9ponds en une phrase courte pour confirmer que la connexion IA de JARVIS fonctionne.", cleanCommand);
        return;
      }

      const isKnownLocalCommand = getAvailableCommands().includes(cleanCommand);
      if (isKnownLocalCommand || !aiEnabled) {
        return originalHandleCommand(command);
      }

      await askAi(String(command || "").trim(), cleanCommand);
    };

    window.handleCommand = enhancedHandleCommand;
    try {
      handleCommand = enhancedHandleCommand;
    } catch (_error) {
      // Le fallback window.handleCommand reste suffisant pour les boutons ajoutes par la V3.
    }
  }

  ensureAiInterface();
  setAiMode(true, "Questions naturelles activ\\u00e9es");
  installAiCommandRouter();
})();
`;

function injectJarvisAiRenderer() {
  window.addEventListener("DOMContentLoaded", () => {
    const script = document.createElement("script");
    script.textContent = jarvisAiRendererScript;
    document.documentElement.append(script);
    script.remove();
  });
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
  closeApp: () => ipcRenderer.invoke("jarvis:close-app")
});

contextBridge.exposeInMainWorld("jarvisAPI", {
  askAI: (message) => {
    if (typeof message !== "string") {
      return Promise.resolve("Demande IA invalide.");
    }

    return ipcRenderer.invoke("ask-ai", message);
  }
});

injectJarvisAiRenderer();
