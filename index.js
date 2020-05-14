#!/usr/bin/env node
'use strict';

const path = require('path');
const chalk = require('chalk');
const inquirer = require('inquirer');
const { createNpmDependenciesArray, mergeJsons } = require('./utils/jsonHelper');
const { arrayUnique, getOptionalFeatures } = require('./utils/helpers');
const { createAppQuestions } = require('./utils/questions');
const {
  appTemplateFileExclusions,
  universalReactStampData
} = require('./utils/constants');
const {
  createDir,
  copyDir,
  writeJsonFile,
  dirFileExists
} = require('./utils/fileDirOps');
const { installPackages } = require('./utils/install');

const templatesPath = path.join(__dirname, 'templates');
const baseTemplatePath = path.join(templatesPath, 'base');
let appTemplatePath = '';
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
  appTemplatePath = path.join(templatesPath, appType);
  copyDir(appTemplatePath, projectDir, appTemplateFileExclusions);
};

const copyOptionalTemplates = (features) => {
  const projectPackage = require(path.join(cwd, 'package.json'));

  for (let i = 0; i < features.length; i = i + 1) {
    const opFeatTemplate = path.join(templatesPath, 'optionalFeatures', features[i]);
    if (dirFileExists(opFeatTemplate)) {
      copyDir(opFeatTemplate, cwd, appTemplateFileExclusions);

      const appPackagePath = path.join(opFeatTemplate, 'package.json');
      if (dirFileExists(appPackagePath)) {
        const json = require(appPackagePath);
        const packageFile = mergeJsons(projectPackage, json);
        writeJsonFile(path.join(cwd, 'package.json'), packageFile);
      }
    }
  }
};

const createStampFile = (appType, appName) => {
  const universalReactPackageFile = require(path.join(__dirname, 'package.json'));
  const json = mergeJsons(universalReactStampData, {
    name: universalReactPackageFile.name,
    version: universalReactPackageFile.version,
    type: appType,
    appName: appName
  });
  try {
    writeJsonFile(path.join(projectDir, stampFileName), json);
  } catch (e) {
    console.error('error creating stamp file');
  }
};

const updateStampFile = (features) => {
  const stampFilePath = path.join(cwd, stampFileName);
  if (dirFileExists(stampFilePath)) {
    const json = require(stampFilePath);
    const opFeat = json.optionalFeatures;
    json.optionalFeatures = arrayUnique(opFeat.concat(features));
    writeJsonFile(path.join(cwd, stampFileName), json);
  }
};

const installDependencies = (filePath, installLocation) => {
  const depArr = createNpmDependenciesArray(filePath);
  installPackages(installLocation, depArr);
};

const initializeNewProject = (appType, appName) => {
  createProjectDirectory(appName);
  copyBaseDirectory();
  copyTemplateDirectory(appType);
  console.info(chalk.green('project created successfully'));

  const basePackage = require(path.join(baseTemplatePath, 'package.json'));
  const appPackage = require(path.join(appTemplatePath, 'package.json'));
  let packageFile = mergeJsons(basePackage, appPackage);
  packageFile = mergeJsons(packageFile, { name: appName });
  writeJsonFile(path.join(projectDir, 'package.json'), packageFile);

  createStampFile(appType, appName);
  installDependencies(path.join(projectDir, 'package.json'), projectDir);
};

const updateProject = (features) => {
  copyOptionalTemplates(features);
  updateStampFile(features);
  installDependencies(path.join(cwd, 'package.json'), cwd);
};

/************************************** Execution starts ******************************************/
const stampFilePath = path.join(cwd, stampFileName);
const exists = dirFileExists(stampFilePath);

if (exists) {
  //update project

  const existingAppInfo = require(stampFilePath);
  console.info(
    chalk.yellow(
      `There is an existing project "${existingAppInfo.appName}" in the current directory. The app will go into update mode`
    )
  );

  // only get the features that are not already added in the project
  const features = getOptionalFeatures(existingAppInfo.optionalFeatures);

  if (features.length > 0) {
    const featureQuestion = [
      {
        type: 'checkbox',
        message: 'Select optional features you want to add',
        name: 'features',
        choices: features
      }
    ];

    inquirer.prompt(featureQuestion).then((answers) => {
      // console.info(JSON.stringify(answers, null, '  '));
      updateProject(answers.features);
    });
  } else {
    console.info('Nothing to update however :)');
  }
} else {
  // create new project

  inquirer.prompt(createAppQuestions).then((answers) => {
    initializeNewProject(answers.appType, answers.appName);
  });
}
