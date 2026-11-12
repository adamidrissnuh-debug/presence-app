/*
 * Le service worker de la page du Cercle : l'interface s'ouvre même sans connexion.
 * Construit par vite.cercle.config.ts, qui remplace la version et la liste des fichiers.
 * Il ne touche jamais aux requêtes vers le relais (une autre origine) : les messages ne passent pas par lui.
 */
const VERSION = "cercle-b83129d4b99c";
const FICHIERS = ["./","./index.html","./apple-touch-icon.png","./icone-192.png","./icone-512.png","./icone.svg","./manifest.webmanifest","./assets/index-CzdvJ2YE.js","./assets/index-iXjd1RgP.css"];

self.addEventListener('install', (ev) => {
  ev.waitUntil(caches.open(VERSION).then((c) => c.addAll(FICHIERS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (ev) => {
  ev.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== VERSION).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});

self.addEventListener('fetch', (ev) => {
  const r = ev.request;
  if (r.method !== 'GET' || new URL(r.url).origin !== self.location.origin) return; // le relais : jamais en cache
  if (r.mode === 'navigate') {
    // la page elle-même : la dernière version si le réseau répond, sinon celle gardée
    ev.respondWith(fetch(r).catch(() => caches.match('./index.html', { ignoreSearch: true })));
    return;
  }
  ev.respondWith(caches.match(r, { ignoreSearch: true }).then((x) => x || fetch(r)));
});
