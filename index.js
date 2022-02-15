#!/usr/bin/env node
'use strict';

const path = require('path');
const chalk = require('chalk');
const inquirer = require('inquirer');
const util = require('util');
const exec = util.promisify(require('child_process').exec);

const { createNpmDependenciesArray, mergeJsons, applyCommandType, replaceString } = require('./utils/jsonHelper');
const { arrayUnique, getOptionalFeatures, optionalFeatures, getFilteredFeatures, getRootFeatures, currentDateTime, inRservedDirs } = require('./utils/helpers');
const { createAppQuestions, featureQuestions, addAppQuestions, getUpdateProjectQuestions } = require('./utils/questions');
const {
  appTemplateFileExclusions,
  appTypeMap,
  appConstants,
  sourceDirs,
  destinationDirs,
  commandTypes,
  updateProjectConst,
  featureScope,
  appTypes,
  reservedDir
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
const commonDirPath = path.join(templatesPath, sourceDirs.COMMON_DIR);
const tempDirPath = path.join(commonDirPath, sourceDirs.TEMP_DIR);
const essentialsTemplatePath = path.join(commonDirPath, sourceDirs.ESSENTIALS_DIR);
const srcTemplatePath = path.join(commonDirPath, sourceDirs.SRC_DIR);
const sourcePackagesPath = path.join(commonDirPath, appConstants.PACKAGES_DIR);
const storybookPath = path.join(commonDirPath, sourceDirs.STORYBOOK_DIR);

let appTemplatePath = ''; // template path of [ssg, ssr, microApp] templates
let rootDir = ''; // root folder of generated project ./
let projectDir = ''; // apps folder under root
let storybookDir = ''; // storybook folder under template/common
let microAppPath = ''; // project folder under ./apps/${appName}
let packagesAppPath = ''; // packages folder on the same level of ./apps
let turboRepoPackageFile = ''; // root folder package.json file path
const cwd = process.cwd(); // current working directory
let optionalTemplatesDir = '';

/**
 * @description : method to initialize git repositiy
 * @param {*} dir : path of directory
 */
const intializeGitRepo = async (dir) => {
  const cmd = `cd ${dir} && git init`;
  const { stdout } = await exec(cmd).catch((err) => {
    console.error(chalk.red(`[${currentDateTime(new Date())}] - Error: Failed to intialized git repo. ${err}`));
    process.exit(0);
  });
  console.info(`${stdout}`);
};

/**
 * @description: method to create project directory
 * @param {*} appName : name of app
 */
const createProjectDirectory = (appName, newProject) => {
  const projectPath = path.join(projectDir, appName);
  optionalTemplatesDir = path.join(rootDir, reservedDir.MODULES);
  if(dirFileExists(projectPath)) {
    console.error(chalk.red(`[${currentDateTime(new Date())}] - Error: Project named [${appName}] already exist. Use different app name.`));
    process.exit(0);
  }
  
  if(!dirFileExists(optionalTemplatesDir)) {
    createDir(optionalTemplatesDir);
  }
  if(newProject) {
    createDir(path.join(rootDir, appConstants.VSCODE_DIR));
  }
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
      console.error(chalk.red(`[${currentDateTime(new Date())}] - Error: Failed to updating storybook package.json file`), e);
    }
  }

};

/**
 * @description: method to create project directory with base template.
 */
