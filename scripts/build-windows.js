const path = require("node:path");

// Assure que les sous-processus de electron-builder trouvent le meme Node/npm.
process.env.PATH = [
  path.dirname(process.execPath),
  process.env.PATH || ""
].join(path.delimiter);

process.argv = [
  process.execPath,
  require.resolve("electron-builder/cli"),
  "--win",
  "nsis"
];

require("electron-builder/cli");
