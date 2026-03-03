const CACHE_NAME = 'resqmap-v1'
const STATIC_ASSETS = [
  '/',
  '/offline.html',
  '/icon-192x192.png',
  '/styles/globals.css',
]

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS)
    })
  )
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => cacheName !== CACHE_NAME)
          .map((cacheName) => caches.delete(cacheName))
      )
    })
  )
})

// Fetch event - cache first, then network
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return
  }

  // Skip API calls - use network first for APIs
  if (event.request.url.includes('/api/')) {
    event.respondWith(
      fetch(event.request)
        .then((response) => response)
        .catch(() => new Response(JSON.stringify({ error: 'offline' }), { status: 503 }))
    )
    return
  }

  // Cache first strategy for static assets
  event.respondWith(
    caches
      .match(event.request)
      .then((response) => {
        if (response) {
          return response
        }

        return fetch(event.request).then((response) => {
          // Cache successful responses
          if (response && response.status === 200 && response.type === 'basic') {
            const responseToCache = response.clone()
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache)
            })
          }
          return response
        })
      })
      .catch(() => {
        // Return offline page for navigation requests
        if (event.request.mode === 'navigate') {
          return caches.match('/offline.html')
        }
        return new Response('Offline', { status: 503 })
      })
  )
})

// Handle push notifications
self.addEventListener('push', (event) => {
  const options = {
    body: event.data?.text() || 'ResQMap notification',
    icon: '/icon-192x192.png',
    badge: '/icon-192x192.png',
  }

  event.waitUntil(
    self.registration.showNotification('ResQMap', options)
  )
})
