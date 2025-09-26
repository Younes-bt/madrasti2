import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useLanguage } from '../../../hooks/useLanguage'
import { useAuth } from '../../../hooks/useAuth'
import { DashboardLayout } from '../../layout/Layout'
import TeacherBreadcrumb from './TeacherBreadcrumb'
import { Card, CardContent } from '../../ui/card'
import { Button } from '../../ui/button'
import { RefreshCcw, ArrowLeft, AlertTriangle } from 'lucide-react'
import { cn } from '../../../lib/utils'

const TeacherPageLayout = ({
  children,
  title,
  subtitle,
  showBackButton = false,
  backButtonPath = '/teacher',
  backButtonLabel,
  showRefreshButton = false,
  onRefresh,
  actions = [],
  breadcrumbItems = [],
  loading = false,
  error = null,
  className,
  contentClassName,
  headerClassName,
  ...props
}) => {
  const { t, isRTL } = useLanguage()
  const { user } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const handleBack = () => {
    if (backButtonPath) {
      navigate(backButtonPath)
    } else {
      navigate(-1)
    }
  }

  const handleRefresh = () => {
    if (onRefresh) {
      onRefresh()
    } else {
      window.location.reload()
    }
  }

  // Generate breadcrumb items from URL if not provided
  const generateBreadcrumbItems = () => {
    if (breadcrumbItems.length > 0) {
      return breadcrumbItems
    }

    const pathSegments = location.pathname.split('/').filter(Boolean)
    const items = []

    // Always start with Teacher Dashboard
    items.push({
      label: t('teacherSidebar.dashboard'),
      href: '/teacher',
      icon: 'Home'
    })

    // Process path segments
    let currentPath = ''
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`
      
      if (segment === 'teacher') return // Skip teacher segment as it's the dashboard
      
      // Generate label from segment
      let label = segment
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')

      // Try to get translation if available
      try {
        const translationKey = getTranslationKey(segment, pathSegments)
        if (translationKey) {
          label = t(translationKey)
        }
      } catch (e) {
        // Use default label if translation not found
      }

      items.push({
        label,
        href: index === pathSegments.length - 1 ? null : currentPath // Last item should not be clickable
      })
    })

    return items
  }

  // Helper function to get translation key for breadcrumbs
  const getTranslationKey = (segment, pathSegments) => {
    const segmentMap = {
      // Profile section
      'profile': 'teacherSidebar.profile.title',
      'overview': 'teacherSidebar.profile.overview',
      'my-classes': 'teacherSidebar.profile.myClasses',
      'my-subjects': 'teacherSidebar.profile.mySubjects',
      'my-schedule': 'teacherSidebar.profile.mySchedule',
      
      // Content Management section
      'content': 'teacherSidebar.content.title',
      'lessons': 'teacherSidebar.content.lessons',
      'materials': 'teacherSidebar.content.materials',
      'media-library': 'teacherSidebar.content.mediaLibrary',
      'templates': 'teacherSidebar.content.templates',
      
      // Assignments & Assessment section
      'assignments': 'teacherSidebar.assignments.title',
      'homework': 'teacherSidebar.assignments.homework',
      'exams': 'teacherSidebar.assignments.exams',
      'grading': 'teacherSidebar.assignments.grading',
      'assessment-tools': 'teacherSidebar.assignments.assessmentTools',
      
      // Student Management section
      'students': 'teacherSidebar.students.title',
      'my-students': 'teacherSidebar.students.myStudents',
      'attendance': 'teacherSidebar.students.attendance',
      'progress': 'teacherSidebar.students.progress',
      'parent-communication': 'teacherSidebar.students.parentCommunication',
      
      // Teaching Analytics section
      'analytics': 'teacherSidebar.analytics.title',
      'class-performance': 'teacherSidebar.analytics.classPerformance',
      'student-analytics': 'teacherSidebar.analytics.studentAnalytics',
      'assignment-stats': 'teacherSidebar.analytics.assignmentStats',
      'reports': 'teacherSidebar.analytics.reports',
      
      // Planning & Organization section
      'planning': 'teacherSidebar.planning.title',
      'lesson-planner': 'teacherSidebar.planning.lessonPlanner',
      'calendar': 'teacherSidebar.planning.calendar',
      'tasks': 'teacherSidebar.planning.tasks',
      'resources': 'teacherSidebar.planning.resources',
      
      // Communication Hub section
      'communication': 'teacherSidebar.communication.title',
      'announcements': 'teacherSidebar.communication.announcements',
      'messages': 'teacherSidebar.communication.messages',
      'forums': 'teacherSidebar.communication.forums',
      'notifications': 'teacherSidebar.communication.notifications'
    }

    return segmentMap[segment]
  }

  return (
    <DashboardLayout user={user} {...props}>
      <div className={cn('min-h-full', className)}>
        {/* Breadcrumb Navigation */}
        <TeacherBreadcrumb 
          items={generateBreadcrumbItems()} 
          className="mb-6"
        />

        {/* Page Header */}
        <div className={cn(
          'flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6',
          headerClassName
        )}>
          <div className="flex items-center gap-4">
            {/* Back Button */}
            {showBackButton && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBack}
                className="flex items-center gap-2"
              >
                <ArrowLeft className={cn(
                  'h-4 w-4',
                  isRTL && 'rotate-180'
                )} />
                {backButtonLabel || t('errors.goBack', 'Go Back')}
              </Button>
            )}

            <div>
              {/* Page Title */}
              {title && (
                <h1 className="text-3xl font-bold tracking-tight">
                  {title}
                </h1>
              )}
              
              {/* Page Subtitle */}
              {subtitle && (
                <p className="text-muted-foreground mt-1">
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {/* Refresh Button */}
            {showRefreshButton && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={loading}
                className="flex items-center gap-2"
              >
                <RefreshCcw className={cn(
                  'h-4 w-4',
                  loading && 'animate-spin'
                )} />
                {t('common.refresh', 'Refresh')}
              </Button>
            )}

            {/* Custom Actions */}
            {actions.map((action, index) => (
              <React.Fragment key={index}>
                {action}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <Card className="border-destructive/50 bg-destructive/10 mb-6">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="h-4 w-4" />
                <p className="font-medium">{t('common.error')}</p>
              </div>
              <p className="text-sm text-destructive/80 mt-1">
                {typeof error === 'string' ? error : error.message || t('errors.unexpectedError', 'An unexpected error occurred')}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Main Content */}
        <div className={cn(
          'space-y-6',
          contentClassName
        )}>
          {loading ? (
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-center py-12">
                  <div className="flex items-center gap-2">
                    <RefreshCcw className="h-4 w-4 animate-spin" />
                    <span>{t('common.loading')}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            children
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}

export default TeacherPageLayout