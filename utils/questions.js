const choices = ['ssr-custom', 'ssr-default', 'static-export'];
const createAppQuestions = [
  {
    type: 'list',
    name: 'appType',
    message: 'What type of app you need?',
    choices: choices,
    filter: function (val) {
      return val.toLowerCase();
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

module.exports = {
  createAppQuestions
};
