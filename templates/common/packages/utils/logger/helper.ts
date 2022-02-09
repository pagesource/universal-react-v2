import { LoggerConfigOptions } from './types';

/**
 * Returns whether the execution context is browser or not
 * @returns Boolean
 */
export const isCalledInBrowser = () => {
  return typeof window !== 'undefined';
};

export const defaultLoggerOptions = {
  loggerConfig: {} as LoggerConfigOptions,
  user: 'Unset user',
  landingLogs: true,
  handleExceptions: true
};
