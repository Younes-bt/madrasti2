import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import Backend from 'i18next-http-backend'

// RTL languages
const rtlLanguages = ['ar']

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    debug: false,

    backend: {
      // Load translation files from public/locales directory
      loadPath: '/locales/{{lng}}/{{lng}}.json',
    },

    interpolation: {
      escapeValue: false, // React already does escaping
    },

    detection: {
      // Order of language detection methods
      order: ['queryString', 'cookie', 'localStorage', 'navigator'],
      // Cache detected language in cookie and localStorage
      caches: ['cookie', 'localStorage'],
    },

    react: {
      // Don't use Suspense for loading translations
      useSuspense: false,
    },

    // Languages to preload
    preload: ['en', 'ar', 'fr'],
  })

// Function to check if language is RTL
export const isRTL = (language) => {
  return rtlLanguages.includes(language)
}

// Function to get text direction
export const getDirection = (language) => {
  return isRTL(language) ? 'rtl' : 'ltr'
}

// Function to update document direction - Keep main layout LTR
export const updateDocumentDirection = (language) => {
  // Always keep document direction as LTR for layout consistency
  document.documentElement.dir = 'ltr'
  document.documentElement.lang = language
  
  // Add/remove RTL class for content-specific styling only
  if (isRTL(language)) {
    document.documentElement.classList.add('rtl-content')
  } else {
    document.documentElement.classList.remove('rtl-content')
  }
}

// Initialize direction on startup
updateDocumentDirection(i18n.language)

// Listen for language changes and update document direction
i18n.on('languageChanged', (language) => {
  updateDocumentDirection(language)
})

export default i18n