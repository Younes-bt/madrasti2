import React, { useMemo } from 'react'
import { AlertCircle, MessageSquare, UserCircle, Calendar, Star } from 'lucide-react'

import { DashboardLayout } from '../../components/layout/Layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import { Alert, AlertDescription } from '../../components/ui/alert'

import { useLanguage } from '../../hooks/useLanguage'
import { useStudentHomeworks } from '../../hooks/useStudentHomeworks'

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

const statusLabel = (status) => {
  if (!status) {
    return 'Completed'
  }

  return status
    .toString()
    .split('_')
    .map(chunk => chunk.charAt(0).toUpperCase() + chunk.slice(1))
    .join(' ')
}

const StudentHomeworkFeedbackPage = () => {
  const { currentLanguage } = useLanguage()
  const locale = localeMap[currentLanguage] ?? 'en-GB'
  const { homeworks, loading, error } = useStudentHomeworks({ ordering: '-graded_at' })

  const homeworkWithFeedback = useMemo(
    () =>
      homeworks.filter(hw => {
        const status = hw?.studentStatusNormalized || hw?.student_status
        const feedback = hw?.student_submission?.teacher_feedback?.trim()
        return status && COMPLETED_STATUSES.has(status) && feedback
      }),
    [homeworks]
  )

  return (
    <DashboardLayout
      title="Teacher Feedback"
      description="Read comments from your teachers to understand how you can improve."
    >
      <div className="space-y-6">
        {error ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : null}

        {loading ? (
          <Card className="border-dashed">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-foreground">Loading feedback</CardTitle>
              <CardDescription>
                Gathering comments from your teachers…
              </CardDescription>
            </CardHeader>
          </Card>
        ) : homeworkWithFeedback.length === 0 ? (
          <Card className="border-dashed border-2">
            <CardHeader className="items-center text-center">
              <CardTitle className="text-xl">No feedback available yet</CardTitle>
              <CardDescription>
                Once your teachers leave feedback on your submissions, it will appear here.
              </CardDescription>
            </CardHeader>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {homeworkWithFeedback.map(homework => {
              const submission = homework.student_submission
              const teacher = homework.teacher

              return (
                <Card key={homework.id} className="border border-border/70 shadow-sm">
                  <CardHeader>
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <CardTitle className="text-lg text-foreground">{homework.title || 'Untitled homework'}</CardTitle>
                        <CardDescription className="mt-1 text-sm">
                          {homework.subject?.name || 'Subject'} • {homework.grade?.name || 'Grade'}
                        </CardDescription>
                      </div>
                      <Badge variant="outline" className="capitalize">
                        {statusLabel(homework.studentStatusNormalized || homework.student_status)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="rounded-md border border-border/70 bg-muted/30 p-4 text-sm leading-relaxed text-muted-foreground">
                      “{submission?.teacher_feedback?.trim()}”
                    </div>

                    <div className="grid grid-cols-1 gap-4 text-sm text-muted-foreground sm:grid-cols-2">
                      <div className="flex items-start gap-3">
                        <UserCircle className="mt-0.5 h-5 w-5 text-blue-500" />
                        <div>
                          <p className="text-xs uppercase tracking-wide text-muted-foreground/80">Teacher</p>
                          <p className="font-medium text-foreground">{teacher?.full_name || teacher?.first_name || 'Your teacher'}</p>
                          {submission?.graded_at ? (
                            <p className="text-xs">Graded {formatDateTime(submission.graded_at, locale)}</p>
                          ) : null}
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Calendar className="mt-0.5 h-5 w-5 text-emerald-500" />
                        <div>
                          <p className="text-xs uppercase tracking-wide text-muted-foreground/80">Submitted on</p>
                          <p>{formatDateTime(submission?.submitted_at, locale)}</p>
                          <p className="text-xs">Due {formatDateTime(homework.due_date, locale)}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Star className="mt-0.5 h-5 w-5 text-amber-500" />
                        <div>
                          <p className="text-xs uppercase tracking-wide text-muted-foreground/80">Score</p>
                          <p className="font-medium text-foreground">
                            {submission?.total_score != null ? `${submission.total_score} / ${homework.total_points ?? '—'}` : 'Not graded yet'}
                          </p>
                          {submission?.points_earned ? (
                            <p className="text-xs">{submission.points_earned} reward points earned</p>
                          ) : null}
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <MessageSquare className="mt-0.5 h-5 w-5 text-purple-500" />
                        <div>
                          <p className="text-xs uppercase tracking-wide text-muted-foreground/80">Next steps</p>
                          <p>
                            Keep track of teacher comments to improve future submissions and maintain your progress.
                          </p>
                        </div>
                      </div>
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

export default StudentHomeworkFeedbackPage
