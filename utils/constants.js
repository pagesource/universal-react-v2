const appTemplateFileExclusions = [];

const appConstants = {
  UNIVERAL_REACT: 'universal-react',
  PACKAGE_JSON: 'package.json',
  VSCODE_DIR: '.vscode'
}

const sourceDirs = {
  TEMPLATES_DIR: 'templates',
  BASE_DIR: 'base',
  COMMON_DIR: 'common',
  ESSENTIALS_DIR: 'essentials',
  SRC_DIR: 'src',
  STORYBOOK_DIR: 'storybook',
  OPTIONAL_FEATURES_DIR: 'optionalFeatures'
}

const destinationDirs = {
  DOCS_DIR: 'docs',
  WEB_DIR: 'web',
  APPS_DIR: 'apps'
}

const appTypeMap = {
  'SSR(Server-side rendering)': 'ssr',
  'SSG(Static site generation)': 'ssg',
  'Micro-App': 'microApp'
};

const universalReactStampData = {
  name: 'universal-react-stamp',
  version: '',
  type: '',
  optionalFeatures: [],
  description:
    'This file is needed by universal-react app for future upgrades. Please do not delete this file.'
};

module.exports = {
  appTemplateFileExclusions,
  universalReactStampData,
  appTypeMap,
  appConstants,
  sourceDirs,
  destinationDirs
};
