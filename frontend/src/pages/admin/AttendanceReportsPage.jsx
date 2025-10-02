import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
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
import attendanceService from '../../services/attendance';
import { apiMethods } from '../../services/api';
import { toast } from 'sonner';
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

const pickTop = (items = [], key, limit = 5) =>
  items
    .slice()
    .sort((a, b) => (b?.[key] || 0) - (a?.[key] || 0))
    .slice(0, limit);

const aggregateStudentStats = (records = []) => {
  const studentMap = {};

  records.forEach((record) => {
    const studentId = record.student_id || record.student?.id;
    if (!studentId) return;

    const student = record.student || {};
    const classId = record.class_id || record.session?.class_id;
    const className =
      record.class_name ||
      record.session?.class_name ||
      student.class_name ||
      'Unknown';
    const gradeId = record.grade_id;
    const gradeName = record.grade_name;
    const trackId = record.track_id;
    const trackName = record.track_name;

    if (!studentMap[studentId]) {
      const fallbackName = `${student.first_name || ''} ${student.last_name || ''}`.trim();
      studentMap[studentId] = {
        id: studentId,
        name: student.full_name || record.student_name || fallbackName || 'Unknown',
        arName:
          student.ar_first_name && student.ar_last_name
            ? `${student.ar_first_name} ${student.ar_last_name}`
            : null,
        avatar: student.profile_picture_url,
        classId,
        class: className,
        className,
        gradeId,
        gradeName,
        trackId,
        trackName,
        absent_count: 0,
        late_count: 0,
        present_count: 0,
        excused_count: 0,
        total_sessions: 0,
      };
    }

    const stats = studentMap[studentId];
    stats.total_sessions += 1;

    switch (record.status) {
      case 'absent':
        stats.absent_count += 1;
        break;
      case 'late':
        stats.late_count += 1;
        break;
      case 'present':
        stats.present_count += 1;
        break;
      case 'excused':
        stats.excused_count += 1;
        break;
      default:
        break;
    }
  });

  return Object.values(studentMap);
};

const aggregateTeacherStats = (records = []) => {
  const teacherMap = {};

  records.forEach((record) => {
    const teacherId =
      record.teacher_id ||
      record.session?.teacher_id ||
      record.attendance_session?.teacher_id;
    if (!teacherId) return;

    if (!teacherMap[teacherId]) {
      teacherMap[teacherId] = {
        id: teacherId,
        name:
          record.teacher_name ||
          record.session?.teacher_name ||
          record.attendance_session?.teacher_name ||
          'Unknown',
        absent_count: 0,
        late_count: 0,
        total_records: 0,
      };
    }

    const stats = teacherMap[teacherId];
    stats.total_records += 1;
    if (record.status === 'absent') stats.absent_count += 1;
    if (record.status === 'late') stats.late_count += 1;
  });

  return Object.values(teacherMap).map((teacher) => ({
    ...teacher,
    absence_rate:
      teacher.total_records > 0
        ? Math.round((teacher.absent_count / teacher.total_records) * 100)
        : 0,
    late_rate:
      teacher.total_records > 0
        ? Math.round((teacher.late_count / teacher.total_records) * 100)
        : 0,
  }));
};

const aggregateSubjectStats = (records = []) => {
  const subjectMap = {};

  records.forEach((record) => {
    const subjectId =
      record.subject_id ||
      record.session?.subject_id ||
      record.attendance_session?.subject_id;
    const subjectName =
      record.subject_name || record.session?.subject_name || 'Unknown';
    if (!subjectName) return;

    const key = subjectId || subjectName;

    if (!subjectMap[key]) {
      subjectMap[key] = {
        id: subjectId || subjectName,
        name: subjectName,
        absent_count: 0,
        present_count: 0,
        late_count: 0,
        total_records: 0,
      };
    }

    const stats = subjectMap[key];
    stats.total_records += 1;
    if (record.status === 'absent') stats.absent_count += 1;
    if (record.status === 'present') stats.present_count += 1;
    if (record.status === 'late') stats.late_count += 1;
  });

  return Object.values(subjectMap)
    .map((subject) => {
      const absenceRate =
        subject.total_records > 0
          ? Number(((subject.absent_count / subject.total_records) * 100).toFixed(1))
          : 0;

      return {
        id: subject.id,
        name: subject.name,
        absent_count: subject.absent_count,
        late_count: subject.late_count,
        total_records: subject.total_records,
        absence_rate: absenceRate,
      };
    })
    .sort((a, b) => b.absence_rate - a.absence_rate);
};

const aggregateClassStats = (records = []) => {
  const classMap = {};

  records.forEach((record) => {
    const classId = record.class_id || record.session?.class_id;
    if (!classId) return;

    if (!classMap[classId]) {
      const className =
        record.class_name || record.session?.class_name || 'Unknown';

      classMap[classId] = {
        id: classId,
        name: className,
        class_name: className,
        gradeId: record.grade_id,
        gradeName: record.grade_name,
        trackId: record.track_id,
        trackName: record.track_name,
        total_students: 0,
        present_count: 0,
        absent_count: 0,
        late_count: 0,
        total_records: 0,
      };
    }

    const stats = classMap[classId];
    stats.total_records += 1;
    if (record.status === 'present') stats.present_count += 1;
    if (record.status === 'absent') stats.absent_count += 1;
    if (record.status === 'late') stats.late_count += 1;
  });

  return Object.values(classMap).map((cls) => {
    const presenceRate =
      cls.total_records > 0
        ? Math.round((cls.present_count / cls.total_records) * 100)
        : 0;
    const absenceRate =
      cls.total_records > 0
        ? Math.round((cls.absent_count / cls.total_records) * 100)
        : 0;
    const lateRate =
      cls.total_records > 0
        ? Math.round((cls.late_count / cls.total_records) * 100)
        : 0;

    return {
      ...cls,
      presence_rate: presenceRate,
      absence_rate: absenceRate,
      late_rate: lateRate,
      total_students: Math.max(cls.total_records, cls.total_students || 0),
    };
  });
};

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

