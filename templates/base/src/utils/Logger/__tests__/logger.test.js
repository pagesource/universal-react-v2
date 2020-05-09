import fetchMock from 'fetch-mock';
import '@testing-library/jest-dom/extend-expect';
import mockConsole from 'jest-mock-console';
import Logger from '../logger';

let restoreConsole;

beforeEach(() => {
  restoreConsole = mockConsole(['log', 'warn', 'error', 'info']);
})

afterEach(() => {
  restoreConsole();
})

test('should log error for dev or server', () => {
  const expectLog = new Array({ message: 'Here is the error' });
  Logger.error({ message: 'Here is the error' })
  expect(console.error).toHaveBeenCalled();
  expect(console.error.mock.calls).toEqual([expectLog]);
})

test('should log info for dev or server', () => {
  const expectLog = new Array({ message: 'Here is the info' });
  Logger.info({ message: 'Here is the info' })
  expect(console.info).toHaveBeenCalled();
  expect(console.info.mock.calls).toEqual([expectLog]);
})

test('should log warn for dev or server', () => {
  const expectLog = new Array({ message: 'Here is the warn' });
  Logger.warn({ message: 'Here is the warn' })
  expect(console.warn).toHaveBeenCalled();
  expect(console.warn.mock.calls).toEqual([expectLog]);
})

test('should log for dev or server', () => {
  const expectLog = new Array({ message: 'Here is the log' });
  Logger.log({ message: 'Here is the log' })
  expect(console.log).toHaveBeenCalled();
  expect(console.log.mock.calls).toEqual([expectLog]);
})

