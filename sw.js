const CACHE_NAME = '4climat-v3';
const CDN_CACHE = '4climat-cdn-v3';

const PRECACHE = [
  '/app.html',
  '/index.html',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(PRECACHE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE_NAME && k !== CDN_CACHE)
            .map(k => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // CDN — cache first
  if (url.hostname !== location.hostname) {
    event.respondWith(
      caches.open(CDN_CACHE).then(cache =>
        cache.match(event.request).then(cached => {
          if (cached) return cached;
          return fetch(event.request).then(res => {
            if (res && res.status === 200)
              cache.put(event.request, res.clone());
            return res;
          }).catch(() => cached);
        })
      )
    );
    return;
  }

  // Lokalne — network first, fallback cache (offline działa)
  event.respondWith(
    fetch(event.request)
      .then(res => {
        if (res && res.status === 200 && event.request.method === 'GET') {
          caches.open(CACHE_NAME).then(c => c.put(event.request, res.clone()));
        }
        return res;
      })
      .catch(() => caches.match(event.request))
  );
});
