import React, { createContext, useContext, useEffect, useState } from 'react'

export const ThemeContext = createContext()

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

export const ThemeProvider = ({
  children,
  defaultTheme = 'system',
  storageKey = 'madrasti-ui-theme',
}) => {
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem(storageKey) || defaultTheme
    } catch {
      return defaultTheme
    }
  })

  useEffect(() => {
    const root = window.document.documentElement

    root.classList.remove('light', 'dark')

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'

      root.classList.add(systemTheme)
    } else {
      root.classList.add(theme)
    }
  }, [theme])

  const value = {
    theme,
    setTheme: (theme) => {
      try {
        localStorage.setItem(storageKey, theme)
      } catch (error) {
        // Handle storage errors
        console.warn('Failed to save theme preference:', error)
      }
      setTheme(theme)
    },
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

// Hook for easier theme detection
export const useThemeDetection = () => {
  const { theme } = useTheme()

  const getActualTheme = () => {
    if (theme === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
    }
    return theme
  }

  return {
    actualTheme: getActualTheme(),
    isDark: getActualTheme() === 'dark',
    isLight: getActualTheme() === 'light',
  }
}
