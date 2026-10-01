const crypto = require("node:crypto");
const fs = require("node:fs/promises");
const http = require("node:http");
const os = require("node:os");
const path = require("node:path");

const DEFAULT_PORT = 3210;
const MAX_BODY_BYTES = 16 * 1024;
const SESSION_DURATION_MS = 12 * 60 * 60 * 1000;
const PAIRING_WINDOW_MS = 60 * 1000;
const MAX_PAIRING_ATTEMPTS = 5;

const PUBLIC_FILES = new Map([
  ["/", "mobile.html"],
  ["/mobile.html", "mobile.html"],
  ["/mobile.css", "mobile.css"],
  ["/mobile.js", "mobile.js"],
  ["/mobile-command-routing.js", "mobile-command-routing.js"],
  ["/manifest.json", "manifest.json"],
  ["/service-worker.js", "service-worker.js"],
  ["/assets/icons/icon-192.png", path.join("assets", "icons", "icon-192.png")],
  ["/assets/icons/icon-512.png", path.join("assets", "icons", "icon-512.png")]
]);

const MIME_TYPES = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png"
};

function sanitizeText(value, maxLength = 1200) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function getLocalAddresses(port) {
  const addresses = [];
  const interfaces = os.networkInterfaces();

  Object.values(interfaces).forEach((entries) => {
    (entries || []).forEach((entry) => {
      const isIpv4 = entry.family === "IPv4" || entry.family === 4;
      if (isIpv4 && !entry.internal && entry.address) {
        addresses.push(`http://${entry.address}:${port}/mobile.html`);
      }
    });
  });

  return [...new Set(addresses)];
}

function createPairingCode() {
  const forcedCode = sanitizeText(process.env.JARVIS_BRIDGE_PAIR_CODE, 6);
  if (/^\d{6}$/.test(forcedCode)) return forcedCode;
  return String(crypto.randomInt(0, 1000000)).padStart(6, "0");
}

function hashToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

function safeEqual(left, right) {
  const leftBuffer = Buffer.from(String(left || ""));
  const rightBuffer = Buffer.from(String(right || ""));
  return leftBuffer.length === rightBuffer.length && crypto.timingSafeEqual(leftBuffer, rightBuffer);
}

function trimArray(items, maxItems, mapper) {
  return Array.isArray(items) ? items.slice(0, maxItems).map(mapper) : [];
}

function sanitizeBridgeData(data = {}) {
  return {
    tasks: trimArray(data.tasks, 50, (item) => ({
      id: sanitizeText(item.id, 120),
      title: sanitizeText(item.title),
      status: item.status === "completed" ? "completed" : "todo",
      priority: sanitizeText(item.priority, 20) || "normal",
      dueAt: typeof item.dueAt === "string" ? item.dueAt : null,
      createdAt: sanitizeText(item.createdAt, 80),
      completedAt: typeof item.completedAt === "string" ? item.completedAt : null
    })),
    notes: trimArray(data.notes, 50, (item) => ({
      id: sanitizeText(item.id, 120),
      content: sanitizeText(item.content),
      createdAt: sanitizeText(item.createdAt, 80)
    })),
    reminders: trimArray(data.reminders, 50, (item) => ({
      id: sanitizeText(item.id, 120),
      title: sanitizeText(item.title),
      remindAt: typeof item.remindAt === "string" ? item.remindAt : null,
      done: Boolean(item.done),
      createdAt: sanitizeText(item.createdAt, 80)
    })),
    planning: trimArray(data.planning, 50, (item) => ({
      id: sanitizeText(item.id, 120),
      title: sanitizeText(item.title),
      date: sanitizeText(item.date, 20),
      time: typeof item.time === "string" ? item.time : null,
      type: sanitizeText(item.type, 30) || "other",
      createdAt: sanitizeText(item.createdAt, 80)
    })),
    memories: trimArray(data.memories, 20, (item) => ({
      id: sanitizeText(item.id, 120),
      content: sanitizeText(item.content),
      category: sanitizeText(item.category, 80) || "general",
      createdAt: sanitizeText(item.createdAt, 80)
    }))
  };
}

