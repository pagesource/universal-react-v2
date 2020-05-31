import globalReducer from './../reducer';
import { UPDATE_APP_ERROR } from './../constants';

describe('Testing Global Reducer JS File', () => {
    const initialState = {
        errorInfo: {},
        isError: false
    }
    const errorState = {
        errorInfo: {},
        isError: true
    }

    test('Global reducer is defined', () => {
        expect(globalReducer).toBeDefined();
    });

    test('Global Reducer returns default state', () => {
        expect(globalReducer()).toEqual(initialState);
    });

    test('Global Reducer to return updated state', () => {
        expect(globalReducer(undefined, { type: UPDATE_APP_ERROR, payload: { errorInfo: {}, isError: true } })).toEqual(errorState)
    });
});