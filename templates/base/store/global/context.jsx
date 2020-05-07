/** @context.jsx 
 *  This component is a wrapper which will provide
 *  the Global Context to other needy components
 *  */

import React, { useReducer, useEffect } from 'react';
import reducer, { initialState } from './reducer';
import { APP_LOADED } from './actions';

// Creating global context
export const Context = React.createContext();

let [state, dispatch] = useReducer(reducer, initialState);
const GlobalContextProvider = props => {
    /**
     * Once the app has been Mounted / Loaded successfully
     * We shall update the "Loading" property of state to false
     */
    useEffect(() => {
        dispatch({action: APP_LOADED});
    }, []);

    return <Context.Provider value={state}>{props.children}</Context.Provider>
}

export default GlobalContextProvider;