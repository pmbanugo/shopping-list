importScripts("/resources/sw-toolbox.js");

const version = "2.55";

self.addEventListener("install", function(event){
    event.waitUntil(
        caches.open(version)
        .then(function(cache){
            return cache.addAll(["/index.html",
                        "/history.html",
                        "/resources/mdl/material.indigo-pink.min.css",
                        "/resources/mdl/material.min.js",
                        "/resources/mdl/MaterialIcons-Regular.eot",
                        "/resources/mdl/MaterialIcons-Regular.ttf",
                        "/resources/mdl/MaterialIcons-Regular.woff",
                        "/resources/mdl/MaterialIcons-Regular.woff2",
                        "/resources/mdl/material-icons.css",
                        "/css/style.css",
                        "/resources/dialog-polyfill/dialog-polyfill.js",
                        "/resources/dialog-polyfill/dialog-polyfill.css",
                        "/js/require.js",
                        "/js/index.js",
                        "/js/item.js",
                        "/js/history.js",
                        "/hoodie/client.js"]);
    })
    .then(function(){
        return self.skipWaiting();
    }));

    console.log("SW Installed");
});

self.addEventListener("activate", function (event){
    event.waitUntil(
        caches.keys()
        .then(function (keys){
            return Promise.all(keys.filter(function (key) {
                return key !== version;
            }).map(function (key) {
                return caches.delete(key);
            }));
        })
        .then(function(){
            return self.clients.claim();
        }));
        
        console.log("SW activated");
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