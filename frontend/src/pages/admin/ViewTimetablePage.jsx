import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  ArrowLeft, 
  Edit, 
  Copy,
  Download,
  Printer,
  Clock,
  Users,
  BookOpen,
  MapPin,
  User,
  CheckCircle,
  XCircle,
  AlertTriangle,
  FileText,
  Settings,
  Activity,
  BarChart3,
  Eye,
  Share2
} from 'lucide-react';
import AdminPageLayout from '../../components/admin/layout/AdminPageLayout';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import attendanceService from '../../services/attendance';
import { toast } from 'sonner';

const ViewTimetablePage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [timetable, setTimetable] = useState(null);

  // attendanceService is already imported as a singleton

  const weekDays = [
    { key: 'monday', name: t('calendar.monday'), value: 1 },
    { key: 'tuesday', name: t('calendar.tuesday'), value: 2 },
    { key: 'wednesday', name: t('calendar.wednesday'), value: 3 },
    { key: 'thursday', name: t('calendar.thursday'), value: 4 },
    { key: 'friday', name: t('calendar.friday'), value: 5 },
    { key: 'saturday', name: t('calendar.saturday'), value: 6 }
  ];

  // Standard time slots for Morocco schools
  const timeSlots = [
    { period: 1, start: '08:00', end: '09:00' },
    { period: 2, start: '09:00', end: '10:00' },
    { period: 3, start: '10:00', end: '11:00' },
    { period: 4, start: '11:20', end: '12:20' }, // Break 11:00-11:20
    { period: 5, start: '12:20', end: '13:20' },
    { period: 6, start: '14:30', end: '15:30' }, // Lunch break 13:20-14:30
    { period: 7, start: '15:30', end: '16:30' },
    { period: 8, start: '16:30', end: '17:30' }
  ];

  useEffect(() => {
    fetchTimetable();
  }, [id]);

  const fetchTimetable = async () => {
    try {
      setLoading(true);
      const timetableData = await attendanceService.getTimetableById(id);
      setTimetable(timetableData);
    } catch (error) {
      console.error('Failed to fetch timetable:', error);
      toast.error(t('error.failedToLoadData'));
      navigate('/admin/timetables');
    } finally {
      setLoading(false);
    }
  };

  const getSessionForSlot = (dayValue, period) => {
    return timetable?.sessions?.find(session => 
      session.day_of_week === dayValue && session.session_order === period
    );
  };

  const getSessionTypeColor = (session) => {
    // You can add logic based on subject type or other criteria
    const colors = [
      'bg-blue-100 text-blue-800 border-blue-200',
      'bg-green-100 text-green-800 border-green-200',
      'bg-purple-100 text-purple-800 border-purple-200',
      'bg-orange-100 text-orange-800 border-orange-200',
      'bg-pink-100 text-pink-800 border-pink-200',
      'bg-yellow-100 text-yellow-800 border-yellow-200',
      'bg-indigo-100 text-indigo-800 border-indigo-200',
    ];
    const hash = session.subject_name.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    return colors[Math.abs(hash) % colors.length];
  };

  const calculateStats = () => {
    if (!timetable?.sessions) return {};
    
    const sessions = timetable.sessions;
    const totalSessions = sessions.length;
    const uniqueSubjects = new Set(sessions.map(s => s.subject)).size;
    const uniqueTeachers = new Set(sessions.map(s => s.teacher)).size;
    const uniqueRooms = new Set(sessions.filter(s => s.room).map(s => s.room)).size;
    
    const totalWeeklyHours = sessions.reduce((sum, session) => {
      const start = new Date(`1970-01-01T${session.start_time}`);
      const end = new Date(`1970-01-01T${session.end_time}`);
      return sum + (end - start) / (1000 * 60 * 60);
    }, 0);

    return {
      totalSessions,
      uniqueSubjects,
      uniqueTeachers,
      uniqueRooms,
      totalWeeklyHours: Math.round(totalWeeklyHours * 10) / 10
    };
  };

  const handleDuplicate = async () => {
    try {
      const duplicateData = {
        school_class: timetable.school_class,
        academic_year: timetable.academic_year,
        is_active: false
      };
      
      const newTimetable = await attendanceService.createTimetable(duplicateData);
      toast.success(t('timetables.duplicateSuccess'));
      navigate(`/admin/timetables/edit/${newTimetable.id}`);
    } catch (error) {
      console.error('Failed to duplicate timetable:', error);
      toast.error(t('timetables.duplicateError'));
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExport = () => {
    // Export to PDF functionality
    toast.info(t('common.featureComingSoon'));
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
        onClick={handlePrint}
      >
        <Printer className="h-4 w-4 mr-2" />
        {t('common.print')}
      </Button>
      <Button
        variant="outline"
        onClick={handleExport}
      >
        <Download className="h-4 w-4 mr-2" />
        {t('common.export')}
      </Button>
      <Button
        variant="outline"
        onClick={handleDuplicate}
      >
        <Copy className="h-4 w-4 mr-2" />
        {t('common.duplicate')}
      </Button>
      <Button
        onClick={() => navigate(`/admin/timetables/edit/${id}`)}
        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
      >
        <Edit className="h-4 w-4 mr-2" />
        {t('common.edit')}
      </Button>
    </div>
  );

  if (loading) {
    return (
      <AdminPageLayout
        title={t('timetables.viewTimetable')}
        subtitle={t('timetables.timetableDetails')}
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

  if (!timetable) {
    return (
      <AdminPageLayout
        title={t('timetables.viewTimetable')}
        subtitle={t('timetables.timetableDetails')}
        ActionComponent={ActionButtons}
      >
        <div className="text-center py-12">
          <AlertTriangle className="h-12 w-12 text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {t('timetables.notFound')}
          </h3>
          <p className="text-sm text-gray-500">
            {t('timetables.notFoundDescription')}
          </p>
        </div>
      </AdminPageLayout>
    );
  }

  const stats = calculateStats();

  return (
    <AdminPageLayout
      title={`${timetable.school_class_name} - ${timetable.academic_year_name}`}
      subtitle={t('timetables.timetableDetails')}
      ActionComponent={ActionButtons}
    >
      <div className="space-y-6">
        {/* Header Information */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-500" />
                {t('timetables.timetableInformation')}
              </CardTitle>
              <Badge className={timetable.is_active 
                ? 'bg-green-100 text-green-800 border-green-200'
                : 'bg-gray-100 text-gray-800 border-gray-200'
              }>
                {timetable.is_active ? (
                  <>
                    <CheckCircle className="h-3 w-3 mr-1" />
                    {t('common.active')}
                  </>
                ) : (
                  <>
                    <XCircle className="h-3 w-3 mr-1" />
                    {t('common.inactive')}
                  </>
                )}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{t('classes.class')}:</span>
                  <span>{timetable.school_class_name}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{t('classes.academicYear')}:</span>
                  <span>{timetable.academic_year_name}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{t('common.createdBy')}:</span>
                  <span>{timetable.created_by_name}</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{t('common.created')}:</span>
                  <span>{new Date(timetable.created_at).toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Activity className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{t('common.lastUpdated')}:</span>
                  <span>{new Date(timetable.updated_at).toLocaleString()}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{stats.totalSessions}</div>
                <div className="text-xs text-muted-foreground">{t('timetables.totalSessions')}</div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{stats.uniqueSubjects}</div>
                <div className="text-xs text-muted-foreground">{t('timetables.subjects')}</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{stats.uniqueTeachers}</div>
                <div className="text-xs text-muted-foreground">{t('timetables.teachers')}</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{stats.uniqueRooms}</div>
                <div className="text-xs text-muted-foreground">{t('timetables.rooms')}</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-indigo-600">{stats.totalWeeklyHours}h</div>
                <div className="text-xs text-muted-foreground">{t('timetables.weeklyHours')}</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Timetable Grid */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-500" />
              {t('timetables.weeklySchedule')}
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
                        <div key={day.key} className="min-h-[80px] p-2">
                          {session ? (
                            <div className={`p-3 rounded border h-full ${getSessionTypeColor(session)}`}>
                              <div className="text-xs font-medium mb-1 truncate">
                                {session.subject_name}
                              </div>
                              <div className="space-y-1 text-xs">
                                <div className="flex items-center gap-1 text-muted-foreground">
                                  <User className="h-3 w-3" />
                                  <span className="truncate">{session.teacher_name}</span>
                                </div>
                                {session.room_name && (
                                  <div className="flex items-center gap-1 text-muted-foreground">
                                    <MapPin className="h-3 w-3" />
                                    <span className="truncate">{session.room_name}</span>
                                  </div>
                                )}
                                <div className="flex items-center gap-1 text-muted-foreground">
                                  <Clock className="h-3 w-3" />
                                  <span>{session.start_time} - {session.end_time}</span>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="h-full border-2 border-dashed border-gray-200 rounded flex items-center justify-center">
                              <span className="text-xs text-muted-foreground">
                                {t('timetables.freeTime')}
                              </span>
                            </div>
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
        {timetable.sessions && timetable.sessions.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-blue-500" />
                {t('timetables.sessionsList')} ({timetable.sessions.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {timetable.sessions
                  .sort((a, b) => a.day_of_week - b.day_of_week || a.session_order - b.session_order)
                  .map((session, index) => {
                    const dayName = weekDays.find(d => d.value === session.day_of_week)?.name;
                    
                    return (
                      <motion.div
                        key={session.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className="p-4 border border-border rounded-lg hover:shadow-sm transition-all"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="font-medium">{session.subject_name}</h4>
                              <Badge variant="outline">{dayName}</Badge>
                              <Badge variant="outline">
                                {t('timetables.period')} {session.session_order}
                              </Badge>
                            </div>
                            
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <User className="h-4 w-4" />
                                <span>{session.teacher_name}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                <span>{session.start_time} - {session.end_time}</span>
                              </div>
                              {session.room_name && (
                                <div className="flex items-center gap-1">
                                  <MapPin className="h-4 w-4" />
                                  <span>{session.room_name}</span>
                                </div>
                              )}
                              {session.notes && (
                                <div className="flex items-center gap-1">
                                  <FileText className="h-4 w-4" />
                                  <span className="truncate">{session.notes}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminPageLayout>
  );
};

export default ViewTimetablePage;