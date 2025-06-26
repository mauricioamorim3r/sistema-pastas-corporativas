// sw.js
const CACHE_NAME = 'pastas-corporativas-v1';
const STATIC_CACHE_NAME = 'static-v1';
const DYNAMIC_CACHE_NAME = 'dynamic-v1';

// Arquivos essenciais para cache estático
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/index.tsx',
  '/index.css',
  '/App.tsx',
  '/manifest.json',
  '/launcher.html'
];

// Arquivos que mudam frequentemente
const DYNAMIC_ASSETS = [
  '/api/',
  '/data/'
];

// Estratégia de cache por tipo de recurso
const CACHE_STRATEGIES = {
  images: 'cache-first',
  scripts: 'stale-while-revalidate',
  styles: 'stale-while-revalidate',
  documents: 'network-first',
  api: 'network-first'
};

// Instalação do Service Worker
self.addEventListener('install', (event) => {
  console.log('ServiceWorker: Installing new version...');
  
  event.waitUntil(
    Promise.all([
      // Cache estático
      caches.open(STATIC_CACHE_NAME).then(cache => {
        console.log('ServiceWorker: Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      }),
      
      // Forçar ativação
      self.skipWaiting()
    ])
  );
});

// Ativação do Service Worker
self.addEventListener('activate', (event) => {
  console.log('ServiceWorker: Activating new version...');
  
  event.waitUntil(
    Promise.all([
      // Limpar caches antigos
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== STATIC_CACHE_NAME && 
                cacheName !== DYNAMIC_CACHE_NAME && 
                cacheName !== CACHE_NAME) {
              console.log('ServiceWorker: Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      
      // Tomar controle de todos os clientes
      self.clients.claim()
    ])
  );
});

// Interceptação de requests com estratégias inteligentes
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Não interceptar extensões do Chrome
  if (url.protocol === 'chrome-extension:') {
    return;
  }
  
  // Determinar estratégia baseada no tipo de recurso
  const strategy = getStrategyForRequest(request);
  
  event.respondWith(
    executeStrategy(strategy, request)
  );
});

// Determinar estratégia de cache baseada no request
function getStrategyForRequest(request) {
  const url = new URL(request.url);
  const pathname = url.pathname;
  
  // Imagens
  if (pathname.match(/\.(jpg|jpeg|png|gif|webp|svg|ico)$/i)) {
    return 'cache-first';
  }
  
  // Scripts e estilos
  if (pathname.match(/\.(js|css)$/i)) {
    return 'stale-while-revalidate';
  }
  
  // API calls
  if (pathname.startsWith('/api/') || pathname.includes('vercel') || pathname.includes('api')) {
    return 'network-first';
  }
  
  // HTML e documentos
  if (request.headers.get('accept')?.includes('text/html') || pathname.endsWith('.html')) {
    return 'network-first';
  }
  
  // Recursos estáticos
  if (STATIC_ASSETS.some(asset => pathname.includes(asset))) {
    return 'cache-first';
  }
  
  // Default
  return 'stale-while-revalidate';
}

// Executar estratégia de cache
async function executeStrategy(strategy, request) {
  const cacheName = strategy === 'cache-first' ? STATIC_CACHE_NAME : DYNAMIC_CACHE_NAME;
  
  switch (strategy) {
    case 'cache-first':
      return cacheFirst(request, cacheName);
    
    case 'network-first':
      return networkFirst(request, cacheName);
    
    case 'stale-while-revalidate':
      return staleWhileRevalidate(request, cacheName);
    
    default:
      return fetch(request);
  }
}

// Estratégia Cache First
async function cacheFirst(request, cacheName) {
  try {
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('ServiceWorker: Cache first failed:', error);
    return new Response('Offline - Resource not available', { status: 503 });
  }
}

// Estratégia Network First
async function networkFirst(request, cacheName) {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('ServiceWorker: Network first fallback to cache');
    const cache = await caches.open(cacheName);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    return new Response('Offline - Network unavailable', { status: 503 });
  }
}

// Estratégia Stale While Revalidate
async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cachedResponse = await cache.match(request);
  
  // Fetch em background para atualizar cache
  const fetchPromise = fetch(request).then(networkResponse => {
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  }).catch(error => {
    console.log('ServiceWorker: Background fetch failed:', error);
  });
  
  // Retornar cache imediatamente se disponível, senão aguardar network
  return cachedResponse || fetchPromise;
}

// Background Sync para quando voltar online
self.addEventListener('sync', (event) => {
  console.log('ServiceWorker: Background sync triggered');
  
  if (event.tag === 'background-sync') {
    event.waitUntil(
      // Sincronizar dados pendentes quando voltar online
      syncPendingData()
    );
  }
});

// Sincronizar dados pendentes
async function syncPendingData() {
  try {
    // Verificar se há dados pendentes no IndexedDB
    const pendingData = await getPendingData();
    
    if (pendingData.length > 0) {
      for (const data of pendingData) {
        await syncData(data);
      }
      
      // Notificar clientes sobre sincronização
      self.clients.matchAll().then(clients => {
        clients.forEach(client => {
          client.postMessage({
            type: 'SYNC_COMPLETE',
            data: { synced: pendingData.length }
          });
        });
      });
    }
  } catch (error) {
    console.error('ServiceWorker: Sync failed:', error);
  }
}

// Funções auxiliares para sincronização
async function getPendingData() {
  // Implementar busca de dados pendentes no IndexedDB
  return [];
}

async function syncData(data) {
  // Implementar sincronização de dados específicos
  return true;
}

// Notificações Push (preparado para futuro)
self.addEventListener('push', (event) => {
  console.log('ServiceWorker: Push notification received');
  
  const options = {
    body: event.data ? event.data.text() : 'Nova notificação',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-192x192.png',
    tag: 'pastas-notification',
    actions: [
      {
        action: 'open',
        title: 'Abrir App'
      },
      {
        action: 'close',
        title: 'Fechar'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('Sistema de Pastas', options)
  );
});

// Manipular cliques em notificações
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  if (event.action === 'open' || !event.action) {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Limpeza periódica de cache
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'CLEAN_CACHE') {
    event.waitUntil(cleanOldCache());
  }
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Limpar cache antigo
async function cleanOldCache() {
  const cacheNames = await caches.keys();
  const oldCaches = cacheNames.filter(name => 
    !name.includes(STATIC_CACHE_NAME) && 
    !name.includes(DYNAMIC_CACHE_NAME) &&
    !name.includes(CACHE_NAME)
  );
  
  return Promise.all(
    oldCaches.map(cacheName => caches.delete(cacheName))
  );
}
