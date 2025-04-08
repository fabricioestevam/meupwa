const CACHE_NAME = 'meu-pwa-cache-v1';
const URLS_TO_CACHE = [
  '/',
  '/index.html',
  '/style.css',
  '/script.js',
  '/manifest.json',
  '/favicon.ico',
  '/img/exemplo.jpg',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
];

// Instala e adiciona arquivos ao cache
self.addEventListener('install', event => {
  console.log('[Service Worker] Instalando...');
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('[Service Worker] Arquivos em cache');
      return cache.addAll(URLS_TO_CACHE);
    })
  );
});

// Ativa e limpa caches antigos se houver
self.addEventListener('activate', event => {
  console.log('[Service Worker] Ativando...');
  event.waitUntil(
    caches.keys().then(cacheNames =>
      Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log('[Service Worker] Deletando cache antigo:', cache);
            return caches.delete(cache);
          }
        })
      )
    )
  );
});

// Intercepta requisições e responde do cache ou da internet
self.addEventListener('fetch', event => {
  console.log('[Service Worker] Interceptando requisição:', event.request.url);
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response; // Serve do cache
        }
        return fetch(event.request); // Busca online
      })
  );
});
