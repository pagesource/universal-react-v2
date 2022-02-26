const os = require('os');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const copydir = require('copy-dir');
const { currentDateTime } = require('./helpers');

/**
 * @description : method to check file exists or not
 * @param {*} path : path of file
 * @returns : return ture if file exists else return false
 */
function dirFileExists(p) {
  return fs.existsSync(p);
}

/**
 * @description : method to rename directory or filename.
 * @param {*} currPath : current directory or filename
 * @param {*} newPath : new directory or filename
 */
function renameSync(currPath, newPath) {
  try {
    fs.renameSync(currPath, newPath);
  } catch (e) {
    console.error(chalk.red(`${e}: Failed renmaing process.`));
    throw e;
  }
}

/**
 * @description : method to remove folder
 * @param {*} dir : folder name
 */
function removeDir(dirPath) {
  try {
    fs.rmSync(dirPath, { recursive: true, force: true });
  } catch (e) {
    console.error(chalk.red('error removing directory'));
    throw e;
  }
}

/**
 * @description : method to remove file
 * @param {*} filePath : file path
 */
function deleteFile(filePath) {
  try {
    fs.unlinkSync(filePath);
  } catch (e) {
    console.error(chalk.red('error removing file'));
    throw e;
  }
}

/**
 * @description : method to create folder name
 * @param {*} dir : folder name
 */
function createDir(dir) {
  try {
    fs.mkdirSync(dir);
  } catch (e) {
    console.error(chalk.red('error creating directory'));
    throw e;
  }
}

/**
 * @param {*} sourcePath : source path need to copy
 * @param {*} destPath : destination path
 * @param {*} exclusions : list of files and folders name need to be excluded during copy
 */
function copyDir(sourcePath, destPath, exclusions) {
  copydir.sync(
    sourcePath,
    destPath,
    {
      utimes: true, // keep add time and modify time
      mode: true, // keep file mode
      cover: true, // cover file when exists, default is true

      filter(stat, filepath, filename) {
        const fName = path.parse(filepath).base;

        // do not want copy files
        if (stat === 'file' && exclusions.includes(fName)) {
          return false;
        }

        // do not want copy directories
        if (stat === 'directory' && exclusions.includes(filename)) {
          return false;
        }

        return true;
      }
    },
    (err) => {
      if (err) {
        throw err;
      }
    }
  );
}

/**
 * @description : method to create file at given location
 * @param {*} filePath : location where file need to be placed
 * @param {*} data : data need to be written in file
 */
function writeFile(filePath, data) {
  fs.writeFileSync(filePath, data);
}

/**
 * @description : method to write json file at given locaion
 * @param {*} jsonFilePath : location where json file need to be placed
 * @param {*} json : json data need to be written in json file
 */
function writeJsonFile(jsonFilePath, json) {
  try {
    writeFile(jsonFilePath, JSON.stringify(json, null, 2) + os.EOL);
  } catch (e) {
    console.error(
      chalk.red(
        `[${currentDateTime(new Date())}] - Error copying file ${jsonFilePath}. ${e}`
      )
    );
    throw e;
  }
}

/**
 * @description : method to check if directory is empty or not
 * @param {*} directoryPath : location of directory
 * @returns : boolean value
 */
function isEmptyDir(directoryPath) {
  try {
    const files = fs.readdirSync(directoryPath);
    return files.length === 0;
  } catch (e) {
    return false;
  }
}

/**
 * @description : method to find latest created directory
 * @param {*} directoryPath : location of directory
 * @returns : name of latest directory found or null
 */
function getMostRecentDirectory(directoryPath) {
  let latest = new Date(1900, 1, 1);
  let latestDir = null;
  try {
    const files = fs.readdirSync(directoryPath);
    files.forEach((f) => {
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
    console.log(e);
    return null;
  }
}

module.exports = {
  dirFileExists,
  createDir,
  copyDir,
  writeJsonFile,
  isEmptyDir,
  getMostRecentDirectory,
  removeDir,
  renameSync,
  deleteFile
};
