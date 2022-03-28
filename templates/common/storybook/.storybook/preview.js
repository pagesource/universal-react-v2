import React from 'react';
import { configure, storiesOf } from '@storybook/react';

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/
    }
  }
};

const req = require.context('../../', true, /story\.tsx$/);

function loadStories() {
  req.keys().forEach((filename) => {
    const configs = { ...req(filename).default };
    let sections = configs.sections;

    const stories = storiesOf(
      `${configs.componentType}/${configs.componentName}`,
      module
    );
    sections.forEach((section) => stories.add(section.title, section.sectionFn));

    // Create story for Component.
    return stories;
  });
}

configure(loadStories, module);
