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
    validate: function (value) {
      if (value.length) {
        return true;
      } else {
        return 'Please enter valid app name';
      }
    }
  },
  {
    name: 'basePath',
    type: 'confirm',
    message: 'Set Base path?',
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

module.exports = {
  createAppQuestions
};
