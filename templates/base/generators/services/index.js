/**
 * Service Generator
 */

/* eslint strict: ["off"] */

'use strict';

const componentExists = require('../utils/componentExists');
const config = require('../constants');

module.exports = {
  description: 'Add a service',
  prompts: [
    {
      type: 'input',
      name: 'name',
      message: 'What should it be called?',
      default: 'ChangeTitle',
      validate: (value) => {
        value = `use${value}`;
        if (/.+/.test(value)) {
          return componentExists(value, 'hooks')
            ? 'A service with this name already exists '
            : true;
        }

        return 'The name is required';
      }
    }
  ],
  actions: (data) => {
    // Generate useHookName.js and useHookName.test.js
    const folderPath = `../${config.SERVICES_PATH}`;
    const actions = [
      {
        type: 'add',
        path: `${folderPath}/{{properCase name}}Service.js`,
        templateFile: './services/index.js.hbs',
        abortOnFail: true
      }
     
    ];

    return actions;
  }
};
