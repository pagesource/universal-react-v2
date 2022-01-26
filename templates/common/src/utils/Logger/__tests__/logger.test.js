import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom/extend-expect';
import mockConsole from 'jest-mock-console';
import createLogger from '../logger';

let restoreConsole;
const Log = createLogger({});

beforeEach(() => {
  restoreConsole = mockConsole(['log', 'warn', 'error', 'info']);
})

afterEach(() => {
  restoreConsole();
})

test('should log error for dev or server', () => {
  const expectLog = {
    message: 'Here is the error',
    appName: "universal-react",
    logLevel: "error"
  };
  Log.error({ logInfo: { component: "Comp", subComponent: "Sub comp" } })
  expect(console.error).toHaveBeenCalled();
  expect(console.error.mock.calls[0][0].logLevel).toEqual(expectLog.logLevel);
})

test('should log info for dev or server', () => {
  const expectLog = {
    message: 'Here is the info',
    appName: "universal-react",
    logLevel: "info"
  };
  Log.info({ logInfo: { component: "Comp", subComponent: "Sub comp" } })
  expect(console.info).toHaveBeenCalled();
  expect(console.info.mock.calls[0][0].logLevel).toEqual(expectLog.logLevel);
})

test('should log warn for dev or server', () => {
  const expectLog = {
    message: 'Here is the warn',
    appName: "universal-react",
    logLevel: "warn"
  };
  Log.warn({ logInfo: { component: "Comp", subComponent: "Sub comp" } })
  expect(console.warn).toHaveBeenCalled();
  expect(console.warn.mock.calls[0][0].logLevel).toEqual(expectLog.logLevel);
})

test('should log for dev or server', () => {
  const expectLog = {
    message: 'Here is the log',
    appName: "universal-react",
    logLevel: "log"
  };
  Log.log({ logInfo: { component: "Comp", subComponent: "Sub comp" } })
  expect(console.log).toHaveBeenCalled();
  expect(console.log.mock.calls[0][0].logLevel).toEqual(expectLog.logLevel);
})

