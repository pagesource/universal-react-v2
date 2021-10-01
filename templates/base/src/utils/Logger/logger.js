
import { UAParser } from 'ua-parser-js';

const logObject = ({ logLevel, logObj }, server = false) => {
  try {
    const { appName, logInfo: { component, subComponent }, parseUserAgent, userInfo = "Unset user", event, service, error } = logObj || {};
    const isBrowser = process.browser;
    const localTimestamp = new Date();
    //const test_string = 'Mozilla/5.0 (Linux; U; Android 4.0.3; de-ch; HTC Sensation Build/IML74K) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30'
    const ua_result = new UAParser().getResult();

    const { name: event_name, attributes: event_attributes } = event || {};
    const { url: service_url, body: service_body } = service || {};
    const { name: error_name, attributes: error_attributes } = error || {};

    let returnObj = {
      appName: appName || "universal-react",
      logLevel,
      logInfo: {
        component,
        subComponent
      },
      userInfo,
      localTimestamp
    };

    if (isBrowser && !server) {
      if (parseUserAgent) {
        returnObj.browser = {
          location: window.location.href,
          host: window.location.host,
          browser: ua_result.browser,
          device: ua_result.device,
          os: ua_result.os
        }
      } else {
        returnObj.browser = {
          location: window.location.href,
          host: window.location.host,
          userAgent: navigator.userAgent
        }
      }
    }

    if (event_name) {
      returnObj.event = {
        name: event_name,
        attributes: event_attributes
      }
    }

    if (error_name) {
      returnObj.error = {
        name: error_name,
        attributes: error_attributes
      }
    }

    if (service_url) {
      returnObj.service = {
        url: service_url,
        body: service_body
      }
    }

    return returnObj;
  } catch (e) {
    console.error("Invalid logObj passed. Check the log object structure.", e);
  }
}

const postLogs = (logObj, remoteURL) => {
  fetch(remoteURL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(logObj)
  }).catch((err) => { console.log('log-err=====>>>', err) })
}

const callLog = ({ logLevel, logObj, remoteURL }) => {
  const isDev = process.env.NODE_ENV !== 'production';
  const isServer = !process.browser;
  let logged;

  if ((isDev || isServer)) {
    logged = logObject({ logLevel, logObj }, true);
    console[logLevel](logged);
  } else {
    logged = logObject({ logLevel, logObj });
    if (remoteURL !== undefined) {
      postLogs(logged, remoteURL);
    }
    //console[logLevel](logged); // comment it out later
  }
  return logged;
}

const createLogger = (options = {}) => {
  const { appName, level: loggerLevel, returnable = false, parseUserAgent = true, remoteDataAgregatorUrl: remoteURL } = options;
  const logLevels = {
    error: 0,
    info: 1,
    warn: 2,
    log: 3,
    debug: 4,
  };

  let loggingObj = {};
  const isDev = process.env.NODE_ENV !== 'production';
  const currentLogLevel = loggerLevel || process.env.LOG_LEVEL || (isDev ? 'debug' : 'info');

  Object.keys(logLevels).forEach(level => {
    loggingObj[level] = (args) => {
      if (logLevels[level] <= logLevels[currentLogLevel]) {
        args.appName = appName;
        args.parseUserAgent = parseUserAgent;
        if (returnable) {
          return callLog({ logLevel: level, logObj: args, remoteURL })
        } else {
          callLog({ logLevel: level, logObj: args, remoteURL })
        }
      }
    }
  })
  return loggingObj;
}

export default createLogger;