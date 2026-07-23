const CACHE_NAME = 'artisan-studio-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  'manifest.json'
];

// Instalación del Service Worker y almacenamiento en caché inicial
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Activación y limpieza de cachés antiguas
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Interceptación de solicitudes de red (Estrategia Network First con respaldo en caché)
self.addEventListener('fetch', (event) => {
  // Omitimos peticiones a Firebase o APIs externas para evitar errores de caché en autenticación/datos
  if (event.request.url.includes('firebase') || event.request.url.includes('googleapis') || event.request.url.includes('restcountries')) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .catch(() => {
        return caches.match(event.request);
      })
  );
});