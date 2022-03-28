module.exports = {
  extends: [
    'airbnb',
    'airbnb/hooks',
    'airbnb-typescript',
    'plugin:@next/next/recommended',
    'prettier'
  ],
  settings: {
    next: {
      rootDir: ['apps/*/', 'packages/*/']
    }
  },
  parserOptions: {
    project: './tsconfig.json'
  },
  rules: {
    '@next/next/no-html-link-for-pages': 'off',
    'react/jsx-key': 'off',
    'import/no-extraneous-dependencies': 'off',
    'react/function-component-definition': 'off',
    'no-restricted-exports': 'off',
    'react/jsx-props-no-spreading': 'off'
  },
  env: {
    browser: true,
    es2021: true,
    jest: true
  }
};
