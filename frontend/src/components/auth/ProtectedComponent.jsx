import React from 'react'
import { useAuth } from '../../hooks/useAuth'

/**
 * ProtectedComponent - Conditionally renders content based on roles/permissions
 * More lightweight than RoleBasedRoute, just shows/hides content without full page handling
 */
const ProtectedComponent = ({
  children,
  allowedRoles = [],
  requiredPermissions = [],
  requireAll = false,
  fallback = null,
  showError = false,
}) => {
  const { hasRole, hasAnyRole, hasPermission, hasAnyPermission } = useAuth()

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
        roleAccess = rolesArray.every(role => hasRole(role))
      } else {
        roleAccess = hasAnyRole(rolesArray)
      }
    }

    // Check permissions if specified
    if (permissionsArray.length > 0) {
      if (requireAll) {
        permissionAccess = permissionsArray.every(permission => hasPermission(permission))
      } else {
        permissionAccess = hasAnyPermission(permissionsArray)
      }
    }

    return roleAccess && permissionAccess
  }

  const accessGranted = hasAccess()

  if (!accessGranted) {
    if (showError) {
      return (
        <div className="text-xs text-red-500 p-2 border border-red-200 rounded bg-red-50">
          Access denied - insufficient permissions
        </div>
      )
    }
    return fallback
  }

  return children
}

/**
 * Higher-order component version of ProtectedComponent
 */
export const withRoleProtection = (Component, options = {}) => {
  return function ProtectedWrappedComponent(props) {
    return (
      <ProtectedComponent {...options}>
        <Component {...props} />
      </ProtectedComponent>
    )
  }
}

/**
 * Hook for conditional rendering based on permissions
 */
export const useRoleAccess = (allowedRoles = [], requiredPermissions = [], requireAll = false) => {
  const { hasRole, hasAnyRole, hasPermission, hasAnyPermission, user } = useAuth()

  const rolesArray = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles]
  const permissionsArray = Array.isArray(requiredPermissions) ? requiredPermissions : [requiredPermissions]

  const checkAccess = () => {
    let roleAccess = true
    let permissionAccess = true

    if (rolesArray.length > 0) {
      if (requireAll) {
        roleAccess = rolesArray.every(role => hasRole(role))
      } else {
        roleAccess = hasAnyRole(rolesArray)
      }
    }

    if (permissionsArray.length > 0) {
      if (requireAll) {
        permissionAccess = permissionsArray.every(permission => hasPermission(permission))
      } else {
        permissionAccess = hasAnyPermission(permissionsArray)
      }
    }

    return roleAccess && permissionAccess
  }

  return {
    hasAccess: checkAccess(),
    user,
    userRole: user?.role,
    userPermissions: user?.permissions || [],
    requiredRoles: rolesArray,
    requiredPermissions: permissionsArray,
  }
}

export default ProtectedComponent