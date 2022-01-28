#!/usr/bin/env node
'use strict';

const path = require('path');
const chalk = require('chalk');
const inquirer = require('inquirer');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

const { createNpmDependenciesArray, mergeJsons } = require('./utils/jsonHelper');
const { arrayUnique, getOptionalFeatures } = require('./utils/helpers');
const { createAppQuestions, featureQuestions } = require('./utils/questions');
const {
  appTemplateFileExclusions,
  appTypeMap,
  appConstants,
  sourceDirs,
  destinationDirs
} = require('./utils/constants');
const {
  createDir,
  copyDir,
  writeJsonFile,
  dirFileExists,
  isEmptyDir,
  getMostRecentDirectory,
  removeDir,
  renameSync
} = require('./utils/fileDirOps');
const { installPackages } = require('./utils/install');
const { setupTurboRepoProject } = require('./utils/turboRepoSetup');
const optionalFeatureHelpers = require('./utils/optionalFeature');

const templatesPath = path.join(__dirname, sourceDirs.TEMPLATES_DIR);
const baseTemplatePath = path.join(templatesPath, sourceDirs.BASE_DIR);
const commonTemplatePath = path.join(templatesPath, sourceDirs.COMMON_DIR);
const essentialsTemplatePath = path.join(commonTemplatePath, sourceDirs.ESSENTIALS_DIR);
const srcTemplatePath = path.join(commonTemplatePath, sourceDirs.SRC_DIR);
const sourcePackagesPath = path.join(commonTemplatePath, appConstants.PACKAGES_DIR);
const storybookPath = path.join(commonTemplatePath, sourceDirs.STORYBOOK_DIR);

let appTemplatePath = ''; // template path of [ssg, ssr, microApp] templates
let rootDir = ''; // root folder of generated project ./
let projectDir = ''; // apps folder under root
let storybookDir = ''; // storybook folder under template/common
let microAppPath = ''; // project folder under ./apps/${appName}
let packagesAppPath = ''; // packages folder on the same level of ./apps
let turboRepoPackageFile = ''; // root folder package.json file path
const cwd = process.cwd(); // current working directory

/**
 * @description : method to initialize git repositiy
 * @param {*} dir : path of directory
 */
