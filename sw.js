const CACHE="echobound-vslice-2";
const SHELL=["./","./index.html","./manifest.webmanifest","./styles/echobound-ui.css","./styles/game.css","./js/app.js","./js/engine.js","./js/data.js","./assets/app-icon.svg","./assets/echobound-logo.svg","./assets/ui-icons.svg","./assets/boss-icons.svg","./assets/creatures.svg"];
self.addEventListener("install",event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(SHELL)).then(()=>self.skipWaiting())));
self.addEventListener("activate",event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener("fetch",event=>{if(event.request.method!=="GET")return;event.respondWith(fetch(event.request).then(response=>{const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(event.request,copy));return response}).catch(()=>caches.match(event.request).then(hit=>hit||caches.match("./index.html"))))});
