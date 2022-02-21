/* eslint-disable func-names */
/* eslint-disable object-shorthand */
/* eslint-disable no-unused-vars */
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true'
});

const withTM = require('next-transpile-modules')(['services']);

const isAssetPrefix = process.env.BASE_PATH || '';

module.exports = withBundleAnalyzer(
  withTM({
    assetPrefix: isAssetPrefix,
    basePath: isAssetPrefix,
    env: {
      BASE_PATH: isAssetPrefix
    },
    images: {
      loader: 'akamai',
      path: '',
    },
    // mandatory config for SSG with next export command
    exportPathMap: async function (
    defaultPathMap,
    { dev, dir, outDir, distDir, buildId }
    ) {
      return {
        '/': { page: '/' }
      }
    }
  })
);
