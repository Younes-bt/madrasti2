import React, { useMemo } from 'react'
import { AlertCircle, CheckCircle2, Clock, FileText } from 'lucide-react'

import { DashboardLayout } from '../../components/layout/Layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table'
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

const formatScore = (submission, totalPoints) => {
  const score = Number(submission?.total_score)
  if (Number.isNaN(score)) {
    return '—'
  }
  if (typeof totalPoints === 'number' && !Number.isNaN(totalPoints) && totalPoints > 0) {
    return `${score} / ${totalPoints}`
  }
  return score
}

const StudentHomeworkGradesPage = () => {
  const { currentLanguage } = useLanguage()
  const locale = localeMap[currentLanguage] ?? 'en-GB'
  const { homeworks, loading, error, summary } = useStudentHomeworks({ ordering: '-created_at' })

  const gradedHomeworks = useMemo(
    () =>
      homeworks.filter(hw => {
        const status = hw?.studentStatusNormalized || hw?.student_status
        return status && COMPLETED_STATUSES.has(status)
      }),
    [homeworks]
  )

  return (
    <DashboardLayout
      title="My Homework Grades"
      description="Track your scores, earned points, and submission history in one place."
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Completed assignments</CardDescription>
              <CardTitle className="text-3xl">{summary.completed}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Homework you have submitted and can review here.
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Pending</CardDescription>
              <CardTitle className="text-3xl">{summary.pending}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Assignments awaiting submission or grading.
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Overdue</CardDescription>
              <CardTitle className="text-3xl">{summary.overdue}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Published homework that has passed the due date.
            </CardContent>
          </Card>
        </div>

        {error ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : null}

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-foreground">Grade overview</CardTitle>
            <CardDescription>
              Scores shown are based on your latest attempt for each assignment.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Clock className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : gradedHomeworks.length === 0 ? (
              <div className="space-y-2 py-10 text-center">
                <FileText className="mx-auto h-10 w-10 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  You have no graded homework yet. Submit assignments to see grades.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[220px]">Homework</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Score</TableHead>
                      <TableHead>Reward points</TableHead>
                      <TableHead>Submitted on</TableHead>
                      <TableHead>Teacher feedback</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {gradedHomeworks.map(homework => {
                      const submission = homework.student_submission
                      const status = homework?.studentStatusNormalized || homework?.student_status
                      const isLate = status === 'late'

                      return (
                        <TableRow key={homework.id}>
                          <TableCell>
                            <div className="space-y-1">
                              <p className="font-medium text-foreground">{homework.title || 'Untitled homework'}</p>
                              <p className="text-xs text-muted-foreground">
                                {homework.subject?.name || 'Subject'} • {homework.grade?.name || 'Grade'}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={isLate ? 'destructive' : 'default'} className="capitalize">
                              {status?.replace(/_/g, ' ') || 'completed'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                              <span>{formatScore(submission, homework.total_points)}</span>
                            </div>
                          </TableCell>
                          <TableCell>{submission?.points_earned ?? '—'}</TableCell>
                          <TableCell>{formatDateTime(submission?.submitted_at, locale)}</TableCell>
                          <TableCell className="max-w-[260px] whitespace-pre-wrap text-xs text-muted-foreground">
                            {submission?.teacher_feedback?.trim() || '—'}
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}

export default StudentHomeworkGradesPage
