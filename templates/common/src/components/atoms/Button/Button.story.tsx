import React from 'react';
import { withKnobs, text, optionsKnob } from '@storybook/addon-knobs';

import Button from './index';

/* eslint import/no-anonymous-default-export: [2, {"allowObject": true}] */
export default {
  title: 'Example/Button',
  component: Button,
  // More on argTypes: https://storybook.js.org/docs/react/api/argtypes
  argTypes: {},
  decorators: [withKnobs]
};

const Template = (args) => <Button {...args} />;

export const Primary = Template.bind({});
//@ts-ignore
Primary.args = {
  children: text('Label', 'Button')
};

export const KnobExample = () => (
  <Button
    //@ts-ignore
    theme={optionsKnob(
      'Theme',
      { Primary: 'primary', Secondary: 'secondary' },
      'primary',
      { display: 'select' }
    )}
  >
    {text('Label', 'Button')}
  </Button>
);
