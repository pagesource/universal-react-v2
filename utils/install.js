const npm = require('npm');
const chalk = require('chalk');
const cp = require('child_process');
const { exec } = cp;
const { currentDateTime } = require('./helpers');

/**
 * @description : method to execute install package command.
 * @param {*} commandType : user input command types [npm, yarn, pnpm]
 */
function installPackages(commandType) {
  console.info(chalk.yellow(`[${currentDateTime(new Date())}] - Installing dependencies using ${commandType}. Please wait...`));
  exec(`${commandType} install`, (err, stdout, stderr) => {
    if (err) {
      console.error(chalk.red(`[${currentDateTime(new Date())}] - Error: Failed to install packages. Please run [${commandType} install] manually on root directory.`));
      console.error(`[${currentDateTime(new Date())}] - Error ${commandType} install: ${err}`);
      console.error(`[${currentDateTime(new Date())}] - stdout: ${stderr}`);
    }
  
    // the *entire* stdout and stderr (buffered)
    console.info(`[${currentDateTime(new Date())}] - stdout: ${stdout}`);
  }, );
}

module.exports = {
  installPackages
};
