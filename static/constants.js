const appTemplateFileExclusions = [];

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


const DIRECTORY_NAMES = {
  TEMPLATES_DIRECTORY: 'templates',
  BASE: 'base',
  COMMON: 'common',
  MICRO_APP: 'microApp',
  OPTIONAL_FEATURES: 'optionalFeatures',
  SSG: 'ssg',
  SSR: 'ssr'
};

const stampFileName = 'universal-react-stamp.json';

module.exports = {
  appTemplateFileExclusions,
  universalReactStampData,
  appTypeMap,
  DIRECTORY_NAMES,
  stampFileName
};
