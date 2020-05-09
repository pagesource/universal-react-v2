/** @context.jsx 
 *  This component is a wrapper which will provide
 *  the Global Context to other needy components
 *  */

import React, { useReducer } from 'react';
import reducer from './reducer';

// Creating global context
export const Context = React.createContext(reducer());

const GlobalContextProvider = props => {
    const [state, dispatch] = useReducer(reducer, reducer());
    return <Context.Provider value={{state, dispatch}}>{props.children}</Context.Provider>
}

export default GlobalContextProvider;
