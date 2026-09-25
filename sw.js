const CACHE_NAME = 'smart-wallet-v1';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  'https://cdn.jsdelivr.net/npm/chart.js' // تخزين مكتبة الرسوم البيانية لتعمل بدون نت
];

// تثبيت ملفات التطبيق في الكاش
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('تم تخزين الملفات بنجاح');
        return cache.addAll(urlsToCache);
      })
  );
});

// جلب الملفات من الكاش عند انقطاع النت
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // إرجاع النسخة المخزنة إذا وجدت، أو محاولة جلبها من النت
        return response || fetch(event.request);
      })
  );
});

// تنظيف الكاش القديم عند تحديث التطبيق
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
