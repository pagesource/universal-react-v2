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
  universalReactStampData,
  appTypeMap
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
  createDir(path.join(projectDir, '.vscode'));
};

const copyBaseDirectory = () => {
  copyDir(baseTemplatePath, projectDir, appTemplateFileExclusions);
  copyDir(path.join(__dirname, '.vscode'), path.join(projectDir, '.vscode'), []);
};

const copyTemplateDirectory = (appType) => {
  appTemplatePath = path.join(templatesPath, appType);
  copyDir(appTemplatePath, projectDir, appTemplateFileExclusions);
};

const copyOptionalTemplates = async (features, _path = cwd) => {
  const projectPackage = require(path.join(_path, 'package.json'));
  const done = [];

  for (const _feature of features) {
    const opFeatTemplate = path.join(templatesPath, 'optionalFeatures', _feature);

    if (dirFileExists(opFeatTemplate)) {
      copyDir(opFeatTemplate, _path, appTemplateFileExclusions);

      const appPackagePath = path.join(opFeatTemplate, 'package.json');
      if (dirFileExists(appPackagePath)) {
        const json = require(appPackagePath);
        const packageFile = mergeJsons(projectPackage, json);
        await writeJsonFile(path.join(_path, 'package.json'), packageFile);
        console.info(`${_feature} added to package.json`);
        done.push(_feature);
      } else {
        console.info(
          chalk.red(
            `${_feature}/package.json missing. could not find feature dependencies.`
          )
        );
        console.info(chalk.red(`skipping ${_feature}...`));
      }
    } else {
      console.info(chalk.red(`${_feature} missing. feature not found.`));
      console.info(chalk.red(`skipping ${_feature}...`));
    }
  }
  if (done.length > 0) {
    console.info(
      chalk.green('optional features validated. ready to install dependencies...')
    );
  }
  return done;
};

const createStampFile = async (appType, appName) => {
  const universalReactPackageFile = require(path.join(__dirname, 'package.json'));
  const json = mergeJsons(universalReactStampData, {
    name: universalReactPackageFile.name,
    version: universalReactPackageFile.version,
    type: appType,
    appName: appName
  });
  try {
    await writeJsonFile(path.join(projectDir, stampFileName), json);
  } catch (e) {
    console.error('error creating stamp file');
  }
  console.info(`stamp file created at ${path.join(projectDir, stampFileName)}`);
  console.info(
    chalk.yellow(
      'make sure not to delete the stamp file. [stamp file is important for universal-react-v2 to keep track of the project]'
    )
  );
};

const updateStampFile = async (features, _path = cwd) => {
  const stampFilePath = path.join(_path, stampFileName);
  if (features.length > 0) {
    if (dirFileExists(stampFilePath)) {
      const json = require(stampFilePath);
      const opFeat = json.optionalFeatures;
      json.optionalFeatures = arrayUnique(opFeat.concat(features));
      await writeJsonFile(stampFilePath, json);
      console.info('stamp file updated. optional features tracked.');
    } else {
      console.info(chalk.red('stamp file was not found!'));
    }
  } else {
    console.info('No optional feature was applied.');
  }
};

const installDependencies = async (filePath, installLocation) => {
  console.info('installing dependencies...');
  const depArr = await createNpmDependenciesArray(filePath);
  installPackages(installLocation, depArr);
};

const initializeNewProject = async (appType, appName, features) => {
  createProjectDirectory(appName);
  copyBaseDirectory();
  copyTemplateDirectory(appType);
  console.info(chalk.green('project created successfully'));

  const basePackage = require(path.join(baseTemplatePath, 'package.json'));
  const appPackage = require(path.join(appTemplatePath, 'package.json'));
  let packageFile = mergeJsons(basePackage, appPackage);
  packageFile = mergeJsons(packageFile, { name: appName });
  writeJsonFile(path.join(projectDir, 'package.json'), packageFile);

  await createStampFile(appType, appName);
  const features_found = await copyOptionalTemplates(features, projectDir);
  await updateStampFile(features_found, projectDir);
  installDependencies(path.join(projectDir, 'package.json'), projectDir);
};

const updateProject = async (features) => {
  const features_found = await copyOptionalTemplates(features);
  updateStampFile(features_found);
  if (features_found.length > 0) {
    installDependencies(path.join(cwd, 'package.json'), cwd);
  }
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
        message: 'Select features you want to add (Optional)',
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
    if (appTypeMap[answers.appType] === undefined) {
      console.error('Invalid app type.');
    } else {
      // only get the features that are not already added in the project
      const features = getOptionalFeatures([]);

      if (features.length > 0) {
        const featureQuestion = [
          {
            type: 'checkbox',
            message: 'Select features you want to add (Optional)',
            name: 'features',
            choices: features
          }
        ];

        inquirer.prompt(featureQuestion).then((answers_features) => {
          initializeNewProject(
            appTypeMap[answers.appType],
            answers.appName,
            answers_features.features
          );
        });
      } else {
        initializeNewProject(appTypeMap[answers.appType], answers.appName, []);
      }
    }
  });
}
