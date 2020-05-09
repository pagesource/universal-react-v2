
import fetch from 'isomorphic-unfetch';

/**
 * USAGE: ->
 * import Logger from '../utils/Logger';
 *  call as :-
 * Logger.error({ message: 'Here is the error' });
 */


/**
 * Will be modified once the post method is configured on server
 */
const submitLogMsg = (msg) => {
  const { message } = msg;
  fetch('/mock/logs.json', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      message
    })
  }).catch((err) => { console.log('log-err=====>>>', err) })
}

const callLog = ({ logLevels, logLevel, msgObj }) => {
  const isDev = process.env.NODE_ENV !== 'production';
  const isServer = !process.browser;
  const isLogDisabled = !!process.env.LOG_DISABLED;
  const currentLogLevel = process.env.LOG_LEVEL || (isDev ? 'debug' : 'info');
  const [msg] = msgObj;
  if (!isLogDisabled && logLevels[logLevel] <= logLevels[currentLogLevel]) {
    if (isDev || isServer) {
      console[logLevel](msg);
    } else {
      submitLogMsg(msg);
    }
  }
}

/**
 * Returns different logs -> error, info, log, warn, debug as methods
 */
const LogWrapper = () => {
  const logLevels = {
    error: 0,
    log: 1,
    warn: 2,
    info: 3,
  }

  let loggingObj = {};

  Object.keys(logLevels).forEach(level => {
    loggingObj[level] = (...args) => {
      callLog({ logLevels, logLevel: level, msgObj: args })
    }
  })
  return loggingObj;
}

export default LogWrapper();
