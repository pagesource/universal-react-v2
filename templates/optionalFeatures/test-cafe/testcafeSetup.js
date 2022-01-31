const inquirer = require("inquirer");
const testcafeConfig = require("./testcaferc.json");

const { readdirSync } = require("fs");

const exec = require("child_process").exec;

const getDirectories = (source) =>
  readdirSync(source, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);

const APP_TYPE = getDirectories("./apps");
var fs = require("fs");

const addTestcafeSetup = (envVars) => {
  const dir = `./apps/web/${envVars.APP_NAME}/e2e-${envVars.APP_NAME}/tests`;
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, {
      recursive: true,
    });
    fs.mkdirSync(`${dir}/models/stepDefs`, { recursive: true });
    fs.mkdirSync(`${dir}/features`, { recursive: true });
  }
  
  fs.writeFile(
    `./apps/${envVars.APP_TYPE}/${envVars.APP_NAME}/e2e-${envVars.APP_NAME}/tests/models/index.js`,
    `//assertion goes here`,
    () => console.error("models file created successfully")
  );

  fs.writeFile(
    `./apps/${envVars.APP_TYPE}/${envVars.APP_NAME}/e2e-${envVars.APP_NAME}/tests/features/index.feature`,
    `describe('test',()=>{
      // here goes test scenario's
    })`,
    () => console.error("features folder and file created successfully")
  );
  fs.writeFile(
    `./apps/${envVars.APP_TYPE}/${envVars.APP_NAME}/e2e-${envVars.APP_NAME}/tests/models/stepDefs/index.def.js`,
    `describe('test',()=>{
      //# here goes step defs
    })`,
    () => console.error("stepdef file created successfully")
  );

  fs.writeFile(
    `./apps/${envVars.APP_TYPE}/${envVars.APP_NAME}/e2e-${envVars.APP_NAME}/.testcaferc.json`,
    JSON.stringify(testcafeConfig),
    () => console.error("testcafe config created")
  );

  fs.writeFile(
    `./apps/${envVars.APP_TYPE}/${envVars.APP_NAME}/e2e-${envVars.APP_NAME}/mockFrames.js`,
    `this.window.frames = 0`,
    () => console.error("mockframes file created")
  );

  const cmd = `cd apps/${envVars.APP_TYPE}/${envVars.APP_NAME} && npm i  --save-dev testcafe cucumber gherkin-testcafe @cucumber/cucumber testcafe-cucumber-steps testcafe-reporter-cucumber-json multiple-cucumber-html-reporter`;
  exec(cmd, function (err, stdout) {
    if (err) {
      console.log(err);
    } else {
      console.log(stdout);
    }
  });
};
(async () => {
  const appType = await inquirer.prompt([
    {
      type: "list",
      name: "APP_TYPE",
      message: "Select app type",
      choices: APP_TYPE,
    },
  ]);
  const APP_NAME = getDirectories(`./apps/${appType.APP_TYPE}`);

  const appName = await inquirer.prompt([
    {
      type: "list",
      name: "APP_NAME",
      message: "Select app type",
      choices: APP_NAME,
    },
  ]);
  return { ...appType, ...appName };
})()
  .then((answers) => addTestcafeSetup(answers))
  .catch((err) => console.log(err));
