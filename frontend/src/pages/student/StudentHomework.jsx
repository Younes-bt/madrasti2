import React from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { ClipboardCheck, CheckCircle2, Award, ArrowRight } from 'lucide-react'
import { DashboardLayout } from '../../components/layout/Layout'
import { Button } from '../../components/ui/button'
import { Card } from '../../components/ui/card'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../../components/ui/collapsible'
import { Progress } from '../../components/ui/progress'
import { useStudentHomeworks } from '../../hooks/useStudentHomeworks'
import { useAuth } from '../../hooks/useAuth'
import { ROUTES } from '../../utils/constants'
import { cn } from '../../lib/utils'

const Tile = ({ title, value, description, icon: IconElement, color = 'primary', onClick, actionLabel }) => {
  const colorClasses = {
    primary: 'border-l-primary/40 bg-primary/5',
    blue: 'border-l-blue-500/40 bg-blue-500/5',
    green: 'border-l-emerald-500/40 bg-emerald-500/5',
    purple: 'border-l-purple-500/40 bg-purple-500/5',
    amber: 'border-l-amber-500/40 bg-amber-500/5',
    orange: 'border-l-orange-500/40 bg-orange-500/5'
  }

  const iconColors = {
    primary: 'text-primary bg-primary/10',
    blue: 'text-blue-600 bg-blue-50',
    green: 'text-emerald-600 bg-emerald-50',
    purple: 'text-purple-600 bg-purple-50',
    amber: 'text-amber-600 bg-amber-50',
    orange: 'text-orange-600 bg-orange-50'
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'group relative overflow-hidden rounded-2xl border border-border/50 border-l-4 p-5 text-left shadow-sm transition-all hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
        'bg-card/40 backdrop-blur-sm',
        colorClasses[color] || colorClasses.primary
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-3 flex-1">
          <div className={cn('inline-flex p-2.5 rounded-xl transition-colors', iconColors[color] || iconColors.primary)}>
            <IconElement className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold text-muted-foreground tracking-tight">{title}</p>
            <div className="flex items-baseline gap-1">
              <p className="text-3xl font-bold text-foreground">{value}</p>
            </div>
            <p className="text-xs text-muted-foreground/80 mt-1 line-clamp-1">{description}</p>
          </div>
        </div>
        {actionLabel && (
          <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 bg-muted/50 px-2 py-1 rounded-md">
            {actionLabel}
          </div>
        )}
      </div>
      <div className="absolute right-2 bottom-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <ArrowRight className="h-4 w-4 text-muted-foreground/40" />
      </div>
    </button>
  )
}

const StudentHomework = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { summary, refresh, loading, homeworks } = useStudentHomeworks({ ordering: '-created_at' })

  const pending = summary?.pending || 0
  const completed = summary?.completed || 0

  // Overall progress (completed submissions with scores)
  const completedWithScores = homeworks.filter(hw => {
    const submission = hw.student_submission || {}
    const rawStatus = (submission.status || hw.student_status || '').toLowerCase()
    const normalizedStatus = (hw.studentStatusNormalized || rawStatus || '').toLowerCase()
    const statusForCalc = normalizedStatus || rawStatus
    const allowedStatuses = new Set(['completed', 'auto_graded', 'manually_graded', 'late'])

    const score = Number(submission.total_score)
    const pts = Number(hw.total_points)

    return allowedStatuses.has(statusForCalc) && !Number.isNaN(score) && !Number.isNaN(pts) && pts > 0
  })

  const totalEarned = completedWithScores.reduce((sum, hw) => sum + Number(hw.student_submission?.total_score || 0), 0)
  const totalPossible = completedWithScores.reduce((sum, hw) => sum + Number(hw.total_points || 0), 0)
  const overallPct = totalPossible > 0 ? Math.round((totalEarned / totalPossible) * 100) : 0

  // Subject breakdown
  const subjectMap = completedWithScores.reduce((acc, hw) => {
    const key = hw.subject?.name || 'Other'
    if (!acc[key]) {
      acc[key] = { earned: 0, possible: 0 }
    }
    acc[key].earned += Number(hw.student_submission?.total_score || 0)
    acc[key].possible += Number(hw.total_points || 0)
    return acc
  }, {})
  const subjectRows = Object.entries(subjectMap).map(([subject, data]) => ({
    subject,
    pct: data.possible > 0 ? Math.round((data.earned / data.possible) * 100) : 0
  })).sort((a, b) => b.pct - a.pct)

  return (
    <DashboardLayout user={user}>
      <div className="max-w-6xl mx-auto px-3 sm:px-4 md:px-6 py-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              {t('parentHome.homeWork')}
            </h1>
            <p className="text-muted-foreground text-sm font-medium">{t('student.dashboard.assignmentsDescription')}</p>
          </div>
          <Button variant="outline" onClick={refresh} disabled={loading}>
            {t('common.refresh')}
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Tile
            title={t('parentHomework.pending')}
            value={pending}
            description={t('student.dashboard.assignmentsDescription')}
            icon={ClipboardCheck}
            color="purple"
            onClick={() => navigate(ROUTES.STUDENT_HOMEWORK.PENDING)}
            actionLabel={t('common.show')}
          />
          <Tile
            title={t('parentHomework.completed')}
            value={completed}
            description={t('parentHomework.subtitle')}
            icon={CheckCircle2}
            color="green"
            onClick={() => navigate(ROUTES.STUDENT_HOMEWORK.COMPLETED)}
            actionLabel={t('common.viewDetails')}
          />
          <Tile
            title={t('parentHomework.grades')}
            value={t('common.view')}
            description={t('student.dashboard.performanceDescription')}
            icon={Award}
            color="amber"
            onClick={() => navigate(ROUTES.STUDENT_HOMEWORK.GRADES)}
            actionLabel={t('common.open')}
          />
        </div>

        <Card className="border border-border/60 bg-card/80 shadow-sm rounded-2xl overflow-hidden">
          <Collapsible className="w-full" open>
            <CollapsibleTrigger className="w-full px-4 sm:px-5 py-3 text-left flex items-center gap-4 hover:bg-muted/40 rounded-md">
              <div
                className="relative h-16 w-16 flex items-center justify-center rounded-full bg-muted/60"
                style={{
                  backgroundImage: `conic-gradient(var(--primary) ${overallPct}%, rgba(0,0,0,0.08) ${overallPct}%)`
                }}
              >
                <div className="absolute inset-1 rounded-full bg-card flex items-center justify-center">
                  <span className="text-sm font-semibold">{overallPct}%</span>
                </div>
              </div>
              <div className="text-left">
                <p className="text-sm text-muted-foreground">{t('student.dashboard.overallProgress')}</p>
                <p className="text-base font-semibold">{t('student.dashboard.acrossAllSubjects') || 'Across all subjects'}</p>
              </div>
              <div className="ml-auto text-sm text-muted-foreground">{t('common.showDetails') || 'Show details'}</div>
            </CollapsibleTrigger>
            <CollapsibleContent className="px-4 sm:px-5 pb-4 pt-2">
              {subjectRows.length === 0 && (
                <p className="text-sm text-muted-foreground">{t('student.dashboard.noLessonsCompletedDesc')}</p>
              )}
              <div className="space-y-3">
                {subjectRows.map((row) => (
                  <div key={row.subject} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span>{row.subject}</span>
                      <span className="font-semibold">{row.pct}%</span>
                    </div>
                    <Progress value={row.pct} className="h-2" />
                  </div>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>
        </Card>
      </div>
    </DashboardLayout>
  )
}

export default StudentHomework
