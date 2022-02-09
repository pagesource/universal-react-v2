import { UAParser } from 'ua-parser-js';
import { isCalledInBrowser } from './helper';
import {
  LoggerCallbackParams,
  LoggerCallbackReturnType,
  LoggerConfigOptions,
  LoggerInstance,
  LogLevelKeys
} from './types';

const logObject = ({ logLevel, logObj }: LoggerCallbackParams, server = false) => {
  try {
    const {
      appName,
      logInfo,
      parseUserAgent,
      userInfo = 'Unset user',
      event,
      service,
      error
    } = logObj || {};
    const isBrowser = isCalledInBrowser();
    const localTimestamp = new Date();
    //const test_string = 'Mozilla/5.0 (Linux; U; Android 4.0.3; de-ch; HTC Sensation Build/IML74K) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30'
    const ua_result = new UAParser().getResult();

    const { component: logInfo_component, subComponent: logInfo_subComponent } =
      logInfo || {};
    const { name: event_name, attributes: event_attributes } = event || {};
    const { url: service_url, body: service_body } = service || {};
    const { name: error_name, attributes: error_attributes } = error || {};

    let returnObj: LoggerCallbackReturnType = {
      appName: appName || 'universal-react',
      logLevel,
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
        };
      } else {
        returnObj.browser = {
          location: window.location.href,
          host: window.location.host,
          userAgent: navigator.userAgent
        };
      }
    }

    if (logInfo_component) {
      returnObj.logInfo = {
        component: logInfo_component,
        subComponent: logInfo_subComponent
      };
    }

    if (event_name) {
      returnObj.event = {
        name: event_name,
        attributes: event_attributes
      };
    }

    if (error_name) {
      returnObj.error = {
        name: error_name,
        attributes: error_attributes
      };
    }

    if (service_url) {
      returnObj.service = {
        url: service_url,
        body: service_body
      };
    }

    return returnObj;
  } catch (e) {
    console.error('Invalid logObj passed. Check the log object structure.', e);
  }
};

const postLogs = (logObj: any, remoteURL: string) => {
  fetch(remoteURL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(logObj)
  }).catch((err) => {
    console.log('log-err=====>>>', err);
  });
};

const callLog = ({ logLevel, logObj, remoteURL }: LoggerCallbackParams) => {
  const isDev = process.env.NODE_ENV !== 'production';
  const isServer = !isCalledInBrowser();
  let logged;
  if (isDev || isServer) {
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
};

const createDefaultLogger = (options: LoggerConfigOptions): LoggerInstance => {
  const {
    appName,
    level: loggerLevel,
    returnable = false,
    parseUserAgent = true,
    remoteDataAgregatorUrl: remoteURL
  } = options;
  enum logLevels {
    error = 0,
    info = 1,
    warn = 2,
    log = 3,
    debug = 4
  }

  let loggingObj: Record<LogLevelKeys, Function | undefined> = {
    error: undefined,
    info: undefined,
    warn: undefined,
    log: undefined,
    debug: undefined
  };
  const isDev = process.env.NODE_ENV !== 'production';
  const currentLogLevel = (loggerLevel ||
    process.env.LOG_LEVEL ||
    (isDev ? 'debug' : 'info')) as LogLevelKeys;

  const logLevelKeys: any[] = Object.keys(logLevels);

  logLevelKeys.forEach((level: LogLevelKeys) => {
    loggingObj[level] = (args: any) => {
      if (logLevels[level] <= logLevels[currentLogLevel]) {
        args.appName = appName;
        args.parseUserAgent = parseUserAgent;
        if (returnable) {
          return callLog({ logLevel: level, logObj: args, remoteURL });
        } else {
          callLog({ logLevel: level, logObj: args, remoteURL });
        }
      }
    };
  });
  return loggingObj;
};

export default createDefaultLogger;
