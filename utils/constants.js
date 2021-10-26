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

module.exports = {
  appTemplateFileExclusions,
  universalReactStampData,
  appTypeMap
};