const copyBaseDirectory = (appName, appType, newProject) => {
  // path of app need to be created inside root director -> apps folder
  microAppPath = path.join(projectDir, appName);
  packagesAppPath = path.join(rootDir, appConstants.PACKAGES_DIR);
  if(newProject) {
    copyStorybookDirectory();
    removeDir(path.join(projectDir, destinationDirs.DOCS_DIR));
  }

  if(!newProject) {
    copyDir(tempDirPath, projectDir, []);
  }

  if (appType === sourceDirs.MICRO_APP) {
    removeDir(path.join(projectDir, destinationDirs.WEB_DIR));
    console.info(chalk.green(`[${currentDateTime(new Date())}] - Start creating ${appType}.`));
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
          console.info(`[${currentDateTime(new Date())}] - ${_feature} added to package.json`);
          done.push(_feature);
        } else {
          console.error(
            chalk.red(
              `[${currentDateTime(new Date())}] - ${_feature}/package.json missing. could not find feature dependencies.`
            )
          );
          console.info(chalk.red(`skipping ${_feature}...`));
        }
      } else {
        console.error(chalk.red(`[${currentDateTime(new Date())}] - ${_feature} missing. feature not found.`));
        console.error(chalk.red(`[${currentDateTime(new Date())}] - Skipping ${_feature}...`));
      }
    }
  }
  if (done.length > 0) {
    console.info(
      chalk.green(`[${currentDateTime(new Date())}] - Optional Features Validated. Ready to install Dependencies...`)
    );
  }
  return done;
};

const copyOptionalTemplatesNewProject = async (features, appName, _path = cwd) => {
  const root = [];
  const apps = [];
  optionalTemplatesDir = path.join(rootDir, reservedDir.MODULES);

  const feat = optionalFeatures.filter(f => {
    if (features.includes(f.value)) {
      const source = path.join(templatesPath, sourceDirs.OPTIONAL_FEATURES_DIR, f.value);

      if (f.scope === 'root') {
        const dest = path.join(optionalTemplatesDir, f.value);
        createDir(dest);
        copyDir(source, dest, []);
        root.push(f.value);
      } else {
        const dest = path.join(projectDir, appName);
        copyDir(source, dest, [appConstants.PACKAGE_JSON]);

        const optPackageFilePath = path.join(source, appConstants.PACKAGE_JSON);

        if(dirFileExists(optPackageFilePath)) {
          const optPackageFile = require(optPackageFilePath);
          const rootPackageFile = require(path.join(dest, appConstants.PACKAGE_JSON));
          const packageFile = mergeJsons(rootPackageFile, optPackageFile);
          writeJsonFile(path.join(dest, appConstants.PACKAGE_JSON), packageFile);
        }
        apps.push(f.value);
      }
    }
  });

  return {
    root,
    apps
  };
};

/**
 * @description : method to update turbo repo package.json to have info about universal-react
 * @param {*} appType : unser passed app type [ssg, ssr, microApp]
 * @param {*} appName : user selected app name
 */
const addInfoToRootPackageJson = async (appType, appName, app, root, workspaces, newProject) => {
  const universalReactPackageFile = require(path.join(
    __dirname,
    appConstants.PACKAGE_JSON
  ));
  turboRepoPackageFile = require(path.join(rootDir, appConstants.PACKAGE_JSON));

  workspaces.forEach(ws => {
    if(!turboRepoPackageFile.workspaces.includes(ws)) {
      turboRepoPackageFile.workspaces.push(ws);
    }
  });

  let mergedJson = mergeJsons(turboRepoPackageFile, {
    name: appConstants.UNIVERSAL_REACT,
    [appConstants.UNIVERSAL_REACT]: {
      apps: [
        {
          appType,
          appName,
          optionalFeatures: app?.length ? app : []
        }
      ],
      rootOptionalFeatures: root
    }
  });

  if(newProject) {
    const srcStorybookPackageFile = require(path.join(
      storybookDir,
      appConstants.PACKAGE_JSON
    ));
    mergedJson = mergeJsons(mergedJson, {
      scripts: {
        ...srcStorybookPackageFile.scripts,
        generate: 'generate'
      },
      devDependencies: {
        '@xt-pagesource/generate-plop': '^0.1.2'
      }
    });
  }

  try {
    // Logging added project info
    const rootFeatures = mergedJson[appConstants.UNIVERSAL_REACT].rootOptionalFeatures;
    console.info(chalk.bold(`[${currentDateTime(new Date())}] - Following apps created successfully.`));
    console.table(mergedJson[appConstants.UNIVERSAL_REACT].apps);

    // Logging added root level optional features info
    if(rootFeatures.length) {
      console.info(chalk.bold(`[${currentDateTime(new Date())}] - Found ${rootFeatures.length} optional feature.`));
      const transformedRootFeatures = rootFeatures.map((item, index) => ({ optionalFeature: item }));
      console.table(transformedRootFeatures);
    }
    mergedJson = applyCommandType(mergedJson, getCommandType(rootDir).command);
    await writeJsonFile(path.join(rootDir, appConstants.PACKAGE_JSON), mergedJson);
  } catch (e) {
    console.error(chalk.red(`[${currentDateTime(new Date())}] - Error: Failed to updating root package.json file`), e);
  }
  console.info(chalk.green(`[${currentDateTime(new Date())}] - Root package.json updated by universal-react-v2`));
};

