// オフライン用：一度開いたら通信なしでも起動できるようにする
const CACHE='mutenjan-app-1.3.1';
const FILES=['./','./index.html','./manifest.json','./icon-192.png','./icon-512.png','./icon-maskable-512.png','./apple-touch-icon.png','./favicon-32.png'];
self.addEventListener('install',e=>{ e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting())); });
self.addEventListener('activate',e=>{ e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())); });
self.addEventListener('fetch',e=>{
  const r=e.request; if(r.method!=='GET'||new URL(r.url).origin!==location.origin) return;
  if(r.mode==='navigate'){ // 本体：新しい版があれば取得、なければ保存分
    e.respondWith(fetch(r).then(res=>{ const cp=res.clone(); caches.open(CACHE).then(c=>c.put('./index.html',cp)); return res; }).catch(()=>caches.match('./index.html').then(x=>x||caches.match('./'))));
    return; }
  e.respondWith(caches.match(r).then(x=>x||fetch(r)));
});
