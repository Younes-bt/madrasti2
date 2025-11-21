import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Edit,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  FileText,
  GraduationCap,
  Building,
  Clock,
  Shield,
  Users,
  BookOpen,
  BarChart3,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  TrendingUp,
  Loader2,
  ChevronRight
} from 'lucide-react';
import AdminPageLayout from '../../components/admin/layout/AdminPageLayout';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Progress } from '../../components/ui/progress';
import StudentRewardSummary from '../../components/rewards/StudentRewardSummary';
import { apiMethods } from '../../services/api';
import attendanceService from '../../services/attendance';
import progressService from '../../services/progress';
import { toast } from 'sonner';

const ViewStudentPage = () => {
  const { t } = useTranslation();
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
      toast.error(t('error.failedToLoadStudentData'));
      navigate('/admin/school-management/students');
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
      // Set progress data to null on error so we show the "no data" message
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
    navigate(`/admin/school-management/students/${studentId}/progress`);
  };

  const handleEdit = () => {
    navigate(`/admin/school-management/students/edit/${studentId}`);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString();
  };

  const getAttendanceStatusBadge = (rate) => {
    if (rate >= 90) return { variant: 'default', label: t('attendance.statusExcellent') };
    if (rate >= 75) return { variant: 'secondary', label: t('attendance.statusGood') };
    if (rate >= 60) return { variant: 'outline', label: t('attendance.statusFair') };
    return { variant: 'destructive', label: t('attendance.statusAtRisk') };
  };

  const InfoItem = ({ icon, label, value, isLink = false, linkUrl = null }) => (
    <div className="flex items-start gap-3 p-3">
      <div className="flex-shrink-0 mt-1 text-muted-foreground">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground">{label}</p>
        {isLink && value && linkUrl ? (
          <a
            href={linkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-primary hover:underline break-all"
          >
            {value}
          </a>
        ) : (
          <p className="text-sm text-muted-foreground break-words">{value || '-'}</p>
        )}
      </div>
    </div>
  );

  const actions = [
    <Button
      key="edit"
      onClick={handleEdit}
      disabled={loading}
      className="gap-2"
    >
      <Edit className="h-4 w-4" />
      {t('action.edit')}
    </Button>
  ];

  if (loading) {
    return (
      <AdminPageLayout
        title={t('student.viewStudent')}
        subtitle={t('student.viewStudentDescription')}
        showBackButton={true}
        backButtonPath="/admin/school-management/students"
        loading={true}
      >
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">{t('common.loadingData')}</p>
          </div>
        </div>
      </AdminPageLayout>
    );
  }

  if (!studentData) {
    return (
      <AdminPageLayout
        title={t('student.viewStudent')}
        subtitle={t('student.viewStudentDescription')}
        showBackButton={true}
        backButtonPath="/admin/school-management/students"
      >
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <p className="text-muted-foreground">{t('error.studentNotFound')}</p>
          </div>
        </div>
      </AdminPageLayout>
    );
  }

  return (
    <AdminPageLayout
      title={`${studentData.first_name} ${studentData.last_name}`}
      subtitle={t('student.viewStudentDescription')}
      showBackButton={true}
      backButtonPath="/admin/school-management/students"
      actions={actions}
    >
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Profile Summary - Left Column */}
          <div className="lg:col-span-1 space-y-6">

            {/* Profile Picture & Basic Info */}
            <Card className="border-border/50">
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="relative inline-block">
                    {studentData.profile_picture_url ? (
                      <img
                        src={studentData.profile_picture_url}
                        alt={`${studentData.first_name} ${studentData.last_name}`}
                        className="h-32 w-32 rounded-full object-cover border-4 border-border mx-auto"
                      />
                    ) : (
                      <div className="h-32 w-32 rounded-full bg-muted flex items-center justify-center mx-auto border-4 border-border">
                        <GraduationCap className="h-12 w-12 text-muted-foreground" />
                      </div>
                    )}
                  </div>

                  <h3 className="mt-4 text-xl font-semibold text-foreground">
                    {studentData.first_name} {studentData.last_name}
                  </h3>

                  {(studentData.ar_first_name || studentData.ar_last_name) && (
                    <p className="text-sm text-muted-foreground mt-1" dir="rtl">
                      {studentData.ar_first_name} {studentData.ar_last_name}
                    </p>
                  )}

                  <div className="mt-3 flex items-center justify-center gap-2 flex-wrap">
                    {studentData.student_id && (
                      <Badge variant="outline" className="text-sm">
                        {t('student.studentId')}: {studentData.student_id}
                      </Badge>
                    )}
                    <Badge variant={studentData.is_active ? "default" : "secondary"}>
                      {studentData.is_active ? t('status.active') : t('status.inactive')}
                    </Badge>
                  </div>

                  {(studentData.grade || studentData.class_name) && (
                    <div className="mt-2 flex items-center justify-center gap-2 flex-wrap">
                      {studentData.grade && (
                        <Badge variant="secondary" className="text-sm">
                          {t('student.grade')} {studentData.grade}
                        </Badge>
                      )}
                      {studentData.class_name && (
                        <Badge variant="secondary" className="text-sm">
                          {studentData.class_name}
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Shield className="h-5 w-5 text-primary" />
                  {t('student.accountInfo')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">{t('common.role')}</span>
                  <Badge variant="outline">{t(`roles.${studentData.role?.toLowerCase()}`)}</Badge>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">{t('common.enrollmentDate')}</span>
                  <span className="text-sm text-foreground">{formatDate(studentData.enrollment_date || studentData.created_at)}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">{t('common.lastLogin')}</span>
                  <span className="text-sm text-foreground">{formatDate(studentData.last_login)}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Information - Right Columns */}
          <div className="lg:col-span-2 space-y-6">

            {/* Contact Information */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Mail className="h-5 w-5 text-primary" />
                  {t('student.contactInformation')}
                </CardTitle>
              </CardHeader>
              <CardContent className="divide-y divide-border/50">
                <InfoItem
                  icon={<Mail className="h-4 w-4" />}
                  label={t('common.email')}
                  value={studentData.email}
                  isLink={true}
                  linkUrl={`mailto:${studentData.email}`}
                />

                <InfoItem
                  icon={<Phone className="h-4 w-4" />}
                  label={t('common.phone')}
                  value={studentData.phone}
                  isLink={studentData.phone}
                  linkUrl={`tel:${studentData.phone}`}
                />

                <InfoItem
                  icon={<MapPin className="h-4 w-4" />}
                  label={t('common.address')}
                  value={studentData.address}
                />

                <InfoItem
                  icon={<Calendar className="h-4 w-4" />}
                  label={t('common.dateOfBirth')}
                  value={formatDate(studentData.date_of_birth)}
                />
              </CardContent>
            </Card>

            {/* Academic Information */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <BookOpen className="h-5 w-5 text-primary" />
                  {t('student.academicInformation')}
                </CardTitle>
              </CardHeader>
              <CardContent className="divide-y divide-border/50">
                <InfoItem
                  icon={<GraduationCap className="h-4 w-4" />}
                  label={t('student.grade')}
                  value={studentData.grade ? `${t('student.grade')} ${studentData.grade}` : '-'}
                />

                <InfoItem
                  icon={<Building className="h-4 w-4" />}
                  label={t('student.className')}
                  value={studentData.class_name}
                />

                <InfoItem
                  icon={<Calendar className="h-4 w-4" />}
                  label={t('common.enrollmentDate')}
                  value={formatDate(studentData.enrollment_date || studentData.created_at)}
                />
              </CardContent>
            </Card>

            <StudentRewardSummary
              studentId={studentId}
              className="shadow-sm"
              title={t('adminStudentView.rewardsTitle', 'Rewards & Points')}
              description={t('adminStudentView.rewardsDescription', 'Track how this student earns and spends rewards.')}
            />

            {/* Parent Information */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Users className="h-5 w-5 text-primary" />
                  {t('student.parentInformation')}
                </CardTitle>
              </CardHeader>
              <CardContent className="divide-y divide-border/50">
                <InfoItem
                  icon={<User className="h-4 w-4" />}
                  label={t('student.parentName')}
                  value={studentData.parent_name}
                />

                <InfoItem
                  icon={<Mail className="h-4 w-4" />}
                  label={t('student.parentEmail')}
                  value={studentData.parent_email}
                  isLink={studentData.parent_email}
                  linkUrl={`mailto:${studentData.parent_email}`}
                />

                <InfoItem
                  icon={<Phone className="h-4 w-4" />}
                  label={t('student.parentPhone')}
                  value={studentData.parent_phone}
                  isLink={studentData.parent_phone}
                  linkUrl={`tel:${studentData.parent_phone}`}
                />
              </CardContent>
            </Card>

            {/* Emergency Contact */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Phone className="h-5 w-5 text-primary" />
                  {t('student.emergencyContact')}
                </CardTitle>
              </CardHeader>
              <CardContent className="divide-y divide-border/50">
                <InfoItem
                  icon={<User className="h-4 w-4" />}
                  label={t('student.emergencyContactName')}
                  value={studentData.emergency_contact_name}
                />

                <InfoItem
                  icon={<Phone className="h-4 w-4" />}
                  label={t('student.emergencyContactPhone')}
                  value={studentData.emergency_contact_phone}
                  isLink={studentData.emergency_contact_phone}
                  linkUrl={`tel:${studentData.emergency_contact_phone}`}
                />
              </CardContent>
            </Card>

            {/* Additional Notes */}
            {studentData.bio && (
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <FileText className="h-5 w-5 text-primary" />
                    {t('student.notes')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
                    {studentData.bio}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Attendance Statistics Section */}
        {!loadingStats && attendanceStats && attendanceStats.total_sessions > 0 && (
          <Card className="mt-6 border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <BarChart3 className="h-5 w-5 text-primary" />
                {t('attendance.statistics')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Presence Rate */}
                <Card className="bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800/50">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-green-700 dark:text-green-400">{t('attendance.presenceRate')}</p>
                        <p className="text-2xl font-bold text-green-800 dark:text-green-300">{attendanceStats.presence_rate}%</p>
                        <p className="text-xs text-green-600 dark:text-green-500">
                          {attendanceStats.present_count}/{attendanceStats.total_sessions} {t('attendance.sessions')}
                        </p>
                      </div>
                      <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-400" />
                    </div>
                  </CardContent>
                </Card>

                {/* Absence Rate */}
                <Card className="bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800/50">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-red-700 dark:text-red-400">{t('attendance.absenceRate')}</p>
                        <p className="text-2xl font-bold text-red-800 dark:text-red-300">{attendanceStats.absence_rate}%</p>
                        <p className="text-xs text-red-600 dark:text-red-500">
                          {attendanceStats.absent_count}/{attendanceStats.total_sessions} {t('attendance.sessions')}
                        </p>
                      </div>
                      <XCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
                    </div>
                  </CardContent>
                </Card>

                {/* Late Rate */}
                <Card className="bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-800/50">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-yellow-700 dark:text-yellow-400">{t('attendance.lateRate')}</p>
                        <p className="text-2xl font-bold text-yellow-800 dark:text-yellow-300">
                          {attendanceStats.late_count > 0 ? ((attendanceStats.late_count / attendanceStats.total_sessions) * 100).toFixed(1) : 0}%
                        </p>
                        <p className="text-xs text-yellow-600 dark:text-yellow-500">
                          {attendanceStats.late_count}/{attendanceStats.total_sessions} {t('attendance.sessions')}
                        </p>
                      </div>
                      <Clock className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
                    </div>
                  </CardContent>
                </Card>

                {/* Punctuality Rate */}
                <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800/50">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-blue-700 dark:text-blue-400">{t('attendance.punctualityRate')}</p>
                        <p className="text-2xl font-bold text-blue-800 dark:text-blue-300">{attendanceStats.punctuality_rate}%</p>
                        <p className="text-xs text-blue-600 dark:text-blue-500">
                          {t('attendance.onTime')}
                        </p>
                      </div>
                      <TrendingUp className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Overall Status Badge */}
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border border-border/50">
                <div>
                  <p className="text-sm font-medium text-foreground">{t('attendance.overallStatus')}</p>
                  <p className="text-xs text-muted-foreground">
                    {t('attendance.basedOnAttendanceRate')} ({attendanceStats.attendance_rate}%)
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
                    <span className="text-sm font-medium text-green-600 dark:text-green-400">{t('attendance.present')}</span>
                    <span className="text-sm font-medium text-green-600 dark:text-green-400">{attendanceStats.presence_rate}%</span>
                  </div>
                  <Progress value={attendanceStats.presence_rate} className="h-3" />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-red-600 dark:text-red-400">{t('attendance.absent')}</span>
                    <span className="text-sm font-medium text-red-600 dark:text-red-400">{attendanceStats.absence_rate}%</span>
                  </div>
                  <Progress value={attendanceStats.absence_rate} className="h-3" indicatorClassName="bg-red-500" />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-yellow-600 dark:text-yellow-400">{t('attendance.late')}</span>
                    <span className="text-sm font-medium text-yellow-600 dark:text-yellow-400">
                      {((attendanceStats.late_count / attendanceStats.total_sessions) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <Progress
                    value={(attendanceStats.late_count / attendanceStats.total_sessions) * 100}
                    className="h-3"
                    indicatorClassName="bg-yellow-500"
                  />
                </div>
              </div>

              {/* Alerts */}
              {attendanceStats.consecutive_absences >= 3 && (
                <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800/50 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-red-700 dark:text-red-400">
                      {t('attendance.consecutiveAbsencesAlert')}
                    </p>
                    <p className="text-xs text-red-600 dark:text-red-500">
                      {attendanceStats.consecutive_absences} {t('attendance.consecutiveAbsences')}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Learning Progress Section */}
        {!loadingProgress && (
          <Card className="mt-6 border-border/50 cursor-pointer hover:shadow-lg transition-shadow" onClick={handleViewDetailedProgress}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-base">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  {t('progress.learningProgress')}
                </CardTitle>
                <Button variant="ghost" size="sm" className="gap-2">
                  {t('common.viewDetails')}
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
                            <p className="text-sm font-medium text-blue-700 dark:text-blue-400">{t('progress.completion')}</p>
                            <p className="text-2xl font-bold text-blue-800 dark:text-blue-300">{progressData.overall_completion_percentage}%</p>
                            <p className="text-xs text-blue-600 dark:text-blue-500">
                              {progressData.lessons_completed}/{progressData.total_lessons} {t('progress.lessons')}
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
                        <p className="text-sm font-medium text-green-700 dark:text-green-400">{t('progress.avgScore')}</p>
                        <p className="text-2xl font-bold text-green-800 dark:text-green-300">{progressData.overall_average_score}%</p>
                        <p className="text-xs text-green-600 dark:text-green-500">
                          {t('progress.acrossAllLessons')}
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
                        <p className="text-sm font-medium text-purple-700 dark:text-purple-400">{t('progress.accuracy')}</p>
                        <p className="text-2xl font-bold text-purple-800 dark:text-purple-300">{progressData.overall_accuracy_percentage}%</p>
                        <p className="text-xs text-purple-600 dark:text-purple-500">
                          {t('progress.correctAnswers')}
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
                        <p className="text-sm font-medium text-orange-700 dark:text-orange-400">{t('progress.totalExercises')}</p>
                        <p className="text-2xl font-bold text-orange-800 dark:text-orange-300">{progressData.total_exercises}</p>
                        <p className="text-xs text-orange-600 dark:text-orange-500">
                          {progressData.total_subjects} {t('progress.subjects')}
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
                    <span className="text-sm font-medium text-green-600 dark:text-green-400">{t('progress.completed')}</span>
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
                    <span className="text-sm font-medium text-blue-600 dark:text-blue-400">{t('progress.inProgress')}</span>
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
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{t('progress.notStarted')}</span>
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
      </div>
    </AdminPageLayout>
  );
};

export default ViewStudentPage;
