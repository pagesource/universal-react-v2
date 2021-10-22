import { useState, useEffect } from 'react';
import fetchWrapper from '../utils/serviceUtils/fetch';

var cache={};
const languageStorageKey = "language";
// Default base path
const basePath = "http://localhost:3000";

const getLanguageFromLocalStorage = () => {
  const language = localStorage.getItem(languageStorageKey);
  //en-us is the default locale
  return language || "en-us";
}

const getCacheKey = (language,url) => {
  url = url.replace(/-/g,"_");
  url = url.replace(/\//g,"_");
  return `${language}_${url}`;
}

export default function useLocalizedContent(url, fetchOptions){

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  //Logic for handling multi locale requests
  const language = getLanguageFromLocalStorage();
  const cacheKey = getCacheKey(language,url);
  const localizedUrl = `${basePath}/${language}/${url}`;

  useEffect(() => {
    setLoading(true);

    if(!(cacheKey in cache)){
      cache[cacheKey]=fetchWrapper(localizedUrl,fetchOptions);
    }
    
    setData(cache[cacheKey]);
    setLoading(false);

  }, [url])

return [loading, data]
}