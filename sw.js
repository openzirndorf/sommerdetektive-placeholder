/* Kill-Switch für den Service Worker der früheren Sommerdetektive-App.
   Die App war eine PWA (vite-plugin-pwa/Workbox), die sich selbst komplett
   vorab gecacht hat. Nach dem DNS-Umzug auf diese statische Seite würden
   wiederkehrende Besucher und installierte Home-Bildschirm-Apps sonst
   weiter die alte App aus dem Cache sehen. Der Browser prüft bei jedem
   Aufruf /sw.js auf Updates, findet diese Datei, und sie räumt auf:
   alle Caches löschen, sich selbst abmelden, offene Tabs neu laden.
   localStorage (Spielstand) bleibt unberührt. */
self.addEventListener("install", () => self.skipWaiting());

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.map((key) => caches.delete(key)));
      await self.registration.unregister();
      const clients = await self.clients.matchAll({ type: "window" });
      clients.forEach((client) => client.navigate(client.url));
    })()
  );
});
