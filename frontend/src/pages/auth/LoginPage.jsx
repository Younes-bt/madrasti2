import React from 'react'
import { AuthLayout } from '../../components/layout/Layout'
import { LoginForm } from '../../components/auth'
import { useLanguage } from '../../hooks/useLanguage'
import { Card, CardContent } from '../../components/ui/card'

const LoginPage = () => {
  const { t, isRTL } = useLanguage()

  const handleLoginSuccess = () => {
    // Authentication is handled by AuthContext
    // No need to redirect manually - the app will re-render with authenticated state
    console.log('Login successful!')
  }

  return (
    <div className={`min-h-screen bg-background flex items-center justify-center p-4 ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="h-12 w-12 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-bold text-xl shadow-lg">
              M
            </div>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Madrasti 2.0
          </h1>
          <p className="text-muted-foreground mt-2">
            {t('common.welcome', 'Welcome back to your education management system')}
          </p>
        </div>

        {/* Login Form */}
        <LoginForm onSuccess={handleLoginSuccess} />

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-muted-foreground">
            © 2025 Madrasti 2.0 - Education Management System
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage