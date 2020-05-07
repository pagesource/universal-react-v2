module.exports = {
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
      legacyDecorators: true,
    },
  },
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  globals: {
    document: true,
    window: true,
  },
  plugins: [
    'jest',
    'extra-rules',
    'compat',
    'react',
    'react-hooks',
    'jsx-a11y',
    'prettier',
  ],
  extends: ['eslint:recommended', 'airbnb', 'prettier'],
  rules: {
    'max-params': ['error', { max: 7 }],
    'max-statements': ['error', { max: 100 }],
    'max-lines': ['error', { max: 1000 }],
    'max-len': 0,
    complexity: ['error', { max: 10 }],
    'object-shorthand': ['warn', 'properties'],
    'array-callback-return': 'error',
    'no-undef': 'error',
    'extra-rules/no-commented-out-code': 'error',
    'class-methods-use-this': 'off',
    'react/react-in-jsx-scope': 'off',
    'react/button-has-type': 'off',
    'react/jsx-props-no-spreading': 'off',
    'react/jsx-filename-extension': [
      'error',
      {
        extensions: ['.js'],
      },
    ],
    'compat/compat': 'error',
    'prettier/prettier': 1,
    'linebreak-style': 'off',
  },
};
