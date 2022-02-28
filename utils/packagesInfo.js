const packages = {
  react: '*',
  next: '*'
};

function getPackageVersion(packageName) {
  return packages[packageName];
}

function setPackageVersion(packageName, version) {
  if (version) {
    packages[packageName] = version;
  }
}

module.exports = {
  getPackageVersion,
  setPackageVersion
};
