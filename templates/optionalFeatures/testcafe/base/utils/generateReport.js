const reporter = require('multiple-cucumber-html-reporter');

const reportTime = new Date().toISOString();
const appName = process.env.APP_NAME;
const testEnv = process.env.TEST_ENV;

const config = {
  reportName: 'Testcafe E2E Report',
  jsonDir: 'cucumber-json-reports',
  reportPath: 'cucumber-json-reports/html',
  openReportInBrowser: true,
  disableLog: true,
  displayDuration: true,
  durationInMS: true,
  customData: {
    title: 'Test run information',
    data: [
      { label: 'App name', value: appName },
      { label: 'Test env', value: testEnv },
      { label: 'Time', value: reportTime }
    ]
  }
};

reporter.generate(config);
