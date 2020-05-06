import * as actions from './actions';

// @Initial State
export const initialState = {
    loading: true,
    error: false
}

const globalReducer = (state = initialState, action) => {
    switch(action.type) {
        case action.DUMMY_ACTION:
            return {
                ...state
            }
    }
    return state;
}

export default globalReducer;