function createJarvisBridge(options = {}) {
  const rootDir = path.resolve(options.rootDir || __dirname);
  const requestedPort = Number(options.port ?? process.env.JARVIS_BRIDGE_PORT ?? DEFAULT_PORT);
  let port = Number.isInteger(requestedPort) && requestedPort >= 0 && requestedPort < 65536
    ? requestedPort
    : DEFAULT_PORT;
  const host = options.host || "0.0.0.0";
  const version = sanitizeText(options.version, 40) || "4.6.0";
  const model = sanitizeText(options.model, 120) || "llama3.2:3b";
  const sessions = new Map();
  const pairingAttempts = new Map();
  let pairingCode = createPairingCode();
  let server = null;
  let running = false;
  let lastError = "";

  function setCommonHeaders(response) {
    response.setHeader("X-Content-Type-Options", "nosniff");
    response.setHeader("Referrer-Policy", "no-referrer");
    response.setHeader("X-Frame-Options", "DENY");
    response.setHeader(
      "Content-Security-Policy",
      "default-src 'self'; connect-src 'self'; img-src 'self' data:; style-src 'self'; script-src 'self'; manifest-src 'self'"
    );
  }

  function sendJson(response, statusCode, payload) {
    setCommonHeaders(response);
    response.writeHead(statusCode, {
      "Cache-Control": "no-store",
      "Content-Type": "application/json; charset=utf-8"
    });
    response.end(JSON.stringify(payload));
  }

  function sendText(response, statusCode, message) {
    setCommonHeaders(response);
    response.writeHead(statusCode, {
      "Cache-Control": "no-store",
      "Content-Type": "text/plain; charset=utf-8"
    });
    response.end(message);
  }

  function requestHasValidOrigin(request) {
    const origin = request.headers.origin;
    if (!origin) return true;

    try {
      const parsedOrigin = new URL(origin);
      return parsedOrigin.host === request.headers.host && ["http:", "https:"].includes(parsedOrigin.protocol);
    } catch (_error) {
      return false;
    }
  }

  async function readJsonBody(request) {
    return new Promise((resolve, reject) => {
      const chunks = [];
      let totalBytes = 0;

      request.on("data", (chunk) => {
        totalBytes += chunk.length;
        if (totalBytes > MAX_BODY_BYTES) {
          reject(Object.assign(new Error("Corps de requete trop volumineux."), { statusCode: 413 }));
          request.destroy();
          return;
        }
        chunks.push(chunk);
      });

      request.on("end", () => {
        if (!chunks.length) {
          resolve({});
          return;
        }

        try {
          resolve(JSON.parse(Buffer.concat(chunks).toString("utf8")));
        } catch (_error) {
          reject(Object.assign(new Error("JSON invalide."), { statusCode: 400 }));
        }
      });

      request.on("error", reject);
    });
  }

  function getClientId(request) {
    return request.socket.remoteAddress || "unknown";
  }

  function isPairingRateLimited(request) {
    const now = Date.now();
    const clientId = getClientId(request);
    const state = pairingAttempts.get(clientId);

    if (!state || now >= state.resetAt) {
      pairingAttempts.set(clientId, { count: 1, resetAt: now + PAIRING_WINDOW_MS });
      return false;
    }

    state.count += 1;
    return state.count > MAX_PAIRING_ATTEMPTS;
  }

  function createSession(device = {}) {
    const token = crypto.randomBytes(32).toString("base64url");
    const now = Date.now();
    const expiresAt = Date.now() + SESSION_DURATION_MS;
    sessions.set(hashToken(token), {
      id: crypto.randomUUID(),
      name: sanitizeText(device.name, 80) || "Appareil mobile",
      platform: sanitizeText(device.platform, 80) || "Navigateur mobile",
      createdAt: now,
      lastSeenAt: now,
      expiresAt
    });
    return { token, expiresAt: new Date(expiresAt).toISOString() };
  }

  function pruneSessions() {
    const now = Date.now();
    sessions.forEach((device, tokenHash) => {
      if (device.expiresAt <= now) sessions.delete(tokenHash);
    });
  }

  function getBearerToken(request) {
    const authorization = String(request.headers.authorization || "");
    return authorization.startsWith("Bearer ") ? authorization.slice(7).trim() : "";
  }

  function getAuthorizedSession(request, touch = true) {
    pruneSessions();
    const token = getBearerToken(request);
    if (!token) return null;
    const device = sessions.get(hashToken(token));
    if (!device || device.expiresAt <= Date.now()) return null;
    if (touch) device.lastSeenAt = Date.now();
    return device;
  }

  function listDevices() {
    pruneSessions();
    return [...sessions.values()]
      .sort((left, right) => right.lastSeenAt - left.lastSeenAt)
      .map((device) => ({
        id: device.id,
        name: device.name,
        platform: device.platform,
        createdAt: new Date(device.createdAt).toISOString(),
        lastSeenAt: new Date(device.lastSeenAt).toISOString(),
        expiresAt: new Date(device.expiresAt).toISOString()
      }));
  }

  function revokeDevice(deviceId) {
    const safeDeviceId = sanitizeText(deviceId, 120);
    let revoked = false;
    sessions.forEach((device, tokenHash) => {
      if (device.id === safeDeviceId) {
        sessions.delete(tokenHash);
        revoked = true;
      }
    });
    return { ok: revoked, revoked, devices: listDevices() };
  }

  async function servePublicFile(request, response, pathname) {
    const relativeFile = PUBLIC_FILES.get(pathname);
    if (!relativeFile) return false;

    const absoluteFile = path.resolve(rootDir, relativeFile);
    if (!absoluteFile.startsWith(`${rootDir}${path.sep}`) && absoluteFile !== rootDir) {
      sendText(response, 403, "Acces refuse.");
      return true;
    }

    try {
      const file = await fs.readFile(absoluteFile);
      setCommonHeaders(response);
      response.writeHead(200, {
        "Cache-Control": pathname === "/service-worker.js" ? "no-cache" : "no-cache, must-revalidate",
        "Content-Length": file.length,
        "Content-Type": MIME_TYPES[path.extname(absoluteFile).toLowerCase()] || "application/octet-stream"
      });
      if (request.method === "HEAD") response.end();
      else response.end(file);
    } catch (error) {
      if (error.code === "ENOENT") sendText(response, 404, "Fichier introuvable.");
      else throw error;
    }

    return true;
  }

  async function getBridgeSummary() {
    const data = sanitizeBridgeData(await options.readData());
    const ollama = typeof options.getOllamaStatus === "function"
      ? await options.getOllamaStatus()
      : { ok: false, message: "Statut Ollama indisponible." };

    return {
      counts: {
        tasks: data.tasks.filter((item) => item.status !== "completed").length,
        notes: data.notes.length,
        reminders: data.reminders.filter((item) => !item.done).length,
        planning: data.planning.length,
        memories: data.memories.length
      },
      ollama: {
        ok: Boolean(ollama && ollama.ok),
        model: sanitizeText(ollama && ollama.model, 120) || model,
        message: sanitizeText(ollama && ollama.message, 300)
      },
      latest: {
        task: data.tasks[0] || null,
        note: data.notes[0] || null,
        reminder: data.reminders[0] || null,
        planning: data.planning[0] || null,
        memory: data.memories[0] || null
      }
    };
  }

  async function handleApiRequest(request, response, pathname) {
    if (!requestHasValidOrigin(request)) {
      sendJson(response, 403, { ok: false, message: "Origine non autorisee." });
      return true;
    }

    if (pathname === "/bridge/status" && request.method === "GET") {
      sendJson(response, 200, {
        ok: true,
        bridge: true,
        version,
        model,
        hostname: os.hostname(),
        authenticated: Boolean(getAuthorizedSession(request)),
        requiresPairing: true
      });
      return true;
    }

    if (pathname === "/bridge/pair" && request.method === "POST") {
      if (isPairingRateLimited(request)) {
        sendJson(response, 429, { ok: false, message: "Trop de tentatives. Reessayez dans une minute." });
        return true;
      }

      const body = await readJsonBody(request);
      if (!safeEqual(sanitizeText(body.code, 6), pairingCode)) {
        sendJson(response, 401, { ok: false, message: "Code d'association invalide." });
        return true;
      }

      pairingAttempts.delete(getClientId(request));
      const session = createSession(body.device || {});
      pairingCode = createPairingCode();
      sendJson(response, 200, { ok: true, ...session });
      return true;
    }

    if (!pathname.startsWith("/bridge/")) return false;

    if (!getAuthorizedSession(request)) {
      sendJson(response, 401, { ok: false, message: "Association requise ou expiree." });
      return true;
    }

    if (pathname === "/bridge/data" && request.method === "GET") {
      sendJson(response, 200, { ok: true, data: sanitizeBridgeData(await options.readData()) });
      return true;
    }

    if (pathname === "/bridge/summary" && request.method === "GET") {
      sendJson(response, 200, { ok: true, summary: await getBridgeSummary() });
      return true;
    }

    const body = request.method === "POST" ? await readJsonBody(request) : {};

    if (pathname === "/bridge/import-item" && request.method === "POST") {
      if (typeof options.importMobileItem !== "function") {
        sendJson(response, 503, { ok: false, message: "Import mobile indisponible." });
        return true;
      }
      const result = await options.importMobileItem(body);
      sendJson(response, result && result.ok === false ? 400 : 200, result || { ok: false });
      return true;
    }

    if (pathname === "/bridge/ai" && request.method === "POST") {
      const message = sanitizeText(body.message, 4000);
      if (!message) {
        sendJson(response, 400, { ok: false, message: "Demande IA vide." });
        return true;
      }
      const answer = await options.askAi(message);
      sendJson(response, 200, { ok: true, response: sanitizeText(answer, 12000) });
      return true;
    }

    const writeRoutes = new Map([
      ["/bridge/tasks", () => options.addTask(sanitizeText(body.title), body.options || {})],
      ["/bridge/tasks/complete", () => options.completeTask(sanitizeText(body.id, 120))],
      ["/bridge/notes", () => options.addNote(sanitizeText(body.content))],
      ["/bridge/reminders", () => options.addReminder(sanitizeText(body.title), body.remindAt || null)],
      ["/bridge/planning", () => options.addPlanningItem(body.item || {})],
      ["/bridge/memories", () => options.addMemory(sanitizeText(body.content), sanitizeText(body.category, 80) || "general")]
    ]);

    if (request.method === "POST" && writeRoutes.has(pathname)) {
      const result = await writeRoutes.get(pathname)();
      sendJson(response, result && result.ok === false ? 400 : 200, result || { ok: true });
      return true;
    }

    sendJson(response, 404, { ok: false, message: "Route Bridge introuvable." });
    return true;
  }

  async function handleRequest(request, response) {
    try {
      const requestUrl = new URL(request.url || "/", `http://${request.headers.host || "localhost"}`);
      const pathname = decodeURIComponent(requestUrl.pathname);

      if (request.method !== "GET" && request.method !== "HEAD" && request.method !== "POST") {
        sendJson(response, 405, { ok: false, message: "Methode non autorisee." });
        return;
      }

      if (await handleApiRequest(request, response, pathname)) return;
      if ((request.method === "GET" || request.method === "HEAD") && await servePublicFile(request, response, pathname)) return;
      sendText(response, 404, "Ressource introuvable.");
    } catch (error) {
      const statusCode = Number(error.statusCode) || 500;
      if (statusCode >= 500) console.error("[JARVIS Bridge] Erreur requete:", error);
      if (!response.headersSent) {
        sendJson(response, statusCode, {
          ok: false,
          message: statusCode >= 500 ? "Erreur interne du Bridge JARVIS." : error.message
        });
      } else {
        response.end();
      }
    }
  }

  async function start() {
    if (running) return getStatus();

    server = http.createServer((request, response) => {
      handleRequest(request, response);
    });

    await new Promise((resolve, reject) => {
      const onError = (error) => {
        lastError = error && error.message ? error.message : "Erreur serveur inconnue.";
        reject(error);
      };
      server.once("error", onError);
      server.listen(port, host, () => {
        server.off("error", onError);
        const address = server.address();
        if (address && typeof address === "object") port = address.port;
        running = true;
        lastError = "";
        server.on("error", (error) => {
          lastError = error && error.message ? error.message : "Erreur serveur inconnue.";
          console.error("[JARVIS Bridge] Erreur serveur:", error);
        });
        resolve();
      });
    });

    console.log(`[JARVIS Bridge] Actif sur le port ${port}.`);
    getLocalAddresses(port).forEach((address) => console.log(`[JARVIS Bridge] Mobile : ${address}`));
    return getStatus();
  }

  async function stop() {
    if (!server) return;
    await new Promise((resolve) => server.close(resolve));
    server = null;
    running = false;
    sessions.clear();
  }

  function rotatePairingCode() {
    pairingCode = createPairingCode();
    return getStatus();
  }

  function getStatus() {
    pruneSessions();
    return {
      ok: running,
      running,
      port,
      model,
      version,
      pairingCode,
      addresses: getLocalAddresses(port),
      connectedDevices: sessions.size,
      devices: listDevices(),
      lastError
    };
  }

  return {
    getStatus,
    listDevices,
    revokeDevice,
    rotatePairingCode,
    start,
    stop
  };
}

module.exports = {
  createJarvisBridge,
  sanitizeBridgeData
};
