import { isCalledInBrowser } from './helper';
import createDefaultLogger from './logger';
import { LoggerConfigOptions, LoggerInstance, LoggerOptions } from './types';

const createLogger = (options: LoggerOptions): LoggerInstance => {
  const {
    loggerConfig = {} as LoggerConfigOptions,
    user = 'Unset user',
    landingLogs = true,
    handleExceptions = true
  } = options || {};
  const isBrowser = isCalledInBrowser();
  const Log: LoggerInstance = createDefaultLogger(loggerConfig);

  if (landingLogs) {
    if (!isBrowser) {
      console.error(
        'Invalid request: Landing logs utility not available outside browser.'
      );
    } else {
      let lastUrl = window.location.href;
      window.addEventListener('popstate', function (e) {
        if (window.location.href !== lastUrl) {
          const logObj = {
            event: {
              name: 'url change',
              attributes: {
                oldUrl: lastUrl,
                newUrl: window.location.href
              }
            },
            userInfo: user
          };
          if (Log.info) {
            Log.info(logObj);
          }
          lastUrl = window.location.href;
        }
      });
    }
  }

  if (handleExceptions) {
    if (!isBrowser) {
      console.error(
        'Invalid request: Browser error logs utility not available outside browser.'
      );
    } else {
      window.addEventListener('error', function (event) {
        const logObj = {
          event: {
            name: event.type,
            attributes: {
              filename: event.filename,
              message: event.message,
              line: event.lineno,
              colno: event.colno
            }
          },
          error: {
            name: event.error.name,
            attributes: event.error.stack
          },
          userInfo: user
        };
        if (Log.error) {
          Log.error(logObj);
        }
      });
    }
  }

  return Log;
};

export default createLogger;
