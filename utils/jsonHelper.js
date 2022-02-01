const deepmerge = require('deepmerge');

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

function mergeJsons(masterJson, slaveJson) {
  const json = deepmerge(Object.assign({}, masterJson), slaveJson);
  return json;
}

function applyCommandType(obj, commandType) {
  const packageString = JSON.stringify(obj);
  const regex = new RegExp('{commandType}', 'gi');

  let str = packageString.replace(regex, commandType);

  if(commandType === 'npm') {
    str = packageString.replace(regex, `${commandType} run`);
  }
  
  return JSON.parse(str);
}

module.exports = {
  createNpmDependenciesArray,
  mergeJsons,
  applyCommandType
};
