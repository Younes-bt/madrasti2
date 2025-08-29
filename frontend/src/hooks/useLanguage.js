import { useContext } from 'react'
import { LanguageContext } from '../contexts/LanguageContext'

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

export const useTranslation = () => {
  const { t, currentLanguage, isRTL } = useLanguage()
  
  return {
    t,
    i18n: {
      language: currentLanguage,
      dir: isRTL ? 'rtl' : 'ltr',
    },
    isRTL,
  }
}