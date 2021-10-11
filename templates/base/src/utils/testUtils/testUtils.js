import { render } from '@testing-library/react';
import {toBeInTheDocument} from '@testing-library/jest-dom'
 export const assertByTestId = (renderComp,testId,isTruthy) =>
 {
     if(!isTruthy){
         return expect(renderComp.queryAllByTestId(testId).length).toBe(0)
     }
     return expect(renderComp.getByTestId(testId)).toBeTruthy()
 }

 export const assertByTextContent = (getByText,textContent) =>
 {
    return expect(getByText(textContent)).toBeInTheDocument()
 }
 

 export const assertProperty =(obj,key,val)=>
 {
     return expect(obj).toHaveProperty(key,val)
 }

 export const renderWithSmartContext = ({SmartContextProviderRef,children}) =>
 {
  return(render(<SmartContextProviderRef>{children}</SmartContextProviderRef>))
 }

 export const renderWithContext = ({Comp,ContextProviderRef,state,props}) =>
 {
  return(render(<ContextProviderRef value={state}><Comp {...props}/></ContextProviderRef>))
 }

export const assertMockFunctionArg =({mockFunction,funCallIndex,argIndex,argument})=>
{
   return expect(mockFunction.mock.calls[funCallIndex][argIndex]).toBe(argument);
}

 

