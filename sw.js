// Service Worker — 4Climat Generator Ofert
// Wersja cache — zmień żeby wymusić aktualizację
const CACHE_VERSION = 'v1';
const CACHE_NAME = `4climat-oferty-${CACHE_VERSION}`;

// Zasoby do cache'owania przy instalacji
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png',
  // Zewnętrzne biblioteki (cache przy pierwszym użyciu)
];

// Zewnętrzne CDN — cache przy pierwszym użyciu (network-first)
const CDN_HOSTS = [
  'cdnjs.cloudflare.com',
  'fonts.googleapis.com',
  'fonts.gstatic.com',
];

// ── Instalacja ──────────────────────────────────────────────
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

// ── Aktywacja (usuń stare cache) ────────────────────────────
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(k => k.startsWith('4climat-oferty-') && k !== CACHE_NAME)
          .map(k => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

// ── Fetch — strategia mieszana ───────────────────────────────
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // CDN: network-first, fallback cache
  if (CDN_HOSTS.some(h => url.hostname.includes(h))) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          if (response && response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
          }
          return response;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // Lokalne zasoby: cache-first, fallback network
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        if (response && response.status === 200 && event.request.method === 'GET') {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return response;
      });
    })
  );
});
