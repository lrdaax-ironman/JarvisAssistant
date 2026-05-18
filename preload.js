const { contextBridge } = require("electron");

// Pont minimal entre Electron et l'interface, sans exposer Node.js.
contextBridge.exposeInMainWorld("jarvisDesktop", {
  isDesktop: true,
  platform: process.platform,
  versions: {
    chrome: process.versions.chrome,
    electron: process.versions.electron
  }
});
