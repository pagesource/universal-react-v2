const isAssetPrefix = process.env.BASE_PATH || '';

module.exports = {
  distDir: 'build',
  assetPrefix: isAssetPrefix,
  env: {
    BASE_PATH: isAssetPrefix
  }
};
