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
  }
];

module.exports = {
  createAppQuestions
};
