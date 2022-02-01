const chalk = require('chalk');

const serverLevel = {
  error: 'error',
  warn: 'warn',
  default: 'info'
};

const highlight = {
  blue: 'blue',
  red: 'red',
  default: 'green'
};

/**
 * @description logs to console based on severity
 *
 * @param { {
 *  serverity: Sting,
 *  color: String,
 *  message: String
 * } } Object takes in input and print on console based on arguments provided
 *
 */
function loggerUtil({ severity = 'default', color = 'default', message }) {
  console[serverLevel[severity]](chalk[highlight[color]](message));
}

module.exports = loggerUtil;
