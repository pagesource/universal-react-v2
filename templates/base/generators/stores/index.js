/**
 * Store Generator
 */

/* eslint strict: ["off"] */

'use strict';

const componentExists = require('../utils/componentExists');
const config = require('../constants');

module.exports = {
  description: 'Add a Context API Sore',
  prompts: [
    {
      type: 'input',
      name: 'name',
      message: 'What should it be called?',
      default: 'Cart',
      validate: (value) => {
        value = `use${value}`;
        if (/.+/.test(value)) {
          return componentExists(value, 'stores')
            ? 'A store with this name already exists '
            : true;
        }

        return 'The name is required';
      }
    }
  ],
  actions: (data) => {
    const folderPath = `../${config.STORES_PATH}`;
    const actions = [
      {
        type: 'add',
        path: `${folderPath}/{{lowerCase name}}/constants.js`,
        templateFile: './stores/constants.js.hbs',
        abortOnFail: true
      },
      {
        type: 'add',
        path: `${folderPath}/{{lowerCase name}}/actions.js`,
        templateFile: './stores/actions.js.hbs',
        abortOnFail: true
      },
      {
        type: 'add',
        path: `${folderPath}/{{lowerCase name}}/reducer.js`,
        templateFile: './stores/reducer.js.hbs',
        abortOnFail: true
      },
      {
        type: 'add',
        path: `${folderPath}/{{lowerCase name}}/context.jsx`,
        templateFile: './stores/context.jsx.hbs',
        abortOnFail: true
      }
    ];

    return actions;
  }
};
