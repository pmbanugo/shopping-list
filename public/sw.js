importScripts('workbox-sw.prod.v2.1.2.js');

/**
 * DO NOT EDIT THE FILE MANIFEST ENTRY
 *
 * The method precache() does the following:
 * 1. Cache URLs in the manifest to a local cache.
 * 2. When a network request is made for any of these URLs the response
 *    will ALWAYS comes from the cache, NEVER the network.
 * 3. When the service worker changes ONLY assets with a revision change are
 *    updated, old cache entries are left as is.
 *
 * By changing the file manifest manually, your users may end up not receiving
 * new versions of files because the revision hasn't changed.
 *
 * Please use workbox-build or some other tool / approach to generate the file
 * manifest which accounts for changes to local files and update the revision
 * accordingly.
 */
const fileManifest = [
  {
    "url": "css/style.css",
    "revision": "99559afa2b600e50f33cebcb12bd35e6"
  },
  {
    "url": "favicon.ico",
    "revision": "2ec6120d215494c24e7c808d0d5abf56"
  },
  {
    "url": "history.html",
    "revision": "240e2a52b8580117383162e8ec15fc00"
  },
  {
    "url": "index.html",
    "revision": "4a215dad3782fb0715224df00149cee9"
  },
  {
    "url": "js/transpiled/history.js",
    "revision": "48f49018af306d69bb82454b512f363f"
  },
  {
    "url": "js/transpiled/index.js",
    "revision": "62602ebdcef73333c052aa9895adbebf"
  },
  {
    "url": "js/transpiled/shared.js",
    "revision": "ca1e7d744a3f76fb342c71a09886bb5e"
  },
  {
    "url": "manifest.json",
    "revision": "cfada03439f24ccdb59dae8d4f6370d1"
  },
  {
    "url": "resources/dialog-polyfill/dialog-polyfill.css",
    "revision": "24599b960cd01b8e5dd86eb5114a1bcb"
  },
  {
    "url": "resources/dialog-polyfill/dialog-polyfill.js",
    "revision": "a581e4aa2ea7ea0afd4b96833d2e527d"
  },
  {
    "url": "resources/mdl/material-icons.css",
    "revision": "35ac69ce3f79bae3eb506b0aad5d23dd"
  },
  {
    "url": "resources/mdl/material.indigo-pink.min.css",
    "revision": "6036fa3a8437615103937662723c1b67"
  },
  {
    "url": "resources/mdl/material.min.js",
    "revision": "713af0c6ce93dbbce2f00bf0a98d0541"
  },
  {
    "url": "resources/mdl/MaterialIcons-Regular.woff2",
    "revision": "570eb83859dc23dd0eec423a49e147fe"
  },
  {
    "url": "resources/system.js",
    "revision": "c6b00872dc6e21c1327c08b0ba55e275"
  },
  {
    "url": "/hoodie/client.js",
    "revision": "1d95959fa58dcb01884b0039bd16cc6d"
  }
];

const workboxSW = new self.WorkboxSW({
  "skipWaiting": true,
  "clientsClaim": true
});
workboxSW.precache(fileManifest);