const AttendanceReportsPage = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('overview');

  const [overviewLoading, setOverviewLoading] = useState(true);
  const [studentLoading, setStudentLoading] = useState(false);
  const [classLoading, setClassLoading] = useState(false);

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

  // Data
  const [overallStats, setOverallStats] = useState(null);
  const [topAbsentStudents, setTopAbsentStudents] = useState([]);
  const [topLateStudents, setTopLateStudents] = useState([]);
  const [teacherStats, setTeacherStats] = useState([]);
  const [subjectStats, setSubjectStats] = useState([]);
  const [recentSessions, setRecentSessions] = useState([]);

  // Dropdown options
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [grades, setGrades] = useState([]);
  const [tracks, setTracks] = useState([]);

  useEffect(() => {
    fetchDropdownData();
  }, []);

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

  const fetchDropdownData = async () => {
    try {
      const [classesRes, subjectsRes, teachersRes, gradesRes, tracksRes] = await Promise.all([
        apiMethods.get('schools/classes/').catch((err) => {
          console.error('Classes fetch error:', err);
          return [];
        }),
        apiMethods.get('schools/subjects/').catch((err) => {
          console.error('Subjects fetch error:', err);
          return [];
        }),
        apiMethods.get('users/users/', { params: { role: 'TEACHER' } }).catch((err) => {
          console.error('Teachers fetch error:', err);
          return [];
        }),
        apiMethods.get('schools/grades/').catch((err) => {
          console.error('Grades fetch error:', err);
          return [];
        }),
        apiMethods.get('schools/tracks/').catch((err) => {
          console.error('Tracks fetch error:', err);
          return [];
        }),
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
      toast.error(t('attendance.failedToLoadFilters', 'Failed to load filter options'));
    }
  };

  const calculateOverallStatsFromRecords = (records = []) => {
    const stats = {
      total_sessions: 0,
      total_records: records.length,
      presence_rate: 0,
      absence_rate: 0,
      late_rate: 0,
      excused_rate: 0,
      present_count: 0,
      absent_count: 0,
      late_count: 0,
      excused_count: 0,
    };

    records.forEach((record) => {
      switch (record.status) {
        case 'present':
          stats.present_count += 1;
          break;
        case 'absent':
          stats.absent_count += 1;
          break;
        case 'late':
          stats.late_count += 1;
          break;
        case 'excused':
          stats.excused_count += 1;
          break;
        default:
          break;
      }
    });

    const total = stats.total_records || 0;
    if (total > 0) {
      stats.presence_rate = Math.round((stats.present_count / total) * 100);
      stats.absence_rate = Math.round((stats.absent_count / total) * 100);
      stats.late_rate = Math.round((stats.late_count / total) * 100);
      stats.excused_rate = Math.round((stats.excused_count / total) * 100);
    }

    const uniqueSessions = new Set(
      records
        .map((record) =>
          record.session_id ||
          record.attendance_session?.id ||
          record.attendance_session_id
        )
        .filter(Boolean)
    );
    stats.total_sessions = uniqueSessions.size;

    return stats;
  };

  const fetchOverviewData = useCallback(async () => {
    setOverviewLoading(true);
    try {
      const params = {
        ...buildDateRangeParams(overviewDateRange),
      };

      if (overviewClassId !== 'all') params.class_id = overviewClassId;
      if (overviewSubjectId !== 'all') params.subject_id = overviewSubjectId;
      if (overviewTeacherId !== 'all') params.teacher_id = overviewTeacherId;

      const [recordsRes, sessionsRes] = await Promise.all([
        attendanceService.getAttendanceRecords(params).catch((err) => {
          console.error('Records fetch error:', err);
          return { results: [] };
        }),
        attendanceService.getAttendanceSessions({ ...params, limit: 10 }).catch((err) => {
          console.error('Sessions fetch error:', err);
          return { results: [] };
        }),
      ]);

      const records = Array.isArray(recordsRes) ? recordsRes : recordsRes?.results || [];

      const studentsAggregated = aggregateStudentStats(records);
      setTopAbsentStudents(pickTop(studentsAggregated, 'absent_count'));
      setTopLateStudents(pickTop(studentsAggregated, 'late_count'));
      setTeacherStats(aggregateTeacherStats(records));
      setSubjectStats(aggregateSubjectStats(records));
      setOverallStats(calculateOverallStatsFromRecords(records));

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
      };

      if (studentGradeId !== 'all') params.grade_id = studentGradeId;
      if (studentClassId !== 'all') params.class_id = studentClassId;
      if (studentTrackId !== 'all') params.track_id = studentTrackId;
      const recordsRes = await attendanceService.getAttendanceRecords(params).catch((err) => {
        console.error('Student records fetch error:', err);
        return { results: [] };
      });

      const records = Array.isArray(recordsRes) ? recordsRes : recordsRes?.results || [];
      setStudentStatsCache(aggregateStudentStats(records));
    } catch (error) {
      console.error('Failed to fetch student attendance data:', error);
      toast.error(t('attendance.failedToLoadData'));
    } finally {
      setStudentLoading(false);
    }
  }, [studentClassId, studentDateRange, studentGradeId, studentTrackId, t]);

  const fetchClassData = useCallback(async () => {
    setClassLoading(true);
    try {
      const params = {
        ...buildDateRangeParams(classDateRange),
      };

      if (classGradeId !== 'all') params.grade_id = classGradeId;
      if (classTrackId !== 'all') params.track_id = classTrackId;
      const recordsRes = await attendanceService.getAttendanceRecords(params).catch((err) => {
        console.error('Class records fetch error:', err);
        return { results: [] };
      });

      const records = Array.isArray(recordsRes) ? recordsRes : recordsRes?.results || [];
      setClassStatsCache(aggregateClassStats(records));
    } catch (error) {
      console.error('Failed to fetch class attendance data:', error);
      toast.error(t('attendance.failedToLoadData'));
    } finally {
      setClassLoading(false);
    }
  }, [classDateRange, classGradeId, classTrackId, t]);

  const filteredStudentStats = useMemo(
    () => filterStudentsByCriteria(studentStatsCache, studentFilters),
    [studentStatsCache, studentFilters]
  );

  const studentTopAbsent = useMemo(
    () => pickTop(filteredStudentStats, 'absent_count'),
    [filteredStudentStats]
  );

  const studentTopLate = useMemo(
    () => pickTop(filteredStudentStats, 'late_count'),
    [filteredStudentStats]
  );

  const studentHighlights = useMemo(() => {
    const map = new Map();
    [...studentTopAbsent, ...studentTopLate].forEach((student) => {
      if (!map.has(student.id)) {
        map.set(student.id, student);
      } else {
        map.set(student.id, { ...map.get(student.id), ...student });
      }
    });
    return Array.from(map.values())
      .sort((a, b) => {
        if ((b.absent_count || 0) !== (a.absent_count || 0)) {
          return (b.absent_count || 0) - (a.absent_count || 0);
        }
        return (b.late_count || 0) - (a.late_count || 0);
      })
      .slice(0, 10);
  }, [studentTopAbsent, studentTopLate]);

  const filteredClassStats = useMemo(
    () => filterClassesByCriteria(classStatsCache, classFilters),
    [classStatsCache, classFilters]
  );

  const sortedClassStats = useMemo(
    () =>
      filteredClassStats
        .slice()
        .sort((a, b) => (b.absence_rate || 0) - (a.absence_rate || 0)),
    [filteredClassStats]
  );

  const studentClassOptions = useMemo(() => {
    if (!Array.isArray(classes)) return [];
    if (studentFilters.gradeId === 'all') return classes;
    return classes.filter((cls) =>
      matchById(cls.grade_id ?? cls.grade, studentFilters.gradeId)
    );
  }, [classes, studentFilters.gradeId]);

  const studentTrackOptions = useMemo(() => {
    if (!Array.isArray(tracks)) return [];
    if (studentFilters.gradeId === 'all') return tracks;
    return tracks.filter((track) =>
      matchById(track.grade_id ?? track.grade, studentFilters.gradeId)
    );
  }, [studentFilters.gradeId, tracks]);

  const classTrackOptions = useMemo(() => {
    if (!Array.isArray(tracks)) return [];
    if (classFilters.gradeId === 'all') return tracks;
    return tracks.filter((track) =>
      matchById(track.grade_id ?? track.grade, classFilters.gradeId)
    );
  }, [classFilters.gradeId, tracks]);

  const currentLoading = useMemo(() => {
    if (activeTab === 'students') return studentLoading;
    if (activeTab === 'classes') return classLoading;
    return overviewLoading;
  }, [activeTab, classLoading, overviewLoading, studentLoading]);

  const isInitialOverviewLoad = overviewLoading && !overallStats;

  const getStatusColor = (status) => {
    switch (status) {
      case 'present':
        return 'bg-green-100 text-green-800';
      case 'absent':
        return 'bg-red-100 text-red-800';
      case 'late':
        return 'bg-yellow-100 text-yellow-800';
      case 'excused':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString();
  };

  const handleExport = () => {
    toast.info(t('attendance.exportInProgress'));
    // TODO: Implement export functionality
  };

  const handleRefresh = () => {
    if (activeTab === 'students') {
      fetchStudentData();
    } else if (activeTab === 'classes') {
      fetchClassData();
    } else {
      fetchOverviewData();
    }
    toast.success(t('attendance.dataRefreshed'));
  };

  if (isInitialOverviewLoad) {
    return (
      <AdminPageLayout
        title={t('attendance.reports')}
        subtitle={t('attendance.reportsDescription')}
      >
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
        <Button
          key="refresh"
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={currentLoading}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${currentLoading ? 'animate-spin' : ''}`} />
          {t('common.refresh')}
        </Button>,
        <Button
          key="export"
          variant="outline"
          size="sm"
          onClick={handleExport}
        >
          <Download className="h-4 w-4 mr-2" />
          {t('common.export')}
        </Button>
      ]}
    >
      <div className="space-y-6">
        {/* Overview Summary */}
        {/* Overall Statistics */}
        {overallStats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-green-50 border-green-200">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-600">
                      {t('attendance.presenceRate')}
                    </p>
                    <p className="text-3xl font-bold text-green-700">
                      {overallStats.presence_rate}%
                    </p>
                    <p className="text-xs text-green-600 mt-1">
                      {overallStats.present_count} {t('attendance.present')}
                    </p>
                  </div>
                  <CheckCircle2 className="h-10 w-10 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-red-50 border-red-200">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-red-600">
                      {t('attendance.absenceRate')}
                    </p>
                    <p className="text-3xl font-bold text-red-700">
                      {overallStats.absence_rate}%
                    </p>
                    <p className="text-xs text-red-600 mt-1">
                      {overallStats.absent_count} {t('attendance.absent')}
                    </p>
                  </div>
                  <XCircle className="h-10 w-10 text-red-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-yellow-50 border-yellow-200">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-yellow-600">
                      {t('attendance.lateRate')}
                    </p>
                    <p className="text-3xl font-bold text-yellow-700">
                      {overallStats.late_rate}%
                    </p>
                    <p className="text-xs text-yellow-600 mt-1">
                      {overallStats.late_count} {t('attendance.late')}
                    </p>
                  </div>
                  <Clock className="h-10 w-10 text-yellow-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-600">
                      {t('attendance.totalSessions')}
                    </p>
                    <p className="text-3xl font-bold text-blue-700">
                      {overallStats.total_sessions}
                    </p>
                    <p className="text-xs text-blue-600 mt-1">
                      {t('attendance.sessionsRecorded')}
                    </p>
                  </div>
                  <Calendar className="h-10 w-10 text-blue-600" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Tabbed Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">{t('attendance.overview')}</TabsTrigger>
            <TabsTrigger value="students">{t('common.students')}</TabsTrigger>
            <TabsTrigger value="teachers">{t('common.teachers')}</TabsTrigger>
            <TabsTrigger value="subjects">{t('common.subjects')}</TabsTrigger>
            <TabsTrigger value="classes">{t('common.classes')}</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
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
                    <Select
                      value={overviewFilters.dateRange}
                      onValueChange={(value) =>
                        setOverviewFilters((prev) => ({ ...prev, dateRange: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
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
                    <Select
                      value={overviewFilters.classId}
                      onValueChange={(value) =>
                        setOverviewFilters((prev) => ({ ...prev, classId: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">{t('common.allClasses')}</SelectItem>
                        {classes.map((cls) => (
                          <SelectItem key={cls.id} value={cls.id?.toString()}>
                            {cls.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">{t('common.subject')}</label>
                    <Select
                      value={overviewFilters.subjectId}
                      onValueChange={(value) =>
                        setOverviewFilters((prev) => ({ ...prev, subjectId: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">{t('common.allSubjects')}</SelectItem>
                        {subjects.map((subject) => (
                          <SelectItem key={subject.id} value={subject.id?.toString()}>
                            {subject.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">{t('common.teacher')}</label>
                    <Select
                      value={overviewFilters.teacherId}
                      onValueChange={(value) =>
                        setOverviewFilters((prev) => ({ ...prev, teacherId: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">{t('common.allTeachers')}</SelectItem>
                        {teachers.map((teacher) => (
                          <SelectItem key={teacher.id} value={teacher.id?.toString()}>
                            {teacher.full_name || `${teacher.first_name || ''} ${teacher.last_name || ''}`.trim()}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Top Absent Students */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingDown className="h-5 w-5 text-red-600" />
                    {t('attendance.topAbsentStudents')}
                  </CardTitle>
                  <CardDescription>{t('attendance.studentsWithMostAbsences')}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {topAbsentStudents.length > 0 ? (
                      topAbsentStudents.map((student, index) => (
                        <div key={student.id} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-red-100 text-red-600 font-bold text-sm">
                              {index + 1}
                            </div>
                            <Avatar>
                              <AvatarImage src={student.avatar} />
                              <AvatarFallback>
                                <User className="h-4 w-4" />
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{student.name}</p>
                              <p className="text-xs text-muted-foreground">{student.class}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge variant="destructive">{student.absent_count}</Badge>
                            <p className="text-xs text-muted-foreground mt-1">
                              {((student.absent_count / student.total_sessions) * 100).toFixed(0)}%
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-center text-muted-foreground py-4">{t('attendance.noData')}</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Top Late Students */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-yellow-600" />
                    {t('attendance.topLateStudents')}
                  </CardTitle>
                  <CardDescription>{t('attendance.studentsWithMostLates')}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {topLateStudents.length > 0 ? (
                      topLateStudents.map((student, index) => (
                        <div key={student.id} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-yellow-100 text-yellow-600 font-bold text-sm">
                              {index + 1}
                            </div>
                            <Avatar>
                              <AvatarImage src={student.avatar} />
                              <AvatarFallback>
                                <User className="h-4 w-4" />
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{student.name}</p>
                              <p className="text-xs text-muted-foreground">{student.class}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                              {student.late_count}
                            </Badge>
                            <p className="text-xs text-muted-foreground mt-1">
                              {((student.late_count / student.total_sessions) * 100).toFixed(0)}%
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-center text-muted-foreground py-4">{t('attendance.noData')}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Sessions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  {t('attendance.recentSessions')}
                </CardTitle>
                <CardDescription>{t('attendance.latestAttendanceSessions')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {recentSessions.length > 0 ? (
                    recentSessions.map(session => (
                      <div
                        key={session.id}
                        className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <BookOpen className="h-4 w-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium">{session.subject_name || session.subject?.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {session.class_name || session.class?.name} • {formatDate(session.session_date)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={session.status === 'completed' ? 'default' : 'secondary'}>
                            {t(`attendance.status.${session.status}`)}
                          </Badge>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-muted-foreground py-4">{t('attendance.noSessions')}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Students Tab */}
          <TabsContent value="students" className="mt-6 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  {t('common.filters')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">{t('common.dateRange')}</label>
                    <Select
                      value={studentFilters.dateRange}
                      onValueChange={(value) =>
                        setStudentFilters((prev) => ({ ...prev, dateRange: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="today">{t('common.today')}</SelectItem>
                        <SelectItem value="this_week">{t('common.thisWeek')}</SelectItem>
                        <SelectItem value="this_month">{t('common.thisMonth')}</SelectItem>
                        <SelectItem value="all_time">{t('common.allTime')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">{t('common.grade', 'Grade')}</label>
                    <Select
                      value={studentFilters.gradeId}
                      onValueChange={(value) =>
                        setStudentFilters((prev) => ({
                          ...prev,
                          gradeId: value,
                          classId: 'all',
                          trackId: 'all',
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">{t('common.allGrades', 'All grades')}</SelectItem>
                        {grades.map((grade) => (
                          <SelectItem key={grade.id} value={grade.id?.toString()}>
                            {grade.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">{t('common.class')}</label>
                    <Select
                      value={studentFilters.classId}
                      onValueChange={(value) =>
                        setStudentFilters((prev) => ({ ...prev, classId: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">{t('common.allClasses')}</SelectItem>
                        {studentClassOptions.map((cls) => (
                          <SelectItem key={cls.id} value={cls.id?.toString()}>
                            {cls.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">{t('classes.track', 'Track')}</label>
                    <Select
                      value={studentFilters.trackId}
                      onValueChange={(value) =>
                        setStudentFilters((prev) => ({ ...prev, trackId: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">{t('classes.allTracks', 'All tracks')}</SelectItem>
                        {studentTrackOptions.map((track) => (
                          <SelectItem key={track.id} value={track.id?.toString()}>
                            {track.name}{track.code ? ` (${track.code})` : ''}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">{t('common.search')}</label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        value={studentFilters.search}
                        onChange={(event) =>
                          setStudentFilters((prev) => ({ ...prev, search: event.target.value }))
                        }
                        placeholder={t('attendance.searchStudent')}
                        className="pl-9"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t('attendance.studentStatistics')}</CardTitle>
                <CardDescription>{t('attendance.attendanceByStudent')}</CardDescription>
              </CardHeader>
              <CardContent>
                {studentLoading ? (
                  <div className="flex items-center justify-center py-10">
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <div className="h-4 w-4 rounded-full border-b-2 border-primary animate-spin" />
                      <span>{t('common.loadingData')}</span>
                    </div>
                  </div>
                ) : studentHighlights.length > 0 ? (
                  studentHighlights.map((student) => {
                    const meta = [
                      student.gradeName,
                      student.trackName,
                      student.class || student.className,
                    ]
                      .filter(Boolean)
                      .join(' • ');

                    const attendanceRate =
                      student.total_sessions > 0
                        ? ((student.present_count + student.late_count) / student.total_sessions) * 100
                        : 0;

                    return (
                      <div key={student.id} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage src={student.avatar} />
                              <AvatarFallback>
                                <User className="h-4 w-4" />
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{student.name}</p>
                              <p className="text-xs text-muted-foreground">{meta || '-'}</p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                              {student.present_count} {t('attendance.present')}
                            </Badge>
                            <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                              {student.absent_count} {t('attendance.absent')}
                            </Badge>
                            <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                              {student.late_count} {t('attendance.late')}
                            </Badge>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">{t('attendance.attendanceRate')}</span>
                            <span className="font-medium">{attendanceRate.toFixed(1)}%</span>
                          </div>
                          <Progress value={attendanceRate} className="h-2" />
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-center text-muted-foreground py-8">{t('attendance.noData')}</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>


          {/* Teachers Tab */}
          <TabsContent value="teachers" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>{t('attendance.teacherStatistics')}</CardTitle>
                <CardDescription>{t('attendance.absenceRateByTeacher')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {teacherStats.length > 0 ? (
                    teacherStats.map((teacher, index) => (
                      <div key={teacher.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted text-foreground font-bold text-sm">
                            {index + 1}
                          </div>
                          <div>
                            <p className="font-medium">{teacher.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {teacher.total_records} {t('attendance.records')}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="text-sm text-muted-foreground">{t('attendance.absenceRate')}</p>
                            <p className="text-lg font-bold text-red-600">{teacher.absence_rate}%</p>
                          </div>
                          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                            {teacher.absent_count} {t('attendance.absences')}
                          </Badge>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-muted-foreground py-8">{t('attendance.noData')}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Subjects Tab */}
          <TabsContent value="subjects" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>{t('attendance.subjectStatistics')}</CardTitle>
                <CardDescription>{t('attendance.absenceRateBySubject')}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {subjectStats.length > 0 ? (
                    subjectStats.map((subject, index) => (
                      <div key={subject.id} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-100 rounded-lg">
                              <BookOpen className="h-4 w-4 text-purple-600" />
                            </div>
                            <div>
                              <p className="font-medium">{subject.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {subject.total_records} {t('attendance.records')}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-red-600">{subject.absence_rate}%</p>
                            <p className="text-xs text-muted-foreground">{t('attendance.absenceRate')}</p>
                          </div>
                        </div>
                        <Progress
                          value={parseFloat(subject.absence_rate)}
                          className="h-2 bg-red-100"
                          indicatorClassName="bg-red-500"
                        />
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-muted-foreground py-8">{t('attendance.noData')}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Classes Tab */}
          <TabsContent value="classes" className="mt-6 space-y-6">
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
                    <Select
                      value={classFilters.dateRange}
                      onValueChange={(value) =>
                        setClassFilters((prev) => ({ ...prev, dateRange: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="today">{t('common.today')}</SelectItem>
                        <SelectItem value="this_week">{t('common.thisWeek')}</SelectItem>
                        <SelectItem value="this_month">{t('common.thisMonth')}</SelectItem>
                        <SelectItem value="all_time">{t('common.allTime')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">{t('common.grade', 'Grade')}</label>
                    <Select
                      value={classFilters.gradeId}
                      onValueChange={(value) =>
                        setClassFilters((prev) => ({
                          ...prev,
                          gradeId: value,
                          trackId: 'all',
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">{t('common.allGrades', 'All grades')}</SelectItem>
                        {grades.map((grade) => (
                          <SelectItem key={grade.id} value={grade.id?.toString()}>
                            {grade.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">{t('classes.track', 'Track')}</label>
                    <Select
                      value={classFilters.trackId}
                      onValueChange={(value) =>
                        setClassFilters((prev) => ({ ...prev, trackId: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">{t('classes.allTracks', 'All tracks')}</SelectItem>
                        {classTrackOptions.map((track) => (
                          <SelectItem key={track.id} value={track.id?.toString()}>
                            {track.name}{track.code ? ` (${track.code})` : ''}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">{t('common.search')}</label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        value={classFilters.search}
                        onChange={(event) =>
                          setClassFilters((prev) => ({ ...prev, search: event.target.value }))
                        }
                        placeholder={t('classes.searchPlaceholder', 'Search classes')}
                        className="pl-9"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t('attendance.classStatistics')}</CardTitle>
                <CardDescription>{t('attendance.attendanceByClass')}</CardDescription>
              </CardHeader>
              <CardContent>
                {classLoading ? (
                  <div className="flex items-center justify-center py-10">
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <div className="h-4 w-4 rounded-full border-b-2 border-primary animate-spin" />
                      <span>{t('common.loadingData')}</span>
                    </div>
                  </div>
                ) : sortedClassStats.length > 0 ? (
                  sortedClassStats.map((cls) => {
                    const meta = [cls.gradeName, cls.trackName].filter(Boolean).join(' • ');
                    return (
                      <div key={cls.id} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                              <GraduationCap className="h-4 w-4 text-blue-600" />
                            </div>
                            <div>
                              <p className="font-medium">{cls.name || cls.class_name}</p>
                              <p className="text-xs text-muted-foreground">{meta || t('classes.noTrack', 'General')}</p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                              {cls.presence_rate || 0}% {t('attendance.present')}
                            </Badge>
                            <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                              {cls.absence_rate || 0}% {t('attendance.absent')}
                            </Badge>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <div className="flex items-center justify-between text-xs mb-1">
                              <span className="text-muted-foreground">{t('attendance.present')}</span>
                              <span className="font-medium">{cls.presence_rate || 0}%</span>
                            </div>
                            <Progress value={cls.presence_rate || 0} className="h-2 bg-green-100" />
                          </div>
                          <div>
                            <div className="flex items-center justify-between text-xs mb-1">
                              <span className="text-muted-foreground">{t('attendance.absent')}</span>
                              <span className="font-medium">{cls.absence_rate || 0}%</span>
                            </div>
                            <Progress
                              value={cls.absence_rate || 0}
                              className="h-2 bg-red-100"
                              indicatorClassName="bg-red-500"
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-center text-muted-foreground py-8">{t('attendance.noData')}</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

        </Tabs>
      </div>
    </AdminPageLayout>
  );
};

export default AttendanceReportsPage;

