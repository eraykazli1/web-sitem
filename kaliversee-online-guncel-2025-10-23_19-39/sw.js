const CACHE_NAME = 'kaliversee-online-v2';
const STATIC_CACHE = 'kaliversee-static-v2';
const DYNAMIC_CACHE = 'kaliversee-dynamic-v2';

const STATIC_ASSETS = [
  './',
  './index.html',
  './blog-yazi-1.html',
  './blog-yazi-2.html',
  './blog-yazi-3.html',
  './404.html',
  './styles/site.css',
  './scripts/main.js',
  './resimlerim/logom.png',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './manifest.webmanifest'
];

const DYNAMIC_ASSETS = [
  'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&family=Inter:wght@300;400;500;600&display=swap',
  'https://cdn.tailwindcss.com'
];

// Install Event
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE).then((cache) => {
        console.log('Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      }),
      caches.open(DYNAMIC_CACHE).then((cache) => {
        console.log('Caching dynamic assets');
        return cache.addAll(DYNAMIC_ASSETS);
      })
    ])
  );
  self.skipWaiting();
});

// Activate Event
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch Event
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Skip chrome-extension and other non-http requests
  if (!url.protocol.startsWith('http')) return;

  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      // Return cached version if available
      if (cachedResponse) {
        console.log('Serving from cache:', request.url);
        return cachedResponse;
      }

      // Otherwise fetch from network
      return fetch(request).then((response) => {
        // Don't cache if not a valid response
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }

        // Clone the response
        const responseToCache = response.clone();

        // Determine which cache to use
        const cacheToUse = STATIC_ASSETS.some(asset => request.url.includes(asset)) 
          ? STATIC_CACHE 
          : DYNAMIC_CACHE;

        // Cache the response
        caches.open(cacheToUse).then((cache) => {
          console.log('Caching new resource:', request.url);
          cache.put(request, responseToCache);
        });

        return response;
      }).catch(() => {
        // If network fails, try to serve from cache
        if (request.destination === 'document') {
          return caches.match('./index.html');
        }
        
        // For other resources, return a fallback
        return new Response('Offline content not available', {
          status: 503,
          statusText: 'Service Unavailable',
          headers: new Headers({
            'Content-Type': 'text/plain'
          })
        });
      });
    })
  );
});

// Background Sync
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    console.log('Background sync triggered');
    event.waitUntil(doBackgroundSync());
  }
});

// Push Notifications
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: './icons/icon-192.png',
      badge: './icons/icon-192.png',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: 1
      },
      actions: [
        {
          action: 'explore',
          title: 'Keşfet',
          icon: './icons/icon-192.png'
        },
        {
          action: 'close',
          title: 'Kapat',
          icon: './icons/icon-192.png'
        }
      ]
    };

    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});

// Notification Click
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('./')
    );
  }
});

// Helper function for background sync
async function doBackgroundSync() {
  // Implement background sync logic here
  console.log('Performing background sync...');
}