import React from 'react'
import { useAuth } from '../../hooks/useAuth'
import { useLanguage } from '../../hooks/useLanguage'
import LoginPage from '../../pages/auth/LoginPage'
import LoadingSpinner from '../shared/LoadingSpinner'

const AuthGuard = ({ children }) => {
  const { isAuthenticated, loading } = useAuth()
  const { t } = useLanguage()

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <LoadingSpinner size="lg" />
          <p className="text-muted-foreground">{t('common.loading')}</p>
        </div>
      </div>
    )
  }

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return <LoginPage />
  }

  // Show protected content if authenticated
  return children
}

export default AuthGuard