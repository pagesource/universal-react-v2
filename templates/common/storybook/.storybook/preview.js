import React from 'react';
import { addDecorator, configure, storiesOf } from '@storybook/react';
import { ThemeProvider } from 'styled-components';

import { theme } from 'themes';

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/
    }
  }
};

addDecorator((storyFn, context) => (
  <ThemeProvider theme={theme}>{storyFn(context)}</ThemeProvider>
));

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
