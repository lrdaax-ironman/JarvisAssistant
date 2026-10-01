const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const pkg = require("../package.json");

const root = path.join(__dirname, "..");
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");

test("la version annoncee correspond au paquet source et aux fichiers web", () => {
  const version = pkg.version;
  assert.match(read("index.html"), new RegExp(`JARVIS v${version.replaceAll(".", "\\.")}`));
  assert.match(read("script.js"), new RegExp(`APP_VERSION = "V${version.replaceAll(".", "\\.")}"`));
  assert.match(read("mobile.js"), new RegExp(`APP_VERSION = "${version.replaceAll(".", "\\.")} mobile"`));
  assert.match(read("mobile.html"), new RegExp(`mobile\\.js\\?v=${version.replaceAll(".", "\\.")}`));
  for (const filename of ["mobile-import.js", "system-metrics.js"]) {
    assert.ok(pkg.build.files.includes(filename));
    assert.ok(fs.existsSync(path.join(root, filename)));
  }
});
