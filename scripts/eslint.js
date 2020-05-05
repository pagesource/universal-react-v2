const { CLIEngine } = require('eslint');
const chalk = require('chalk');
const ora = require('ora');

process.on('unhandledRejection', (err) => {
  throw err;
});

const spinner = ora('Linting all scripts...');
spinner.start();

const fix = process.argv.indexOf('--fix') !== -1;
const cli = new CLIEngine({ fix });

const report = cli.executeOnFiles(['**/*.js']);
const formatter = cli.getFormatter();

if (fix) {
  CLIEngine.outputFixes(report);
}

spinner.stop();
console.log(formatter(report.results));

const { errorCount, warningCount } = report;

if (errorCount === 0) {
  if (warningCount === 0) {
    console.log(chalk.green('Linting complete: no warnings or errors found.\n'));
  } else {
    console.log(chalk.yellow('Linting complete: warnings found.\n'));
  }
} else {
  throw new Error('Lint errors found.\n');
}
