
import fetch from 'isomorphic-unfetch';

/**
 * USAGE: ->
 * import Logger from '../utils/Logger';
 *  call as :-
 * Logger.error({ message: 'Here is the error',
 *    event: {
      name: 'event20', id: 657,
      module: 'modA',
      type: "load|interaction|redirect" ,
      data: { a: "hhhh" },
    },
    error: {
      code: 'ABC',
      message: 'message',
      operationName: 'testing'
    },
    service: {
      name: 'serviceName',
      path: 'servicePath',
    } });
 */

/**
 * @param {object} msg --> msg Object
 * @param {string}  logLevel --> string (info, log, error)
 * returns an object with log data to be sent in api
 */
const getLogObject = ({ msg, logLevel }) => {
  if (process.browser) {
    const { message, event: { name: eventName, id, module, type, data }, service: { name: serviceName, path }, error: { code, message: errMsg, operationName } } = msg || {};
    let location = '';
    let host = '';
    let userAgent = '';
    if (process.browser && window && window.location) {
      location = window.location.href;
      host = window.location.host;
    }
    if (process.browser && navigator) {
      userAgent = navigator.userAgent;
    }
    return {
      appName: "universal-react", //Mandatory
      logLevel,
      message,
      browser: { //Mandatory for browser side,
        location,
        host,
        userAgent
      },
      userInfo: { //Optional and to be updated by application
      },
      event: { //Optional and to be updated by application through log call
        name: eventName,
        id,
        module,
        type,
        data
      },
      error: {  //Optional and to be updated by application through log call
        code,
        message: errMsg,
        operationName
      },
      service: { //Optional and to be updated by application through log call
        name: serviceName,
        path,
      }
    }
  }
}

/**
 * Will be modified once the post method is configured on server
 */
const submitLogMsg = (msg, logLevel) => {
  fetch('/mock/logs.json', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(getLogObject({ msg, logLevel }))
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
      submitLogMsg({ ...msg, logLevel });
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
    debug: 4,
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
