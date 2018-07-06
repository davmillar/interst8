// jshint esversion:6
var CACHE_NAME = 'my-site-cache-v3',
    urlsToCache = [
      '/',
      '/assets/Overpass_Regular-webfont.eot',
      '/assets/Overpass_Regular-webfont.svg',
      '/assets/Overpass_Regular-webfont.ttf',
      '/assets/Overpass_Regular-webfont.woff',
      '/assets/built.css',
      '/assets/built.js',
      '/data/levels.json'
    ];

self.addEventListener('install', function(event) {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheName !== CACHE_NAME) {
            return caches['delete'](cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener('message', function(event) {
  if (event.data.action === 'skipWaiting') {
    self.skipWaiting();
  }
});
