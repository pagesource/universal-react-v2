import * as globalActions from './../actions';
import { UPDATE_APP_ERROR } from './../constants';

describe('Testing Global Actions JS File', () => {
    let payload = { errorInfo: {}, isError: true };

    test('Global Actions is defined', () => {
        expect(globalActions.updateAppError).toBeDefined();
    });

    test('Should dispatch updateAppError', () => {
        expect(globalActions.updateAppError()).toEqual({
            type: UPDATE_APP_ERROR,
            payload
        });
    });
})