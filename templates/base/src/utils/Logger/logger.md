
# Custom Browser and Server Logger 

This logger collect logs based on different levels and structures them

1. Transport logs to an API end-point at browser side 
2. Writes logs to server console at server side

  ```javascript
  import Logger from '../utils/Logger';

  Logger.error({ 
    message: 'No user found',
    error: {
      code: '400',
      message: 'failed to fetch',
      operationName: 'getUserInfo'
    },
    service: {
      name: 'getUserInfo',
      path: '/get-user-info/',
    },
  });
```