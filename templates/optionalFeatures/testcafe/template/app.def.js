import { Given } from '@cucumber/cucumber';

import config from './config';

const testEnv = process.env.TEST_ENV;
const { domain } = config[testEnv];

Given(/Everything works fine/, async (t, params) => {
  await t.navigate(domain);
});
