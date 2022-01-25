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
  dirFileExists,
  isEmptyDir,
  getMostRecentDirectory,
  removeDir,
  renameSync,
  deleteFile
} = require('./utils/fileDirOps');
const { installPackages } = require('./utils/install');
const { setupTurboRepoProject } = require('./utils/turboRepoSetup');

const templatesPath = path.join(__dirname, 'templates');
const baseTemplatePath = path.join(templatesPath, 'base');
const commonTemplatePath = path.join(templatesPath, 'common');
const essentialsTemplatePath = path.join(commonTemplatePath, 'essentials');
const srcTemplatePath = path.join(commonTemplatePath, 'src');
const storybookPath = path.join(commonTemplatePath, 'storybook');

let appTemplatePath = '';
let rootDir = '';
let projectDir = '';
let storybookDir = '';
let microAppPath = '';
const cwd = process.cwd();
const stampFileName = 'universal-react-stamp.json';

const util = require('util');
const exec = util.promisify(require('child_process').exec);

const intializeGitRepo = async (dir) => {
  let cmd = 'cd ' + dir + ' && git init';
  const { stdout, stderr } = await exec(cmd).catch((err) => {
    console.info(chalk.red(`Error ${err}`));
  });
  console.info(`${stdout}`);
};

/**
 * @description: method to create project directory
 * @param {*} appName : name of app
 */
const createProjectDirectory = (appName) => {
  createDir(path.join(projectDir, appName));
  createDir(path.join(rootDir, '.vscode'));
};

/**
 * @description: method to place storyBook directory under project directory
 */
const copyStorybookDirectory = () => {
  storybookDir = path.join(projectDir, 'storybook');
  createDir(storybookDir);
  copyDir(storybookPath, storybookDir, []);
};

/**
 * @description: method to create project directory with base template.
 */
const copyBaseDirectory = (appName) => {
  microAppPath = path.join(projectDir, appName);
  removeDir(path.join(projectDir, 'docs'));
  renameSync(path.join(projectDir, 'web'), microAppPath);
  copyStorybookDirectory();
  copyDir(baseTemplatePath, microAppPath, []);
  copyDir(essentialsTemplatePath, microAppPath, []);
  copyDir(srcTemplatePath, path.join(microAppPath, 'src'), ['package.json']); // no need to copy package.json and merge it with microAppPath package.json
  copyDir(path.join(__dirname, '.vscode'), path.join(rootDir, '.vscode'), []);
};

const copyTemplateDirectory = (appType) => {
  appTemplatePath = path.join(templatesPath, appType);
  copyDir(appTemplatePath, microAppPath, appTemplateFileExclusions);
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

const addStampInfoFile = async (appType, appName) => {
  const universalReactPackageFile = require(path.join(__dirname, 'package.json'));
  const turboRepoPackageFile = require(path.join(rootDir, 'package.json'));
  const mergedJson = mergeJsons(turboRepoPackageFile, {
    name: "universal-react-v2",
    "universal-react-v2": {
      apps: [
        {
          name: appName,
          type: appType
        }
      ]
    }
  });
  try {
    await writeJsonFile(path.join(rootDir, 'package.json'), mergedJson);
  } catch (e) {
    console.error('error creating stamp file');
  }
  console.info('root package.json file update with universal-react-v2 stamp');
  console.info(
    chalk.yellow(
      'Root package.json updated by universal-react-v2'
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

const initializeNewProject = async (
  appType,
  appName,
  basePath,
  initializeGit,
  features
) => {
  createProjectDirectory(appName);
  copyBaseDirectory(appName);
  copyTemplateDirectory(appType);
  console.info(chalk.green('project created successfully'));

  const basePackage = require(path.join(baseTemplatePath, 'package.json'));
  const appPackage = require(path.join(appTemplatePath, 'package.json'));
  let packageFile = mergeJsons(basePackage, appPackage);
  packageFile = mergeJsons(packageFile, { name: appName });
  if (basePath != undefined) {
    packageFile = mergeJsons(packageFile, {
      scripts: {
        'env-var': 'cross-env BASE_PATH=' + basePath
      }
    });
  }
  await writeJsonFile(path.join(microAppPath, 'package.json'), packageFile);
  await addStampInfoFile(appType, appName);
  const features_found = await copyOptionalTemplates(features, rootDir);
  installDependencies(path.join(rootDir, 'package.json'), rootDir); //TODOs: enable before commit the code.
  if (initializeGit != false) {
    intializeGitRepo(rootDir);
  }
};

const updateProject = async (features) => {
  const features_found = await copyOptionalTemplates(features);
  updateStampFile(features_found);
  if (features_found.length > 0) {
    installDependencies(path.join(cwd, 'package.json'), cwd); //TODOs: enable before commit the code.
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
      updateProject(answers.features);
    });
  } else {
    console.info('Nothing to update however :)');
  }
} else {

  // create new project
  if (isEmptyDir(cwd)) {
    console.log(chalk.green('Setting up a new mono repo project using Turborepo'));
    setupTurboRepoProject(cwd);
    rootDir = cwd;
    projectDir = path.join(cwd, 'apps');
  } else {
    console.log(chalk.red('Current working directory is not empty. Please use a clean directory to setup the project'));
    process.exit(1);
  }

  // determine the project directory path
  if (dirFileExists(path.join(cwd, 'package.json'))) {
    rootDir = cwd;
  } else {
    const recentDir = getMostRecentDirectory(cwd);
    if (!recentDir) {
      console.log(chalk.red('An unexpected error occured'));
      process.exit(1);
    }

    // path to turbo project directory
    rootDir = path.join(cwd, recentDir);
    projectDir = path.join(rootDir, 'apps');
  }

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
            message: 'Select optional features you want to add (Press enter to skip)',
            name: 'features',
            choices: features
          }
        ];

        inquirer.prompt(featureQuestion).then((answers_features) => {
          initializeNewProject(
            appTypeMap[answers.appType],
            answers.appName,
            answers.customBasePath,
            answers.initializeGit,
            answers_features.features
          );
        });
      } else {
        initializeNewProject(
          appTypeMap[answers.appType],
          answers.appName,
          answers.customBasePath,
          answers.initializeGit,
          []
        );
      }
    }
  });
}
