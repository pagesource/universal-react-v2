const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true'
});

const withTM = require('next-transpile-modules')(['services']);
const PACKAGE_JSON = require('./package.json');

const isAssetPrefix = process.env.BASE_PATH || '';
const APP_NAME = PACKAGE_JSON.name.toLowerCase();

module.exports = withBundleAnalyzer(
  withTM({
    distDir: 'build',
    assetPrefix: isAssetPrefix,
    basePath: isAssetPrefix,
    env: {
      BASE_PATH: isAssetPrefix
    },
    webpack: (config, options) => {
      const { ModuleFederationPlugin } = options.webpack.container;

      config.plugins.push(
        new ModuleFederationPlugin({
          name: `${APP_NAME}`,
          remoteType: 'var',
          // remotes: this is where we will include items to consume from remote
          remotes: {},
          // exposes: this is where we will include items to expose
          exposes: {},
          // shared: here we can put the list of modules we would like to share
          shared: [
            {
              react: {
                eager: true,
                singleton: true,
                requiredVersion: false
              }
            },
            {
              'react-dom': {
                eager: true,
                singleton: true,
                requiredVersion: false
              }
            },
            {
              'styled-components': {
                eager: true,
                singleton: true
              }
            }
          ]
        })
      );

      return config;
    }
  })
);
