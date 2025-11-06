const CACHE_NAME = 'radouane-analyzer-v1';
// List of essential files to cache for offline functionality
const urlsToCache = [
  './',
  './index.html',
  './index.tsx'
];

// Install event: open cache and add core files
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event: respond with cached content first, fall back to network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // If we found a match in the cache, return it. Otherwise, fetch from the network.
        return response || fetch(event.request);
      })
  );
});
