// @context.jsx 
// will be a provider for our context

import React, { useReducer } from 'react';
import reducer, {initialState} from './reducer';

// Creating global context
export const context = React.createContext();
const {Provider} = {...context};

let [state, dispatch] = useReducer(reducer, initialState);
const contextProvider = props => {
    return <Provider value={state}>{props.children}</Provider>
}

export default contextProvider;