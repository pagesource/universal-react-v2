import React from 'react';

import Modal from './index';

/* eslint import/no-anonymous-default-export: [2, {"allowObject": true}] */
export default {
  component: Modal,
  componentName: 'Modal',
  componentType: 'Molecule',
  sections: [
    {
      title: 'Modal Component',
      sectionFn: () => <Modal/>
    }
  ]
};
