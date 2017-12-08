module.exports = {
  globDirectory: "public/",
  globPatterns: ["**/*.{css,ico,html,png,svg,js,json,woff2}"],
  swDest: "./public/sw.js",
  globIgnores: ["../workbox-cli-config.js", "icons/*", "js/src/*", "sw.old.js"],
  skipWaiting: true,
  clientsClaim: true,
  templatedUrls: {
    "/hoodie/client.js": "../.hoodie/cleint.js"
  }
};
