const { execSync } = require('child_process');
const { getMostRecentDirectory, dirFileExists } = require('./fileDirOps');
const chalk = require('chalk');

function setupTurboRepoProject(cwd) {
    execSync('npx create-turbo@latest', { stdio: 'inherit', cwd: cwd });
};

function getTurboProjectDirPath(cwd) {
    let turboProjectDir = ''

    if (dirFileExists(path.join(cwd, 'package.json'))) {
        turboProjectDir = cwd;
    } else {
        const recentDir = getMostRecentDirectory(cwd);
        if (!recentDir) {
            console.log(chalk.red('An unexpected error occured'));
            process.exit(1);
        }

        // path to turbo project directory
        turboProjectDir = path.join(cwd, recentDir);
    }

    return turboProjectDir;
};

module.exports = {
    setupTurboRepoProject,
    getTurboProjectDirPath
};