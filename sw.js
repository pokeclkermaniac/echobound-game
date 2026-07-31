const CACHE="echobound-vslice-3";
const CHARACTER_ASSETS=[
  "bop-idle","bop-bonk","bop-guard","bop-hurt",
  "crumbler-idle","crumbler-brace","crumbler-attack","crumbler-hurt",
  "syrup-slug-idle","syrup-slug-sticky","syrup-slug-attack","syrup-slug-hurt",
  "springbean-idle","springbean-coil","springbean-sky-drop","springbean-hurt",
  "king-squashbuckler-idle","king-squashbuckler-wallop","king-squashbuckler-cannonade","king-squashbuckler-defeat"
].map(name=>`./assets/characters/production/${name}.png`);
const SHELL=["./","./index.html","./manifest.webmanifest","./styles/echobound-ui.css","./styles/game.css","./js/app.js","./js/engine.js","./js/data.js","./assets/app-icon.svg","./assets/echobound-logo.svg","./assets/ui-icons.svg","./assets/boss-icons.svg","./assets/creatures.svg",...CHARACTER_ASSETS];
self.addEventListener("install",event=>event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(SHELL)).then(()=>self.skipWaiting())));
self.addEventListener("activate",event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener("fetch",event=>{if(event.request.method!=="GET")return;event.respondWith(fetch(event.request).then(response=>{const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(event.request,copy));return response}).catch(()=>caches.match(event.request).then(hit=>hit||caches.match("./index.html"))))});
