import { useState, useEffect } from 'react';
import { fetchWrapper } from 'utils';
import type { FetchOptions } from 'utils';
import { getCacheKey, getLanguageFromLocalStorage } from './helper';

var cache: Record<string, string> = {};

// Default base path
const basePath = 'http://localhost:3000';

export default function useLocalizedContent(url: string, fetchOptions?: FetchOptions) {
  const [loading, setLoading] = useState(true);

  //Logic for handling multi locale requests
  const language = getLanguageFromLocalStorage();
  const cacheKey = getCacheKey(language, url);
  const localizedUrl = `${basePath}/${language}/${url}`;

  const getAllLabels = () => cache[cacheKey];

  const getLabel = (label: string) => cache[cacheKey][label];

  useEffect(() => {
    setLoading(true);

    console.log('Cache Key in caheee', cacheKey in cache, cache, cacheKey);

    if (!(cacheKey in cache)) {
      fetchWrapper(localizedUrl, fetchOptions).then((data) => {
        cache[cacheKey] = JSON.stringify(data);
      });
    }

    setLoading(false);
  }, [url]);

  return [loading, getLabel, getAllLabels];
}
