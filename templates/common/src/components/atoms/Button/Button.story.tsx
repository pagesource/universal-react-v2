import React from 'react';

import Button from './index';

/* eslint import/no-anonymous-default-export: [2, {"allowObject": true}] */
export default {
  component: Button,
  componentName: 'Button',
  componentType: 'Atoms',
  sections: [
    {
      title: 'Button Component',
      sectionFn: () => <Button>Click Me</Button>
    }
  ]
};
