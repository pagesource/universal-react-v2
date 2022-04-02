const appTemplateFileExclusions = [];

const apiEndpoints = {
  reactLatest: 'https://registry.npmjs.org/-/v1/search?text=react&size=1',
  nextLatest: 'https://registry.npmjs.org/-/v1/search?text=next&size=1'
};

const appTypes = {
  MICRO_APP: 'microApp',
  SSR_APP: 'ssr',
  SSG_APP: 'ssg'
};

const reservedDir = {
  MODULES: 'modules'
};

const ignoreDirs = ['modules', '.vscode'];

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
  NODE_MODULES: 'node_modules',
  HUSKY_RC: '.huskyrc.json',
  ROOT: 'root'
};

const commandTypes = {
  NPM: 'npm',
  YARN: 'yarn',
  PNPM: 'pnpm'
};

const sourceDirs = {
  TEMPLATES_DIR: 'templates',
  MICRO_APP: appTypes.MICRO_APP,
  BASE_DIR: 'base',
  COMMON_DIR: 'common',
  ESSENTIALS_DIR: 'essentials',
  SRC_DIR: 'src',
  STORYBOOK_DIR: 'storybook',
  OPTIONAL_FEATURES_DIR: 'optionalFeatures',
  TEMP_DIR: 'temp'
};

const destinationDirs = {
  DOCS_DIR: 'docs',
  WEB_DIR: 'web',
  APPS_DIR: 'apps',
  PAGES_DIR: 'pages'
};

const appTypeMap = {
  'SSR(Server-side rendering)': appTypes.SSR_APP,
  'SSG(Static site generation)': appTypes.SSG_APP,
  'Micro-App': appTypes.MICRO_APP
};

const universalReactStampData = {
  name: 'universal-react-stamp',
  version: '',
  type: '',
  optionalFeatures: [],
  description:
    'This file is needed by universal-react app for future upgrades. Please do not delete this file.'
};

const updateProjectConst = {
  APPS_LEVEL: 'APPS_LEVEL',
  ROOT_LEVEL: 'ROOT_LEVEL',
  ADD_NEW_APP: 'ADD_NEW_APP'
};

const featureScope = {
  APP: 'app',
  ROOT: 'root'
};

module.exports = {
  appTemplateFileExclusions,
  universalReactStampData,
  appTypeMap,
  appConstants,
  sourceDirs,
  destinationDirs,
  commandTypes,
  updateProjectConst,
  featureScope,
  appTypes,
  reservedDir,
  apiEndpoints,
  ignoreDirs
};
