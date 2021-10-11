import { render,fireEvent } from "@testing-library/react"
import {Context,ContextDemo} from "./ContextDemo";
import { assertByTestId, assertProperty,assertByTextContent,renderWithContext, assertMockFunctionArg } from "./testUtils"


describe('assertByTestId', () => {
    const renderCom=render(<h1 data-testid='hello'>Hello</h1>)
    test('testId exists', () => {
       assertByTestId(renderCom,'hello',true)
    })

    test('testId do not exists', () => {
      
       assertByTestId(renderCom,'Hello',false)
    })
})

describe('assertProperty', () => {
    test('test property', () => {
        const componant={
            name:'default'
        };
       assertProperty(componant,'name','default')
    })
})

describe('asserByTextContent', () => {
    test('assert test content', () => {
        const {getByText}=render(<h1>Hello default</h1>)
        assertByTextContent(getByText,'Hello default')
    })
})

describe('renderWithContext', () => {
    test('assert context state', () => {
        const contextData={
            value:'context'
        }
        const props={}
        const obj={Comp:ContextDemo,ContextProviderRef:Context.Provider,state:contextData,props:props}
        const {getByText}  = renderWithContext(obj)
        assertByTextContent(getByText,'context')
        
    })
})

describe('assertMockFunctionsArgument', () => {
    test('test arguments in mock function call', () => {
function forEach(items, callback) {
    for (let index = 0; index < items.length; index++) {
      callback(items[index]);
    }
  }

  const mockCallback = jest.fn(x => 42 + x);
  forEach([0, 1], mockCallback);
  const obj={mockFunction:mockCallback,funCallIndex:0,argIndex:0,argument:0}
  assertMockFunctionArg(obj)

    })
})