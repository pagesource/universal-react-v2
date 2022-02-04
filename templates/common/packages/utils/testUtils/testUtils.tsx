import { render, RenderResult } from '@testing-library/react';
import {
  AssertMockFunctionParams,
  ContextRenderParams,
  SmartContextRenderParams
} from './types';

export const assertByTestId = (
  renderedComp: RenderResult,
  testId: string,
  isTruthy: boolean
) => {
  if (!isTruthy) {
    return expect(renderedComp.queryAllByTestId(testId).length).toBe(0);
  }
  return expect(renderedComp.getByTestId(testId)).toBeTruthy();
};

export const assertByTextContent = (
  renderedComp: RenderResult,
  textContent: string,
  isTruthy: boolean
) => {
  if (!isTruthy) {
    return expect(renderedComp.queryByText(textContent)).toBeNull();
  }
  return expect(renderedComp.getByText(textContent)).toBeInTheDocument();
};

export const assertProperty = (obj: Object, key: string, val: any) => {
  return expect(obj).toHaveProperty(key, val);
};

export const renderWithSmartContext = ({
  SmartContextProviderRef,
  children
}: SmartContextRenderParams) => {
  return render(<SmartContextProviderRef>{children}</SmartContextProviderRef>);
};

export const renderWithContext = ({
  Comp,
  ContextProviderRef,
  state,
  props
}: ContextRenderParams) => {
  return render(
    <ContextProviderRef value={state}>
      <Comp {...props} />
    </ContextProviderRef>
  );
};

export const assertMockFunctionArg = ({
  mockFunction,
  funCallIndex = 0,
  argIndex = 0,
  argument
}: AssertMockFunctionParams) => {
  return expect(mockFunction.mock.calls[funCallIndex][argIndex]).toBe(argument);
};
