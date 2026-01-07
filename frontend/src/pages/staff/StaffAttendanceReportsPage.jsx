import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    BarChart3,
    Users,
    Calendar,
    TrendingUp,
    TrendingDown,
    CheckCircle2,
    XCircle,
    Clock,
    AlertTriangle,
    Download,
    Filter,
    Search,
    BookOpen,
    GraduationCap,
    User,
    Award,
    RefreshCw
} from 'lucide-react';
import AdminPageLayout from '../../components/admin/layout/AdminPageLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Progress } from '../../components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '../../components/ui/select';
import { Input } from '../../components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../../components/ui/dialog';
import { Textarea } from '../../components/ui/textarea';
import { Label } from '../../components/ui/label';
import attendanceService from '../../services/attendance';
import { apiMethods } from '../../services/api';
import { toast } from 'sonner';

/**
 * Build parameters for date range filtering
 */
const buildDateRangeParams = (dateRange) => {
    const params = {};

    if (!dateRange || dateRange === 'all_time') {
        return params;
    }

    const toIso = (date) => date.toISOString().split('T')[0];
    const now = new Date();

    if (dateRange === 'today') {
        const today = toIso(now);
        params.start_date = today;
        params.end_date = today;
        return params;
    }

    if (dateRange === 'this_week') {
        const weekStart = new Date(now);
        const day = weekStart.getDay();
        weekStart.setDate(weekStart.getDate() - day);
        params.start_date = toIso(weekStart);
        params.end_date = toIso(now);
        return params;
    }

    if (dateRange === 'this_month') {
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        params.start_date = toIso(monthStart);
        params.end_date = toIso(now);
        return params;
    }

    return params;
};

const normalizeText = (value) => (value ? value.toString().toLowerCase() : '');

const matchById = (value, target) =>
    value !== undefined && value !== null && String(value) === String(target);




const filterStudentsByCriteria = (students = [], filters = {}) => {
    const { gradeId, classId, trackId, search } = filters;
    let filtered = [...students];

    if (gradeId && gradeId !== 'all') {
        filtered = filtered.filter((student) => matchById(student.gradeId, gradeId));
    }

    if (classId && classId !== 'all') {
        filtered = filtered.filter((student) => matchById(student.classId, classId));
    }

    if (trackId && trackId !== 'all') {
        filtered = filtered.filter((student) => matchById(student.trackId, trackId));
    }

    if (search && search.trim()) {
        const query = normalizeText(search.trim());
        filtered = filtered.filter((student) => {
            const tokens = [
                student.name,
                student.arName,
                student.class,
                student.gradeName,
                student.trackName,
            ]
                .filter(Boolean)
                .map(normalizeText);

            return tokens.some((token) => token.includes(query));
        });
    }

    return filtered;
};

const filterClassesByCriteria = (classes = [], filters = {}) => {
    const { gradeId, trackId, search } = filters;
    let filtered = [...classes];

    if (gradeId && gradeId !== 'all') {
        filtered = filtered.filter((cls) => matchById(cls.gradeId, gradeId));
    }

    if (trackId && trackId !== 'all') {
        filtered = filtered.filter((cls) => matchById(cls.trackId, trackId));
    }

    if (search && search.trim()) {
        const query = normalizeText(search.trim());
        filtered = filtered.filter((cls) => {
            const tokens = [cls.name, cls.class_name, cls.gradeName, cls.trackName]
                .filter(Boolean)
                .map(normalizeText);

            return tokens.some((token) => token.includes(query));
        });
    }

    return filtered;
};

