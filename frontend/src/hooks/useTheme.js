import { useContext } from 'react'
import { ThemeContext } from '../contexts/ThemeContext'

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

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