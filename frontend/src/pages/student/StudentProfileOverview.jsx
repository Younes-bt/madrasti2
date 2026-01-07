import React, { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../../hooks/useLanguage'
import { useAuth } from '../../hooks/useAuth'
import { DashboardLayout } from '../../components/layout/Layout'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar'
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
  Clock,
  TrendingUp,
  ChevronRight,
  BarChart3,
  Activity,
  Loader2,
  Shield,
  UserCircle,
  Contact,
  Heart,
  Edit3,
  Globe
} from 'lucide-react'
import { Progress } from '../../components/ui/progress'
import usersService from '../../services/users'
import progressService from '../../services/progress'

const StudentProfileOverview = () => {
  const { t, isRTL, currentLanguage } = useLanguage()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [profileData, setProfileData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [progressData, setProgressData] = useState(null)
  const [loadingProgress, setLoadingProgress] = useState(true)

  const fetchProfileData = useCallback(async () => {
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
  }, [t])

  const fetchProgressData = useCallback(async () => {
    setLoadingProgress(true)
    try {
      console.log('Fetching progress data for current student')
      const report = await progressService.getStudentProgressReport('me')
      console.log('Progress data received:', report)
      setProgressData(report)
    } catch (error) {
      console.error('Failed to fetch progress data:', error)
      setProgressData(null)
    } finally {
      setLoadingProgress(false)
    }
  }, [])

  useEffect(() => {
    fetchProfileData()
    fetchProgressData()
  }, [fetchProfileData, fetchProgressData])

  const handleViewDetailedProgress = () => {
    navigate('/student/progress')
  }

  const formatDate = (dateString) => {
    if (!dateString) return t('common.notAvailable', 'N/A')
    const date = new Date(dateString)
    const localeMap = {
      ar: 'ar-MA',
      en: 'en-US',
      fr: 'fr-FR'
    }
    return date.toLocaleDateString(localeMap[currentLanguage] || 'en-US', {
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

  // InfoItem component for consistent display
  const InfoItem = ({ icon, label, value, isLink = false }) => (
    <div className="flex items-start gap-3 p-3">
      <div className="flex-shrink-0 mt-1 text-muted-foreground">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground">{label}</p>
        {isLink && value ? (
          <a
            href={value.startsWith('http') ? value : `https://${value}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-primary hover:underline break-all"
          >
            {value}
          </a>
        ) : (
          <p className="text-sm text-muted-foreground break-words">{value || '-'}</p>
        )}
      </div>
    </div>
  )

  const resolvedAvatarUrl = getProfileField('profile_picture_url') || null

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
            <Edit3 className="h-4 w-4" />
            {t('common.edit')}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Summary - Left Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="border-border/50">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <Avatar className="h-32 w-32 border-4 border-border mb-4">
                    <AvatarImage
                      src={resolvedAvatarUrl}
                      alt={profileData?.first_name || 'profile photo'}
                    />
                    <AvatarFallback className="text-lg">
                      {(profileData?.first_name || '?').slice(0, 1).toUpperCase()}
                      {(profileData?.last_name || '').slice(0, 1).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="mt-4 text-xl font-semibold text-foreground">
                    {profileData?.first_name} {profileData?.last_name}
                  </h3>
                  {(getProfileField('ar_first_name') || getProfileField('ar_last_name')) && (
                    <p className="text-sm text-muted-foreground mt-1" dir="rtl">
                      {getProfileField('ar_first_name')} {getProfileField('ar_last_name')}
                    </p>
                  )}
                  <div className="mt-3 flex items-center justify-center gap-2 flex-wrap">
                    <Badge variant="secondary" className="text-sm">
                      <GraduationCap className="h-3 w-3 mr-1" />
                      {t('roles.student')}
                    </Badge>
                    <Badge variant={user?.is_active ? 'default' : 'secondary'}>
                      {user?.is_active ? t('status.active', 'Active') : t('status.inactive', 'Inactive')}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground flex items-center gap-2 mt-3">
                    <Mail className="h-4 w-4" />
                    {profileData?.email}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Shield className="h-5 w-5 text-primary" />
                  {t('common.overview')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {profileData?.student_id && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">{t('common.studentID', 'Student ID')}</span>
                    <span className="text-sm text-foreground font-medium">{profileData.student_id}</span>
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">{t('common.memberSince', 'Member Since')}</span>
                  <span className="text-sm text-foreground">{formatDate(profileData?.enrollment_date || profileData?.created_at)}</span>
                </div>
                {profileData?.class_name && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">{t('common.class', 'Class')}</span>
                    <span className="text-sm text-foreground font-medium">{profileData.class_name}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Profile Details - Right Side */}
          <div className="lg:col-span-2 space-y-6">

            {/* Academic Information */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <GraduationCap className="h-5 w-5 text-primary" />
                  {t('common.academicInfo', 'Academic Information')}
                </CardTitle>
              </CardHeader>
              <CardContent className="divide-y divide-border/50">
                <InfoItem
                  icon={<BookOpen className="h-4 w-4" />}
                  label={t('common.studentID', 'Student ID')}
                  value={profileData?.student_id || t('common.notAvailable', 'N/A')}
                />
                <InfoItem
                  icon={<GraduationCap className="h-4 w-4" />}
                  label={t('common.grade', 'Grade')}
                  value={(() => {
                    if (!profileData?.grade) return t('common.notAvailable', 'N/A')
                    if (isRTL && profileData?.grade_name_arabic) return profileData.grade_name_arabic
                    if (currentLanguage === 'fr' && profileData?.grade_name_french) return profileData.grade_name_french
                    return profileData.grade
                  })()}
                />
                <InfoItem
                  icon={<Users className="h-4 w-4" />}
                  label={t('common.class', 'Class')}
                  value={profileData?.class_name || t('common.notAvailable', 'N/A')}
                />
                <InfoItem
                  icon={<Calendar className="h-4 w-4" />}
                  label={t('common.academicYear', 'Academic Year')}
                  value={profileData?.academic_year || t('common.notAvailable', 'N/A')}
                />
                <InfoItem
                  icon={<Clock className="h-4 w-4" />}
                  label={t('common.enrollmentDate', 'Enrollment Date')}
                  value={formatDate(profileData?.enrollment_date)}
                />
              </CardContent>
            </Card>

            {/* Learning Progress Section */}
            {!loadingProgress && (
              <Card className="border-border/50 cursor-pointer hover:shadow-lg transition-shadow" onClick={handleViewDetailedProgress}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <TrendingUp className="h-5 w-5 text-primary" />
                      {t('progress.learningProgress', 'Learning Progress')}
                    </CardTitle>
                    <Button variant="ghost" size="sm" className="gap-2">
                      {t('common.viewDetails', 'View Details')}
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {progressData ? (
                    <>
                      {/* Summary Cards */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Overall Completion */}
                        <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800/50">
                          <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm font-medium text-blue-700 dark:text-blue-400">{t('progress.completion', 'Completion')}</p>
                                <p className="text-2xl font-bold text-blue-800 dark:text-blue-300">{progressData.overall_completion_percentage}%</p>
                                <p className="text-xs text-blue-600 dark:text-blue-500">
                                  {progressData.lessons_completed}/{progressData.total_lessons} {t('progress.lessons', 'lessons')}
                                </p>
                              </div>
                              <CheckCircle className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                            </div>
                          </CardContent>
                        </Card>

                        {/* Average Score */}
                        <Card className="bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800/50">
                          <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm font-medium text-green-700 dark:text-green-400">{t('progress.avgScore', 'Avg Score')}</p>
                                <p className="text-2xl font-bold text-green-800 dark:text-green-300">{progressData.overall_average_score}%</p>
                                <p className="text-xs text-green-600 dark:text-green-500">
                                  {t('progress.acrossAllLessons', 'Across all lessons')}
                                </p>
                              </div>
                              <BarChart3 className="h-8 w-8 text-green-600 dark:text-green-400" />
                            </div>
                          </CardContent>
                        </Card>

                        {/* Accuracy */}
                        <Card className="bg-purple-50 dark:bg-purple-950/20 border-purple-200 dark:border-purple-800/50">
                          <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm font-medium text-purple-700 dark:text-purple-400">{t('progress.accuracy', 'Accuracy')}</p>
                                <p className="text-2xl font-bold text-purple-800 dark:text-purple-300">{progressData.overall_accuracy_percentage}%</p>
                                <p className="text-xs text-purple-600 dark:text-purple-500">
                                  {t('progress.correctAnswers', 'Correct answers')}
                                </p>
                              </div>
                              <TrendingUp className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                            </div>
                          </CardContent>
                        </Card>

                        {/* Total Exercises */}
                        <Card className="bg-orange-50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-800/50">
                          <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm font-medium text-orange-700 dark:text-orange-400">{t('progress.totalExercises', 'Total Exercises')}</p>
                                <p className="text-2xl font-bold text-orange-800 dark:text-orange-300">{progressData.total_exercises}</p>
                                <p className="text-xs text-orange-600 dark:text-orange-500">
                                  {progressData.total_subjects} {t('progress.subjects', 'subjects')}
                                </p>
                              </div>
                              <BookOpen className="h-8 w-8 text-orange-600 dark:text-orange-400" />
                            </div>
                          </CardContent>
                        </Card>
                      </div>

                      {/* Progress Breakdown */}
                      <div className="space-y-4">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-green-600 dark:text-green-400">{t('progress.completed', 'Completed')}</span>
                            <span className="text-sm font-medium text-green-600 dark:text-green-400">
                              {progressData.lessons_completed} ({progressData.total_lessons > 0 ? ((progressData.lessons_completed / progressData.total_lessons) * 100).toFixed(1) : 0}%)
                            </span>
                          </div>
                          <Progress
                            value={progressData.total_lessons > 0 ? (progressData.lessons_completed / progressData.total_lessons) * 100 : 0}
                            className="h-3"
                          />
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-blue-600 dark:text-blue-400">{t('progress.inProgress', 'In Progress')}</span>
                            <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                              {progressData.lessons_in_progress} ({progressData.total_lessons > 0 ? ((progressData.lessons_in_progress / progressData.total_lessons) * 100).toFixed(1) : 0}%)
                            </span>
                          </div>
                          <Progress
                            value={progressData.total_lessons > 0 ? (progressData.lessons_in_progress / progressData.total_lessons) * 100 : 0}
                            className="h-3"
                            indicatorClassName="bg-blue-500"
                          />
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{t('progress.notStarted', 'Not Started')}</span>
                            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                              {progressData.lessons_not_started} ({progressData.total_lessons > 0 ? ((progressData.lessons_not_started / progressData.total_lessons) * 100).toFixed(1) : 0}%)
                            </span>
                          </div>
                          <Progress
                            value={progressData.total_lessons > 0 ? (progressData.lessons_not_started / progressData.total_lessons) * 100 : 0}
                            className="h-3"
                            indicatorClassName="bg-gray-400"
                          />
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-12">
                      <BookOpen className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
                      <h3 className="text-lg font-medium text-foreground mb-2">
                        {t('progress.noProgressYet', 'No Progress Data Yet')}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        {t('progress.studentHasntStarted', 'You haven\'t started any lessons yet.')}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {t('progress.clickToViewEmpty', 'Click "View Details" to see the full progress dashboard')}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Personal Information */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <UserCircle className="h-5 w-5 text-primary" />
                  {t('common.personalInfo', 'Personal Information')}
                </CardTitle>
              </CardHeader>
              <CardContent className="divide-y divide-border/50">
                <InfoItem
                  icon={<Calendar className="h-4 w-4" />}
                  label={t('common.dateOfBirth')}
                  value={`${formatDate(getProfileField('date_of_birth'))}${age ? ` (${age} ${t('common.years', 'years')})` : ''}`}
                />
                <InfoItem
                  icon={<Phone className="h-4 w-4" />}
                  label={t('common.phone')}
                  value={getProfileField('phone') || t('common.notAvailable', 'N/A')}
                />
                <InfoItem
                  icon={<MapPin className="h-4 w-4" />}
                  label={t('common.address')}
                  value={getProfileField('address') || t('common.notAvailable', 'N/A')}
                />
                {getProfileField('bio') && (
                  <InfoItem
                    icon={<BookOpen className="h-4 w-4" />}
                    label={t('common.bio', 'About Me')}
                    value={getProfileField('bio')}
                  />
                )}
              </CardContent>
            </Card>

            {/* Parent Information */}
            {(profileData?.parent_name || profileData?.parent_email || profileData?.parent_phone) && (
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Contact className="h-5 w-5 text-primary" />
                    {t('common.parentInfo', 'Parent Information')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="divide-y divide-border/50">
                  {profileData?.parent_name && (
                    <InfoItem
                      icon={<User className="h-4 w-4" />}
                      label={t('common.parentName', 'Parent Name')}
                      value={profileData.parent_name}
                    />
                  )}
                  {profileData?.parent_email && (
                    <InfoItem
                      icon={<Mail className="h-4 w-4" />}
                      label={t('common.email')}
                      value={profileData.parent_email}
                    />
                  )}
                  {profileData?.parent_phone && (
                    <InfoItem
                      icon={<Phone className="h-4 w-4" />}
                      label={t('common.phone')}
                      value={profileData.parent_phone}
                    />
                  )}
                </CardContent>
              </Card>
            )}

            {/* Emergency Contact */}
            {(getProfileField('emergency_contact_name') || getProfileField('emergency_contact_phone')) && (
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Heart className="h-5 w-5 text-primary" />
                    {t('common.emergencyContact', 'Emergency Contact')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="divide-y divide-border/50">
                  {getProfileField('emergency_contact_name') && (
                    <InfoItem
                      icon={<User className="h-4 w-4" />}
                      label={t('common.name')}
                      value={getProfileField('emergency_contact_name')}
                    />
                  )}
                  {getProfileField('emergency_contact_phone') && (
                    <InfoItem
                      icon={<Phone className="h-4 w-4" />}
                      label={t('common.phone')}
                      value={getProfileField('emergency_contact_phone')}
                    />
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default StudentProfileOverview
