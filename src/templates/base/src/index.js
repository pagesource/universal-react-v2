#!/usr/bin/env node
'use strict';

const fs = require('fs');
const inquirer = require('inquirer');
const copydir = require('copy-dir');
const cwd = process.cwd();
const templatesPath = `${__dirname}/src/templates`;

const run = (appType, appName) => {
  const projectDir = `${cwd}/${appName}`;
  createPorjectdir(projectDir);

  let sourcePath = `${templatesPath}/base`;
  copyTemplateApp(sourcePath, projectDir, 'base template copied successfully');

  sourcePath = `${templatesPath}/${appType}`;
  copyTemplateApp(
    sourcePath,
    projectDir,
    `${appType} template copied successfully`
  );
};

const createPorjectdir = projectDir => {
  try {
    if (!fs.existsSync(projectDir)) {
      fs.mkdirSync(projectDir);
    } else {
      console.error('directory name already exists.');
      return;
    }
  } catch (e) {
    console.error('error creating project directory. App will exit.');
    console.log(e);
    return;
  }
};

const copyTemplateApp = (
  sourcePath,
  destPath,
  successMessage = 'template copied successfully'
) => {
  copydir(
    sourcePath,
    destPath,
    {
      utimes: true, // keep add time and modify time
      mode: true, // keep file mode
      cover: true // cover file when exists, default is true
    },
    function(err) {
      if (err) {
        throw err;
      }
      console.log(successMessage);
    }
  );
};

const questions = [
  {
    type: 'list',
    name: 'appType',
    message: 'What type of app you needed?',
    choices: ['Static', 'SSR'],
    filter: function(val) {
      return val.toLowerCase();
    },
    validate: function(value) {
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
    validate: function(value) {
      if (value.length) {
        return true;
      } else {
        return 'Please enter valid app name';
      }
    }
  }
];

inquirer.prompt(questions).then(answers => {
  console.log(JSON.stringify(answers, null, '  '));
  run(answers.appType, answers.appName);
});
