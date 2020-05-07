const deepmerge = require('deepmerge');

function createNpmDependenciesArray(packageFilePath) {
  const p = require(packageFilePath);
  if (!p.dependencies) {
    return [];
  }

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

module.exports = {
  createNpmDependenciesArray,
  mergeJsons
};
