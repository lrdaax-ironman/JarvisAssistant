const { app, BrowserWindow, ipcMain, shell, session } = require("electron");
const { spawn } = require("node:child_process");
const os = require("node:os");
const path = require("node:path");

const APP_TITLE = "JARVIS Assistant";
const OPENABLE_FOLDERS = {
  documents: "documents",
  desktop: "desktop"
};

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

function registerDesktopIpcHandlers() {
  ipcMain.handle("jarvis:open-calculator", () => openWindowsCalculator());

  ipcMain.handle("jarvis:open-browser", async () => {
    await shell.openExternal("https://www.google.com");
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
