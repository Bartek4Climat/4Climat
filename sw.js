// Service Worker — 4Climat
// Strategia: zawsze sprawdź aktualizację przy starcie

const CACHE_NAME = '4climat-v4';
const CDN_CACHE = '4climat-cdn-v4';

const PRECACHE = [
  '/4Climat/',
  '/4Climat/index.html',
  '/4Climat/manifest.json',
  '/4Climat/icon-192.png',
  '/4Climat/icon-512.png',
];

// Instalacja — zapisz pliki do cache
self.addEventListener('install', event => {
  self.skipWaiting(); // Aktywuj natychmiast bez czekania
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(PRECACHE))
  );
});

// Aktywacja — usuń stare cache i przejmij kontrolę
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k !== CACHE_NAME && k !== CDN_CACHE)
            .map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim()) // Przejmij kontrolę od razu
  );
});

// Fetch — network first dla HTML, cache first dla CDN
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // CDN (pdfmake, fonty) — cache first
  if (url.hostname !== self.location.hostname) {
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

  // HTML i lokalne pliki — network first, aktualizuj cache w tle
  event.respondWith(
    fetch(event.request)
      .then(res => {
        if (res && res.status === 200 && event.request.method === 'GET') {
          // Zaktualizuj cache nową wersją
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, res.clone()));
        }
        return res;
      })
      .catch(() => {
        // Offline — użyj cache
        return caches.match(event.request);
      })
  );
});

// Nasłuchuj wiadomości od strony
self.addEventListener('message', event => {
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
  }
});
