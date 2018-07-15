import { RestaurantService } from './services/restaurant-service';

// Keep a cache name as a global scope constant, to be able to change it
// when we have to add major changes to caching strategy
const staticCacheName = 'restaurant-review-v2';
const restaurantService = new RestaurantService();

// Fetch and add to the cache our html and css files
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(staticCacheName).then(cache => {
      return cache.addAll([
        '/manifest.json',
        '/index.html',
        '/restaurant.html',
        '/css/main.css',
        '/css/restaurant.css'
      ]);
    })
  );
});

// Delete previous caches on activate event
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(cacheName => {
          return cacheName.startsWith('restaurant-review-') && cacheName != staticCacheName;
        }).map(cacheName => {
          return caches.delete(cacheName);
        })
      );
    })
  );
});

// On fetch we firstly check cache, if we already store same request before we answer from the cache,
// otherwise we fetch the resource, store it to the cache and return to the client
self.addEventListener('fetch', event => {
  // Requests generated by chrome extensions and browser-sync we do not try to store in cache and fetch them directly
  if (event.request.url.startsWith('chrome-extension') || event.request.url.includes('browser-sync')) {
    event.respondWith(fetch(event.request));
    return;
  }

  event.respondWith (
    caches.open(staticCacheName).then(cache => {
      return cache.match(event.request).then(response => {
        return response || fetch(event.request).then(networkResponse => {
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        });
      });
    })
  );
});


// Sync events handler to process background sync with the server
self.addEventListener('sync', event => {
  if (event.tag === 'review') {
    event.waitUntil(
      restaurantService.syncReviews()
    );
  } else if (event.tag === 'favorite') {
    event.waitUntil(
      restaurantService.syncFavorites()
    );
  }
});
