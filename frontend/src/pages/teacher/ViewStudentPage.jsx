import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import { useNavigate, useParams } from 'react-router-dom';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  GraduationCap,
  Building,
  Clock,
  Users,
  BookOpen,
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  BarChart3,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ChevronRight,
  Activity,
  Loader2
} from 'lucide-react';
import { TeacherPageLayout } from '../../components/teacher/layout';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { Progress } from '../../components/ui/progress';
import StudentRewardSummary from '../../components/rewards/StudentRewardSummary';
import { apiMethods } from '../../services/api';
import attendanceService from '../../services/attendance';
import progressService from '../../services/progress';
import { toast } from 'sonner';

const TeacherViewStudentPage = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { studentId } = useParams();
  const [loading, setLoading] = useState(true);
  const [studentData, setStudentData] = useState(null);
  const [attendanceStats, setAttendanceStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);
  const [progressData, setProgressData] = useState(null);
  const [loadingProgress, setLoadingProgress] = useState(true);

  // Fetch student data
  const fetchStudentData = async () => {
    setLoading(true);
    try {
      const response = await apiMethods.get(`users/users/${studentId}/`);
      
      let data = response.data || response;
      setStudentData(data);
      
    } catch (error) {
      console.error('Failed to fetch student data:', error);
      toast.error(t('error.failedToLoadStudentData', 'Failed to load student data'));
      navigate('/teacher/profile/my-classes');
    } finally {
      setLoading(false);
    }
  };

  // Fetch attendance statistics
  const fetchAttendanceStatistics = async () => {
    setLoadingStats(true);
    try {
      const stats = await attendanceService.getStudentStatistics(studentId);
      setAttendanceStats(stats);
    } catch (error) {
      console.error('Failed to fetch attendance statistics:', error);
      // Don't show error toast, just leave stats as null
    } finally {
      setLoadingStats(false);
    }
  };

  // Fetch progress data
  const fetchProgressData = async () => {
    setLoadingProgress(true);
    try {
      console.log('Fetching progress data for student:', studentId);
      const report = await progressService.getStudentProgressReport(studentId);
      console.log('Progress data received:', report);
      setProgressData(report);
    } catch (error) {
      console.error('Failed to fetch progress data:', error);
      console.error('Error details:', error.response?.data || error.message);
      setProgressData(null);
    } finally {
      setLoadingProgress(false);
    }
  };

  useEffect(() => {
    if (studentId) {
      fetchStudentData();
      fetchAttendanceStatistics();
      fetchProgressData();
    }
  }, [studentId]);

  const handleViewDetailedProgress = () => {
    navigate(`/teacher/students/${studentId}/progress`);
  };

  const handleGoBack = () => {
    navigate('/teacher/profile/my-classes');
  };

  if (loading || !studentData) {
    return (
      <TeacherPageLayout
        title={t('teacherStudentView.title', 'Student Profile')}
        subtitle={t('teacherStudentView.subtitle', 'View student information')}
        loading={loading}
      >
        <div className="flex items-center justify-center py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p>{t('common.loading', 'Loading...')}</p>
          </div>
        </div>
      </TeacherPageLayout>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getAttendanceStatusBadge = (rate) => {
    if (rate >= 90) return { variant: 'default', label: t('attendance.statusExcellent', 'Excellent'), color: 'text-green-600' };
    if (rate >= 75) return { variant: 'secondary', label: t('attendance.statusGood', 'Good'), color: 'text-blue-600' };
    if (rate >= 60) return { variant: 'outline', label: t('attendance.statusFair', 'Fair'), color: 'text-yellow-600' };
    return { variant: 'destructive', label: t('attendance.statusAtRisk', 'At Risk'), color: 'text-red-600' };
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'present':
        return 'text-green-600 bg-green-50';
      case 'absent':
        return 'text-red-600 bg-red-50';
      case 'late':
        return 'text-yellow-600 bg-yellow-50';
      case 'excused':
        return 'text-blue-600 bg-blue-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <TeacherPageLayout
      title={studentData.full_name || `${studentData.first_name} ${studentData.last_name}`}
      subtitle={t('teacherStudentView.subtitle', 'View student information')}
      actions={[
        <Button key="back" onClick={handleGoBack} variant="outline" className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          {t('common.goBack', 'Go Back')}
        </Button>
      ]}
    >
      <div className="space-y-6">
        {/* Student Profile Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              {t('teacherStudentView.profileInfo', 'Profile Information')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-6">
              {/* Profile Picture */}
              <div className="flex justify-center md:justify-start">
                <Avatar className="w-32 h-32">
                  <AvatarImage 
                    src={studentData.profile_picture_url} 
                    alt={studentData.full_name || `${studentData.first_name} ${studentData.last_name}`}
                  />
                  <AvatarFallback className="text-4xl bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                    <GraduationCap className="w-16 h-16" />
                  </AvatarFallback>
                </Avatar>
              </div>

              {/* Basic Info */}
              <div className="flex-1 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-2xl font-semibold">
                      {studentData.full_name || `${studentData.first_name} ${studentData.last_name}`}
                    </h3>
                    <p className="text-muted-foreground">
                      {studentData.ar_first_name && studentData.ar_last_name && 
                        `${studentData.ar_first_name} ${studentData.ar_last_name}`
                      }
                    </p>
                    <div className="mt-2">
                      <Badge variant={studentData.is_active ? 'default' : 'secondary'}>
                        {studentData.is_active ? t('status.active', 'Active') : t('status.inactive', 'Inactive')}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <GraduationCap className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {studentData.student_profile?.current_grade || t('common.notSpecified', 'Not specified')}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Building className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {studentData.student_profile?.current_class || t('common.notSpecified', 'Not specified')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                {t('teacherStudentView.contactInfo', 'Contact Information')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">{t('common.email', 'Email')}</p>
                  <p className="text-sm text-muted-foreground">
                    {studentData.email || '—'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">{t('common.phone', 'Phone')}</p>
                  <p className="text-sm text-muted-foreground">
                    {studentData.phone || '—'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">{t('common.address', 'Address')}</p>
                  <p className="text-sm text-muted-foreground">
                    {studentData.address || '—'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">{t('common.dateOfBirth', 'Date of Birth')}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(studentData.date_of_birth)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Academic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                {t('teacherStudentView.academicInfo', 'Academic Information')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <GraduationCap className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">{t('common.grade', 'Grade')}</p>
                  <p className="text-sm text-muted-foreground">
                    {studentData.student_profile?.current_grade || '—'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Building className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">{t('common.class', 'Class')}</p>
                  <p className="text-sm text-muted-foreground">
                    {studentData.student_profile?.current_class || '—'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Users className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">{t('common.studentId', 'Student ID')}</p>
                  <p className="text-sm text-muted-foreground">
                    {studentData.student_profile?.student_number || '—'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">{t('common.enrolledOn', 'Enrolled On')}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(studentData.date_joined)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <StudentRewardSummary studentId={studentId} className="shadow-sm" />

        {/* Learning Progress Section */}
        {!loadingProgress && (
          <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={handleViewDetailedProgress}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  {t('progress.learningProgress', 'Learning Progress')}
                </CardTitle>
                <Button variant="ghost" size="sm" className="gap-2">
                  {t('common.viewDetails', 'View Details')}
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {progressData ? (
                <>
                  {/* Summary Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Overall Completion */}
                    <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800/50">
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-blue-700 dark:text-blue-400">{t('progress.completion', 'Completion')}</p>
                            <p className="text-2xl font-bold text-blue-800 dark:text-blue-300">{progressData.overall_completion_percentage}%</p>
                            <p className="text-xs text-blue-600 dark:text-blue-500">
                              {progressData.lessons_completed}/{progressData.total_lessons} {t('progress.lessons', 'lessons')}
                            </p>
                          </div>
                          <CheckCircle2 className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                        </div>
                      </CardContent>
                    </Card>

                    {/* Average Score */}
                    <Card className="bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800/50">
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-green-700 dark:text-green-400">{t('progress.avgScore', 'Avg Score')}</p>
                            <p className="text-2xl font-bold text-green-800 dark:text-green-300">{progressData.overall_average_score}%</p>
                            <p className="text-xs text-green-600 dark:text-green-500">
                              {t('progress.acrossAllLessons', 'Across all lessons')}
                            </p>
                          </div>
                          <BarChart3 className="h-8 w-8 text-green-600 dark:text-green-400" />
                        </div>
                      </CardContent>
                    </Card>

                    {/* Accuracy */}
                    <Card className="bg-purple-50 dark:bg-purple-950/20 border-purple-200 dark:border-purple-800/50">
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-purple-700 dark:text-purple-400">{t('progress.accuracy', 'Accuracy')}</p>
                            <p className="text-2xl font-bold text-purple-800 dark:text-purple-300">{progressData.overall_accuracy_percentage}%</p>
                            <p className="text-xs text-purple-600 dark:text-purple-500">
                              {t('progress.correctAnswers', 'Correct answers')}
                            </p>
                          </div>
                          <TrendingUp className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                        </div>
                      </CardContent>
                    </Card>

                    {/* Total Exercises */}
                    <Card className="bg-orange-50 dark:bg-orange-950/20 border-orange-200 dark:border-orange-800/50">
                      <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-orange-700 dark:text-orange-400">{t('progress.totalExercises', 'Total Exercises')}</p>
                            <p className="text-2xl font-bold text-orange-800 dark:text-orange-300">{progressData.total_exercises}</p>
                            <p className="text-xs text-orange-600 dark:text-orange-500">
                              {progressData.total_subjects} {t('progress.subjects', 'subjects')}
                            </p>
                          </div>
                          <BookOpen className="h-8 w-8 text-orange-600 dark:text-orange-400" />
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Progress Breakdown */}
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-green-600 dark:text-green-400">{t('progress.completed', 'Completed')}</span>
                        <span className="text-sm font-medium text-green-600 dark:text-green-400">
                          {progressData.lessons_completed} ({progressData.total_lessons > 0 ? ((progressData.lessons_completed / progressData.total_lessons) * 100).toFixed(1) : 0}%)
                        </span>
                      </div>
                      <Progress
                        value={progressData.total_lessons > 0 ? (progressData.lessons_completed / progressData.total_lessons) * 100 : 0}
                        className="h-3"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-blue-600 dark:text-blue-400">{t('progress.inProgress', 'In Progress')}</span>
                        <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                          {progressData.lessons_in_progress} ({progressData.total_lessons > 0 ? ((progressData.lessons_in_progress / progressData.total_lessons) * 100).toFixed(1) : 0}%)
                        </span>
                      </div>
                      <Progress
                        value={progressData.total_lessons > 0 ? (progressData.lessons_in_progress / progressData.total_lessons) * 100 : 0}
                        className="h-3"
                        indicatorClassName="bg-blue-500"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{t('progress.notStarted', 'Not Started')}</span>
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                          {progressData.lessons_not_started} ({progressData.total_lessons > 0 ? ((progressData.lessons_not_started / progressData.total_lessons) * 100).toFixed(1) : 0}%)
                        </span>
                      </div>
                      <Progress
                        value={progressData.total_lessons > 0 ? (progressData.lessons_not_started / progressData.total_lessons) * 100 : 0}
                        className="h-3"
                        indicatorClassName="bg-gray-400"
                      />
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-12">
                  <BookOpen className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
                  <h3 className="text-lg font-medium text-foreground mb-2">
                    {t('progress.noProgressYet', 'No Progress Data Yet')}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {t('progress.studentHasntStarted', 'This student hasn\'t started any lessons yet.')}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {t('progress.clickToViewEmpty', 'Click "View Details" to see the full progress dashboard')}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Attendance Statistics Section */}
        {!loadingStats && attendanceStats && attendanceStats.total_sessions > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                {t('attendance.statistics', 'Attendance Statistics')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Presence Rate */}
                <Card className="bg-green-50 border-green-200">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-green-600">{t('attendance.presenceRate', 'Presence Rate')}</p>
                        <p className="text-2xl font-bold text-green-700">{attendanceStats.presence_rate}%</p>
                        <p className="text-xs text-green-600">
                          {attendanceStats.present_count}/{attendanceStats.total_sessions} {t('attendance.sessions', 'sessions')}
                        </p>
                      </div>
                      <CheckCircle2 className="h-8 w-8 text-green-600" />
                    </div>
                  </CardContent>
                </Card>

                {/* Absence Rate */}
                <Card className="bg-red-50 border-red-200">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-red-600">{t('attendance.absenceRate', 'Absence Rate')}</p>
                        <p className="text-2xl font-bold text-red-700">{attendanceStats.absence_rate}%</p>
                        <p className="text-xs text-red-600">
                          {attendanceStats.absent_count}/{attendanceStats.total_sessions} {t('attendance.sessions', 'sessions')}
                        </p>
                      </div>
                      <XCircle className="h-8 w-8 text-red-600" />
                    </div>
                  </CardContent>
                </Card>

                {/* Late Rate */}
                <Card className="bg-yellow-50 border-yellow-200">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-yellow-600">{t('attendance.lateRate', 'Late Rate')}</p>
                        <p className="text-2xl font-bold text-yellow-700">
                          {attendanceStats.late_count > 0 ? ((attendanceStats.late_count / attendanceStats.total_sessions) * 100).toFixed(1) : 0}%
                        </p>
                        <p className="text-xs text-yellow-600">
                          {attendanceStats.late_count}/{attendanceStats.total_sessions} {t('attendance.sessions', 'sessions')}
                        </p>
                      </div>
                      <Clock className="h-8 w-8 text-yellow-600" />
                    </div>
                  </CardContent>
                </Card>

                {/* Punctuality Rate */}
                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-blue-600">{t('attendance.punctualityRate', 'Punctuality')}</p>
                        <p className="text-2xl font-bold text-blue-700">{attendanceStats.punctuality_rate}%</p>
                        <p className="text-xs text-blue-600">
                          {t('attendance.onTime', 'On time arrivals')}
                        </p>
                      </div>
                      <TrendingUp className="h-8 w-8 text-blue-600" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Overall Status Badge */}
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div>
                  <p className="text-sm font-medium">{t('attendance.overallStatus', 'Overall Attendance Status')}</p>
                  <p className="text-xs text-muted-foreground">
                    {t('attendance.basedOnAttendanceRate', 'Based on attendance rate')} ({attendanceStats.attendance_rate}%)
                  </p>
                </div>
                <Badge variant={getAttendanceStatusBadge(attendanceStats.attendance_rate).variant} className="text-base px-4 py-2">
                  {getAttendanceStatusBadge(attendanceStats.attendance_rate).label}
                </Badge>
              </div>

              {/* Progress Bars */}
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-green-600">{t('attendance.present', 'Present')}</span>
                    <span className="text-sm font-medium text-green-600">{attendanceStats.presence_rate}%</span>
                  </div>
                  <Progress value={attendanceStats.presence_rate} className="h-3 bg-green-100" />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-red-600">{t('attendance.absent', 'Absent')}</span>
                    <span className="text-sm font-medium text-red-600">{attendanceStats.absence_rate}%</span>
                  </div>
                  <Progress value={attendanceStats.absence_rate} className="h-3 bg-red-100" indicatorClassName="bg-red-500" />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-yellow-600">{t('attendance.late', 'Late')}</span>
                    <span className="text-sm font-medium text-yellow-600">
                      {((attendanceStats.late_count / attendanceStats.total_sessions) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <Progress
                    value={(attendanceStats.late_count / attendanceStats.total_sessions) * 100}
                    className="h-3 bg-yellow-100"
                    indicatorClassName="bg-yellow-500"
                  />
                </div>
              </div>

              {/* Alerts */}
              {attendanceStats.consecutive_absences >= 3 && (
                <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-red-700">
                      {t('attendance.consecutiveAbsencesAlert', 'Consecutive Absences Alert')}
                    </p>
                    <p className="text-xs text-red-600">
                      {attendanceStats.consecutive_absences} {t('attendance.consecutiveAbsences', 'consecutive absences detected')}
                    </p>
                  </div>
                </div>
              )}

              {/* Recent History */}
              {attendanceStats.recent_history && attendanceStats.recent_history.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium mb-3">{t('attendance.recentHistory', 'Recent Attendance')}</h4>
                  <div className="space-y-2">
                    {attendanceStats.recent_history.slice(0, 5).map((record, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">{new Date(record.date).toLocaleDateString()}</p>
                            <p className="text-xs text-muted-foreground">{record.subject_name}</p>
                          </div>
                        </div>
                        <Badge className={getStatusColor(record.status)}>
                          {t(`attendance.${record.status}`, record.status_display)}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* No Attendance Data */}
        {!loadingStats && (!attendanceStats || attendanceStats.total_sessions === 0) && (
          <Card>
            <CardContent className="text-center py-12">
              <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {t('attendance.noAttendanceData', 'No Attendance Data')}
              </h3>
              <p className="text-sm text-muted-foreground">
                {t('attendance.noAttendanceDataDescription', 'No attendance records found for this student yet.')}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </TeacherPageLayout>
  );
};

export default TeacherViewStudentPage;