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
function installPackages(commandType, newProject, stepIn, isRecentDir) {
  const cmdType = commandType === 'npm' ? 'npm run' : commandType;
  let commandName = commandType.split(' ')[0].toUpperCase();
  if (stepIn) {
    commandName = commandType.split('&&')[1].trim().toUpperCase();
  }
  console.info(
    chalk.bold(
      `[${currentDateTime(new Date())}] - Using [${commandName}] as package manager.`
    )
  );
  console.info(
    chalk.bold(`[${currentDateTime(new Date())}] - Start Installing dependencies.`)
  );
  spinnerInit.start();

  const installDependencies = spawn(`${commandType}`, ['install'], { shell: true });

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
      )}] - Exit - Installing dependencies completed.`
    );

    if (newProject) {
      console.info(
        `[${chalk.green(currentDateTime(new Date()))}] - ${chalk.cyan.bold(
          '>>>> Success!'
        )}. Your new project setup is ready.`
      );

      if (isRecentDir) {
        console.info(`
  
        >>>> We suggest that you begin by typing:
        ${chalk.cyan.bold(stepIn)}
        `);
      }
      console.info(`
        Inside directory, you can run following commands:

        ${chalk.cyan.bold(cmdType)} dev
          - Starts the development server.
        
        ${chalk.cyan.bold(cmdType)} build
          - Builds the app for production.
        
        ${chalk.cyan.bold(cmdType)} generate
          - Generate new components.
      `);
    }
    spinnerInit.stop();
  });
}

module.exports = {
  installPackages
};
