import { useState, useEffect } from 'react';
import fetchWrapper from '../utils/serviceUtils/fetch';

const languageStorageKey = "language"

const getLanguageFromLocalStorage = () => {
  return localStorage.getItem(languageKey);
}

const setLanguageToLocalStorage = (language) => {
  localStorage.setItem(languageKey, language);
}

export default function useLocalisedContent(url, fetchOptions){

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState();

  //Logic for handling multi locale requests
  const language = getLanguageFromLocalStorage();

  if(!language){
    //default language 
    language="en-us";
  }

  url = "/"+language+"/"+url

  useEffect(() => {
    setLoading(true);
    setData(fetchWrapper(url,fetchOptions));
    setLoading(false);
  }, [url])

return [loading, data]
}
