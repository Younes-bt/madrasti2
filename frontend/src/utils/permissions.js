import { USER_ROLES, PERMISSIONS } from './constants'
import { auth } from './helpers'

/**
 * Role-based permission system for Madrasti 2.0
 */

// Define permissions for each role
const ROLE_PERMISSIONS = {
  [USER_ROLES.ADMIN]: [
    // Full system access
    PERMISSIONS.CAN_LIST_ALL_USERS,
    PERMISSIONS.CAN_CREATE_USERS,
    PERMISSIONS.CAN_UPDATE_USERS,
    PERMISSIONS.CAN_DELETE_USERS,
    PERMISSIONS.CAN_MANAGE_SCHOOL_CONFIG,
    PERMISSIONS.CAN_VIEW_SCHOOL_STRUCTURE,
    PERMISSIONS.CAN_CREATE_ASSIGNMENTS,
    PERMISSIONS.CAN_VIEW_ASSIGNMENTS,
    PERMISSIONS.CAN_GRADE_ASSIGNMENTS,
    PERMISSIONS.CAN_MARK_ATTENDANCE,
    PERMISSIONS.CAN_VIEW_ATTENDANCE,
    PERMISSIONS.CAN_CLEAR_FLAGS,
  ],

  [USER_ROLES.TEACHER]: [
    PERMISSIONS.CAN_VIEW_SCHOOL_STRUCTURE,
    PERMISSIONS.CAN_CREATE_ASSIGNMENTS,
    PERMISSIONS.CAN_VIEW_ASSIGNMENTS,
    PERMISSIONS.CAN_GRADE_ASSIGNMENTS,
    PERMISSIONS.CAN_MARK_ATTENDANCE,
    PERMISSIONS.CAN_VIEW_ATTENDANCE,
  ],

  [USER_ROLES.STUDENT]: [
    PERMISSIONS.CAN_VIEW_SCHOOL_STRUCTURE,
    PERMISSIONS.CAN_VIEW_ASSIGNMENTS,
    PERMISSIONS.CAN_SUBMIT_ASSIGNMENTS,
    PERMISSIONS.CAN_VIEW_ATTENDANCE,
  ],

  [USER_ROLES.PARENT]: [
    PERMISSIONS.CAN_VIEW_SCHOOL_STRUCTURE,
    PERMISSIONS.CAN_VIEW_ASSIGNMENTS,
    PERMISSIONS.CAN_VIEW_ATTENDANCE,
    PERMISSIONS.CAN_CLEAR_FLAGS,
  ],

  [USER_ROLES.STAFF]: [
    PERMISSIONS.CAN_LIST_ALL_USERS,
    PERMISSIONS.CAN_CREATE_USERS,
    PERMISSIONS.CAN_MANAGE_SCHOOL_CONFIG,
    PERMISSIONS.CAN_VIEW_SCHOOL_STRUCTURE,
    PERMISSIONS.CAN_VIEW_ASSIGNMENTS,
    PERMISSIONS.CAN_MARK_ATTENDANCE,
    PERMISSIONS.CAN_VIEW_ATTENDANCE,
    PERMISSIONS.CAN_CLEAR_FLAGS,
  ],

  [USER_ROLES.DRIVER]: [
    PERMISSIONS.CAN_VIEW_SCHOOL_STRUCTURE,
  ],
}

// Resource access definitions
const RESOURCE_ACCESS = {
  [USER_ROLES.ADMIN]: {
    users: { list: 'all', create: true, update: 'all', delete: true },
    assignments: { list: 'all', create: true, update: 'all', delete: true, grade: 'all' },
    attendance: { list: 'all', mark: 'all', view: 'all', flags: 'all' },
    lessons: { list: 'all', create: true, update: 'all', delete: true },
    reports: { view: 'all', generate: true },
  },

  [USER_ROLES.TEACHER]: {
    users: { list: 'own_classes', create: false, update: 'own_profile', delete: false },
    assignments: { list: 'own_and_classes', create: true, update: 'own', delete: 'own', grade: 'own' },
    attendance: { list: 'own_classes', mark: 'own_sessions', view: 'own_classes', flags: 'own_classes' },
    lessons: { list: 'all', create: true, update: 'own', delete: 'own' },
    reports: { view: 'own_classes', generate: false },
  },

  [USER_ROLES.STUDENT]: {
    users: { list: 'classmates', create: false, update: 'own_profile', delete: false },
    assignments: { list: 'assigned', create: false, update: false, delete: false, submit: 'assigned' },
    attendance: { list: 'own_only', mark: false, view: 'own_only', flags: false },
    lessons: { list: 'assigned', create: false, update: false, delete: false },
    reports: { view: 'own_only', generate: false },
  },

  [USER_ROLES.PARENT]: {
    users: { list: 'children_only', create: false, update: 'own_profile', delete: false },
    assignments: { list: 'children_only', create: false, update: false, delete: false, submit: false },
    attendance: { list: 'children_only', mark: false, view: 'children_only', flags: 'children_only' },
    lessons: { list: 'children_classes', create: false, update: false, delete: false },
    reports: { view: 'children_only', generate: false },
  },

  [USER_ROLES.STAFF]: {
    users: { list: 'all', create: true, update: 'all', delete: false },
    assignments: { list: 'all', create: false, update: false, delete: false, grade: false },
    attendance: { list: 'all', mark: 'all', view: 'all', flags: 'all' },
    lessons: { list: 'all', create: false, update: false, delete: false },
    reports: { view: 'all', generate: true },
  },

  [USER_ROLES.DRIVER]: {
    users: { list: 'none', create: false, update: 'own_profile', delete: false },
    assignments: { list: 'none', create: false, update: false, delete: false, submit: false },
    attendance: { list: 'none', mark: false, view: 'none', flags: false },
    lessons: { list: 'none', create: false, update: false, delete: false },
    reports: { view: 'none', generate: false },
  },
}

