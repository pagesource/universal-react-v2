import { Operation } from 'apollo-link';

export declare type LogObjectApollo = {
  message: string;
  code?: string;
  errMessage: string | Error;
  operationName: Operation;
};
