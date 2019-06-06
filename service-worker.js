// CODELAB: Update cache names any time any of the cached files change.
const CACHE_NAME = 'static-cache-v2';
const DATA_CACHE_NAME = 'data-cache-v1';

console.log(000)
// CODELAB: Add list of files to cache here.
const FILES_TO_CACHE = [
  '/',
  '/index.html',
  '/assets/install.js',
  '/assets/install.svg',
  '/assets/core-crop.jpg',
  '/assets/flowers-dark.jpg',
  '/assets/flowers5.jpeg',
  '/assets/flowers6.jpeg',
  '/assets/flowers.jpg',
  '/assets/flowers7.jpeg',
  '/assets/flowers4.jpeg',
  '/assets/flowers5.jpeg',
  '/assets/photo7.jpg',
  '/assets/w3.css',
  '/assets/wedding_location.jpg',
  '/assets/photo1.jpg',
  '/assets/photo4.jpg',
  '/assets/photo1.1.jpg',
  '/assets/photo2.jpg',
  '/assets/wedding_couple2.jpg',
  '/assets/photo5.jpg',
  '/assets/flowers-dark.jpg',
  '/assets/flowers-4.jpg',
  '/assets/photo3.jpg',
  '/assets/photo3.5.jpg',
  '/assets/flowers8.jpeg',
  '/assets/flowers-3.jpg',
  '/assets/core.jpg',
  '/assets/photo4.5.jpg',
  '/assets/core2.jpg',
  '/assets/photo9.jpg',
  '/assets/wedding_couple.jpg',
  '/assets/photo3.jpg',
  '/assets/core-2.jpg',
  '/assets/photo6.jpg',
  '/assets/flowers3.jpeg',
  '/assets/photo8.jpg',
  '/assets/photo2.1.jpg',
  '/assets/photo1.1.jpg',
  '/assets/flowers-6.jpg',
  '/assets/core2.jpg',
  '/assets/core-1.jpg',
  '/assets/core-crop.jpg',
  '/assets/flowers-7.jpg',
  '/assets/fonts.css',
];

self.addEventListener('install', (evt) => {
  console.log(00)	
  console.log('[ServiceWorker] Install');
  // CODELAB: Precache static resources here.
  evt.waitUntil(
      caches.open(CACHE_NAME).then((cache) => {
        console.log('[ServiceWorker] Pre-caching offline page');
        return cache.addAll(FILES_TO_CACHE);
      })
  );
  console.log(0)
  self.skipWaiting();
});

self.addEventListener('activate', (evt) => {
  console.log(1)
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
  console.log(2)
  self.clients.claim();
});

self.addEventListener('fetch', (evt) => {
	console.log(3)
	if (evt.request.url.includes('/forecast/')) {
	  console.log('[Service Worker] Fetch (data)', evt.request.url);
	  evt.respondWith(
	      caches.open(DATA_CACHE_NAME).then((cache) => {
	        return fetch(evt.request)
	            .then((response) => {
	              // If the response was good, clone it and store it in the cache.
	              if (response.status === 200) {
	                cache.put(evt.request.url, response.clone());
	              }
	              return response;
	            }).catch((err) => {
	              // Network request failed, try to get it from the cache.
	              return cache.match(evt.request);
	            });
	      }));
	  return;
	}
	evt.respondWith(
	    console.log(4)
	    caches.open(CACHE_NAME).then((cache) => {
	      return cache.match(evt.request)
	          .then((response) => {
	            return response || fetch(evt.request);
	          });
	    })
	);
});
console.log(5)
