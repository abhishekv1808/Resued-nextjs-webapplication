const CACHE_NAME = 'reused-static-v1';
const ASSETS_TO_CACHE = [
    '/output.css',
    '/js/layout.js',
    '/js/wishlist.js',
    '/images/Reused-logo.svg',
    'https://cdn.jsdelivr.net/npm/remixicon@4.1.0/fonts/remixicon.css'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

self.addEventListener('fetch', (event) => {
    if (event.request.method !== 'GET') return;

    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) {
                return cachedResponse;
            }

            return fetch(event.request).then((response) => {
                // Don't cache non-successful responses or non-static assets
                if (!response || response.status !== 200 || response.type !== 'basic') {
                    return response;
                }

                // Cache static assets on the fly
                const url = new URL(event.request.url);
                if (url.pathname.startsWith('/js/') || url.pathname.startsWith('/images/') || url.pathname.endsWith('.css')) {
                    const responseToCache = response.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, responseToCache);
                    });
                }

                return response;
            });
        })
    );
});

// Existing Push Notification Logic
self.addEventListener('push', function (event) {
    const data = event.data.json();
    console.log('Push received:', data);

    const options = {
        body: data.body,
        icon: data.icon || '/images/Reused-logo.svg',
        image: data.image, // Large banner image
        badge: '/images/Reused-logo.svg',
        data: {
            url: data.url || '/'
        },
        actions: data.actions || [] // Action buttons
    };

    event.waitUntil(
        self.registration.showNotification(data.title, options)
    );
});

self.addEventListener('notificationclick', function (event) {
    event.notification.close();

    let urlToOpen = event.notification.data.url;

    // Check if an action button was clicked
    if (event.action) {
        // The action ID is the URL itself in our implementation
        urlToOpen = event.action;
    }

    event.waitUntil(
        clients.openWindow(urlToOpen)
    );
});
