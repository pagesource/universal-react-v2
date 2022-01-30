#!/usr/bin/env node
'use strict';

const path = require('path');
const chalk = require('chalk');
const inquirer = require('inquirer');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

const { createNpmDependenciesArray, mergeJsons, applyCommandType } = require('./utils/jsonHelper');
const { arrayUnique, getOptionalFeatures } = require('./utils/helpers');
const { createAppQuestions, featureQuestions } = require('./utils/questions');
const {
  appTemplateFileExclusions,
  appTypeMap,
  appConstants,
  sourceDirs,
  destinationDirs,
  commandTypes
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
const microAppTemplatePath = path.join(templatesPath, sourceDirs.MICRO_APP);
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
    console.error(chalk.red(`Error: Failed to intialized git repo. ${err}`));
  });
  console.info(`${stdout}`);
};

/**
 * @description: method to create project directory
 * @param {*} appName : name of app
 */
const createProjectDirectory = (appName) => {
  const projectPath = path.join(projectDir, appName);
  if(!dirFileExists(projectPath)) {
    createDir(projectPath);
  }
  createDir(path.join(rootDir, appConstants.VSCODE_DIR));
};

/**
 * @description: method to place storyBook directory under project directory
 */
const copyStorybookDirectory = async () => {
  storybookDir = path.join(rootDir, sourceDirs.STORYBOOK_DIR);
  createDir(storybookDir);
  copyDir(storybookPath, storybookDir, []);
  const storyBookPackagePath = path.join(storybookDir, appConstants.PACKAGE_JSON);

  if(dirFileExists(storyBookPackagePath)){
    try {
      let storyBookPackage = require(path.join(storybookDir, appConstants.PACKAGE_JSON));
      storyBookPackage = applyCommandType(storyBookPackage, getCommandType(rootDir).command);
      await writeJsonFile(storyBookPackagePath, storyBookPackage);
    } catch (e) {
      console.error(chalk.red('Error: Failed to updating storybook package.json file'), e);
    }
  }

};

/**
 * @description: method to create project directory with base template.
 */
const copyBaseDirectory = (appName, appType) => {
  // path of app need to be created inside root director -> apps folder
  microAppPath = path.join(projectDir, appName);
  packagesAppPath = path.join(rootDir, appConstants.PACKAGES_DIR);
  copyStorybookDirectory();

  removeDir(path.join(projectDir, destinationDirs.DOCS_DIR));


  if (appType === sourceDirs.MICRO_APP) {
    removeDir(path.join(projectDir, destinationDirs.WEB_DIR));
    console.info(
      chalk.green(`Start creating ${appType}.`)
    );
    copyDir(microAppTemplatePath, microAppPath, []);
    copyDir(essentialsTemplatePath, microAppPath, []);
  } else {
    renameSync(path.join(projectDir, destinationDirs.WEB_DIR), microAppPath);
    copyDir(baseTemplatePath, microAppPath, []);
    copyDir(essentialsTemplatePath, microAppPath, []);
    // removing pages folder gnerated by turboRepo
    removeDir(path.join(microAppPath, destinationDirs.PAGES_DIR));
  }
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
  const skipInlineExecution = [appConstants.SERVICE_WORKER, appConstants.PWA];

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
          console.error(
            chalk.red(
              `${_feature}/package.json missing. could not find feature dependencies.`
            )
          );
          console.info(chalk.red(`skipping ${_feature}...`));
        }
      } else {
        console.error(chalk.red(`${_feature} missing. feature not found.`));
        console.error(chalk.red(`skipping ${_feature}...`));
      }
    }
  }
  if (done.length > 0) {
    console.info(
      chalk.green('Optional Features Validated. Ready to install Dependencies...')
    );
  }
  return done;
};

/**
 * @description : method to update turbo repo package.json to have info about universal-react
 * @param {*} appType : unser passed app type [ssg, ssr, microApp]
 * @param {*} appName : user selected app name
 */
