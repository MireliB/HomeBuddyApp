import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import translationAR from './locals/arabic/translation.json';
import translationHE from './locals/hebrew/translation.json';
import translationRU from './locals/russian/translation.json'
import translationEN from './locals/english/translation.json';

import Cookies from "js-cookie";
const resources = {
  en: { translation: translationEN },
  he: { translation: translationHE },
  ru: { translation: translationRU },
  ar: { translation: translationAR },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: Cookies.get("language") || "en",
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ["cookie", "localStorage", "navigator", "htmlTag"],
      caches: ["cookie"],
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;