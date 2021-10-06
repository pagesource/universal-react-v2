
# Custom Browser and Server Logger 

This logger collect logs based on different levels and structures them

1. Transport logs to an API end-point at browser side 
2. Writes logs to server console at server side

## Log structure:
```javascript
{
  appName,
  logLevel,
  logInfo: {
    component,
    subComponent
  },
  browser: {
    location,
    host,
    userAgent
  },
  event: {
    name,
    attributes
  },
  error: {
    name,
    attributes
  },
  service = {
    url,
    body
  },
  userInfo,
  localTimestamp
};
```

This logger util provides two logger initializers:
- `createLogger`: A basic logger init function that returns a logger which follows the above structure. The init function takes as parameters some optional config values.
- `browserLogger`: A utility logger init function that returns a logger which follows the above structure and allows only 3 types of logs(browser specific logs): landing, interaction, error. This init function takes as parameters the config settings of the basic logger as well as some optional config values like:
  - `user`: user info to be set as the value of `userInfo` key of the log structure.
  - `landingLogs`: takes a boolean value that sets wheather landing logs to be automatically logged or not on url change. Adds an event listener to actively check for url changes.
  - `handleExceptions`: takes a boolean value that sets wheather unhandled syntax/runtime errors/exceptions to be automatically logged or not. Adds an event listener to actively check for such errors.      

## Usage 

createLogger:
```javascript
import { createLogger } from '../utils/Logger';

const Logger = createLogger({
  appName: 'application name to be shown in the logs',
  level: 'info',  // lowest allowed level of log
  parseUserAgent: true, // return device, browser and os details if true; returns user-agent string if false
  remoteDataAgregatorUrl: 'http://localhost:4000'  // remote API end-point to post the logs 
});

Logger.error({ 
  logInfo: {
    component: 'Home',
    subComponent: 'UserCard'
  }
  error: {
    name: 'failed to fetch',
    attributes: {
      code: '400',
      operationName: 'getUserInfo'
    }
  },
  event: {
    name: 'click',
    attributes: {
      targetElement: 'Button',
      innerText: 'Show More'
    }
  }
  service: {
    url: '/get-user-info/'
  },
});
```

browserLogger:
```javascript
import { browserLogger } from '../utils/Logger';

const createLoggerConfig = {
  appName: 'application name to be shown in the logs',
  level: 'info',  // lowest allowed level of log
  parseUserAgent: true, // return device, browser and os details if true; returns user-agent string if false
  remoteDataAgregatorUrl: 'http://localhost:4000'  // remote API end-point to post the logs 
}

const user = {
  name: 'John Doe',
  id: '101'
}

const Logger = browserLogger({
  loggerConfig: createLoggerConfig,
  user,
  landingLogs: true,
  handleExceptions: true
});

Logger.error({ 
  logInfo: {
    component: 'Home',
    subComponent: 'UserCard'
  }
  error: {
    name: 'failed to fetch',
    attributes: {
      code: '400',
      operationName: 'getUserInfo'
    }
  },
  event: {
    name: 'click',
    attributes: {
      targetElement: 'Button',
      innerText: 'Show More'
    }
  }
  service: {
    url: '/get-user-info/'
  },
});
```