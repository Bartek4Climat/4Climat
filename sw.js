// Service Worker — 4Climat Generator Ofert
// Strategia: NETWORK FIRST dla wszystkiego — zawsze świeże dane

self.addEventListener('install', event => {
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  // Usuń WSZYSTKIE stare cache przy każdej aktualizacji
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Obrazki i fonty — cache OK
  if (event.request.destination === 'image' ||
      event.request.destination === 'font' ||
      url.hostname === 'fonts.gstatic.com') {
    event.respondWith(
      caches.open('static-v1').then(cache =>
        cache.match(event.request).then(cached =>
          cached || fetch(event.request).then(res => {
            cache.put(event.request, res.clone());
            return res;
          })
        )
      )
    );
    return;
  }

  // Wszystko inne — zawsze z sieci, bez cache
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
