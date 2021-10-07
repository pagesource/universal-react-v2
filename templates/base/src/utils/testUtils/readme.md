Test Util Functions

assertByTestId(renderComp,testId,isTruthy) : assert whether testId is present
               renderComp : Rendered Component
               testId : TestId which has to be checked
               is truthy : if truthy, test passes if the testId is present
                           if falsy, test passes if the testId is not present

assertByTextContent(getByText,textContent) : assert whether given textContent is present                        
               getByText: The getByText property reference of rendered Component
               textContent : Text String that needs to be asserted

assertProperty(obj,key,val) :assert value of the property in an object
             obj: object reference 
             key: property
             val: expected value of the key

renderWithContext({Comp,ContextProviderRef,state,props}): renders the component with given context
                      Comp : Component
                      ContextProviderRef:context provider (ex: ContextProviderRef=SomeContext.Provider)
                      state : state of context that has to be assigned
                      props : props that needs to be assigned to the given Component ie.Comp

assertMockFunctionArg ({mockFunction,funCallIndex,argIndex,argument}):asserts the mth Argument of Mock Function for n number of function calls
                         mockFunction: Mock Function
                         funCallIndex: Index of nth function call (note:Indexing starts from 0,Index of function for the first call is 0)
                         argIndex: Index of the argument (Indexing starts from 0)
                         argument:expected argument