/**
 * Set these values in env for test run
 * APP_NAME - Directory name in e2e apps
 * TEST_ENV - Use for different builds e.g. dev, it, uat
 * CI - set true for CI test runs
 */

const getSrcFiles = () => {
  const appName = process.env.APP_NAME;
  const defs = `apps/${appName}/**/*.def.js`;
  const features = `apps/${appName}/**/*.feature`;
  return [defs, features];
};

const baseConfig = {
  browsers: 'chrome',
  proxy: '',
  src: getSrcFiles(),
  screenshots: {
    path: 'screenshots/',
    takeOnFails: true,
    pathPattern: '${DATE}_${TIME}/test-{TEST-INDEX}/${USERAGENT}/${FILE_INDEX}.png'
  },
  reporter: [
    {
      name: 'spec'
    },
    {
      name: 'cucumber-json',
      output: 'cucumber-json-reports/report.json'
    }
  ],
  quarantineMode: false,
  stopOnFirstFail: false,
  skipJsErrors: true,
  skipUncaughtErrors: true,
  concurrency: 3,
  speed: 1,
  pageLoadTimeOut: 3000,
  assertionTimeout: 3000,
  selectorTimeout: 3000,
  disablePageCaching: true
};

const ciConfig = {
  browsers: 'chromium:headless',
  clientScripts: ['mockFrames.js'],
  hostname: 'localhost'
};

const createConfig = () => {
  const isCI = process.env.CI === 'true';
  return isCI ? { ...baseConfig, ...ciConfig } : baseConfig;
};

module.exports = createConfig();
