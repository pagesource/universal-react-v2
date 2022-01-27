import React from 'react';

import Link from './index';

export default {
  component: Link,
  componentName: 'LinkPage',
  componentType: 'Atoms',
  componentChapters: [
    {
      sections: [
        {
          title: 'Link Component',
          sectionFn: () => <Link />,
        },
      ],
    },
  ],
};
