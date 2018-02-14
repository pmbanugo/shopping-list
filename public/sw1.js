const CACHE_NAME = "cache-v1";

const assetToCache = [
  "/index.html",
  "/",
  "/history.html",
  "/manifest.json",
  "/resources/mdl/material.indigo-pink.min.css",
  "/resources/mdl/material.min.js",
  "/resources/mdl/MaterialIcons-Regular.woff2",
  "/resources/mdl/material-icons.css",
  "/css/style.css",
  "/resources/dialog-polyfill/dialog-polyfill.js",
  "/resources/dialog-polyfill/dialog-polyfill.css",
  "/resources/system.js",
  "/js/transpiled/index.js",
  "/js/transpiled/history.js",
  "/js/transpiled/shared.js",
  "/hoodie/client.js"
];

self.addEventListener("install", function(event) {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then(function(cache) {
        return cache.addAll(assetToCache);
      })
      .catch(console.error)
  );
});

self.addEventListener("fetch", function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      if (response) {
        return response; 
      }
      return fetch(event.request);
    })
  );
});
