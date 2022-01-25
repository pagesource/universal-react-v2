const path = require('path');
const chalk = require('chalk');
const { cwd, templatesPath, baseTemplatePath } = require('../static/globals');
const { createNpmDependenciesArray, mergeJsons } = require('../utils/jsonHelper');
const {
    createDir,
    copyDir,
    writeJsonFile,
    dirFileExists,
    isEmptyDir,
    getMostRecentDirectory
} = require('./utils/fileDirOps');

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

const updateProjectTemplates = async (features) => {
    const features_found = await copyOptionalTemplates(features);
    updateStampFile(features_found);
    if (features_found.length > 0) {
        installDependencies(path.join(cwd, 'package.json'), cwd);
    }
};

module.exports = {
    updateProjectTemplates
};