const chalk = require('chalk');
const cp = require('child_process');
const { Spinner } = require('cli-spinner');
const spinners = require('./spinners.json');

const { exec } = cp;
const { currentDateTime } = require('./helpers');

const spinner = new Spinner('%s');

/**
 * @description : method to execute install package command.
 * @param {*} commandType : user input command types [npm, yarn, pnpm]
 */
function installPackages(commandType) {
  console.info(
    chalk.bold(
      `[${currentDateTime(new Date())}] - Using ${
        commandType.split(' ')[0]
      } as package manager.`
    )
  );
  spinner
    .setSpinnerString(spinners[3])
    .setSpinnerTitle('Installing dependencies. Please wait...');
  spinner.start();
  exec(`${commandType} install`, (err, stdout, stderr) => {
    if (err) {
      console.error(
        chalk.red(
          `[${currentDateTime(
            new Date()
          )}] - Error: Failed to install packages. Please run [${commandType} install] manually on root directory.`
        )
      );
      console.error(
        `[${currentDateTime(new Date())}] - Error ${commandType} install: ${err}`
      );
      console.error(`[${currentDateTime(new Date())}] - stdout: ${stderr}`);
    }

    // the *entire* stdout and stderr (buffered)
    console.info(`[${currentDateTime(new Date())}] - stdout: ${stdout}`);
    if (stdout) {
      spinner.stop();
    }
  });
}

module.exports = {
  installPackages
};
