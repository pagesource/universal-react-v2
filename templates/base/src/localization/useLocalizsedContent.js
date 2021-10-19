import { useState, useEffect } from 'react';
import fetchWrapper from '../utils/serviceUtils/fetch';

const languageStorageKey = "language";
var cache={};

// Default base path
const basePath = "http://localhost:3000";

const getLanguageFromLocalStorage = (nullCheck) => {
  const language = localStorage.getItem(languageStorageKey);
   return nullCheck(language);
}

const nullCheck = (variable) => {
  if(!variable){
    // Default language
    return "en-us";
  }
  else{
    return variable;
  }
}

const setLanguageToLocalStorage = (language) => {
  localStorage.setItem(languageKey, language);
}

export default function useLocalisedContent(url, fetchOptions){

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState();

  //Logic for handling multi locale requests
  const language = getLanguageFromLocalStorage(nullCheck);
  url = `${basePath}/${language}/${url}`;

  useEffect(() => {
    setLoading(true);

    if(url in cache){
      setData(cache[url]);
    }
    else{
      cache[url]=fetchWrapper(url,fetchOptions);
      setData(cache[url]);
    }
    setLoading(false);
    
  }, [url])

return [loading, data]
}