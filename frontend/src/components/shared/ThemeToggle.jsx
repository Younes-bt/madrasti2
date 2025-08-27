import React from 'react'
import { Moon, Sun, Monitor } from 'lucide-react'
import { useTheme } from '../../contexts/ThemeContext'
import { Button } from '../ui/button'

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme()
  const [isOpen, setIsOpen] = React.useState(false)

  const themes = [
    { value: 'light', label: 'Light', icon: Sun },
    { value: 'dark', label: 'Dark', icon: Moon },
    { value: 'system', label: 'System', icon: Monitor },
  ]

  const currentTheme = themes.find((t) => t.value === theme) || themes[2]
  const CurrentIcon = currentTheme.icon

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme)
    setIsOpen(false)
  }

  return (
    <div className='relative'>
      <Button
        variant='outline'
        size='sm'
        onClick={() => setIsOpen(!isOpen)}
        className='flex items-center gap-2'
      >
        <CurrentIcon className='h-4 w-4' />
        <span className='text-sm font-medium'>{currentTheme.label}</span>
      </Button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div className='fixed inset-0 z-10' onClick={() => setIsOpen(false)} />

          {/* Dropdown */}
          <div className='absolute right-0 mt-2 w-36 bg-popover border border-border rounded-md shadow-lg z-20'>
            <div className='py-2'>
              {themes.map((themeOption) => {
                const Icon = themeOption.icon
                return (
                  <button
                    key={themeOption.value}
                    onClick={() => handleThemeChange(themeOption.value)}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-accent hover:text-accent-foreground transition-colors flex items-center gap-2 ${
                      themeOption.value === theme
                        ? 'bg-accent text-accent-foreground font-medium'
                        : 'text-popover-foreground'
                    }`}
                  >
                    <Icon className='h-4 w-4' />
                    <span>{themeOption.label}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default ThemeToggle
