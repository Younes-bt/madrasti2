import React from 'react'
import { AuthLayout } from '../../components/layout/Layout'
import { LoginForm } from '../../components/auth'
import { useLanguage } from '../../hooks/useLanguage'

const LoginPage = () => {
  const { t } = useLanguage()

  const handleLoginSuccess = () => {
    // Redirect to dashboard or handle success
    window.location.href = '/dashboard'
  }

  return (
    <AuthLayout>
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight">
            {t('auth.login')}
          </h2>
          <p className="text-muted-foreground mt-2">
            Welcome back to Madrasti 2.0
          </p>
        </div>
        
        <LoginForm onSuccess={handleLoginSuccess} />
      </div>
    </AuthLayout>
  )
}

export default LoginPage