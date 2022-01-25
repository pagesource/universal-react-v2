const { appTypeMap } = require('../static/constants');
const choices = Object.keys(appTypeMap);

const setupTemplatePrompts = [
  {
    type: 'list',
    name: 'appType',
    message: 'What type of app you need?',
    choices: choices
  },
  {
    name: 'appName',
    type: 'input',
    message: 'Enter your app name?',
    validate: function (value) {
      if (value.length) {
        return true;
      } else {
        return 'Please enter valid app name';
      }
    }
  },
  {
    when: (data) =>
      appTypeMap[data.appType] === 'ssr' || appTypeMap[data.appType] === 'ssg',
    name: 'basePath',
    type: 'confirm',
    message: 'Do you want to run your application from deep/base path?',
    default: true
  },
  {
    when: (data) => data.basePath === true,
    type: 'input',
    name: 'customBasePath',
    message: 'Please enter base path:',
    default: '/docs'
  },
  {
    name: 'initializeGit',
    type: 'confirm',
    message: 'Do you want to initialize a git repo?',
    default: true
  }
];


function getOptionalFeaturePrompts(features) {
  return [
    {
      type: 'checkbox',
      message: 'Select features you want to add (Optional). Press Enter to skip this step',
      name: 'optionalFeatures',
      choices: features
    }
  ];
};

module.exports = {
  setupTemplatePrompts,
  getOptionalFeaturePrompts
};
