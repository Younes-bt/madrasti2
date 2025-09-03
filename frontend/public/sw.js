/**
 * Service Worker for Madrasti 2.0 PWA
 * Handles offline functionality, background sync, and push notifications
 */

const CACHE_NAME = 'madrasti-v1.0.0';
const OFFLINE_PAGE = '/offline.html';

// Static assets to cache immediately
const STATIC_ASSETS = [
  '/',
  '/offline.html',
  '/manifest.json',
  '/static/js/bundle.js',
  '/static/css/main.css',
  // Add other critical assets
];

// API endpoints to cache
const API_CACHE_PATTERNS = [
  /^https?:\/\/.*\/api\/users\/profile\//,
  /^https?:\/\/.*\/api\/schools\//,
  /^https?:\/\/.*\/api\/homework\/assignments\//,
  /^https?:\/\/.*\/api\/attendance\//,
  /^https?:\/\/.*\/api\/lessons\//
];

// Background sync tag names
const SYNC_TAGS = {
  ATTENDANCE: 'background-sync-attendance',
  ASSIGNMENT: 'background-sync-assignment',
  NOTIFICATION: 'background-sync-notification'
};

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('🔧 Service Worker installing...');
  
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('📦 Caching static assets...');
      return cache.addAll(STATIC_ASSETS);
    }).then(() => {
      console.log('✅ Service Worker installation complete');
      // Skip waiting to activate immediately
      return self.skipWaiting();
    }).catch((error) => {
      console.error('❌ Service Worker installation failed:', error);
    })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('🚀 Service Worker activating...');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('🗑️ Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('✅ Service Worker activation complete');
      // Claim all clients immediately
      return self.clients.claim();
    })
  );
});

// Fetch event - handle network requests with caching strategy
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const { url, method } = request;

  // Skip non-GET requests for caching
  if (method !== 'GET') {
    return;
  }

  // Handle different types of requests with appropriate strategies
  if (isApiRequest(url)) {
    // API requests - Network first, cache fallback
    event.respondWith(networkFirstStrategy(request));
  } else if (isStaticAsset(url)) {
    // Static assets - Cache first, network fallback
    event.respondWith(cacheFirstStrategy(request));
  } else if (isNavigationRequest(request)) {
    // Navigation requests - Network first with offline page fallback
    event.respondWith(navigationStrategy(request));
  } else {
    // Other requests - Network only
    event.respondWith(fetch(request));
  }
});

// Background sync event
self.addEventListener('sync', (event) => {
  console.log('🔄 Background sync triggered:', event.tag);
  
  switch (event.tag) {
    case SYNC_TAGS.ATTENDANCE:
      event.waitUntil(syncAttendanceData());
      break;
    case SYNC_TAGS.ASSIGNMENT:
      event.waitUntil(syncAssignmentData());
      break;
    case SYNC_TAGS.NOTIFICATION:
      event.waitUntil(syncNotificationData());
      break;
    default:
      console.log('🤷 Unknown sync tag:', event.tag);
  }
});

// Push notification event
self.addEventListener('push', (event) => {
  console.log('🔔 Push notification received');
  
  let notificationData = {};
  
  if (event.data) {
    try {
      notificationData = event.data.json();
    } catch (error) {
      console.error('❌ Error parsing push data:', error);
      notificationData = {
        title: 'Madrasti Notification',
        body: event.data.text() || 'You have a new notification',
        icon: '/icons/icon-192x192.png',
        badge: '/icons/badge-72x72.png'
      };
    }
  }

  const {
    title = 'Madrasti Notification',
    body = 'You have a new notification',
    icon = '/icons/icon-192x192.png',
    badge = '/icons/badge-72x72.png',
    tag = 'madrasti-notification',
    url = '/',
    actions = [],
    data = {}
  } = notificationData;

  const notificationOptions = {
    body,
    icon,
    badge,
    tag,
    data: { url, ...data },
    actions: actions.map(action => ({
      action: action.action,
      title: action.title,
      icon: action.icon || '/icons/action-default.png'
    })),
    vibrate: [200, 100, 200],
    requireInteraction: notificationData.priority === 'high',
    silent: notificationData.priority === 'low'
  };

  event.waitUntil(
    self.registration.showNotification(title, notificationOptions)
  );
});

// Notification click event
self.addEventListener('notificationclick', (event) => {
  console.log('🖱️ Notification clicked:', event.notification.tag);
  
  event.notification.close();
  
  const { url = '/', action } = event.notification.data;
  
  // Handle notification actions
  if (event.action) {
    handleNotificationAction(event.action, event.notification.data);
    return;
  }
  
  // Open the app or focus existing window
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      // Check if app is already open
      for (const client of clientList) {
        if (client.url.includes(url) && 'focus' in client) {
          return client.focus();
        }
      }
      
      // Open new window if no matching client found
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});

