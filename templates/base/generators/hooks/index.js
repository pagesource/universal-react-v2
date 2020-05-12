/**
 * Hooks Generator
 */

/* eslint strict: ["off"] */

'use strict';

const componentExists = require('../utils/componentExists');
const config = require('../constants');

module.exports = {
  description: 'Add a react custom hook',
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
            ? 'A hook with this name already exists '
            : true;
        }

        return 'The name is required';
      }
    }
  ],
  actions: (data) => {
    // Generate useHookName.js and useHookName.test.js
    const folderPath = `../${config.HOOKS_PATH}`;
    const actions = [
      {
        type: 'add',
        path: `${folderPath}/use{{properCase name}}/index.js`,
        templateFile: './hooks/index.js.hbs',
        abortOnFail: true
      },
      {
        type: 'add',
        path: `${folderPath}/use{{properCase name}}/test.js`,
        templateFile: './hooks/test.js.hbs',
        abortOnFail: true
      }
    ];

    return actions;
  }
};