const StaffAttendanceReportsPage = () => {
    const { t } = useTranslation();
    const location = useLocation();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState(location.state?.activeTab || 'overview');

    const [overviewLoading, setOverviewLoading] = useState(true);
    const [studentLoading, setStudentLoading] = useState(false);
    const [classLoading, setClassLoading] = useState(false);
    const [flagsLoading, setFlagsLoading] = useState(false);

    const [overviewFilters, setOverviewFilters] = useState({
        dateRange: 'all_time',
        classId: 'all',
        subjectId: 'all',
        teacherId: 'all',
    });

    const [studentFilters, setStudentFilters] = useState({
        dateRange: 'all_time',
        gradeId: 'all',
        classId: 'all',
        trackId: 'all',
        search: '',
    });

    const [classFilters, setClassFilters] = useState({
        dateRange: 'all_time',
        gradeId: 'all',
        trackId: 'all',
        search: '',
    });

    const { dateRange: overviewDateRange, classId: overviewClassId, subjectId: overviewSubjectId, teacherId: overviewTeacherId } = overviewFilters;
    const { dateRange: studentDateRange, gradeId: studentGradeId, classId: studentClassId, trackId: studentTrackId } = studentFilters;
    const { dateRange: classDateRange, gradeId: classGradeId, trackId: classTrackId } = classFilters;

    const [studentStatsCache, setStudentStatsCache] = useState([]);
    const [classStatsCache, setClassStatsCache] = useState([]);
    const [pendingFlags, setPendingFlags] = useState([]);

    // Data
    const [overallStats, setOverallStats] = useState(null);
    const [topAbsentStudents, setTopAbsentStudents] = useState([]);
    const [topLateStudents, setTopLateStudents] = useState([]);
    const [recentSessions, setRecentSessions] = useState([]);

    // Dropdown options
    const [classes, setClasses] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [grades, setGrades] = useState([]);
    const [tracks, setTracks] = useState([]);

    const fetchDropdownData = useCallback(async () => {
        try {
            const [classesRes, subjectsRes, teachersRes, gradesRes, tracksRes] = await Promise.all([
                apiMethods.get('schools/classes/').catch(() => []),
                apiMethods.get('schools/subjects/').catch(() => []),
                apiMethods.get('users/users/', { params: { role: 'TEACHER' } }).catch(() => []),
                apiMethods.get('schools/grades/').catch(() => []),
                apiMethods.get('schools/tracks/').catch(() => []),
            ]);

            const extractData = (response) => {
                if (!response) return [];
                if (Array.isArray(response)) return response;
                if (Array.isArray(response.results)) return response.results;
                if (Array.isArray(response.data)) return response.data;
                if (Array.isArray(response.data?.results)) return response.data.results;
                return [];
            };

            setClasses(extractData(classesRes));
            setSubjects(extractData(subjectsRes));
            setTeachers(extractData(teachersRes));
            setGrades(extractData(gradesRes));
            setTracks(extractData(tracksRes));
        } catch (error) {
            console.error('Failed to fetch dropdown data:', error);
            const errorMessage = t('attendance.failedToLoadFilters', 'Failed to load filter options');
            toast.error(errorMessage);
        }
    }, [t]);



    const fetchOverviewData = useCallback(async () => {
        setOverviewLoading(true);
        try {
            const params = { ...buildDateRangeParams(overviewDateRange) };
            if (overviewClassId !== 'all') params.class_id = overviewClassId;
            if (overviewSubjectId !== 'all') params.subject_id = overviewSubjectId;
            if (overviewTeacherId !== 'all') params.teacher_id = overviewTeacherId;

            const [summaryRes, sessionsRes] = await Promise.all([
                attendanceService.getAttendanceSummary(params).catch(() => null),
                attendanceService.getAttendanceSessions({ ...params, limit: 10 }).catch(() => ({ results: [] })),
            ]);

            if (summaryRes) {
                setOverallStats(summaryRes);
                // Map the summary top students to the format expected by the UI
                setTopAbsentStudents(summaryRes.top_absent_students?.map(s => ({
                    id: s.student_id,
                    name: `${s.student__first_name || ''} ${s.student__last_name || ''}`.trim(),
                    absent_count: s.count
                })) || []);
                setTopLateStudents(summaryRes.top_late_students?.map(s => ({
                    id: s.student_id,
                    name: `${s.student__first_name || ''} ${s.student__last_name || ''}`.trim(),
                    late_count: s.count
                })) || []);
            }

            const sessions = Array.isArray(sessionsRes) ? sessionsRes : sessionsRes?.results || [];
            setRecentSessions(sessions);
        } catch (error) {
            console.error('Failed to fetch overview data:', error);
            toast.error(t('attendance.failedToLoadData'));
        } finally {
            setOverviewLoading(false);
        }
    }, [overviewClassId, overviewDateRange, overviewSubjectId, overviewTeacherId, t]);

    const fetchStudentData = useCallback(async () => {
        setStudentLoading(true);
        try {
            const params = {
                ...buildDateRangeParams(studentDateRange),
                search: studentFilters.search
            };
            if (studentGradeId !== 'all') params.grade_id = studentGradeId;
            if (studentClassId !== 'all') params.class_id = studentClassId;
            if (studentTrackId !== 'all') params.track_id = studentTrackId;

            const response = await attendanceService.getStudentsStatistics(params).catch(() => ({ statistics: [] }));
            const stats = response?.statistics || [];

            // Map backend stats to the format expected by the frontend
            const mappedStats = stats.map(s => ({
                id: s.student_id,
                name: s.student_name,
                arName: s.student_ar_name,
                class: s.class_name,
                className: s.class_name,
                gradeName: s.grade_name,
                trackName: s.track_name,
                total_sessions: s.total_sessions,
                present_count: s.present_count,
                absent_count: s.absent_count,
                late_count: s.late_count,
                excused_count: s.excused_count,
                attendance_percentage: s.attendance_percentage
            }));

            setStudentStatsCache(mappedStats);
        } catch (error) {
            console.error('Failed to fetch student attendance data:', error);
            toast.error(t('attendance.failedToLoadData'));
        } finally {
            setStudentLoading(false);
        }
    }, [studentClassId, studentDateRange, studentGradeId, studentTrackId, studentFilters.search, t]);

    const fetchClassData = useCallback(async () => {
        setClassLoading(true);
        try {
            const params = { ...buildDateRangeParams(classDateRange) };
            if (classGradeId !== 'all') params.grade_id = classGradeId;
            if (classTrackId !== 'all') params.track_id = classTrackId;

            const response = await attendanceService.getClassesStatistics(params).catch(() => ({ statistics: [] }));
            const stats = response?.statistics || [];

            // Map backend stats to the format expected by the frontend
            const mappedStats = stats.map(s => ({
                id: s.class_id,
                name: s.class_name,
                class_name: s.class_name,
                gradeName: s.grade_name,
                total_sessions: s.total_sessions,
                present_count: s.present_count,
                absent_count: s.absent_count,
                late_count: s.late_count,
                excused_count: s.excused_count,
                attendance_percentage: s.attendance_percentage
            }));

            setClassStatsCache(mappedStats);
        } catch (error) {
            console.error('Failed to fetch class attendance data:', error);
            toast.error(t('attendance.failedToLoadData'));
        } finally {
            setClassLoading(false);
        }
    }, [classDateRange, classGradeId, classTrackId, t]);

    const fetchFlagsData = useCallback(async () => {
        setFlagsLoading(true);
        try {
            const flagsRes = await attendanceService.getAbsenceFlags({ is_cleared: false }).catch(() => ({ results: [] }));
            const flags = Array.isArray(flagsRes) ? flagsRes : flagsRes?.results || flagsRes?.pending_flags || [];
            setPendingFlags(flags);
        } catch (error) {
            console.error('Failed to fetch absence flags:', error);
            toast.error(t('attendance.failedToLoadData'));
        } finally {
            setFlagsLoading(false);
        }
    }, [t]);

    useEffect(() => {
        fetchDropdownData();
    }, [fetchDropdownData]);

    useEffect(() => {
        fetchOverviewData();
    }, [fetchOverviewData]);

    useEffect(() => {
        if (activeTab === 'students') {
            fetchStudentData();
        }
    }, [activeTab, fetchStudentData]);

    useEffect(() => {
        if (activeTab === 'classes') {
            fetchClassData();
        }
    }, [activeTab, fetchClassData]);

    useEffect(() => {
        if (activeTab === 'flags') {
            fetchFlagsData();
        }
    }, [activeTab, fetchFlagsData]);

    const filteredStudentStats = useMemo(() => filterStudentsByCriteria(studentStatsCache, studentFilters), [studentStatsCache, studentFilters]);

    const studentHighlights = useMemo(() => {
        const sorted = [...filteredStudentStats].sort((a, b) => {
            if ((b.absent_count || 0) !== (a.absent_count || 0)) return (b.absent_count || 0) - (a.absent_count || 0);
            return (b.late_count || 0) - (a.late_count || 0);
        });
        return sorted.slice(0, 10);
    }, [filteredStudentStats]);

    const sortedClassStats = useMemo(() => {
        const filtered = filterClassesByCriteria(classStatsCache, classFilters);
        return filtered.slice().sort((a, b) => (b.absence_rate || 0) - (a.absence_rate || 0));
    }, [classStatsCache, classFilters]);

    const studentClassOptions = useMemo(() => {
        if (studentFilters.gradeId === 'all') return classes;
        return classes.filter((cls) => matchById(cls.grade_id ?? cls.grade, studentFilters.gradeId));
    }, [classes, studentFilters.gradeId]);

    const studentTrackOptions = useMemo(() => {
        if (studentFilters.gradeId === 'all') return tracks;
        return tracks.filter((track) => matchById(track.grade_id ?? track.grade, studentFilters.gradeId));
    }, [studentFilters.gradeId, tracks]);

    const classTrackOptions = useMemo(() => {
        if (classFilters.gradeId === 'all') return tracks;
        return tracks.filter((track) => matchById(track.grade_id ?? track.grade, classFilters.gradeId));
    }, [classFilters.gradeId, tracks]);

    const currentLoading = useMemo(() => {
        if (activeTab === 'students') return studentLoading;
        if (activeTab === 'classes') return classLoading;
        if (activeTab === 'flags') return flagsLoading;
        return overviewLoading;
    }, [activeTab, classLoading, flagsLoading, overviewLoading, studentLoading]);

    const formatDate = (dateString) => dateString ? new Date(dateString).toLocaleDateString() : '-';

    const handleRefresh = () => {
        if (activeTab === 'students') fetchStudentData();
        else if (activeTab === 'classes') fetchClassData();
        else if (activeTab === 'flags') fetchFlagsData();
        else fetchOverviewData();
        toast.success(t('attendance.dataRefreshed'));
    };

    const handleExport = () => toast.info(t('attendance.exportInProgress'));

    const handleFlagClick = (flag) => {
        if (flag?.student?.id || flag?.student) {
            const studentId = flag.student?.id || flag.student;
            navigate(`/staff/reports/attendance/student/${studentId}`);
        }
    };

    if (overviewLoading && !overallStats) {
        return (
            <AdminPageLayout title={t('attendance.reports')} subtitle={t('attendance.reportsDescription')}>
                <div className="flex items-center justify-center min-h-[400px]">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                        <p className="text-muted-foreground">{t('common.loadingData')}</p>
                    </div>
                </div>
            </AdminPageLayout>
        );
    }

    return (
        <AdminPageLayout
            title={t('attendance.reports')}
            subtitle={t('attendance.reportsDescription')}
            actions={[
                <Button key="refresh" variant="outline" size="sm" onClick={handleRefresh} disabled={currentLoading}>
                    <RefreshCw className={`h-4 w-4 mr-2 ${currentLoading ? 'animate-spin' : ''}`} />
                    {t('common.refresh')}
                </Button>,
                <Button key="export" variant="outline" size="sm" onClick={handleExport}>
                    <Download className="h-4 w-4 mr-2" />
                    {t('common.export')}
                </Button>
            ]}
        >
            <div className="space-y-6">
                {overallStats && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <Card className="bg-green-50 border-green-200">
                            <CardContent className="pt-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-green-600">{t('attendance.presenceRate')}</p>
                                        <p className="text-3xl font-bold text-green-700">{overallStats.presence_rate}%</p>
                                        <p className="text-xs text-green-600 mt-1">{overallStats.present_count} {t('attendance.present')}</p>
                                    </div>
                                    <CheckCircle2 className="h-10 w-10 text-green-600" />
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="bg-red-50 border-red-200">
                            <CardContent className="pt-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-red-600">{t('attendance.absenceRate')}</p>
                                        <p className="text-3xl font-bold text-red-700">{overallStats.absence_rate}%</p>
                                        <p className="text-xs text-red-600 mt-1">{overallStats.absent_count} {t('attendance.absent')}</p>
                                    </div>
                                    <XCircle className="h-10 w-10 text-red-600" />
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="bg-yellow-50 border-yellow-200">
                            <CardContent className="pt-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-yellow-600">{t('attendance.lateRate')}</p>
                                        <p className="text-3xl font-bold text-yellow-700">{overallStats.late_rate}%</p>
                                        <p className="text-xs text-yellow-600 mt-1">{overallStats.late_count} {t('attendance.late')}</p>
                                    </div>
                                    <Clock className="h-10 w-10 text-yellow-600" />
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="bg-blue-50 border-blue-200">
                            <CardContent className="pt-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-blue-600">{t('attendance.totalSessions')}</p>
                                        <p className="text-3xl font-bold text-blue-700">{overallStats.total_sessions}</p>
                                        <p className="text-xs text-blue-600 mt-1">{t('attendance.sessionsRecorded')}</p>
                                    </div>
                                    <Calendar className="h-10 w-10 text-blue-600" />
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="overview">{t('attendance.overview')}</TabsTrigger>
                        <TabsTrigger value="flags" className="flex items-center gap-1">
                            <AlertTriangle className="h-3 w-3" />
                            {t('attendance.flags')}
                        </TabsTrigger>
                        <TabsTrigger value="classes">{t('common.classes')}</TabsTrigger>
                        <TabsTrigger value="students">{t('common.students')}</TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="space-y-6 mt-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Filter className="h-5 w-5" />
                                    {t('common.filters')}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">{t('common.dateRange')}</label>
                                        <Select value={overviewFilters.dateRange} onValueChange={(v) => setOverviewFilters(p => ({ ...p, dateRange: v }))}>
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="today">{t('common.today')}</SelectItem>
                                                <SelectItem value="this_week">{t('common.thisWeek')}</SelectItem>
                                                <SelectItem value="this_month">{t('common.thisMonth')}</SelectItem>
                                                <SelectItem value="all_time">{t('common.allTime')}</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">{t('common.class')}</label>
                                        <Select value={overviewFilters.classId} onValueChange={(v) => setOverviewFilters(p => ({ ...p, classId: v }))}>
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">{t('common.allClasses')}</SelectItem>
                                                {classes.map(cls => <SelectItem key={cls.id} value={cls.id?.toString()}>{cls.name}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">{t('common.subject')}</label>
                                        <Select value={overviewFilters.subjectId} onValueChange={(v) => setOverviewFilters(p => ({ ...p, subjectId: v }))}>
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">{t('common.allSubjects')}</SelectItem>
                                                {subjects.map(s => <SelectItem key={s.id} value={s.id?.toString()}>{s.name}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">{t('common.teacher')}</label>
                                        <Select value={overviewFilters.teacherId} onValueChange={(v) => setOverviewFilters(p => ({ ...p, teacherId: v }))}>
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">{t('common.allTeachers')}</SelectItem>
                                                {teachers.map(t => <SelectItem key={t.id} value={t.id?.toString()}>{t.full_name || `${t.first_name} ${t.last_name}`}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <TrendingDown className="h-5 w-5 text-red-600" />
                                        {t('attendance.topAbsentStudents')}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {topAbsentStudents.length > 0 ? topAbsentStudents.map((s) => (
                                            <div
                                                key={s.id}
                                                className="flex items-center justify-between p-2 rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                                                onClick={() => navigate(`/staff/reports/attendance/student/${s.id}`)}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <Avatar><AvatarImage src={s.avatar} /><AvatarFallback><User className="h-4 w-4" /></AvatarFallback></Avatar>
                                                    <div><p className="font-medium text-sm">{s.name}</p><p className="text-xs text-muted-foreground">{s.class}</p></div>
                                                </div>
                                                <div className="text-right">
                                                    <Badge variant="destructive">{s.absent_count}</Badge>
                                                    <p className="text-[10px] text-muted-foreground mt-0.5">{((s.absent_count / s.total_sessions) * 100).toFixed(0)}%</p>
                                                </div>
                                            </div>
                                        )) : <p className="text-center text-muted-foreground py-4 text-sm">{t('attendance.noData')}</p>}
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Clock className="h-5 w-5 text-yellow-600" />
                                        {t('attendance.topLateStudents')}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {topLateStudents.length > 0 ? topLateStudents.map((s) => (
                                            <div
                                                key={s.id}
                                                className="flex items-center justify-between p-2 rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                                                onClick={() => navigate(`/staff/reports/attendance/student/${s.id}`)}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <Avatar><AvatarImage src={s.avatar} /><AvatarFallback><User className="h-4 w-4" /></AvatarFallback></Avatar>
                                                    <div><p className="font-medium text-sm">{s.name}</p><p className="text-xs text-muted-foreground">{s.class}</p></div>
                                                </div>
                                                <div className="text-right">
                                                    <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">{s.late_count}</Badge>
                                                    <p className="text-[10px] text-muted-foreground mt-0.5">{((s.late_count / s.total_sessions) * 100).toFixed(0)}%</p>
                                                </div>
                                            </div>
                                        )) : <p className="text-center text-muted-foreground py-4 text-sm">{t('attendance.noData')}</p>}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2"><Calendar className="h-5 w-5" />{t('attendance.recentSessions')}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {recentSessions.length > 0 ? recentSessions.map(s => (
                                        <div key={s.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-blue-100 rounded-lg"><BookOpen className="h-4 w-4 text-blue-600" /></div>
                                                <div>
                                                    <p className="font-medium text-sm">{s.subject_name || s.subject?.name}</p>
                                                    <p className="text-[10px] text-muted-foreground">{s.class_name || s.class?.name} • {formatDate(s.session_date)}</p>
                                                </div>
                                            </div>
                                            <Badge variant={s.status === 'completed' ? 'default' : 'secondary'} className="text-[10px]">
                                                {t(`attendance.status.${s.status}`)}
                                            </Badge>
                                        </div>
                                    )) : <p className="text-center text-muted-foreground py-4 text-sm w-full">{t('attendance.noSessions')}</p>}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="flags" className="mt-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <AlertTriangle className="h-5 w-5 text-red-600" />
                                    {t('attendance.studentsWithFlags')}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {flagsLoading ? (
                                    <div className="flex justify-center py-10"><RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" /></div>
                                ) : pendingFlags.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {pendingFlags.map(flag => (
                                            <div key={flag.id} onClick={() => handleFlagClick(flag)} className="p-4 border-2 border-red-200 rounded-lg bg-red-50/50 hover:bg-red-50 transition-colors cursor-pointer space-y-3">
                                                <div className="flex items-start justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <Avatar className="h-10 w-10">
                                                            <AvatarImage src={flag.student?.profile_picture_url} />
                                                            <AvatarFallback><User className="h-5 w-5" /></AvatarFallback>
                                                        </Avatar>
                                                        <div>
                                                            <p className="font-semibold">{flag.student?.full_name}</p>
                                                            <p className="text-xs text-muted-foreground">{flag.class_name}</p>
                                                        </div>
                                                    </div>
                                                    <Badge variant="destructive" className="text-[10px] uppercase">{t('attendance.pending')}</Badge>
                                                </div>
                                                <div className="grid grid-cols-2 gap-y-1 text-xs text-muted-foreground">
                                                    <p><strong>{t('attendance.date')}:</strong> {formatDate(flag.attendance_date)}</p>
                                                    <p><strong>{t('common.subject')}:</strong> {flag.subject_name}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12">
                                        <CheckCircle2 className="h-12 w-12 text-green-600 mx-auto mb-4" />
                                        <h3 className="text-lg font-medium">{t('attendance.noFlags')}</h3>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="classes" className="mt-6 space-y-6">
                        <Card>
                            <CardHeader><CardTitle className="flex items-center gap-2"><Filter className="h-5 w-5" />{t('common.filters')}</CardTitle></CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">{t('common.dateRange')}</label>
                                        <Select value={classFilters.dateRange} onValueChange={(v) => setClassFilters(p => ({ ...p, dateRange: v }))}>
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="today">{t('common.today')}</SelectItem>
                                                <SelectItem value="this_week">{t('common.thisWeek')}</SelectItem>
                                                <SelectItem value="this_month">{t('common.thisMonth')}</SelectItem>
                                                <SelectItem value="all_time">{t('common.allTime')}</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">{t('common.grade')}</label>
                                        <Select value={classFilters.gradeId} onValueChange={(v) => setClassFilters(p => ({ ...p, gradeId: v, trackId: 'all' }))}>
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">{t('common.allGrades')}</SelectItem>
                                                {grades.map(g => <SelectItem key={g.id} value={g.id?.toString()}>{g.name}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">{t('classes.track')}</label>
                                        <Select value={classFilters.trackId} onValueChange={(v) => setClassFilters(p => ({ ...p, trackId: v }))}>
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">{t('classes.allTracks')}</SelectItem>
                                                {classTrackOptions.map(t => <SelectItem key={t.id} value={t.id?.toString()}>{t.name}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">{t('common.search')}</label>
                                        <div className="relative">
                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            <Input value={classFilters.search} onChange={(e) => setClassFilters(p => ({ ...p, search: e.target.value }))} placeholder={t('classes.searchPlaceholder')} className="pl-9" />
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="pt-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                                    {classLoading ? (
                                        <div className="col-span-full flex justify-center py-10"><RefreshCw className="h-6 w-6 animate-spin" /></div>
                                    ) : sortedClassStats.length > 0 ? sortedClassStats.map(cls => (
                                        <div key={cls.id} className="p-4 border rounded-xl space-y-4">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <GraduationCap className="h-5 w-5 text-blue-600" />
                                                    <h4 className="font-semibold">{cls.name || cls.class_name}</h4>
                                                </div>
                                                <Badge variant="outline" className="bg-blue-50 text-blue-700">{cls.presence_rate}%</Badge>
                                            </div>
                                            <div className="space-y-2">
                                                <div className="flex justify-between text-xs"><span>{t('attendance.presence')}</span><span>{cls.presence_rate}%</span></div>
                                                <Progress value={cls.presence_rate} className="h-1.5" />
                                                <div className="flex justify-between text-xs pt-1"><span>{t('attendance.absence')}</span><span className="text-red-600">{cls.absence_rate}%</span></div>
                                                <Progress value={cls.absence_rate} className="h-1.5" indicatorClassName="bg-red-500" />
                                            </div>
                                        </div>
                                    )) : <p className="col-span-full text-center text-muted-foreground py-8">{t('attendance.noData')}</p>}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="students" className="mt-6 space-y-6">
                        <Card>
                            <CardHeader><CardTitle className="flex items-center gap-2"><Filter className="h-5 w-5" />{t('common.filters')}</CardTitle></CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">{t('common.dateRange')}</label>
                                        <Select value={studentFilters.dateRange} onValueChange={(v) => setStudentFilters(p => ({ ...p, dateRange: v }))}>
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="today">{t('common.today')}</SelectItem>
                                                <SelectItem value="this_week">{t('common.thisWeek')}</SelectItem>
                                                <SelectItem value="this_month">{t('common.thisMonth')}</SelectItem>
                                                <SelectItem value="all_time">{t('common.allTime')}</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">{t('common.grade')}</label>
                                        <Select value={studentFilters.gradeId} onValueChange={(v) => setStudentFilters(p => ({ ...p, gradeId: v, classId: 'all', trackId: 'all' }))}>
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">{t('common.allGrades')}</SelectItem>
                                                {grades.map(g => <SelectItem key={g.id} value={g.id?.toString()}>{g.name}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">{t('common.class')}</label>
                                        <Select value={studentFilters.classId} onValueChange={(v) => setStudentFilters(p => ({ ...p, classId: v }))}>
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">{t('common.allClasses')}</SelectItem>
                                                {studentClassOptions.map(cls => <SelectItem key={cls.id} value={cls.id?.toString()}>{cls.name}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">{t('classes.track')}</label>
                                        <Select value={studentFilters.trackId} onValueChange={(v) => setStudentFilters(p => ({ ...p, trackId: v }))}>
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">{t('classes.allTracks')}</SelectItem>
                                                {studentTrackOptions.map(t => <SelectItem key={t.id} value={t.id?.toString()}>{t.name}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">{t('common.search')}</label>
                                        <div className="relative">
                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            <Input value={studentFilters.search} onChange={(e) => setStudentFilters(p => ({ ...p, search: e.target.value }))} placeholder={t('attendance.searchStudent')} className="pl-9" />
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="pt-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {studentLoading ? (
                                        <div className="col-span-full flex justify-center py-10"><RefreshCw className="h-6 w-6 animate-spin" /></div>
                                    ) : studentHighlights.length > 0 ? studentHighlights.map((s) => {
                                        const rate = s.total_sessions > 0 ? ((s.present_count + s.late_count) / s.total_sessions) * 100 : 0;
                                        return (
                                            <div
                                                key={s.id}
                                                className="p-4 border rounded-xl space-y-3 cursor-pointer hover:bg-muted/50 transition-colors"
                                                onClick={() => navigate(`/staff/reports/attendance/student/${s.id}`)}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <Avatar className="h-10 w-10"><AvatarImage src={s.avatar} /><AvatarFallback><User className="h-5 w-5" /></AvatarFallback></Avatar>
                                                        <div><p className="font-semibold text-sm">{s.name}</p><p className="text-[10px] text-muted-foreground">{s.class}</p></div>
                                                    </div>
                                                    <div className="flex gap-1.5">
                                                        <Badge variant="outline" className="text-[10px] bg-green-50 text-green-700">{s.present_count} P</Badge>
                                                        <Badge variant="outline" className="text-[10px] bg-red-50 text-red-700">{s.absent_count} A</Badge>
                                                    </div>
                                                </div>
                                                <div className="space-y-1.5">
                                                    <div className="flex justify-between text-[11px]"><span>{t('attendance.rate')}</span><span>{rate.toFixed(1)}%</span></div>
                                                    <Progress value={rate} className="h-1.5" />
                                                </div>
                                            </div>
                                        );
                                    }) : <p className="col-span-full text-center text-muted-foreground py-8">{t('attendance.noData')}</p>}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>

        </AdminPageLayout>
    );
};

export default StaffAttendanceReportsPage;
