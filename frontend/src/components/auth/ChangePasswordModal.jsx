import React, { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog'
import { useLanguage } from '../../hooks/useLanguage'
import LoadingSpinner from '../shared/LoadingSpinner'

const ChangePasswordModal = ({ isOpen, onClose, onPasswordChange, loading = false }) => {
  const { t, isRTL } = useLanguage()
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  })
  const [formErrors, setFormErrors] = useState({})

  const validateForm = () => {
    const errors = {}
    
    if (!formData.currentPassword.trim()) {
      errors.currentPassword = t('validation.currentPasswordRequired')
    }
    
    if (!formData.newPassword.trim()) {
      errors.newPassword = t('validation.newPasswordRequired')
    } else if (formData.newPassword.length < 8) {
      errors.newPassword = t('validation.passwordTooShort')
    }
    
    if (!formData.confirmPassword.trim()) {
      errors.confirmPassword = t('validation.confirmPasswordRequired')
    } else if (formData.newPassword !== formData.confirmPassword) {
      errors.confirmPassword = t('validation.passwordsDoNotMatch')
    }

    // Check if new password is same as current
    if (formData.currentPassword && formData.newPassword && formData.currentPassword === formData.newPassword) {
      errors.newPassword = t('validation.newPasswordMustBeDifferent')
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
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validate form
    const errors = validateForm()
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      return
    }
    
    setFormErrors({})
    
    try {
      await onPasswordChange(formData)
      // Reset form on success
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      })
      setShowPasswords({
        current: false,
        new: false,
        confirm: false,
      })
    } catch (error) {
      // Handle error (this will be handled by the parent component)
      console.error('Password change error:', error)
    }
  }

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }))
  }

  const getPlaceholder = (key, fallback) => {
    try {
      return t(`auth.placeholders.${key}`)
    } catch {
      return fallback
    }
  }

  const handleClose = () => {
    // Reset form when closing
    setFormData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    })
    setFormErrors({})
    setShowPasswords({
      current: false,
      new: false,
      confirm: false,
    })
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]" dir={isRTL ? 'rtl' : 'ltr'}>
        <DialogHeader>
          <DialogTitle className={isRTL ? 'text-right' : 'text-left'}>
            {t('auth.changePassword')}
          </DialogTitle>
          <DialogDescription className={isRTL ? 'text-right' : 'text-left'}>
            {t('auth.changePasswordDescription')}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {/* Current Password Field */}
          <div className="space-y-2">
            <label 
              htmlFor="currentPassword" 
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-foreground"
            >
              {t('auth.currentPassword')}
            </label>
            <div className="relative">
              <Input
                id="currentPassword"
                name="currentPassword"
                type={showPasswords.current ? 'text' : 'password'}
                value={formData.currentPassword}
                onChange={handleInputChange}
                disabled={loading}
                placeholder={getPlaceholder('currentPassword', 'Enter your current password')}
                className={`${formErrors.currentPassword ? 'border-red-500 focus-visible:ring-red-500' : ''} ${isRTL ? 'text-right pr-10' : 'text-left pr-10'}`}
                dir={isRTL ? 'rtl' : 'ltr'}
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('current')}
                className={`absolute top-1/2 transform -translate-y-1/2 ${isRTL ? 'left-3' : 'right-3'} text-muted-foreground hover:text-foreground focus:outline-none`}
                tabIndex={-1}
              >
                {showPasswords.current ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {formErrors.currentPassword && (
              <p className="text-sm text-red-500 mt-1">{formErrors.currentPassword}</p>
            )}
          </div>

          {/* New Password Field */}
          <div className="space-y-2">
            <label 
              htmlFor="newPassword" 
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-foreground"
            >
              {t('auth.newPassword')}
            </label>
            <div className="relative">
              <Input
                id="newPassword"
                name="newPassword"
                type={showPasswords.new ? 'text' : 'password'}
                value={formData.newPassword}
                onChange={handleInputChange}
                disabled={loading}
                placeholder={getPlaceholder('newPassword', 'Enter your new password')}
                className={`${formErrors.newPassword ? 'border-red-500 focus-visible:ring-red-500' : ''} ${isRTL ? 'text-right pr-10' : 'text-left pr-10'}`}
                dir={isRTL ? 'rtl' : 'ltr'}
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('new')}
                className={`absolute top-1/2 transform -translate-y-1/2 ${isRTL ? 'left-3' : 'right-3'} text-muted-foreground hover:text-foreground focus:outline-none`}
                tabIndex={-1}
              >
                {showPasswords.new ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {formErrors.newPassword && (
              <p className="text-sm text-red-500 mt-1">{formErrors.newPassword}</p>
            )}
          </div>

          {/* Confirm Password Field */}
          <div className="space-y-2">
            <label 
              htmlFor="confirmPassword" 
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-foreground"
            >
              {t('auth.confirmPassword')}
            </label>
            <div className="relative">
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type={showPasswords.confirm ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={handleInputChange}
                disabled={loading}
                placeholder={getPlaceholder('confirmPassword', 'Confirm your new password')}
                className={`${formErrors.confirmPassword ? 'border-red-500 focus-visible:ring-red-500' : ''} ${isRTL ? 'text-right pr-10' : 'text-left pr-10'}`}
                dir={isRTL ? 'rtl' : 'ltr'}
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('confirm')}
                className={`absolute top-1/2 transform -translate-y-1/2 ${isRTL ? 'left-3' : 'right-3'} text-muted-foreground hover:text-foreground focus:outline-none`}
                tabIndex={-1}
              >
                {showPasswords.confirm ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {formErrors.confirmPassword && (
              <p className="text-sm text-red-500 mt-1">{formErrors.confirmPassword}</p>
            )}
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={loading}
            >
              {t('common.cancel')}
            </Button>
            <Button
              type="submit"
              className="bg-blue-600 text-white hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <LoadingSpinner size="sm" />
                  <span>{t('common.loading')}</span>
                </div>
              ) : (
                t('auth.changePassword')
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default ChangePasswordModal