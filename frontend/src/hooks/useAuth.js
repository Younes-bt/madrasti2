import { useState, useEffect, useCallback } from 'react'
import { authStorage } from '../utils/storage'
import { USER_ROLES } from '../utils/constants'

export const useAuth = () => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Initialize auth state
  useEffect(() => {
    const initAuth = () => {
      try {
        const savedUser = authStorage.get('user')
        const savedToken = authStorage.get('token')
        
        if (savedUser && savedToken) {
          setUser(savedUser)
          setToken(savedToken)
          setIsAuthenticated(true)
        }
      } catch (error) {
        console.error('Failed to initialize auth state:', error)
      } finally {
        setLoading(false)
      }
    }

    initAuth()
  }, [])

  const login = useCallback(async (userData, accessToken) => {
    try {
      setLoading(true)
      
      // Store auth data
      authStorage.set('user', userData)
      authStorage.set('token', accessToken)
      
      // Update state
      setUser(userData)
      setToken(accessToken)
      setIsAuthenticated(true)
      
      return true
    } catch (error) {
      console.error('Login error:', error)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    try {
      // Clear storage
      authStorage.remove('user')
      authStorage.remove('token')
      
      // Clear state
      setUser(null)
      setToken(null)
      setIsAuthenticated(false)
    } catch (error) {
      console.error('Logout error:', error)
    }
  }, [])

  const updateUser = useCallback((userData) => {
    try {
      authStorage.set('user', userData)
      setUser(userData)
    } catch (error) {
      console.error('Update user error:', error)
    }
  }, [])

  const hasRole = useCallback((role) => {
    return user?.role === role
  }, [user])

  const hasAnyRole = useCallback((roles) => {
    return roles.some(role => user?.role === role)
  }, [user])

  const isAdmin = hasRole(USER_ROLES.ADMIN)
  const isTeacher = hasRole(USER_ROLES.TEACHER)
  const isStudent = hasRole(USER_ROLES.STUDENT)
  const isParent = hasRole(USER_ROLES.PARENT)

  return {
    user,
    token,
    loading,
    isAuthenticated,
    isAdmin,
    isTeacher,
    isStudent,
    isParent,
    login,
    logout,
    updateUser,
    hasRole,
    hasAnyRole,
  }
}