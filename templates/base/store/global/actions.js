export const UPDATE_APP_ERROR = 'UPDATE_APP_ERROR';

export const updateAppError = (payload, dispatch) => {
    return dispatch({ type: APP_ERROR, payload })
}