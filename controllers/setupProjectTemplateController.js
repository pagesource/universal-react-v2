
const path = require('path');
const chalk = require('chalk');
const { getGeneratorDirPath, getTemplatesPath, getBaseTemplatePath, getProjectDirPath } = require('../static/globals');
const { createNpmDependenciesArray, mergeJsons } = require('../utils/jsonHelper');
const {
    createDir,
    copyDir,
    writeJsonFile,
    dirFileExists,
    isEmptyDir,
    getMostRecentDirectory
} = require('../utils/fileDirOps');
const { installPackages } = require('../utils/install');
const { appTemplateFileExclusions, universalReactStampData, stampFileName } = require('../static/constants');
const { getDefaultBasePathScript } = require('../scripts/basePaths');

const createStampFile = async (appType, appName, generatorPackageFile, projectDir) => {
    const json = mergeJsons(universalReactStampData, {
        name: generatorPackageFile.name,
        version: generatorPackageFile.version,
        type: appType,
        appName: appName
    });
    const stampFilePath = path.join(projectDir, stampFileName);
    try {
        await writeJsonFile(stampFilePath, json);
    } catch (e) {
        console.error('error creating stamp file');
    }
    console.info(`stamp file created at ${stampFilePath}`);
    console.info(
        chalk.yellow(
            'make sure not to delete the stamp file. [stamp file is important for universal-react-v2 to keep track of the project]'
        )
    );
};

const setupProjectTemplates = async (
    appType,
    appName,
    basePath,
    initializeGit,
    features
) => {
    const projectDir = getProjectDirPath();
    const templatesPath = getTemplatesPath();
    const baseTemplatePath = getBaseTemplatePath();
    const appTemplatePath = path.join(templatesPath, appType);

    // create project directory
    createDir(projectDir);

    // copy base template to the project
    copyDir(baseTemplatePath, projectDir, appTemplateFileExclusions);

    // copy selected template to the project
    copyDir(appTemplatePath, projectDir, appTemplateFileExclusions);


    const basePackage = require(path.join(baseTemplatePath, 'package.json'));
    const appPackage = require(path.join(appTemplatePath, 'package.json'));
    const basePathScript = getDefaultBasePathScript(basePath);

    // merge base and selected template's package.json (+ base script, if selected by the user)
    let packageFile = mergeJsons(basePackage, appPackage);
    packageFile = mergeJsons(packageFile, { name: appName });
    packageFile = basePath ? mergeJsons(packageFile, basePathScript) : packageFile;
    writeJsonFile(path.join(projectDir, 'package.json'), packageFile);

    const generatorPackageFile = require(path.join(getGeneratorDirPath(), 'package.json'));
    await createStampFile(appType, appName, generatorPackageFile, projectDir);
    const features_found = await copyOptionalTemplates(features, projectDir);
    await updateStampFile(features_found, projectDir);
    initializeGit && intializeGitRepo(projectDir);
};

module.exports = {
    setupProjectTemplates
};