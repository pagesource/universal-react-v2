const appTemplateFileExclusions = ['package.json'];
const choices = ['Static', 'SSR'];

const createAppQuestions = [
  {
    type: 'list',
    name: 'appType',
    message: 'What type of app you need?',
    choices: choices,
    filter: function (val) {
      return val.toLowerCase();
    },
    validate: function (value) {
      if (value.length) {
        return true;
      } else {
        return 'Please enter valid value';
      }
    }
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

const universalReactStampData = {
  name: 'universal-react-stamp',
  description:
    'This file is needed by universal-react app to determine certain parameters'
};

module.exports = {
  appTemplateFileExclusions,
  createAppQuestions,
  universalReactStampData,
  choices
};
