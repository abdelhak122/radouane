const CACHE_NAME = 'radouane-analyzer-v5'; // Incremented cache version
// List of essential files to cache for offline functionality
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  // Note: Caching built assets (JS, CSS) requires a more advanced setup,
  // typically with a build tool plugin that generates the service worker.
  // This basic setup provides minimal offline support for the main page.
  './icon-192x192.png',
  './icon-512x512.png',
  './maskable-icon.png'
];

// Delete old caches on activation
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Install event: open cache and add core files
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        // Use addAll with a catch to prevent install failure if one asset is missing
        return cache.addAll(urlsToCache).catch(err => {
          console.error('Failed to cache urls:', err);
        });
      })
  );
});

// Fetch event: respond with cached content first, fall back to network
self.addEventListener('fetch', event => {
  // We only handle GET requests
  if (event.request.method !== 'GET') {
    return;
  }
  
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // If we found a match in the cache, return it.
        if (response) {
          return response;
        }

        // Otherwise, fetch from the network.
        return fetch(event.request).then(networkResponse => {
            // Optional: You could cache dynamic requests here if needed
            return networkResponse;
        });
      })
  );
});