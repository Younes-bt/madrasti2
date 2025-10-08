import React, { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { CheckCircle2, AlertCircle, BookOpen, Calendar, Clock, Loader2, RefreshCcw } from 'lucide-react'

import { DashboardLayout } from '../../components/layout/Layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import { Button } from '../../components/ui/button'
import { Alert, AlertDescription } from '../../components/ui/alert'

import { useLanguage } from '../../hooks/useLanguage'
import { useStudentHomeworks } from '../../hooks/useStudentHomeworks'
import { homeworkService } from '../../services'
import { ROUTES } from '../../utils/constants'

const localeMap = {
  ar: 'ar-MA',
  fr: 'fr-FR',
  en: 'en-GB',
}

const PENDING_STATUSES = new Set(['pending', 'in_progress', 'draft', 'overdue'])

const COMPLETED_STATUSES = new Set(['completed', 'late'])

const formatDateTime = (value, locale) => {
  if (!value) {
    return '—'
  }

  try {
    return new Date(value).toLocaleString(locale, {
      dateStyle: 'medium',
      timeStyle: 'short',
    })
  } catch (error) {
    console.warn('Failed to format date', value, error)
    return value
  }
}

const StudentHomeworkPendingPage = () => {
  const navigate = useNavigate()
  const { t, currentLanguage } = useLanguage()
  const locale = localeMap[currentLanguage] ?? 'en-GB'
  const { homeworks, loading, error, refresh, summary } = useStudentHomeworks({ ordering: 'due_date' })
  const [startingId, setStartingId] = useState(null)

  const formatTimeUntil = (seconds) => {
    if (typeof seconds !== 'number') {
      return null
    }

    const isPast = seconds < 0
    const absoluteSeconds = Math.abs(seconds)
    const minutes = Math.round(absoluteSeconds / 60)

    if (minutes < 60) {
      return `${minutes} ${t('studentSidebar.homework.pendingPage.min')}${isPast ? ` ${t('studentSidebar.homework.pendingPage.ago')}` : ''}`
    }

    const hours = Math.round(minutes / 60)
    if (hours < 24) {
      return `${hours} ${t('studentSidebar.homework.pendingPage.hr')}${isPast ? ` ${t('studentSidebar.homework.pendingPage.ago')}` : ''}`
    }

    const days = Math.round(hours / 24)
    const dayLabel = days !== 1 ? t('studentSidebar.homework.pendingPage.days') : t('studentSidebar.homework.pendingPage.day')
    return `${days} ${dayLabel}${isPast ? ` ${t('studentSidebar.homework.pendingPage.ago')}` : ''}`
  }

  const statusLabel = (status) => {
    if (!status) {
      return t('studentSidebar.homework.pendingPage.pending')
    }

    const statusMap = {
      'pending': t('studentSidebar.homework.pendingPage.pending'),
      'in_progress': t('studentSidebar.homework.pendingPage.inProgress'),
      'draft': t('studentSidebar.homework.pendingPage.draft'),
      'overdue': t('studentSidebar.homework.pendingPage.overdue'),
    }

    return statusMap[status] || status
      .split('_')
      .map(chunk => chunk.charAt(0).toUpperCase() + chunk.slice(1))
      .join(' ')
  }

  const statusIntent = (status) => {
    if (COMPLETED_STATUSES.has(status)) {
      return 'success'
    }
    if (status === 'overdue' || status === 'late') {
      return 'destructive'
    }
    if (status === 'in_progress') {
      return 'warning'
    }
    return 'default'
  }

  const pendingHomeworks = useMemo(
    () =>
      homeworks.filter(hw => {
        const status = hw?.studentStatusNormalized || hw?.student_status
        return status && PENDING_STATUSES.has(status)
      }),
    [homeworks]
  )

  const handleStartHomework = async (homework) => {
    const homeworkId = homework.id
    const status = homework?.studentStatusNormalized || homework?.student_status

    try {
      setStartingId(homeworkId)

      // If already in progress, just navigate to work page
      if (status === 'in_progress') {
        navigate(ROUTES.STUDENT_HOMEWORK.WORK.replace(':id', homeworkId))
        return
      }

      // Otherwise, start the homework first
      const result = await homeworkService.startHomework(homeworkId)
      if (result.success) {
        toast.success(t('studentSidebar.homework.pendingPage.homeworkStarted'))
        // Navigate to homework work page
        navigate(ROUTES.STUDENT_HOMEWORK.WORK.replace(':id', homeworkId))
      } else {
        toast.error(result.error || t('studentSidebar.homework.pendingPage.unableToStart'))
      }
    } catch (err) {
      console.error('Failed to start homework', err)
      toast.error(t('studentSidebar.homework.pendingPage.unableToStart'))
    } finally {
      setStartingId(null)
    }
  }

  const renderSummaryCards = () => (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="pb-2">
          <CardDescription>{t('studentSidebar.homework.pendingPage.pendingAssignments')}</CardDescription>
          <CardTitle className="text-3xl">{summary.pending}</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          {t('studentSidebar.homework.pendingPage.pendingDescription')}
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardDescription>{t('studentSidebar.homework.pendingPage.completedAssignments')}</CardDescription>
          <CardTitle className="text-3xl">{summary.completed}</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          {t('studentSidebar.homework.pendingPage.completedDescription')}
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardDescription>{t('studentSidebar.homework.pendingPage.overdueAssignments')}</CardDescription>
          <CardTitle className="text-3xl">{summary.overdue}</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          {t('studentSidebar.homework.pendingPage.overdueDescription')}
        </CardContent>
      </Card>
    </div>
  )

  const renderHomeworkCard = (homework) => {
    const status = homework?.studentStatusNormalized || homework?.student_status || 'pending'
    const submission = homework?.student_submission
    const dueIn = formatTimeUntil(homework?.time_until_due)
    const isInProgress = status === 'in_progress'

    return (
      <Card key={homework.id} className="border border-border/70 shadow-sm">
        <CardHeader>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <CardTitle className="text-lg text-foreground">
                {homework.title || t('studentSidebar.homework.pendingPage.untitled')}
              </CardTitle>
              <CardDescription className="mt-1 text-sm leading-relaxed">
                {homework.description || t('studentSidebar.homework.pendingPage.noDescription')}
              </CardDescription>
            </div>
            <Badge
              variant={statusIntent(status) === 'destructive' ? 'destructive' : statusIntent(status) === 'success' ? 'default' : 'outline'}
              className="capitalize"
            >
              {statusLabel(status)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex items-start gap-3">
              <Calendar className="mt-1 h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium text-foreground">{t('studentSidebar.homework.pendingPage.dueDate')}</p>
                <p className="text-sm text-muted-foreground">
                  {formatDateTime(homework.due_date, locale)}
                </p>
                {dueIn && (
                  <p className="text-xs text-muted-foreground">
                    {status === 'overdue'
                      ? `${t('studentSidebar.homework.pendingPage.overdue')} ${dueIn}`
                      : `${t('studentSidebar.homework.pendingPage.dueIn')} ${dueIn}`}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-start gap-3">
              <BookOpen className="mt-1 h-5 w-5 text-emerald-500" />
              <div>
                <p className="text-sm font-medium text-foreground">{t('studentSidebar.homework.pendingPage.subject')}</p>
                <p className="text-sm text-muted-foreground">{homework.subject?.name || t('studentSidebar.homework.pendingPage.notSpecified')}</p>
                <p className="text-xs text-muted-foreground">
                  {homework.grade?.name || '—'} • {homework.class?.name || '—'}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Clock className="mt-1 h-5 w-5 text-amber-500" />
              <div>
                <p className="text-sm font-medium text-foreground">{t('studentSidebar.homework.pendingPage.estimatedTime')}</p>
                <p className="text-sm text-muted-foreground">
                  {homework.estimated_duration ? `${homework.estimated_duration} ${t('studentSidebar.homework.pendingPage.min')}` : t('studentSidebar.homework.pendingPage.notProvided')}
                </p>
                {submission?.attempt_number ? (
                  <p className="text-xs text-muted-foreground">{t('studentSidebar.homework.pendingPage.attempt')} #{submission.attempt_number}</p>
                ) : null}
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="mt-1 h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm font-medium text-foreground">{t('studentSidebar.homework.pendingPage.totalPoints')}</p>
                <p className="text-sm text-muted-foreground">
                  {homework.total_points ?? '—'} {t('studentSidebar.homework.pendingPage.points')}
                </p>
                {homework.allow_late_submissions ? (
                  <p className="text-xs text-muted-foreground">{t('studentSidebar.homework.pendingPage.lateSubmissionsAllowed')}</p>
                ) : (
                  <p className="text-xs text-muted-foreground">{t('studentSidebar.homework.pendingPage.lateSubmissionsNotAllowed')}</p>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button
              onClick={() => handleStartHomework(homework)}
              disabled={startingId === homework.id}
            >
              {startingId === homework.id ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isInProgress ? t('studentSidebar.homework.pendingPage.opening') : t('studentSidebar.homework.pendingPage.starting')}
                </>
              ) : (
                isInProgress ? t('studentSidebar.homework.pendingPage.continueHomework') : t('studentSidebar.homework.pendingPage.startHomework')
              )}
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate(ROUTES.HOMEWORK.VIEW.replace(':id', homework.id))}
            >
              {t('studentSidebar.homework.pendingPage.viewDetails')}
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <DashboardLayout
      title={t('studentSidebar.homework.pendingPage.title')}
      description={t('studentSidebar.homework.pendingPage.subtitle')}
    >
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold text-foreground">{t('studentSidebar.homework.pendingPage.upcomingAssignments')}</h1>
            <p className="text-sm text-muted-foreground">
              {t('studentSidebar.homework.pendingPage.reviewDeadlines')}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={() => refresh()} disabled={loading}>
              <RefreshCcw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              {t('common.refresh')}
            </Button>
          </div>
        </div>

        {renderSummaryCards()}

        {error ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : null}

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : pendingHomeworks.length === 0 ? (
          <Card className="border-dashed border-2">
            <CardHeader className="items-center text-center">
              <CardTitle className="text-xl">{t('studentSidebar.homework.pendingPage.allCaughtUp')}</CardTitle>
              <CardDescription>
                {t('studentSidebar.homework.pendingPage.noPendingHomework')}
              </CardDescription>
            </CardHeader>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {pendingHomeworks.map(renderHomeworkCard)}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

export default StudentHomeworkPendingPage
