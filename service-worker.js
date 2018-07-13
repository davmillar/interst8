// jshint esversion:6
var me = self,
    CACHE_NAME = 'interst8f',
    urlsToCache = [
      '/',
      '/?utm_source=web_app_manifest',
      '/index.html',
      '/assets/Overpass_Regular-webfont.eot',
      '/assets/Overpass_Regular-webfont.svg',
      '/assets/Overpass_Regular-webfont.ttf',
      '/assets/Overpass_Regular-webfont.woff',
      '/css/overpass.css',
      '/css/style.css',
      '/js/game.js',
      '/js/service-worker-handler.js',
      '/data/levels.json',
      '/manifest.json'
    ];

me.addEventListener('install', function(event) {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        return cache.addAll(urlsToCache);
      })
  );
});

me.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.match(event.request).then(function (response) {
        return response || fetch(event.request).then(function(response) {
          cache.put(event.request, response.clone());
          return response;
        });
      });
    })
  );
});

me.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
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
