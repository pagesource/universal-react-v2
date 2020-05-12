import { UPDATE_APP_ERROR } from './constants';

// @Initial State
const initialState = {
    errorInfo: {},
    isError: false
}

const globalReducer = (state = initialState, action = {}) => {
    switch(action.type) {
        case UPDATE_APP_ERROR:
            return {
                ...state,
                errorInfo: { ...action.payload.errorInfo },
                isError: action.payload.isError
            }
        default:
            return state;
    }
}

export default globalReducer;