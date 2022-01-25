module.exports = {
  stories: [
    "../../src/components/**/**/*.story.js",
    "./apps/**/**/*.story.js",
    "./packages/**/**/*.story.js"
  ],
  addons: [
    "@storybook/addon-a11y",
    "@storybook/addon-actions",
    "@storybook/addon-docs",
    "@storybook/addon-knobs",
    "@storybook/addon-links",
    "storybook-design-token",
    "@storybook/addon-viewport"
  ],
};
