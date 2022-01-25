const path = require('path');
const { DIRECTORY_NAMES } = require('./constants');

let cwd = '';
let projectDir = '';
let generatorDirPath = '';

const setProjectDirPath = dir => projectDir = dir;
const getProjectDirPath = () => projectDir;

const setGeneratorDirPath = p => generatorDirPath = p;
const getGeneratorDirPath = () => generatorDirPath;

const setCWD = c => cwd = c;
const getCWD = () => cwd;


const getTemplatesPath = () => path.join(getGeneratorDirPath(), DIRECTORY_NAMES.TEMPLATES_DIRECTORY);
const getBaseTemplatePath = () => path.join(getTemplatesPath(), DIRECTORY_NAMES.BASE);

module.exports = {
    getTemplatesPath,
    getBaseTemplatePath,

    setProjectDirPath,
    getProjectDirPath,
    setGeneratorDirPath,
    getGeneratorDirPath,
    setCWD,
    getCWD
};