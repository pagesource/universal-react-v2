export declare type LogLevelKeys = 'debug' | 'info' | 'error' | 'log' | 'warn';

export declare type LoggerConfigOptions = {
  appName: string;
  level: number;
  returnable: boolean;
  parseUserAgent: boolean;
  remoteDataAgregatorUrl: string;
};

export declare type LoggerOptions = {
  loggerConfig?: LoggerConfigOptions;
  user: string;
  landingLogs: boolean;
  handleExceptions: boolean;
};

export declare type LoggerInstance = {
  [key in LogLevelKeys]?: Function;
};

export declare type LoggerCallbackParams = {
  logLevel: LogLevelKeys;
  logObj: any;
  remoteURL?: string;
};

export declare type LoggerCallbackReturnType = Record<string, any>;
