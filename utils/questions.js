const { appTypeMap } = require('./constants');
const choices = Object.keys(appTypeMap);

const createAppQuestions = [
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
    default: 'home',
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

const addAppQuestions = [
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
    when: (data) => data.basePath === true,
    type: 'input',
    name: 'customBasePath',
    message: 'Please enter base path:',
    default: '/docs'
  }
];

const featureQuestions = [
  {
    type: 'checkbox',
    message: 'Select optional features you want to add (Press enter to skip)',
    name: 'features',
    choices: []
  }
];

const getUpdateProjectQuestions = (projectsList) => [
  {
    type: 'confirm',
    name: 'addMoreProject',
    message: 'Want to add more project?',
    default: false
  },
  {
    when: (data) => data.addMoreProject === false,
    type: 'list',
    name: 'selectedProject',
    message: 'Select project you want to update.',
    choices: projectsList
  }
]

module.exports = {
  createAppQuestions,
  featureQuestions,
  addAppQuestions,
  getUpdateProjectQuestions
};
