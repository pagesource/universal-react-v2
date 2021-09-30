/**
 * Component Generator
 */

/* eslint strict: ["off"] */

'use strict';

const componentExists = require('../utils/componentExists');
const config = require('../constants');

module.exports = {
  description: 'Add an unconnected component (atoms, molecules, organisms, templates)',
  prompts: [
    {
      type: 'list',
      name: 'type',
      message: 'Select the type of component',
      default: 'Stateless Function',
      choices: () => ['Stateless Function', 'React.Component']
    },
    {
      type: 'input',
      name: 'name',
      message: 'What should it be called?',
      default: 'Button',
      validate: (value) => {
        if (/.+/.test(value)) {
          return componentExists(value, 'components')
            ? 'A component with this name already exists '
            : true;
        }

        return 'The name is required';
      }
    },
    {
      type: 'list',
      name: 'folder',
      message: 'Where do you want to keep this component?',
      default: 'atoms',
      choices: () => ['atoms', 'molecules', 'organisms', 'templates', 'custom']
    },
    {
      when: (data) => data.folder === 'custom',
      type: 'input',
      name: 'customFolder',
      message: 'Give the custom path for the component:',
      default: 'src/components/atoms'
    }
  ],
  actions: (data) => {
    // Generate index.js and index.test.js
    let componentTemplate;
    let folderPath = data.folder
      ? `../${config.COMPONENT_PATH}${data.folder}`
      : `../${config.COMPONENT_PATH}atoms`;

    switch (data.type) {
      case 'Stateless Function': {
        componentTemplate = './component/stateless.js.hbs';
        break;
      }
      default: {
        componentTemplate = './component/class.js.hbs';
      }
    }

    if (data.folder === 'custom') {
      folderPath =
        data.customFolder.trim() === '' ? '../src' : `../src/${data.customFolder.trim()}`;
    }

    const actions = [
      {
        type: 'add',
        path: `${folderPath}/{{properCase name}}/index.js`,
        templateFile: './component/index.js.hbs',
        abortOnFail: true
      },
      {
        type: 'add',
        path: `${folderPath}/{{properCase name}}/{{properCase name}}.js`,
        templateFile: componentTemplate,
        abortOnFail: true
      },
      {
        type: 'add',
        path: `${folderPath}/{{properCase name}}/tests/{{properCase name}}.test.js`,
        templateFile: './component/test.js.hbs',
        abortOnFail: true
      },
      {
        type: 'add',
        path: `${folderPath}/{{properCase name}}/{{properCase name}}.stories.mdx`,
        templateFile: './component/story.mdx.hbs',
        abortOnFail: true
      },
      {
        type: 'add',
        path: `${folderPath}/{{properCase name}}/{{properCase name}}.style.js`,
        templateFile: './component/style.js.hbs',
        abortOnFail: true
      },
      {
        type: 'add',
        path: `${folderPath}/{{properCase name}}/types/index.js`,
        templateFile: './component/types.js.hbs',
        abortOnFail: true
      }
    ];

    return actions;
  }
};
