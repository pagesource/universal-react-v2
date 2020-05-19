
const browserLogObject = ({ logObj, logLevel }) => {
  const { message, userInfo, event, service, error } = logObj || {};
  const isBrowser = process.browser;

  return {
    appName: "universal-react",
    logLevel,
    message,
    browser: {
      location: isBrowser && window.location.href,
      host: isBrowser && window.location.host,
      userAgent: isBrowser && navigator.userAgent,
    },
    userInfo,
    event,
    error,
    service,
  }
}

const serverLogObject = ({ logObj, logLevel }) => {
  const { message, event, service, error } = logObj || {};

  return {
    appName: "universal-react",
    logLevel,
    message,
    event,
    error,
    service,
  }
}

const postLogs = (logObj) => {
  fetch('/mock/logs.json', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(logObj)
  }).catch((err) => { console.log('log-err=====>>>', err) })
}

const callLog = ({ logLevel, logObj }) => {
  const isDev = process.env.NODE_ENV !== 'production';
  const isServer = !process.browser;

  if (isDev || isServer) {
    console[logLevel](serverLogObject({ logLevel, logObj }));
  } else {
    postLogs(browserLogObject({ logLevel, logObj }));
  }
}

const Logger = () => {
  const logLevels = {
    error: 0,
    info: 1,
    warn: 2,
    log: 3,
    debug: 4,
  };

  let loggingObj = {};
  const isDev = process.env.NODE_ENV !== 'production';
  const currentLogLevel = process.env.LOG_LEVEL || (isDev ? 'debug' : 'info');

  Object.keys(logLevels).forEach(level => {
    loggingObj[level] = (...args) => {
      if (logLevels[level] <= logLevels[currentLogLevel]) {
        callLog({ logLevel: level, logObj: args })
      }
    }
  })
  return loggingObj;
}

export default Logger();
