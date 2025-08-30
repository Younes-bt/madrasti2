import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { authStorage } from '../utils/storage'
import { USER_ROLES } from '../utils/constants'

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

  // Initialize auth state from storage
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true })
        
        const savedUser = authStorage.get('user')
        const savedToken = authStorage.get('token')
        const savedRefreshToken = authStorage.get('refreshToken')
        
        if (savedUser && savedToken) {
          // TODO: Verify token validity with backend
          dispatch({
            type: AUTH_ACTIONS.LOGIN_SUCCESS,
            payload: {
              user: savedUser,
              token: savedToken,
              refreshToken: savedRefreshToken,
            },
          })
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

      // TODO: Replace with actual API call
      // For now, using mock data for development
      const mockResponse = {
        access: 'mock-access-token-' + Date.now(),
        refresh: 'mock-refresh-token-' + Date.now(),
        user: {
          id: 1,
          email: credentials.email,
          full_name: 'John Doe',
          role: 'TEACHER',
          permissions: ['can_manage_attendance', 'can_create_assignments'],
          profile_picture: null,
          profile_picture_url: null,
          school_info: {
            name: 'Madrasti School',
            logo_url: null,
          },
        },
      }

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Validate credentials (mock validation)
      if (credentials.email === 'error@test.com') {
        throw new Error('Invalid credentials')
      }

      const { user, access: token, refresh: refreshToken } = mockResponse

      // Store in secure storage
      authStorage.set('user', user)
      authStorage.set('token', token)
      authStorage.set('refreshToken', refreshToken)

      // Update state
      dispatch({
        type: AUTH_ACTIONS.LOGIN_SUCCESS,
        payload: { user, token, refreshToken },
      })

      return { success: true, user }
    } catch (error) {
      console.error('Login error:', error)
      const errorMessage = error.message || 'Login failed. Please try again.'
      
      dispatch({
        type: AUTH_ACTIONS.LOGIN_ERROR,
        payload: errorMessage,
      })
      
      return { success: false, error: errorMessage }
    }
  }

  // Logout function
  const logout = () => {
    try {
      // Clear storage
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

  // Token refresh (for future implementation)
  const refreshToken = async () => {
    try {
      // TODO: Implement actual token refresh logic
      const newToken = 'new-mock-token-' + Date.now()
      const newRefreshToken = 'new-refresh-token-' + Date.now()
      
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
  const clearError = () => {
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR })
  }

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