/**
 * Permission checking utilities
 */
export const permissions = {
  /**
   * Check if current user has a specific permission
   * @param {string} permission - Permission to check
   * @returns {boolean}
   */
  hasPermission: (permission) => {
    const token = auth.getAccessToken()
    const user = auth.getUserFromToken(token)
    
    if (!user) return false

    // Check if permission is explicitly granted in token
    if (user.permissions && user.permissions.includes(permission)) {
      return true
    }

    // Fallback to role-based permissions
    const rolePermissions = ROLE_PERMISSIONS[user.role] || []
    return rolePermissions.includes(permission)
  },

  /**
   * Check if current user has any of the specified permissions
   * @param {string[]} permissionList - Array of permissions to check
   * @returns {boolean}
   */
  hasAnyPermission: (permissionList) => {
    return permissionList.some(permission => permissions.hasPermission(permission))
  },

  /**
   * Check if current user has all specified permissions
   * @param {string[]} permissionList - Array of permissions to check
   * @returns {boolean}
   */
  hasAllPermissions: (permissionList) => {
    return permissionList.every(permission => permissions.hasPermission(permission))
  },

  /**
   * Get all permissions for current user
   * @returns {string[]}
   */
  getUserPermissions: () => {
    const token = auth.getAccessToken()
    const user = auth.getUserFromToken(token)
    
    if (!user) return []

    // Use permissions from token if available
    if (user.permissions) {
      return user.permissions
    }

    // Fallback to role-based permissions
    return ROLE_PERMISSIONS[user.role] || []
  },

  /**
   * Check if current user has a specific role
   * @param {string} role - Role to check
   * @returns {boolean}
   */
  hasRole: (role) => {
    const token = auth.getAccessToken()
    const user = auth.getUserFromToken(token)
    
    return user?.role === role
  },

  /**
   * Check if current user has any of the specified roles
   * @param {string[]} roles - Array of roles to check
   * @returns {boolean}
   */
  hasAnyRole: (roles) => {
    const token = auth.getAccessToken()
    const user = auth.getUserFromToken(token)
    
    return user && roles.includes(user.role)
  },

  /**
   * Get current user's role
   * @returns {string|null}
   */
  getUserRole: () => {
    const token = auth.getAccessToken()
    const user = auth.getUserFromToken(token)
    
    return user?.role || null
  },

  /**
   * Check resource access level for current user
   * @param {string} resource - Resource name (users, assignments, etc.)
   * @param {string} action - Action type (list, create, update, delete, etc.)
   * @returns {string|boolean} - Access level or boolean
   */
  getResourceAccess: (resource, action) => {
    const role = permissions.getUserRole()
    
    if (!role || !RESOURCE_ACCESS[role] || !RESOURCE_ACCESS[role][resource]) {
      return false
    }

    return RESOURCE_ACCESS[role][resource][action] || false
  },

  /**
   * Check if user can perform action on resource
   * @param {string} resource - Resource name
   * @param {string} action - Action type
   * @param {object} context - Additional context (user_id, class_id, etc.)
   * @returns {boolean}
   */
  canAccess: (resource, action, context = {}) => {
    const access = permissions.getResourceAccess(resource, action)
    
    if (access === false) return false
    if (access === true) return true

    // Handle specific access levels
    const token = auth.getAccessToken()
    const currentUser = auth.getUserFromToken(token)
    
    if (!currentUser) return false

    switch (access) {
      case 'all':
        return true

      case 'own_only':
        return context.user_id === currentUser.id

      case 'own_profile':
        return action === 'update' && context.user_id === currentUser.id

      case 'own':
        return context.created_by === currentUser.id || context.user_id === currentUser.id

      case 'own_classes':
        // Check if user is teacher of the class
        return context.class_teacher === currentUser.id || context.teacher_id === currentUser.id

      case 'own_sessions':
        // Check if user is assigned to the session
        return context.session_teacher === currentUser.id || context.teacher_id === currentUser.id

      case 'assigned':
        // Check if resource is assigned to current user
        return context.assigned_to === currentUser.id || 
               (context.students && context.students.includes(currentUser.id))

      case 'children_only':
        // For parents - check if accessing child's data
        return context.parent_id === currentUser.id || 
               (context.student_parent_id === currentUser.id)

      case 'children_classes':
        // For parents - check if accessing child's class data
        return context.student_parent_id === currentUser.id

      case 'classmates':
        // For students - check if accessing classmate's data
        return context.class_id && context.student_class_id === context.class_id

      case 'none':
        return false

      default:
        return false
    }
  },

  /**
   * Filter data based on user permissions
   * @param {Array} data - Data array to filter
   * @param {string} resource - Resource type
   * @param {string} action - Action type
   * @returns {Array} - Filtered data
   */
  filterByPermissions: (data, resource, action) => {
    const role = permissions.getUserRole()
    const access = permissions.getResourceAccess(resource, action)

    if (access === 'all' || access === true) {
      return data
    }

    if (access === false || access === 'none') {
      return []
    }

    const token = auth.getAccessToken()
    const currentUser = auth.getUserFromToken(token)

    if (!currentUser) return []

    return data.filter(item => {
      const context = {
        user_id: item.user_id || item.id,
        created_by: item.created_by,
        teacher_id: item.teacher_id,
        class_teacher: item.class_teacher,
        student_id: item.student_id,
        parent_id: item.parent_id,
        assigned_to: item.assigned_to,
        students: item.students,
        class_id: item.class_id,
      }

      return permissions.canAccess(resource, action, context)
    })
  },
}

