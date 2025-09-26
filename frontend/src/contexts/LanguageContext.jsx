import React, { createContext, useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { getDirection } from '../lib/i18n'

export const LanguageContext = createContext()

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

export const LanguageProvider = ({ children }) => {
  const { i18n, t } = useTranslation()

  const changeLanguage = async (language) => {
    try {
      await i18n.changeLanguage(language)
      localStorage.setItem('preferred-language', language)
    } catch (error) {
      console.error('Error changing language:', error)
    }
  }

  const isRTL = getDirection(i18n.language) === 'rtl'

  const languages = [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
    { code: 'fr', name: 'French', nativeName: 'Français' },
  ]

  const getCurrentLanguage = () => {
    return languages.find((lang) => lang.code === i18n.language) || languages[0]
  }

  const value = {
    currentLanguage: i18n.language,
    direction: getDirection(i18n.language),
    isRTL,
    languages,
    getCurrentLanguage,
    changeLanguage,
    t,
  }

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}