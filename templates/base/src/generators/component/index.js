/**
 * Component Generator
 */

/* eslint strict: ["off"] */

'use strict';

const componentExists = require('../utils/componentExists');

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
      choices: () => ['atoms', 'molecules', 'organisms', 'templates']
    }
  ],
  actions: (data) => {
    // Generate index.js and index.test.js
    let componentTemplate;

    switch (data.type) {
      case 'Stateless Function': {
        componentTemplate = './component/stateless.js.hbs';
        break;
      }
      default: {
        componentTemplate = './component/class.js.hbs';
      }
    }

    const actions = [
      {
        type: 'add',
        path: '../components/{{ folder }}/{{properCase name}}/index.js',
        templateFile: './component/index.js.hbs',
        abortOnFail: true
      },
      {
        type: 'add',
        path: '../components/{{ folder }}/{{properCase name}}/{{properCase name}}.js',
        templateFile: componentTemplate,
        abortOnFail: true
      },
      {
        type: 'add',
        path:
          '../components/{{ folder }}/{{properCase name}}/tests/{{properCase name}}.test.js',
        templateFile: './component/test.js.hbs',
        abortOnFail: true
      },
      {
        type: 'add',
        path:
          '../components/{{ folder }}/{{properCase name}}/{{properCase name}}.story.js',
        templateFile: './component/story.js.hbs',
        abortOnFail: true
      },
      {
        type: 'add',
        path:
          '../components/{{ folder }}/{{properCase name}}/{{properCase name}}.style.js',
        templateFile: './component/style.js.hbs',
        abortOnFail: true
      },
      {
        type: 'add',
        path: '../components/{{ folder }}/{{properCase name}}/types/index.js',
        templateFile: './component/types.js.hbs',
        abortOnFail: true
      }
    ];

    return actions;
  }
};
