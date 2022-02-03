const appTemplateFileExclusions = [];

const appConstants = {
  UNIVERSAL_REACT: 'universal-react',
  PACKAGE_JSON: 'package.json',
  VSCODE_DIR: '.vscode',
  PACKAGES_DIR: 'packages',
  CONFIG_DIR: 'config',
  SERVICE_WORKER: 'service-worker',
  PWA: 'pwa',
  YARN_LOCK: 'yarn.lock',
  PACKAGE_LOCK: 'package-lock.json',
  PNPM_LOCK: 'pnpm-lock.yaml',
  NODE_MODULES: 'node_modules'
}

const commandTypes = {
  NPM: 'npm',
  YARN: 'yarn',
  PNPM: 'pnpm'
}

const sourceDirs = {
  TEMPLATES_DIR: 'templates',
  MICRO_APP: 'microApp',
  BASE_DIR: 'base',
  COMMON_DIR: 'common',
  ESSENTIALS_DIR: 'essentials',
  SRC_DIR: 'src',
  STORYBOOK_DIR: 'storybook',
  OPTIONAL_FEATURES_DIR: 'optionalFeatures',
  TEMP_DIR: 'temp',
}

const destinationDirs = {
  DOCS_DIR: 'docs',
  WEB_DIR: 'web',
  APPS_DIR: 'apps',
  PAGES_DIR: 'pages'
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
  destinationDirs,
  commandTypes
};
