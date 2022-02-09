const { appTypeMap, updateProjectConst } = require('./constants');
const choices = Object.keys(appTypeMap);

const updateProjectOptions = [
  { name: 'Add additional features to the existing app', value: updateProjectConst.APPS_LEVEL },
  { name: 'Add additional features to the root level under modules', value: updateProjectConst.ROOT_LEVEL },
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
  }
];

const createAppQuestions = [
  ...commonQuestionsProjectSetup,
  {
    name: 'initializeGit',
    type: 'confirm',
    message: 'Do you want to initialize a git repo?',
    default: true
  }
];

const addAppQuestions = [
  ...commonQuestionsProjectSetup,
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
    when: (data) => data.updateOption === updateProjectConst.APPS_LEVEL,
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
