const withPWA = require('next-pwa');
const nextPWAConfig = require('../base/config/pwa/next-pwa.config');
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true'
});

const isAssetPrefix = process.env.BASE_PATH || '';

/**
 * This section adds the basic PWA configuration into the next config
 * It derives from an env variable defined in .env file. Default it is enabled,
 * To disable it you need to specify the PWA_DISABLED=true in .env file
 * 
 * Further PWA configuration visit https://www.npmjs.com/package/next-pwa
 */
const nextConfig = withPWA({
  ...nextPWAConfig
});

module.exports = withBundleAnalyzer({
  distDir: 'build',
  assetPrefix: isAssetPrefix,
  env: {
    BASE_PATH: isAssetPrefix
  },
  ...nextConfig
});
