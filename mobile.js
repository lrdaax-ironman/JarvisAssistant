(() => {
  const APP_VERSION = "4.1 mobile";
  const STORAGE_PREFIX = "jarvis-mobile:";
  const STORE = {
    tasks: `${STORAGE_PREFIX}tasks`,
    notes: `${STORAGE_PREFIX}notes`,
    reminders: `${STORAGE_PREFIX}reminders`,
    planning: `${STORAGE_PREFIX}planning`,
    memories: `${STORAGE_PREFIX}memories`,
    preferences: `${STORAGE_PREFIX}preferences`
  };

  const $ = (id) => document.getElementById(id);
  const responseBox = $("assistant-response");
  const statusBadge = $("mobile-status");
  const commandForm = $("command-form");
  const commandInput = $("command-input");
  const installPanel = $("install-panel");
  const installButton = $("install-button");
  const pwaState = $("pwa-state");

  let deferredInstallPrompt = null;

  function normalize(value) {
    return String(value || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[-_']/g, " ")
      .toLowerCase()
      .trim()
      .replace(/\s+/g, " ");
  }

  function readJson(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return fallback;
      const parsed = JSON.parse(raw);
      return parsed || fallback;
    } catch (error) {
      console.warn("JARVIS mobile storage read error", error);
      return fallback;
    }
  }

  function writeJson(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.warn("JARVIS mobile storage write error", error);
      setResponse("Stockage indisponible", "Le navigateur refuse le stockage local. Les donnees mobiles ne peuvent pas etre sauvegardees pour le moment.");
      return false;
    }
  }

  function getItems(type) {
    return readJson(STORE[type], []);
  }

  function saveItems(type, items) {
    return writeJson(STORE[type], items);
  }

  function createItem(content, extra = {}) {
    return {
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      content,
      createdAt: new Date().toISOString(),
      ...extra
    };
  }

  function setStatus(text, tone = "ok") {
    if (!statusBadge) return;
    statusBadge.textContent = text;
    statusBadge.dataset.tone = tone;
  }

  function setResponse(title, body, list = []) {
    if (!responseBox) return;
    const items = Array.isArray(list) ? list.filter(Boolean) : [];
    responseBox.innerHTML = `
      <p><strong>${escapeHtml(title)}</strong></p>
      <p>${escapeHtml(body)}</p>
      ${items.length ? `<ul>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>` : ""}
    `;
    setStatus("Pret");
  }

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function formatList(items, emptyText) {
    if (!items.length) return [emptyText];
    return items.slice(-8).reverse().map((item) => {
      const done = item.done || item.status === "completed" ? " [termine]" : "";
      return `${item.content || item.title}${done}`;
    });
  }

  function updateCounts() {
    const tasks = getItems("tasks");
    const notes = getItems("notes");
    const reminders = getItems("reminders");
    const planning = getItems("planning");
    const memories = getItems("memories");

    const counters = {
      "tasks-count": `${tasks.filter((task) => task.status !== "completed").length} en cours`,
      "notes-count": `${notes.length} note${notes.length > 1 ? "s" : ""}`,
      "reminders-count": `${reminders.length} rappel${reminders.length > 1 ? "s" : ""}`,
      "planning-count": `${planning.length} entree${planning.length > 1 ? "s" : ""}`,
      "memory-count": `${memories.length} memoire${memories.length > 1 ? "s" : ""}`
    };

    Object.entries(counters).forEach(([id, text]) => {
      const element = $(id);
      if (element) element.textContent = text;
    });
  }

  function isStandalonePwa() {
    return window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;
  }

  function updatePwaState() {
    if (pwaState) pwaState.textContent = isStandalonePwa() ? "Installee" : "Navigateur";
  }

  async function promptInstall() {
    if (!deferredInstallPrompt) {
      setResponse(
        "Installation mobile",
        "Si le bouton d'installation n'apparait pas, utilisez le menu du navigateur puis Ajouter a l'ecran d'accueil."
      );
      return;
    }

    deferredInstallPrompt.prompt();
    const choice = await deferredInstallPrompt.userChoice.catch(() => null);
    deferredInstallPrompt = null;
    if (installPanel) installPanel.hidden = true;

    if (choice && choice.outcome === "accepted") {
      setResponse("Installation lancee", "JARVIS va etre ajoute a votre ecran d'accueil si le navigateur confirme l'installation.");
    } else {
      setResponse("Installation annulee", "Vous pourrez relancer l'installation depuis la commande installer jarvis.");
    }
  }

  function desktopOnlyResponse() {
    setResponse("Version desktop requise", "Cette fonctionnalite est disponible uniquement sur la version desktop.");
  }

  function addTask(text) {
    if (!text) {
      setResponse("Tache vide", "Precisez le contenu de la tache, par exemple : ajoute tache tester Jarvis.");
      return;
    }
    const tasks = getItems("tasks");
    tasks.push(createItem(text, { status: "todo" }));
    saveItems("tasks", tasks);
    updateCounts();
    setResponse("Tache ajoutee", "Tache enregistree dans le stockage mobile.", [text]);
  }

  function completeTask(query) {
    const tasks = getItems("tasks");
    const normalizedQuery = normalize(query);
    const task = tasks.find((item) => normalize(item.content || item.title).includes(normalizedQuery) && item.status !== "completed");
    if (!task) {
      setResponse("Tache introuvable", "Aucune tache mobile ne correspond a votre recherche.");
      return;
    }
    task.status = "completed";
    task.completedAt = new Date().toISOString();
    saveItems("tasks", tasks);
    updateCounts();
    setResponse("Tache terminee", "J'ai marque cette tache comme terminee.", [task.content || task.title]);
  }

  function addNote(text) {
    if (!text) {
      setResponse("Note vide", "Precisez le contenu de la note, par exemple : note idee de routine mobile.");
      return;
    }
    const notes = getItems("notes");
    notes.push(createItem(text));
    saveItems("notes", notes);
    updateCounts();
    setResponse("Note enregistree", "Note ajoutee au stockage mobile.", [text]);
  }

  function addReminder(text) {
    if (!text) {
      setResponse("Rappel vide", "Precisez le contenu du rappel, par exemple : rappelle-moi verifier Jarvis.");
      return;
    }
    const reminders = getItems("reminders");
    reminders.push(createItem(text, { done: false }));
    saveItems("reminders", reminders);
    updateCounts();
    setResponse("Rappel ajoute", "Rappel simple enregistre dans la version mobile.", [text]);
  }

  function addPlanning(text) {
    if (!text) {
      setResponse("Planning vide", "Precisez l'element de planning a enregistrer.");
      return;
    }
    const planning = getItems("planning");
    planning.push(createItem(text));
    saveItems("planning", planning);
    updateCounts();
    setResponse("Planning mis a jour", "Element ajoute au planning mobile.", [text]);
  }

  function addMemory(text) {
    if (!text) {
      setResponse("Memoire vide", "Precisez l'information a memoriser, par exemple : souviens-toi que je travaille sur Jarvis.");
      return;
    }
    const memories = getItems("memories");
    memories.push(createItem(text));
    saveItems("memories", memories);
    updateCounts();
    setResponse("Memoire mobile ajoutee", "Information enregistree localement dans ce navigateur.", [text]);
  }

  function clearStore(type, label) {
    saveItems(type, []);
    updateCounts();
    setResponse(`${label} vide`, `Les donnees ${label.toLowerCase()} mobiles ont ete supprimees.`);
  }

  function showHelp() {
    setResponse(
      "Aide mobile",
      "Cette version est volontairement simple, tactile et independante d'Electron.",
      [
        "ajoute tache finir Jarvis",
        "termine tache Jarvis",
        "note idee de contenu",
        "rappelle-moi verifier le build",
        "ajoute planning test mobile",
        "souviens-toi que je travaille sur Jarvis"
      ]
    );
  }

  function showMobileFeatures() {
    setResponse(
      "Fonctionnalites mobile",
      "La version mobile gere les commandes texte simples, notes, taches, rappels, planning, memoire navigateur et installation PWA.",
      ["Tout reste dans localStorage.", "Aucune API externe n'est requise.", "L'interface fonctionne sans window.jarvisAPI."]
    );
  }

  function showDesktopFeatures() {
    setResponse(
      "Fonctionnalites desktop",
      "La version desktop Electron garde Ollama, les fichiers locaux, les commandes systeme, la memoire fichier et les automatisations avancees.",
      ["Ouvrir documents", "Ollama local", "Commandes fenetre Electron", "Stockage JSON local"]
    );
  }

  async function runCommand(rawCommand) {
    const command = String(rawCommand || "").trim();
    const clean = normalize(command);

    if (!clean) {
      setResponse("Commande vide", "Entrez une commande ou choisissez une carte mobile.");
      return;
    }

    setStatus("Analyse");

    const desktopOnly = [
      "ouvrir documents",
      "ouvre documents",
      "ouvrir bureau",
      "ouvre bureau",
      "ouvre calculatrice",
      "plein ecran",
      "minimise",
      "ferme jarvis",
      "statut ia",
      "test ia",
      "ollama statut"
    ];

    if (desktopOnly.some((item) => clean.includes(item))) {
      desktopOnlyResponse();
    } else if (clean === "aide") {
      showHelp();
    } else if (clean === "version mobile" || clean === "mode mobile") {
      setResponse("JARVIS mobile", `Version ${APP_VERSION}. Interface tactile dediee, stable sur navigateur mobile.`);
    } else if (clean === "fonctionnalites mobile") {
      showMobileFeatures();
    } else if (clean === "fonctionnalites desktop") {
      showDesktopFeatures();
    } else if (clean === "installer jarvis") {
      await promptInstall();
    } else if (clean === "ia") {
      setResponse("IA mobile", "L'IA locale Ollama reste disponible sur la version desktop. Une passerelle mobile pourra etre ajoutee plus tard.");
    } else if (clean === "taches" || clean === "mes taches" || clean === "tache") {
      setResponse("Taches mobiles", "Voici les taches enregistrees dans ce navigateur.", formatList(getItems("tasks"), "Aucune tache mobile pour le moment."));
    } else if (clean.startsWith("ajoute tache ")) {
      addTask(command.replace(/^ajoute\s+t[aâ]che\s+/i, "").trim());
    } else if (clean.startsWith("termine tache ")) {
      completeTask(command.replace(/^termine\s+t[aâ]che\s+/i, "").trim());
    } else if (clean === "notes" || clean === "affiche notes") {
      setResponse("Notes mobiles", "Voici les notes enregistrees dans ce navigateur.", formatList(getItems("notes"), "Aucune note mobile pour le moment."));
    } else if (clean.startsWith("note ")) {
      addNote(command.slice(5).trim());
    } else if (clean === "rappels" || clean === "mes rappels") {
      setResponse("Rappels mobiles", "Voici les rappels simples enregistres.", formatList(getItems("reminders"), "Aucun rappel mobile pour le moment."));
    } else if (clean.startsWith("rappelle moi ")) {
      addReminder(command.replace(/^rappelle[- ]moi\s+/i, "").trim());
    } else if (clean === "planning") {
      setResponse("Planning mobile", "Voici le planning enregistre dans ce navigateur.", formatList(getItems("planning"), "Aucun planning mobile pour le moment."));
    } else if (clean.startsWith("ajoute planning ")) {
      addPlanning(command.replace(/^ajoute\s+planning\s+/i, "").trim());
    } else if (clean === "memoire" || clean === "affiche memoire") {
      setResponse("Memoire mobile", "Voici la memoire locale de ce navigateur.", formatList(getItems("memories"), "Aucune memoire mobile pour le moment."));
    } else if (clean.startsWith("souviens toi que ")) {
      addMemory(command.replace(/^souviens[- ]toi\s+que\s+/i, "").trim());
    } else if (clean === "parametres") {
      setResponse("Parametres mobiles", "Les preferences mobiles sont locales au navigateur.", ["Theme sombre cyan", "Stockage local", "Mode tactile"]);
    } else if (clean === "vide notes") {
      clearStore("notes", "Notes");
    } else if (clean === "vide taches") {
      clearStore("tasks", "Taches");
    } else if (clean === "vide rappels") {
      clearStore("reminders", "Rappels");
    } else {
      setResponse(
        "Commande mobile non reconnue",
        "Cette version mobile gere les commandes simples. Pour les actions avancees, utilisez la version desktop.",
        ["Tapez aide pour voir les commandes mobiles."]
      );
    }

    updateCounts();
  }

  function bindInteractions() {
    if (commandForm) {
      commandForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const command = commandInput ? commandInput.value : "";
        if (commandInput) commandInput.value = "";
        runCommand(command);
      });
    }

    document.querySelectorAll("[data-mobile-command]").forEach((button) => {
      button.addEventListener("click", () => {
        runCommand(button.dataset.mobileCommand || "");
      });
    });

    if (installButton) {
      installButton.addEventListener("click", promptInstall);
    }
  }

  async function registerServiceWorker() {
    if (!("serviceWorker" in navigator)) return;
    try {
      await navigator.serviceWorker.register("service-worker.js");
    } catch (error) {
      console.warn("JARVIS mobile service worker unavailable", error);
    }
  }

  function initInstallPrompt() {
    window.addEventListener("beforeinstallprompt", (event) => {
      event.preventDefault();
      deferredInstallPrompt = event;
      if (installPanel) installPanel.hidden = false;
      updatePwaState();
    });

    window.addEventListener("appinstalled", () => {
      deferredInstallPrompt = null;
      if (installPanel) installPanel.hidden = true;
      updatePwaState();
      setResponse("JARVIS installe", "La version mobile est maintenant disponible depuis votre ecran d'accueil.");
    });
  }

  function initPreferences() {
    const preferences = readJson(STORE.preferences, {});
    writeJson(STORE.preferences, {
      mode: "mobile",
      theme: preferences.theme || "cyan",
      lastOpenAt: new Date().toISOString()
    });
  }

  function init() {
    document.documentElement.classList.add("jarvis-mobile-ready");
    initPreferences();
    initInstallPrompt();
    bindInteractions();
    updateCounts();
    updatePwaState();
    registerServiceWorker();
    setStatus("Mode mobile");
  }

  document.addEventListener("DOMContentLoaded", init);
})();
