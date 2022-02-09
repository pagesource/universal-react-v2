export const languageStorageKey = 'language';

export const getLanguageFromLocalStorage = () => {
  const language = localStorage.getItem(languageStorageKey);
  //en-us is the default locale
  return language || 'en_us';
};

export const getCacheKey = (language: string, url: string) => {
  url = url.replace(/[-/]/g, '_');
  return `${language}_${url}`;
};