// Message event - handle messages from main thread
self.addEventListener('message', (event) => {
  const { type, data } = event.data;
  
  console.log('📨 Service Worker received message:', type);
  
  switch (type) {
    case 'SKIP_WAITING':
      self.skipWaiting();
      break;
    case 'CACHE_ATTENDANCE_DATA':
      cacheAttendanceData(data);
      break;
    case 'SYNC_WHEN_ONLINE':
      registerBackgroundSync(data.tag, data.data);
      break;
    case 'CLEAR_CACHE':
      clearCache(data.cacheName);
      break;
    default:
      console.log('🤷 Unknown message type:', type);
  }
});

// Caching strategies
async function networkFirstStrategy(request) {
  try {
    const networkResponse = await fetch(request);
    
    // Cache successful responses
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('🌐 Network failed, trying cache:', request.url);
    const cachedResponse = await caches.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return offline response for API requests
    return new Response(
      JSON.stringify({
        error: 'Network unavailable',
        offline: true,
        timestamp: Date.now()
      }),
      {
        status: 503,
        statusText: 'Service Unavailable',
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

async function cacheFirstStrategy(request) {
  const cachedResponse = await caches.match(request);
  
  if (cachedResponse) {
    // Update cache in background if needed
    fetch(request).then((networkResponse) => {
      if (networkResponse.ok) {
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(request, networkResponse);
        });
      }
    }).catch(() => {
      // Ignore network errors for background updates
    });
    
    return cachedResponse;
  }
  
  // Fallback to network if not in cache
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.error('❌ Both cache and network failed for:', request.url);
    throw error;
  }
}

async function navigationStrategy(request) {
  try {
    const networkResponse = await fetch(request);
    return networkResponse;
  } catch (error) {
    console.log('🌐 Navigation network failed, serving offline page');
    const offlineResponse = await caches.match(OFFLINE_PAGE);
    return offlineResponse || new Response('Offline - Please check your connection');
  }
}

// Utility functions
function isApiRequest(url) {
  return API_CACHE_PATTERNS.some(pattern => pattern.test(url));
}

function isStaticAsset(url) {
  return url.includes('/static/') || 
         url.includes('/assets/') || 
         url.includes('/icons/') ||
         url.includes('.css') ||
         url.includes('.js') ||
         url.includes('.png') ||
         url.includes('.jpg') ||
         url.includes('.svg');
}

function isNavigationRequest(request) {
  return request.mode === 'navigate';
}

// Background sync functions
async function syncAttendanceData() {
  console.log('📍 Syncing attendance data...');
  
  try {
    // Get pending attendance data from IndexedDB
    const pendingData = await getPendingData('attendance');
    
    for (const item of pendingData) {
      try {
        const response = await fetch('/api/attendance/records/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${item.token}`
          },
          body: JSON.stringify(item.data)
        });
        
        if (response.ok) {
          await removePendingData('attendance', item.id);
          console.log('✅ Attendance data synced:', item.id);
        }
      } catch (error) {
        console.error('❌ Failed to sync attendance item:', error);
      }
    }
  } catch (error) {
    console.error('❌ Background sync failed:', error);
  }
}

async function syncAssignmentData() {
  console.log('📝 Syncing assignment data...');
  
  try {
    const pendingData = await getPendingData('assignments');
    
    for (const item of pendingData) {
      try {
        const response = await fetch('/api/homework/submissions/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${item.token}`
          },
          body: JSON.stringify(item.data)
        });
        
        if (response.ok) {
          await removePendingData('assignments', item.id);
          console.log('✅ Assignment data synced:', item.id);
        }
      } catch (error) {
        console.error('❌ Failed to sync assignment item:', error);
      }
    }
  } catch (error) {
    console.error('❌ Assignment sync failed:', error);
  }
}

async function syncNotificationData() {
  console.log('🔔 Syncing notification data...');
  // Implementation for notification sync
}

async function handleNotificationAction(action, data) {
  console.log('🎬 Handling notification action:', action);
  
  switch (action) {
    case 'view':
      clients.openWindow(data.url);
      break;
    case 'dismiss':
      // Just close the notification
      break;
    case 'mark_read':
      // Send request to mark notification as read
      fetch('/api/notifications/mark-read/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${data.token}`
        },
        body: JSON.stringify({ notification_id: data.id })
      }).catch(console.error);
      break;
    default:
      console.log('🤷 Unknown action:', action);
  }
}

// IndexedDB helpers for offline data storage
async function getPendingData(type) {
  // Implementation for retrieving pending sync data
  return [];
}

async function removePendingData(type, id) {
  // Implementation for removing synced data
}

async function cacheAttendanceData(data) {
  // Implementation for caching attendance data
}

async function registerBackgroundSync(tag, data) {
  try {
    await self.registration.sync.register(tag);
    console.log('✅ Background sync registered:', tag);
  } catch (error) {
    console.error('❌ Background sync registration failed:', error);
  }
}

async function clearCache(cacheName = CACHE_NAME) {
  try {
    await caches.delete(cacheName);
    console.log('✅ Cache cleared:', cacheName);
  } catch (error) {
    console.error('❌ Cache clearing failed:', error);
  }
}

console.log('🎉 Madrasti Service Worker loaded successfully!');