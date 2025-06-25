
// sw.js
self.addEventListener('install', (event) => {
  console.log('ServiceWorker: Installing new version...');
  self.skipWaiting(); // Force the new service worker to activate
});

self.addEventListener('activate', (event) => {
  console.log('ServiceWorker: Activating new version...');
  event.waitUntil(self.clients.claim()); // Take control of all open clients
  // Clean up old caches if needed (add logic here if you implement named caches)
});

self.addEventListener('fetch', (event) => {
  // Basic pass-through fetch. More advanced strategies (cache-first, network-first) can be added.
  // console.log('ServiceWorker: Fetching ', event.request.url);
  event.respondWith(fetch(event.request));
});
