import React, { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { AlertCircle, Award, BadgeCheck, Calendar, CheckCircle2, Clock, Loader2 } from 'lucide-react'

import { DashboardLayout } from '../../components/layout/Layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import { Button } from '../../components/ui/button'
import { Alert, AlertDescription } from '../../components/ui/alert'

import { useLanguage } from '../../hooks/useLanguage'
import { useStudentHomeworks } from '../../hooks/useStudentHomeworks'
import { ROUTES } from '../../utils/constants'

const localeMap = {
  ar: 'ar-MA',
  fr: 'fr-FR',
  en: 'en-GB',
}

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

const formatScore = (score, total) => {
  const numericScore = Number(score)
  if (Number.isNaN(numericScore)) {
    return '—'
  }
  if (typeof total === 'number' && !Number.isNaN(total) && total > 0) {
    return `${numericScore} / ${total}`
  }
  return numericScore
}

const StudentHomeworkCompletedPage = () => {
  const navigate = useNavigate()
  const { t, currentLanguage } = useLanguage()
  const locale = localeMap[currentLanguage] ?? 'en-GB'
  const { homeworks, loading, error, refresh, summary } = useStudentHomeworks({ ordering: '-due_date' })

  const statusLabel = (status) => {
    if (!status) {
      return t('studentSidebar.homework.completedPage.completed')
    }

    const statusMap = {
      'completed': t('studentSidebar.homework.completedPage.completed'),
      'late': t('studentSidebar.homework.completedPage.late'),
    }

    return statusMap[status] || status
      .split('_')
      .map(chunk => chunk.charAt(0).toUpperCase() + chunk.slice(1))
      .join(' ')
  }

  const completedHomeworks = useMemo(
    () =>
      homeworks.filter(hw => {
        const status = hw?.studentStatusNormalized || hw?.student_status
        return status && COMPLETED_STATUSES.has(status)
      }),
    [homeworks]
  )

  return (
    <DashboardLayout
      title={t('studentSidebar.homework.completedPage.title')}
      description={t('studentSidebar.homework.completedPage.subtitle')}
    >
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold text-foreground">{t('studentSidebar.homework.completedPage.submissionHistory')}</h1>
            <p className="text-sm text-muted-foreground">
              {t('studentSidebar.homework.completedPage.viewGrades')}
            </p>
          </div>
          <Button variant="outline" onClick={() => refresh()} disabled={loading}>
            <Loader2 className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            {t('common.refresh')}
          </Button>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>{t('studentSidebar.homework.completedPage.totalCompleted')}</CardDescription>
              <CardTitle className="text-3xl">{summary.completed}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              {t('studentSidebar.homework.completedPage.completedDescription')}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>{t('studentSidebar.homework.completedPage.pendingGrading')}</CardDescription>
              <CardTitle className="text-3xl">{summary.pending}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              {t('studentSidebar.homework.completedPage.pendingGradingDescription')}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>{t('studentSidebar.homework.completedPage.overdueAssignments')}</CardDescription>
              <CardTitle className="text-3xl">{summary.overdue}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              {t('studentSidebar.homework.completedPage.overdueDescription')}
            </CardContent>
          </Card>
        </div>

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
        ) : completedHomeworks.length === 0 ? (
          <Card className="border-dashed border-2">
            <CardHeader className="items-center text-center">
              <CardTitle className="text-xl">{t('studentSidebar.homework.completedPage.noCompletedHomework')}</CardTitle>
              <CardDescription>
                {t('studentSidebar.homework.completedPage.noCompletedDescription')}
              </CardDescription>
            </CardHeader>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {completedHomeworks.map(homework => {
              const submission = homework?.student_submission
              const status = homework?.studentStatusNormalized || homework?.student_status

              return (
                <Card key={homework.id} className="border border-border/70 shadow-sm">
                  <CardHeader>
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <CardTitle className="text-lg text-foreground">
                          {homework.title || t('studentSidebar.homework.completedPage.untitled')}
                        </CardTitle>
                        <CardDescription className="mt-1 text-sm leading-relaxed">
                          {homework.description || t('studentSidebar.homework.completedPage.noDescription')}
                        </CardDescription>
                      </div>
                      <Badge variant={status === 'late' ? 'destructive' : 'default'} className="capitalize">
                        {statusLabel(status)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                      <div className="flex items-start gap-3">
                        <Calendar className="mt-1 h-5 w-5 text-blue-500" />
                        <div>
                          <p className="text-sm font-medium text-foreground">{t('studentSidebar.homework.completedPage.submittedAt')}</p>
                          <p className="text-sm text-muted-foreground">
                            {formatDateTime(submission?.submitted_at, locale)}
                          </p>
                          {homework.due_date ? (
                            <p className="text-xs text-muted-foreground">
                              {formatDateTime(homework.due_date, locale)}
                            </p>
                          ) : null}
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle2 className="mt-1 h-5 w-5 text-emerald-500" />
                        <div>
                          <p className="text-sm font-medium text-foreground">{t('studentSidebar.homework.completedPage.score')}</p>
                          <p className="text-sm text-muted-foreground">
                            {submission?.total_score != null
                              ? `${formatScore(submission?.total_score, homework.total_points)} ${t('studentSidebar.homework.completedPage.points')}`
                              : t('studentSidebar.homework.completedPage.notGradedYet')}
                          </p>
                          {submission?.points_earned != null ? (
                            <p className="text-xs text-muted-foreground">{submission.points_earned} {t('studentSidebar.homework.completedPage.points')}</p>
                          ) : null}
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Clock className="mt-1 h-5 w-5 text-amber-500" />
                        <div>
                          <p className="text-sm font-medium text-foreground">{t('studentSidebar.homework.completedPage.timeSpent')}</p>
                          <p className="text-sm text-muted-foreground">
                            {submission?.time_taken ? `${submission.time_taken} ${t('studentSidebar.homework.completedPage.min')}` : t('studentSidebar.homework.completedPage.notRecorded')}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {t('studentSidebar.homework.completedPage.attempt')} #{submission?.attempt_number ?? 1}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <BadgeCheck className="mt-1 h-5 w-5 text-purple-500" />
                        <div>
                          <p className="text-sm font-medium text-foreground">{t('studentSidebar.homework.completedPage.teacherFeedback')}</p>
                          <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                            {submission?.teacher_feedback?.trim() || t('studentSidebar.homework.completedPage.noScore')}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      <Button
                        variant="outline"
                        onClick={() => navigate(`/student/homework/submission/${submission?.id}`)}
                      >
                        {t('studentSidebar.homework.completedPage.reviewSubmission')}
                      </Button>
                      {submission?.graded_at ? (
                        <Button
                          variant="ghost"
                          className="px-2 text-muted-foreground hover:text-foreground"
                          onClick={() => navigate(ROUTES.STUDENT_HOMEWORK.FEEDBACK)}
                        >
                          <Award className="mr-2 h-4 w-4" />
                          {t('studentSidebar.homework.completedPage.viewAllFeedback')}
                        </Button>
                      ) : null}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

export default StudentHomeworkCompletedPage
