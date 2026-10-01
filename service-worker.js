const CACHE_NAME = "jarvis-mobile-v6";
const NETWORK_FIRST_ASSETS = ["index.html", "mobile.html", "style.css", "script.js", "voice.css", "mobile.css", "mobile.js", "mobile-command-routing.js", "manifest.json"];
const CORE_ASSETS = [
  "./",
  "./index.html",
  "./mobile.html",
  "./style.css",
  "./voice.css",
  "./script.js",
  "./mobile.css",
  "./mobile-command-routing.js",
  "./mobile.js",
  "./manifest.json",
  "./vercel.json",
  "./netlify.toml",
  "./assets/icons/icon-192.png",
  "./assets/icons/icon-512.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => Promise.all(
      CORE_ASSETS.map((asset) => fetch(asset, { cache: "no-cache" })
        .then((response) => {
          if (response.ok) return cache.put(asset, response);
          return null;
        })
        .catch(() => null))
    ))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => Promise.all(
      cacheNames
        .filter((cacheName) => cacheName !== CACHE_NAME)
        .map((cacheName) => caches.delete(cacheName))
    ))
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  const requestUrl = new URL(event.request.url);
  if (requestUrl.pathname.startsWith("/bridge/")) return;

  const assetName = requestUrl.pathname.split("/").pop();
  const isNetworkFirstAsset = event.request.mode === "navigate" || NETWORK_FIRST_ASSETS.includes(assetName);
  const offlineResponse = () => new Response("", { status: 504, statusText: "Offline" });
  const navigationFallback = () => caches.match("./mobile.html")
    .then((fallback) => fallback || caches.match("./index.html"))
    .then((fallback) => fallback || offlineResponse());

  event.respondWith(
    (isNetworkFirstAsset
      ? fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.ok) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseClone));
          }
          return networkResponse;
        })
        .catch(() => caches.match(event.request).then((cachedResponse) => cachedResponse || offlineResponse()))
      : caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) return cachedResponse;

      return fetch(event.request)
        .then((networkResponse) => {
          if (!networkResponse || !networkResponse.ok) return networkResponse;
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseClone));
          return networkResponse;
        })
        .catch(() => {
          if (event.request.mode === "navigate") return navigationFallback();
          return caches.match(event.request).then((fallback) => fallback || offlineResponse());
        });
    }))
  );
});
