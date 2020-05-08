import { APP_ERROR, APP_LOADED } from './actions';

// @Initial State
export const initialState = {
    loading: true,
    error: false
}

const globalReducer = (state = initialState, action) => {
    switch(action.type) {
        case APP_ERROR:
            return {
                ...state,
                error: action.payload
            }
    }
    return state;
}

export default globalReducer;