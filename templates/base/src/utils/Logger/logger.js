
import fetch from 'isomorphic-unfetch';

/**
 * @param {object} msg --> msg Object
 * @param {string}  logLevel --> string (info, log, error)
 * returns an object with log data to be sent in api
 */
const getLogObject = ({ msg, logLevel }) => {
  const { message, event, service, error } = msg || {};
  let location = '';
  let host = '';
  let userAgent = '';
  if (process.browser) {
    location = window.location.href;
    host = window.location.host;
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
    ...event, //Optional and to be updated by application through log call
    ...error,  //Optional and to be updated by application through log call
    ...service, //Optional and to be updated by application through log call
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