const addInfoToRootPackageJson = async (appType, appName, features) => {
  const universalReactPackageFile = require(path.join(
    __dirname,
    appConstants.PACKAGE_JSON
  ));
  turboRepoPackageFile = require(path.join(rootDir, appConstants.PACKAGE_JSON));
  const srcStorybookPackageFile = require(path.join(
    storybookDir,
    appConstants.PACKAGE_JSON
  ));
  let mergedJson = mergeJsons(turboRepoPackageFile, {
    name: appConstants.UNIVERSAL_REACT,
    scripts: srcStorybookPackageFile.scripts,
    [appConstants.UNIVERSAL_REACT]: {
      appType,
      apps: [
        {
          appName,
          optionalFeatures: features?.length ? features : []
        }
      ]
    }
  });
  try {
    mergedJson = applyCommandType(mergedJson, getCommandType(rootDir).command);
    await writeJsonFile(path.join(rootDir, appConstants.PACKAGE_JSON), mergedJson);
  } catch (e) {
    console.error(chalk.red('Error: Failed to updating root package.json file'), e);
  }
  console.info(chalk.green('Root package.json updated by universal-react-v2'));
};

/**
 * @description : method to update turbo repo package.json to have info about universal-react
 * @param {*} appType : unser passed app type [ssg, ssr, microApp]
 * @param {*} appName : user selected app name
 * @param {*} features : user selected list of optional features
 */
 const updateRootPackageJson = async (appType, appName, features) => {
  turboRepoPackageFile = require(path.join(rootDir, appConstants.PACKAGE_JSON));
  const universalAppsInfoObj = turboRepoPackageFile[appConstants.UNIVERSAL_REACT];
  const updatedObj = universalAppsInfoObj.apps.map(app => {
    return {
      appName: app.appName,
      optionalFeatures: [
        ...app.optionalFeatures,
        ...features
      ]
    }
  })
  universalAppsInfoObj.apps = updatedObj;
  turboRepoPackageFile[appConstants.UNIVERSAL_REACT] = universalAppsInfoObj;
  try {
    await writeJsonFile(path.join(rootDir, appConstants.PACKAGE_JSON), turboRepoPackageFile);
  } catch (e) {
    console.error(chalk.red('Error: Failed updating root package.json file'), e);
  }
  console.info(chalk.yellow('Success: Root package.json updated by universal-react-v2'));
};

/**
 * @description : method to install depencies of project using [yarn | pnpm | npm]
 * @param {*} installLocation : location of root where dependencies need to install
 * @param {*} isUpdate : boolean
 */
const installDependencies = async (installLocation, isUpdate) => {
  const { command, fileName } = getCommandType(installLocation);
  if(!isUpdate) {
    console.info(chalk.yellow('Removing existing lock file and node_module folder.'));
    try {
      removeDir(path.join(rootDir, appConstants.NODE_MODULES));
      removeDir(path.join(rootDir, fileName));
    } catch (err) {
      console.error(chalk.red('Error: Failed to delete node_module and lock file/folder from root'), err);
    }
  }
  installPackages(command);
};

/**
 * @description : method to identify which command type need to use
 * @param {*} installLocation : localtion of lock files
 * @returns command type
 */
const getCommandType = (installLocation) => {
  const packageLock = path.join(installLocation, appConstants.PACKAGE_LOCK);
  const pnpmLock = path.join(installLocation, appConstants.PNPM_LOCK);
  const yarnLock = path.join(installLocation, appConstants.YARN_LOCK);

  if(dirFileExists(yarnLock)) {
    return {
      command: commandTypes.YARN,
      fileName: appConstants.YARN_LOCK
    };
    // return commandTypes.YARN;
  } 

  if(dirFileExists(pnpmLock)) {
    return {
      command: commandTypes.PNPM,
      fileName: appConstants.PNPM_LOCK
    };
    // return commandTypes.PNPM;
  } 

  if(dirFileExists(packageLock)) {
    return {
      command: commandTypes.NPM,
      fileName: appConstants.PACKAGE_LOCK
    };
    // return commandTypes.NPM
  }

  return {
    command: commandTypes.YARN,
    fileName: appConstants.YARN_LOCK
  };
}

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
  copyBaseDirectory(appName, appType);
  copyTemplateDirectory(appType);
  console.info(chalk.green('Project Created Successfully'));
    
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
  packageFile = applyCommandType(packageFile, getCommandType(rootDir).command);
  await writeJsonFile(path.join(microAppPath, appConstants.PACKAGE_JSON), packageFile);
  const features_found = await copyOptionalTemplates(features, rootDir);
  await addInfoToRootPackageJson(appType, appName, features_found);
  await installDependencies(rootDir, false);
  if (initializeGit != false) {
    intializeGitRepo(rootDir);
  }
};

