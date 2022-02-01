# Getting Started

---

## Installation

`npm i --save-dev next-offline workbox-cacheable-response workbox-expiration workbox-precaching workbox-routing workbox-strategies`

`yarn add --save-dev next-offline workbox-cacheable-response workbox-expiration workbox-precaching workbox-routing workbox-strategies`

## Next js config

modify `next.config.js` in the directory where service worker is required to be installed.

```
const withPlugins = require('next-compose-plugins');
const withOffline = require('next-offline');

const swConfig = require('./config/service-worker');

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true'
});

const isAssetPrefix = process.env.BASE_PATH || '';

module.exports = withPlugins([
  [
    withBundleAnalyzer({
      distDir: 'build',
      assetPrefix: isAssetPrefix,
      basePath: isAssetPrefix,
      env: {
        BASE_PATH: isAssetPrefix
      }
    })
  ],
  [withOffline(swConfig)]
]);

```

## Configure Service worker

Universal React comes up as pre-configured service worker using package `next-offline` which is built on top of workbox webpack plugin.

## Motivation behind configuration

- Inject manifest provides tremendous flexibility and provides in-built workbox modules which can be leveraged.
- Standard configs which can be overriden for static assets and files.

| Asset Type | Strategy               | Max Entries | Max Age  |
| ---------- | ---------------------- | ----------- | -------- |
| Fonts      | Cache First            | 5           | 12 hours |
| Image      | Cache First            | 20          | 12 hours |
| JS/CSS     | Stale While Revalidate | 20          | 12 hours |
| HTML       | NetworkFirst           | 20          | 12 hours |

## References

[Workbox](https://developers.google.com/web/tools/workbox/guides/get-started)
[next-offline](https://github.com/hanford/next-offline)
