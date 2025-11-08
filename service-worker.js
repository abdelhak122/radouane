const CACHE_NAME = 'radouane-analyzer-v2'; // Incremented cache version
// List of essential files to cache for offline functionality
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './index.tsx',
  './App.tsx',
  './i18n.ts',
  './types.ts',
  './services/geminiService.ts',
  './components/Header.tsx',
  './components/ImageUpload.tsx',
  './components/LoadingSpinner.tsx',
  './components/AnalysisResult.tsx',
  './components/ApiKeyModal.tsx',
  './components/ScoreBadge.tsx',
  './components/ComponentCard.tsx',
  // NOTE: For full PWA offline support, you should also cache your icon files.
  // Add the following lines once you have uploaded the icon files to your repository.
  // './icon-192x192.png',
  // './icon-512x512.png',
  // './maskable-icon.png'
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