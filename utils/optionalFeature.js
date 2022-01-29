'use strict';

const path = require('path');
const { appConstants, sourceDirs } = require('./constants');
const loggerUtil = require('./logHelpers');
const { createDir, copyDir, dirFileExists } = require('./fileDirOps');

function getDestionPath(microAppPath, feature) {
  const configOptionalFeaturePath = path.join(microAppPath, appConstants.CONFIG_DIR);
  if (!dirFileExists(configOptionalFeaturePath)) {
    createDir(configOptionalFeaturePath);
  }
  return path.join(microAppPath, appConstants.CONFIG_DIR, feature);
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
    feature: appConstants.SERVICE_WORKER
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
  
  const isSuccess = checkDirAndCopy({
    opFeatTemplate,
    microAppPath,
    feature: appConstants.PWA
  });

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
  [appConstants.SERVICE_WORKER]: copySWSetup,
  pwa: copyPWASetup
};
