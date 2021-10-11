import { render } from '@testing-library/react';
import {toBeInTheDocument} from '@testing-library/jest-dom'

 export const assertByTestId = (renderedComp,testId,isTruthy) =>
 {
     if(!isTruthy){
         return expect(renderedComp.queryAllByTestId(testId).length).toBe(0)
     }
     return expect(renderedComp.getByTestId(testId)).toBeTruthy()
 }

 export const assertByTextContent = (renderedComp,textContent,isTruthy) =>
 {
    if(!isTruthy){
       return expect(renderedComp.queryByText(textContent)).toBeNull()
    }
    return expect(renderedComp.getByText(textContent)).toBeInTheDocument()
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

export const assertMockFunctionArg =({mockFunction,funCallIndex=0,argIndex=0,argument})=>
{
     return expect(mockFunction.mock.calls[funCallIndex][argIndex]).toBe(argument);
}

 

