import i18n from "i18next";
import { reactI18nextModule } from "react-i18next";
import detector from "i18next-browser-languagedetector";

import translationEN from 'src/locales/en/translation.json';
import translationVI from 'src/locales/vi/translation.json';

const resources = {
    en: {
        translation: translationEN
    },
    vi: {
        translation: translationVI
    }
};

i18n
    .use(detector)
    .use(reactI18nextModule) // passes i18n down to react-i18next
    .init({
        resources,
        lng: window.localStorage.getItem("i18nextLng") || "vi",
        fallbackLng: "en",

        keySeparator: false, // we do not use keys in form messages.welcome

        interpolation: {
            escapeValue: false // react already safes from xss
        },
    });

export default i18n;