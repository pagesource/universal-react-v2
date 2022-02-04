import React from 'react';
import { ThemeProvider } from 'styled-components';
import { theme } from 'theme';

import Button from './index';

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
