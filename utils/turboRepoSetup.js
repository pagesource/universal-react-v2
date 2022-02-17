const { execSync } = require('child_process');

/**
 * @description : method to setup turbo repo using create-turbo comamnd
 * @param {*} dir : directory name
 */
function setupTurboRepoProject(dir) {
  execSync('npx create-turbo@latest', { stdio: 'inherit', cwd: dir });
}

module.exports = {
  setupTurboRepoProject
};
