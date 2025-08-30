import React from 'react'
import { useAuth } from '../../hooks/useAuth'
import { useLanguage } from '../../hooks/useLanguage'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { AlertTriangle, ArrowLeft } from 'lucide-react'

/**
 * RoleBasedRoute component for protecting routes based on user roles and permissions
 * @param {Object} props
 * @param {React.ReactNode} props.children - The protected content
 * @param {string|string[]} props.allowedRoles - Single role or array of roles allowed to access
 * @param {string|string[]} props.requiredPermissions - Single permission or array of permissions required
 * @param {boolean} props.requireAll - If true, user must have ALL specified roles/permissions (default: false - requires ANY)
 * @param {React.ReactNode} props.fallback - Custom component to show when access is denied
 * @param {Function} props.onAccessDenied - Callback when access is denied
 */
const RoleBasedRoute = ({
  children,
  allowedRoles = [],
  requiredPermissions = [],
  requireAll = false,
  fallback = null,
  onAccessDenied = null,
}) => {
  const { user, hasRole, hasAnyRole, hasPermission, hasAnyPermission } = useAuth()
  const { t } = useLanguage()

  // Ensure arrays
  const rolesArray = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles]
  const permissionsArray = Array.isArray(requiredPermissions) ? requiredPermissions : [requiredPermissions]

  // Check access
  const hasAccess = () => {
    let roleAccess = true
    let permissionAccess = true

    // Check roles if specified
    if (rolesArray.length > 0) {
      if (requireAll) {
        // User must have ALL specified roles
        roleAccess = rolesArray.every(role => hasRole(role))
      } else {
        // User must have ANY of the specified roles
        roleAccess = hasAnyRole(rolesArray)
      }
    }

    // Check permissions if specified
    if (permissionsArray.length > 0) {
      if (requireAll) {
        // User must have ALL specified permissions
        permissionAccess = permissionsArray.every(permission => hasPermission(permission))
      } else {
        // User must have ANY of the specified permissions
        permissionAccess = hasAnyPermission(permissionsArray)
      }
    }

    return roleAccess && permissionAccess
  }

  const accessGranted = hasAccess()

  // Call access denied callback if provided
  if (!accessGranted && onAccessDenied) {
    onAccessDenied({
      user,
      requiredRoles: rolesArray,
      requiredPermissions: permissionsArray,
      userRole: user?.role,
      userPermissions: user?.permissions || [],
    })
  }

  // Show custom fallback if access denied and fallback provided
  if (!accessGranted && fallback) {
    return fallback
  }

  // Show default access denied message
  if (!accessGranted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="w-full max-w-md text-center">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <div className="h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
            </div>
            <CardTitle className="text-xl text-red-600 dark:text-red-400">
              {t('errors.accessDenied', 'Access Denied')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              {t('errors.insufficientPermissions', 'You do not have sufficient permissions to access this page.')}
            </p>
            
            <div className="space-y-2 text-sm">
              <div className="bg-muted rounded-md p-3 text-left">
                <p className="font-medium mb-2">
                  {t('errors.accessRequirements', 'Access Requirements:')}
                </p>
                
                {rolesArray.length > 0 && (
                  <div className="mb-2">
                    <span className="text-muted-foreground">
                      {t('errors.requiredRoles', 'Required Roles:')} 
                    </span>
                    <span className="ml-1 font-mono text-xs">
                      {rolesArray.join(requireAll ? ' AND ' : ' OR ')}
                    </span>
                  </div>
                )}
                
                {permissionsArray.length > 0 && (
                  <div className="mb-2">
                    <span className="text-muted-foreground">
                      {t('errors.requiredPermissions', 'Required Permissions:')}
                    </span>
                    <span className="ml-1 font-mono text-xs">
                      {permissionsArray.join(requireAll ? ' AND ' : ' OR ')}
                    </span>
                  </div>
                )}
                
                <div>
                  <span className="text-muted-foreground">
                    {t('errors.yourRole', 'Your Role:')}
                  </span>
                  <span className="ml-1 font-mono text-xs">
                    {user?.role || 'UNKNOWN'}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <Button 
                variant="outline" 
                onClick={() => window.history.back()}
                className="flex items-center justify-center"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                {t('common.goBack', 'Go Back')}
              </Button>
              <Button 
                onClick={() => window.location.reload()}
                className="flex items-center justify-center"
              >
                {t('common.refresh', 'Refresh')}
              </Button>
            </div>

            <p className="text-xs text-muted-foreground">
              {t('errors.contactAdmin', 'If you believe this is an error, please contact your system administrator.')}
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Render protected content
  return children
}

export default RoleBasedRoute