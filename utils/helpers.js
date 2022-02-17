const { format } = require('date-and-time');
const { featureScope, reservedDir } = require('./constants');

const currentDateTime = (date) => format(date, 'MM/DD/YYYY HH:mm:ssA [GMT]Z');

function arrayUnique(array) {
  const a = array.concat();
  for (let i = 0; i < a.length; i += 1) {
    for (let j = i + 1; j < a.length; j += 1) {
      if (a[i] === a[j]) {
        a.splice(j, 1);
        j -= 1;
      }
    }
  }

  return a;
}

const inRservedDirs = (dir) => Object.values(reservedDir).includes(dir);

// setup assumes that a dir inside templates/optionalFeatures exists with the same name as the value below
const optionalFeatures = [
  { name: 'Add Test Cafe Setup', value: 'testcafe', scope: featureScope.ROOT },
  {
    name: 'Add Service Workers setup and guide',
    value: 'service-worker',
    scope: featureScope.APP
  },
  { name: 'Add PWA setup guide', value: 'pwa', scope: featureScope.APP },
  { name: 'Add Mock Api setup', value: 'mock-api', scope: featureScope.ROOT }
];

const getFilteredFeatures = (features, scope) =>
  features.filter((item) => item.scope === scope);

const getOptionalFeatures = (features) => {
  const result = features.map((item) => {
    const featureChoicesObj = {};
    const featureChoices = [];
    for (let i = 0; i < optionalFeatures.length; i += 1) {
      const feat = optionalFeatures[i];
      if (!item.optionalFeatures.includes(feat.value)) {
        featureChoices.push(feat);
      }
      featureChoicesObj[item.appName] = featureChoices;
    }
    return featureChoicesObj;
  });

  return result.reduce((prev, curr) => ({ ...prev, ...curr }), {});
};

const getRootFeatures = (rootFeatures) => {
  const rootScopedFeatures = getFilteredFeatures(optionalFeatures, featureScope.ROOT);
  return rootScopedFeatures.filter((item) => !rootFeatures.includes(item.value));
};

module.exports = {
  arrayUnique,
  getOptionalFeatures,
  optionalFeatures,
  getFilteredFeatures,
  getRootFeatures,
  currentDateTime,
  inRservedDirs
};
