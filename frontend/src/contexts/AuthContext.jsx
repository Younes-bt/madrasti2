import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { authStorage } from '../utils/storage'
import { USER_ROLES } from '../utils/constants'
import { extractUserFromJWT, isJWTExpired } from '../utils/jwt'

// Initial state
const initialState = {
  user: null,
  token: null,
  refreshToken: null,
  loading: true,
  isAuthenticated: false,
  error: null,
}

// Action types
const AUTH_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_ERROR: 'LOGIN_ERROR',
  LOGOUT: 'LOGOUT',
  UPDATE_USER: 'UPDATE_USER',
  CLEAR_ERROR: 'CLEAR_ERROR',
  TOKEN_REFRESH: 'TOKEN_REFRESH',
}

// Reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload }
      
    case AUTH_ACTIONS.LOGIN_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        refreshToken: action.payload.refreshToken,
        isAuthenticated: true,
        loading: false,
        error: null,
      }
      
    case AUTH_ACTIONS.LOGIN_ERROR:
      return {
        ...state,
        user: null,
        token: null,
        refreshToken: null,
        isAuthenticated: false,
        loading: false,
        error: action.payload,
      }
      
    case AUTH_ACTIONS.LOGOUT:
      return {
        ...state,
        user: null,
        token: null,
        refreshToken: null,
        isAuthenticated: false,
        loading: false,
        error: null,
      }
      
    case AUTH_ACTIONS.UPDATE_USER:
      return {
        ...state,
        user: { ...state.user, ...action.payload },
      }
      
    case AUTH_ACTIONS.CLEAR_ERROR:
      return { ...state, error: null }
      
    case AUTH_ACTIONS.TOKEN_REFRESH:
      return {
        ...state,
        token: action.payload.token,
        refreshToken: action.payload.refreshToken,
      }
      
    default:
      return state
  }
}

// Create context
const AuthContext = createContext(null)

