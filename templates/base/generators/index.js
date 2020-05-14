/**
 * generator/index.js
 *
 * Exports the generators so plop knows them
 */

const componentGenerator = require('./component/index.js');
const hooksGenerator = require('./hooks/index.js');
const pagesGenerator = require('./pages/index.js');
const storesGenerator = require('./stores/index.js');

module.exports = (plop) => {
  plop.setGenerator('components', componentGenerator);
  plop.setGenerator('hooks', hooksGenerator);
  plop.setGenerator('pages', pagesGenerator);
  plop.setGenerator('stores', storesGenerator);
  plop.addHelper('curly', (object, open) => (open ? '{' : '}'));
};
