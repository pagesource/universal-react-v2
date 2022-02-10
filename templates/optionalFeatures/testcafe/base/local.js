const inquirer = require('inquirer');
const { readdirSync } = require('fs');
const exec = require('child_process').exec;

const executeTests = (ans) => {
  let envStr = 'cross-env-shell CI=false ';
  Object.keys(ans).forEach((k) => {
    envStr += `${k}=${ans[k]} `;
  });

  const testCMD = `${envStr} "npm run clean && npm run test && npm run report"`;
  console.log('Starting e2e test - ', testCMD);

  exec(testCMD, function (err, stdout) {
    if (err) {
      console.log(err);
    }

    console.log(stdout);
  });
};

const getDirectories = (source) =>
  readdirSync(source, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

const APP_OPTIONS = getDirectories('./apps');
const ENV_OPTIONS = ['dev'];

inquirer
  .prompt([
    {
      type: 'list',
      name: 'APP_NAME',
      message: 'Select App',
      choices: APP_OPTIONS
    },
    {
      type: 'list',
      name: 'TEST_ENV',
      message: 'Select test env',
      choices: ENV_OPTIONS
    }
  ])
  .then((ans) => executeTests(ans))
  .catch((err) => {
    console.log('Something went wrong - ', err);
  });
