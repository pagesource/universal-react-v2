#!/usr/bin/env node
'use strict';

const path = require('path');
const chalk = require('chalk');
const inquirer = require('inquirer');
const { createNpmDependenciesArray, mergeJsons } = require('./utils/jsonHelper');
const { createAppQuestions } = require('./utils/questions');
const {
  appTemplateFileExclusions,
  universalReactStampData
} = require('./utils/constants');
const { createDir, copyDir, writeJsonFile } = require('./utils/fileDirOps');
const { installPackages } = require('./utils/install');

const templatesPath = path.join(__dirname, 'templates');
const baseTemplatePath = path.join(templatesPath, 'base');
let templatePath = '';
let projectDir = '';
const cwd = process.cwd();

const stampFileName = 'universal-react-stamp.json';

const createProjectDirectory = (appName) => {
  projectDir = path.join(cwd, appName);
  createDir(projectDir);
};

const copyBaseDirectory = () => {
  copyDir(baseTemplatePath, projectDir, appTemplateFileExclusions);
};

const copyTemplateDirectory = (appType) => {
  templatePath = path.join(templatesPath, appType);
  copyDir(templatePath, projectDir, appTemplateFileExclusions);
};

const mergeAndCopyPackageFile = (appName) => {
  const basePackage = require(path.join(baseTemplatePath, 'package.json'));
  const appPackage = require(path.join(templatePath, 'package.json'));
  let packageFile = mergeJsons(basePackage, appPackage);
  packageFile = mergeJsons(packageFile, { name: appName });

  try {
    writeJsonFile(path.join(projectDir, 'package.json'), packageFile);
    console.info(chalk.green('package.json file copied successfully'));
  } catch (e) {
    console.error(chalk.red('error copying package.json file'));
    throw e;
  }
};

const createStampFile = (appType) => {
  const universalReactPackageFile = require(path.join(__dirname, 'package.json'));
  const json = mergeJsons(universalReactStampData, {
    name: universalReactPackageFile.name,
    version: universalReactPackageFile.version,
    type: appType
  });
  try {
    writeJsonFile(path.join(projectDir, stampFileName), json);
  } catch (e) {
    console.error('error creating stamp file');
  }
};

const installDependencies = () => {
  console.info(chalk.yellow('installing packages'));
  const depArr = createNpmDependenciesArray(path.join(projectDir, 'package.json'));
  installPackages(projectDir, depArr);
};

const initialize = (appType, appName) => {
  createProjectDirectory(appName);
  copyBaseDirectory();
  copyTemplateDirectory(appType);
  console.info(chalk.green('project created successfully'));

  mergeAndCopyPackageFile(appName);
  createStampFile(appType);

  installDependencies();
};

// initialize('ssr-custom', 'appName');

inquirer.prompt(createAppQuestions).then((answers) => {
  console.info(JSON.stringify(answers, null, '  '));

  initialize(answers.appType, answers.appName);
});
