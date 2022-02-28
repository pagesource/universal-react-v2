/* eslint-disable import/newline-after-import */
const chalk = require('chalk');
const cp = require('child_process');
const { spinnerInit } = require('./spinner');

const { spawn } = cp;
const { currentDateTime } = require('./helpers');

/**
 * @description : method to execute install package command.
 * @param {*} commandType : user input command types [npm run, yarn, pnpm]
 */
function installPackages(commandType) {
  console.info(
    chalk.bold(
      `[${currentDateTime(new Date())}] - Using [${commandType
        .split(' ')[0]
        .toUpperCase()}] as package manager.`
    )
  );
  console.info(
    chalk.bold(`[${currentDateTime(new Date())}] - Start Installing dependencies.`)
  );
  spinnerInit.start();

  const installDependencies = spawn(`${commandType}`, ['install']);

  installDependencies.stdout.on('data', (data) => {
    console.info(`[${chalk.green(currentDateTime(new Date()))}] - ${data}`);
  });

  installDependencies.stderr.on('data', (data) => {
    if (data.includes('warning')) {
      console.error(
        `[${chalk.yellow(currentDateTime(new Date()))}] - ${chalk.yellow(data)}`
      );
    } else {
      console.error(
        `[${chalk.yellow(currentDateTime(new Date()))}] - ${chalk.red(data)}`
      );
    }
  });

  installDependencies.on('exit', () => {
    console.info(
      `[${chalk.green(
        currentDateTime(new Date())
      )}] - Exit. Installing dependencies completed.`
    );
    spinnerInit.stop();
  });
}

module.exports = {
  installPackages
};
