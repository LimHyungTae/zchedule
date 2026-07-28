const SHELL_CACHE = "zchedule-shell-v5";
const DATA_CACHE = "zchedule-data-v1";
const CACHE_PREFIX = "zchedule-";

const scopedURL = (path) => new URL(path, self.registration.scope).toString();

const SHELL_ASSETS = [
  "./",
  "./index.html",
  "./styles.css",
  "./app.js",
  "./schedule-data.js",
  "./service-calendar.js",
  "./manifest.webmanifest",
  "./assets/icon.svg",
  "./assets/icon-192.png",
  "./assets/icon-512.png",
  "./assets/icon-maskable-512.png",
].map(scopedURL);

const INDEX_URL = scopedURL("./index.html");
const SCHEDULE_URL = scopedURL("./time_table.png");

self.addEventListener("install", (event) => {
  event.waitUntil(
    Promise.all([
      caches.open(SHELL_CACHE).then((cache) => cache.addAll(SHELL_ASSETS)),
      caches
        .open(DATA_CACHE)
        .then(async (cache) => {
          try {
            const response = await fetch(SCHEDULE_URL, { cache: "reload" });
            if (response.ok) {
              await cache.put(SCHEDULE_URL, response);
            }
          } catch {
            // The schedule is cached on its first successful online request instead.
          }
        }),
    ]).then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter(
              (key) => key.startsWith(CACHE_PREFIX) && key !== SHELL_CACHE && key !== DATA_CACHE,
            )
            .map((key) => caches.delete(key)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

async function networkFirst(request, cacheName, fallbackURL) {
  const cache = await caches.open(cacheName);

  try {
    const response = await fetch(request, { cache: "reload" });
    if (response.ok) {
      await cache.put(request, response.clone());
    }
    return response;
  } catch {
    return (await cache.match(request)) || (fallbackURL ? cache.match(fallbackURL) : undefined);
  }
}

async function cacheFirst(request) {
  const cache = await caches.open(SHELL_CACHE);
  return (await cache.match(request)) || fetch(request);
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") {
    return;
  }

  const url = new URL(request.url);
  const scope = new URL(self.registration.scope);
  if (url.origin !== scope.origin || !url.pathname.startsWith(scope.pathname)) {
    return;
  }

  if (request.mode === "navigate") {
    event.respondWith(networkFirst(request, SHELL_CACHE, INDEX_URL));
    return;
  }

  if (url.href === SCHEDULE_URL) {
    event.respondWith(networkFirst(request, DATA_CACHE));
    return;
  }

  if (SHELL_ASSETS.includes(url.href)) {
    event.respondWith(cacheFirst(request));
  }
});
