/**
 * componentExists
 *
 * Check whether the given component exist in either the components or containers directory
 */

const fs = require('fs');
const path = require('path');
const config = require('../constants');

const atomComponents = fs.readdirSync(
  path.join(__dirname, `../../${config.COMPONENT_PATH}atoms`)
);
const moleculeComponents = fs.readdirSync(
  path.join(__dirname, `../../${config.COMPONENT_PATH}molecules`)
);
const organismComponents = fs.readdirSync(
  path.join(__dirname, `../../${config.COMPONENT_PATH}organisms`)
);
const templateComponents = fs.readdirSync(
  path.join(__dirname, `../../${config.COMPONENT_PATH}templates`)
);
const components = atomComponents
  .concat(moleculeComponents)
  .concat(organismComponents)
  .concat(templateComponents);

const hooks = fs.readdirSync(path.join(__dirname, `../../${config.HOOKS_PATH}`));
const stores = fs.readdirSync(path.join(__dirname, `../../${config.STORES_PATH}`));

const componentContainer = {
  components,
  hooks,
  stores
};

function componentExists(comp, category) {
  return componentContainer[category].indexOf(comp) >= 0;
}

module.exports = componentExists;