// AuthProvider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState)
  const navigate = useNavigate()
  const location = useLocation()

  // Initialize auth state from storage
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true })
        
        const savedUser = authStorage.get('user')
        const savedToken = authStorage.get('token')
        const savedRefreshToken = authStorage.get('refreshToken')
        
        if (savedToken) {
          try {
            // Check if token is expired
            if (isJWTExpired(savedToken)) {
              throw new Error('Token expired')
            }

            // Extract user from token (in case stored user is outdated)
            const userFromToken = extractUserFromJWT(savedToken)
            
            if (!userFromToken) {
              throw new Error('Invalid token format')
            }

            // Import auth service dynamically to avoid circular dependencies
            const { default: authService } = await import('../services/auth.js')
            
            // Verify token validity with backend
            await authService.verifyToken(savedToken)
            
            // Token is valid, restore auth state with user from token
            dispatch({
              type: AUTH_ACTIONS.LOGIN_SUCCESS,
              payload: {
                user: userFromToken,
                token: savedToken,
                refreshToken: savedRefreshToken,
              },
            })
          } catch (verifyError) {
            console.log('Token verification failed, attempting refresh...')
            
            // Token invalid, try to refresh
            if (savedRefreshToken) {
              try {
                const { default: authService } = await import('../services/auth.js')
                const response = await authService.refreshToken(savedRefreshToken)
                
                // Update stored tokens
                authStorage.set('token', response.access)
                if (response.refresh) {
                  authStorage.set('refreshToken', response.refresh)
                }
                
                dispatch({
                  type: AUTH_ACTIONS.LOGIN_SUCCESS,
                  payload: {
                    user: savedUser,
                    token: response.access,
                    refreshToken: response.refresh || savedRefreshToken,
                  },
                })
              } catch (refreshError) {
                console.log('Token refresh failed, clearing auth state')
                // Clear invalid tokens
                authStorage.remove('user')
                authStorage.remove('token')
                authStorage.remove('refreshToken')
                dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false })
              }
            } else {
              // No refresh token available
              authStorage.remove('user')
              authStorage.remove('token')
              authStorage.remove('refreshToken')
              dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false })
            }
          }
        } else {
          dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false })
        }
      } catch (error) {
        console.error('Failed to initialize auth:', error)
        dispatch({
          type: AUTH_ACTIONS.LOGIN_ERROR,
          payload: 'Failed to initialize authentication',
        })
      }
    }

    initializeAuth()
  }, [])

  // Login function
  const login = async (credentials) => {
    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true })
      dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR })

      // Import auth service dynamically to avoid circular dependencies
      const { default: authService } = await import('../services/auth.js')
      
      // Call actual API
      const response = await authService.login(credentials)

      console.log('Login response:', response) // Debug log

      const { access: token, refresh: refreshToken } = response

      // Validate response structure
      if (!token || !refreshToken) {
        throw new Error('Login response missing tokens')
      }

      // Extract user information from JWT token
      const user = extractUserFromJWT(token)
      
      if (!user) {
        throw new Error('Unable to extract user information from token')
      }

      console.log('Extracted user from JWT:', user) // Debug log

      // Store in secure storage
      authStorage.set('user', user)
      authStorage.set('token', token)
      authStorage.set('refreshToken', refreshToken)

      // Update state
      dispatch({
        type: AUTH_ACTIONS.LOGIN_SUCCESS,
        payload: { user, token, refreshToken },
      })

      // Role-based redirection after successful login
      const roleRoutes = {
        'ADMIN': '/admin',
        'TEACHER': '/teacher',
        'STUDENT': '/student',
        'PARENT': '/parent',
        'STAFF': '/admin',
        'DRIVER': '/admin'
      }

      // Get intended destination from location state or default to role-based route
      const from = location.state?.from?.pathname || roleRoutes[user.role] || '/student'
      
      console.log('Redirecting to:', from, 'for role:', user.role) // Debug log
      
      // Navigate to appropriate dashboard
      navigate(from, { replace: true })

      return { success: true, user }
    } catch (error) {
      console.error('Login error:', error)
      const errorMessage = error.userMessage || error.message || 'Login failed. Please try again.'
      
      dispatch({
        type: AUTH_ACTIONS.LOGIN_ERROR,
        payload: errorMessage,
      })
      
      return { success: false, error: errorMessage }
    }
  }

  // Logout function
  const logout = async () => {
    try {
      // Import auth service dynamically to avoid circular dependencies
      const { default: authService } = await import('../services/auth.js')
      
      // Call auth service logout (clears storage)
      authService.logout()

      // Also clear from authStorage (our context storage)
      authStorage.remove('user')
      authStorage.remove('token')
      authStorage.remove('refreshToken')

      // Update state
      dispatch({ type: AUTH_ACTIONS.LOGOUT })
      
      return { success: true }
    } catch (error) {
      console.error('Logout error:', error)
      return { success: false, error: error.message }
    }
  }

  // Update user profile
  const updateUser = (userData) => {
    try {
      const updatedUser = { ...state.user, ...userData }
      authStorage.set('user', updatedUser)
      dispatch({ type: AUTH_ACTIONS.UPDATE_USER, payload: userData })
      return { success: true }
    } catch (error) {
      console.error('Update user error:', error)
      return { success: false, error: error.message }
    }
  }

  // Token refresh
  const refreshToken = async () => {
    try {
      // Import auth service dynamically to avoid circular dependencies
      const { default: authService } = await import('../services/auth.js')
      
      const currentRefreshToken = authStorage.get('refreshToken')
      if (!currentRefreshToken) {
        throw new Error('No refresh token available')
      }

      // Call actual API
      const response = await authService.refreshToken(currentRefreshToken)
      
      const newToken = response.access
      const newRefreshToken = response.refresh || currentRefreshToken
      
      authStorage.set('token', newToken)
      authStorage.set('refreshToken', newRefreshToken)
      
      dispatch({
        type: AUTH_ACTIONS.TOKEN_REFRESH,
        payload: { token: newToken, refreshToken: newRefreshToken },
      })
      
      return { success: true, token: newToken }
    } catch (error) {
      console.error('Token refresh error:', error)
      logout() // Force logout on refresh failure
      return { success: false, error: error.message }
    }
  }

  // Permission checking functions
  const hasRole = (role) => {
    return state.user?.role === role
  }

  const hasAnyRole = (roles) => {
    return roles.some(role => state.user?.role === role)
  }

  const hasPermission = (permission) => {
    return state.user?.permissions?.includes(permission) || false
  }

  const hasAnyPermission = (permissions) => {
    return permissions.some(permission => 
      state.user?.permissions?.includes(permission)
    )
  }

  // Clear error
  const clearError = useCallback(() => {
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR })
  }, [])

  // Role shortcuts
  const isAdmin = hasRole(USER_ROLES.ADMIN)
  const isTeacher = hasRole(USER_ROLES.TEACHER)
  const isStudent = hasRole(USER_ROLES.STUDENT)
  const isParent = hasRole(USER_ROLES.PARENT)
  const isStaff = hasRole(USER_ROLES.STAFF)
  const isDriver = hasRole(USER_ROLES.DRIVER)

  const value = {
    // State
    ...state,
    
    // Actions
    login,
    logout,
    updateUser,
    refreshToken,
    clearError,
    
    // Permission helpers
    hasRole,
    hasAnyRole,
    hasPermission,
    hasAnyPermission,
    
    // Role shortcuts
    isAdmin,
    isTeacher,
    isStudent,
    isParent,
    isStaff,
    isDriver,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Export context for advanced usage
export { AuthContext }