// N-Toki service worker: keeps the clock working offline. Bump VERSION on every release.
const VERSION = 'n-toki-v2.3.0';
const SHELL = ['./', 'index.html', 'wallpaper.html', 'wallpaper-dark.html', 'manifest.webmanifest', 'icons/icon-192.png', 'icons/icon-512.png', 'fonts/shippori-mincho-latin-500-normal.woff2', 'fonts/shippori-mincho-latin-700-normal.woff2', 'fonts/shippori-mincho-cjk-500.woff2', 'fonts/shippori-mincho-cjk-700.woff2', 'fonts/zen-kaku-gothic-new-latin-400-normal.woff2', 'fonts/zen-kaku-gothic-new-latin-500-normal.woff2', 'fonts/zen-kaku-gothic-new-latin-700-normal.woff2', 'fonts/ibm-plex-mono-latin-400-normal.woff2', 'fonts/ibm-plex-mono-latin-500-normal.woff2'];
self.addEventListener('install', e => { e.waitUntil(caches.open(VERSION).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin === location.origin) {
    // App files: network first so updates land, cache as the offline fallback.
    e.respondWith(fetch(req).then(res => { const copy = res.clone(); caches.open(VERSION).then(c => c.put(req, copy)); return res; }).catch(() => caches.match(req).then(r => r || caches.match('index.html'))));
  }
});
