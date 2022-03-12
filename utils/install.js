/* eslint-disable import/newline-after-import */
const chalk = require('chalk');
const cp = require('child_process');
const { spinnerInit } = require('./spinner');

const { spawn } = cp;
const { currentDateTime } = require('./helpers');

/**
 *
 * @param {*} commandType : method to get correct command name and tpe
 * @param {*} stepIn : boolean
 * @returns : commandName and commandType
 */
function getCmdType(commandType, stepIn) {
  const cmdType = commandType === 'npm' ? 'npm run' : commandType;
  let commandName = commandType.split(' ')[0].toUpperCase();
  if (stepIn) {
    commandName = commandType.split('&&')[1].trim().toUpperCase();
  }
  return { commandName, cmdType };
}

/**
 *
 * @param {*} commandType : method to execute commands
 * @param {*} args : list of arguments
 */
function runCommand(commandType, args) {
  const argsInput = Array.isArray(args) ? [...args] : [args];
  console.info(
    `[${chalk.green(
      currentDateTime(new Date())
    )}] - Executing: ${commandType} ${argsInput.join(' ')}`
  );
  const execCommand = spawn(`${commandType}`, argsInput, { shell: true });

  execCommand.stderr.on('data', (data) => {
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

  execCommand.on('exit', () => {
    console.info(
      `[${chalk.green(currentDateTime(new Date()))}] - Command execution completed.`
    );
    spinnerInit.stop();
  });
}

/**
 * @description : method to execute install package command.
 * @param {*} commandType : user input command types [npm run, yarn, pnpm]
 */
function installPackages(commandType, newProject, stepIn, isRecentDir) {
  const { commandName, cmdType } = getCmdType(commandType, stepIn);
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
    runCommand(commandType, 'format', newProject, stepIn);
    console.info(
      `[${chalk.green(currentDateTime(new Date()))}] - Installing dependencies completed.`
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
  installPackages,
  runCommand
};