/**
 * @description : method to update existing universal-react project package.json
 * @param {*} appType : unser passed app type [ssg, ssr, microApp]
 * @param {*} appName : user selected app name
 * @param {*} features : user selected list of optional features
 */
const updateProject = async (appType, appName, features) => {
  const features_found = await copyOptionalTemplates(features, cwd);
  await updateRootPackageJson(appType, appName, features_found);

  if (features_found.length > 0) {
    installDependencies(cwd, true);
  }
};

/************************************** Execution starts ******************************************/
let existingProject = false;
const rootPackagePath = path.join(cwd, appConstants.PACKAGE_JSON);

if (dirFileExists(rootPackagePath)) {
  rootDir = cwd;
  turboRepoPackageFile = require(rootPackagePath);
  if (
    turboRepoPackageFile['name'] === appConstants.UNIVERSAL_REACT &&
    turboRepoPackageFile[appConstants.UNIVERSAL_REACT]
  ) {
    existingProject = true;
  }
}

if (existingProject) {
  //update project
  const projectsList = turboRepoPackageFile[appConstants.UNIVERSAL_REACT]?.apps?.map(app => app.appName);
  console.info(
    chalk.yellow(
      [
        'There are existing projects',
        `[${projectsList.join(',')}]`,
        'arch type. The app will go into update mode.'
      ].join(' ')
    )
  );
  console.info(
    chalk.yellow(
      [
        'Current app type is',
        `[${turboRepoPackageFile[appConstants.UNIVERSAL_REACT].appType}]`
      ].join(' ')
    )
  );

  microAppPath = path.join(
    cwd,
    'apps',
    turboRepoPackageFile[appConstants.UNIVERSAL_REACT].apps[0].appName
  );

  // only get the features that are not already added in the project
  const features = getOptionalFeatures(
    turboRepoPackageFile[appConstants.UNIVERSAL_REACT].apps[0]?.optionalFeatures || []
  );

  if (features.length > 0) {
    const featureQuestion = [
      {
        ...featureQuestions[0],
        choices: features
      }
    ];

    inquirer.prompt(featureQuestion).then((answers) => {
      updateProject(appTypeMap[answers.appType], answers.appName, answers.features);
    });
  } else {
    console.info(chalk.yellow('Nothing to update however :)'));
  }
} else {
  // create new project
  if (isEmptyDir(cwd)) {
    console.log(chalk.bgYellow.bold.black('[:: RECOMMEND PACKAGE MANAGER ::] :- Choose [YARN or PNPM] As Package Manager.'));
    console.log(chalk.green.underline('Setting up a new mono repo project using Turborepo.'));
    setupTurboRepoProject(cwd);
    rootDir = cwd;
    projectDir = path.join(cwd, destinationDirs.APPS_DIR);
  } else {
    console.error(
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
      console.error(chalk.red('Error: An unexpected error occured'));
      process.exit(1);
    }

    // path to turbo project directory
    rootDir = path.join(cwd, recentDir);
    projectDir = path.join(rootDir, destinationDirs.APPS_DIR);
  }

  inquirer.prompt(createAppQuestions).then((answers) => {
    if (appTypeMap[answers.appType] === undefined) {
      console.error(chalk.red('Error: Invalid app type.'));
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
