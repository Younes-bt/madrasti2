import React, { createContext, useContext, useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { getDirection, updateDocumentDirection } from '../lib/i18n'

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
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language)
  const [direction, setDirection] = useState(getDirection(i18n.language))

  const changeLanguage = async (language) => {
    try {
      await i18n.changeLanguage(language)
      setCurrentLanguage(language)
      const newDirection = getDirection(language)
      setDirection(newDirection)
      updateDocumentDirection(language)

      // Store language preference
      localStorage.setItem('preferred-language', language)
    } catch (error) {
      console.error('Error changing language:', error)
    }
  }

  const isRTL = direction === 'rtl'

  useEffect(() => {
    const handleLanguageChange = (language) => {
      setCurrentLanguage(language)
      const newDirection = getDirection(language)
      setDirection(newDirection)
    }

    i18n.on('languageChanged', handleLanguageChange)

    return () => {
      i18n.off('languageChanged', handleLanguageChange)
    }
  }, [i18n])

  const languages = [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
    { code: 'fr', name: 'French', nativeName: 'Français' },
  ]

  const getCurrentLanguage = () => {
    return languages.find((lang) => lang.code === currentLanguage) || languages[0]
  }

  const value = {
    currentLanguage,
    direction,
    isRTL,
    languages,
    getCurrentLanguage,
    changeLanguage,
    t,
  }

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}
