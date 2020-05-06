import React from 'react';
import { configure, addDecorator, addParameters } from '@storybook/react';
import { DocsPage, DocsContainer } from '@storybook/addon-docs/blocks';
import { withKnobs } from '@storybook/addon-knobs';
import { withDesign } from 'storybook-addon-designs';
import { withA11y } from '@storybook/addon-a11y';
import { ThemeProvider } from 'styled-components';
import theme from '../../src/styles/themes/base/index';
import '../../src/styles/cssIncludes';
// import GlobalStyles from '../src/styles';

addDecorator(withKnobs);
addDecorator(withA11y);
addDecorator(withDesign);

addDecorator((storyFn, context) => (
  <React.Fragment>
    {/* <GlobalStyles /> */}
    <ThemeProvider theme={theme}>{storyFn(context)}</ThemeProvider>
  </React.Fragment>
));

// TODO: to be updated as per style guide later

// const cssReq = require.context('!!raw-loader!../lib/styles/themes/base/tokens/', true, /.\.css$/);
// const cssTokenFiles = cssReq
//   .keys()
//   .map((filename) => ({ filename, content: cssReq(filename).default }));

// const svgIconsReq = require.context('!!raw-loader!../lib/styles/themes/base', true, /.\.svg$/);
// const svgIconTokenFiles = svgIconsReq
//   .keys()
//   .map((filename) => ({ filename, content: svgIconsReq(filename).default }));

addParameters({
  options: {
    name: `Universal React V2`,
    url: 'https://github.com/pagesource/universal-react-v2',
  },
  docs: {
    container: DocsContainer,
    page: DocsPage,
  },
  design: {
    type: 'figma',
    url: 'https://www.figma.com/file/GBCGqs11KNeUyPksQzEMw0hr/Wireframing/duplicate?node-id=0%3A1', // TODO: to be updated as per style guide later
  },
  // designToken: {
  //   files: {
  //     css: cssTokenFiles,
  //     svgIcons: svgIconTokenFiles,
  //   },
  // },
});

const req = require.context('../../src/components/', true, /.stories\.(js|mdx)$/);
function loadStories() {
  req.keys().forEach((filename) => req(filename));
}

configure(loadStories, module);