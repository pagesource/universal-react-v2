const { featureScope } = require('./constants');

function arrayUnique(array) {
  const a = array.concat();
  for (let i = 0; i < a.length; i = i + 1) {
    for (let j = i + 1; j < a.length; j = j + 1) {
      if (a[i] === a[j]) {
        a.splice(j, 1);
        j = j - 1;
      }
    }
  }

  return a;
}

// setup assumes that a dir inside templates/optionalFeatures exists with the same name as the value below
const optionalFeatures = [
  { name: 'Add Test Cafe Setup', value: 'testcafe', scope: featureScope.ROOT },
  { name: 'Add Service Workers setup and guide', value: 'service-worker', scope: featureScope.APP },
  { name: 'Add PWA setup guide', value: 'pwa', scope: featureScope.APP },
  { name: 'Add Mock Api setup', value: 'mock-api', scope: featureScope.ROOT }
];

const getFilteredFeatures = (features, scope) => {
  return features.filter(item => item.scope === scope);
}

const getOptionalFeatures = (features) => {
  const result = features.map(item => {
    const featureChoicesObj = {};
    const featureChoices = [];
    for (let i = 0; i < optionalFeatures.length; i = i + 1) {
      const feat = optionalFeatures[i];
      const features = item.optionalFeatures;
      const includes = features.includes(feat.value);
      if(!includes) {
        featureChoices.push(feat);
      }
      featureChoicesObj[item.appName] = featureChoices;

    }
    return featureChoicesObj;
  });

  return result.reduce((prev, curr) => {
    return {...prev, ...curr};
  }, {});
};

const getRootFeatures = (rootFeatures) => {
  const finalList = [];
  const rootScopedFeatures = getFilteredFeatures(optionalFeatures, featureScope.ROOT);
  return rootScopedFeatures.filter(item => {
    return !rootFeatures.includes(item.value);
  });
}

module.exports = {
  arrayUnique,
  getOptionalFeatures,
  optionalFeatures,
  getFilteredFeatures,
  getRootFeatures
};
