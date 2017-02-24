importScripts("/resources/sw-toolbox.js");

const version = "0.12";

self.addEventListener("install", function(event){
    event.waitUntil(
        caches.open(version)
        .then(function(cache){
            return cache.addAll(["/index.html",
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
                        "/js/transpiled/index.js",
                        "/js/transpiled/history.js",
                        "/js/transpiled/shared.js",
                        "/hoodie/client.js"]);
    })
    .then((r) => {
        console.log("SW skipping wait");
        self.skipWaiting();
        console.log("SW Installed");
        return r;
    })
    .catch(console.error));
});

self.addEventListener("activate", function (event){
    console.log("SW claiming");
    self.clients.claim();
    console.log("SW activated");

    event.waitUntil(
        caches.keys()
        .then(function (keys){
            return Promise.all(keys.filter(function (key) {
                return key !== version;
            }).map(function (key) {
                return caches.delete(key);
            }));
        })
        .then((r) => {
            console.log(r);
            return r;
        })
        .catch(console.error));
});



toolbox.router.get("/hoodie/client.js", toolbox.cacheFirst, {
    cache: {
        name: version,
        maxAgeSeconds: 60 * 60 * 24 * 365
    }
});

toolbox.router.get("/hoodie/*", toolbox.networkOnly);

toolbox.router.get("/*", toolbox.cacheFirst, {
    cache: {
        name: version,
        maxAgeSeconds: 60 * 60 * 24 * 365
    }
});