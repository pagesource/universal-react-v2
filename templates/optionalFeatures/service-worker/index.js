const path = require('path');

/**
 * @exports config supplied to next-offline to setup service worker in the public folder.
 * It will refer ./service-worker.js file as base config.Recommended configs which are extensible are pushed.
 *
 * @description next-offline official docs can be followed to extend/override the base config
 * and capability available.
 *
 */
module.exports = {
  generateInDevMode: true,
  generateSw: false,
  dontAutoRegisterSw: false,
  workboxOpts: {
    swSrc: path.join(__dirname, './service-worker.js'),
    swDest: path.join(__dirname, '../../public/service-worker.js'),
    exclude: [
      ({ asset, compilation }) => {
        if (
          asset.name.match(
            /^(build-manifest\.json|react-loadable-manifest\.json|server\/middleware-manifest\.json)$/
          )
        ) {
          return true;
        }
        return false;
      }
    ]
  }
};
