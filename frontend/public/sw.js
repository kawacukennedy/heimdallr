// Service Worker for Heimdallr PWA
// Let browser handle fonts natively - no blocking

const CACHE_NAME = 'heimdallr-v4';

self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) =>
            Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
        )
    );
    self.clients.claim();
});

self.addEventListener('fetch', (event) => {
    const { request } = event;
    
    // Skip non-GET requests
    if (request.method !== 'GET') return;

    // Let browser handle everything - we don't want to block fonts
    event.respondWith(fetch(request).catch(() => caches.match(request)));
});
