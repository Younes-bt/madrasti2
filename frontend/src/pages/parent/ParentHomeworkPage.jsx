import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import {
    ClipboardCheck,
    CheckCircle2,
    Award,
    ArrowRight,
    ClipboardList,
    AlertTriangle
} from 'lucide-react'
import { DashboardLayout } from '../../components/layout/Layout'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../components/ui/card'
import {
    Tabs,
    TabsList,
    TabsTrigger,
    TabsContent
} from '../../components/ui/tabs'
import { Badge } from '../../components/ui/badge'
import { useAuth } from '../../hooks/useAuth'
import { useStudentHomeworks } from '../../hooks/useStudentHomeworks'
import usersService from '../../services/users'
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

const ChildHomeworkDisplay = ({ child }) => {
    const { t } = useTranslation()
    const { summary, loading, homeworks } = useStudentHomeworks({
        student_id: child.id,
        ordering: '-created_at'
    })

    // Calculations for progress
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

    if (loading && homeworks.length === 0) {
        return (
            <div className="flex items-center justify-center p-12">
                <div className="animate-pulse flex flex-col items-center gap-4">
                    <div className="h-8 w-32 bg-muted rounded"></div>
                    <div className="h-4 w-48 bg-muted rounded"></div>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Tile
                    title={t('parentHomework.pending')}
                    value={summary?.pending || 0}
                    description={t('student.dashboard.assignmentsDescription')}
                    icon={ClipboardCheck}
                    color="purple"
                    actionLabel={t('common.show')}
                />
                <Tile
                    title={t('parentHomework.completed')}
                    value={summary?.completed || 0}
                    description={t('parentHomework.subtitle')}
                    icon={CheckCircle2}
                    color="green"
                    actionLabel={t('common.viewDetails')}
                />
                <Tile
                    title={t('parentHomework.grades')}
                    value={`${overallPct}%`}
                    description={t('student.dashboard.performanceDescription')}
                    icon={Award}
                    color="amber"
                    actionLabel={t('common.open')}
                />
            </div>

            <Card className="border border-border/60 bg-card/80 shadow-sm overflow-hidden rounded-2xl">
                <CardHeader className="border-b bg-muted/30 p-4 md:p-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-xl">
                            <ClipboardList className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <CardTitle className="text-base md:text-lg font-semibold">
                                {t('parentHomework.title', { name: child.full_name })}
                            </CardTitle>
                            <CardDescription>{t('parentHomework.subtitle')}</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    {homeworks.length === 0 ? (
                        <div className="p-8 text-center text-muted-foreground italic">
                            {t('parentHomework.noHomework')}
                        </div>
                    ) : (
                        <div className="divide-y divide-border/60">
                            {homeworks.map(hw => (
                                <div key={hw.id} className="p-4 hover:bg-muted/10 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-3">
                                            <span className="font-semibold text-base">{hw.title}</span>
                                            <Badge className={cn(
                                                "capitalize font-normal",
                                                hw.student_submission ? "bg-green-100 text-green-700 hover:bg-green-100" : "bg-muted text-muted-foreground"
                                            )}>
                                                {t(`status.${hw.studentStatusNormalized || 'pending'}`)}
                                            </Badge>
                                        </div>
                                        <div className="text-sm text-muted-foreground flex flex-wrap gap-x-4 gap-y-1 items-center">
                                            <span className="flex items-center gap-1">
                                                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                                                {hw.subject?.name}
                                            </span>
                                            <span className="flex items-center gap-1 font-medium text-orange-600/80">
                                                {t('parentHomework.dueDate', { date: hw.due_date ? new Date(hw.due_date).toLocaleDateString() : 'N/A' })}
                                            </span>
                                        </div>
                                    </div>
                                    {hw.student_submission && (
                                        <div className="flex items-center gap-4 text-sm border-l sm:border-l-0 sm:pl-0 pl-4 border-primary/20">
                                            <div className="text-left sm:text-right">
                                                <p className="font-bold text-base text-primary">
                                                    {hw.student_submission.total_score !== null
                                                        ? t('parentHomework.score', { score: hw.student_submission.total_score, total: hw.total_points })
                                                        : t('parentHomework.pendingGrading')
                                                    }
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {t('parentHomework.submittedAt', { date: new Date(hw.student_submission.submitted_at).toLocaleDateString() })}
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}

const ParentHomeworkPage = () => {
    const { t } = useTranslation()
    const { user } = useAuth()
    const [children, setChildren] = useState([])
    const [selectedChildId, setSelectedChildId] = useState(null)
    const [loadingChildren, setLoadingChildren] = useState(true)

    useEffect(() => {
        const fetchChildren = async () => {
            try {
                setLoadingChildren(true)
                const response = await usersService.getUserChildren(user.id)
                const childrenList = response.children || []
                setChildren(childrenList)
                if (childrenList.length > 0) {
                    setSelectedChildId(childrenList[0].id.toString())
                }
            } catch (error) {
                console.error('Failed to fetch children:', error)
            } finally {
                setLoadingChildren(false)
            }
        }
        if (user?.id) fetchChildren()
    }, [user?.id])

    return (
        <DashboardLayout user={user}>
            <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
                <div>
                    <h1 className="text-2xl md:text-3xl font-semibold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                        {t('parentHome.homeWork')}
                    </h1>
                    <p className="text-muted-foreground mt-1 font-medium">{t('parentHome.helperText')}</p>
                </div>

                {loadingChildren ? (
                    <div className="flex items-center justify-center p-12">
                        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                    </div>
                ) : children.length === 0 ? (
                    <Card className="p-12 text-center flex flex-col items-center gap-4 bg-muted/20 border-dashed border-2 rounded-2xl">
                        <div className="p-4 bg-background rounded-full shadow-md">
                            <AlertTriangle className="h-10 w-10 text-orange-500" />
                        </div>
                        <div className="space-y-1">
                            <CardTitle className="text-xl font-semibold">{t('parentHome.noKidsFound')}</CardTitle>
                            <CardDescription className="max-w-sm">{t('parentHome.noKidsDescription')}</CardDescription>
                        </div>
                    </Card>
                ) : (
                    <Tabs value={selectedChildId} onValueChange={setSelectedChildId} className="space-y-6">
                        <div className="overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 scrollbar-hide">
                            <TabsList className="inline-flex w-auto h-auto p-1.5 bg-muted/40 border backdrop-blur-sm rounded-xl">
                                {children.map((child) => (
                                    <TabsTrigger
                                        key={child.id}
                                        value={child.id.toString()}
                                        className="rounded-lg px-6 py-2.5 data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-md transition-all duration-200"
                                    >
                                        <span className="font-semibold text-sm tracking-wide">{child.full_name}</span>
                                    </TabsTrigger>
                                ))}
                            </TabsList>
                        </div>

                        {children.map((child) => (
                            <TabsContent key={child.id} value={child.id.toString()} className="mt-0 focus-visible:outline-none outline-none">
                                <ChildHomeworkDisplay child={child} />
                            </TabsContent>
                        ))}
                    </Tabs>
                )}
            </div>
        </DashboardLayout>
    )
}

export default ParentHomeworkPage
