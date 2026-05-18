const { app, BrowserWindow, shell, session } = require("electron");
const path = require("node:path");

const APP_TITLE = "JARVIS Assistant";

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
