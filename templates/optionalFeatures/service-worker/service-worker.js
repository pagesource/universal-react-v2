import { precacheAndRoute, cleanupOutdatedCaches } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { clientsClaim } from 'workbox-core';
import { CacheFirst, StaleWhileRevalidate, NetworkFirst } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';

const precacheManifest = [].concat(self.__WB_MANIFEST || []);
/**
 * @description pre-cache assests with strategy as 'Cache-First'
 *
 * @example self.__WB_MANIFEST it will be replaced by the generated precache manifest.
 * We can provide overrides to additionalManifestEntries to additionally precache assets.
 */
precacheAndRoute(precacheManifest);

/**
 * @description skipWaiting - Skip on waiting and immediately try to install and activate the service worker.
 * It can be optionaly controlled by message wheter client wants to update or not which is a very
 * specific experience.
 *
 * @description clientsClaim - claims all the client, if open in multiple windows.
 */
self.skipWaiting();
clientsClaim();

cleanupOutdatedCaches();

/**
 * @description route registered to cache images, can be replaced with regex
 *
 * @example Strategy: Cache First
 * @example Cache Name: 'image-caches'
 * @example Max Entries: 20
 * @example Max Age 12 hours
 *
 * Currently, it is caching as per inspirations from various sources it can be modified as per needs.
 */
registerRoute(
  ({ request }) => request.destination === 'image',
  new CacheFirst({
    cacheName: 'image-caches',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200]
      }),
      new ExpirationPlugin({
        maxEntries: 20,
        maxAgeSeconds: 12 * 60 * 60
      })
    ]
  }),
  'GET'
);

/**
 * @description route registered to cache font, can be replaced with regex
 *
 * @example Strategy: Cache First
 * @example Cache Name: 'font-caches'
 * @example Max Entries: 5
 * @example Max Age 12 hours
 *
 * Currently, it is caching as per inspirations from various sources it can be modified as per needs.
 */
registerRoute(
  ({ request }) => request.destination === 'font',
  new CacheFirst({
    cacheName: 'font-caches',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200]
      }),
      new ExpirationPlugin({
        maxEntries: 5,
        maxAgeSeconds: 12 * 60 * 60
      })
    ]
  }),
  'GET'
);

/**
 * @description route registered to cache JS and CSS, can be replaced with regex
 *
 * @example Strategy: Stale While Revalidate
 * @example Cache Name: 'js-css-caches'
 * @example Max Entries: 20
 * @example Max Age 12 hours
 *
 * Currently, it is caching as per inspirations from various sources it can be modified as per needs.
 */
registerRoute(
  ({ request }) => request.destination === 'js' || request.destination === 'css',
  new StaleWhileRevalidate({
    cacheName: 'js-css-caches',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200]
      }),
      new ExpirationPlugin({
        maxEntries: 20,
        maxAgeSeconds: 12 * 60 * 60
      })
    ]
  })
);

/**
 * @description route registered to cache html, can be replaced with regex
 *
 * @example Strategy: Network First
 * @example Cache Name: 'html-caches'
 * @example Max Entries: 20
 * @example Max Age 12 hours
 *
 * Currently, it is caching as per inspirations from various sources it can be modified as per needs.
 */
registerRoute(
  ({ request }) => request.destination === 'html',
  new NetworkFirst({
    cacheName: 'html-caches',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [0, 200]
      }),
      new ExpirationPlugin({
        maxEntries: 20,
        maxAgeSeconds: 12 * 60 * 60
      })
    ]
  }),
  'GET'
);
