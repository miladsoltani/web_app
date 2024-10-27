importScripts("/assets/scripts/dexie.js");
importScripts("/assets/scripts/db.js");

const cacheVersion = 2;        
const activeCaches = {
  static: `static-v${cacheVersion}`,
  dynamic: `dynamic-v${cacheVersion}`,
};

self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches
      .open(activeCaches["static"])
      .then((cache) => {
        cache.addAll([
          "/",
          "pages/offline.html",
          "pages/users.html",
          "pages/plans.html",
          "assets/scripts/app.js",
          "assets/scripts/db.js",
          "assets/scripts/dexie.js",
          "assets/style/main.css",
          "assets/style/users.css",
          "assets/style/plans.css",
        ]);
      })
      .catch((err) => console.log(err))
  );
});

self.addEventListener("activate", (event) => {
  const activeCacheNames = Object.values(activeCaches);
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.forEach((cacheName) => {
          if (!activeCacheNames.includes(cacheName)) caches.delete(cacheName);
        })
      );
    })
  );
});

self.addEventListener("fetch", (event) => {
  const urls = ["http://localhost:8000/users"];
  if (urls.includes(event.request.url)) {
    return event.respondWith(
      fetch(event.request).then((response) => {
        response
          .clone()
          .json()
          .then((data) => {
            for (let user of data) {
              db.users.put(user);
            }
          });
        return response;
      })
    );
  } else {
    event.respondWith(
      caches.match(event.request).then((response) => {
        if (response) {
          return response;
        } else {
          return fetch(event.request)
            .then((serverResponse) => {
              caches.open(activeCaches["dynamic"]).then((cache) => {
                cache.put(event.request, serverResponse.clone());
                return serverResponse;
              });
            })
            .catch((err) => caches.match("pages/offline.html"));
        }
      })
    );
  }
});





