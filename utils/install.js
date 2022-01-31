const npm = require('npm');
const chalk = require('chalk');
const cp = require('child_process');
const { exec } = cp;

/**
 * @description : method to execute install package command.
 * @param {*} commandType : user input command types [npm, yarn, pnpm]
 */
function installPackages(commandType) {
  console.info(chalk.yellow(`Please Wait. Installing dependencies using ${commandType}...`));
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
