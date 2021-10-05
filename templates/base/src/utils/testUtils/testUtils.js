import { render } from '@testing-library/react';
import GlobalContextProvider from '../../stores/global/ContextProvider'
import { toHaveTextContent } from "@testing-library/jest-dom"


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
 

 export const assertPropertyInObject =(obj,key,val)=>
 {
     return expect(obj).toHaveProperty(key,val)
 }


 export const renderWithGlobalContext = (componant) =>
 {
  return(render(<GlobalContextProvider>{componant}</GlobalContextProvider>))
 }

