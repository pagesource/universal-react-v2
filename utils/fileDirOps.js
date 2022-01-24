const os = require('os');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const copydir = require('copy-dir');

function dirFileExists(path) {
  return fs.existsSync(path);
}

function createDir(dir) {
  try {
    fs.mkdirSync(dir);
  } catch (e) {
    console.error(chalk.red('error creating directory'));
    throw e;
  }
}

function copyDir(sourcePath, destPath, exclusions) {
  copydir.sync(
    sourcePath,
    destPath,
    {
      utimes: true, // keep add time and modify time
      mode: true, // keep file mode
      cover: true, // cover file when exists, default is true

      filter: function (stat, filepath) {
        const _filename = path.parse(filepath).base;

        if (stat === 'file' && exclusions.includes(_filename)) {
          return false;
        }
        return true;
      }
    },
    function (err) {
      if (err) {
        throw err;
      }
    }
  );
}

function writeFile(filePath, data) {
  fs.writeFileSync(filePath, data);
}

function writeJsonFile(jsonFilePath, json) {
  try {
    writeFile(jsonFilePath, JSON.stringify(json, null, 2) + os.EOL);
  } catch (e) {
    console.error(chalk.red(`error copying file ${jsonFilePath}`));
    throw e;
  }
}

function isEmptyDir(directoryPath) {
  try {
    const files = fs.readdirSync(directoryPath);
    return files.length === 0;
  } catch (e) {
    return false;
  }
}

function getMostRecentDirectory(directoryPath) {
  let latest = new Date(1900, 1, 1);
  let latestDir = null;
  try {
    const files = fs.readdirSync(directoryPath);
    files.forEach(f => {
      const stats = fs.statSync(path.join(directoryPath, f));
      if (stats.isDirectory()) {
        const birthtime = new Date(stats.birthtime);
        if (birthtime > latest) {
          latest = birthtime;
          latestDir = f;
        }
      }
    });

    return latestDir;
  } catch (e) {
    console.log(e)
    return null;
  }
};

module.exports = {
  dirFileExists,
  createDir,
  copyDir,
  writeJsonFile,
  isEmptyDir,
  getMostRecentDirectory
};
