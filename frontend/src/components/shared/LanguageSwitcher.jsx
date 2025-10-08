import React from 'react'
import { useLanguage } from '../../contexts/LanguageContext'
import { Button } from '../ui/button'
import { Languages } from 'lucide-react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../ui/popover'

const LanguageSwitcher = () => {
  const { languages, currentLanguage, changeLanguage, getCurrentLanguage } = useLanguage()
  const [isOpen, setIsOpen] = React.useState(false)

  const handleLanguageChange = (langCode) => {
    changeLanguage(langCode)
    setIsOpen(false)
  }

  const current = getCurrentLanguage()

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          size='sm'
          className='flex items-center gap-2'
        >
          <Languages className='h-4 w-4' />
          <span className='text-sm font-medium'>{current.nativeName}</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-48 p-0' align='start'>
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
      </PopoverContent>
    </Popover>
  )
}

export default LanguageSwitcher
