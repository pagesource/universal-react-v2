import { useState, useEffect } from 'react';

export default function useFetchWithLocale(url, fetchOptions){

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState();
  const [error, setError] = useState();
  const languageSessionStorageKey = "language"

  const language = JSON.parse(localStorage.getItem(languageSessionStorageKey))

  //Logic for handling multi locale requests
  // url = "/"+language+"/"+url

  const defaultHeaders = {
    headers: {
      'Content-Type': 'application/json'
    }
  };
  
  const checkStatus = (response) => {
    if (response.ok) {
      return response;
    } else {
      let error = new Error({ statusText: response.statusText, response: response.json() });
      return Promise.reject(error);
    }
  };

  async function fetchWrapper(url, fetchOptions) {
    const {
      headers,
      isCredentialsForCrossOrigin,
      cache,
      redirect,
      referrerPolicy,
      body = null
    } = fetchOptions || {};
    const payload = {
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
      .then((res) => {
        res.json()
        setData(res.json())
        setLoading(false)
      })
      .catch((err) => {
        setError(err)
        Logger.error({
          message: 'failed to fetch',
          error: {
            code: err.statusText,
            errMessage: err.response,
            operationName: url
          },
          service: {
            name: '',
            path: url,
          }
        });
        return err;
      });
  }

  useEffect(() => {
    fetchWrapper(url,fetchOptions);
  }, [url])

return [loading, data, error]
}
