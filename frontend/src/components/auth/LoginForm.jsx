import React, { useState, useEffect } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { useAuth } from '../../hooks/useAuth'
import { useLanguage } from '../../hooks/useLanguage'
import LoadingSpinner from '../shared/LoadingSpinner'
import ChangePasswordModal from './ChangePasswordModal'
import { useNavigate } from 'react-router-dom'

const LoginForm = ({ onSuccess = () => {} }) => {
  const { t, isRTL } = useLanguage()
  const { login, changePassword, loading: authLoading, error: authError, clearError } = useAuth()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [formErrors, setFormErrors] = useState({})
  const [showPasswordChangeModal, setShowPasswordChangeModal] = useState(false)
  const [passwordChangeLoading, setPasswordChangeLoading] = useState(false)
  const [passwordChangeError, setPasswordChangeError] = useState('')

  // Clear auth error when component mounts
  useEffect(() => {
    clearError()
  }, [clearError])

  // Clear form errors when auth error changes
  useEffect(() => {
    if (authError) {
      setFormErrors({})
    }
  }, [authError])

  const validateForm = () => {
    const errors = {}
    
    if (!formData.email.trim()) {
      errors.email = t('validation.emailRequired')
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = t('validation.emailInvalid')
    }
    
    if (!formData.password.trim()) {
      errors.password = t('validation.passwordRequired')
    } else if (formData.password.length < 8) {
      errors.password = t('validation.passwordTooShort')
    }
    
    return errors
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
    
    // Clear specific field error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: '',
      }))
    }
    
    // Clear auth error when user modifies form
    if (authError) {
      clearError()
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    clearError()
    
    // Validate form
    const errors = validateForm()
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      return
    }
    
    setFormErrors({})
    
    try {
      const result = await login(formData)
      if (result.success) {
        if (result.force_password_change) {
          // Redirect to first-login page for mandatory password change and profile update
          navigate('/first-login', { replace: true })
        } else {
          onSuccess()
        }
      }
      // Error handling is done by the AuthContext
    } catch (error) {
      console.error('Login form error:', error)
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const getPlaceholder = (key, fallback) => {
    try {
      return t(`auth.placeholders.${key}`)
    } catch {
      return fallback
    }
  }

  const handlePasswordChange = async (passwordData) => {
    setPasswordChangeLoading(true)
    setPasswordChangeError('')
    
    try {
      const result = await changePassword(passwordData)
      if (result.success) {
        setShowPasswordChangeModal(false)
        // Navigate to appropriate dashboard after successful password change
        const user = JSON.parse(localStorage.getItem('user') || '{}')
        const roleRoutes = {
          'ADMIN': '/admin',
          'TEACHER': '/teacher',
          'STUDENT': '/student',
          'PARENT': '/parent',
          'STAFF': '/admin',
          'DRIVER': '/admin'
        }
        const targetRoute = roleRoutes[user.role] || '/student'
        navigate(targetRoute, { replace: true })
        onSuccess()
      } else {
        setPasswordChangeError(result.error)
      }
    } catch (error) {
      console.error('Password change error:', error)
      setPasswordChangeError(error.message || 'Password change failed')
    } finally {
      setPasswordChangeLoading(false)
    }
  }

  const handlePasswordChangeClose = () => {
    setShowPasswordChangeModal(false)
    setPasswordChangeError('')
  }

  return (
    <>
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Email Field */}
      <div className="space-y-2">
        <label 
          htmlFor="email" 
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-foreground"
        >
          {t('auth.email')}
        </label>
        <Input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleInputChange}
          disabled={authLoading}
          placeholder={getPlaceholder('email', 'Enter your email')}
          className={`${formErrors.email ? 'border-red-500 focus-visible:ring-red-500' : ''} ${isRTL ? 'text-right' : 'text-left'}`}
          dir={isRTL ? 'rtl' : 'ltr'}
        />
        {formErrors.email && (
          <p className="text-sm text-red-500 mt-1">{formErrors.email}</p>
        )}
      </div>

      {/* Password Field */}
      <div className="space-y-2">
        <label 
          htmlFor="password" 
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-foreground"
        >
          {t('auth.password')}
        </label>
        <div className="relative">
          <Input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={handleInputChange}
            disabled={authLoading}
            placeholder={getPlaceholder('password', 'Enter your password')}
            className={`${formErrors.password ? 'border-red-500 focus-visible:ring-red-500' : ''} ${isRTL ? 'text-right pr-10' : 'text-left pr-10'}`}
            dir={isRTL ? 'rtl' : 'ltr'}
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className={`absolute top-1/2 transform -translate-y-1/2 ${isRTL ? 'left-3' : 'right-3'} text-muted-foreground hover:text-foreground focus:outline-none`}
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
        {formErrors.password && (
          <p className="text-sm text-red-500 mt-1">{formErrors.password}</p>
        )}
      </div>

      {/* Auth Error Display */}
      {authError && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-md p-3">
          <p className="text-sm text-destructive text-center">{t(authError)}</p>
        </div>
      )}

      {/* Submit Button */}
      <Button
        type="submit"
        className="w-full bg-blue-600 text-white cursor-pointer hover:bg-blue-700 font-semibold"
        disabled={authLoading}
      >
        {authLoading ? (
          <div className="flex items-center justify-center space-x-2">
            <LoadingSpinner size="sm" />
            <span>{t('common.loading')}</span>
          </div>
        ) : (
          t('auth.login')
        )}
      </Button>
    </form>

    {/* Password Change Modal */}
    <ChangePasswordModal
      isOpen={showPasswordChangeModal}
      onClose={handlePasswordChangeClose}
      onPasswordChange={handlePasswordChange}
      loading={passwordChangeLoading}
    />
    
    {/* Password Change Error Display */}
    {passwordChangeError && showPasswordChangeModal && (
      <div className="mt-4 bg-destructive/10 border border-destructive/20 rounded-md p-3">
        <p className="text-sm text-destructive text-center">{passwordChangeError}</p>
      </div>
    )}
  </>
  )
}

export default LoginForm