const intializeGitRepo = async (dir) => {
  const cmd = `cd ${dir} && git init`;
  const { stdout } = await exec(cmd).catch((err) => {
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
  createDir(path.join(rootDir, appConstants.VSCODE_DIR));
};

/**
 * @description: method to place storyBook directory under project directory
 */
const copyStorybookDirectory = () => {
  storybookDir = path.join(rootDir, sourceDirs.STORYBOOK_DIR);
  createDir(storybookDir);
  copyDir(storybookPath, storybookDir, []);
};

/**
 * @description: method to create project directory with base template.
 */
const copyBaseDirectory = (appName) => {
  // path of app need to be created inside root director -> apps folder
  microAppPath = path.join(projectDir, appName);
  packagesAppPath = path.join(rootDir, appConstants.PACKAGES_DIR);

  removeDir(path.join(projectDir, destinationDirs.DOCS_DIR));
  renameSync(path.join(projectDir, destinationDirs.WEB_DIR), microAppPath);

  copyStorybookDirectory();

  copyDir(baseTemplatePath, microAppPath, []);
  copyDir(essentialsTemplatePath, microAppPath, []);

  // removing pages folder gnerated by turboRepo
  removeDir(path.join(microAppPath, destinationDirs.PAGES_DIR));

  copyDir(sourcePackagesPath, packagesAppPath, []);

  copyDir(srcTemplatePath, path.join(microAppPath, sourceDirs.SRC_DIR), [
    appConstants.PACKAGE_JSON
  ]);
  copyDir(
    path.join(__dirname, appConstants.VSCODE_DIR),
    path.join(rootDir, appConstants.VSCODE_DIR),
    []
  );
};

/**
 * @description : method to copy base template directory into new app
 * @param {*} appType : user selcted app type [ssg, ssr or microApp]
 */
const copyTemplateDirectory = (appType) => {
  appTemplatePath = path.join(templatesPath, appType);
  copyDir(appTemplatePath, microAppPath, appTemplateFileExclusions);
};

/**
 * @description : method to copy optional feature from template directory
 * @param {*} features : list of optional features
 * @param {*} _path path for project directory
 * @returns list of optional features
 */
const copyOptionalTemplates = async (features, _path = cwd) => {
  const projectPackage = require(path.join(microAppPath, appConstants.PACKAGE_JSON));
  const done = [];
  const skipInlineExecution = ['service-worker', 'pwa'];

  for (const _feature of features) {
    const opFeatTemplate = path.join(
      templatesPath,
      sourceDirs.OPTIONAL_FEATURES_DIR,
      _feature
    );
    if (skipInlineExecution.includes(_feature)) {
      optionalFeatureHelpers[_feature]({ opFeatTemplate, microAppPath });
      done.push(_feature);
    } else {
      if (dirFileExists(opFeatTemplate)) {
        const destinationOpFeatureDir = path.join(microAppPath, _feature);
        if (!dirFileExists(destinationOpFeatureDir)) {
          createDir(destinationOpFeatureDir);
        }
        copyDir(opFeatTemplate, destinationOpFeatureDir, []);

        const appPackagePath = path.join(opFeatTemplate, appConstants.PACKAGE_JSON);
        if (dirFileExists(appPackagePath)) {
          const json = require(appPackagePath);
          const packageFile = mergeJsons(projectPackage, json);
          await writeJsonFile(
            path.join(microAppPath, appConstants.PACKAGE_JSON),
            packageFile
          );
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
  }
  if (done.length > 0) {
    console.info(
      chalk.green('optional features validated. ready to install dependencies...')
    );
  }
  return done;
};

/**
 * @description : method to update turbo repo package.json to have info about universal-react
 * @param {*} appType : unser passed app type [ssg, ssr, microApp]
 * @param {*} appName : user selected app name
 */
const addInfoIntoPackageJson = async (appType, appName) => {
  const universalReactPackageFile = require(path.join(
    __dirname,
    appConstants.PACKAGE_JSON
  ));
  turboRepoPackageFile = require(path.join(rootDir, appConstants.PACKAGE_JSON));
  const srcStorybookPackageFile = require(path.join(
    storybookDir,
    appConstants.PACKAGE_JSON
  ));
  const mergedJson = mergeJsons(turboRepoPackageFile, {
    name: appConstants.UNIVERAL_REACT,
    scripts: srcStorybookPackageFile.scripts,
    [appConstants.UNIVERAL_REACT]: {
      apps: [
        {
          appName,
          appType,
          optionalFeatures: []
        }
      ]
    }
  });
  try {
    await writeJsonFile(path.join(rootDir, appConstants.PACKAGE_JSON), mergedJson);
  } catch (e) {
    console.error('error creating stamp file');
  }
  console.info('root package.json file update with universal-react-v2 stamp');
  console.info(chalk.yellow('Root package.json updated by universal-react-v2'));
};

/**
 * @description : method to install depencies of project
 * @param {*} filePath : path of package.json file from root directory
 * @param {*} installLocation : location of root where dependencies need to install
 */
const installDependencies = async (filePath, installLocation) => {
  console.info('installing dependencies...');
  const depArr = await createNpmDependenciesArray(filePath);
  installPackages(installLocation, depArr);
};

/**
 * @description : method to initialize new project
 * @param {*} appType : user selected app type [ssg,ssr,microApp]
 * @param {*} appName : user selected app name
 * @param {*} basePath : user input base path
 * @param {*} initializeGit : boolean to initialize git under project
 * @param {*} features : user selected optional features
 */
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

  const basePackage = require(path.join(baseTemplatePath, appConstants.PACKAGE_JSON));
  const appPackage = require(path.join(appTemplatePath, appConstants.PACKAGE_JSON));
  let packageFile = mergeJsons(basePackage, appPackage);
  packageFile = mergeJsons(packageFile, { name: appName });
  if (basePath != undefined) {
    packageFile = mergeJsons(packageFile, {
      scripts: {
        'env-var': 'cross-env BASE_PATH=' + basePath
      }
    });
  }
  await writeJsonFile(path.join(microAppPath, appConstants.PACKAGE_JSON), packageFile);
  await addInfoIntoPackageJson(appType, appName);
  const features_found = await copyOptionalTemplates(features, rootDir);
  await installDependencies(path.join(rootDir, appConstants.PACKAGE_JSON), rootDir);
  if (initializeGit != false) {
    intializeGitRepo(rootDir);
  }
};

/**
 * @description : method to update existing universal-react project
 * @param {*} features : user selected optional features
 */
const updateProject = async (features) => {
  const features_found = await copyOptionalTemplates(features);
  if (features_found.length > 0) {
    installDependencies(path.join(cwd, appConstants.PACKAGE_JSON), cwd);
  }
};

/************************************** Execution starts ******************************************/
let existingProject = false;
const rootPackagePath = path.join(cwd, appConstants.PACKAGE_JSON);

if (dirFileExists(rootPackagePath)) {
  rootDir = cwd;
  turboRepoPackageFile = require(rootPackagePath);
  if (
    turboRepoPackageFile['name'] === appConstants.UNIVERAL_REACT &&
    turboRepoPackageFile[appConstants.UNIVERAL_REACT]
  ) {
    existingProject = true;
  }
}

if (existingProject) {
  //update project

  console.info(
    chalk.yellow(
      [
        'There is an existing project',
        `${turboRepoPackageFile[appConstants.UNIVERAL_REACT].apps[0].appName}`,
        'in the current directory. The app will go into update mode'
      ].join(' ')
    )
  );

  microAppPath = path.join(
    cwd,
    'apps',
    turboRepoPackageFile[appConstants.UNIVERAL_REACT].apps[0].appName
  );

  // only get the features that are not already added in the project
  const features = getOptionalFeatures(
    turboRepoPackageFile[appConstants.UNIVERAL_REACT].apps[0]?.optionalFeatures || []
  );
  console.log(turboRepoPackageFile[appConstants.UNIVERAL_REACT].apps[0], '====>');

  if (features.length > 0) {
    const featureQuestion = [
      {
        ...featureQuestions[0],
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
    projectDir = path.join(cwd, destinationDirs.APPS_DIR);
  } else {
    console.log(
      chalk.red(
        'Current working directory is not empty. Please use a clean directory to setup the project'
      )
    );
    process.exit(1);
  }

  // determine the project directory path
  if (dirFileExists(path.join(cwd, appConstants.PACKAGE_JSON))) {
    rootDir = cwd;
  } else {
    const recentDir = getMostRecentDirectory(cwd);
    if (!recentDir) {
      console.log(chalk.red('An unexpected error occured'));
      process.exit(1);
    }

    // path to turbo project directory
    rootDir = path.join(cwd, recentDir);
    projectDir = path.join(rootDir, destinationDirs.APPS_DIR);
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
            ...featureQuestions[0],
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
