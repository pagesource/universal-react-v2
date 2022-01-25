import React from 'react';

import Link from './index';

export default {
  component: Link,
  componentName: 'LinkPage',
  componentType: 'Atoms',
  sections: [
    {
      title: 'Link Component',
      sectionFn: () => <Link href="/">Click Me</Link>
    }
  ]
};
