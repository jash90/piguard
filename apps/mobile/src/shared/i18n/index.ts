import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import pl from './locales/pl.json'
import en from './locales/en.json'

void i18n.use(initReactI18next).init({
  resources: {
    pl: { translation: pl },
    en: { translation: en },
  },
  lng: 'pl',
  fallbackLng: 'pl',
  interpolation: { escapeValue: false },
  keySeparator: false,
  nsSeparator: false,
  compatibilityJSON: 'v4',
})

export default i18n
