const npm = require('npm');
const chalk = require('chalk');

function installPackages(installPath, depArr) {
  npm.load(() => {
    try {
      npm.commands.install(installPath, depArr);
    } catch (e) {
      console.error(chalk.red('error installing packages, please install them manually'));
      throw e;
    }
  });
}

module.exports = {
  installPackages
};
