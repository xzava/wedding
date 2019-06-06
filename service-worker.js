// CODELAB: Update cache names any time any of the cached files change.
const CACHE_NAME = 'static-cache-v3';
const DATA_CACHE_NAME = 'data-cache-v2';

// CODELAB: Add list of files to cache here.
const FILES_TO_CACHE = [
'./',
'./index.html',
'./assets/install.js',
'./assets/install.svg',
'./assets/w3.css',
'./assets/fonts.css',
'./assets/icons/icon-152x152.png',
'./assets/wedding_couple.jpg',
'./assets/flowers-3.jpg',
'./assets/flowers-6.jpg',
'./assets/flowers-3.jpg',
'./assets/core-crop.jpg',
'./assets/wedding_couple2.jpg',
'./assets/photo1.1.jpg',
'./assets/wedding_location.jpg',
'./assets/photo2.1.jpg',
'./assets/photo4.jpg',
'./assets/photo3.jpg',
'./assets/photo3.5.jpg',
'./assets/photo8.jpg',
'./assets/photo4.5.jpg',
'./assets/photo5.jpg',
'./assets/photo9.jpg',
'./assets/photo6.jpg',
'./assets/photo7.jpg'
];

self.addEventListener('install', (evt) => {
  console.log('[ServiceWorker] Install');
  // CODELAB: Precache static resources here.
  evt.waitUntil(
      caches.open(CACHE_NAME).then((cache) => {
        console.log('[ServiceWorker] Pre-caching offline page');
        return cache.addAll(FILES_TO_CACHE);
      })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (evt) => {
  console.log('[ServiceWorker] Activate');
  // CODELAB: Remove previous cached data from disk.
  evt.waitUntil(
      caches.keys().then((keyList) => {
        return Promise.all(keyList.map((key) => {
          if (key !== CACHE_NAME && key !== DATA_CACHE_NAME) {
            console.log('[ServiceWorker] Removing old cache', key);
            return caches.delete(key);
          }
        }));
      })
  );
  self.clients.claim();
});

// The fetch handler serves responses for same-origin resources from a cache.
// If no response is found, it populates the runtime cache with the response
// from the network before returning it to the page.
self.addEventListener('fetch', event => {
  // Skip cross-origin requests, like those for Google Analytics.
  if (event.request.url.startsWith(self.location.origin)) {
    event.respondWith(
      caches.match(event.request).then(cachedResponse => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return caches.open(DATA_CACHE_NAME).then(cache => {
          return fetch(event.request).then(response => {
            // Put a copy of the response in the runtime cache.
            return cache.put(event.request, response.clone()).then(() => {
              return response;
            });
          });
        });
      })
    );
  }
});
