const { app, BrowserWindow, ipcMain, shell, session } = require("electron");
const { spawn } = require("node:child_process");
const os = require("node:os");
const path = require("node:path");
const dotenv = require("dotenv");
const OpenAI = require("openai");
const OpenAIClient = OpenAI.default || OpenAI;

dotenv.config({ path: path.join(process.cwd(), ".env") });
dotenv.config({ path: path.join(__dirname, ".env") });

const APP_TITLE = "JARVIS Assistant";
const OPENAI_MODEL = "gpt-5.5";
const MISSING_API_KEY_MESSAGE = "Cl\u00e9 API absente. Configurez OPENAI_API_KEY dans le fichier .env.";
const JARVIS_SYSTEM_PROMPT = [
  "Tu es JARVIS, un assistant personnel de bureau en fran\u00e7ais.",
  "Tu r\u00e9ponds de mani\u00e8re claire, concise, professionnelle et l\u00e9g\u00e8rement futuriste.",
  "Tu appelles l'utilisateur \"monsieur\" de temps en temps, sans en abuser.",
  "Tu peux aider \u00e0 organiser le travail, expliquer, r\u00e9sumer, cr\u00e9er des id\u00e9es, accompagner les routines.",
  "Tu ne pr\u00e9tends pas contr\u00f4ler le monde r\u00e9el sans commande desktop explicite."
].join(" ");
const OPENABLE_FOLDERS = {
  documents: "documents",
  desktop: "desktop"
};
const openai = process.env.OPENAI_API_KEY ? new OpenAIClient({ apiKey: process.env.OPENAI_API_KEY }) : null;

function configurePermissions() {
  // Autorise uniquement les permissions media utiles au micro.
  session.defaultSession.setPermissionRequestHandler((_webContents, permission, callback) => {
    callback(permission === "media");
  });

  session.defaultSession.setPermissionCheckHandler((_webContents, permission) => {
    return permission === "media";
  });
}

function isSafeExternalUrl(url) {
  // Les liens externes partent dans le navigateur Windows, jamais dans JARVIS.
  try {
    const parsedUrl = new URL(url);
    return parsedUrl.protocol === "https:" || parsedUrl.protocol === "http:";
  } catch (_error) {
    return false;
  }
}

function getWindowFromEvent(event) {
  return BrowserWindow.fromWebContents(event.sender);
}

function openWindowsCalculator() {
  if (process.platform !== "win32") {
    return { ok: false, message: "La calculatrice Windows est disponible uniquement sur Windows." };
  }

  const calculator = spawn("calc.exe", [], {
    detached: true,
    stdio: "ignore"
  });

  calculator.unref();
  return { ok: true };
}

async function openSystemFolder(folderKey) {
  const safeFolderKey = OPENABLE_FOLDERS[folderKey];

  if (!safeFolderKey) {
    return { ok: false, message: "Dossier non autorise." };
  }

  const folderPath = app.getPath(safeFolderKey);
  const errorMessage = await shell.openPath(folderPath);

  return errorMessage ? { ok: false, message: errorMessage } : { ok: true, path: folderPath };
}

function getSimpleSystemInfo() {
  const cpus = os.cpus();

  return {
    ok: true,
    platform: process.platform,
    release: os.release(),
    arch: process.arch,
    hostname: os.hostname(),
    cpuModel: cpus[0] ? cpus[0].model : "CPU inconnu",
    cpuCount: cpus.length,
    totalMemoryGb: Number((os.totalmem() / 1024 / 1024 / 1024).toFixed(1)),
    freeMemoryGb: Number((os.freemem() / 1024 / 1024 / 1024).toFixed(1)),
    electron: process.versions.electron,
    chrome: process.versions.chrome
  };
}

function extractResponseText(response) {
  if (response && typeof response.output_text === "string" && response.output_text.trim()) {
    return response.output_text.trim();
  }

  const output = Array.isArray(response && response.output) ? response.output : [];
  const textParts = [];

  output.forEach((item) => {
    const content = Array.isArray(item.content) ? item.content : [];
    content.forEach((contentItem) => {
      if (typeof contentItem.text === "string") textParts.push(contentItem.text);
    });
  });

  return textParts.join("\n").trim();
}

function normalizeAiMessage(message) {
  return typeof message === "string" ? message.trim().slice(0, 4000) : "";
}

async function askJarvisAi(message) {
  const safeMessage = normalizeAiMessage(message);

  if (!safeMessage) {
    return "Demande IA vide. Precisez votre question, monsieur.";
  }

  if (!openai) {
    return MISSING_API_KEY_MESSAGE;
  }

  try {
    const response = await openai.responses.create({
      model: OPENAI_MODEL,
      input: [
        {
          role: "system",
          content: JARVIS_SYSTEM_PROMPT
        },
        {
          role: "user",
          content: safeMessage
        }
      ]
    });

    return extractResponseText(response) || "Reponse IA recue, mais aucun texte exploitable n'a ete retourne.";
  } catch (error) {
    console.error("Erreur OpenAI:", error);
    return "Erreur IA. La connexion a l'API OpenAI a echoue.";
  }
}

function registerDesktopIpcHandlers() {
  ipcMain.handle("ask-ai", (_event, message) => askJarvisAi(message));

  ipcMain.handle("jarvis:open-calculator", () => openWindowsCalculator());

  ipcMain.handle("jarvis:open-browser", async () => {
    await shell.openExternal("https://www.google.com");
    return { ok: true };
  });

  ipcMain.handle("jarvis:open-url", async (_event, url) => {
    if (!isSafeExternalUrl(url)) {
      return { ok: false, message: "URL non autorisee." };
    }

    await shell.openExternal(url);
    return { ok: true };
  });

  ipcMain.handle("jarvis:open-folder", (_event, folderKey) => openSystemFolder(folderKey));
  ipcMain.handle("jarvis:get-system-info", () => getSimpleSystemInfo());

  ipcMain.handle("jarvis:set-fullscreen", (event, enabled) => {
    const window = getWindowFromEvent(event);
    if (!window) return { ok: false, message: "Fenetre introuvable." };

    window.setFullScreen(Boolean(enabled));
    return { ok: true, fullScreen: window.isFullScreen() };
  });

  ipcMain.handle("jarvis:minimize", (event) => {
    const window = getWindowFromEvent(event);
    if (!window) return { ok: false, message: "Fenetre introuvable." };

    window.minimize();
    return { ok: true };
  });

  ipcMain.handle("jarvis:close-app", (event) => {
    const window = getWindowFromEvent(event);
    if (!window) return { ok: false, message: "Fenetre introuvable." };

    window.close();
    return { ok: true };
  });
}

function createMainWindow() {
  // Fenetre desktop securisee : pas de Node.js direct dans l'interface.
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 820,
    minWidth: 960,
    minHeight: 680,
    title: APP_TITLE,
    backgroundColor: "#020817",
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      webSecurity: true
    }
  });

  mainWindow.loadFile(path.join(__dirname, "index.html"));

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (isSafeExternalUrl(url)) {
      shell.openExternal(url);
    }

    return { action: "deny" };
  });

  mainWindow.webContents.on("will-navigate", (event, url) => {
    const currentUrl = mainWindow.webContents.getURL();

    if (url === currentUrl) {
      return;
    }

    event.preventDefault();

    if (isSafeExternalUrl(url)) {
      shell.openExternal(url);
    }
  });
}

app.whenReady().then(() => {
  configurePermissions();
  registerDesktopIpcHandlers();
  createMainWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    }
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
