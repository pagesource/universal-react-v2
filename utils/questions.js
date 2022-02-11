const { appTypeMap, updateProjectConst, appTypes } = require('./constants');
const choices = Object.keys(appTypeMap);

const updateProjectOptions = [
  { name: 'Add optional features to the existing apps', value: updateProjectConst.APPS_LEVEL },
  { name: 'Add optional features to the root level', value: updateProjectConst.ROOT_LEVEL },
  { name: 'Add a new app to the project', value: updateProjectConst.ADD_NEW_APP }
];

const commonQuestionsProjectSetup = [
  {
    type: 'list',
    name: 'appType',
    message: 'What type of app you need?',
    choices: choices
  },
  {
    when: (data) =>
      appTypeMap[data.appType] === appTypes.MICRO_APP,
    name: 'appName',
    type: 'input',
    message: 'Enter your app name?',
    default: 'header',
  },
  {
    when: (data) =>
      appTypeMap[data.appType] === appTypes.SSR_APP || appTypeMap[data.appType] === appTypes.SSG_APP,
    name: 'appName',
    type: 'input',
    message: 'Enter your app name?',
    default: 'home',
  },
  {
    when: (data) =>
      appTypeMap[data.appType] === appTypes.SSR_APP || appTypeMap[data.appType] === appTypes.SSG_APP,
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
  }
];

const createAppQuestions = [
  ...commonQuestionsProjectSetup
];

const addAppQuestions = [
  ...commonQuestionsProjectSetup
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
    type: 'list',
    name: 'updateOption',
    message: 'Select an option to proceed.',
    choices: updateProjectOptions
  },
  {
    when: (data) => (data.updateOption === updateProjectConst.APPS_LEVEL && projectsList.length),
    type: 'list',
    name: 'selectedProject',
    message: 'Select app you want to update.',
    choices: projectsList
  }
]



module.exports = {
  createAppQuestions,
  featureQuestions,
  addAppQuestions,
  getUpdateProjectQuestions
};
