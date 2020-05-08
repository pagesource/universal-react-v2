#!/usr/bin/env node
'use strict';

const path = require('path');
const chalk = require('chalk');
const inquirer = require('inquirer');
const { createNpmDependenciesArray, mergeJsons } = require('./utils/jsonHelper');
const {
  appTemplateFileExclusions,
  createAppQuestions,
  universalReactStampData
} = require('./utils/constants');
const { createDir, copyDir, writeJsonFile } = require('./utils/fileDirOps');
const { installPackages } = require('./utils/install');

const templatesPath = path.join(__dirname, 'templates');
const baseTemplatePath = path.join(templatesPath, 'base');
const staticTemplatePath = path.join(templatesPath, 'static');
const ssrTemplatePath = path.join(templatesPath, 'ssr');
let projectDir = '';
const cwd = process.cwd();

const stampFileName = 'universal-react-stamp.json';

const run = (appType, appName) => {
  projectDir = path.join(cwd, appName);
  createDir(projectDir);

  copyDir(baseTemplatePath, projectDir, appTemplateFileExclusions);

  const templatePath = appType === 'static' ? staticTemplatePath : ssrTemplatePath;
  copyDir(templatePath, projectDir, appTemplateFileExclusions);

  console.info(chalk.green('project created successfully'));

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

  try {
    writeJsonFile(path.join(projectDir, stampFileName), universalReactStampData);
  } catch (e) {
    console.error('error creating stamp file');
  }

  console.info(chalk.yellow('installing packages'));
  const depArr = createNpmDependenciesArray(path.join(projectDir, 'package.json'));
  installPackages(projectDir, depArr);
};

inquirer.prompt(createAppQuestions).then((answers) => {
  console.info(JSON.stringify(answers, null, '  '));

  run(answers.appType, answers.appName);
});
