'use strict';

const fs = require('fs');
const inquirer = require('inquirer');
const copydir = require('copy-dir');

//const files = require('./files');
let dir = '';

const run = (appType) => {
  try {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
      copyTemplateApp(appType);
    }
  } catch (err) {
    console.error(err);
  }
};

const copyTemplateApp = (appType) => {
  const appPath = `${__dirname}/src/templates/${appType}`;
  copydir(
    appPath,
    dir,
    {
      utimes: true, // keep add time and modify time
      mode: true, // keep file mode
      cover: true // cover file when exists, default is true
    },
    function (err) {
      if (err) {
        throw err;
      }
      console.log('done');
    }
  );
};

const questions = [
  {
    type: 'list',
    name: 'appType',
    message: 'What type of app you needed?',
    choices: ['Static', 'SSR'],
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

inquirer.prompt(questions).then((answers) => {
  console.log(JSON.stringify(answers, null, '  '));
  dir = `${process.cwd()}/${answers.appName}`
  run(JSON.parse(JSON.stringify(answers.appType)));
});
