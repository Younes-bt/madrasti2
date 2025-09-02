import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useLanguage } from '../../hooks/useLanguage'
import LoadingSpinner from '../shared/LoadingSpinner'

const ProtectedRoute = ({ 
  children, 
  requiredRoles = [], 
  requireAuth = true,
  redirectTo = '/login' 
}) => {
  const { user, isAuthenticated, loading } = useAuth()
  const { t } = useLanguage()
  const location = useLocation()

  // Show loading while checking authentication
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

  // Redirect to login if authentication is required but user is not authenticated
  if (requireAuth && !isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />
  }

  // Check role-based access if roles are specified
  if (requiredRoles.length > 0 && user) {
    const hasRequiredRole = requiredRoles.includes(user.role)
    
    if (!hasRequiredRole) {
      // Redirect to appropriate dashboard based on user's actual role
      const roleRoutes = {
        'ADMIN': '/admin',
        'TEACHER': '/teacher', 
        'STUDENT': '/student',
        'PARENT': '/parent',
        'STAFF': '/staff',
        'DRIVER': '/driver'
      }
      
      const userDashboard = roleRoutes[user.role] || '/dashboard'
      return <Navigate to={userDashboard} replace />
    }
  }

  return children
}

export default ProtectedRoute