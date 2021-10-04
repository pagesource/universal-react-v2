import i18n from 'i18next';
import Backend from 'i18next-xhr-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

const fallbackLng = ['en'];

// same folder names should be used in /public/assets/locales
const availableLanguages = ['en', 'fr'];


const options = {
  // order and from where user language should be detected
  order: [ 'navigator', 'path', 'subdomain'],

  // to lookup language from
  lookupQuerystring: 'lng',
  lookupCookie: 'i18next',
  lookupLocalStorage: 'i18nextLng',
  lookupFromPathIndex: 0,
  lookupFromSubdomainIndex: 0,

  caches: ['localStorage', 'cookie'],
  cookieMinutes: 10,
  cookieDomain: 'domainName',

  checkWhitelist: true
}

i18n
  .use(Backend) 

  .use(LanguageDetector) 

  .use(initReactI18next) 

  .init({
    fallbackLng, // if user language is not on the list of available languages, than we will be using the fallback language specified earlier
    debug: true,
    whitelist: availableLanguages,
    detection: options,

    interpolation: {
      escapeValue: false
    },
  });

export default i18n;