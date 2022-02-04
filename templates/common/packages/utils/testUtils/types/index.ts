import React, { ReactElement, ReactNode } from 'react';

export declare type AssertMockFunctionParams = {
  mockFunction: jest.MockedFunction<any>;
  funCallIndex: number;
  argIndex: number;
  argument: any;
};

export declare type SmartContextRenderParams = {
  SmartContextProviderRef: React.FunctionComponent<any>;
  children: React.FunctionComponent<any>;
};

export declare type ContextRenderParams = {
  ContextProviderRef: React.FunctionComponent<any>;
  Comp: React.FunctionComponent<any>;
  state: any;
  props: any;
};
