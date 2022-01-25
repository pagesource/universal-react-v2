#!/usr/bin/env node
'use strict';

const path = require('path');
const chalk = require('chalk');
const inquirer = require('inquirer');
const { createNpmDependenciesArray, mergeJsons } = require('./utils/jsonHelper');
const { arrayUnique, getOptionalFeatures } = require('./utils/helpers');
const { setupTemplatePrompts, getOptionalFeaturePrompts } = require('./utils/prompts');
const {
    appTemplateFileExclusions,
    universalReactStampData,
    appTypeMap
} = require('./static/constants');
const {
    createDir,
    copyDir,
    writeJsonFile,
    dirFileExists,
    isEmptyDir,
    getMostRecentDirectory
} = require('./utils/fileDirOps');
const { installPackages } = require('./utils/install');
const { setupTurboRepoProject, getTurboProjectDirPath } = require('./utils/turboRepoSetup');
const { setupProjectTemplates } = require('./controllers/setupProjectTemplateController');
// const { updateProjectTemplates } = require('./controllers/updateProjectTemplateController');
const { setProjectDirPath, setCWD, setGeneratorDirPath, getGeneratorDirPath, getCWD } = require('./static/globals');

const templatesPath = path.join(__dirname, 'templates');
const baseTemplatePath = path.join(templatesPath, 'base');
let appTemplatePath = '';
let projectDir = '';
let turboProjectDir = '';
const stampFileName = 'universal-react-stamp.json';

const util = require('util');
const exec = util.promisify(require('child_process').exec);
const cwd = process.cwd();
const generatorDirPath = __dirname;


/************************************** Execution starts ******************************************/
async function runGenerator() {
    setCWD(process.cwd());
    setGeneratorDirPath(generatorDirPath);
    const stampFilePath = path.join(cwd, stampFileName);

    if (dirFileExists(stampFilePath)) { //update the existing project

        const existingAppInfo = require(stampFilePath); // read stamp file

        // only get the features that are not already added to the project
        const features = getOptionalFeatures(existingAppInfo.optionalFeatures);

        if (features.length > 0) { // give user the option to add optional features to the project
            console.info(
                chalk.yellow(`There is an existing project "${existingAppInfo.appName}" in the current directory. 
                The generator will go into the update mode`)
            );

            const optionalFeaturePrompts = getOptionalFeaturePrompts(features);
            const optionalFeatureResponses = await inquirer.prompt(optionalFeaturePrompts);

            // update the project with optional features, if any
            updateProjectTemplates(optionalFeatureResponses.features);

            console.info(chalk.green(`Project updated`));
        }

        process.exit(1); // successfully exit the generator
    }


    // else create a new project
    console.log();
    console.log(chalk.green('Setting up a new mono repo project using Turborepo, pleaes wait...'));
    //setupTurboRepoProject(cwd);

    // determine turborepo project directory path
    //const turboRepoProjDir = getTurboProjectDirPath(cwd);

    // prompt the user for adding template apps
    const setupTemplateResponses = await inquirer.prompt(setupTemplatePrompts);
    projectDir = path.join(cwd, setupTemplateResponses.appName);
    setProjectDirPath(projectDir);

    // get the optional features list
    // (essentially get all the features since this is the new project setup mode)
    const features = getOptionalFeatures([]);
    const optionalFeaturePrompts = getOptionalFeaturePrompts(features);
    const optionalFeatureResponses = await inquirer.prompt(optionalFeaturePrompts);

    console.log();
    console.log(chalk.green(`Setting up the project template: ${setupTemplateResponses.appType}`));
    // add template apps to the main turborepo project
    setupProjectTemplates(
        appTypeMap[setupTemplateResponses.appType],
        setupTemplateResponses.appName,
        setupTemplateResponses.customBasePath,
        setupTemplateResponses.initializeGit,
        optionalFeatureResponses.optionalFeatures,
        projectDir
    );
    console.log(chalk.green(`Template setup complete`));


    // console.log();
    // console.log(chalk.green(`Installing dependencies from package.json file`));
    // const depArr = await createNpmDependenciesArray(projectDir, 'package.json');
    // installPackages(projectDir, depArr);
    // setupTemplateResponses.initializeGit && intializeGitRepo(projectDir);
};

runGenerator();