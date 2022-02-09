import Logger from '../Logger';
import { FetchOptions } from './types';
import { defaultLoggerOptions } from '../logger/helper';
import { CustomError } from './helpers';

const defaultHeaders = {
  'Content-Type': 'application/json'
};

/**
 *
 * @param {*} response  - response from the fetch api
 * checks whether the response has a status ok or else returns error
 */
const checkStatus = (response: any) => {
  if (response.ok) {
    return response;
  } else {
    let error = new CustomError(response.statusText, response.json());
    return Promise.reject(error);
  }
};

/**
 *
 * @param {*} url - url returned from endpoints getContentServiceUrl  || getDataServiceUrl
 * @param {*} fetchOptions - other options like body or headers
 */
async function fetchWrapper(url: string, fetchOptions?: FetchOptions) {
  const {
    headers,
    isCredentialsForCrossOrigin,
    cache,
    redirect,
    referrerPolicy,
    body = null
  } = fetchOptions || {};
  const payload: RequestInit = {
    method: 'GET',
    headers: { ...defaultHeaders, ...headers },
    body,
    mode: 'cors', // no-cors, *cors, same-origin
    cache: cache || 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: isCredentialsForCrossOrigin ? 'include' : 'same-origin', // include, *same-origin, omit -> to pass the credentials for cross-origin use include
    redirect: redirect || 'follow', // manual, *follow, error
    referrerPolicy: referrerPolicy || 'no-referrer'
  };
  return await fetch(url, {
    ...payload
  })
    .then(checkStatus)
    .then((res) => res.json())
    .catch((err) => {
      Logger(defaultLoggerOptions).error({
        message: 'failed to fetch',
        error: {
          code: err.statusText,
          errMessage: err.response,
          operationName: url
        },
        service: {
          name: '',
          path: url
        }
      });

      return err;
    });
}

export default fetchWrapper;
