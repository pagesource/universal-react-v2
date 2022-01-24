const { execSync } = require('child_process');

function setupTurboRepoProject() {
    execSync('npx create-turbo@latest', { stdio: 'inherit', cwd: process.cwd() });
};

module.exports = {
    setupTurboRepoProject
};