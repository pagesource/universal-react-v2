const { execSync } = require('child_process');

function setupTurboRepoProject(dir) {
    execSync('npx create-turbo@latest', { stdio: 'inherit', cwd: dir });
};

module.exports = {
    setupTurboRepoProject
};