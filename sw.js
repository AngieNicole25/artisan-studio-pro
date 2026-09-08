const CACHE_NAME = 'artisan-studio-v2';

const BASE_PATH = '/artisan-studio-pro/';

const ASSETS_TO_CACHE = [
    BASE_PATH,
    `${BASE_PATH}index.html`,
    `${BASE_PATH}style.css`,
    `${BASE_PATH}site.webmanifest`,
    `${BASE_PATH}favicon-16x16.png`,
    `${BASE_PATH}favicon-32x32.png`,
    `${BASE_PATH}apple-touch-icon.png`
];

// Instalación del Service Worker
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.addAll(ASSETS_TO_CACHE))
            .catch((error) => {
                console.error(
                    'Error al guardar archivos en caché:',
                    error
                );
            })
    );

    self.skipWaiting();
});

// Activación y limpieza de cachés antiguas
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys()
            .then((keys) => {
                return Promise.all(
                    keys.map((key) => {
                        if (key !== CACHE_NAME) {
                            return caches.delete(key);
                        }

                        return null;
                    })
                );
            })
            .then(() => self.clients.claim())
    );
});

// Interceptación de solicitudes
self.addEventListener('fetch', (event) => {

    // No interferir con Firebase ni APIs externas
    if (
        event.request.url.includes('firebase') ||
        event.request.url.includes('googleapis') ||
        event.request.url.includes('restcountries')
    ) {
        return;
    }

    event.respondWith(
        fetch(event.request)
            .catch(() => caches.match(event.request))
    );
});