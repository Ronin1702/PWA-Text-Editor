const { offlineFallback, warmStrategyCache } = require('workbox-recipes');
const { CacheFirst, StaleWhileRevalidate } = require('workbox-strategies');
const { registerRoute } = require('workbox-routing');
const { CacheableResponsePlugin } = require('workbox-cacheable-response');
const { ExpirationPlugin } = require('workbox-expiration');
const { precacheAndRoute } = require('workbox-precaching/precacheAndRoute');

precacheAndRoute(self.__WB_MANIFEST);

const pageCache = new CacheFirst({
  cacheName: 'page-cache',
  plugins: [
    new CacheableResponsePlugin({
      // Cache only 200 responses.
      statuses: [0, 200],
    }),
    new ExpirationPlugin({

      // 60 pages max in cache
      maxEntries: 60,

      // 30 days x 24 hours x 60 minutes x 60 seconds
      maxAgeSeconds: 30 * 24 * 60 * 60,
    }),
  ],
});

// Use StableWhileRevalidate to shorten response times by immediately returning cached responses while updating the cache in the background
const assetCache = new StaleWhileRevalidate({
  cacheName: 'asset-cache',
  plugins: [
    new CacheableResponsePlugin({

      // Cache 0 and  200 responses.
      statuses: [0, 200],
    }),
    new ExpirationPlugin({

      // 20 max cache for each asset
      maxEntries: 20,

      // 7 days x 24 hours x 60 minutes x 60 seconds
      maxAgeSeconds: 7 * 24 * 60 * 60,
    }),
  ],
});

// warmStrategyCache will 'warm' the page by fetch the URLs and store them in the cache
warmStrategyCache({
  urls: ['../index.html', './src/images/logo.png', './src/css/style.css', '../favicon.ico'],
  strategy: pageCache,
});

// Implement CacheFirst strategy with pageCache configuration by requesting mode 'navigate', a mode for pages.
registerRoute(({ request }) => request.mode === 'navigate', pageCache);

// Implement asset caching by pointing to the asset destination by requesting destination by asset types.
registerRoute(
  ({ request }) =>
    request.destination === 'script' ||
    request.destination === 'style' ||
    request.destination === 'image' ||
    request.destination === 'font',

  // If there's a type that matches the destination, use the StableWhileRevalidate strategy with assetCache configuration above
  assetCache
);

// offlineFallback will return the index.html page if a page is not found in the cache
offlineFallback({ pageFallback: './index.html' });
