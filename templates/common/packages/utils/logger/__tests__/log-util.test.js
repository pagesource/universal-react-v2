import React from 'react';
import { render, screen } from '@testing-library/react';
import createLogger from '../log-util';

const WINDOW_POP_STATE_EVENT = 'popstate';
const WINDOW_ERROR_EVENT = 'error';

describe('Testing create logger utility', () => {
  const processBrowser = process.browser;
  beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation((error) => {
      console.log('Error Occured');
    });

    jest.spyOn(window, 'addEventListener').mockImplementation((event, handler) => {});

    jest.resetModules();
    process.browser = true;
  });
  afterAll(() => {
    console.error.mockRestore();
    window.addEventListener.mockRestore();
    process.browser = processBrowser;
  });
  test('Testing the default logger creation', () => {
    const testLogger = createLogger();
    expect(testLogger).toHaveProperty('error', 'warn', 'info', 'log', 'debug');
  });

  test('Testing whether the pop state event listener is registered', () => {
    const testLogger = createLogger();
    expect(window.addEventListener).toBeCalledWith(
      WINDOW_POP_STATE_EVENT,
      expect.any(Function)
    );
  });

  test('Testing whether the error state event listener is registered', () => {
    const testLogger = createLogger();
    expect(window.addEventListener).toBeCalledWith(
      WINDOW_ERROR_EVENT,
      expect.any(Function)
    );
  });

  test('Testing whether the pop state event listener is not registered when logger config changed but the error event registered', () => {
    const loggerOptions = {
      loggerConfig: {},
      user: 'Unset user',
      landingLogs: false,
      handleExceptions: true
    };
    const testLogger = createLogger(loggerOptions);
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
      loggerConfig: {},
      user: 'Unset user',
      landingLogs: true,
      handleExceptions: false
    };
    const testLogger = createLogger(loggerOptions);
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
    process.browser = processBrowser;
    const testLogger = createLogger();
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
