import { render, fireEvent } from '@testing-library/react';
import { Context, ContextDemo } from './ContextDemo';
import {
  assertByTestId,
  assertProperty,
  assertByTextContent,
  renderWithContext,
  renderWithSmartContext,
  assertMockFunctionArg
} from '../testUtils';
import SmartContextDemo from './SmartContextDemo';
import SmartContextProvider from './SmartContextProviderDemo';

describe('assertByTestId', () => {
  const renderCom = render(<h1 data-testid="hello">Hello</h1>);
  test('testId exists', () => {
    assertByTestId(renderCom, 'hello', true);
  });

  test('testId do not exists', () => {
    assertByTestId(renderCom, 'Hello', false);
  });
});

describe('assertProperty', () => {
  test('test property', () => {
    const componant = {
      name: 'default'
    };
    assertProperty(componant, 'name', 'default');
  });
});

describe('asserByTextContent', () => {
  test('assert test content', () => {
    const renderedComp = render(<h1>Hello default</h1>);
    assertByTextContent(renderedComp, 'Hello default', true);
  });
  test('assert test content not present', () => {
    const renderedComp = render(<h1>Hello default</h1>);
    assertByTextContent(renderedComp, 'Not Found', false);
  });
});

describe('renderWithSmartContext', () => {
  test('assert context state', () => {
    const props = {};
    const Comp = <SmartContextDemo {...props} />;
    const obj = { SmartContextProviderRef: SmartContextProvider, children: Comp };
    const renderedComp = renderWithSmartContext(obj);
    assertByTextContent(renderedComp, 'Smart Context', true);
  });
});

describe('renderWithContext', () => {
  test('assert context state', () => {
    const contextData = {
      value: 'context'
    };
    const props = {};
    const obj = {
      Comp: ContextDemo,
      ContextProviderRef: Context.Provider,
      state: contextData,
      props: props
    };
    const renderedComp = renderWithContext(obj);
    assertByTextContent(renderedComp, 'context', true);
  });
});

describe('assertMockFunctionsArgument', () => {
  test('test arguments in mock function call', () => {
    function forEach(items, callback) {
      for (let index = 0; index < items.length; index++) {
        callback(items[index]);
      }
    }
    const mockCallback = jest.fn((x) => 42 + x);
    forEach([0, 1], mockCallback);
    const obj1 = {
      mockFunction: mockCallback,
      funCallIndex: 1,
      argIndex: 0,
      argument: 1
    };
    assertMockFunctionArg(obj1);
    const obj2 = { mockFunction: mockCallback, argument: 0 };
    assertMockFunctionArg(obj2);
  });
});
