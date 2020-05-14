import { UPDATE_APP_ERROR } from './constants';

export const updateAppError = (payload, dispatch) => {
    return dispatch({ type: UPDATE_APP_ERROR, payload })
}