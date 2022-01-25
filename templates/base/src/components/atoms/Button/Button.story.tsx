import React from 'react';
import { ThemeProvider } from 'styled-components';

import Button from './index';

import { theme } from '../../../themes/theme';

export default {
  component: Button,
  componentName: 'Button',
  componentType: 'Atoms',
  sections: [
    {
      title: 'Button Component',
      sectionFn: () => (
        <ThemeProvider theme={theme}>
          <Button>Click Me</Button>
        </ThemeProvider>
      )
    }
  ]
};
