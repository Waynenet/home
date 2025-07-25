// 引入 Workbox 库
importScripts('https://gcore.jsdelivr.net/npm/workbox-sw@latest/build/workbox-sw.js');

// ==================== 版本控制配置 ====================
const APP_VERSION = 'v2.1.0';
const CACHE_PREFIX = 'Wayne';

// 设置缓存命名规则
workbox.core.setCacheNameDetails({
  prefix: CACHE_PREFIX,
  suffix: APP_VERSION
});

workbox.core.skipWaiting();
workbox.core.clientsClaim();

// 强制立即接管页面控制权
self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim().then(() => {
    // 激活后立即通知所有页面
    self.clients.matchAll().then(clients => {
      clients.forEach(client => {
        client.postMessage({
          type: 'VERSION_INFO',
          version: APP_VERSION
        });
      });
    });
  }));
});

//监听消息并返回版本号
self.addEventListener('message', (event) => {
  if (event.data.type === 'GET_VERSION') {
    event.source.postMessage({
      type: 'VERSION_INFO',
      version: APP_VERSION // 传递版本号
    });
  }
});

// ==================== 缓存清理逻辑 ====================
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_PREFIX + '-' + APP_VERSION];
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (!cacheWhitelist.some(v => cacheName.includes(v))) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log(`[SW ${APP_VERSION}] 旧缓存清理完成`);
    })
  );
});

// ==================== 预缓存配置 ====================
workbox.precaching.precacheAndRoute([
  { url: '/', revision: APP_VERSION },
  { url: '/index.html', revision: APP_VERSION }
]);

// ==================== 动态缓存策略 ====================

// 1. HTML文档 - 网络优先
workbox.routing.registerRoute(
  ({ request }) => request.destination === 'document',
  new workbox.strategies.NetworkFirst({
    cacheName: `${CACHE_PREFIX}-html-${APP_VERSION}`,
    networkTimeoutSeconds: 2,
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 15,
        maxAgeSeconds: 12 * 60 * 60
      })
    ]
  })
);

// 2. 静态资源 (JS/CSS) - 稳定优先
workbox.routing.registerRoute(
  ({ request }) => ['script', 'style'].includes(request.destination),
  new workbox.strategies.StaleWhileRevalidate({
    cacheName: `${CACHE_PREFIX}-static-${APP_VERSION}`,
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 40,
        maxAgeSeconds: 30 * 24 * 60 * 60
      })
    ]
  })
);

// 3. 图片资源 - 缓存优先
workbox.routing.registerRoute(
  ({ request }) => request.destination === 'image',
  new workbox.strategies.CacheFirst({
    cacheName: `${CACHE_PREFIX}-images-${APP_VERSION}`,
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 60,
        maxAgeSeconds: 60 * 24 * 60 * 60,
        maxSizeBytes: 10 * 1024 * 1024 // 10MB限制
      })
    ]
  })
);

// 4. CDN 资源缓存
workbox.routing.registerRoute(
  /^https:\/\/gcore\.jsdelivr\.net/,
  new workbox.strategies.CacheFirst({
    cacheName: `${CACHE_PREFIX}-cdn-${APP_VERSION}`,
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 30,
        maxAgeSeconds: 60 * 24 * 60 * 60,
        maxSizeBytes: 5 * 1024 * 1024 // 5MB限制
      })
    ]
  })
);

// ==================== 调试信息 ====================
console.log(`[Service Worker ${APP_VERSION}] 已激活`);

//控制台输出
// console.clear();
let styleTitle1 = `
font-size: 20px;
font-weight: 600;
color: rgb(244,167,89);
`
let styleTitle2 = `
font-size:16px;
color: rgb(244,167,89);
`
let styleContent = `
color: rgb(30,152,255);
`
let title1 = 'WayneのHome'
let title2 = `
==============================
#   #    #   #   # #   # #####
#   #   # #   # #  ##  # #
# # #  #####   #   # # # #####
## ##  #   #   #   #  ## #
#   #  #   #   #   #   # #####
==============================
`
let content = `
版 本 号: ${APP_VERSION}
更新日期: 2025-07-25

主页:  https://home.3301.qzz.io
Github:  https://github.com/Waynenet/home
`
console.log(`%c${title1} %c${title2}
%c${content}`, styleTitle1, styleTitle2, styleContent)