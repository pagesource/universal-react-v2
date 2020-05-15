import reducer from './../reducer';
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
        expect(reducer).toBeDefined();
    });

    test('Global Reducer returns default state', () => {
        expect(reducer()).toEqual(initialState);
    });

    test('Global Reducer to return updated state', () => {
        expect(reducer(undefined, { type: UPDATE_APP_ERROR, payload: { errorInfo: {}, isError: true } })).toEqual(errorState)
    });
});