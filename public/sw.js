const CACHE_NAME = "globalnews-v2";
const STATIC_CACHE = "globalnews-static-v2";
const DYNAMIC_CACHE = "globalnews-dynamic-v2";
const IMAGE_CACHE = "globalnews-images-v2";

const STATIC_ASSETS = [
  "/",
  "/offline",
  "/manifest.json",
  "/globals.css",
];

const PRECACHE_URLS = [
  "/category/breaking",
  "/category/politics",
  "/category/technology",
  "/category/sports",
  "/category/business",
  "/category/health",
  "/category/science",
  "/category/entertainment",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      return cache.addAll([...STATIC_ASSETS, ...PRECACHE_URLS]);
    }).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => key !== STATIC_CACHE && key !== DYNAMIC_CACHE && key !== IMAGE_CACHE)
          .map((key) => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (request.method !== "GET") return;

  if (url.pathname.startsWith("/api/")) {
    event.respondWith(
      fetch(request)
        .then((res) => {
          if (res.ok) {
            const clone = res.clone();
            caches.open(DYNAMIC_CACHE).then((cache) => {
              cache.put(request, clone);
            });
          }
          return res;
        })
        .catch(() => {
          return caches.match(request);
        })
    );
    return;
  }

  if (request.destination === "image") {
    event.respondWith(
      fetch(request).then((res) => {
        if (res.ok) {
          const clone = res.clone();
          caches.open(IMAGE_CACHE).then((cache) => {
            cache.put(request, clone);
          });
        }
        return res;
      }).catch(() => {
        return caches.match(request).then((cached) => {
          return cached || new Response(
            `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300">
              <rect fill="#e5e7eb" width="400" height="300"/>
              <text fill="#9ca3af" font-family="sans-serif" font-size="14" text-anchor="middle" x="200" y="150">Image unavailable offline</text>
            </svg>`,
            { headers: { "Content-Type": "image/svg+xml" } }
          );
        });
      })
    );
    return;
  }

  event.respondWith(
    caches.match(request).then((cached) => {
      const networkFetch = fetch(request)
        .then((res) => {
          if (res.ok) {
            const clone = res.clone();
            caches.open(DYNAMIC_CACHE).then((cache) => {
              cache.put(request, clone);
            });
          }
          return res;
        })
        .catch(() => {
          if (request.mode === "navigate") {
            return caches.match("/offline");
          }
          return cached;
        });

      return cached || networkFetch;
    })
  );
});

self.addEventListener("push", (event) => {
  const data = event.data?.json() || {
    title: "Breaking News",
    body: "New breaking news available",
    icon: "/icons/icon-192x192.png",
  };

  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: data.icon || "/icons/icon-192x192.png",
      badge: "/icons/icon-96x96.png",
      vibrate: [200, 100, 200],
      data: data.url || "/",
      actions: [
        { action: "open", title: "Read Now" },
        { action: "dismiss", title: "Dismiss" },
      ],
    })
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  if (event.action === "dismiss") return;

  event.waitUntil(
    clients.matchAll({ type: "window" }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes(self.registration.scope) && "focus" in client) {
          return client.focus();
        }
      }
      return clients.openWindow(event.notification.data || "/");
    })
  );
});
