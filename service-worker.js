/* Self-destroying service worker.
 *
 * The previous (Vite) deployment registered a service worker at this origin
 * that now serves a stale, broken app shell ("[bundle] error"). This file
 * replaces it: on activation it clears every cache, unregisters itself, and
 * reloads open pages so visitors get the current static site. Once every
 * browser has picked this up, these files can be removed.
 */
self.addEventListener('install', function () {
  self.skipWaiting();
});

self.addEventListener('activate', function (event) {
  event.waitUntil((async function () {
    try {
      var keys = await caches.keys();
      await Promise.all(keys.map(function (k) { return caches.delete(k); }));
    } catch (e) { /* ignore */ }
    try { await self.registration.unregister(); } catch (e) { /* ignore */ }
    var clients = await self.clients.matchAll({ type: 'window' });
    clients.forEach(function (c) { c.navigate(c.url); });
  })());
});

/* Never serve from an old cache while we wind down. */
self.addEventListener('fetch', function () { /* pass through to network */ });
