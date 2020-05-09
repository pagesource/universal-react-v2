/**
 * Page Generator
 */

/* eslint strict: ["off"] */

'use strict';

const componentExists = require('../utils/componentExists');
const config = require('../constants');

module.exports = {
  description: 'Add a page for your application',
  prompts: [
    {
      type: 'input',
      name: 'route',
      message: 'Give the url base of the page:',
      default: 'browse'
    },
    {
      type: 'input',
      name: 'name',
      message: 'What should be the name of the page?',
      default: 'plp'
    }
  ],
  actions: (data) => {
    // Generate useHookName.js and useHookName.test.js
    const pagePath =
      data.route.trim() !== ''
        ? `../${config.PAGES_PATH}/${data.route}`
        : `../${config.PAGES_PATH}`;
    const actions = [
      {
        type: 'add',
        path: `${pagePath}/{{properCase name}}/index.js`,
        templateFile: './pages/index.js.hbs',
        abortOnFail: true
      },
      {
        type: 'modify',
        path: `../${config.ROUTES_PATH}/index.js`,
        transform: (fileContents, data) => {
          let routeVarName =
            data.route.trim() !== ''
              ? data.route.trim().replace(/\//g, '_').toUpperCase()
              : '';
          routeVarName += `_${data.name.trim().toUpperCase()}`;

          let routeVal = data.route.trim() !== '' ? `/${data.route.trim()}` : '';
          routeVal += `/${data.name.trim().toLowerCase()}`;

          return fileContents + `export const ${routeVarName} = '${routeVal}';` + '\n';
        },
        abortOnFail: true
      }
    ];

    return actions;
  }
};
