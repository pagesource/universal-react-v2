import { render } from '@testing-library/react';
import GlobalContextProvider from '../../stores/global/ContextProvider'

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

 export const renderWithGlobalContext = (children) =>
 {
  return(render(<GlobalContextProvider>{children}</GlobalContextProvider>))
 }

 export const renderWithContext = ({Comp,ContextRef,state,props}) =>
 {
  return(render(<ContextRef value={state}><Comp {...props}/></ContextRef>))
 }

export const assertMockFunctionArg =({mockFunction,funCallIndex,argIndex,argument})=>
{
   return expect(mockFunction.mock.calls[funCallIndex][argIndex]).toBe(argument);
}

 

