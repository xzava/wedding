/*
 * @license
 * Your First PWA Codelab (https://g.co/codelabs/pwa)
 * Copyright 2019 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License
 */
'use strict';

// CODELAB: Update cache names any time any of the cached files change.
const CACHE_NAME = 'static-cache-v2';
const DATA_CACHE_NAME = 'data-cache-v1';

// CODELAB: Add list of files to cache here.
const FILES_TO_CACHE = [
  './',
  './index.html',
  './assets/install.js',
  './assets/install.svg',
  './assets/core-crop.jpg',
  './assets/flowers-dark.jpg',
  './assets/flowers5.jpeg',
  './assets/flowers6.jpeg',
  './assets/flowers.jpg',
  './assets/flowers7.jpeg',
  './assets/flowers4.jpeg',
  './assets/flowers5.jpeg',
  './assets/photo7.jpg',
  './assets/w3.css',
  './assets/wedding_location.jpg',
  './assets/photo1.jpg',
  './assets/photo4.jpg',
  './assets/photo1.1.jpg',
  './assets/photo2.jpg',
  './assets/wedding_couple2.jpg',
  './assets/photo5.jpg',
  './assets/flowers-dark.jpg',
  './assets/flowers-4.jpg',
  './assets/photo3.jpg',
  './assets/photo3.5.jpg',
  './assets/flowers8.jpeg',
  './assets/flowers-3.jpg',
  './assets/core.jpg',
  './assets/photo4.5.jpg',
  './assets/core2.jpg',
  './assets/photo9.jpg',
  './assets/wedding_couple.jpg',
  './assets/photo3.jpg',
  './assets/core-2.jpg',
  './assets/photo6.jpg',
  './assets/flowers3.jpeg',
  './assets/photo8.jpg',
  './assets/photo2.1.jpg',
  './assets/photo1.1.jpg',
  './assets/flowers-6.jpg',
  './assets/core2.jpg',
  './assets/core-1.jpg',
  './assets/core-crop.jpg',
  './assets/flowers-7.jpg',
  './assets/fonts.css',
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
