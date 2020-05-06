/**
 * componentExists
 *
 * Check whether the given component exist in either the components or containers directory
 */

const fs = require('fs');
const path = require('path');

const atomComponents = fs.readdirSync(path.join(__dirname, '../../components/atoms'));
const moleculeComponents = fs.readdirSync(
  path.join(__dirname, '../../components/molecules')
);
const organismComponents = fs.readdirSync(
  path.join(__dirname, '../../components/organisms')
);
const templateComponents = fs.readdirSync(
  path.join(__dirname, '../../components/templates')
);
const components = atomComponents
  .concat(moleculeComponents)
  .concat(organismComponents)
  .concat(templateComponents);

const componentContainer = {
  components
};

function componentExists(comp, category) {
  return componentContainer[category].indexOf(comp) >= 0;
}

module.exports = componentExists;
