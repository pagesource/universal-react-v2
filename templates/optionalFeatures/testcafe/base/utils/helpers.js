import { ClientFunction } from 'testcafe';

export const setSessionValue = ClientFunction((k, v) => sessionStorage.setItem(k, v));

export const getSessionValue = ClientFunction((k, v) => sessionStorage.getItem(k, v));

export const getWindowLocation = ClientFunction(() => window.location);
