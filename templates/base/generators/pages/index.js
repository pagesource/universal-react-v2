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
      name: 'name',
      message: 'What should be the name of the page?',
      default: 'plp'
    },
    {
      type: 'input',
      name: 'route',
      message: 'Optional: Where to create this page, pages (default) or custom dir under pages?'
    }
  ],
  actions: (data) => {
    // Generate pagename/index.js and pagename/test.js
    const pagePath =
      data.route.trim() !== ''
        ? `../${config.PAGES_PATH}/${data.route}`
        : `../${config.PAGES_PATH}`;
    const actions = [
      {
        type: 'add',
        path: `${pagePath}/{{lowerCase name}}/index.js`,
        templateFile: './pages/index.js.hbs',
        abortOnFail: true
      },
      {
        type: 'modify',
        path: `../${config.ROUTES_PATH}/paths.js`,
        transform: (fileContents, data) => {
          let routeVarName =
            data.route.trim() !== ''
              ? data.route.trim().replace(/\//g, '_').toUpperCase()
              : '';
          routeVarName += `_${data.name.trim().toUpperCase()}`;

          let routeVal = data.route.trim() !== '' ? `/${data.route.trim()}` : '';
          routeVal += `/${data.name.trim().toLowerCase()}`;

          return fileContents + '\n' + `export const ${routeVarName} = '${routeVal}';` + '\n';
        },
        abortOnFail: true
      }
    ];

    return actions;
  }
};
