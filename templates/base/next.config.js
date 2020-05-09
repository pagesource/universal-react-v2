const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true'
});

const isAssetPrefix = process.env.BASE_PATH || '';

module.exports = withBundleAnalyzer({
  distDir: 'build',
  assetPrefix: isAssetPrefix,
  env: {
    BASE_PATH: isAssetPrefix
  }
});
