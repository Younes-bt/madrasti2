import React from 'react'
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

const Tile = ({ title, value, description, icon: Icon, gradient, onClick, actionLabel = 'Open' }) => (
  <button
    type="button"
    onClick={onClick}
    className={cn(
      'group relative overflow-hidden rounded-2xl border border-border/60 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
      'min-h-[150px]'
    )}
  >
    <div className={cn('absolute inset-0 opacity-80 transition-opacity duration-300 group-hover:opacity-100 bg-gradient-to-br', gradient)} />
    <div className="absolute inset-0 bg-white/10 dark:bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity" />
    <div className="relative z-10 p-4 sm:p-5 text-white space-y-3">
      <div className="flex items-center justify-between">
        <div className="rounded-2xl bg-white/20 p-2 shadow-inner backdrop-blur">
          <Icon className="h-5 w-5" />
        </div>
        <div className="text-xs font-semibold bg-white/30 text-white px-2 py-1 rounded-full backdrop-blur">
          {actionLabel}
        </div>
      </div>
      <div className="space-y-1">
        <p className="text-sm text-white/90">{title}</p>
        <p className="text-3xl font-bold drop-shadow-sm">{value}</p>
        <p className="text-xs text-white/80">{description}</p>
      </div>
      <div className="flex items-center gap-1 text-xs text-white/90">
        <span>Tap to start</span>
        <ArrowRight className="h-4 w-4" />
      </div>
    </div>
  </button>
)

const StudentHomework = () => {
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
            <h1 className="text-2xl font-bold">My Homework</h1>
            <p className="text-muted-foreground text-sm">Track pending work, completed tasks, and view your grades.</p>
          </div>
          <Button variant="outline" onClick={refresh} disabled={loading}>
            Refresh
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Tile
            title="Pending"
            value={pending}
            description="Assignments awaiting submission"
            icon={ClipboardCheck}
            gradient="from-purple-500 via-violet-400 to-purple-600"
            onClick={() => navigate(ROUTES.STUDENT_HOMEWORK.PENDING)}
            actionLabel="Go"
          />
          <Tile
            title="Completed"
            value={completed}
            description="Finished homework and graded submissions"
            icon={CheckCircle2}
            gradient="from-emerald-500 via-green-400 to-teal-500"
            onClick={() => navigate(ROUTES.STUDENT_HOMEWORK.COMPLETED)}
            actionLabel="View"
          />
          <Tile
            title="My Grades"
            value="View"
            description="See scores and feedback"
            icon={Award}
            gradient="from-amber-400 via-orange-400 to-amber-600"
            onClick={() => navigate(ROUTES.STUDENT_HOMEWORK.GRADES)}
            actionLabel="Open"
          />
        </div>

        <Card className="border border-border/60 bg-card/80 shadow-sm">
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
                <p className="text-sm text-muted-foreground">Overall homework score</p>
                <p className="text-base font-semibold">Across all subjects</p>
              </div>
              <div className="ml-auto text-sm text-muted-foreground">Show details</div>
            </CollapsibleTrigger>
            <CollapsibleContent className="px-4 sm:px-5 pb-4 pt-2">
              {subjectRows.length === 0 && (
                <p className="text-sm text-muted-foreground">No graded homework yet.</p>
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
