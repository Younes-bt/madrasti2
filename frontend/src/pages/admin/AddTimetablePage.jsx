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
  Users,
  BookOpen,
  MapPin,
  User,
  AlertTriangle,
  Copy,
  Upload,
  FileText,
  Zap
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

const AddTimetablePage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  
  // Form data
  const [formData, setFormData] = useState({
    school_class: '',
    academic_year: '',
    is_active: true
  });

  // Reference data
  const [classes, setClasses] = useState([]);
  const [academicYears, setAcademicYears] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [rooms, setRooms] = useState([]);

  // Sessions
  const [sessions, setSessions] = useState([]);
  const [currentStep, setCurrentStep] = useState(1); // 1: Basic Info, 2: Sessions

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
    fetchReferenceData();
  }, []);

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
      setRooms(roomsData);

      // Set default academic year to current one
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

  const addSession = () => {
    const newSession = {
      id: Date.now(), // Temporary ID
      day_of_week: 1,
      session_order: 1,
      start_time: '08:00',
      end_time: '09:00',
      subject: '',
      teacher: '',
      room: 'none',
      notes: ''
    };
    setSessions(prev => [...prev, newSession]);
  };

  const updateSession = (sessionId, field, value) => {
    setSessions(prev => prev.map(session => 
      session.id === sessionId 
        ? { ...session, [field]: value }
        : session
    ));
  };

  const removeSession = (sessionId) => {
    setSessions(prev => prev.filter(session => session.id !== sessionId));
  };

  const validateSessions = () => {
    const newErrors = {};
    
    sessions.forEach((session, index) => {
      if (!session.subject) {
        newErrors[`session_${session.id}_subject`] = t('timetables.validation.subjectRequired');
      }
      if (!session.teacher) {
        newErrors[`session_${session.id}_teacher`] = t('timetables.validation.teacherRequired');
      }
      
      // Check for conflicts
      const conflictingSessions = sessions.filter((s, i) => 
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

    setLoading(true);
    try {
      // Create timetable first
      const timetableData = {
        school_class: parseInt(formData.school_class),
        academic_year: parseInt(formData.academic_year),
        is_active: formData.is_active
      };

      const newTimetable = await attendanceService.createTimetable(timetableData);

      // Create sessions
      if (sessions.length > 0) {
        console.log('Creating sessions:', sessions);
        
        const sessionPromises = sessions.map(async (session, index) => {
          // Validate session data before creating
          if (!session.subject || !session.teacher || !session.start_time || !session.end_time) {
            console.error('Invalid session data:', session);
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
          
          console.log(`Creating session ${index + 1} with data:`, sessionData);
          
          try {
            const result = await attendanceService.createTimetableSession(sessionData);
            console.log(`Session ${index + 1} created successfully:`, result);
            return result;
          } catch (error) {
            console.error(`Failed to create session ${index + 1}:`, error);
            console.error('Session data that failed:', sessionData);
            if (error.response?.data) {
              console.error('API error details:', error.response.data);
            }
            throw error;
          }
        });

        await Promise.all(sessionPromises);
      } else {
        console.log('No sessions to create');
      }

      toast.success(t('timetables.createSuccess'));
      navigate('/admin/timetables');
    } catch (error) {
      console.error('Failed to create timetable:', error);
      
      let errorMessage = t('timetables.createError');
      
      if (error.response?.data) {
        const apiErrors = error.response.data;
        console.error('API validation errors:', apiErrors);
        
        // Handle different error formats
        if (typeof apiErrors === 'string') {
          errorMessage = apiErrors;
        } else if (apiErrors.detail) {
          errorMessage = apiErrors.detail;
        } else if (apiErrors.non_field_errors) {
          errorMessage = Array.isArray(apiErrors.non_field_errors) ? apiErrors.non_field_errors[0] : apiErrors.non_field_errors;
        } else {
          // Handle field-specific errors
          const newErrors = {};
          Object.keys(apiErrors).forEach(key => {
            const errorValue = Array.isArray(apiErrors[key]) ? apiErrors[key][0] : apiErrors[key];
            newErrors[key] = errorValue;
            
            // If it's a constraint error, show user-friendly message
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
    // Generate a basic template with common sessions
    const commonSessions = [];
    const basicSubjects = subjects.slice(0, 6); // Take first 6 subjects
    const basicTeachers = teachers.slice(0, 6); // Take first 6 teachers
    
    weekDays.slice(0, 5).forEach((day, dayIndex) => {
      timeSlots.slice(0, 6).forEach((slot, slotIndex) => {
        if (basicSubjects[slotIndex % basicSubjects.length] && basicTeachers[slotIndex % basicTeachers.length]) {
          commonSessions.push({
            id: Date.now() + dayIndex * 100 + slotIndex,
            day_of_week: day.value,
            session_order: slot.period,
            start_time: slot.start,
            end_time: slot.end,
            subject: basicSubjects[slotIndex % basicSubjects.length].id.toString(),
            teacher: basicTeachers[slotIndex % basicTeachers.length].id.toString(),
            room: rooms[slotIndex % Math.max(rooms.length, 1)]?.id?.toString() || '',
            notes: ''
          });
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

  return (
    <AdminPageLayout
      title={t('timetables.addTimetable')}
      subtitle={t('timetables.createNewTimetable')}
      actions={[<ActionButtons key="actions" />]}
    >
      <div className="max-w-6xl mx-auto">
        {/* Progress Steps */}
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
          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
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
                    {/* Class Selection */}
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

                    {/* Academic Year Selection */}
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

                  <div className="flex justify-end">
                    <Button onClick={handleNextStep}>
                      {t('common.next')} <ArrowLeft className="h-4 w-4 ml-2 rotate-180" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Step 2: Sessions */}
          {currentStep === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
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
                    <Button
                      variant="outline"
                      onClick={addSession}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      {t('timetables.addSession')}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Timetable Grid */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-blue-600" />
                    {t('timetables.weeklySchedule')} ({sessions.length} {t('timetables.sessions')})
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
                            
                            return (
                              <div key={day.key} className="min-h-[80px] p-1">
                                {session ? (
                                  <div className="p-2 border border-blue-200 bg-blue-50 rounded h-full relative">
                                    <button
                                      onClick={() => removeSession(session.id)}
                                      className="absolute top-1 right-1 p-1 text-red-600 hover:bg-red-100 rounded"
                                    >
                                      <Trash2 className="h-3 w-3" />
                                    </button>
                                    <div className="text-xs space-y-1">
                                      <div className="font-medium">
                                        {subjects.find(s => s.id.toString() === session.subject)?.name || 'Subject'}
                                      </div>
                                      <div className="text-muted-foreground">
                                        {teachers.find(t => t.id.toString() === session.teacher)?.full_name || 'Teacher'}
                                      </div>
                                    </div>
                                  </div>
                                ) : (
                                  <button
                                    onClick={() => {
                                      const newSession = {
                                        id: Date.now(),
                                        day_of_week: day.value,
                                        session_order: slot.period,
                                        start_time: slot.start,
                                        end_time: slot.end,
                                        subject: '',
                                        teacher: '',
                                        room: 'none',
                                        notes: ''
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
              {sessions.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="h-5 w-5 text-blue-600" />
                      {t('timetables.sessionDetails')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {sessions.map((session, index) => (
                        <div key={session.id} className="p-4 border border-border rounded-lg">
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
                                value={session.notes}
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
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Navigation */}
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
    </AdminPageLayout>
  );
};

export default AddTimetablePage;