import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { DashboardLayout } from '../../components/layout/Layout'
import { useLanguage } from '../../hooks/useLanguage'
import { useAuth } from '../../hooks/useAuth'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card'
import { Input } from '../../components/ui/input'
import { Textarea } from '../../components/ui/textarea'
import { Label } from '../../components/ui/label'
import { Button } from '../../components/ui/button'
import { AlertCircle, Camera, Loader2, Save, User } from 'lucide-react'
import usersService from '../../services/users'
import { toast } from 'sonner'

const StudentProfileSettings = () => {
  const { t, isRTL } = useLanguage()
  const { user, updateUser } = useAuth()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const fileInputRef = useRef(null)

  const [form, setForm] = useState({
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
  })

  const [profileImageUrl, setProfileImageUrl] = useState(null)
  const [profileImageFile, setProfileImageFile] = useState(null)
  const [uploadingImage, setUploadingImage] = useState(false)

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await usersService.getProfile()
        // API may return nested profile and flattened fields; map safely
        setForm({
          first_name: data.first_name || '',
          last_name: data.last_name || '',
          ar_first_name: data.ar_first_name ?? data.profile?.ar_first_name ?? '',
          ar_last_name: data.ar_last_name ?? data.profile?.ar_last_name ?? '',
          phone: data.phone ?? data.profile?.phone ?? '',
          date_of_birth: data.date_of_birth ?? data.profile?.date_of_birth ?? '',
          address: data.address ?? data.profile?.address ?? '',
          bio: data.bio ?? data.profile?.bio ?? '',
          emergency_contact_name: data.emergency_contact_name ?? data.profile?.emergency_contact_name ?? '',
          emergency_contact_phone: data.emergency_contact_phone ?? data.profile?.emergency_contact_phone ?? '',
        })
        setProfileImageUrl(
          data.profile_picture_url ?? data.profile?.profile_picture_url ?? null
        )
      } catch (err) {
        console.error('Failed to load profile settings:', err)
        setError(err.userMessage || err.message || t('errors.unexpectedError'))
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const onChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const onPickImage = () => fileInputRef.current?.click()

  const onImageSelected = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      toast.error(t('validation.invalidImageType', 'Invalid image type'))
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error(t('validation.fileTooLarge', 'File is too large (max 5MB)'))
      return
    }
    setProfileImageFile(file)
    // Optional local preview
    const objectUrl = URL.createObjectURL(file)
    setProfileImageUrl(objectUrl)
  }

  const uploadProfileImageIfNeeded = async () => {
    if (!profileImageFile) return null
    try {
      setUploadingImage(true)
      const updatedProfile = await usersService.uploadProfilePicture(profileImageFile)
      const newImageUrl =
        updatedProfile?.profile_picture_url ??
        updatedProfile?.profile?.profile_picture_url ??
        null
      if (newImageUrl) {
        if (profileImageUrl?.startsWith('blob:')) {
          URL.revokeObjectURL(profileImageUrl)
        }
        setProfileImageUrl(newImageUrl)
      }

      if (updatedProfile) {
        const mergedProfile = {
          ...(user?.profile || {}),
          profile_picture_url:
            updatedProfile.profile_picture_url ||
            updatedProfile.profile?.profile_picture_url ||
            newImageUrl ||
            null,
        }

        updateUser({
          profile_picture_url:
            updatedProfile.profile_picture_url || newImageUrl || null,
          profile: mergedProfile,
        })
      }

      toast.success(t('profile.imageUpdated', 'Profile image updated'))
      setProfileImageFile(null)
      return updatedProfile
    } catch (err) {
      console.error('Upload image failed', err)
      toast.error(t('profile.imageUpdateFailed', 'Failed to update profile image'))
      throw err
    } finally {
      setUploadingImage(false)
    }
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    try {
      setSaving(true)
      await uploadProfileImageIfNeeded()
      const payload = { ...form }
      // Ensure empty strings become null where backend expects nullables
      if (!payload.date_of_birth) payload.date_of_birth = null
      const updated = await usersService.patchProfile(payload)
      toast.success(t('common.saved', 'Saved successfully'))
      // Optionally navigate back to overview
      navigate('/student/profile/overview')
    } catch (err) {
      console.error('Save profile failed:', err)
      toast.error(err.userMessage || t('errors.unexpectedError', 'Unexpected error'))
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <DashboardLayout user={user}>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex items-center gap-3 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>{t('common.loading')}</span>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (error) {
    return (
      <DashboardLayout user={user}>
        <Card className="border-destructive">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-destructive mb-4">
              <AlertCircle className="h-5 w-5" />
              <h3 className="font-semibold">{t('common.error')}</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">{error}</p>
            <Button onClick={() => window.location.reload()} variant="outline">
              {t('common.tryAgain')}
            </Button>
          </CardContent>
        </Card>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout user={user}>
      <div className="space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{t('studentSidebar.profile.settings')}</h1>
            <p className="text-muted-foreground mt-1">{t('profile.updateYourInfo', 'Manage your personal information')}</p>
          </div>
        </div>

        <form onSubmit={onSubmit} className="space-y-6">
          {/* Profile Image */}
          <Card>
            <CardHeader>
              <CardTitle>{t('profile.photo', 'Profile Photo')}</CardTitle>
              <CardDescription>{t('profile.photoDesc', 'Update your profile picture.')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-6">
                <div className="h-24 w-24 rounded-full overflow-hidden bg-muted flex items-center justify-center">
                  {profileImageUrl ? (
                    <img src={profileImageUrl} alt="profile" className="h-full w-full object-cover" />
                  ) : (
                    <User className="h-10 w-10 text-muted-foreground" />
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={onImageSelected} />
                  <Button type="button" variant="outline" onClick={onPickImage} disabled={uploadingImage} className="gap-2">
                    <Camera className="h-4 w-4" />
                    {t('profile.changePhoto', 'Change photo')}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>{t('profile.basicInfo', 'Basic Information')}</CardTitle>
              <CardDescription>{t('profile.basicInfoDesc', 'Your public name information')}</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="first_name">{t('common.firstName')}</Label>
                <Input id="first_name" name="first_name" value={form.first_name} onChange={onChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="last_name">{t('common.lastName')}</Label>
                <Input id="last_name" name="last_name" value={form.last_name} onChange={onChange} />
              </div>
              <div className="space-y-2 md:col-span-1" dir="rtl">
                <Label htmlFor="ar_first_name">{t('profile.arFirstName', 'Arabic First Name')}</Label>
                <Input id="ar_first_name" name="ar_first_name" value={form.ar_first_name} onChange={onChange} />
              </div>
              <div className="space-y-2 md:col-span-1" dir="rtl">
                <Label htmlFor="ar_last_name">{t('profile.arLastName', 'Arabic Last Name')}</Label>
                <Input id="ar_last_name" name="ar_last_name" value={form.ar_last_name} onChange={onChange} />
              </div>
            </CardContent>
          </Card>

          {/* Contact & Personal */}
          <Card>
            <CardHeader>
              <CardTitle>{t('common.personalInfo', 'Personal Information')}</CardTitle>
              <CardDescription>{t('profile.personalInfoDesc', 'Contact and personal details')}</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="phone">{t('common.phone')}</Label>
                <Input id="phone" name="phone" value={form.phone} onChange={onChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date_of_birth">{t('common.dateOfBirth')}</Label>
                <Input id="date_of_birth" name="date_of_birth" type="date" value={form.date_of_birth || ''} onChange={onChange} />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="address">{t('common.address')}</Label>
                <Input id="address" name="address" value={form.address} onChange={onChange} />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="bio">{t('common.bio', 'About Me')}</Label>
                <Textarea id="bio" name="bio" value={form.bio} onChange={onChange} rows={4} />
              </div>
            </CardContent>
          </Card>

          {/* Emergency Contact */}
          <Card>
            <CardHeader>
              <CardTitle>{t('common.emergencyContact', 'Emergency Contact')}</CardTitle>
              <CardDescription>{t('profile.emergencyContactDesc', 'Who to reach in case of emergency')}</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="emergency_contact_name">{t('common.name')}</Label>
                <Input id="emergency_contact_name" name="emergency_contact_name" value={form.emergency_contact_name} onChange={onChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="emergency_contact_phone">{t('common.phone')}</Label>
                <Input id="emergency_contact_phone" name="emergency_contact_phone" value={form.emergency_contact_phone} onChange={onChange} />
              </div>
            </CardContent>
          </Card>

          <div className="flex items-center justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => navigate('/student/profile/overview')}>
              {t('common.cancel', 'Cancel')}
            </Button>
            <Button type="submit" className="gap-2" disabled={saving || uploadingImage}>
              {(saving || uploadingImage) && <Loader2 className="h-4 w-4 animate-spin" />}
              <Save className="h-4 w-4" />
              {t('common.save', 'Save')}
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  )
}

export default StudentProfileSettings

