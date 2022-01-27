module.exports = {
  stories: [
    '../../src/components/**/**/*.story.js',
    '../../src/components/**/**/*.story.tsx'
  ],
  addons: [
    '@storybook/addon-a11y',
    '@storybook/addon-actions',
    '@storybook/addon-docs',
    '@storybook/addon-knobs',
    '@storybook/addon-links',
    'storybook-design-token',
    '@storybook/addon-viewport'
  ]
};
