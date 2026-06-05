const CACHE_NAME = 'disaster-copilot-v1';

// These are the core files the app will save for offline use
const ASSETS = [
    './',
    './index.html',
    './styles.css',
    './app.js',
    'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
    'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
];

// Install event: cache all vital assets
self.addEventListener('install', (e) => {
    e.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('Opened cache');
            return cache.addAll(ASSETS);
        })
    );
});

// Fetch event: Serve from cache if offline
self.addEventListener('fetch', (e) => {
    e.respondWith(
        caches.match(e.request).then((response) => {
            // Return cached version if found, else fetch from network
            return response || fetch(e.request).catch(() => {
                // If both cache and network fail (user is fully offline), 
                // return the main dashboard page so the app doesn't crash.
                if (e.request.destination === 'document') {
                    return caches.match('./index.html');
                }
            });
        })
    );
});

// Activate event: Clean up old caches if we update the app version
self.addEventListener('activate', (e) => {
    e.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        console.log('Clearing old cache');
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
});
