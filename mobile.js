(() => {
  const APP_VERSION = "4.6.0 mobile";
  const STORAGE_PREFIX = "jarvis-mobile:";
  const BRIDGE_TOKEN_KEY = `${STORAGE_PREFIX}bridge-token`;
  const DEVICE_ID_KEY = `${STORAGE_PREFIX}device-id`;
  const TRANSFER_TYPES = ["tasks", "notes", "reminders", "planning", "memories"];
  const DESKTOP_ONLY_COMMANDS = new Set([
    "ouvrir documents", "ouvre documents", "ouvrir bureau", "ouvre bureau",
    "ouvrir calculatrice", "ouvre calculatrice", "ouvrir navigateur", "ouvre navigateur",
    "infos systeme", "plein ecran", "fenetre", "minimise", "ferme jarvis"
  ]);
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
  const bridgeState = $("bridge-state");
  const bridgeDetail = $("bridge-detail");
  const bridgeCodeLabel = $("bridge-code-label");
  const bridgeCodeInput = $("bridge-code");
  const bridgePairButton = $("bridge-pair-button");
  const bridgeSyncButton = $("bridge-sync-button");
  const bridgeDisconnectButton = $("bridge-disconnect-button");
  const bridgeSummaryState = $("bridge-summary-state");
  const ollamaMobileState = $("ollama-mobile-state");
  const aiMobileState = $("ai-mobile-state");
  const storageState = $("storage-state");
  const localTransferPanel = $("local-transfer-panel");
  const localTransferCount = $("local-transfer-count");
  const localTransferDetail = $("local-transfer-detail");
  const localTransferButton = $("local-transfer-button");
  const localExportButton = $("local-export-button");
  const localLoadButton = $("local-load-button");
  const localLoadInput = $("local-load-input");

  let deferredInstallPrompt = null;
  let bridgeAvailable = false;
  let bridgeAuthenticated = false;
  let bridgeData = null;
  let bridgeSummary = null;
  let bridgeToken = "";
  let loadedTransfer = null;

  function normalize(value) {
    if (window.JarvisMobileCommands) {
      return window.JarvisMobileCommands.normalizeMobileCommand(value);
    }

    return String(value || "")
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[-_']/g, " ")
      .toLowerCase()
      .trim()
      .replace(/\s+/g, " ");
  }

  function escapeHtml(value) {
    return String(value || "")
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
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
      setResponse("Stockage indisponible", "Le navigateur refuse le stockage local pour le moment.");
      return false;
    }
  }

  function readBridgeToken() {
    try {
      return localStorage.getItem(BRIDGE_TOKEN_KEY) || "";
    } catch (_error) {
      return "";
    }
  }

  function saveBridgeToken(token) {
    bridgeToken = String(token || "");
    try {
      if (bridgeToken) localStorage.setItem(BRIDGE_TOKEN_KEY, bridgeToken);
      else localStorage.removeItem(BRIDGE_TOKEN_KEY);
    } catch (_error) {
      bridgeToken = "";
    }
  }

  function getMobileDeviceInfo() {
    const platform = String(
      (navigator.userAgentData && navigator.userAgentData.platform)
      || navigator.platform
      || "Navigateur mobile"
    ).slice(0, 80);
    return {
      name: `JARVIS mobile - ${platform}`,
      platform
    };
  }

  function getLocalItems(type) {
    const items = readJson(STORE[type], []);
    return Array.isArray(items) ? items : [];
  }

  function getItems(type) {
    if (bridgeAuthenticated) return bridgeData && Array.isArray(bridgeData[type]) ? bridgeData[type] : [];
    return getLocalItems(type);
  }

  function getLocalTransferItems() {
    return TRANSFER_TYPES.flatMap((type) => getLocalItems(type).map((item) => ({ type, item })));
  }

  function getSelectedTransfer() {
    return loadedTransfer || { deviceId: null, items: getLocalTransferItems() };
  }

  function getDeviceId() {
    try {
      const existing = localStorage.getItem(DEVICE_ID_KEY);
      if (existing && /^[a-zA-Z0-9_-]{1,80}$/.test(existing)) return existing;
      const generated = window.crypto && typeof window.crypto.randomUUID === "function"
        ? window.crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
      localStorage.setItem(DEVICE_ID_KEY, generated);
      return generated;
    } catch (_error) {
      throw new Error("Le stockage mobile est requis pour importer sans doublons.");
    }
  }

  function updateLocalTransferUi() {
    if (!localTransferPanel) return;
    const localCount = getLocalTransferItems().length;
    const count = getSelectedTransfer().items.length;
    localTransferPanel.hidden = !bridgeAuthenticated && localCount === 0;
    if (localTransferCount) localTransferCount.textContent = `${count} element${count > 1 ? "s" : ""}`;
    if (localTransferDetail) {
      localTransferDetail.textContent = loadedTransfer
        ? " dans l'export charge. Cet import reste volontaire."
        : " dans ce navigateur. La connexion au PC ne les transfere pas automatiquement.";
    }
    if (localExportButton) localExportButton.hidden = localCount === 0;
    if (localLoadButton) localLoadButton.hidden = !bridgeAuthenticated;
    if (localTransferButton) localTransferButton.hidden = !bridgeAuthenticated || count === 0;
  }

  function exportLocalData() {
    const items = getLocalTransferItems();
    if (!items.length) return setResponse("Aucune donnee", "Rien a exporter depuis ce navigateur.");
    try {
      const payload = { format: "jarvis-mobile-v1", deviceId: getDeviceId(), items };
      const url = URL.createObjectURL(new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" }));
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `jarvis-mobile-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
      setResponse("Export pret", `${items.length} element(s) mobiles dans le fichier JSON. Chargez-le sur la page Bridge du PC pour les copier.`);
    } catch (error) {
      setResponse("Export impossible", error.message || "Le navigateur ne permet pas cet export.");
    }
  }

  async function loadLocalExport(event) {
    const file = event && event.target && event.target.files && event.target.files[0];
    if (!file) return;
    try {
      if (file.size > 10 * 1024 * 1024) throw new Error("Fichier trop volumineux (maximum 10 Mo).");
      const payload = JSON.parse(await file.text());
      if (payload.format !== "jarvis-mobile-v1" || !/^[a-zA-Z0-9_-]{1,80}$/.test(payload.deviceId)) {
        throw new Error("Ce fichier n'est pas un export JARVIS mobile valide.");
      }
      if (!Array.isArray(payload.items) || payload.items.length > 5000 || payload.items.some((entry) => (
        !entry || !TRANSFER_TYPES.includes(entry.type) || !entry.item || typeof entry.item.id !== "string"
      ))) throw new Error("Liste d'elements mobiles invalide ou trop longue.");
      loadedTransfer = { deviceId: payload.deviceId, items: payload.items };
      updateLocalTransferUi();
      setResponse("Export charge", `${payload.items.length} element(s) prets. Appuyez sur Importer vers le PC pour confirmer la copie.`);
    } catch (error) {
      loadedTransfer = null;
      updateLocalTransferUi();
      setResponse("Export refuse", error.message || "Fichier illisible.");
    } finally {
      if (localLoadInput) localLoadInput.value = "";
    }
  }

  function saveLocalItems(type, items) {
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

  function formatList(items, emptyText) {
    if (!items.length) return [emptyText];
    return [...items]
      .sort((left, right) => String(right.createdAt || "").localeCompare(String(left.createdAt || "")))
      .slice(0, 8)
      .map((item) => {
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
      "reminders-count": `${reminders.filter((item) => !item.done).length} rappel${reminders.length > 1 ? "s" : ""}`,
      "planning-count": `${planning.length} entree${planning.length > 1 ? "s" : ""}`,
      "memory-count": `${memories.length} memoire${memories.length > 1 ? "s" : ""}`
    };

    Object.entries(counters).forEach(([id, text]) => {
      const element = $(id);
      if (element) element.textContent = text;
    });
  }

  function updateBridgeUi() {
    if (!bridgeState || !bridgeDetail) return;
    updateLocalTransferUi();

    if (!bridgeAvailable) {
      bridgeState.textContent = "Hors ligne";
      bridgeState.dataset.tone = "error";
      bridgeDetail.textContent = "Ouvrez sur ce telephone l'adresse donnee par la commande adresse bridge sur le PC.";
      if (bridgeCodeLabel) bridgeCodeLabel.hidden = true;
      if (bridgeCodeInput) {
        bridgeCodeInput.hidden = true;
        bridgeCodeInput.disabled = true;
      }
      if (bridgePairButton) bridgePairButton.hidden = true;
      if (bridgeSyncButton) bridgeSyncButton.hidden = true;
      if (bridgeDisconnectButton) bridgeDisconnectButton.hidden = true;
      if (bridgeSummaryState) bridgeSummaryState.textContent = "Hors ligne";
      if (ollamaMobileState) ollamaMobileState.textContent = "Desktop";
      if (aiMobileState) aiMobileState.textContent = "Bridge PC requis";
      if (storageState) storageState.textContent = "localStorage";
      return;
    }

    if (!bridgeAuthenticated) {
      bridgeState.textContent = "Association requise";
      bridgeState.dataset.tone = "pairing";
      bridgeDetail.textContent = "Saisissez le code temporaire affiche par JARVIS desktop.";
      if (bridgeCodeLabel) bridgeCodeLabel.hidden = false;
      if (bridgeCodeInput) {
        bridgeCodeInput.hidden = false;
        bridgeCodeInput.disabled = false;
      }
      if (bridgePairButton) bridgePairButton.hidden = false;
      if (bridgeSyncButton) bridgeSyncButton.hidden = true;
      if (bridgeDisconnectButton) bridgeDisconnectButton.hidden = true;
      if (bridgeSummaryState) bridgeSummaryState.textContent = "A associer";
      if (ollamaMobileState) ollamaMobileState.textContent = "En attente";
      if (aiMobileState) aiMobileState.textContent = "Association requise";
      if (storageState) storageState.textContent = "localStorage";
      return;
    }

    bridgeState.textContent = "Connecte";
    bridgeState.dataset.tone = "connected";
    bridgeDetail.textContent = "Donnees du PC affichees. Les donnees de ce telephone restent separees jusqu'a un import volontaire.";
    if (bridgeCodeLabel) bridgeCodeLabel.hidden = true;
    if (bridgeCodeInput) bridgeCodeInput.hidden = true;
    if (bridgePairButton) bridgePairButton.hidden = true;
    if (bridgeSyncButton) bridgeSyncButton.hidden = false;
    if (bridgeDisconnectButton) bridgeDisconnectButton.hidden = false;
    if (bridgeSummaryState) bridgeSummaryState.textContent = "Connecte";
    if (storageState) storageState.textContent = "PC local";

    const ollamaConnected = Boolean(bridgeSummary && bridgeSummary.ollama && bridgeSummary.ollama.ok);
    if (ollamaMobileState) ollamaMobileState.textContent = ollamaConnected ? "Connecte" : "Indisponible";
    if (aiMobileState) aiMobileState.textContent = ollamaConnected ? "Ollama via Bridge" : "Ollama indisponible";
  }

  async function bridgeRequest(pathname, options = {}) {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), options.timeoutMs || 8000);
    const headers = { Accept: "application/json" };
    const authenticate = options.authenticate !== false;

    if (options.body !== undefined) headers["Content-Type"] = "application/json";
    if (authenticate && bridgeToken) headers.Authorization = `Bearer ${bridgeToken}`;

    try {
      const response = await fetch(pathname, {
        method: options.method || "GET",
        headers,
        body: options.body === undefined ? undefined : JSON.stringify(options.body),
        cache: "no-store",
        signal: controller.signal
      });
      const text = await response.text();
      let payload = {};
      try {
        payload = text ? JSON.parse(text) : {};
      } catch (_error) {
        throw new Error("Reponse Bridge invalide.");
      }

      if (!response.ok || payload.ok === false) {
        if (response.status === 401 && authenticate) {
          bridgeAuthenticated = false;
          bridgeData = null;
          bridgeSummary = null;
          saveBridgeToken("");
          updateBridgeUi();
          updateCounts();
        }
        throw new Error(payload.message || `Erreur Bridge ${response.status}.`);
      }
      return payload;
    } finally {
      window.clearTimeout(timeout);
    }
  }

  async function detectBridge() {
    bridgeToken = readBridgeToken();
    try {
      const status = await bridgeRequest("/bridge/status", {
        authenticate: Boolean(bridgeToken),
        timeoutMs: 3500
      });
      if (!status.bridge) throw new Error("Bridge absent");
      bridgeAvailable = true;
      bridgeAuthenticated = Boolean(status.authenticated && bridgeToken);
      updateBridgeUi();
      if (bridgeAuthenticated) await syncBridgeData(false);
    } catch (_error) {
      bridgeAvailable = false;
      bridgeAuthenticated = false;
      bridgeData = null;
      bridgeSummary = null;
      updateBridgeUi();
      updateCounts();
    }
  }

  async function pairBridge() {
    const code = String(bridgeCodeInput ? bridgeCodeInput.value : "").trim();
    if (!/^\d{6}$/.test(code)) {
      setResponse("Code incomplet", "Saisissez les 6 chiffres affiches sur JARVIS desktop.");
      return;
    }

    setStatus("Association");
    if (bridgePairButton) bridgePairButton.disabled = true;
    try {
      const result = await bridgeRequest("/bridge/pair", {
        method: "POST",
        body: { code, device: getMobileDeviceInfo() },
        authenticate: false
      });
      saveBridgeToken(result.token);
      bridgeAuthenticated = true;
      if (bridgeCodeInput) bridgeCodeInput.value = "";
      await syncBridgeData(false);
      setResponse("Bridge connecte", "JARVIS mobile est maintenant relie a votre application desktop locale.");
    } catch (error) {
      setResponse("Association impossible", error.message || "Verifiez le code affiche sur le PC.");
    } finally {
      if (bridgePairButton) bridgePairButton.disabled = false;
      updateBridgeUi();
    }
  }

  async function syncBridgeData(showResponse = true) {
    if (!bridgeAvailable || !bridgeAuthenticated) {
      if (showResponse) setResponse("Bridge non connecte", "Associez d'abord ce telephone avec JARVIS desktop.");
      return false;
    }

    setStatus("Synchronisation");
    try {
      const [dataResult, summaryResult] = await Promise.all([
        bridgeRequest("/bridge/data"),
        bridgeRequest("/bridge/summary", { timeoutMs: 45000 })
      ]);
      bridgeData = dataResult.data || null;
      bridgeSummary = summaryResult.summary || null;
      updateCounts();
      updateBridgeUi();
      if (showResponse) {
        const counts = bridgeSummary && bridgeSummary.counts ? bridgeSummary.counts : {};
        setResponse("Synchronisation terminee", "Les donnees desktop sont a jour sur ce telephone.", [
          `${Number(counts.tasks) || 0} tache(s) en cours`,
          `${Number(counts.reminders) || 0} rappel(s) actif(s)`,
          `${Number(counts.notes) || 0} note(s)`,
          `${Number(counts.memories) || 0} memoire(s)`
        ]);
      }
      return true;
    } catch (error) {
      setResponse("Synchronisation impossible", error.message || "Le PC ne repond plus.");
      return false;
    }
  }

  async function importLocalData() {
    if (!bridgeAuthenticated) {
      setResponse("Bridge non connecte", "Associez d'abord ce telephone avec JARVIS desktop.");
      return false;
    }
    const transfer = getSelectedTransfer();
    const items = transfer.items;
    if (!items.length) {
      setResponse("Aucune donnee mobile", "Rien a importer depuis ce telephone.");
      return true;
    }

    if (localTransferButton) localTransferButton.disabled = true;
    let imported = 0;
    let duplicates = 0;
    try {
      const deviceId = transfer.deviceId || getDeviceId();
      for (const { type, item } of items) {
        if (!item || typeof item.id !== "string" || !/^[a-zA-Z0-9_-]{1,70}$/.test(item.id)) {
          throw new Error("Un element mobile n'a pas d'identifiant valide. Aucune suppression n'a eu lieu.");
        }
        setStatus(`Import ${imported + duplicates + 1}/${items.length}`);
        const result = await bridgeRequest("/bridge/import-item", {
          method: "POST",
          body: { type, item, sourceId: `${deviceId}:${type}:${item.id}` }
        });
        if (result.imported) imported += 1;
        else duplicates += 1;
      }
      await syncBridgeData(false);
      setResponse("Import termine", `${imported} element(s) copies vers le PC, ${duplicates} deja presents. Les originaux restent sur ce telephone.`);
      loadedTransfer = null;
      return true;
    } catch (error) {
      await syncBridgeData(false);
      setResponse("Import interrompu", `${imported} element(s) copies. ${error.message || "Connexion interrompue."} Relancez l'import pour reprendre sans doublons.`);
      return false;
    } finally {
      if (localTransferButton) localTransferButton.disabled = false;
      updateLocalTransferUi();
    }
  }

  function disconnectBridge() {
    bridgeAuthenticated = false;
    bridgeData = null;
    bridgeSummary = null;
    saveBridgeToken("");
    updateBridgeUi();
    updateCounts();
    setResponse("Bridge deconnecte", "Les donnees mobiles locales sont de nouveau utilisees.");
  }

  async function writeBridge(pathname, body) {
    const result = await bridgeRequest(pathname, { method: "POST", body });
    await syncBridgeData(false);
    return result;
  }

  async function askBridgeAi(message) {
    if (!bridgeAuthenticated) {
      setResponse("IA desktop non connectee", "Ouvrez l'adresse Bridge affichee sur le PC puis associez ce telephone.");
      return;
    }

    setStatus("IA en reflexion");
    try {
      const result = await bridgeRequest("/bridge/ai", {
        method: "POST",
        body: { message },
        timeoutMs: 120000
      });
      setResponse("Reponse JARVIS", result.response || "Aucune reponse recue.");
    } catch (error) {
      setResponse("IA indisponible", error.message || "Ollama ne repond pas sur le PC.");
    }
  }

  async function addTask(text) {
    if (!text) return setResponse("Tache vide", "Precisez le contenu de la tache.");
    if (bridgeAuthenticated) {
      try {
        await writeBridge("/bridge/tasks", { title: text, options: { priority: "normal" } });
        setResponse("Tache ajoutee", "Tache enregistree sur JARVIS desktop.", [text]);
      } catch (error) {
        setResponse("Ajout impossible", error.message);
      }
      return;
    }
    const tasks = getLocalItems("tasks");
    tasks.unshift(createItem(text, { status: "todo" }));
    saveLocalItems("tasks", tasks);
    updateCounts();
    setResponse("Tache ajoutee", "Tache enregistree dans le stockage mobile.", [text]);
  }

  async function completeTask(query) {
    const normalizedQuery = normalize(query);
    const tasks = getItems("tasks");
    const task = tasks.find((item) => normalize(item.content || item.title).includes(normalizedQuery) && item.status !== "completed");
    if (!task) return setResponse("Tache introuvable", "Aucune tache ne correspond a votre recherche.");

    if (bridgeAuthenticated) {
      try {
        await writeBridge("/bridge/tasks/complete", { id: task.id });
        setResponse("Tache terminee", "La tache desktop est maintenant terminee.", [task.title]);
      } catch (error) {
        setResponse("Action impossible", error.message);
      }
      return;
    }

    task.status = "completed";
    task.completedAt = new Date().toISOString();
    saveLocalItems("tasks", tasks);
    updateCounts();
    setResponse("Tache terminee", "La tache mobile est maintenant terminee.", [task.content || task.title]);
  }

  async function addNote(text) {
    if (!text) return setResponse("Note vide", "Precisez le contenu de la note.");
    if (bridgeAuthenticated) {
      try {
        await writeBridge("/bridge/notes", { content: text });
        setResponse("Note enregistree", "Note ajoutee sur JARVIS desktop.", [text]);
      } catch (error) {
        setResponse("Ajout impossible", error.message);
      }
      return;
    }
    const notes = getLocalItems("notes");
    notes.unshift(createItem(text));
    saveLocalItems("notes", notes);
    updateCounts();
    setResponse("Note enregistree", "Note ajoutee au stockage mobile.", [text]);
  }

  async function addReminder(text) {
    if (!text) return setResponse("Rappel vide", "Precisez le contenu du rappel.");
    if (bridgeAuthenticated) {
      try {
        await writeBridge("/bridge/reminders", { title: text, remindAt: null });
        setResponse("Rappel ajoute", "Rappel enregistre sur JARVIS desktop.", [text]);
      } catch (error) {
        setResponse("Ajout impossible", error.message);
      }
      return;
    }
    const reminders = getLocalItems("reminders");
    reminders.unshift(createItem(text, { done: false }));
    saveLocalItems("reminders", reminders);
    updateCounts();
    setResponse("Rappel ajoute", "Rappel simple enregistre sur ce telephone.", [text]);
  }

  async function addPlanning(text) {
    if (!text) return setResponse("Planning vide", "Precisez l'element de planning.");
    if (bridgeAuthenticated) {
      const date = new Date().toISOString().slice(0, 10);
      try {
        await writeBridge("/bridge/planning", { item: { title: text, date, time: null, type: "other" } });
        setResponse("Planning mis a jour", "Element ajoute sur JARVIS desktop.", [text]);
      } catch (error) {
        setResponse("Ajout impossible", error.message);
      }
      return;
    }
    const planning = getLocalItems("planning");
    planning.unshift(createItem(text));
    saveLocalItems("planning", planning);
    updateCounts();
    setResponse("Planning mis a jour", "Element ajoute au planning mobile.", [text]);
  }

  async function addMemory(text) {
    if (!text) return setResponse("Memoire vide", "Precisez l'information a memoriser.");
    if (bridgeAuthenticated) {
      try {
        await writeBridge("/bridge/memories", { content: text, category: "general" });
        setResponse("Memoire ajoutee", "Information enregistree sur JARVIS desktop.", [text]);
      } catch (error) {
        setResponse("Ajout impossible", error.message);
      }
      return;
    }
    const memories = getLocalItems("memories");
    memories.unshift(createItem(text));
    saveLocalItems("memories", memories);
    updateCounts();
    setResponse("Memoire mobile ajoutee", "Information enregistree dans ce navigateur.", [text]);
  }

  function clearStore(type, label) {
    if (bridgeAuthenticated) {
      setResponse("Action reservee au desktop", `Pour proteger vos donnees, videz ${label.toLowerCase()} depuis JARVIS desktop.`);
      return;
    }
    saveLocalItems(type, []);
    updateCounts();
    setResponse(`${label} vide`, `Les donnees ${label.toLowerCase()} mobiles ont ete supprimees.`);
  }

  function showHelp() {
    setResponse("Aide mobile", "JARVIS fonctionne seul ou connecte au desktop avec le Bridge V4.6.", [
      "bridge statut",
      "ajoute tache finir Jarvis",
      "termine tache Jarvis",
      "note idee de contenu",
      "rappelle-moi verifier le build",
      "importe donnees mobiles (avec le Bridge)",
      "Posez une question naturelle a Ollama une fois le Bridge connecte"
    ]);
  }

  function showBridgeStatus() {
    if (!bridgeAvailable) {
      setResponse("Bridge hors ligne", "Ouvrez l'adresse donnee par la commande adresse bridge sur JARVIS desktop.");
      return;
    }
    if (!bridgeAuthenticated) {
      setResponse("Association requise", "Saisissez le code affiche sur le PC pour acceder aux donnees desktop et a Ollama.");
      return;
    }
    const counts = bridgeSummary && bridgeSummary.counts ? bridgeSummary.counts : {};
    setResponse("Bridge connecte", "Le telephone communique avec JARVIS desktop sur le reseau local.", [
      `${Number(counts.tasks) || 0} tache(s) en cours`,
      `${Number(counts.reminders) || 0} rappel(s) actif(s)`,
      bridgeSummary && bridgeSummary.ollama && bridgeSummary.ollama.ok ? "Ollama connecte" : "Ollama indisponible"
    ]);
  }

  function showMobileFeatures() {
    setResponse("Fonctionnalites mobile", "Mode autonome avec stockage navigateur, ou mode Bridge avec donnees desktop et Ollama local.", [
      "Aucune API externe requise.",
      "Les commandes Windows restent bloquees a distance.",
      "L'association expire automatiquement."
    ]);
  }

  function showDesktopFeatures() {
    setResponse("Fonctionnalites desktop", "Electron garde Ollama, les fichiers locaux, les commandes systeme, la memoire fichier et les automatisations avancees.");
  }

  function isStandalonePwa() {
    return window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;
  }

  function updatePwaState() {
    if (pwaState) pwaState.textContent = isStandalonePwa() ? "Installee" : "Navigateur";
  }

  async function promptInstall() {
    if (!deferredInstallPrompt) {
      setResponse("Installation mobile", "Utilisez le menu du navigateur puis Ajouter a l'ecran d'accueil si le bouton natif n'apparait pas.");
      return;
    }
    deferredInstallPrompt.prompt();
    const choice = await deferredInstallPrompt.userChoice.catch(() => null);
    deferredInstallPrompt = null;
    if (installPanel) installPanel.hidden = true;
    setResponse(
      choice && choice.outcome === "accepted" ? "Installation lancee" : "Installation annulee",
      choice && choice.outcome === "accepted" ? "JARVIS va etre ajoute a votre ecran d'accueil." : "Vous pourrez relancer l'installation plus tard."
    );
  }

  async function runCommand(rawCommand) {
    const command = String(rawCommand || "").trim();
    const clean = normalize(command);
    if (!clean) return setResponse("Commande vide", "Entrez une commande ou choisissez une carte mobile.");
    setStatus("Analyse");

    const desktopOnly = window.JarvisMobileCommands
      ? window.JarvisMobileCommands.isDesktopOnlyMobileCommand(clean)
      : DESKTOP_ONLY_COMMANDS.has(clean);

    if (desktopOnly) {
      setResponse("Version desktop requise", "Cette fonctionnalite est disponible uniquement sur la version desktop.");
    } else if (clean === "aide") {
      showHelp();
    } else if (clean === "bridge statut" || clean === "statut bridge") {
      showBridgeStatus();
    } else if (clean === "synchronise" || clean === "synchroniser") {
      await syncBridgeData(true);
    } else if (clean === "importe donnees mobiles" || clean === "importer donnees mobiles") {
      await importLocalData();
    } else if (clean === "version mobile" || clean === "mode mobile") {
      setResponse("JARVIS mobile", `Version ${APP_VERSION}. ${bridgeAuthenticated ? "Bridge desktop connecte." : "Mode autonome actif."}`);
    } else if (clean === "fonctionnalites mobile") {
      showMobileFeatures();
    } else if (clean === "fonctionnalites desktop") {
      showDesktopFeatures();
    } else if (clean === "installer jarvis") {
      await promptInstall();
    } else if (clean === "ia" || clean === "statut ia" || clean === "ollama statut") {
      if (bridgeAuthenticated) showBridgeStatus();
      else setResponse("IA desktop non connectee", "Associez ce telephone au Bridge pour utiliser Ollama local.");
    } else if (clean === "test ia") {
      await askBridgeAi("Confirme en une phrase courte que JARVIS mobile communique avec Ollama.");
    } else if (clean === "taches" || clean === "mes taches" || clean === "tache") {
      setResponse("Taches", bridgeAuthenticated ? "Donnees JARVIS desktop." : "Donnees de ce navigateur.", formatList(getItems("tasks"), "Aucune tache pour le moment."));
    } else if (clean.startsWith("ajoute tache ")) {
      await addTask(command.split(/\s+/).slice(2).join(" "));
    } else if (clean.startsWith("termine tache ")) {
      await completeTask(command.split(/\s+/).slice(2).join(" "));
    } else if (clean === "notes" || clean === "affiche notes") {
      setResponse("Notes", bridgeAuthenticated ? "Donnees JARVIS desktop." : "Donnees de ce navigateur.", formatList(getItems("notes"), "Aucune note pour le moment."));
    } else if (clean.startsWith("note ")) {
      await addNote(command.split(/\s+/).slice(1).join(" "));
    } else if (clean === "rappels" || clean === "mes rappels") {
      setResponse("Rappels", bridgeAuthenticated ? "Donnees JARVIS desktop." : "Donnees de ce navigateur.", formatList(getItems("reminders"), "Aucun rappel pour le moment."));
    } else if (clean.startsWith("rappelle moi ")) {
      const words = command.replace(/-/g, " ").split(/\s+/);
      await addReminder(words.slice(2).join(" ").replace(/^de\s+/i, ""));
    } else if (clean === "planning") {
      setResponse("Planning", bridgeAuthenticated ? "Donnees JARVIS desktop." : "Donnees de ce navigateur.", formatList(getItems("planning"), "Aucun planning pour le moment."));
    } else if (clean.startsWith("ajoute planning ")) {
      await addPlanning(command.split(/\s+/).slice(2).join(" "));
    } else if (clean === "memoire" || clean === "affiche memoire") {
      setResponse("Memoire", bridgeAuthenticated ? "Donnees JARVIS desktop." : "Donnees de ce navigateur.", formatList(getItems("memories"), "Aucune memoire pour le moment."));
    } else if (clean.startsWith("souviens toi que ")) {
      const words = command.replace(/-/g, " ").split(/\s+/);
      await addMemory(words.slice(3).join(" "));
    } else if (clean === "parametres") {
      setResponse("Parametres mobiles", "Mode sombre cyan, stockage local et association Bridge securisee.");
    } else if (clean === "vide notes") {
      clearStore("notes", "Notes");
    } else if (clean === "vide taches") {
      clearStore("tasks", "Taches");
    } else if (clean === "vide rappels") {
      clearStore("reminders", "Rappels");
    } else if (bridgeAuthenticated) {
      await askBridgeAi(command);
    } else {
      setResponse("Commande mobile non reconnue", "Connectez le Bridge pour envoyer les questions naturelles a Ollama, ou tapez aide.");
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
      button.addEventListener("click", () => runCommand(button.dataset.mobileCommand || ""));
    });
    if (installButton) installButton.addEventListener("click", promptInstall);
    if (bridgePairButton) bridgePairButton.addEventListener("click", pairBridge);
    if (bridgeSyncButton) bridgeSyncButton.addEventListener("click", () => syncBridgeData(true));
    if (bridgeDisconnectButton) bridgeDisconnectButton.addEventListener("click", disconnectBridge);
    if (localTransferButton) localTransferButton.addEventListener("click", importLocalData);
    if (localExportButton) localExportButton.addEventListener("click", exportLocalData);
    if (localLoadButton && localLoadInput) localLoadButton.addEventListener("click", () => localLoadInput.click());
    if (localLoadInput) localLoadInput.addEventListener("change", loadLocalExport);
    if (bridgeCodeInput) {
      bridgeCodeInput.addEventListener("input", () => {
        bridgeCodeInput.value = bridgeCodeInput.value.replace(/\D/g, "").slice(0, 6);
      });
      bridgeCodeInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter") pairBridge();
      });
    }
  }

  async function registerServiceWorker() {
    const isSecureWeb = location.protocol === "https:" || location.hostname === "localhost";
    if (!isSecureWeb || !("serviceWorker" in navigator)) return;
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
      setResponse("JARVIS installe", "La version mobile est disponible depuis votre ecran d'accueil.");
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

  async function init() {
    document.documentElement.classList.add("jarvis-mobile-ready");
    initPreferences();
    initInstallPrompt();
    bindInteractions();
    updateCounts();
    updatePwaState();
    updateBridgeUi();
    registerServiceWorker();
    setStatus("Mode mobile");
    await detectBridge();
  }

  document.addEventListener("DOMContentLoaded", init);
})();
