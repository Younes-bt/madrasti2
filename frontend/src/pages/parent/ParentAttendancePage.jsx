import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
    UserCheck,
    AlertTriangle,
    Clock,
    History,
    FileText,
    TrendingUp,
    Sparkles,
    Calendar,
    X
} from 'lucide-react';
import { format } from 'date-fns';
import { DashboardLayout } from '../../components/layout/Layout';
import { useAuth } from '../../hooks/useAuth';
import usersService from '../../services/users';
import attendanceService from '../../services/attendance';
import {
    Tabs,
    TabsList,
    TabsTrigger,
    TabsContent
} from '../../components/ui/tabs';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription
} from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Progress } from '../../components/ui/progress';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '../../components/ui/table';
import { Input } from '../../components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '../../components/ui/select';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const ParentAttendancePage = () => {
    const { t } = useTranslation();
    const { user } = useAuth();

    const [children, setChildren] = useState([]);
    const [selectedChildId, setSelectedChildId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState(null);
    const [history, setHistory] = useState([]);
    const [flags, setFlags] = useState([]);
    const [subjects, setSubjects] = useState([]);

    // Filters
    const [subjectFilter, setSubjectFilter] = useState('all');
    const [dateFilter, setDateFilter] = useState('');
    const [activeTab, setActiveTab] = useState('overview');

    useEffect(() => {
        const fetchChildren = async () => {
            try {
                setLoading(true);
                const response = await usersService.getUserChildren(user.id);
                const childrenList = response.children || [];
                setChildren(childrenList);

                if (childrenList.length > 0) {
                    setSelectedChildId(childrenList[0].id.toString());
                }
            } catch (error) {
                console.error('Failed to fetch children:', error);
            } finally {
                setLoading(false);
            }
        };

        if (user?.id) {
            fetchChildren();
        }
    }, [user?.id]);

    useEffect(() => {
        const fetchChildData = async () => {
            if (!selectedChildId) return;

            try {
                setLoading(true);
                const [statsData, flagsData, historyData] = await Promise.all([
                    attendanceService.getStudentStatistics(selectedChildId),
                    attendanceService.getAbsenceFlags({ student_id: selectedChildId, is_cleared: false }),
                    attendanceService.getStudentHistory({
                        student_id: selectedChildId,
                        subject_id: subjectFilter !== 'all' ? subjectFilter : undefined,
                        start_date: dateFilter || undefined
                    })
                ]);

                console.log('Stats:', statsData);
                console.log('Flags:', flagsData);
                console.log('History:', historyData);

                // Transform backend stats to match frontend expectations or use backend names
                setStats(statsData);

                // Handle both paginated and non-paginated responses, plus backend-specific keys
                setFlags(flagsData.results || flagsData.pending_flags || (Array.isArray(flagsData) ? flagsData : []));
                setHistory(historyData.results || historyData.history || (Array.isArray(historyData) ? historyData : []));

                // Extract unique subjects from history for filtering
                const records = historyData.results || historyData.history || (Array.isArray(historyData) ? historyData : []);
                if (records.length > 0) {
                    const uniqueSubjects = [];
                    const seenIds = new Set();

                    records.forEach(record => {
                        // Check different possible paths for subject in history
                        const subject = record.attendance_session?.timetable_session?.subject || record.subject;
                        if (subject && subject.id && !seenIds.has(subject.id)) {
                            seenIds.add(subject.id);
                            uniqueSubjects.push(subject);
                        }
                    });
                    setSubjects(uniqueSubjects);
                }
            } catch (error) {
                console.error('Failed to fetch child attendance data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchChildData();
    }, [selectedChildId, subjectFilter, dateFilter]);

    const selectedChild = useMemo(() =>
        children.find(c => c.id.toString() === selectedChildId),
        [children, selectedChildId]);

    const getStatusBadge = (status) => {
        const variants = {
            present: "bg-emerald-100 text-emerald-700 border-emerald-200",
            absent: "bg-rose-100 text-rose-700 border-rose-200",
            late: "bg-amber-100 text-amber-700 border-amber-200",
            excused: "bg-sky-100 text-sky-700 border-sky-200"
        };

        return (
            <Badge variant="outline" className={cn("px-2 py-0.5 font-medium", variants[status] || "bg-gray-100 text-gray-700")}>
                {t(`parentAttendance.status.${status}`, status.charAt(0).toUpperCase() + status.slice(1))}
            </Badge>
        );
    };

    if (loading && children.length === 0) {
        return (
            <DashboardLayout user={user}>
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout user={user}>
            <div className="mx-auto max-w-7xl px-2 py-6 md:p-8 space-y-8 min-h-screen bg-slate-50/50">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
                            {t('parentAttendance.title', { name: selectedChild?.full_name || '' })}
                        </h1>
                        <p className="text-slate-500 font-medium max-w-2xl">
                            {t('parentAttendance.subtitle')}
                        </p>
                    </div>

                    {children.length > 1 && (
                        <div className="bg-white p-1 rounded-xl shadow-sm border border-slate-200 inline-flex">
                            <Tabs value={selectedChildId} onValueChange={setSelectedChildId} className="w-full">
                                <TabsList className="bg-transparent h-auto p-0 gap-1">
                                    {children.map((child) => (
                                        <TabsTrigger
                                            key={child.id}
                                            value={child.id.toString()}
                                            className="data-[state=active]:bg-primary data-[state=active]:text-white rounded-lg px-4 py-2 transition-all"
                                        >
                                            {child.first_name}
                                        </TabsTrigger>
                                    ))}
                                </TabsList>
                            </Tabs>
                        </div>
                    )}
                </div>

                <AnimatePresence mode="wait">
                    {selectedChildId && (
                        <motion.div
                            key={selectedChildId}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="space-y-8"
                        >
                            {/* Stats Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                <Card className="border-none shadow-sm bg-gradient-to-br from-indigo-500 to-indigo-600 text-white overflow-hidden relative">
                                    <div className="absolute top-0 right-0 p-4 opacity-10">
                                        <TrendingUp className="w-16 h-16" />
                                    </div>
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-sm font-medium text-indigo-100 flex items-center gap-2">
                                            <UserCheck className="w-4 h-4" />
                                            {t('parentAttendance.attendanceRate')}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-3xl font-bold">{stats?.attendance_rate || 0}%</div>
                                        <Progress value={stats?.attendance_rate || 0} className="h-1.5 mt-2 bg-indigo-400/30" indicatorClassName="bg-white" />
                                    </CardContent>
                                </Card>

                                <Card className="border-none shadow-sm bg-white overflow-hidden group">
                                    <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                                        <CardTitle className="text-sm font-medium text-slate-500">
                                            {t('parentAttendance.absentSessions')}
                                        </CardTitle>
                                        <div className="p-2 rounded-lg bg-rose-50 text-rose-600 group-hover:bg-rose-600 group-hover:text-white transition-colors">
                                            <AlertTriangle className="w-4 h-4" />
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-3xl font-bold text-slate-900">{stats?.absent_count || 0}</div>
                                        <p className="text-xs text-rose-500 font-medium mt-1">
                                            {stats?.consecutive_absences > 0 ? `${stats.consecutive_absences} ${t('parentAttendance.consecutiveAbsences')}` : t('parentAttendance.lastAbsence') + ': ' + (stats?.last_absence_date ? format(new Date(stats.last_absence_date), 'MMM dd') : 'N/A')}
                                        </p>
                                    </CardContent>
                                </Card>

                                <Card className="border-none shadow-sm bg-white overflow-hidden group">
                                    <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                                        <CardTitle className="text-sm font-medium text-slate-500">
                                            {t('parentAttendance.lateSessions')}
                                        </CardTitle>
                                        <div className="p-2 rounded-lg bg-amber-50 text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                                            <Clock className="w-4 h-4" />
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-3xl font-bold text-slate-900">{stats?.late_count || 0}</div>
                                        <p className="text-xs text-slate-500 font-medium mt-1">
                                            {t('parentAttendance.punctualityRate')}: {stats?.punctuality_rate || 0}%
                                        </p>
                                    </CardContent>
                                </Card>

                                <Card className="border-none shadow-sm bg-white overflow-hidden group">
                                    <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                                        <CardTitle className="text-sm font-medium text-slate-500">
                                            {t('parentAttendance.totalSessions')}
                                        </CardTitle>
                                        <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                            <FileText className="w-4 h-4" />
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-3xl font-bold text-slate-900">{stats?.total_sessions || 0}</div>
                                        <p className="text-xs text-slate-500 font-medium mt-1">
                                            {t('parentAttendance.excusedSessions')}: {stats?.excused_count || 0}
                                        </p>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Vertical Stacked Content */}
                            <div className="flex flex-col gap-8">
                                {/* Top Section: Key Metrics (remains as grid for cards) */}
                                {/* Metrics grid already defined above, but let's make sure it's consistent if moved */}

                                {/* 1. Subject Breakdown - Now Full Width */}
                                <Card className="border-none shadow-sm overflow-hidden">
                                    <CardHeader className="bg-white border-b border-slate-100 flex flex-row items-center justify-between">
                                        <CardTitle className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                                            <Sparkles className="w-5 h-5 text-indigo-500" />
                                            {t('parentAttendance.statsBySubject')}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {stats?.subject_breakdown?.map((item, idx) => (
                                                <div key={idx} className="p-4 rounded-xl border border-slate-100 hover:border-indigo-100 hover:bg-indigo-50/30 transition-all group">
                                                    <div className="flex justify-between items-center mb-3">
                                                        <span className="font-semibold text-slate-700 group-hover:text-indigo-700 transition-colors">{item.subject_name}</span>
                                                        <span className="text-lg font-bold text-slate-900">{item.attendance_rate}%</span>
                                                    </div>
                                                    <Progress value={item.attendance_rate} className="h-2" indicatorClassName={cn(
                                                        item.attendance_rate > 90 ? "bg-emerald-500" : item.attendance_rate > 75 ? "bg-amber-500" : "bg-rose-500"
                                                    )} />
                                                    <div className="flex gap-4 mt-3">
                                                        <div className="flex items-center gap-1.5">
                                                            <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
                                                            <span className="text-xs text-slate-500 font-medium">
                                                                {t('parentAttendance.sessions')}: {item.total}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-1.5">
                                                            <div className="w-1.5 h-1.5 rounded-full bg-rose-400"></div>
                                                            <span className="text-xs text-rose-500 font-medium">
                                                                {t('parentAttendance.absentSessions')}: {item.absent}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* 2. Flags & History - Now Full Width */}
                                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                                    <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
                                        <TabsList className="bg-slate-100/80 backdrop-blur-sm p-1.5 rounded-2xl border-none h-auto w-full sm:w-auto grid grid-cols-2 sm:flex gap-1.5 shadow-inner">
                                            <TabsTrigger
                                                value="overview"
                                                className="gap-2 px-8 py-3 rounded-xl text-sm font-semibold transition-all data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-md data-[state=active]:scale-[1.02] border-none"
                                            >
                                                <History className="w-4 h-4" />
                                                {t('parentAttendance.history')}
                                            </TabsTrigger>
                                            <TabsTrigger
                                                value="flags"
                                                className="gap-2 px-8 py-3 rounded-xl text-sm font-semibold transition-all data-[state=active]:bg-white data-[state=active]:text-indigo-600 data-[state=active]:shadow-md data-[state=active]:scale-[1.02] relative border-none"
                                            >
                                                <AlertTriangle className="w-4 h-4" />
                                                {t('parentAttendance.flags')}
                                                {flags.length > 0 && (
                                                    <span className="absolute -top-1 -right-1 flex h-4 w-4">
                                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                                                        <span className="relative inline-flex rounded-full h-4 w-4 bg-rose-500 text-[10px] text-white items-center justify-center font-bold">
                                                            {flags.length}
                                                        </span>
                                                    </span>
                                                )}
                                            </TabsTrigger>
                                        </TabsList>

                                        <div className="flex items-center gap-3">
                                            {activeTab === 'overview' && (
                                                <>
                                                    <Select value={subjectFilter} onValueChange={setSubjectFilter}>
                                                        <SelectTrigger className="w-[180px] bg-white h-11 border-slate-200 rounded-xl shadow-sm">
                                                            <SelectValue placeholder={t('parentAttendance.filterBySubject')} />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="all">{t('common.allSubjects')}</SelectItem>
                                                            {subjects.map(subject => (
                                                                <SelectItem key={subject.id} value={subject.id.toString()}>
                                                                    {subject.name}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    <div className="relative">
                                                        <Input
                                                            type="date"
                                                            value={dateFilter}
                                                            onChange={(e) => setDateFilter(e.target.value)}
                                                            className="w-[180px] bg-white h-11 border-slate-200 rounded-xl shadow-sm pl-10"
                                                        />
                                                        <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                                                    </div>
                                                    {(subjectFilter !== 'all' || dateFilter) && (
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => { setSubjectFilter('all'); setDateFilter(''); }}
                                                            className="h-11 w-11 rounded-xl hover:bg-rose-50 hover:text-rose-600 transition-colors"
                                                        >
                                                            <X className="w-4 h-4" />
                                                        </Button>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    <TabsContent value="overview" className="mt-0">
                                        <Card className="border-none shadow-sm overflow-hidden">
                                            <div className="overflow-x-auto">
                                                <Table>
                                                    <TableHeader className="bg-slate-50/50">
                                                        <TableRow>
                                                            <TableHead className="w-[180px] pl-6 font-semibold text-slate-700">{t('common.date')}</TableHead>
                                                            <TableHead className="font-semibold text-slate-700">{t('common.subject')}</TableHead>
                                                            <TableHead className="font-semibold text-slate-700">{t('common.teacher')}</TableHead>
                                                            <TableHead className="text-right pr-6 font-semibold text-slate-700">{t('common.status')}</TableHead>
                                                        </TableRow>
                                                    </TableHeader>
                                                    <TableBody>
                                                        {history.length > 0 ? (
                                                            history.map((record, index) => (
                                                                <TableRow key={record.id || index} className="hover:bg-indigo-50/20 transition-colors group">
                                                                    <TableCell className="font-medium text-slate-900 pl-6 py-4">
                                                                        <div className="flex flex-col">
                                                                            <span>{record.date ? format(new Date(record.date), 'EEE, MMM dd, yyyy') : 'N/A'}</span>
                                                                            <span className="text-xs text-indigo-500 font-medium mt-0.5">
                                                                                {record.attendance_session?.start_time?.slice(0, 5) || record.start_time?.slice(0, 5) || ''}
                                                                            </span>
                                                                        </div>
                                                                    </TableCell>
                                                                    <TableCell>
                                                                        <div className="font-semibold text-slate-700 group-hover:text-indigo-700 transition-colors">
                                                                            {record.subject_name || record.attendance_session?.timetable_session?.subject?.name}
                                                                        </div>
                                                                    </TableCell>
                                                                    <TableCell className="text-slate-500 italic">
                                                                        {record.teacher_name || record.marked_by_name || record.attendance_session?.teacher_name}
                                                                    </TableCell>
                                                                    <TableCell className="text-right pr-6">
                                                                        {getStatusBadge(record.status)}
                                                                    </TableCell>
                                                                </TableRow>
                                                            ))
                                                        ) : (
                                                            <TableRow>
                                                                <TableCell colSpan={4} className="h-64 text-center">
                                                                    <div className="flex flex-col items-center justify-center gap-4 text-slate-400">
                                                                        <div className="p-4 rounded-full bg-slate-50">
                                                                            <History className="w-10 h-10 opacity-20" />
                                                                        </div>
                                                                        <p className="font-medium">{t('parentAttendance.noHistory')}</p>
                                                                    </div>
                                                                </TableCell>
                                                            </TableRow>
                                                        )}
                                                    </TableBody>
                                                </Table>
                                            </div>
                                        </Card>
                                    </TabsContent>

                                    <TabsContent value="flags" className="mt-0">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {flags.length > 0 ? (
                                                flags.map((flag) => (
                                                    <Card key={flag.id} className="border-none shadow-sm hover:shadow-md transition-all group overflow-hidden">
                                                        <CardContent className="p-0">
                                                            <div className="flex h-full">
                                                                <div className={cn(
                                                                    "w-2 shrink-0 transition-colors",
                                                                    flag.flag_type === 'absent' ? "bg-rose-500" : "bg-amber-500"
                                                                )} />
                                                                <div className="p-6 flex-1 flex flex-col justify-between">
                                                                    <div className="flex items-start justify-between gap-4 mb-4">
                                                                        <div className="space-y-1">
                                                                            <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2 group-hover:text-indigo-700 transition-colors">
                                                                                {flag.flag_type === 'absent' ? t('parentAttendance.status.absent') : t('parentAttendance.status.late')}
                                                                                {flag.attendance_record?.attendance_session?.timetable_session?.subject?.name && (
                                                                                    <span className="text-slate-400 font-normal text-sm">/ {flag.attendance_record.attendance_session.timetable_session.subject.name}</span>
                                                                                )}
                                                                            </h3>
                                                                            <div className="flex items-center gap-2 text-slate-500 text-sm">
                                                                                <Calendar className="w-3.5 h-3.5" />
                                                                                {flag.attendance_date ? format(new Date(flag.attendance_date), 'PPPP') : 'N/A'}
                                                                            </div>
                                                                        </div>
                                                                        <Badge className={cn(
                                                                            "px-3 py-1 rounded-full text-[10px] uppercase tracking-wider font-bold border-none",
                                                                            flag.is_cleared ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"
                                                                        )}>
                                                                            {flag.is_cleared ? t('common.resolved') : t('common.pending')}
                                                                        </Badge>
                                                                    </div>

                                                                    {flag.notes && (
                                                                        <div className="bg-slate-50 p-4 rounded-xl border-l-2 border-slate-200 mt-2">
                                                                            <p className="text-sm text-slate-600 italic leading-relaxed">
                                                                                "{flag.notes}"
                                                                            </p>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </CardContent>
                                                    </Card>
                                                ))
                                            ) : (
                                                <Card className="border-none shadow-sm md:col-span-2 h-64 flex items-center justify-center text-slate-500 bg-white">
                                                    <div className="flex flex-col items-center gap-4">
                                                        <div className="p-4 rounded-full bg-emerald-50 text-emerald-500">
                                                            <UserCheck className="w-10 h-10 opacity-70" />
                                                        </div>
                                                        <p className="font-medium">{t('parentAttendance.noFlags')}</p>
                                                    </div>
                                                </Card>
                                            )}
                                        </div>
                                    </TabsContent>
                                </Tabs>

                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </DashboardLayout>
    );
};

export default ParentAttendancePage;
