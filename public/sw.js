importScripts("/resources/sw-toolbox.js");

const version = "003";

self.addEventListener("install", function(event){
    event.waitUntil(
        caches.open(version)
        .then(function(cache){
            return cache.addAll(["/index.html",
                        "/history.html",
                        "/manifest.json",
                        "/js/index.js",
                        "/js/history.js"]);
    })
    .then(function(){
        console.log("skipping wait");
        return self.skipWaiting();
    })
    .catch(console.error));

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
            console.log("claimed");
            return self.clients.claim();
        })
        .catch(console.error));
        
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