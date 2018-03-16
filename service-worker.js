const cacheName = 'restaurant-review-v1';

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(cacheName).then(cache => {
      return cache.addAll([
        '/index.html',
        '/restaurant.html',
        '/css/base.css',
        '/css/main.css',
        '/css/restaurant.css'
      ]);
    })
  );
});

self.addEventListener('fetch', event => {
  if (event.request.url.startsWith('chrome-extension')) {
    event.respondWith(fetch(event.request));
    return;
  }

  event.respondWith (
    caches.open(cacheName).then(cache => {
      return cache.match(event.request).then(response => {
        return response || fetch(event.request).then(networkResponse => {
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        });
      });
    })
  );
});
