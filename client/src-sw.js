// Required modules
const { offlineFallback, warmStrategyCache } = require('workbox-recipes');
const { CacheFirst, StaleWhileRevalidate } = require('workbox-strategies');
const { registerRoute } = require('workbox-routing');
const { CacheableResponsePlugin } = require('workbox-cacheable-response');
const { ExpirationPlugin } = require('workbox-expiration');
const { precacheAndRoute } = require('workbox-precaching/precacheAndRoute');

// Precache all the assets in the build folder
precacheAndRoute(self.__WB_MANIFEST);

// Cache strategy using CacheFirst to cache pages
const pageCache = new CacheFirst({
  cacheName: 'page-cache',
  plugins: [
    new CacheableResponsePlugin({
      // Cache 0 (dev Browser-base API response) and  200 (Request OK) responses.
      statuses: [0, 200],
    }),
    new ExpirationPlugin({

      // 60 cache entries max
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

// warmStrategyCache will 'warm up' the page by fetching the URLs and store them in the cache
warmStrategyCache({
  
  // Construct an array of URLs to be cached, first is index.html from dist folder, if it doesn't exist, then cache the root URL. 
  urls: ['/index.html', '/'],
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

// Useful for SPA, offlineFallback will return the index.html page if a page is not found in the cache.
offlineFallback({ pageFallback: '/index.html' });
