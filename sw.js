// 生词本 service worker：网络优先，保证手机端更新即时可见；断网时回退到缓存。
const CACHE = "ielts-vocab-v1";

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  // 只处理本站资源；Supabase CDN / API 等跨域请求交给浏览器默认行为
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  // 强制走网络（no-store），绕开 GitHub Pages 的 10 分钟缓存
  const fresh = new Request(req, { cache: "no-store" });
  event.respondWith(
    fetch(fresh)
      .then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {});
        return res;
      })
      .catch(() => caches.match(req))
  );
});
