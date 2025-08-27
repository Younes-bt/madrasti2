import React from 'react'
import { useLanguage } from '../../contexts/LanguageContext'
import { Button } from '../ui/button'
import { Languages } from 'lucide-react'

const LanguageSwitcher = () => {
  const { languages, currentLanguage, changeLanguage, getCurrentLanguage } = useLanguage()
  const [isOpen, setIsOpen] = React.useState(false)

  const handleLanguageChange = (langCode) => {
    changeLanguage(langCode)
    setIsOpen(false)
  }

  const current = getCurrentLanguage()

  return (
    <div className='relative'>
      <Button
        variant='outline'
        size='sm'
        onClick={() => setIsOpen(!isOpen)}
        className='flex items-center gap-2'
      >
        <Languages className='h-4 w-4' />
        <span className='text-sm font-medium'>{current.nativeName}</span>
      </Button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div className='fixed inset-0 z-10' onClick={() => setIsOpen(false)} />

          {/* Dropdown */}
          <div className='absolute right-0 mt-2 w-48 bg-popover border border-border rounded-md shadow-lg z-20'>
            <div className='py-2'>
              {languages.map((language) => (
                <button
                  key={language.code}
                  onClick={() => handleLanguageChange(language.code)}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground transition-colors ${
                    language.code === currentLanguage
                      ? 'bg-accent text-accent-foreground font-medium'
                      : 'text-popover-foreground'
                  }`}
                >
                  <div className='flex items-center justify-between'>
                    <span>{language.nativeName}</span>
                    <span className='text-xs text-muted-foreground'>{language.name}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default LanguageSwitcher
