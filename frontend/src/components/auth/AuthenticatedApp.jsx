import React, { useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { useLanguage } from '../../hooks/useLanguage'
import { useTheme } from '../../hooks/useTheme'

// Import page components
import DashboardPage from '../../pages/dashboard/DashboardPage'

// Import components
import { Button } from '../ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { LogOut, User, Settings, Bell } from 'lucide-react'

const AuthenticatedApp = () => {
  const { user, logout } = useAuth()
  const { t, currentLanguage, changeLanguage, isRTL } = useLanguage()
  const { theme, setTheme } = useTheme()
  const [currentView, setCurrentView] = useState('dashboard')

  const handleLogout = () => {
    logout()
  }

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  const languageOptions = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
  ]

  const demoViews = [
    { id: 'dashboard', name: t('common.dashboard'), icon: '📊' },
    { id: 'profile', name: t('common.profile'), icon: '👤' },
    { id: 'settings', name: t('common.settings'), icon: '⚙️' },
  ]

  return (
    <div className={`min-h-screen bg-background ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50">
        <div className="container flex h-16 items-center justify-between px-4">
          {/* Logo and Title */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-md bg-primary flex items-center justify-center text-primary-foreground font-bold">
                M
              </div>
              <span className="font-bold text-lg">Madrasti 2.0</span>
            </div>
            <Badge variant="secondary">{t(`roles.${user?.role?.toLowerCase()}` || 'user')}</Badge>
          </div>

          {/* Controls */}
          <div className="flex items-center space-x-4">
            {/* Language Switcher */}
            <div className="flex items-center space-x-1">
              {languageOptions.map((lang) => (
                <Button
                  key={lang.code}
                  variant={currentLanguage === lang.code ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => changeLanguage(lang.code)}
                  className="h-8 px-2"
                >
                  <span className="mr-1">{lang.flag}</span>
                  <span className="hidden sm:inline text-xs">{lang.code.toUpperCase()}</span>
                </Button>
              ))}
            </div>

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="h-8 px-3"
            >
              {theme === 'dark' ? '🌞' : '🌙'}
            </Button>

            {/* User Menu */}
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium hidden sm:inline">
                {user?.full_name || user?.email}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="h-8 px-3 text-muted-foreground hover:text-foreground"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline ml-1">{t('common.logout')}</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="border-b bg-card/30">
        <div className="container px-4">
          <div className="flex h-12 items-center space-x-1">
            {demoViews.map((view) => (
              <Button
                key={view.id}
                variant={currentView === view.id ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setCurrentView(view.id)}
                className="h-8"
              >
                <span className="mr-2">{view.icon}</span>
                {view.name}
              </Button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container px-4 py-6">
        {currentView === 'dashboard' && <DashboardPage />}
        
        {currentView === 'profile' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>{t('common.profile')}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">{t('auth.email')}</label>
                  <p className="text-muted-foreground">{user?.email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Full Name</label>
                  <p className="text-muted-foreground">{user?.full_name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Role</label>
                  <p className="text-muted-foreground">{user?.role}</p>
                </div>
                {user?.school_info && (
                  <div>
                    <label className="text-sm font-medium">School</label>
                    <p className="text-muted-foreground">{user.school_info.name}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {currentView === 'settings' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-5 w-5" />
                <span>{t('common.settings')}</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-semibold mb-3">Authentication Status</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Login Status</span>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        ✅ Authenticated
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">JWT Token</span>
                      <Badge variant="outline" className="font-mono text-xs">
                        Active
                      </Badge>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold mb-3">Theme & Language</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Current Theme</span>
                      <Badge variant="outline">
                        {theme === 'dark' ? '🌙 Dark' : '🌞 Light'}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Current Language</span>
                      <Badge variant="outline">
                        {languageOptions.find(l => l.code === currentLanguage)?.flag} {currentLanguage.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Text Direction</span>
                      <Badge variant="outline">
                        {isRTL ? 'RTL (Right to Left)' : 'LTR (Left to Right)'}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t bg-card/30 mt-12">
        <div className="container px-4 py-4">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <p>© 2025 Madrasti 2.0 - Education Management System</p>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary">Phase 2: Authentication ✅</Badge>
              <span>Build: v2.1.0</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default AuthenticatedApp