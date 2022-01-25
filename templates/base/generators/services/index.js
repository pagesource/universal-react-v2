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
      name: 'isGraphql',
      message: 'Will it be a graphql call?',
      default: 'no',

        return 'The name is required';
      }
    },
    {
      type: 'input',
      name: 'name',
      message: 'What should it be called?',
      default: 'ChangeTitle',
      validate: (value) => {
        value = `${value}Service`;
        if (/.+/.test(value)) {
          return componentExists(value, 'service')
            ? 'A service with this name already exists '
            : true;
        }

        return 'The name is required';
      }
    }
  ],
  actions: (data) => {
    // Generate serviceName.js 
    const folderPath =  `../${config.SERVICES_PATH}`;
    const actions = [
      {
        type: 'add',
        path: `${folderPath}/{{properCase name}}Service.js`,
        templateFile: isGraphql == 'yes'? './services/graphql.js.hbs' : './services/index.js.hbs',
        abortOnFail: true
      }
     
    ];

    return actions;
  }
};
