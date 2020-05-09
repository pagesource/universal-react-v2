import { APP_ERROR } from './actions';

// @Initial State
const initialState = {
    errorInfo: {},
    isError: false
}

const globalReducer = (state = initialState, action) => {
    switch(action.type) {
        case APP_ERROR:
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