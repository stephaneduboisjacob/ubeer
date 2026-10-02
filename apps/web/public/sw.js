const CACHE = "ubeer-shell-v2";
const SHELL = ["/", "/manifest.webmanifest", "/ubeer-icon.svg", "/icons/ubeer-192.png", "/icons/ubeer-512.png", "/images/hero-delivery.webp", "/images/heineken-six-pack.webp", "/images/waitlist-neighbourhood.webp", "/images/driver-montreal.webp", "/images/delivery-confirmed.webp"];
self.addEventListener("install", (event) => event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(SHELL))));
self.addEventListener("activate", (event) => event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))))));
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  if (event.request.method !== "GET" || url.origin !== self.location.origin || url.pathname.startsWith("/api/")) return;
  event.respondWith(fetch(event.request).catch(() => caches.match(event.request).then((cached) => cached || caches.match("/"))));
});
