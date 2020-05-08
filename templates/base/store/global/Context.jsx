/** @context.jsx 
 *  This component is a wrapper which will provide
 *  the Global Context to other needy components
 *  */

import React from 'react';

// Creating global context
export const Context = React.createContext();

const GlobalContextProvider = props => {
    return <Context.Provider value={{}}>{props.children}</Context.Provider>
}

export default GlobalContextProvider;
