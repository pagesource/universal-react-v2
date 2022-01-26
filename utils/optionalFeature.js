'use strict';

const path = require('path');
const { appConstants, sourceDirs } = require('./constants');
const loggerUtil = require('./logHelpers');
const { createDir, copyDir, dirFileExists } = require('./fileDirOps');

function getDestionPath(microAppPath, feature) {
  return path.join(microAppPath, 'config', feature);
}

function checkDirAndCopy({ opFeatTemplate, microAppPath, feature }) {
  let status = false;
  if (dirFileExists(opFeatTemplate)) {
    const destinationOpFeatureDir = getDestionPath(microAppPath, feature);
    if (!dirFileExists(destinationOpFeatureDir)) {
      createDir(destinationOpFeatureDir);
    }
    copyDir(opFeatTemplate, destinationOpFeatureDir, []);
    status = true;
  }
  return status;
}

function copySWSetup({ opFeatTemplate, microAppPath }) {
  loggerUtil({
    serverity: 'info',
    color: 'blue',
    message: 'copying service worker setup and guide..'
  });

  const isSuccess = checkDirAndCopy({
    opFeatTemplate,
    microAppPath,
    feature: 'service-worker'
  });

  isSuccess
    ? loggerUtil({
        serverity: 'info',
        color: 'default',
        message: `Service worker config is copied successfully. Refer readme.md file create in the config/service-worker dir for next steps.`
      })
    : loggerUtil({
        serverity: 'error',
        color: 'red',
        message: `Service worker config missing. skipping Service worker setup...`
      });
}

function copyPWASetup({ opFeatTemplate, microAppPath }) {
  loggerUtil({
    serverity: 'info',
    color: 'blue',
    message: 'copying pwa setup guide..'
  });
  const isSuccess = checkDirAndCopy({ opFeatTemplate, microAppPath, feature: 'pwa' });

  isSuccess
    ? loggerUtil({
        serverity: 'info',
        color: 'default',
        message: `PWA guide is copied successfully. Refer readme.md file create in the config/pwa dir for next steps.`
      })
    : loggerUtil({
        serverity: 'error',
        color: 'red',
        message: `PWA config missing. skipping PWA setup...`
      });
}

module.exports = {
  'service-worker': copySWSetup,
  pwa: copyPWASetup
};