/**
 * @description : method to update turbo repo package.json to have info about universal-react
 * @param {*} appType : unser passed app type [ssg, ssr, microApp]
 * @param {*} appName : user selected app name
 * @param {*} features : user selected list of optional features
 * @param {*} isUpdateRootFeatures : boolean to check if updating root level optional features
 */
const updateRootPackageJson = async (appType, appName, features, selecteProject, isUpdateRootFeatures) => {
  turboRepoPackageFile = require(path.join(rootDir, appConstants.PACKAGE_JSON));
  const universalAppsInfoObj = turboRepoPackageFile[appConstants.UNIVERSAL_REACT];
  if(!isUpdateRootFeatures) {
    const updatedObj = universalAppsInfoObj.apps.map(app => {
      if(app.appName === selecteProject) {
        return {
          appType: app.appType,
          appName: app.appName,
          optionalFeatures: [
            ...app.optionalFeatures,
            ...features
          ]
        }
      }
      return app;
    })
    universalAppsInfoObj.apps = updatedObj;
  } else {
    universalAppsInfoObj.rootOptionalFeatures = [
      ...universalAppsInfoObj.rootOptionalFeatures,
      ...features
    ];
  }
  turboRepoPackageFile[appConstants.UNIVERSAL_REACT] = universalAppsInfoObj;
  try {
    await writeJsonFile(path.join(rootDir, appConstants.PACKAGE_JSON), turboRepoPackageFile);
  } catch (e) {
    console.error(chalk.red(`[${currentDateTime(new Date())}] - Error: Failed updating root package.json file`), e);
  }
  console.info(chalk.yellow(`[${currentDateTime(new Date())}] - Success: Root package.json updated by universal-react-v2`));
};

/**
 * @description : method to install depencies of project using [yarn | pnpm | npm]
 * @param {*} installLocation : location of root where dependencies need to install
 * @param {*} newProject : boolean
 */