/**
 * Route protection utilities
 */
export const routeGuards = {
  /**
   * Check if current user can access a route
   * @param {string} route - Route path
   * @param {object} routeConfig - Route configuration with required roles/permissions
   * @returns {boolean}
   */
  canAccessRoute: (route, routeConfig) => {
    if (!auth.isAuthenticated()) {
      return false
    }

    // No restrictions - allow access
    if (!routeConfig.requiredRoles && !routeConfig.requiredPermissions) {
      return true
    }

    // Check required roles
    if (routeConfig.requiredRoles) {
      const hasRole = permissions.hasAnyRole(routeConfig.requiredRoles)
      if (!hasRole) return false
    }

    // Check required permissions
    if (routeConfig.requiredPermissions) {
      const hasPermission = permissions.hasAllPermissions(routeConfig.requiredPermissions)
      if (!hasPermission) return false
    }

    return true
  },

  /**
   * Get default route for user role
   * @returns {string} - Default route path
   */
  getDefaultRoute: () => {
    const role = permissions.getUserRole()

    switch (role) {
      case USER_ROLES.ADMIN:
        return '/dashboard/admin'
      case USER_ROLES.TEACHER:
        return '/dashboard/teacher'
      case USER_ROLES.STUDENT:
        return '/dashboard/student'
      case USER_ROLES.PARENT:
        return '/dashboard/parent'
      case USER_ROLES.STAFF:
        return '/dashboard/staff'
      case USER_ROLES.DRIVER:
        return '/dashboard/driver'
      default:
        return '/'
    }
  },

  /**
   * Check if route requires authentication
   * @param {string} route - Route path
   * @returns {boolean}
   */
  requiresAuth: (route) => {
    const publicRoutes = [
      '/',
      '/login',
      '/register',
      '/forgot-password',
      '/reset-password',
    ]

    return !publicRoutes.includes(route) && !route.startsWith('/public')
  },
}

/**
 * UI permission utilities
 */
export const uiPermissions = {
  /**
   * Check if UI element should be visible
   * @param {object} elementConfig - Element configuration with permissions
   * @returns {boolean}
   */
  shouldShowElement: (elementConfig) => {
    if (!elementConfig.requiredRoles && !elementConfig.requiredPermissions) {
      return true
    }

    if (elementConfig.requiredRoles && !permissions.hasAnyRole(elementConfig.requiredRoles)) {
      return false
    }

    if (elementConfig.requiredPermissions && !permissions.hasAllPermissions(elementConfig.requiredPermissions)) {
      return false
    }

    return true
  },

  /**
   * Check if UI element should be disabled
   * @param {object} elementConfig - Element configuration
   * @returns {boolean}
   */
  shouldDisableElement: (elementConfig) => {
    if (!elementConfig.disableForRoles && !elementConfig.disableForPermissions) {
      return false
    }

    if (elementConfig.disableForRoles && permissions.hasAnyRole(elementConfig.disableForRoles)) {
      return true
    }

    if (elementConfig.disableForPermissions && permissions.hasAnyPermission(elementConfig.disableForPermissions)) {
      return true
    }

    return false
  },

  /**
   * Get filtered navigation items based on permissions
   * @param {Array} navigationItems - Navigation configuration
   * @returns {Array} - Filtered navigation items
   */
  filterNavigationItems: (navigationItems) => {
    return navigationItems.filter(item => {
      if (item.children) {
        item.children = uiPermissions.filterNavigationItems(item.children)
        return item.children.length > 0 || uiPermissions.shouldShowElement(item)
      }

      return uiPermissions.shouldShowElement(item)
    })
  },
}

// Export default permissions object for convenience
export default permissions