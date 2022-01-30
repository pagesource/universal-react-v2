const npm = require('npm');
const chalk = require('chalk');
const cp = require('child_process');
const { exec } = cp;

function installPackages(commandType) {
  exec(`${commandType} install`, (err, stdout, stderr) => {
    if (err) {
      console.error(chalk.red(`Error: Failed to install packages. Please run [${commandType} install] manually on root directory.`));
      console.error(`Error ${commandType} install: ${err}`);
      console.error(`stdout: ${stderr}`);
    }
  
    // the *entire* stdout and stderr (buffered)
    console.info(`stdout: ${stdout}`);
  }, );
}

module.exports = {
  installPackages
};
