import React from 'react';

import Button from './index';

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
