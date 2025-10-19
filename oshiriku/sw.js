// 極めて簡単なオフライン対応
const CACHE_NAME = 'pwa-redirect-v1';
const ASSETS = [
'/',
'/index.html',
'/offline.html',
'/manifest.webmanifest'
];


self.addEventListener('install', (event) => {
event.waitUntil(
caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
);
});


self.addEventListener('activate', (event) => {
event.waitUntil(
caches.keys().then((keys) => Promise.all(
keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k))
))
);
});


self.addEventListener('fetch', (event) => {
const req = event.request;
// 自サイトへのリクエストのみキャッシュ戦略
if (new URL(req.url).origin === self.location.origin) {
event.respondWith(
caches.match(req).then((res) => {
return res || fetch(req).catch(() => caches.match('/offline.html'));
})
);
}
// 外部はスルー（ブラウザ既定の動作に任せる）
});
