const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");
const vm = require("node:vm");

const source = fs.readFileSync(path.join(__dirname, "..", "service-worker.js"), "utf8");

test("le cache hors ligne retrouve les scripts avec un parametre de version", async () => {
  const handlers = new Map();
  const cachedScript = { status: 200, body: "JARVIS mobile" };
  const cacheLookups = [];
  const caches = {
    match: async (request, options = {}) => {
      cacheLookups.push({ request, options });
      return options.ignoreSearch ? cachedScript : null;
    }
  };
  const self = { addEventListener: (name, handler) => handlers.set(name, handler) };
  vm.runInNewContext(source, {
    self, caches, URL, Response,
    fetch: async () => { throw new Error("hors ligne"); }
  });

  const request = {
    method: "GET", mode: "same-origin",
    url: "https://jarvis.example/mobile.js?v=4.6.2"
  };
  let responsePromise;
  handlers.get("fetch")({ request, respondWith: (promise) => { responsePromise = promise; } });
  assert.equal(await responsePromise, cachedScript);
  assert.equal(cacheLookups[0].options.ignoreSearch, undefined);
  assert.equal(cacheLookups[1].options.ignoreSearch, true);
});
