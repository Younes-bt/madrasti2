import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Save, 
  ArrowLeft, 
  Plus,
  Trash2,
  Clock,
  Copy,
  Upload,
  Zap,
  User,
  Users
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
import { Checkbox } from '../../components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
  DialogClose,
} from '../../components/ui/dialog';
import attendanceService from '../../services/attendance';
import { apiMethods } from '../../services/api';
import { toast } from 'sonner';

const AddTimetablePage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  
  const [formData, setFormData] = useState({
    school_class: '',
    academic_year: '',
    is_active: true
  });

  // Class teacher assignment state
  const [classTeachers, setClassTeachers] = useState([]);
  const [availableTeachers, setAvailableTeachers] = useState([]);

  const [classes, setClasses] = useState([]);
  const [academicYears, setAcademicYears] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [filteredTeachers, setFilteredTeachers] = useState([]);
  const [rooms, setRooms] = useState([]);

  const [sessions, setSessions] = useState([]);
  const [currentStep, setCurrentStep] = useState(1);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  const [modalSessionData, setModalSessionData] = useState(null);

  const weekDays = [
    { key: 'monday', name: t('calendar.monday'), value: 1 },
    { key: 'tuesday', name: t('calendar.tuesday'), value: 2 },
    { key: 'wednesday', name: t('calendar.wednesday'), value: 3 },
    { key: 'thursday', name: t('calendar.thursday'), value: 4 },
    { key: 'friday', name: t('calendar.friday'), value: 5 },
    { key: 'saturday', name: t('calendar.saturday'), value: 6 }
  ];

  const [timeSlots, setTimeSlots] = useState([
    { period: 1, start: '08:00', end: '09:00' },
    { period: 2, start: '09:00', end: '10:00' },
    { period: 3, start: '10:00', end: '11:00' },
    { period: 4, start: '11:20', end: '12:20' },
    { period: 5, start: '12:20', end: '13:20' },
    { period: 6, start: '14:30', end: '15:30' },
    { period: 7, start: '15:30', end: '16:30' },
    { period: 8, start: '16:30', end: '17:30' }
  ]);

  const periodTemplates = {
    continuous: {
      name: t('timetables.templates.continuous') || 'Continuous Schedule',
      description: t('timetables.templates.continuousDesc') || 'Standard continuous periods with breaks',
      periods: [
        { period: 1, start: '08:00', end: '09:00' },
        { period: 2, start: '09:00', end: '10:00' },
        { period: 3, start: '10:00', end: '11:00' },
        { period: 4, start: '11:20', end: '12:20' },
        { period: 5, start: '12:20', end: '13:20' },
        { period: 6, start: '14:30', end: '15:30' },
        { period: 7, start: '15:30', end: '16:30' },
        { period: 8, start: '16:30', end: '17:30' }
      ]
    },
    morningEvening: {
      name: t('timetables.templates.morningEvening') || 'Morning & Evening',
      description: t('timetables.templates.morningEveningDesc') || 'Separate morning and evening sessions',
      periods: [
        { period: 1, start: '08:00', end: '09:00' },
        { period: 2, start: '09:00', end: '10:00' },
        { period: 3, start: '10:00', end: '11:00' },
        { period: 4, start: '11:00', end: '12:00' },
        { period: 5, start: '14:00', end: '15:00' },
        { period: 6, start: '15:00', end: '16:00' },
        { period: 7, start: '16:00', end: '17:00' },
        { period: 8, start: '17:00', end: '18:00' }
      ]
    },
    shortPeriods: {
      name: t('timetables.templates.shortPeriods') || 'Short Periods',
      description: t('timetables.templates.shortPeriodsDesc') || '45-minute periods with breaks',
      periods: [
        { period: 1, start: '08:00', end: '08:45' },
        { period: 2, start: '08:45', end: '09:30' },
        { period: 3, start: '09:45', end: '10:30' },
        { period: 4, start: '10:30', end: '11:15' },
        { period: 5, start: '11:15', end: '12:00' },
        { period: 6, start: '12:45', end: '13:30' },
        { period: 7, start: '13:30', end: '14:15' },
        { period: 8, start: '14:15', end: '15:00' }
      ]
    },
    custom: {
      name: t('timetables.templates.custom') || 'Custom',
      description: t('timetables.templates.customDesc') || 'Create your own period schedule',
      periods: []
    }
  };

  const [selectedTemplate, setSelectedTemplate] = useState('continuous');
  const [showPeriodConfig, setShowPeriodConfig] = useState(false);

  useEffect(() => {
    fetchReferenceData();
  }, []);

  useEffect(() => {
    setModalSessionData(selectedSession);
  }, [selectedSession]);

  const applyTemplate = (templateKey) => {
    if (periodTemplates[templateKey]) {
      setTimeSlots(periodTemplates[templateKey].periods);
      setSelectedTemplate(templateKey);
      setSessions([]);
      toast.success(t('timetables.templateApplied') || 'Template applied successfully');
    }
  };

  const addPeriod = () => {
    const maxPeriod = Math.max(...timeSlots.map(slot => slot.period), 0);
    const lastSlot = timeSlots[timeSlots.length - 1];
    const newPeriod = {
      period: maxPeriod + 1,
      start: lastSlot ? lastSlot.end : '08:00',
      end: lastSlot ? addHour(lastSlot.end) : '09:00'
    };
    setTimeSlots([...timeSlots, newPeriod]);
  };

  const removePeriod = (periodNumber) => {
    if (timeSlots.length > 1) {
      setTimeSlots(timeSlots.filter(slot => slot.period !== periodNumber));
      setSessions(sessions.filter(session => session.session_order !== periodNumber));
    }
  };

  const updatePeriod = (periodNumber, field, value) => {
    setTimeSlots(timeSlots.map(slot => 
      slot.period === periodNumber 
        ? { ...slot, [field]: value }
        : slot
    ));
    
    setSessions(sessions.map(session => 
      session.session_order === periodNumber
        ? { ...session, [`${field}_time`]: value }
        : session
    ));
  };

  const addHour = (timeString) => {
    const [hours, minutes] = timeString.split(':').map(Number);
    const newHours = (hours + 1) % 24;
    return `${newHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  const fetchReferenceData = async () => {
    try {
      const [classesResponse, academicYearsResponse, subjectsResponse, teachersResponse, roomsResponse] = await Promise.all([
        apiMethods.get('schools/classes/'),
        apiMethods.get('schools/academic-years/'),
        apiMethods.get('schools/subjects/'),
        apiMethods.get('users/users/', { params: { role: 'TEACHER' } }),
        apiMethods.get('schools/rooms/')
      ]);

      let classesData = classesResponse.results || (Array.isArray(classesResponse) ? classesResponse : classesResponse.data?.results || classesResponse.data || []);
      let academicYearsData = academicYearsResponse.results || (Array.isArray(academicYearsResponse) ? academicYearsResponse : academicYearsResponse.data?.results || academicYearsResponse.data || []);
      let subjectsData = subjectsResponse.results || (Array.isArray(subjectsResponse) ? subjectsResponse : subjectsResponse.data?.results || subjectsResponse.data || []);
      let teachersData = teachersResponse.results || (Array.isArray(teachersResponse) ? teachersResponse : teachersResponse.data?.results || teachersResponse.data || []);
      let roomsData = roomsResponse.results || (Array.isArray(roomsResponse) ? roomsResponse : roomsResponse.data?.results || roomsResponse.data || []);

      setClasses(classesData);
      setAcademicYears(academicYearsData);
      setSubjects(subjectsData);
      setTeachers(teachersData);
      setFilteredTeachers(teachersData); // Initialize filtered teachers with all teachers
      setRooms(roomsData);

      const currentYear = academicYearsData.find(y => y.is_current);
      if (currentYear) {
        setFormData(prev => ({ ...prev, academic_year: currentYear.id.toString() }));
      }

    } catch (error) {
      console.error('Failed to fetch reference data:', error);
      toast.error(t('error.failedToLoadData'));
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

  const validateStep1 = () => {
    const newErrors = {};
    if (!formData.school_class || formData.school_class === '') newErrors.school_class = t('timetables.validation.classRequired');
    if (!formData.academic_year || formData.academic_year === '') newErrors.academic_year = t('timetables.validation.academicYearRequired');
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (validateStep1()) {
      setCurrentStep(2);
    } else {
      toast.error(t('validation.pleaseFixErrors'));
    }
  };

  const removeSession = (sessionId) => {
    setSessions(prev => prev.filter(session => session.id !== sessionId));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const timetableData = {
        school_class: parseInt(formData.school_class),
        academic_year: parseInt(formData.academic_year),
        is_active: formData.is_active
      };
      const newTimetable = await attendanceService.createTimetable(timetableData);
      if (sessions.length > 0) {
        const sessionPromises = sessions.map(async (session) => {
          if (!session.subject || !session.teacher || !session.start_time || !session.end_time) {
            throw new Error(`Invalid session data: missing required fields`);
          }
          const sessionData = {
            timetable: newTimetable.id,
            day_of_week: session.day_of_week,
            session_order: session.session_order,
            start_time: session.start_time,
            end_time: session.end_time,
            subject: parseInt(session.subject),
            teacher: parseInt(session.teacher),
            room: (session.room && session.room !== 'none' && session.room !== '') ? parseInt(session.room) : null,
            notes: session.notes || '',
            is_active: true
          };
          try {
            return await attendanceService.createTimetableSession(sessionData);
          } catch (error) {
            if (error.response?.data) {
              console.error('API error details:', error.response.data);
            }
            throw error;
          }
        });
        await Promise.all(sessionPromises);
      }
      toast.success(t('timetables.createSuccess'));
      navigate('/admin/timetables');
    } catch (error) {
      console.error('Failed to create timetable:', error);
      let errorMessage = t('timetables.createError');
      if (error.response?.data) {
        const apiErrors = error.response.data;
        if (typeof apiErrors === 'string') {
          errorMessage = apiErrors;
        } else if (apiErrors.detail) {
          errorMessage = apiErrors.detail;
        } else if (apiErrors.non_field_errors) {
          errorMessage = Array.isArray(apiErrors.non_field_errors) ? apiErrors.non_field_errors[0] : apiErrors.non_field_errors;
        } else {
          const newErrors = {};
          Object.keys(apiErrors).forEach(key => {
            const errorValue = Array.isArray(apiErrors[key]) ? apiErrors[key][0] : apiErrors[key];
            newErrors[key] = errorValue;
            if (errorValue.includes('unique') || errorValue.includes('duplicate')) {
              if (key.includes('teacher')) {
                errorMessage = t('timetables.validation.teacherConflict');
              } else if (key.includes('session')) {
                errorMessage = t('timetables.validation.sessionConflict');
              }
            }
          });
          setErrors(newErrors);
        }
        toast.error(errorMessage);
      } else if (error.message) {
        toast.error(error.message);
      } else {
        toast.error(t('errors.unexpectedError'));
      }
    } finally {
      setLoading(false);
    }
  };

  const generateTemplate = () => {
    const commonSessions = [];
    const basicSubjects = subjects.slice(0, 6);
    const basicTeachers = teachers.slice(0, 6);
    const teacherSchedule = {}; // Track teacher availability to avoid conflicts
    
    weekDays.slice(0, 5).forEach((day, dayIndex) => {
      timeSlots.slice(0, 6).forEach((slot, slotIndex) => {
        if (basicSubjects[slotIndex % basicSubjects.length] && basicTeachers[slotIndex % basicTeachers.length]) {
          // Find an available teacher for this time slot
          let availableTeacher = null;
          for (let i = 0; i < basicTeachers.length; i++) {
            const teacherIndex = (slotIndex + i) % basicTeachers.length;
            const teacher = basicTeachers[teacherIndex];
            const teacherKey = `${teacher.id}_${day.value}_${slot.start}_${slot.end}`;
            
            if (!teacherSchedule[teacherKey]) {
              availableTeacher = teacher;
              teacherSchedule[teacherKey] = true;
              break;
            }
          }
          
          // Only create session if we found an available teacher
          if (availableTeacher) {
            commonSessions.push({
              id: Date.now() + dayIndex * 1000 + slotIndex,
              day_of_week: day.value,
              session_order: slot.period,
              start_time: slot.start,
              end_time: slot.end,
              subject: basicSubjects[slotIndex % basicSubjects.length].id.toString(),
              teacher: availableTeacher.id.toString(),
              room: rooms[slotIndex % Math.max(rooms.length, 1)]?.id?.toString() || '',
              notes: ''
            });
          }
        }
      });
    });
    
    setSessions(commonSessions);
    toast.success(t('timetables.templateGenerated'));
  };

  const copyFromExisting = async () => {
    toast.info(t('common.featureComingSoon'));
  };

  const importFromFile = () => {
    toast.info(t('common.featureComingSoon'));
  };

  const getSessionForSlot = (dayValue, period) => {
    return sessions.find(session => 
      session.day_of_week === dayValue && session.session_order === period
    );
  };

  const handleOpenModal = (day, slot) => {
    const existingSession = getSessionForSlot(day.value, slot.period);
    if (existingSession) {
        setSelectedSession(existingSession);
        // Fetch teachers for the existing session's subject
        fetchTeachersBySubject(existingSession.subject);
    } else {
        setSelectedSession({
            id: Date.now(),
            day_of_week: day.value,
            session_order: slot.period,
            start_time: slot.start,
            end_time: slot.end,
            subject: '',
            teacher: '',
            room: 'none',
            notes: '',
            isNew: true
        });
        // Initialize with all teachers when no subject is selected
        setFilteredTeachers(teachers);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
      setIsModalOpen(false);
      setSelectedSession(null);
      setModalSessionData(null);
  };

  // Function to fetch teachers filtered by subject
  const fetchTeachersBySubject = async (subjectId) => {
    try {
      if (!subjectId) {
        setFilteredTeachers(teachers); // Show all teachers if no subject selected
        return;
      }

      const response = await apiMethods.get('users/users/', { 
        params: { 
          role: 'TEACHER',
          subject_id: subjectId
        } 
      });
      
      let teachersData = response.results || (Array.isArray(response) ? response : response.data?.results || response.data || []);
      setFilteredTeachers(teachersData);
    } catch (error) {
      console.error('Failed to fetch teachers by subject:', error);
      // Fallback to all teachers if filtering fails
      setFilteredTeachers(teachers);
      toast.error('Failed to filter teachers by subject');
    }
  };

  const handleModalInputChange = (field, value) => {
      setModalSessionData(prev => ({ ...prev, [field]: value }));
      
      // If subject changes, reset teacher and fetch filtered teachers
      if (field === 'subject') {
          setModalSessionData(prev => ({ ...prev, subject: value, teacher: '' }));
          fetchTeachersBySubject(value);
      }
  };

  const handleSaveSession = () => {
      if (!modalSessionData.subject || !modalSessionData.teacher) {
          toast.error(t('timetables.validation.subjectAndTeacherRequired'));
          return;
      }

      if (modalSessionData.isNew) {
          const { isNew, ...newSession } = modalSessionData;
          setSessions(prev => [...prev, newSession]);
      } else {
          setSessions(prev => prev.map(s => s.id === modalSessionData.id ? modalSessionData : s));
      }
      handleCloseModal();
      toast.success(t('timetables.sessionSaved'));
  };

  const handleRemoveSession = () => {
      if (modalSessionData && !modalSessionData.isNew) {
          removeSession(modalSessionData.id);
      }
      handleCloseModal();
      toast.info(t('timetables.sessionRemoved'));
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
    </div>
  );

  const gridStyle = { 
    display: 'grid', 
    gridTemplateColumns: `repeat(${timeSlots.length + 1}, minmax(0, 1fr))`,
    gap: '0.5rem',
    marginBottom: '0.5rem'
  };

  return (
    <AdminPageLayout
      title={t('timetables.addTimetable')}
      subtitle={t('timetables.createNewTimetable')}
      actions={[<ActionButtons key="actions" />]}
    >
      <div className="max-w-full mx-auto">
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
              currentStep >= 1 ? 'bg-blue-600 border-blue-600 text-white' : 'border-gray-300 text-gray-300'
            }`}>
              1
            </div>
            <div className={`w-12 h-1 ${currentStep >= 2 ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
            <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
              currentStep >= 2 ? 'bg-blue-600 border-blue-600 text-white' : 'border-gray-300 text-gray-300'
            }`}>
              2
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {currentStep === 1 && (
            <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-blue-600" />
                    {t('timetables.basicInformation')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="school_class" className="text-sm font-medium">
                        {t('classes.class')} <span className="text-red-500">*</span>
                      </Label>
                      <Select 
                        value={formData.school_class || undefined} 
                        onValueChange={(value) => handleInputChange('school_class', value)}
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

                    <div className="space-y-2">
                      <Label htmlFor="academic_year" className="text-sm font-medium">
                        {t('classes.academicYear')} <span className="text-red-500">*</span>
                      </Label>
                      <Select 
                        value={formData.academic_year || undefined} 
                        onValueChange={(value) => handleInputChange('academic_year', value)}
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

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-green-600" />
                    {t('timetables.periodConfiguration') || 'Period Configuration'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <Label className="text-sm font-medium">
                      {t('timetables.selectTemplate') || 'Select Schedule Template'}
                    </Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {Object.entries(periodTemplates).map(([key, template]) => (
                        <Card 
                          key={key}
                          className={`cursor-pointer transition-all border-2 ${
                            selectedTemplate === key 
                              ? 'border-blue-500 bg-blue-50' 
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                          onClick={() => applyTemplate(key)}
                        >
                          <CardContent className="p-4">
                            <div className="text-sm font-medium mb-2">{template.name}</div>
                            <div className="text-xs text-muted-foreground">{template.description}</div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium">
                        {t('timetables.customizePeriods') || 'Customize Periods'} ({timeSlots.length} {t('timetables.periods') || 'periods'})
                      </Label>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setShowPeriodConfig(!showPeriodConfig)}
                        >
                          {showPeriodConfig ? t('common.hide') : t('common.show')}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={addPeriod}
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          {t('timetables.addPeriod') || 'Add Period'}
                        </Button>
                      </div>
                    </div>

                    {showPeriodConfig && (
                      <div className="space-y-3 max-h-60 overflow-y-auto border rounded-lg p-4">
                        {timeSlots.map((slot) => (
                          <div key={slot.period} className="flex items-center gap-4 p-3 bg-muted/50 rounded">
                            <Badge variant="outline">P{slot.period}</Badge>
                            
                            <div className="flex items-center gap-2">
                              <Label className="text-xs">Start:</Label>
                              <Input
                                type="time"
                                value={slot.start}
                                onChange={(e) => updatePeriod(slot.period, 'start', e.target.value)}
                                className="w-24"
                              />
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <Label className="text-xs">End:</Label>
                              <Input
                                type="time"
                                value={slot.end}
                                onChange={(e) => updatePeriod(slot.period, 'end', e.target.value)}
                                className="w-24"
                              />
                            </div>

                            {timeSlots.length > 1 && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => removePeriod(slot.period)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {timeSlots.slice(0, 8).map((slot) => (
                        <Badge key={slot.period} variant="secondary" className="text-xs">
                          P{slot.period}: {slot.start}-{slot.end}
                        </Badge>
                      ))}
                      {timeSlots.length > 8 && (
                        <Badge variant="secondary" className="text-xs">
                          +{timeSlots.length - 8} more
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
              <div className="flex justify-end">
                <Button onClick={handleNextStep}>
                  {t('common.next')} <ArrowLeft className="h-4 w-4 ml-2 rotate-180" />
                </Button>
              </div>
            </motion.div>
            </div>
          )}

          {currentStep === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
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
                      onClick={generateTemplate}
                      disabled={subjects.length === 0 || teachers.length === 0}
                    >
                      <Zap className="h-4 w-4 mr-2" />
                      {t('timetables.generateTemplate')}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={copyFromExisting}
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      {t('timetables.copyFromExisting')}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={importFromFile}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      {t('timetables.importFromFile')}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-blue-600" />
                    {t('timetables.weeklySchedule')} ({sessions.length} {t('timetables.sessions')})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <div style={{minWidth: `${timeSlots.length * 120 + 150}px`}}>
                      <div style={gridStyle} className="mb-4">
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

                      {weekDays.slice(0, 6).map((day) => (
                        <div key={day.key} style={gridStyle}>
                          <div className="p-3 bg-muted/30 rounded text-center flex items-center justify-center">
                            <div className="text-sm font-medium">
                              {day.name}
                            </div>
                          </div>

                          {timeSlots.map((slot) => {
                            const session = getSessionForSlot(day.value, slot.period);
                            
                            return (
                              <div key={slot.period} className="min-h-[80px] p-1">
                                {session ? (
                                  <button onClick={() => handleOpenModal(day, slot)} className="w-full h-full text-left">
                                    <div className="p-2 border border-blue-200 bg-blue-50 rounded h-full relative hover:bg-blue-100 transition-colors">
                                      <div className="text-xs space-y-1">
                                        <div className="font-medium">
                                          {subjects.find(s => s.id.toString() === session.subject)?.name || 'Subject'}
                                        </div>
                                        <div className="text-muted-foreground">
                                          {teachers.find(t => t.id.toString() === session.teacher)?.full_name || 'Teacher'}
                                        </div>
                                      </div>
                                    </div>
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => handleOpenModal(day, slot)}
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

              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep(1)}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  {t('common.previous')}
                </Button>
                
                <Button
                  onClick={handleSubmit}
                  disabled={loading || sessions.length === 0}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      {t('common.creating')}
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Save className="h-4 w-4" />
                      {t('timetables.createTimetable')}
                    </div>
                  )}
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {selectedSession && modalSessionData && (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="sm:max-w-[625px]">
            <DialogHeader>
              <DialogTitle>
                {modalSessionData.isNew ? t('timetables.addSession') : t('timetables.editSession')}
              </DialogTitle>
              <DialogDescription>
                {weekDays.find(d => d.value === modalSessionData.day_of_week)?.name} - {t('timetables.period')} {modalSessionData.session_order} ({modalSessionData.start_time} - {modalSessionData.end_time})
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="subject" className="text-right">{t('subjects.subject')}</Label>
                <div className="col-span-3">
                  <Select 
                    value={modalSessionData.subject || ""} 
                    onValueChange={(value) => handleModalInputChange('subject', value)}
                  >
                    <SelectTrigger>
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
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="teacher" className="text-right">{t('teachers.teacher')}</Label>
                <div className="col-span-3">
                  <Select 
                    value={modalSessionData.teacher || ""} 
                    onValueChange={(value) => handleModalInputChange('teacher', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t('teachers.selectTeacher')} />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredTeachers.map((teacher) => (
                        <SelectItem key={teacher.id} value={teacher.id.toString()}>
                          {teacher.full_name}
                        </SelectItem>
                      ))}
                      {filteredTeachers.length === 0 && modalSessionData?.subject && (
                        <SelectItem disabled value="no-teachers">
                          {t('timetables.noTeachersForSubject') || 'No teachers available for this subject'}
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="room" className="text-right">{t('rooms.room')}</Label>
                <div className="col-span-3">
                  <Select 
                    value={modalSessionData.room || "none"} 
                    onValueChange={(value) => handleModalInputChange('room', value)}
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
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="notes" className="text-right">{t('common.notes')}</Label>
                <Input
                  id="notes"
                  value={modalSessionData.notes || ''}
                  onChange={(e) => handleModalInputChange('notes', e.target.value)}
                  className="col-span-3"
                  placeholder={t('timetables.sessionNotes')}
                />
              </div>
            </div>
            <DialogFooter className="sm:justify-between">
              <div>
                {!modalSessionData.isNew && (
                  <Button variant="destructive" onClick={handleRemoveSession}>
                    <Trash2 className="h-4 w-4 mr-2" />
                    {t('common.delete')}
                  </Button>
                )}
              </div>
              <div className="flex gap-2">
                <DialogClose asChild>
                  <Button variant="outline" onClick={handleCloseModal}>{t('common.cancel')}</Button>
                </DialogClose>
                <Button onClick={handleSaveSession}>
                  <Save className="h-4 w-4 mr-2" />
                  {t('common.save')}
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </AdminPageLayout>
  );
};

export default AddTimetablePage;
