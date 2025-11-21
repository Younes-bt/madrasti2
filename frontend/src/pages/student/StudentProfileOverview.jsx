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
  Clock,
  TrendingUp,
  ChevronRight,
  BarChart3,
  Activity,
  Loader2
} from 'lucide-react'
import { cn } from '../../lib/utils'
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

  useEffect(() => {
    fetchProfileData()
    fetchProgressData()
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

  const fetchProgressData = async () => {
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
  }

  const handleViewDetailedProgress = () => {
    navigate('/student/progress')
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

        {/* Learning Progress Section */}
        {!loadingProgress && (
          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={handleViewDetailedProgress}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
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
