const { contextBridge, ipcRenderer } = require("electron");

const allowedFolders = ["documents", "desktop"];

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
