import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Save, 
  ArrowLeft, 
  Plus,
  Trash2,
  Clock,
  Users,
  BookOpen,
  MapPin,
  User,
  AlertTriangle,
  Copy,
  Upload,
  FileText,
  Zap,
  Edit,
  Eye,
  RefreshCw
} from 'lucide-react';
import AdminPageLayout from '../../components/admin/layout/AdminPageLayout';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '../../components/ui/select';
import { Textarea } from '../../components/ui/textarea';
import { Checkbox } from '../../components/ui/checkbox';
import attendanceService from '../../services/attendance';
import { apiMethods } from '../../services/api';
import { toast } from 'sonner';

const EditTimetablePage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  
  // Form data
  const [formData, setFormData] = useState({
    school_class: '',
    academic_year: '',
    is_active: true
  });

  // Class teacher assignment state
  const [classTeachers, setClassTeachers] = useState([]);
  const [availableTeachers, setAvailableTeachers] = useState([]);

  // Reference data
  const [classes, setClasses] = useState([]);
  const [academicYears, setAcademicYears] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [rooms, setRooms] = useState([]);

  // Sessions
  const [sessions, setSessions] = useState([]);
  const [originalSessions, setOriginalSessions] = useState([]);
  const [editingSession, setEditingSession] = useState(null);

  // attendanceService is already imported as a singleton

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
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [timetableResponse, classesResponse, academicYearsResponse, subjectsResponse, teachersResponse, roomsResponse] = await Promise.all([
        attendanceService.getTimetableById(id),
        apiMethods.get('schools/classes/'),
        apiMethods.get('schools/academic-years/'),
        apiMethods.get('schools/subjects/'),
        apiMethods.get('users/users/', { params: { role: 'TEACHER' } }),
        apiMethods.get('schools/rooms/')
      ]);

      // Set timetable data
      const timetable = timetableResponse;
      setFormData({
        school_class: timetable.school_class?.toString() || '',
        academic_year: timetable.academic_year?.toString() || '',
        is_active: timetable.is_active
      });

      // Set sessions (convert null rooms to 'none' for UI)
      const timetableSessions = (timetable.sessions || []).map(session => ({
        ...session,
        room: session.room || 'none'
      }));
      setSessions(timetableSessions);
      setOriginalSessions([...timetableSessions]);

      // Set reference data
      let classesData = classesResponse.results || (Array.isArray(classesResponse) ? classesResponse : classesResponse.data?.results || classesResponse.data || []);
      let academicYearsData = academicYearsResponse.results || (Array.isArray(academicYearsResponse) ? academicYearsResponse : academicYearsResponse.data?.results || academicYearsResponse.data || []);
      let subjectsData = subjectsResponse.results || (Array.isArray(subjectsResponse) ? subjectsResponse : subjectsResponse.data?.results || subjectsResponse.data || []);
      let teachersData = teachersResponse.results || (Array.isArray(teachersResponse) ? teachersResponse : teachersResponse.data?.results || teachersResponse.data || []);
      let roomsData = roomsResponse.results || (Array.isArray(roomsResponse) ? roomsResponse : roomsResponse.data?.results || roomsResponse.data || []);

      setClasses(classesData);
      setAcademicYears(academicYearsData);
      setSubjects(subjectsData);
      setTeachers(teachersData);
      setRooms(roomsData);

      // Load class teachers if class is selected
      if (timetable.school_class) {
        await fetchClassTeachers(timetable.school_class.toString());
      }

    } catch (error) {
      console.error('Failed to fetch data:', error);
      toast.error(t('error.failedToLoadData'));
      navigate('/admin/timetables');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }

    // When class changes, fetch its current teachers
    if (name === 'school_class' && value) {
      fetchClassTeachers(value);
    }
  };

  const fetchClassTeachers = async (classId) => {
    try {
      const classResponse = await apiMethods.get(`schools/classes/${classId}/`);
      const classData = classResponse.data || classResponse;

      setClassTeachers(classData.teachers || []);

      // Get available teachers for assignment (not already assigned to this class)
      const assignedTeacherIds = (classData.teachers || []).map(t => t.id);
      const availableTeachersForAssignment = teachers.filter(t => !assignedTeacherIds.includes(t.id));
      setAvailableTeachers(availableTeachersForAssignment);

    } catch (error) {
      console.error('Failed to fetch class teachers:', error);
      setClassTeachers([]);
      setAvailableTeachers(teachers);
    }
  };

  const assignTeacherToClass = async (teacherId) => {
    if (!formData.school_class) {
      toast.error('Please select a class first');
      return;
    }

    try {
      const classResponse = await apiMethods.get(`schools/classes/${formData.school_class}/`);
      const classData = classResponse.data || classResponse;

      const currentTeacherIds = (classData.teachers || []).map(t => t.id);
      const updatedTeacherIds = [...currentTeacherIds, parseInt(teacherId)];

      await apiMethods.patch(`schools/classes/${formData.school_class}/`, {
        teachers: updatedTeacherIds
      });

      // Refresh the class teachers
      await fetchClassTeachers(formData.school_class);
      toast.success('Teacher assigned to class successfully');

    } catch (error) {
      console.error('Failed to assign teacher to class:', error);
      toast.error('Failed to assign teacher to class');
    }
  };

  const removeTeacherFromClass = async (teacherId) => {
    if (!formData.school_class) return;

    try {
      const classResponse = await apiMethods.get(`schools/classes/${formData.school_class}/`);
      const classData = classResponse.data || classResponse;

      const currentTeacherIds = (classData.teachers || []).map(t => t.id);
      const updatedTeacherIds = currentTeacherIds.filter(id => id !== teacherId);

      await apiMethods.patch(`schools/classes/${formData.school_class}/`, {
        teachers: updatedTeacherIds
      });

      // Refresh the class teachers
      await fetchClassTeachers(formData.school_class);
      toast.success('Teacher removed from class successfully');

    } catch (error) {
      console.error('Failed to remove teacher from class:', error);
      toast.error('Failed to remove teacher from class');
    }
  };

  const addSession = () => {
    const newSession = {
      id: `new_${Date.now()}`, // Temporary ID for new sessions
      day_of_week: 1,
      session_order: 1,
      start_time: '08:00',
      end_time: '09:00',
      subject: '',
      teacher: '',
      room: 'none',
      notes: '',
      is_new: true
    };
    setSessions(prev => [...prev, newSession]);
  };

  const updateSession = (sessionId, field, value) => {
    setSessions(prev => prev.map(session => 
      session.id === sessionId 
        ? { ...session, [field]: value, is_modified: !session.is_new }
        : session
    ));
  };

  const removeSession = (sessionId) => {
    const session = sessions.find(s => s.id === sessionId);
    if (session?.is_new) {
      // Remove new sessions immediately
      setSessions(prev => prev.filter(s => s.id !== sessionId));
    } else {
      // Mark existing sessions for deletion
      setSessions(prev => prev.map(s => 
        s.id === sessionId 
          ? { ...s, is_deleted: true }
          : s
      ));
    }
  };

  const restoreSession = (sessionId) => {
    setSessions(prev => prev.map(session => 
      session.id === sessionId 
        ? { ...session, is_deleted: false }
        : session
    ));
  };

  const resetChanges = () => {
    setSessions([...originalSessions]);
    setErrors({});
    toast.info(t('timetables.changesReset'));
  };

  const validateSessions = () => {
    const newErrors = {};
    const activeSessions = sessions.filter(s => !s.is_deleted);
    
    activeSessions.forEach((session, index) => {
      if (!session.subject) {
        newErrors[`session_${session.id}_subject`] = t('timetables.validation.subjectRequired');
      }
      if (!session.teacher) {
        newErrors[`session_${session.id}_teacher`] = t('timetables.validation.teacherRequired');
      }
      
      // Check for conflicts
      const conflictingSessions = activeSessions.filter((s, i) => 
        i !== index && 
        s.day_of_week === session.day_of_week && 
        s.session_order === session.session_order
      );
      
      if (conflictingSessions.length > 0) {
        newErrors[`session_${session.id}_conflict`] = t('timetables.validation.sessionConflict');
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateSessions()) {
      toast.error(t('validation.pleaseFixErrors'));
      return;
    }

    setSaving(true);
    try {
      // Update timetable basic info
      const timetableData = {
        school_class: parseInt(formData.school_class),
        academic_year: parseInt(formData.academic_year),
        is_active: formData.is_active
      };

      await attendanceService.updateTimetable(id, timetableData);

      // Handle sessions
      const promises = [];

      // Delete removed sessions
      const sessionsToDelete = sessions.filter(s => s.is_deleted && !s.is_new);
      for (const session of sessionsToDelete) {
        promises.push(attendanceService.deleteTimetableSession(session.id));
      }

      // Update modified sessions
      const sessionsToUpdate = sessions.filter(s => s.is_modified && !s.is_deleted && !s.is_new);
      for (const session of sessionsToUpdate) {
        const sessionData = {
          timetable: parseInt(id),
          day_of_week: session.day_of_week,
          session_order: session.session_order,
          start_time: session.start_time,
          end_time: session.end_time,
          subject: parseInt(session.subject),
          teacher: parseInt(session.teacher),
          room: (session.room && session.room !== 'none') ? parseInt(session.room) : null,
          notes: session.notes || '',
          is_active: true
        };
        promises.push(attendanceService.updateTimetableSession(session.id, sessionData));
      }

      // Create new sessions
      const sessionsToCreate = sessions.filter(s => s.is_new && !s.is_deleted);
      for (const session of sessionsToCreate) {
        const sessionData = {
          timetable: parseInt(id),
          day_of_week: session.day_of_week,
          session_order: session.session_order,
          start_time: session.start_time,
          end_time: session.end_time,
          subject: parseInt(session.subject),
          teacher: parseInt(session.teacher),
          room: (session.room && session.room !== 'none') ? parseInt(session.room) : null,
          notes: session.notes || '',
          is_active: true
        };
        promises.push(attendanceService.createTimetableSession(sessionData));
      }

      await Promise.all(promises);

      toast.success(t('timetables.updateSuccess'));
      navigate('/admin/timetables');
    } catch (error) {
      console.error('Failed to update timetable:', error);
      if (error.response?.data) {
        const apiErrors = error.response.data;
        const newErrors = {};
        Object.keys(apiErrors).forEach(key => {
          newErrors[key] = Array.isArray(apiErrors[key]) ? apiErrors[key][0] : apiErrors[key];
        });
        setErrors(newErrors);
        toast.error(t('timetables.updateError'));
      } else {
        toast.error(t('error.unexpected'));
      }
    } finally {
      setSaving(false);
    }
  };

  const getSessionForSlot = (dayValue, period) => {
    return sessions.find(session => 
      session.day_of_week === dayValue && 
      session.session_order === period &&
      !session.is_deleted
    );
  };

  const getSessionStatusColor = (session) => {
    if (session.is_deleted) return 'bg-red-100 border-red-300 opacity-50';
    if (session.is_new) return 'bg-green-100 border-green-300';
    if (session.is_modified) return 'bg-yellow-100 border-yellow-300';
    return 'bg-blue-100 border-blue-300';
  };

  const ActionButtons = () => (
    <div className="flex gap-2">
      <Button
        variant="outline"
        onClick={() => navigate('/admin/timetables')}
        className="flex items-center gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        {t('common.back')}
      </Button>
      <Button
        variant="outline"
        onClick={() => navigate(`/admin/timetables/view/${id}`)}
      >
        <Eye className="h-4 w-4 mr-2" />
        {t('common.view')}
      </Button>
    </div>
  );

  if (loading) {
    return (
      <AdminPageLayout
        title={t('timetables.editTimetable')}
        subtitle={t('timetables.modifyTimetable')}
        ActionComponent={ActionButtons}
      >
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center gap-2">
            <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-sm text-muted-foreground">{t('common.loading')}</p>
          </div>
        </div>
      </AdminPageLayout>
    );
  }

  const hasChanges = sessions.some(s => s.is_new || s.is_modified || s.is_deleted);
  const activeSessions = sessions.filter(s => !s.is_deleted);

  return (
    <AdminPageLayout
      title={t('timetables.editTimetable')}
      subtitle={t('timetables.modifyTimetable')}
      ActionComponent={ActionButtons}
    >
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Changes Alert */}
        {hasChanges && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                <p className="text-sm font-medium text-yellow-800">
                  {t('timetables.unsavedChanges')}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={resetChanges}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                {t('common.reset')}
              </Button>
            </div>
          </motion.div>
        )}

        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              {t('timetables.basicInformation')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Class Selection */}
              <div className="space-y-2">
                <Label htmlFor="school_class" className="text-sm font-medium">
                  {t('classes.class')} <span className="text-red-500">*</span>
                </Label>
                <Select 
                  value={formData.school_class || ""} 
                  onValueChange={(value) => handleInputChange('school_class', value || null)}
                >
                  <SelectTrigger className={errors.school_class ? 'border-red-500' : ''}>
                    <SelectValue placeholder={t('classes.selectClass')} />
                  </SelectTrigger>
                  <SelectContent>
                    {classes.map((cls) => (
                      <SelectItem key={cls.id} value={cls.id.toString()}>
                        {cls.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.school_class && (
                  <p className="text-sm text-red-600">{errors.school_class}</p>
                )}
              </div>

              {/* Academic Year Selection */}
              <div className="space-y-2">
                <Label htmlFor="academic_year" className="text-sm font-medium">
                  {t('classes.academicYear')} <span className="text-red-500">*</span>
                </Label>
                <Select 
                  value={formData.academic_year || ""} 
                  onValueChange={(value) => handleInputChange('academic_year', value || null)}
                >
                  <SelectTrigger className={errors.academic_year ? 'border-red-500' : ''}>
                    <SelectValue placeholder={t('classes.selectAcademicYear')} />
                  </SelectTrigger>
                  <SelectContent>
                    {academicYears.map((year) => (
                      <SelectItem key={year.id} value={year.id.toString()}>
                        {year.year} {year.is_current ? `(${t('common.current')})` : ''}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.academic_year && (
                  <p className="text-sm text-red-600">{errors.academic_year}</p>
                )}
              </div>
            </div>

            {/* Active Status */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => handleInputChange('is_active', checked)}
              />
              <Label htmlFor="is_active" className="text-sm font-medium">
                {t('timetables.setAsActive')}
              </Label>
            </div>
          </CardContent>
        </Card>

        {/* Teacher Assignment Section */}
        {formData.school_class && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-green-600" />
                {t('timetables.classTeachers') || 'Class Teachers'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Current Teachers */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  {t('timetables.assignedTeachers') || 'Assigned Teachers'} ({classTeachers.length})
                </Label>
                {classTeachers.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {classTeachers.map((teacher) => (
                      <Badge
                        key={teacher.id}
                        variant="secondary"
                        className="flex items-center gap-2 px-3 py-1"
                      >
                        <User className="h-3 w-3" />
                        {teacher.name}
                        {teacher.subject && (
                          <span className="text-xs text-muted-foreground">
                            ({teacher.subject})
                          </span>
                        )}
                        <button
                          onClick={() => removeTeacherFromClass(teacher.id)}
                          className="ml-1 text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    {t('timetables.noTeachersAssigned') || 'No teachers assigned to this class yet.'}
                  </p>
                )}
              </div>

              {/* Add Teacher */}
              {availableTeachers.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    {t('timetables.assignTeacher') || 'Assign Teacher'}
                  </Label>
                  <div className="flex gap-2">
                    <Select onValueChange={(value) => value && assignTeacherToClass(value)}>
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder={t('teachers.selectTeacher') || 'Select a teacher to assign'} />
                      </SelectTrigger>
                      <SelectContent>
                        {availableTeachers.map((teacher) => (
                          <SelectItem key={teacher.id} value={teacher.id.toString()}>
                            <div className="flex items-center gap-2">
                              <User className="h-4 w-4" />
                              <span>{teacher.full_name}</span>
                              {teacher.profile?.school_subject && (
                                <Badge variant="outline" className="ml-2 text-xs">
                                  {teacher.profile.school_subject.name}
                                </Badge>
                              )}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {availableTeachers.length === 0 && teachers.length > 0 && (
                <p className="text-sm text-muted-foreground">
                  {t('timetables.allTeachersAssigned') || 'All teachers are already assigned to this class.'}
                </p>
              )}
            </CardContent>
          </Card>
        )}

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-purple-600" />
              {t('timetables.quickActions')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                onClick={addSession}
              >
                <Plus className="h-4 w-4 mr-2" />
                {t('timetables.addSession')}
              </Button>
              <Button
                variant="outline"
                onClick={() => toast.info(t('common.featureComingSoon'))}
              >
                <Copy className="h-4 w-4 mr-2" />
                {t('timetables.copyFromAnother')}
              </Button>
              <Button
                variant="outline"
                onClick={() => toast.info(t('common.featureComingSoon'))}
              >
                <Upload className="h-4 w-4 mr-2" />
                {t('timetables.importSessions')}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Timetable Grid */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              {t('timetables.weeklySchedule')} ({activeSessions.length} {t('timetables.sessions')})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <div className="min-w-[800px]">
                {/* Header */}
                <div className="grid grid-cols-7 gap-2 mb-4">
                  <div className="p-3 bg-muted/50 rounded text-center font-medium text-sm">
                    {t('timetables.period')}
                  </div>
                  {weekDays.slice(0, 6).map((day) => (
                    <div key={day.key} className="p-3 bg-muted/50 rounded text-center">
                      <div className="font-medium text-sm">{day.name}</div>
                    </div>
                  ))}
                </div>

                {/* Time Slots */}
                {timeSlots.map((slot) => (
                  <div key={slot.period} className="grid grid-cols-7 gap-2 mb-2">
                    {/* Period Column */}
                    <div className="p-3 bg-muted/30 rounded text-center">
                      <div className="text-sm font-medium">
                        {t('timetables.period')} {slot.period}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {slot.start} - {slot.end}
                      </div>
                    </div>

                    {/* Days */}
                    {weekDays.slice(0, 6).map((day) => {
                      const session = getSessionForSlot(day.value, slot.period);
                      const deletedSession = sessions.find(s => 
                        s.day_of_week === day.value && 
                        s.session_order === slot.period && 
                        s.is_deleted
                      );
                      
                      return (
                        <div key={day.key} className="min-h-[80px] p-1">
                          {session ? (
                            <div className={`p-2 border rounded h-full relative ${getSessionStatusColor(session)}`}>
                              <div className="flex justify-between items-start mb-1">
                                <div className="text-xs font-medium">
                                  {subjects.find(s => s.id.toString() === session.subject)?.name || 'Subject'}
                                </div>
                                <div className="flex gap-1">
                                  {session.is_new && <Badge className="text-xs bg-green-600">New</Badge>}
                                  {session.is_modified && <Badge className="text-xs bg-yellow-600">Modified</Badge>}
                                  <button
                                    onClick={() => removeSession(session.id)}
                                    className="p-1 text-red-600 hover:bg-red-100 rounded"
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </button>
                                </div>
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {teachers.find(t => t.id.toString() === session.teacher)?.full_name || 'Teacher'}
                              </div>
                            </div>
                          ) : deletedSession ? (
                            <div className="p-2 border border-red-300 bg-red-50 rounded h-full relative opacity-50">
                              <div className="text-xs text-red-800 font-medium mb-1">Deleted Session</div>
                              <button
                                onClick={() => restoreSession(deletedSession.id)}
                                className="text-xs text-red-600 hover:text-red-800"
                              >
                                {t('common.restore')}
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => {
                                const newSession = {
                                  id: `new_${Date.now()}`,
                                  day_of_week: day.value,
                                  session_order: slot.period,
                                  start_time: slot.start,
                                  end_time: slot.end,
                                  subject: '',
                                  teacher: '',
                                  room: 'none',
                                  notes: '',
                                  is_new: true
                                };
                                setSessions(prev => [...prev, newSession]);
                              }}
                              className="w-full h-full border-2 border-dashed border-gray-200 rounded flex items-center justify-center hover:border-blue-300 hover:bg-blue-50/30 transition-all"
                            >
                              <Plus className="h-4 w-4 text-gray-400" />
                            </button>
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

        {/* Sessions List */}
        {activeSessions.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-blue-600" />
                {t('timetables.sessionDetails')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activeSessions.map((session, index) => (
                  <motion.div 
                    key={session.id} 
                    className={`p-4 border rounded-lg ${getSessionStatusColor(session)}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">
                          {weekDays.find(d => d.value === session.day_of_week)?.name}
                        </Badge>
                        <Badge variant="outline">
                          {t('timetables.period')} {session.session_order}
                        </Badge>
                        <Badge variant="outline">
                          {session.start_time} - {session.end_time}
                        </Badge>
                        {session.is_new && (
                          <Badge className="bg-green-600 text-white">
                            {t('common.new')}
                          </Badge>
                        )}
                        {session.is_modified && (
                          <Badge className="bg-yellow-600 text-white">
                            {t('common.modified')}
                          </Badge>
                        )}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeSession(session.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {/* Subject */}
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">
                          {t('subjects.subject')} <span className="text-red-500">*</span>
                        </Label>
                        <Select 
                          value={session.subject || ""} 
                          onValueChange={(value) => updateSession(session.id, 'subject', value)}
                        >
                          <SelectTrigger className={errors[`session_${session.id}_subject`] ? 'border-red-500' : ''}>
                            <SelectValue placeholder={t('subjects.selectSubject')} />
                          </SelectTrigger>
                          <SelectContent>
                            {subjects.map((subject) => (
                              <SelectItem key={subject.id} value={subject.id.toString()}>
                                {subject.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors[`session_${session.id}_subject`] && (
                          <p className="text-xs text-red-600">{errors[`session_${session.id}_subject`]}</p>
                        )}
                      </div>

                      {/* Teacher */}
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">
                          {t('teachers.teacher')} <span className="text-red-500">*</span>
                        </Label>
                        <Select 
                          value={session.teacher || ""} 
                          onValueChange={(value) => updateSession(session.id, 'teacher', value)}
                        >
                          <SelectTrigger className={errors[`session_${session.id}_teacher`] ? 'border-red-500' : ''}>
                            <SelectValue placeholder={t('teachers.selectTeacher')} />
                          </SelectTrigger>
                          <SelectContent>
                            {teachers.map((teacher) => (
                              <SelectItem key={teacher.id} value={teacher.id.toString()}>
                                {teacher.full_name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors[`session_${session.id}_teacher`] && (
                          <p className="text-xs text-red-600">{errors[`session_${session.id}_teacher`]}</p>
                        )}
                      </div>

                      {/* Room */}
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">
                          {t('rooms.room')}
                        </Label>
                        <Select 
                          value={session.room || ""} 
                          onValueChange={(value) => updateSession(session.id, 'room', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder={t('rooms.selectRoom')} />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">{t('common.none')}</SelectItem>
                            {rooms.map((room) => (
                              <SelectItem key={room.id} value={room.id.toString()}>
                                {room.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Notes */}
                      <div className="space-y-2">
                        <Label className="text-sm font-medium">
                          {t('common.notes')}
                        </Label>
                        <Input
                          value={session.notes || ''}
                          onChange={(e) => updateSession(session.id, 'notes', e.target.value)}
                          placeholder={t('timetables.sessionNotes')}
                        />
                      </div>
                    </div>

                    {/* Conflict Warning */}
                    {errors[`session_${session.id}_conflict`] && (
                      <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4 text-red-600" />
                        <p className="text-sm text-red-600">{errors[`session_${session.id}_conflict`]}</p>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Save Actions */}
        <div className="flex justify-end gap-3 pt-6 border-t">
          <Button
            variant="outline"
            onClick={() => navigate('/admin/timetables')}
          >
            {t('common.cancel')}
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={saving || !hasChanges}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
          >
            {saving ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                {t('common.saving')}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                {t('timetables.saveChanges')}
              </div>
            )}
          </Button>
        </div>
      </div>
    </AdminPageLayout>
  );
};

export default EditTimetablePage;