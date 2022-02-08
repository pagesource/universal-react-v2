import * as helper from '../helper';
import createLogger from '../log-util';
import { LoggerConfigOptions } from '../types';

const WINDOW_POP_STATE_EVENT = 'popstate';
const WINDOW_ERROR_EVENT = 'error';

jest.mock('../helper');

describe('Testing create logger utility', () => {
  const processBrowser = helper.isCalledInBrowser();
  const mockedConsoleError = jest.spyOn(console, 'error');
  const mockedWindowEventListener = jest.spyOn(window, 'addEventListener');
  const mockedIsCalledInBrowser = jest.spyOn(helper, 'isCalledInBrowser');

  const defaultOptions = {
    loggerConfig: {} as LoggerConfigOptions,
    user: 'Unset user',
    landingLogs: true,
    handleExceptions: true
  };

  beforeAll(() => {
    mockedConsoleError.mockImplementation((error) => {
      console.log('Error Occured');
    });

    mockedWindowEventListener.mockImplementation((event, handler) => {});
    mockedIsCalledInBrowser.mockImplementation(() => true);
    jest.resetModules();
  });
  afterAll(() => {
    mockedConsoleError.mockRestore();
    mockedWindowEventListener.mockRestore();
    mockedIsCalledInBrowser.mockImplementation(() => processBrowser);
  });
  test('Testing the default logger creation', () => {
    const testLogger = createLogger(defaultOptions);
    const expectation = {
      error: expect.any(Function),
      warn: expect.any(Function),
      log: expect.any(Function),
      info: expect.any(Function),
      debug: expect.any(Function)
    };
    expect(testLogger).toMatchObject(expectation);
  });

  test('Testing whether the pop state event listener is registered', () => {
    createLogger(defaultOptions);
    expect(window.addEventListener).toBeCalledWith(
      WINDOW_POP_STATE_EVENT,
      expect.any(Function)
    );
  });

  test('Testing whether the error state event listener is registered', () => {
    createLogger(defaultOptions);
    expect(window.addEventListener).toBeCalledWith(
      WINDOW_ERROR_EVENT,
      expect.any(Function)
    );
  });

  test('Testing whether the pop state event listener is not registered when logger config changed but the error event registered', () => {
    const loggerOptions = {
      loggerConfig: {} as LoggerConfigOptions,
      user: 'Unset user',
      landingLogs: false,
      handleExceptions: true
    };
    createLogger(loggerOptions);
    expect(window.addEventListener).not.toHaveBeenCalledWith(
      WINDOW_POP_STATE_EVENT,
      expect.any(Function)
    );
    expect(window.addEventListener).toHaveBeenCalledWith(
      WINDOW_ERROR_EVENT,
      expect.any(Function)
    );
  });

  test('Testing whether the error state event listener is not registered when logger config changed but the pop event registered', () => {
    const loggerOptions = {
      loggerConfig: {} as LoggerConfigOptions,
      user: 'Unset user',
      landingLogs: true,
      handleExceptions: false
    };
    createLogger(loggerOptions);
    expect(window.addEventListener).not.toHaveBeenCalledWith(
      WINDOW_ERROR_EVENT,
      expect.any(Function)
    );
    expect(window.addEventListener).toHaveBeenCalledWith(
      WINDOW_POP_STATE_EVENT,
      expect.any(Function)
    );
  });

  test('When the environment is not on browser, an error is thrown', () => {
    mockedIsCalledInBrowser.mockImplementation(() => processBrowser);
    createLogger(defaultOptions);
    expect(console.error).toHaveBeenCalled();
    expect(window.addEventListener).not.toHaveBeenCalledWith(
      WINDOW_ERROR_EVENT,
      expect.any(Function)
    );
    expect(window.addEventListener).not.toHaveBeenCalledWith(
      WINDOW_POP_STATE_EVENT,
      expect.any(Function)
    );
  });
});