const installDependencies = async (installLocation, newProject) => {
  
  let { command, fileName } = getCommandType(installLocation);
  const cmdType = (command === 'npm' ? 'npm run' : command);
  if(newProject) {
    console.info(chalk.yellow(`[${currentDateTime(new Date())}] - Removing existing lock file and node_module folder. Please wait...`));
    try {
      removeDir(path.join(installLocation, appConstants.NODE_MODULES));
      removeDir(path.join(installLocation, fileName));
    } catch (err) {
      console.error(chalk.red(`[${currentDateTime(new Date())}] - Error: Failed to delete node_module and lock file/folder from root`), err);
    }
  }

  if(newProject) {
    const recentDir = getMostRecentDirectory(cwd);
    if (recentDir && !inRservedDirs(recentDir)) {
      console.info(chalk.green.bold(`[${currentDateTime(new Date())}] - Found [${recentDir}] directory created.`));
      const stepIn = `cd ${recentDir}`
      command = `${stepIn} && ${command}`

      console.info(`

      >>>> We suggest that you begin by typing:

      ${chalk.cyan.bold(stepIn)}
      `);
    };
    console.info(`
      Inside directory, you can run following commands:
      ${chalk.cyan.bold(cmdType)} dev
      - Starts the development server.
      
      ${chalk.cyan.bold(cmdType)} build
      - Builds the app for production.
      
      ${chalk.cyan.bold(cmdType)} generate
        - Generate new components.
    `);
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
  features,
  newProject
) => {
  createProjectDirectory(appName, newProject);
  copyBaseDirectory(appName, appType, newProject);
  copyTemplateDirectory(appType);
  console.info(chalk.green(`[${currentDateTime(new Date())}] - Project Created Successfully`));

  const basePackage = require(path.join(baseTemplatePath, appConstants.PACKAGE_JSON));
  const appPackage = require(path.join(appTemplatePath, appConstants.PACKAGE_JSON));
  const commonPackage = require(path.join(commonDirPath, appConstants.PACKAGE_JSON));
  let packageFile = mergeJsons(basePackage, appPackage);

  if(appType === sourceDirs.MICRO_APP) {
    packageFile.name = appName;
    packageFile.scripts = {
      ...appPackage.scripts,
      ...commonPackage.scripts
    };
    packageFile.dependencies = {
      ...appPackage.dependencies,
      ...commonPackage.dependencies
    };
    packageFile.devDependencies = {
      ...appPackage.devDependencies,
      ...commonPackage.devDependencies
    };
  } else {
    packageFile = mergeJsons(packageFile, commonPackage);
  }
  packageFile = mergeJsons(packageFile, { name: appName });
  if (basePath !== undefined) {
    packageFile = mergeJsons(packageFile, {
      scripts: {
        'env-var': `cross-env BASE_PATH=${basePath}`
      }
    });
  } else {
    packageFile = replaceString(packageFile, '{commandType} env-var && ');
  }
  packageFile = applyCommandType(packageFile, getCommandType(rootDir).command);
  await writeJsonFile(path.join(microAppPath, appConstants.PACKAGE_JSON), packageFile);

  const workspaces = [`${reservedDir.MODULES}/*`];

  if(newProject) {
    const { root, apps } = await copyOptionalTemplatesNewProject(features, appName, rootDir);
    await addInfoToRootPackageJson(appType, appName, apps, root, workspaces, newProject)
  } else {
    const { root, apps } = await copyOptionalTemplatesNewProject(features, appName, rootDir);
    await addInfoToRootPackageJson(appType, appName, apps, root, workspaces, newProject)
  }
  await installDependencies(rootDir, newProject);
  if (initializeGit) {
    intializeGitRepo(rootDir);
  }
};

/**
 * @description : method to update existing universal-react project package.json
 * @param {*} appType : unser passed app type [ssg, ssr, microApp]
 * @param {*} appName : user selected app name
 * @param {*} features : user selected list of optional features
 */
const updateExistingAppProject = async (appType, appName, features, selecteProject) => {
  optionalTemplatesDir = path.join(rootDir, reservedDir.MODULES);
  const { root, apps } = await copyOptionalTemplatesNewProject(features, selecteProject);
  const turboRepoPackageFile = require(path.join(rootDir, appConstants.PACKAGE_JSON));
  const node = turboRepoPackageFile[appConstants.UNIVERSAL_REACT];
  const appNode = node.apps.filter(n => n.appName === selecteProject)[0];
  appNode.optionalFeatures = appNode.optionalFeatures.concat(features);

  node.apps.forEach(n => {
    if (n.appName === selecteProject) {
      n.optionalFeatures = appNode.optionalFeatures;
    }
  });

  writeJsonFile(path.join(rootDir, appConstants.PACKAGE_JSON), turboRepoPackageFile);
  installDependencies(cwd, false);
};

/*  TODOs: Logic of [addNewApp] method need to revisit. As lot of logic is missing to merging package.json files from different source.
    using [initializeNewProject] method for now as skipping operation on newProject flag.
    So we don't need to update same logic at two places.
*/
/**
 * @deprecated : Not using for now
 */
const addNewApp = async (appType, appName, basePath, initializeGit, features, newProject) => {
  const projectPath = path.join(projectDir, appName);
  microAppPath = path.join(projectDir, appName);
  packagesAppPath = path.join(rootDir, appConstants.PACKAGES_DIR);

  if (dirFileExists(projectPath)) {
    console.error(chalk.red(`[${currentDateTime(new Date())}] - Error: Project named [${appName}] already exist. Use different app name.`));
    process.exit(0);
  }
  createDir(projectPath);

  if (appType === sourceDirs.MICRO_APP) {
    copyDir(microAppTemplatePath, microAppPath, []);
    copyDir(essentialsTemplatePath, microAppPath, []);
  } else {
    copyDir(baseTemplatePath, microAppPath, []);
    copyDir(essentialsTemplatePath, microAppPath, []);
  }
  copyDir(sourcePackagesPath, packagesAppPath, []);

  copyDir(srcTemplatePath, path.join(microAppPath, sourceDirs.SRC_DIR), [
    appConstants.PACKAGE_JSON
  ]);

  copyTemplateDirectory(appType);

  optionalTemplatesDir = path.join(rootDir, reservedDir.MODULES);
  const { root, apps } = await copyOptionalTemplatesNewProject(features, appName);
  const turboRepoPackageFile = require(path.join(rootDir, appConstants.PACKAGE_JSON));
  const node = turboRepoPackageFile[appConstants.UNIVERSAL_REACT];
  node.apps.push({
    appType, appName,
    optionalFeatures: features
  });

  writeJsonFile(path.join(rootDir, appConstants.PACKAGE_JSON), turboRepoPackageFile);
  installDependencies(cwd, true);
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
  const uvApps = turboRepoPackageFile[appConstants.UNIVERSAL_REACT]?.apps;

  //TODOs: filtering MICRO_APP for now. Need to remove this filtering and get all list of projects
  //TODOs: add write another logic to find whic optional feature are applicable for Micro Apps.
  const projectsList = uvApps?.filter(item => item.appType !== appTypes.MICRO_APP)?.map(app => app.appName);
  console.info(chalk.bold(`[${currentDateTime(new Date())}] - List of apps already available in repo.`));
  console.table(uvApps);

  // only get the features that are not already added in the project
  const features = getOptionalFeatures(
    turboRepoPackageFile[appConstants.UNIVERSAL_REACT].apps || []
  );

  if (features && Object.keys(features).length > 0) {
    const updateProjectQuestions = getUpdateProjectQuestions(projectsList);

    inquirer.prompt(updateProjectQuestions).then((ans) => {


      // Add new project under apps folder
      if(ans.updateOption === updateProjectConst.ADD_NEW_APP) {
        projectDir = path.join(cwd, destinationDirs.APPS_DIR);
        inquirer.prompt(addAppQuestions).then((answers) => {
          const featureQuestion = [
            {
              ...featureQuestions[0],
              choices: getFilteredFeatures(optionalFeatures, featureScope.APP)
            }
          ];

          // skipping optional feature for micro apps for now.
          if(appTypeMap[answers.appType] === appTypes.MICRO_APP) {
            initializeNewProject(
              appTypeMap[answers.appType],
              answers.appName,
              answers.customBasePath,
              false,
              [],
              false
            );
          } else {
            inquirer.prompt(featureQuestion).then((answers_features) => {
              initializeNewProject(
                appTypeMap[answers.appType],
                answers.appName,
                answers.customBasePath,
                false,
                answers_features.features,
                false
              );
            });
          }
          
          
        });
        return;
      }

      if(!projectsList.length && ans.updateOption === updateProjectConst.APPS_LEVEL) {
        console.warn(chalk.yellow.bold(`[${currentDateTime(new Date())}] - No list of project found to update.`));
        console.warn(chalk.yellow.bold(`[${currentDateTime(new Date())}] - MicroApp app types are not applicable to add optional features for now.`));
        console.warn(chalk.yellow.bold(`[${currentDateTime(new Date())}] - Add new app or add optional feature to root level.`));
        return;
      }
      // Add new optional feature to each app level
      if(ans.updateOption === updateProjectConst.APPS_LEVEL && features[ans.selectedProject].length > 0) {
        const appFeatures = getFilteredFeatures(features[ans.selectedProject], featureScope.APP);
        if(appFeatures.length) {
          const updateFeatureQuestion = [
            {
              when: (data) => ans.selectedProject !== null,
              ...featureQuestions[0],
              choices: appFeatures
            }
          ];
          projectDir = path.join(cwd, destinationDirs.APPS_DIR);
          inquirer.prompt(updateFeatureQuestion).then((answers) => {
            updateExistingAppProject(appTypeMap[answers.appType], answers.appName, answers.features, ans.selectedProject);
          });
          return;
        }
        console.info(chalk.green.bold(`[${currentDateTime(new Date())}] - No optional features found to add for app -> [${ans.selectedProject}]`));
        return;
      }

      // Add new optional feature to root level
      if(ans.updateOption === updateProjectConst.ROOT_LEVEL) {
        const rootFeatures = getRootFeatures(turboRepoPackageFile[appConstants.UNIVERSAL_REACT].rootOptionalFeatures || []);
        if(rootFeatures.length > 0) {
          const updateFeatureQuestion = [
            {
              when: (data) => ans.selectedProject !== null,
              ...featureQuestions[0],
              choices: rootFeatures
            }
          ];
          inquirer.prompt(updateFeatureQuestion).then((answers) => {
            copyOptionalTemplatesNewProject(answers.features, null, rootDir);
            updateRootPackageJson(null, null, answers.features, null, true);
          });
        }
        console.info(chalk.green.bold(`[${currentDateTime(new Date())}] - No optional features found to add at root level.`));
        return;
      }

      console.info(chalk.green.bold.underline(`[${currentDateTime(new Date())}] - Nothing to update however :)`));

    });
  }
} else {
  // create new project
  if (isEmptyDir(cwd)) {
    console.info(chalk.bgYellow.bold.black('[:: RECOMMEND PACKAGE MANAGER ::] :- Choose [YARN or PNPM] As Package Manager.'));
    console.info(chalk.green.underline(`[${currentDateTime(new Date())}] - Setting up a new mono repo project using Turborepo.`));
    setupTurboRepoProject(cwd);
    rootDir = cwd;
    projectDir = path.join(cwd, destinationDirs.APPS_DIR);
  } else {
    console.error(
      chalk.red(
        `[${currentDateTime(new Date())}] - Current working directory is not empty. Please use a clean directory to setup the project`
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
      console.error(chalk.red(`[${currentDateTime(new Date())}] - Error: An unexpected error occured`));
      process.exit(1);
    }

    // path to turbo project directory
    rootDir = path.join(cwd, recentDir);
    projectDir = path.join(rootDir, destinationDirs.APPS_DIR);
  }

  inquirer.prompt(createAppQuestions).then((answers) => {
    if (appTypeMap[answers.appType] === undefined) {
      console.error(chalk.red(`[${currentDateTime(new Date())}] - Error: Invalid app type.`));
    } else {
      // only get the features that are not already added in the project
      const features = optionalFeatures;

      // skipping optional feature for micro apps for now.
      if (features.length > 0 && appTypeMap[answers.appType] !== appTypes.MICRO_APP) {
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
            false,
            answers_features.features,
            true
          );
        });
      } else {
        initializeNewProject(
          appTypeMap[answers.appType],
          answers.appName,
          answers.customBasePath,
          false,
          [],
          true
        );
      }
    }
  });
}
