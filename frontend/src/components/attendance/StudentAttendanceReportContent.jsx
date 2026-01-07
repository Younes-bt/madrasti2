import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../../hooks/useLanguage'
import attendanceService from '../../services/attendance'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import { Button } from '../../components/ui/button'
import { Progress } from '../../components/ui/progress'
import {
    AlertTriangle,
    BarChart3,
    Calendar,
    CheckCircle2,
    Clock,
    PieChart,
    TrendingDown,
    TrendingUp,
    CheckCircle,
    BookOpen,
    User as UserIcon,
    ChevronRight
} from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../../components/ui/dialog'
import { Label } from '../../components/ui/label'
import { Textarea } from '../../components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select'
import { toast } from 'sonner'

const chartColors = {
    present: '#22c55e',
    late: '#facc15',
    absent: '#ef4444',
    excused: '#3b82f6'
}

const StudentAttendanceReportContent = ({ studentId, title, subtitle, showHistoryButton = true }) => {
    const { t, currentLanguage } = useLanguage()
    const { user } = useAuth()
    const isAdminOrStaff = user?.role === 'ADMIN' || user?.role === 'STAFF'
    const navigate = useNavigate()
    const [stats, setStats] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [flagInfo, setFlagInfo] = useState({ hasFlag: false, count: 0 })
    const [pendingFlags, setPendingFlags] = useState([])

    // Flag dialog state
    const [selectedFlag, setSelectedFlag] = useState(null)
    const [isFlagDialogOpen, setIsFlagDialogOpen] = useState(false)
    const [clearanceReason, setClearanceReason] = useState('')
    const [clearanceNotes, setClearanceNotes] = useState('')
    const [isClearing, setIsClearing] = useState(false)

    const handleViewHistory = () => {
        navigate('/student/attendance/history')
    }

    const loadReport = useCallback(async () => {
        if (!studentId) return

        setLoading(true)
        setError(null)
        setFlagInfo({ hasFlag: false, count: 0 })
        setPendingFlags([])

        try {
            const [statsResult, recordsResult, flagsResult] = await Promise.allSettled([
                attendanceService.getStudentStatistics(studentId),
                attendanceService.getAttendanceRecords({ student_id: studentId, page_size: 1 }),
                attendanceService.getPendingAbsenceFlags({ student_id: studentId })
            ])

            if (statsResult.status === 'fulfilled') {
                setStats(statsResult.value)
            } else {
                throw statsResult.reason
            }

            if (recordsResult.status === 'fulfilled') {
                const rawRecords = recordsResult.value
                const normalized = Array.isArray(rawRecords)
                    ? rawRecords
                    : rawRecords?.results || rawRecords?.records || []

                if (normalized.length > 0) {
                    const record = normalized[0]
                    const count = Number(record?.pending_flags_count ?? 0)
                    const hasFlag = Boolean(record?.has_pending_flags) || count > 0
                    setFlagInfo({ hasFlag, count })
                }
            }

            if (flagsResult.status === 'fulfilled') {
                const rawFlags = flagsResult.value
                const normalizedFlags = Array.isArray(rawFlags)
                    ? rawFlags
                    : rawFlags?.pending_flags || rawFlags?.results || rawFlags?.records || []
                setPendingFlags(normalizedFlags)
            }
        } catch (err) {
            console.error('Failed to load attendance report:', err)
            setStats(null);
            setError(err?.userMessage || err?.message || t('errors.unexpectedError', 'Unexpected error'));
        } finally {
            setLoading(false)
        }
    }, [studentId, t])

    useEffect(() => {
        if (studentId) {
            loadReport()
        }
    }, [studentId, loadReport])

    const totalTrackedSessions = useMemo(() => {
        if (!stats) return 0
        return (
            (stats.present_count || 0) +
            (stats.absent_count || 0) +
            (stats.late_count || 0) +
            (stats.excused_count || 0)
        )
    }, [stats])

    const chartSegments = useMemo(() => {
        if (!stats) return []

        return [
            {
                key: 'present',
                label: t('attendance.present', 'Present'),
                value: stats.present_count || 0,
                color: chartColors.present
            },
            {
                key: 'late',
                label: t('attendance.late', 'Late'),
                value: stats.late_count || 0,
                color: chartColors.late
            },
            {
                key: 'absent',
                label: t('attendance.absent', 'Absent'),
                value: stats.absent_count || 0,
                color: chartColors.absent
            },
            {
                key: 'excused',
                label: t('attendance.excused', 'Excused'),
                value: stats.excused_count || 0,
                color: chartColors.excused
            }
        ]
    }, [stats, t])

    const conicGradient = useMemo(() => {
        if (!totalTrackedSessions) {
            return 'conic-gradient(#e5e7eb 0deg 360deg)'
        }

        let currentAngle = 0
        const segments = chartSegments
            .filter(segment => segment.value > 0)
            .map(segment => {
                const sweep = (segment.value / totalTrackedSessions) * 360
                const start = currentAngle
                const end = currentAngle + sweep
                currentAngle = end
                return `${segment.color} ${start}deg ${end}deg`
            })

        if (!segments.length) {
            return 'conic-gradient(#e5e7eb 0deg 360deg)'
        }

        return `conic-gradient(${segments.join(', ')})`
    }, [chartSegments, totalTrackedSessions])

    const formatDate = (value) => {
        if (!value) return t('common.notAvailable', 'N/A')
        try {
            return new Date(value).toLocaleDateString(currentLanguage === 'ar' ? 'ar-MA' : 'en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            })
        } catch {
            return value
        }
    }

    const getStatusBadgeTone = (status) => {
        switch (status) {
            case 'present':
                return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300'
            case 'absent':
                return 'bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-300'
            case 'late':
                return 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-200'
            case 'excused':
                return 'bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300'
            default:
                return 'bg-muted text-muted-foreground'
        }
    }

    const handleFlagClick = (flag) => {
        setSelectedFlag(flag);
        setClearanceReason('');
        setClearanceNotes('');
        setIsFlagDialogOpen(true);
    };

    const handleCloseFlagDialog = () => {
        setIsFlagDialogOpen(false);
        setSelectedFlag(null);
        setClearanceReason('');
        setClearanceNotes('');
    };

    const handleClearFlag = async () => {
        if (!selectedFlag || !clearanceReason) {
            toast.error(t('attendance.pleaseSelectReason'));
            return;
        }

        setIsClearing(true);
        try {
            await attendanceService.clearAbsenceFlag(selectedFlag.id, {
                clearance_reason: clearanceReason,
                clearance_notes: clearanceNotes
            });

            toast.success(t('attendance.flagCleared'));
            handleCloseFlagDialog();
            loadReport();
        } catch (error) {
            console.error('Failed to clear flag:', error);
            toast.error(t('attendance.failedToClearFlag'));
        } finally {
            setIsClearing(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    <p className="text-muted-foreground">{t('common.loading', 'Loading...')}</p>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <Card className="border-destructive/40 bg-destructive/5">
                <CardContent className="pt-6 space-y-4">
                    <div className="flex items-center gap-2 text-destructive">
                        <AlertTriangle className="h-5 w-5" />
                        <h3 className="font-semibold">{t('common.error', 'Error')}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">{error}</p>
                    <Button variant="outline" onClick={loadReport}>
                        {t('common.tryAgain', 'Try again')}
                    </Button>
                </CardContent>
            </Card>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    {title && <h1 className="text-3xl font-bold tracking-tight">{title}</h1>}
                    {subtitle && <p className="text-muted-foreground mt-1">{subtitle}</p>}
                </div>
                {showHistoryButton && (
                    <Button variant="outline" className="self-start" onClick={handleViewHistory}>
                        <Calendar className="h-4 w-4 mr-2" />
                        {t('attendance.viewHistory', 'View full history')}
                    </Button>
                )}
            </div>

            <Card
                className={
                    flagInfo.hasFlag
                        ? 'border-red-200 bg-red-50 dark:border-red-500/40 dark:bg-red-500/10'
                        : 'border-emerald-200 bg-emerald-50 dark:border-emerald-500/40 dark:bg-emerald-500/10'
                }
            >
                <CardContent className="py-5">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-center gap-3">
                            {flagInfo.hasFlag ? (
                                <AlertTriangle className="h-6 w-6 text-red-500" />
                            ) : (
                                <CheckCircle2 className="h-6 w-6 text-emerald-500" />
                            )}
                            <div>
                                <p className="font-semibold">
                                    {flagInfo.hasFlag
                                        ? t(
                                            'studentAttendanceReport.absenceFlagTitle',
                                            'Pending absence flag detected'
                                        )
                                        : t(
                                            'studentAttendanceReport.noAbsenceFlagTitle',
                                            'No pending absence flags'
                                        )}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    {flagInfo.hasFlag
                                        ? isAdminOrStaff
                                            ? t('studentAttendanceReport.absenceFlagAdminDescription', 'Pending flags detected. Review and clear them using the section below.')
                                            : t('studentAttendanceReport.absenceFlagDescription', 'Please contact the administration as soon as possible to clear your absence badge.')
                                        : t(
                                            'studentAttendanceReport.noAbsenceFlagDescription',
                                            'Great job! There are no outstanding flags on your attendance record.'
                                        )}
                                </p>
                            </div>
                        </div>
                        {flagInfo.hasFlag && (
                            <Badge variant="destructive" className="self-start">
                                {t('attendance.pendingFlags', 'Pending flags')}: {flagInfo.count || 1}
                            </Badge>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Pending Flags Section (Visible to Admin/Staff) */}
            {isAdminOrStaff && pendingFlags.length > 0 && (
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2 text-red-600">
                        <AlertTriangle className="h-5 w-5" />
                        {t('attendance.pendingAbsenceFlags', 'Pending Absence Flags')}
                    </h3>
                    <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
                        {pendingFlags.map(flag => (
                            <Card key={flag.id} className="border-red-200 bg-red-50/30 overflow-hidden">
                                <CardContent className="p-4">
                                    <div className="flex justify-between items-start">
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 text-sm">
                                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                                <span className="font-medium">{formatDate(flag.attendance_date)}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-sm">
                                                <BookOpen className="h-4 w-4 text-muted-foreground" />
                                                <span>{flag.subject_name}</span>
                                            </div>
                                            <p className="text-xs text-muted-foreground italic">
                                                {t('attendance.flagCreated', 'Flag created')}: {formatDate(flag.created_at)}
                                            </p>
                                        </div>
                                        <Button
                                            size="sm"
                                            variant="destructive"
                                            className="rounded-full px-4 h-8 text-xs"
                                            onClick={() => handleFlagClick(flag)}
                                        >
                                            <CheckCircle className="h-3 w-3 mr-1.5" />
                                            {t('attendance.clearFlag', 'Clear Flag')}
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            )}

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <Card className="bg-emerald-50/60 dark:bg-emerald-500/10">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-emerald-600 dark:text-emerald-300">
                                    {t('attendance.presenceRate', 'Presence rate')}
                                </p>
                                <p className="text-3xl font-bold text-emerald-700 dark:text-emerald-200">
                                    {stats?.presence_rate ?? 0}%
                                </p>
                                <p className="text-xs text-emerald-600/80 dark:text-emerald-200/80">
                                    {(stats?.present_count || 0)}/{stats?.total_sessions || 0}{' '}
                                    {t('attendance.sessions', 'sessions')}
                                </p>
                            </div>
                            <CheckCircle2 className="h-10 w-10 text-emerald-500" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-red-50/60 dark:bg-red-500/10">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-red-600 dark:text-red-300">
                                    {t('attendance.absenceRate', 'Absence rate')}
                                </p>
                                <p className="text-3xl font-bold text-red-700 dark:text-red-200">
                                    {stats?.absence_rate ?? 0}%
                                </p>
                                <p className="text-xs text-red-600/80 dark:text-red-200/80">
                                    {(stats?.absent_count || 0)}/{stats?.total_sessions || 0}{' '}
                                    {t('attendance.sessions', 'sessions')}
                                </p>
                            </div>
                            <TrendingDown className="h-10 w-10 text-red-500" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-amber-50/60 dark:bg-amber-500/10">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-amber-600 dark:text-amber-200">
                                    {t('attendance.lateRate', 'Late rate')}
                                </p>
                                <p className="text-3xl font-bold text-amber-700 dark:text-amber-100">
                                    {stats?.late_count
                                        ? ((stats.late_count / (stats.total_sessions || 1)) * 100).toFixed(1)
                                        : '0.0'}
                                    %
                                </p>
                                <p className="text-xs text-amber-600/80 dark:text-amber-200/80">
                                    {(stats?.late_count || 0)}/{stats?.total_sessions || 0}{' '}
                                    {t('attendance.sessions', 'sessions')}
                                </p>
                            </div>
                            <Clock className="h-10 w-10 text-amber-500" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-slate-50/60 dark:bg-slate-500/10">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-slate-600 dark:text-slate-200">
                                    {t('attendance.totalSessions', 'Total sessions')}
                                </p>
                                <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                                    {stats?.total_sessions || 0}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    {t('attendance.attendanceRate', 'Attendance rate')}:{' '}
                                    {stats?.attendance_rate ?? 0}%
                                </p>
                            </div>
                            <BarChart3 className="h-10 w-10 text-slate-500" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <PieChart className="h-5 w-5 text-primary" />
                            {t('studentAttendanceReport.distributionTitle', 'Attendance distribution')}
                        </CardTitle>
                        <CardDescription>
                            {t(
                                'studentAttendanceReport.distributionSubtitle',
                                'Overview of how often you were present, late, absent, or excused.'
                            )}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-6 lg:flex-row lg:items-center">
                        <div className="flex justify-center lg:w-1/2">
                            <div className="relative h-48 w-48">
                                <div
                                    className="h-full w-full rounded-full"
                                    style={{ backgroundImage: conicGradient }}
                                ></div>
                                <div className="absolute inset-6 rounded-full bg-background shadow-inner flex flex-col items-center justify-center text-center">
                                    <span className="text-sm text-muted-foreground">
                                        {t('attendance.attendanceRate', 'Attendance rate')}
                                    </span>
                                    <span className="text-2xl font-semibold">
                                        {stats?.attendance_rate ?? 0}%
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                        {totalTrackedSessions}{' '}
                                        {t('attendance.markedSessions', 'marked sessions')}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="grid flex-1 gap-3 text-sm">
                            {chartSegments.map(segment => {
                                const percentage = totalTrackedSessions
                                    ? ((segment.value / totalTrackedSessions) * 100).toFixed(1)
                                    : 0

                                return (
                                    <div key={segment.key} className="flex items-center justify-between gap-4">
                                        <div className="flex items-center gap-3">
                                            <span
                                                className="h-3 w-3 rounded-sm"
                                                style={{ backgroundColor: segment.color }}
                                            ></span>
                                            <div>
                                                <p className="font-medium">{segment.label}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {segment.value} {t('attendance.sessions', 'sessions')}
                                                </p>
                                            </div>
                                        </div>
                                        <p className="text-sm font-semibold">{percentage}%</p>
                                    </div>
                                )
                            })}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="h-5 w-5 text-primary" />
                            {t('studentAttendanceReport.momentumTitle', 'Monthly momentum')}
                        </CardTitle>
                        <CardDescription>
                            {t(
                                'studentAttendanceReport.momentumSubtitle',
                                'Attendance performance across the last six months.'
                            )}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {(stats?.monthly_breakdown || []).length > 0 ? (
                            stats.monthly_breakdown.map(month => (
                                <div key={month.month} className="space-y-2">
                                    <div className="flex items-center justify-between text-sm font-medium">
                                        <span>{month.month_name}</span>
                                        <span>{month.attendance_rate ?? 0}%</span>
                                    </div>
                                    <Progress value={month.attendance_rate || 0} className="h-2" />
                                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                        <span className="text-emerald-600 dark:text-emerald-300">
                                            {t('attendance.present', 'Present')}: {month.present || 0}
                                        </span>
                                        <span className="text-amber-600 dark:text-amber-200">
                                            {t('attendance.late', 'Late')}: {month.late || 0}
                                        </span>
                                        <span className="text-red-600 dark:text-red-300">
                                            {t('attendance.absent', 'Absent')}: {month.absent || 0}
                                        </span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-muted-foreground">
                                {t('studentAttendanceReport.noMonthlyData', 'We need more data to show your monthly trend.')}
                            </p>
                        )}
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 lg:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <BarChart3 className="h-5 w-5 text-primary" />
                            {t('studentAttendanceReport.subjectBreakdownTitle', 'Subject breakdown')}
                        </CardTitle>
                        <CardDescription>
                            {t(
                                'studentAttendanceReport.subjectBreakdownSubtitle',
                                'Where you shine and where you may need to catch up.'
                            )}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {(stats?.subject_breakdown || []).length > 0 ? (
                            stats.subject_breakdown.map(subject => {
                                const subjectAttendance = subject.attendance_rate ?? 0
                                const trendTone = subjectAttendance >= (stats?.attendance_rate || 0)
                                    ? 'text-emerald-600 dark:text-emerald-300'
                                    : 'text-red-600 dark:text-red-300'

                                return (
                                    <div
                                        key={subject.subject_id || subject.subject_name}
                                        className="rounded-lg border bg-muted/30 p-3"
                                    >
                                        <div className="flex items-center justify-between text-sm font-medium">
                                            <span>{subject.subject_name}</span>
                                            <span className={trendTone}>{subjectAttendance}%</span>
                                        </div>
                                        <div className="mt-2 grid gap-2 text-xs text-muted-foreground sm:grid-cols-3">
                                            <span>
                                                {t('attendance.present', 'Present')}: {subject.present || 0}
                                            </span>
                                            <span>
                                                {t('attendance.late', 'Late')}: {subject.late || 0}
                                            </span>
                                            <span>
                                                {t('attendance.absent', 'Absent')}: {subject.absent || 0}
                                            </span>
                                        </div>
                                    </div>
                                )
                            })
                        ) : (
                            <p className="text-sm text-muted-foreground">
                                {t('studentAttendanceReport.noSubjectData', 'Subject-level insights will appear once more attendance is recorded.')}
                            </p>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Clock className="h-5 w-5 text-primary" />
                            {t('studentAttendanceReport.recentActivityTitle', 'Recent activity')}
                        </CardTitle>
                        <CardDescription>
                            {t(
                                'studentAttendanceReport.recentActivitySubtitle',
                                'Your last recorded sessions and their statuses.'
                            )}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {(stats?.recent_history || []).length > 0 ? (
                            stats.recent_history.slice(0, 6).map((record, index) => (
                                <div
                                    key={`${record.date}-${record.subject_name}-${index}`}
                                    className="flex items-center justify-between rounded-lg border bg-muted/30 p-3"
                                >
                                    <div className="flex items-center gap-3">
                                        <Calendar className="h-4 w-4 text-muted-foreground" />
                                        <div>
                                            <p className="text-sm font-medium">{formatDate(record.date)}</p>
                                            <p className="text-xs text-muted-foreground">{record.subject_name}</p>
                                        </div>
                                    </div>
                                    <Badge className={getStatusBadgeTone(record.status)}>
                                        {t(`attendance.${record.status}`, record.status_display)}
                                    </Badge>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-muted-foreground">
                                {t('studentAttendanceReport.noRecentActivity', 'Once you attend sessions, they will appear here.')}
                            </p>
                        )}
                    </CardContent>
                </Card>
            </div>
            {/* Flag Details Dialog */}
            <Dialog open={isFlagDialogOpen} onOpenChange={setIsFlagDialogOpen}>
                <DialogContent className="max-w-md rounded-2xl">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-red-600" />
                            {t('attendance.flagDetails', 'Absence Flag Details')}
                        </DialogTitle>
                        <DialogDescription>
                            {t('attendance.flagDetailsDescription', 'Provide a reason and notes to clear this absence flag.')}
                        </DialogDescription>
                    </DialogHeader>

                    {selectedFlag && (
                        <div className="space-y-5 py-2">
                            {/* Student/Flag Summary */}
                            <div className="p-3 bg-muted/50 rounded-xl border flex items-center gap-3">
                                <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                                    <AlertTriangle size={20} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold truncate">{selectedFlag.subject_name}</p>
                                    <p className="text-xs text-muted-foreground truncate">{formatDate(selectedFlag.attendance_date)}</p>
                                </div>
                            </div>

                            {/* Clearance Form */}
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="clearance-reason" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                        {t('attendance.clearanceReason', 'Clearance Reason')} *
                                    </Label>
                                    <Select value={clearanceReason} onValueChange={setClearanceReason}>
                                        <SelectTrigger id="clearance-reason" className="rounded-xl">
                                            <SelectValue placeholder={t('attendance.selectReason', 'Select a reason')} />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="medical">{t('attendance.medical', 'Medical Reason')}</SelectItem>
                                            <SelectItem value="family">{t('attendance.familyEmergency', 'Family Emergency')}</SelectItem>
                                            <SelectItem value="parent_permission">{t('attendance.parentPermission', 'Parent Permission')}</SelectItem>
                                            <SelectItem value="school_activity">{t('attendance.schoolActivity', 'School Activity')}</SelectItem>
                                            <SelectItem value="other">{t('attendance.other', 'Other')}</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="clearance-notes" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                        {t('attendance.clearanceNotes', 'Clearance Notes')}
                                    </Label>
                                    <Textarea
                                        id="clearance-notes"
                                        value={clearanceNotes}
                                        onChange={(e) => setClearanceNotes(e.target.value)}
                                        placeholder={t('attendance.clearanceNotesPlaceholder', 'Add any additional notes here...')}
                                        className="rounded-xl resize-none"
                                        rows={3}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button variant="ghost" onClick={handleCloseFlagDialog} disabled={isClearing} className="rounded-xl">
                            {t('common.cancel', 'Cancel')}
                        </Button>
                        <Button
                            onClick={handleClearFlag}
                            disabled={isClearing || !clearanceReason}
                            className="rounded-xl bg-red-600 hover:bg-red-700 text-white"
                        >
                            {isClearing ? (
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    {t('attendance.clearing', 'Clearing...')}
                                </div>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="h-4 w-4" />
                                    {t('attendance.clearFlag', 'Clear Flag')}
                                </div>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default StudentAttendanceReportContent
