import { render } from '@testing-library/react';
import GlobalContextProvider from '../../stores/global/ContextProvider'
import { toHaveTextContent } from "@testing-library/jest-dom"
import { renderHook, act } from '@testing-library/react-hooks'
 export const assertByTestId = (renderComp,testId,isTruthy) =>
 {
     if(!isTruthy){
         return expect(renderComp.queryAllByTestId(testId).length).toBe(0)
     }
     return expect(renderComp.getByTestId(testId)).toBeTruthy()
 }

 export const assertTextContentByTestId = (renderedComp,testId,textContent) =>
 {
    return expect(renderedComp.getByTestId(testId)).toHaveTextContent(textContent)
 }
 

 export const assertProperty =(obj,key,val)=>
 {
     return expect(obj).toHaveProperty(key,val)
 }

export const assertInitialStateProp=(hook,property,value)=>
{
    const { result } = renderHook(() =>hook())
    assertProperty(result.current,property,value)
}

export const getStateAndFunctionsInHook = (hook) =>
{
    const { result } = renderHook(() =>hook())
    return result
}

 export const renderWithGlobalContext = (children) =>
 {
  return(render(<GlobalContextProvider>{children}</GlobalContextProvider>))
 }

 

