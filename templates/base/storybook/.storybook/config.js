import React from 'react';
import { configure, addDecorator, addParameters } from '@storybook/react';
import { DocsPage, DocsContainer } from '@storybook/addon-docs/blocks';
import { withKnobs } from '@storybook/addon-knobs';
import { withA11y } from '@storybook/addon-a11y';

addDecorator(withKnobs);
addDecorator(withA11y);

addDecorator((storyFn, context) => (
  <React.Fragment>
    {storyFn(context)}
  </React.Fragment>
));

addParameters({
  options: {
    name: `Universal React V2`,
    url: 'https://github.com/pagesource/universal-react-v2',
  },
  docs: {
    container: DocsContainer,
    page: DocsPage,
  },
});

const req = require.context('../../src/components/', true, /.stories\.(js|mdx)$/);
function loadStories() {
  req.keys().forEach((filename) => req(filename));
}

configure(loadStories, module);
