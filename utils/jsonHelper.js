const deepmerge = require('deepmerge');

/**
 * @description : method to create list of dependencies with version
 * @param {*} packageFilePath : package.json file path
 * @returns ; list of dependencies with version
 */
function createNpmDependenciesArray(packageFilePath) {
  const p = require(packageFilePath);

  const deps = [];
  for (const mod in p.dependencies) {
    deps.push(`${mod}@${p.dependencies[mod]}`);
  }

  for (const mod in p.devDependencies) {
    deps.push(`${mod}@${p.devDependencies[mod]}`);
  }

  return deps;
}

/**
 * @description : method to merge two json object
 * @param {*} masterJson : parent json object
 * @param {*} slaveJson : slave json which need to merge
 * @returns : Object
 */
function mergeJsons(masterJson, slaveJson) {
  const json = deepmerge(Object.assign({}, masterJson), slaveJson);
  return json;
}

/**
 * @description : method to create correct command type as per user input
 * @param {*} obj : Object type
 * @param {*} commandType : command type ex: npm,yarn,pnpm
 * @returns : object
 */
function applyCommandType(obj, commandType) {
  const packageString = JSON.stringify(obj);
  const regex = new RegExp('{commandType}', 'gi');

  let str = packageString.replace(regex, commandType);

  if(commandType === 'npm') {
    str = packageString.replace(regex, `${commandType} run`);
  }
  
  return JSON.parse(str);
}

/**
 * @description : method to replace string from object
 * @param {*} obj : Object type
 * @param {*} regexStr : string need to replace
 * @param {*} replacedStr : string replace with
 * @returns : Object
 */
function replaceString(obj, regexStr, replacedStr = '') {
  const regex = new RegExp(regexStr, 'gi');
  let str = JSON.stringify(obj).replace(regex, replacedStr);
  return JSON.parse(str);
}

module.exports = {
  createNpmDependenciesArray,
  mergeJsons,
  applyCommandType,
  replaceString
};
