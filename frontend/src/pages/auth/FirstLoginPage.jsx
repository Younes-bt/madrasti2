import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useLanguage } from '../../hooks/useLanguage'
import { Card, CardContent } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Textarea } from '../../components/ui/textarea'
import LoadingSpinner from '../../components/shared/LoadingSpinner'
import ThemeToggle from '../../components/shared/ThemeToggle'
import LanguageSwitcher from '../../components/shared/LanguageSwitcher'
import { apiMethods } from '../../services/api'

const FirstLoginPage = () => {
  const { t, isRTL } = useLanguage()
  const navigate = useNavigate()
  const { user, changePassword, logout } = useAuth()

  const [profileLoading, setProfileLoading] = useState(true)
  const [savingProfile, setSavingProfile] = useState(false)
  const [profileError, setProfileError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [passwordChanged, setPasswordChanged] = useState(false)
  const [profileUpdated, setProfileUpdated] = useState(false)

  const [profileData, setProfileData] = useState({
    first_name: '',
    last_name: '',
    ar_first_name: '',
    ar_last_name: '',
    phone: '',
    date_of_birth: '',
    address: '',
    bio: '',
    emergency_contact_name: '',
    emergency_contact_phone: '',
    linkedin_url: '',
    twitter_url: '',
  })
  const [profilePicture, setProfilePicture] = useState(null)

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const [showPassword, setShowPassword] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false
  })

  const togglePasswordVisibility = (field) => {
    setShowPassword(prev => ({ ...prev, [field]: !prev[field] }))
  }

  useEffect(() => {
    let cancelled = false
    const loadProfile = async () => {
      try {
        setProfileLoading(true)
        const resp = await apiMethods.get('users/profile/')
        if (cancelled) return
        setProfileData({
          first_name: resp.first_name || '',
          last_name: resp.last_name || '',
          ar_first_name: resp.ar_first_name || '',
          ar_last_name: resp.ar_last_name || '',
          phone: resp.phone || '',
          date_of_birth: resp.date_of_birth || '',
          address: resp.address || '',
          bio: resp.bio || '',
          emergency_contact_name: resp.emergency_contact_name || '',
          emergency_contact_phone: resp.emergency_contact_phone || '',
          linkedin_url: resp.linkedin_url || '',
          twitter_url: resp.twitter_url || '',
        })
      } catch (e) {
        setProfileError(e?.userMessage || e?.message || 'Failed to load profile')
      } finally {
        if (!cancelled) setProfileLoading(false)
      }
    }
    loadProfile()
    return () => { cancelled = true }
  }, [])

  const onChangeProfileField = (e) => {
    const { name, value } = e.target
    setProfileData(prev => ({ ...prev, [name]: value }))
    if (profileError) setProfileError('')
  }

  const onPasswordFieldChange = (e) => {
    const { name, value } = e.target
    setPasswordData(prev => ({ ...prev, [name]: value }))
    if (passwordError) setPasswordError('')
  }

  const handlePasswordSubmit = async (e) => {
    e.preventDefault()
    setPasswordError('')
    setPasswordLoading(true)
    try {
      if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
        setPasswordError('All password fields are required')
        return
      }
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        setPasswordError('New passwords do not match')
        return
      }
      const res = await changePassword(passwordData)
      if (res.success) {
        setPasswordChanged(true)
        setTimeout(async () => {
          await logout()
          window.location.href = '/login'
        }, 1500)
      } else {
        setPasswordError(res.error || 'Password change failed')
      }
    } catch (e) {
      setPasswordError(e?.userMessage || e?.message || 'Password change failed')
    } finally {
      setPasswordLoading(false)
    }
  }

  const handleProfileSubmit = async (e) => {
    e.preventDefault()
    setProfileError('')
    setSavingProfile(true)
    try {
      // Build FormData to support optional file upload
      const formData = new FormData()
      // Append scalar fields
      Object.entries(profileData).forEach(([k, v]) => {
        if (v === undefined || v === null || v === '') return
        formData.append(k, v)
      })
      if (profilePicture) {
        formData.append('profile_picture', profilePicture)
      }

      // Use PATCH to partially update
      const updated = await apiMethods.patch('users/profile/', formData)
      if (updated) setProfileUpdated(true)
    } catch (e) {
      setProfileError(e?.userMessage || e?.message || 'Profile update failed')
    } finally {
      setSavingProfile(false)
    }
  }



  return (
    <div className={`min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 ${isRTL ? 'rtl' : 'ltr'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header with Theme/Language Controls */}
      <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
        <LanguageSwitcher />
        <ThemeToggle />
      </div>

      <div className="flex flex-col lg:flex-row">
        {/* Hero Section */}
        <div className="min-h-screen lg:w-2/5 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground p-8 lg:p-12 flex flex-col justify-center relative overflow-hidden">
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

          <div className="relative z-10 space-y-8 py-12">
            <div className="inline-block p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
              <svg className="w-14 h-14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>

            <div>
              <h1 className="text-4xl lg:text-5xl font-bold mb-4 leading-tight">
                {t('auth.firstLoginTitle') || 'Welcome to Your Journey!'}
              </h1>
              <p className="text-lg lg:text-xl text-primary-foreground/90 leading-relaxed">
                {t('auth.firstLoginDescription') || 'This is your first login. Let\'s secure your account and set up your profile to get started.'}
              </p>
            </div>

            <div className="space-y-6 pt-2">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm flex-shrink-0">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-xl mb-2">{t('auth.securityFirst') || 'Security First'}</h3>
                  <p className="text-base text-primary-foreground/80 leading-relaxed">
                    {t('auth.firstLoginWhySecurity') || 'Default passwords are insecure. Protect your account with a strong password.'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm flex-shrink-0">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-xl mb-2">{t('auth.completeProfile') || 'Complete Your Profile'}</h3>
                  <p className="text-base text-primary-foreground/80 leading-relaxed">
                    {t('auth.firstLoginWhatDo') || 'Add your personal information to personalize your experience.'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm flex-shrink-0">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-xl mb-2">{t('auth.getStarted') || 'Get Started'}</h3>
                  <p className="text-base text-primary-foreground/80 leading-relaxed">
                    {t('auth.firstLoginAfter') || 'Once completed, you\'ll be redirected to your dashboard.'}
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-white/20">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="font-medium">{t('auth.setupProgress') || 'Setup Progress'}</span>
                <span className="font-semibold">
                  {(passwordChanged && profileUpdated) ? '100%' : profileUpdated ? '50%' : '0%'}
                </span>
              </div>
              <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white transition-all duration-500 ease-out"
                  style={{ width: (passwordChanged && profileUpdated) ? '100%' : profileUpdated ? '50%' : '0%' }}
                ></div>
              </div>
              <div className="flex gap-4 mt-3 text-xs">
                <div className="flex items-center gap-1.5">
                  {profileUpdated ? (
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <div className="w-4 h-4 border-2 border-white/40 rounded-full"></div>
                  )}
                  <span>{t('auth.profileCompleted') || 'Profile Completed'}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {passwordChanged ? (
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <div className="w-4 h-4 border-2 border-white/40 rounded-full"></div>
                  )}
                  <span>{t('auth.passwordChanged') || 'Password Changed'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Forms Section */}
        <div className="lg:w-3/5 p-4 lg:p-8 overflow-y-auto">
          <div className="max-w-3xl mx-auto space-y-6">

            {/* Step Indicator */}
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${profileUpdated ? 'bg-green-500 text-white' : 'bg-primary text-primary-foreground'}`}>
                  {profileUpdated ? '✓' : '1'}
                </div>
                <div className="flex-1 h-0.5 bg-border"></div>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${passwordChanged ? 'bg-green-500 text-white' : profileUpdated ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                  {passwordChanged ? '✓' : '2'}
                </div>
              </div>
            </div>

            {/* Step 2: Change Password - Only show if profile is updated */}
            {profileUpdated && !passwordChanged && (
              <Card className="border-2 hover:border-primary/50 transition-colors">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-xl font-bold">{t('auth.changePassword') || 'Step 2: Change Password'}</h2>
                      <p className="text-sm text-muted-foreground">{t('auth.passwordRequired') || 'Create a strong, secure password'}</p>
                    </div>
                  </div>
                  <form onSubmit={handlePasswordSubmit} className="space-y-4">
                    <div>
                      <Label className="block text-sm font-medium mb-2">{t('auth.currentPassword') || 'Current Password'}</Label>
                      <div className="relative">
                        <Input
                          name="currentPassword"
                          type={showPassword.currentPassword ? "text" : "password"}
                          value={passwordData.currentPassword}
                          onChange={onPasswordFieldChange}
                          className="h-11 pr-10"
                          placeholder="••••••••"
                        />
                        <button
                          type="button"
                          onClick={() => togglePasswordVisibility('currentPassword')}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {showPassword.currentPassword ? (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                            </svg>
                          ) : (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          )}
                        </button>
                      </div>
                    </div>
                    <div>
                      <Label className="block text-sm font-medium mb-2">{t('auth.newPassword') || 'New Password'}</Label>
                      <div className="relative">
                        <Input
                          name="newPassword"
                          type={showPassword.newPassword ? "text" : "password"}
                          value={passwordData.newPassword}
                          onChange={onPasswordFieldChange}
                          className="h-11 pr-10"
                          placeholder="••••••••"
                        />
                        <button
                          type="button"
                          onClick={() => togglePasswordVisibility('newPassword')}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {showPassword.newPassword ? (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                            </svg>
                          ) : (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          )}
                        </button>
                      </div>
                    </div>
                    <div>
                      <Label className="block text-sm font-medium mb-2">{t('auth.confirmPassword') || 'Confirm Password'}</Label>
                      <div className="relative">
                        <Input
                          name="confirmPassword"
                          type={showPassword.confirmPassword ? "text" : "password"}
                          value={passwordData.confirmPassword}
                          onChange={onPasswordFieldChange}
                          className="h-11 pr-10"
                          placeholder="••••••••"
                        />
                        <button
                          type="button"
                          onClick={() => togglePasswordVisibility('confirmPassword')}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {showPassword.confirmPassword ? (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                            </svg>
                          ) : (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                          )}
                        </button>
                      </div>
                    </div>
                    {passwordError && (
                      <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                        <p className="text-sm text-red-600 dark:text-red-400">{passwordError}</p>
                      </div>
                    )}
                    <Button type="submit" className="w-full h-11" disabled={passwordLoading || passwordChanged}>
                      {passwordLoading ? (
                        <span className="inline-flex items-center">
                          <LoadingSpinner size="sm" />
                          <span className="ml-2">{t('common.saving') || 'Saving...'}</span>
                        </span>
                      ) : passwordChanged ? (
                        <span className="inline-flex items-center">
                          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          {t('common.saved') || 'Password Changed'}
                        </span>
                      ) : (
                        t('auth.updatePassword') || 'Update Password'
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Step 1: Complete Profile - Only show if profile not updated */}
            {!profileUpdated && (
              <Card className="border-2 hover:border-primary/50 transition-colors">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-xl font-bold">{t('profile.completeProfile') || 'Step 1: Complete Your Profile'}</h2>
                      <p className="text-sm text-muted-foreground">{t('profile.profileDescription') || 'Add your personal information'}</p>
                    </div>
                  </div>
                  {profileLoading ? (
                    <div className="py-12 text-center">
                      <LoadingSpinner />
                    </div>
                  ) : (
                    <form onSubmit={handleProfileSubmit} className="space-y-5">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label className="block text-sm font-medium mb-2">{t('profile.firstName') || 'First Name'}</Label>
                          <Input name="first_name" value={profileData.first_name} onChange={onChangeProfileField} className="h-11" />
                        </div>
                        <div>
                          <Label className="block text-sm font-medium mb-2">{t('profile.lastName') || 'Last Name'}</Label>
                          <Input name="last_name" value={profileData.last_name} onChange={onChangeProfileField} className="h-11" />
                        </div>
                        <div>
                          <Label className="block text-sm font-medium mb-2">{t('profile.arFirstName') || 'Arabic First Name'}</Label>
                          <Input name="ar_first_name" value={profileData.ar_first_name} onChange={onChangeProfileField} dir="rtl" className="h-11" />
                        </div>
                        <div>
                          <Label className="block text-sm font-medium mb-2">{t('profile.arLastName') || 'Arabic Last Name'}</Label>
                          <Input name="ar_last_name" value={profileData.ar_last_name} onChange={onChangeProfileField} dir="rtl" className="h-11" />
                        </div>
                        <div>
                          <Label className="block text-sm font-medium mb-2">{t('profile.phone') || 'Phone'}</Label>
                          <Input name="phone" value={profileData.phone} onChange={onChangeProfileField} className="h-11" />
                        </div>
                        <div>
                          <Label className="block text-sm font-medium mb-2">{t('common.dateOfBirth') || 'Date of Birth'}</Label>
                          <Input type="date" name="date_of_birth" value={profileData.date_of_birth} onChange={onChangeProfileField} className="h-11" />
                        </div>
                      </div>

                      <div>
                        <Label className="block text-sm font-medium mb-2">{t('profile.address') || 'Address'}</Label>
                        <Input name="address" value={profileData.address} onChange={onChangeProfileField} className="h-11" />
                      </div>

                      <div>
                        <Label className="block text-sm font-medium mb-2">{t('profile.bio') || 'Bio'}</Label>
                        <Textarea name="bio" value={profileData.bio} onChange={onChangeProfileField} rows={3} className="resize-none" />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label className="block text-sm font-medium mb-2">{t('profile.emergencyContactName') || 'Emergency Contact Name'}</Label>
                          <Input name="emergency_contact_name" value={profileData.emergency_contact_name} onChange={onChangeProfileField} className="h-11" />
                        </div>
                        <div>
                          <Label className="block text-sm font-medium mb-2">{t('profile.emergencyContactPhone') || 'Emergency Contact Phone'}</Label>
                          <Input name="emergency_contact_phone" value={profileData.emergency_contact_phone} onChange={onChangeProfileField} className="h-11" />
                        </div>
                        <div>
                          <Label className="block text-sm font-medium mb-2">{t('profile.linkedin') || 'LinkedIn URL'}</Label>
                          <Input name="linkedin_url" value={profileData.linkedin_url} onChange={onChangeProfileField} className="h-11" placeholder="https://linkedin.com/in/..." />
                        </div>
                        <div>
                          <Label className="block text-sm font-medium mb-2">{t('profile.twitter') || 'Twitter URL'}</Label>
                          <Input name="twitter_url" value={profileData.twitter_url} onChange={onChangeProfileField} className="h-11" placeholder="https://twitter.com/..." />
                        </div>
                      </div>

                      <div>
                        <Label className="block text-sm font-medium mb-2">{t('profile.profilePicture') || 'Profile Picture'}</Label>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => setProfilePicture(e.target.files?.[0] || null)}
                          className="block w-full text-sm text-muted-foreground file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 cursor-pointer"
                        />
                      </div>

                      {profileError && (
                        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                          <p className="text-sm text-red-600 dark:text-red-400">{profileError}</p>
                        </div>
                      )}
                      <Button type="submit" className="w-full h-11" disabled={savingProfile || profileUpdated}>
                        {savingProfile ? (
                          <span className="inline-flex items-center">
                            <LoadingSpinner size="sm" />
                            <span className="ml-2">{t('common.saving') || 'Saving...'}</span>
                          </span>
                        ) : profileUpdated ? (
                          <span className="inline-flex items-center">
                            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            {t('common.saved') || 'Profile Updated'}
                          </span>
                        ) : (
                          t('common.update') || 'Update Profile'
                        )}
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
            )}


          </div>
        </div>
      </div>
    </div>
  )
}

export default FirstLoginPage
