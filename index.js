#!/usr/bin/env node
'use strict';

const path = require('path');
const fs = require('fs');
const os = require('os');
const inquirer = require('inquirer');
const copydir = require('copy-dir');
const npm = require('npm');
const { createNpmDependenciesArray, mergeJsons } = require('./util/helper');
const { appTemplateFileExclusions } = require('./util/constants');

const cwd = process.cwd();
let projectDir = '';
const templatesPath = path.join(__dirname, 'templates');

const run = (appType, appName) => {
  projectDir = path.join(cwd, appName);
  createPorjectdir(projectDir);

  let sourcePath = path.join(templatesPath, 'base');
  copyTemplateApp(sourcePath, projectDir);

  sourcePath = path.join(templatesPath, appType);
  copyTemplateApp(sourcePath, projectDir);

  console.info('project created successfully');

  const basePackage = require(path.join(projectDir, 'package.json'));
  const appPackage = require(path.join(templatesPath, appType, 'package.json'));
  const packageFile = mergeJsons(basePackage, appPackage);
  writeJsonFile(path.join(projectDir, 'package.json'), packageFile);

  console.info('installing packages');
  const depArr = createNpmDependenciesArray(path.join(projectDir, 'package.json'));
  installPackages(projectDir, depArr);
};

const createPorjectdir = (projectDir) => {
  try {
    if (!fs.existsSync(projectDir)) {
      fs.mkdirSync(projectDir);
    } else {
      console.error('directory name already exists.');
      return;
    }
  } catch (e) {
    console.error('error creating project directory. App will exit.');
    console.info(e);
    return;
  }
};

const copyTemplateApp = (sourcePath, destPath) => {
  copydir.sync(
    sourcePath,
    destPath,
    {
      utimes: true, // keep add time and modify time
      mode: true, // keep file mode
      cover: true, // cover file when exists, default is true

      filter: function (stat, filename, dir) {
        const file = path.parse(filename).base;

        // exlude all files in appTemplateFileExclusions array, when they are being copied from ssr or static folder
        if (stat === 'file' && appTemplateFileExclusions.includes(file)) {
          if (path.join(templatesPath, 'base') === dir) {
            return true;
          }
          return false;
        }
        return true;
      }
    },
    function (err) {
      if (err) {
        throw err;
      }
    }
  );
};

const writeJsonFile = (jsonFilePath, json) => {
  try {
    fs.writeFileSync(jsonFilePath, JSON.stringify(json, null, 2) + os.EOL);
  } catch (e) {
    console.error('error merging package.json files');
  }
};

const installPackages = (installPath, depArr) => {
  npm.load(() => {
    npm.commands.install(installPath, depArr, function (err) {
      console.error('failed to install packages, please install them manually');
      throw err;
    });
  });
};

const questions = [
  {
    type: 'list',
    name: 'appType',
    message: 'What type of app you need?',
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

// run('static', 'test-static');

inquirer.prompt(questions).then((answers) => {
  console.info(JSON.stringify(answers, null, '  '));
  run(answers.appType, answers.appName);
});
