import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Calendar,
  Clock,
  BookOpen,
  MapPin,
  Users,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Save,
  Check,
  RotateCcw,
  UserCheck,
  UserX
} from 'lucide-react';
import TeacherPageLayout from '../../components/teacher/layout/TeacherPageLayout';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../../components/ui/dialog';
import { Switch } from '../../components/ui/switch';
import { Label } from '../../components/ui/label';
import { Input } from '../../components/ui/input';
import attendanceService from '../../services/attendance';
import { toast } from 'sonner';

const TeacherAttendancePage = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [teacherSchedule, setTeacherSchedule] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  const [isAttendanceModalOpen, setIsAttendanceModalOpen] = useState(false);
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split('T')[0]);
  const [existingAttendance, setExistingAttendance] = useState(null);
  const [students, setStudents] = useState([]);
  const [studentStatuses, setStudentStatuses] = useState({});
  const [isCreatingAttendance, setIsCreatingAttendance] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const weekDays = [
    { key: 'monday', name: t('calendar.monday'), value: 1 },
    { key: 'tuesday', name: t('calendar.tuesday'), value: 2 },
    { key: 'wednesday', name: t('calendar.wednesday'), value: 3 },
    { key: 'thursday', name: t('calendar.thursday'), value: 4 },
    { key: 'friday', name: t('calendar.friday'), value: 5 },
    { key: 'saturday', name: t('calendar.saturday'), value: 6 }
  ];

  const timeSlots = [
    { period: 1, start: '08:00', end: '09:00' },
    { period: 2, start: '09:00', end: '10:00' },
    { period: 3, start: '10:00', end: '11:00' },
    { period: 4, start: '11:20', end: '12:20' },
    { period: 5, start: '12:20', end: '13:20' },
    { period: 6, start: '14:30', end: '15:30' },
    { period: 7, start: '15:30', end: '16:30' },
    { period: 8, start: '16:30', end: '17:30' }
  ];

  useEffect(() => {
    fetchTeacherSchedule();
  }, []);

  // Check if we need to open an attendance session from navigation state (e.g., from Edit button)
  useEffect(() => {
    const openSessionFromState = async () => {
      if (location.state?.openSession && !loading) {
        const sessionToOpen = location.state.openSession;
        console.log('Opening session from state:', sessionToOpen);

        // Set the attendance date from the session
        setAttendanceDate(sessionToOpen.date);

        // Load the existing attendance
        setExistingAttendance(sessionToOpen);

        // Create a mock timetable session object for display
        const mockTimetableSession = {
          id: sessionToOpen.timetable_session?.id || sessionToOpen.timetable_session,
          class_name: sessionToOpen.timetable_session?.class_name || sessionToOpen.class_name,
          subject_name: sessionToOpen.timetable_session?.subject_name || sessionToOpen.subject_name,
          start_time: sessionToOpen.timetable_session?.start_time || '00:00',
          end_time: sessionToOpen.timetable_session?.end_time || '00:00',
          school_class_id: sessionToOpen.timetable_session?.school_class_id
        };

        setSelectedSession(mockTimetableSession);

        // Load the students for this attendance session
        try {
          await loadExistingAttendance(sessionToOpen.id);
          setIsAttendanceModalOpen(true);
        } catch (error) {
          console.error('Failed to load attendance from state:', error);
          toast.error(t('error.failedToLoadData'));
        }

        // Clear the state after opening
        window.history.replaceState({}, document.title);
      }
    };

    openSessionFromState();
  }, [location.state, loading]);

  const fetchTeacherSchedule = async () => {
    try {
      setLoading(true);
      const response = await attendanceService.getTimetableSessions({
        my_sessions: true
      });

      setTeacherSchedule({
        sessions: response.results || response || [],
        teacher_name: user?.full_name || `${user?.first_name} ${user?.last_name}`,
        teacher_id: user?.id
      });
    } catch (error) {
      console.error('Failed to fetch teacher schedule:', error);
      toast.error(t('error.failedToLoadData'));
      setTeacherSchedule({ sessions: [] });
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchTeacherSchedule();
    setRefreshing(false);
    toast.success(t('common.refreshed'));
  };

  const handleSessionClick = async (session) => {
    setSelectedSession(session);
    setAttendanceDate(new Date().toISOString().split('T')[0]);

    // Check if attendance already exists for this session and date
    try {
      const response = await attendanceService.getAttendanceSessions({
        date: new Date().toISOString().split('T')[0],
        class_id: session.school_class_id
      });

      // Find matching attendance for this specific timetable session
      const matchingAttendance = (response.results || response || []).find(
        att => att.timetable_session?.id === session.id ||
               att.timetable_session === session.id
      );

      if (matchingAttendance) {
        setExistingAttendance(matchingAttendance);
        await loadExistingAttendance(matchingAttendance.id);
      } else {
        setExistingAttendance(null);
        setStudents([]);
        setStudentStatuses({});
      }
    } catch (error) {
      console.error('Failed to check existing attendance:', error);
      setExistingAttendance(null);
      setStudents([]);
      setStudentStatuses({});
    }

    setIsAttendanceModalOpen(true);
  };

  const loadExistingAttendance = async (attendanceSessionId) => {
    try {
      const response = await attendanceService.getSessionStudents(attendanceSessionId);
      const studentsList = response.students || [];

      setStudents(studentsList);

      // Initialize statuses from existing records
      const statuses = {};
      studentsList.forEach(record => {
        statuses[record.student.id] = record.status;
      });
      setStudentStatuses(statuses);
    } catch (error) {
      console.error('Failed to load attendance records:', error);
      toast.error(t('error.failedToLoadData'));
    }
  };

  const handleCreateAttendance = async () => {
    if (!selectedSession) return;

    setIsCreatingAttendance(true);
    try {
      // Step 1: Create attendance session
      const createResponse = await attendanceService.createAttendanceSession({
        timetable_session: selectedSession.id,
        date: attendanceDate,
        notes: ''
      });

      console.log('Create response:', createResponse);

      // Extract the attendance session ID from response
      // The apiMethods.post() already returns response.data, so createResponse IS the data object
      const attendanceSessionId = createResponse.id;

      if (!attendanceSessionId) {
        console.error('No attendance session ID in response:', createResponse);
        toast.error('Failed to create attendance session');
        return;
      }

      // Step 2: Start the session (this creates student records)
      const startResponse = await attendanceService.startAttendanceSession(attendanceSessionId);
      console.log('Start response:', startResponse);

      // Step 3: Load the students
      const studentsResponse = await attendanceService.getSessionStudents(attendanceSessionId);
      const studentsList = studentsResponse.students || [];

      setStudents(studentsList);
      setExistingAttendance(createResponse);

      // Initialize all students as present by default
      const statuses = {};
      studentsList.forEach(record => {
        statuses[record.student.id] = 'present';
      });
      setStudentStatuses(statuses);

      toast.success(t('attendance.attendanceCreated'));
    } catch (error) {
      console.error('Failed to create attendance:', error);
      if (error.response?.data) {
        const errorMsg = Object.values(error.response.data).flat().join(', ');
        toast.error(errorMsg || t('error.failedToCreate'));
      } else {
        toast.error(t('error.failedToCreate'));
      }
    } finally {
      setIsCreatingAttendance(false);
    }
  };

  const toggleStudentStatus = (studentId, currentStatus) => {
    // For create mode: toggle between present and absent only
    // For edit mode: allow late and excused as well
    if (existingAttendance?.status === 'completed') {
      // Completed attendance can use all statuses
      const statusCycle = ['present', 'absent', 'late', 'excused'];
      const currentIndex = statusCycle.indexOf(currentStatus);
      const nextStatus = statusCycle[(currentIndex + 1) % statusCycle.length];
      setStudentStatuses(prev => ({ ...prev, [studentId]: nextStatus }));
    } else if (existingAttendance?.status === 'in_progress') {
      // In progress - can use late
      const statusCycle = ['present', 'absent', 'late'];
      const currentIndex = statusCycle.indexOf(currentStatus);
      const nextStatus = statusCycle[(currentIndex + 1) % statusCycle.length];
      setStudentStatuses(prev => ({ ...prev, [studentId]: nextStatus }));
    } else {
      // New attendance - only present/absent
      const newStatus = currentStatus === 'present' ? 'absent' : 'present';
      setStudentStatuses(prev => ({ ...prev, [studentId]: newStatus }));
    }
  };

  const handleSaveAttendance = async () => {
    if (!existingAttendance) return;

    setIsSaving(true);
    try {
      // Prepare bulk update data
      const records = students.map(record => ({
        student_id: record.student.id,
        status: studentStatuses[record.student.id] || 'present'
      }));

      // Bulk mark attendance
      await attendanceService.bulkMarkAttendance(existingAttendance.id, { records });

      toast.success(t('attendance.attendanceSaved'));
    } catch (error) {
      console.error('Failed to save attendance:', error);
      toast.error(t('error.failedToSave'));
    } finally {
      setIsSaving(false);
    }
  };

  const handleCompleteAttendance = async () => {
    if (!existingAttendance) return;

    setIsSaving(true);
    try {
      // First save current changes
      const records = students.map(record => ({
        student_id: record.student.id,
        status: studentStatuses[record.student.id] || 'present'
      }));

      await attendanceService.bulkMarkAttendance(existingAttendance.id, { records });

      // Then complete the session
      await attendanceService.completeAttendanceSession(existingAttendance.id);

      toast.success(t('attendance.attendanceCompleted'));
      handleCloseModal();
    } catch (error) {
      console.error('Failed to complete attendance:', error);
      toast.error(t('error.failedToComplete'));
    } finally {
      setIsSaving(false);
    }
  };

  const handleCloseModal = () => {
    setIsAttendanceModalOpen(false);
    setSelectedSession(null);
    setExistingAttendance(null);
    setStudents([]);
    setStudentStatuses({});
  };

  const getSessionForSlot = (dayValue, period) => {
    return teacherSchedule?.sessions?.find(session =>
      session.day_of_week === dayValue && session.session_order === period
    );
  };

  const getSessionTypeColor = (session) => {
    const colors = [
      'bg-blue-100 text-blue-800 border-blue-200',
      'bg-green-100 text-green-800 border-green-200',
      'bg-purple-100 text-purple-800 border-purple-200',
      'bg-orange-100 text-orange-800 border-orange-200',
      'bg-pink-100 text-pink-800 border-pink-200',
      'bg-yellow-100 text-yellow-800 border-yellow-200',
      'bg-indigo-100 text-indigo-800 border-indigo-200',
    ];
    const subjectName = session.subject_name || '';
    const hash = subjectName.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    return colors[Math.abs(hash) % colors.length];
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'present':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'absent':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'late':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'excused':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'present':
        return <CheckCircle2 className="h-5 w-5" />;
      case 'absent':
        return <XCircle className="h-5 w-5" />;
      case 'late':
        return <Clock className="h-5 w-5" />;
      case 'excused':
        return <AlertCircle className="h-5 w-5" />;
      default:
        return <CheckCircle2 className="h-5 w-5" />;
    }
  };

  const getStatusLabel = (status) => {
    const labels = {
      present: t('attendance.present'),
      absent: t('attendance.absent'),
      late: t('attendance.late'),
      excused: t('attendance.excused')
    };
    return labels[status] || status;
  };

  const ActionButtons = () => (
    <div className="flex gap-2">
      <Button
        variant="outline"
        onClick={handleRefresh}
        disabled={refreshing}
        className="flex items-center gap-2"
      >
        <RotateCcw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
        {t('common.refresh')}
      </Button>
    </div>
  );

  if (loading) {
    return (
      <TeacherPageLayout
        title={t('attendance.title')}
        subtitle={t('attendance.subtitle')}
        actions={[<ActionButtons key="action-buttons" />]}
      >
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm text-muted-foreground">{t('common.loading')}</p>
          </div>
        </div>
      </TeacherPageLayout>
    );
  }

  return (
    <TeacherPageLayout
      title={t('attendance.title')}
      subtitle={t('attendance.subtitle')}
      actions={[<ActionButtons key="action-buttons" />]}
    >
      <div className="space-y-6">
        {/* Instructions */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <Users className="h-5 w-5 text-blue-500 mt-0.5" />
              <div>
                <h3 className="font-medium mb-1">{t('attendance.instructions')}</h3>
                <p className="text-sm text-muted-foreground">
                  {t('attendance.instructionsText')}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Timetable Grid */}
        {!teacherSchedule?.sessions || teacherSchedule.sessions.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <AlertCircle className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {t('timetables.noSessions')}
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                {t('timetables.noSessionsDescription')}
              </p>
              <Button onClick={handleRefresh} variant="outline">
                <RotateCcw className="h-4 w-4 mr-2" />
                {t('common.refresh')}
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-500" />
                {t('attendance.selectSession')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <div className="min-w-[1200px]">
                  {/* Header */}
                  <div className="grid grid-cols-9 gap-2 mb-4">
                    <div className="p-3 bg-muted/50 rounded text-center font-medium text-sm flex items-center justify-center">
                      {t('calendar.day')}
                    </div>
                    {timeSlots.map((slot) => (
                      <div key={slot.period} className="p-3 bg-muted/50 rounded text-center">
                        <div className="font-medium text-sm">{t('timetables.period')} {slot.period}</div>
                        <div className="text-xs text-muted-foreground">{slot.start} - {slot.end}</div>
                      </div>
                    ))}
                  </div>

                  {/* Days Rows */}
                  {weekDays.slice(0, 6).map((day) => (
                    <div key={day.key} className="grid grid-cols-9 gap-2 mb-2">
                      {/* Day Column */}
                      <div className="p-3 bg-muted/30 rounded text-center flex items-center justify-center">
                        <div className="text-sm font-medium">
                          {day.name}
                        </div>
                      </div>

                      {/* Periods */}
                      {timeSlots.map((slot) => {
                        const session = getSessionForSlot(day.value, slot.period);

                        return (
                          <div key={slot.period} className="min-h-[110px] p-1">
                            {session ? (
                              <div
                                className={`p-2 rounded border h-full cursor-pointer hover:opacity-80 hover:shadow-md transition-all ${getSessionTypeColor(session)}`}
                                onClick={() => handleSessionClick(session)}
                              >
                                <div className="text-xs font-bold mb-1 truncate">
                                  {session.class_name}
                                </div>
                                <div className="space-y-1 text-[11px]">
                                  <div className="flex items-center gap-1">
                                    <BookOpen className="h-3 w-3 flex-shrink-0" />
                                    <span className="truncate">{session.subject_name}</span>
                                  </div>
                                  {session.room_name && (
                                    <div className="flex items-center gap-1">
                                      <MapPin className="h-3 w-3 flex-shrink-0" />
                                      <span className="truncate">{session.room_name}</span>
                                    </div>
                                  )}
                                  <div className="flex items-center gap-1">
                                    <Clock className="h-3 w-3 flex-shrink-0" />
                                    <span>{session.start_time}-{session.end_time}</span>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div className="h-full w-full"></div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Attendance Modal */}
      <Dialog open={isAttendanceModalOpen} onOpenChange={setIsAttendanceModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-500" />
              {t('attendance.takeAttendance')}
            </DialogTitle>
            <DialogDescription>
              {selectedSession && (
                <div className="space-y-2 mt-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4" />
                    <span className="font-medium">{selectedSession.class_name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <BookOpen className="h-4 w-4" />
                    <span>{selectedSession.subject_name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4" />
                    <span>{selectedSession.start_time} - {selectedSession.end_time}</span>
                  </div>
                </div>
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Date Selection */}
            <div className="space-y-2">
              <Label htmlFor="attendance-date">{t('attendance.date')}</Label>
              <Input
                id="attendance-date"
                type="date"
                value={attendanceDate}
                onChange={(e) => setAttendanceDate(e.target.value)}
                disabled={!!existingAttendance}
              />
            </div>

            {/* Create Attendance Button */}
            {!existingAttendance && (
              <Button
                onClick={handleCreateAttendance}
                disabled={isCreatingAttendance}
                className="w-full"
              >
                {isCreatingAttendance ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    {t('attendance.creating')}
                  </>
                ) : (
                  <>
                    <UserCheck className="h-4 w-4 mr-2" />
                    {t('attendance.createAttendance')}
                  </>
                )}
              </Button>
            )}

            {/* Status Badge */}
            {existingAttendance && (
              <div className="flex items-center gap-2">
                <Badge variant={existingAttendance.status === 'completed' ? 'success' : 'default'}>
                  {existingAttendance.status}
                </Badge>
                {existingAttendance.status === 'completed' && (
                  <span className="text-xs text-muted-foreground">
                    {t('attendance.canStillEdit')}
                  </span>
                )}
              </div>
            )}

            {/* Students List */}
            {students.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-medium flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  {t('attendance.studentsList')} ({students.length})
                </h4>

                <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
                  {students.map((record, index) => {
                    const status = studentStatuses[record.student.id] || record.status;

                    return (
                      <motion.div
                        key={record.student.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2, delay: index * 0.02 }}
                        className={`p-3 rounded-lg border-2 transition-all ${getStatusColor(status)}`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-full ${getStatusColor(status)}`}>
                              {getStatusIcon(status)}
                            </div>
                            <div>
                              <div className="font-medium">
                                {record.student.full_name}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {record.student.email}
                              </div>
                            </div>
                          </div>

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toggleStudentStatus(record.student.id, status)}
                            className="min-w-[100px]"
                          >
                            {getStatusLabel(status)}
                          </Button>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Summary */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pt-4 border-t">
                  <div className="text-center p-2 bg-green-50 rounded">
                    <div className="text-lg font-bold text-green-700">
                      {Object.values(studentStatuses).filter(s => s === 'present').length}
                    </div>
                    <div className="text-xs text-green-600">{t('attendance.present')}</div>
                  </div>
                  <div className="text-center p-2 bg-red-50 rounded">
                    <div className="text-lg font-bold text-red-700">
                      {Object.values(studentStatuses).filter(s => s === 'absent').length}
                    </div>
                    <div className="text-xs text-red-600">{t('attendance.absent')}</div>
                  </div>
                  <div className="text-center p-2 bg-yellow-50 rounded">
                    <div className="text-lg font-bold text-yellow-700">
                      {Object.values(studentStatuses).filter(s => s === 'late').length}
                    </div>
                    <div className="text-xs text-yellow-600">{t('attendance.late')}</div>
                  </div>
                  <div className="text-center p-2 bg-blue-50 rounded">
                    <div className="text-lg font-bold text-blue-700">
                      {Object.values(studentStatuses).filter(s => s === 'excused').length}
                    </div>
                    <div className="text-xs text-blue-600">{t('attendance.excused')}</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          {existingAttendance && students.length > 0 && (
            <DialogFooter className="flex gap-2">
              <Button variant="outline" onClick={handleCloseModal}>
                {t('common.cancel')}
              </Button>
              <Button
                variant="outline"
                onClick={handleSaveAttendance}
                disabled={isSaving}
              >
                {isSaving ? (
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2"></div>
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                {t('common.save')}
              </Button>
              {existingAttendance.status !== 'completed' && (
                <Button
                  onClick={handleCompleteAttendance}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  ) : (
                    <Check className="h-4 w-4 mr-2" />
                  )}
                  {t('attendance.complete')}
                </Button>
              )}
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>
    </TeacherPageLayout>
  );
};

export default TeacherAttendancePage;
