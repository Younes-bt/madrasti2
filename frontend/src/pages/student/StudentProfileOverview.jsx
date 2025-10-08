import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../../hooks/useLanguage'
import { useAuth } from '../../hooks/useAuth'
import { DashboardLayout } from '../../components/layout/Layout'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import {
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  BookOpen,
  Users,
  GraduationCap,
  Edit,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react'
import { cn } from '../../lib/utils'
import usersService from '../../services/users'

const StudentProfileOverview = () => {
  const { t, isRTL, currentLanguage } = useLanguage()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [profileData, setProfileData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchProfileData()
  }, [])

  const fetchProfileData = async () => {
    try {
      setLoading(true)
      setError(null)

      const data = await usersService.getProfile()
      console.log('Profile data received:', data)
      setProfileData(data)
    } catch (err) {
      console.error('Error fetching profile:', err)
      setError(err.userMessage || err.message || t('errors.unexpectedError'))
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return t('common.notAvailable', 'N/A')
    const date = new Date(dateString)
    return date.toLocaleDateString(isRTL ? 'ar-MA' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return null
    const today = new Date()
    const birthDate = new Date(dateOfBirth)
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    return age
  }

  // Helper to safely access nested profile data
  const getProfileField = (field) => {
    return profileData?.profile?.[field] || profileData?.[field]
  }

  if (loading) {
    return (
      <DashboardLayout user={user}>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="text-muted-foreground">{t('common.loading')}</p>
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
            <Button onClick={fetchProfileData} variant="outline">
              {t('common.tryAgain')}
            </Button>
          </CardContent>
        </Card>
      </DashboardLayout>
    )
  }

  const age = calculateAge(getProfileField('date_of_birth'))

  return (
    <DashboardLayout user={user}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {t('studentSidebar.profile.overview')}
            </h1>
            <p className="text-muted-foreground mt-1">
              {t('studentSidebar.profile.tooltip')}
            </p>
          </div>
          <Button
            onClick={() => navigate('/student/profile/settings')}
            className="flex items-center gap-2"
          >
            <Edit className="h-4 w-4" />
            {t('common.edit')}
          </Button>
        </div>

        {/* Profile Card */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center gap-6">
              {/* Profile Picture */}
              <div className="relative">
                {getProfileField('profile_picture_url') ? (
                  <img
                    src={getProfileField('profile_picture_url')}
                    alt={profileData?.first_name}
                    className="w-24 h-24 rounded-full object-cover border-4 border-background shadow-lg"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center border-4 border-background shadow-lg">
                    <User className="h-12 w-12 text-primary" />
                  </div>
                )}
                <div className={cn(
                  "absolute bottom-0 right-0 h-6 w-6 rounded-full border-4 border-background",
                  user?.is_online ? "bg-green-500" : "bg-gray-400"
                )} />
              </div>

              {/* Basic Info */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-2xl font-bold">
                    {profileData?.first_name} {profileData?.last_name}
                  </h2>
                  <Badge variant="secondary" className="text-xs">
                    {t('roles.student')}
                  </Badge>
                </div>
                {(getProfileField('ar_first_name') || getProfileField('ar_last_name')) && (
                  <p className="text-lg text-muted-foreground mb-1" dir="rtl">
                    {getProfileField('ar_first_name')} {getProfileField('ar_last_name')}
                  </p>
                )}
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  {profileData?.email}
                </p>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Academic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5" />
              {t('common.academicInfo', 'Academic Information')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Student ID */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <BookOpen className="h-4 w-4" />
                  <span className="text-sm font-medium">{t('common.studentID', 'Student ID')}</span>
                </div>
                <p className="text-lg font-semibold">
                  {profileData?.student_id || t('common.notAvailable', 'N/A')}
                </p>
              </div>

              {/* Grade */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <GraduationCap className="h-4 w-4" />
                  <span className="text-sm font-medium">{t('common.grade', 'Grade')}</span>
                </div>
                <p className="text-lg font-semibold">
                  {(() => {
                    if (!profileData?.grade) return t('common.notAvailable', 'N/A')
                    if (isRTL && profileData?.grade_name_arabic) return profileData.grade_name_arabic
                    if (currentLanguage === 'fr' && profileData?.grade_name_french) return profileData.grade_name_french
                    return profileData.grade
                  })()}
                </p>
              </div>

              {/* Class */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span className="text-sm font-medium">{t('common.class', 'Class')}</span>
                </div>
                <p className="text-lg font-semibold">
                  {profileData?.class_name || t('common.notAvailable', 'N/A')}
                </p>
              </div>

              {/* Academic Year */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm font-medium">{t('common.academicYear', 'Academic Year')}</span>
                </div>
                <p className="text-lg font-semibold">
                  {profileData?.academic_year || t('common.notAvailable', 'N/A')}
                </p>
              </div>

              {/* Enrollment Date */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm font-medium">{t('common.enrollmentDate', 'Enrollment Date')}</span>
                </div>
                <p className="text-lg font-semibold">
                  {formatDate(profileData?.enrollment_date)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              {t('common.personalInfo', 'Personal Information')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Date of Birth */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm font-medium">{t('common.dateOfBirth')}</span>
                </div>
                <p className="text-lg">
                  {formatDate(getProfileField('date_of_birth'))}
                  {age && <span className="text-sm text-muted-foreground ml-2">({age} {t('common.years', 'years')})</span>}
                </p>
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  <span className="text-sm font-medium">{t('common.phone')}</span>
                </div>
                <p className="text-lg">
                  {getProfileField('phone') || t('common.notAvailable', 'N/A')}
                </p>
              </div>

              {/* Address */}
              <div className="space-y-2 md:col-span-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span className="text-sm font-medium">{t('common.address')}</span>
                </div>
                <p className="text-lg">
                  {getProfileField('address') || t('common.notAvailable', 'N/A')}
                </p>
              </div>

              {/* Bio */}
              {getProfileField('bio') && (
                <div className="space-y-2 md:col-span-2">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <BookOpen className="h-4 w-4" />
                    <span className="text-sm font-medium">{t('common.bio', 'About Me')}</span>
                  </div>
                  <p className="text-lg">
                    {getProfileField('bio')}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Parent Information */}
        {(profileData?.parent_name || profileData?.parent_email || profileData?.parent_phone) && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                {t('common.parentInfo', 'Parent Information')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Parent Name */}
                {profileData?.parent_name && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <User className="h-4 w-4" />
                      <span className="text-sm font-medium">{t('common.parentName', 'Parent Name')}</span>
                    </div>
                    <p className="text-lg font-semibold">
                      {profileData.parent_name}
                    </p>
                  </div>
                )}

                {/* Parent Email */}
                {profileData?.parent_email && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Mail className="h-4 w-4" />
                      <span className="text-sm font-medium">{t('common.email')}</span>
                    </div>
                    <p className="text-lg">
                      {profileData.parent_email}
                    </p>
                  </div>
                )}

                {/* Parent Phone */}
                {profileData?.parent_phone && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="h-4 w-4" />
                      <span className="text-sm font-medium">{t('common.phone')}</span>
                    </div>
                    <p className="text-lg">
                      {profileData.parent_phone}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Emergency Contact */}
        {(getProfileField('emergency_contact_name') || getProfileField('emergency_contact_phone')) && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                {t('common.emergencyContact', 'Emergency Contact')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Emergency Contact Name */}
                {getProfileField('emergency_contact_name') && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <User className="h-4 w-4" />
                      <span className="text-sm font-medium">{t('common.name')}</span>
                    </div>
                    <p className="text-lg font-semibold">
                      {getProfileField('emergency_contact_name')}
                    </p>
                  </div>
                )}

                {/* Emergency Contact Phone */}
                {getProfileField('emergency_contact_phone') && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="h-4 w-4" />
                      <span className="text-sm font-medium">{t('common.phone')}</span>
                    </div>
                    <p className="text-lg">
                      {getProfileField('emergency_contact_phone')}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}

export default StudentProfileOverview
