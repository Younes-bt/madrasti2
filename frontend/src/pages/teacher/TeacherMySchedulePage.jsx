import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Download,
  Printer,
  Clock,
  Users,
  BookOpen,
  MapPin,
  User,
  AlertTriangle,
  FileText,
  Activity,
  BarChart3,
  Eye,
  RotateCcw
} from 'lucide-react';
import jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import TeacherPageLayout from '../../components/teacher/layout/TeacherPageLayout';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../../components/ui/dialog';
import attendanceService from '../../services/attendance';
import { toast } from 'sonner';
import api from '../../services/api';
import '../../styles/print.css';

const TeacherMySchedulePage = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [teacherSchedule, setTeacherSchedule] = useState(null);
  const [schoolConfig, setSchoolConfig] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const scheduleRef = useRef(null);

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
    fetchTeacherSchedule();
    fetchSchoolConfig();
  }, []);

  const fetchTeacherSchedule = async () => {
    try {
      setLoading(true);
      // Get teacher's timetable sessions
      const response = await attendanceService.getTimetableSessions({
        my_sessions: true
      });
      
      // Transform the response to match the expected format
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

  const fetchSchoolConfig = async () => {
    try {
      let configResponse;
      try {
        // First try: list endpoint
        configResponse = await api.get('/schools/config/');
        const data = configResponse.data;
        
        let schoolData;
        if (data.results && Array.isArray(data.results)) {
          schoolData = data.results[0];
        } else if (Array.isArray(data)) {
          schoolData = data[0];
        } else {
          schoolData = data;
        }
        
        setSchoolConfig(schoolData);
      } catch (listError) {
        try {
          configResponse = await api.get('/schools/config/1/');
          setSchoolConfig(configResponse.data);
        } catch (detailError) {
          console.error('Both config endpoints failed:', { listError, detailError });
          if (user?.school_info) {
            setSchoolConfig(user.school_info);
          }
        }
      }
    } catch (err) {
      console.error('Error fetching school config:', err);
      if (user?.school_info) {
        setSchoolConfig(user.school_info);
      }
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchTeacherSchedule();
    setRefreshing(false);
    toast.success(t('common.refreshed'));
  };

  const handleSessionClick = (session) => {
    setSelectedSession(session);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedSession(null);
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

  const calculateStats = () => {
    if (!teacherSchedule?.sessions) return {};
    
    const sessions = teacherSchedule.sessions;
    const totalSessions = sessions.length;
    const uniqueSubjects = new Set(sessions.map(s => s.subject)).size;
    const uniqueClasses = new Set(sessions.map(s => s.class_name || s.school_class_name || s.timetable?.school_class || s.school_class)).size;
    const uniqueRooms = new Set(sessions.filter(s => s.room).map(s => s.room)).size;
    
    const totalWeeklyHours = sessions.reduce((sum, session) => {
      const start = new Date(`1970-01-01T${session.start_time}`);
      const end = new Date(`1970-01-01T${session.end_time}`);
      return sum + (end - start) / (1000 * 60 * 60);
    }, 0);

    return {
      totalSessions,
      uniqueSubjects,
      uniqueClasses,
      uniqueRooms,
      totalWeeklyHours: Math.round(totalWeeklyHours * 10) / 10
    };
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank', 'width=1200,height=800');
    
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>My Teaching Schedule - ${teacherSchedule?.teacher_name}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { 
            font-family: Arial, sans-serif; 
            background: white;
            padding: 40px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
          }
          .print-container {
            width: 100%;
            max-width: 1000px;
            margin: 0 auto;
            text-align: center;
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
          }
          .school-name {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 10px;
          }
          .teacher-info {
            font-size: 18px;
            margin-bottom: 5px;
          }
          .timetable-table {
            width: 100%;
            border-collapse: collapse;
            border: 2px solid #000;
            margin: 0 auto;
          }
          .timetable-table th,
          .timetable-table td {
            border: 1px solid #000;
            padding: 8px 4px;
            text-align: center;
            vertical-align: top;
            font-size: 12px;
          }
          .timetable-table th {
            background-color: #e0e0e0;
            font-weight: bold;
          }
          .day-header,
          .day-cell {
            background-color: #f5f5f5;
            font-weight: bold;
            width: 120px;
          }
          .time-header {
            font-size: 10px;
            width: 110px;
          }
          .session-cell {
            text-align: left;
            padding: 4px;
            font-size: 10px;
            width: 110px;
            height: 60px;
          }
          .class-name { font-weight: bold; font-size: 11px; margin-bottom: 2px; }
          .subject { font-size: 10px; margin-bottom: 1px; }
          .room { font-size: 9px; font-style: italic; }
          @page { 
            size: A4 landscape; 
            margin: 0.5in; 
          }
          @media print {
            body { padding: 20px; }
            .print-container { margin: 0 auto; }
          }
        </style>
      </head>
      <body>
        <div class="print-container">
          <div class="header">
            <div class="school-name">${schoolConfig?.name_arabic || 'الطاود'} - ${schoolConfig?.name || 'Taoud School'}</div>
            <div class="teacher-info">جدول الحصص - Teaching Schedule</div>
            <div class="teacher-info">${t('teacherSidebar.profile.myProfile')}: ${teacherSchedule?.teacher_name}</div>
          </div>
          
          <table class="timetable-table">
            <thead>
              <tr>
                <th class="day-header">Day</th>
                ${timeSlots.map(slot => `
                  <th class="time-header">
                    <div>الحصة ${slot.period}</div>
                    <div>${slot.start} - ${slot.end}</div>
                  </th>
                `).join('')}
              </tr>
            </thead>
            <tbody>
              ${weekDays.slice(0, 6).map(day => `
                <tr>
                  <td class="day-cell">${day.name}</td>
                  ${timeSlots.map(slot => {
                    const session = getSessionForSlot(day.value, slot.period);
                    return `
                      <td class="session-cell">
                        ${session ? `
                          <div class="class-name">${session.class_name || session.school_class_name || session.timetable?.school_class_name || ''}</div>
                          <div class="subject">${session.subject_name}</div>
                          ${session.room_name ? `<div class="room">${session.room_name}</div>` : ''}
                        ` : ''}
                      </td>
                    `;
                  }).join('')}
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </body>
      </html>
    `;
    
    printWindow.document.write(printContent);
    printWindow.document.close();
    
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 500);
    };
  };

  const handleExport = () => {
    if (scheduleRef.current) {
      toast.info(t('timetables.generatingPdf'));
      
      const tempContainer = document.createElement('div');
      tempContainer.style.position = 'absolute';
      tempContainer.style.left = '-9999px';
      tempContainer.style.top = '-9999px';
      tempContainer.style.width = '1200px';
      tempContainer.style.backgroundColor = 'white';
      tempContainer.style.padding = '40px';
      tempContainer.style.fontFamily = 'Arial, sans-serif';
      tempContainer.style.textAlign = 'center';
      
      const header = document.createElement('div');
      header.style.textAlign = 'center';
      header.style.marginBottom = '30px';
      
      const schoolName = document.createElement('div');
      schoolName.style.fontSize = '24px';
      schoolName.style.fontWeight = 'bold';
      schoolName.style.marginBottom = '10px';
      schoolName.textContent = `${schoolConfig?.name_arabic || 'الطاود'} - ${schoolConfig?.name || 'Taoud School'}`;
      
      const scheduleInfo1 = document.createElement('div');
      scheduleInfo1.style.fontSize = '18px';
      scheduleInfo1.style.marginBottom = '5px';
      scheduleInfo1.textContent = 'جدول الحصص - Teaching Schedule';
      
      const scheduleInfo2 = document.createElement('div');
      scheduleInfo2.style.fontSize = '18px';
      scheduleInfo2.style.marginBottom = '5px';
      scheduleInfo2.textContent = `${t('teacherSidebar.profile.myProfile')}: ${teacherSchedule?.teacher_name}`;
      
      header.appendChild(schoolName);
      header.appendChild(scheduleInfo1);
      header.appendChild(scheduleInfo2);
      
      const table = document.createElement('table');
      table.style.width = '100%';
      table.style.borderCollapse = 'collapse';
      table.style.border = '2px solid #000';
      table.style.margin = '0 auto';
      
      // Create table header
      const thead = document.createElement('thead');
      const headerRow = document.createElement('tr');
      
      const dayHeader = document.createElement('th');
      dayHeader.style.border = '1px solid #000';
      dayHeader.style.padding = '8px 4px';
      dayHeader.style.backgroundColor = '#f5f5f5';
      dayHeader.style.fontWeight = 'bold';
      dayHeader.style.fontSize = '12px';
      dayHeader.textContent = 'Day';
      headerRow.appendChild(dayHeader);
      
      timeSlots.forEach(slot => {
        const th = document.createElement('th');
        th.style.border = '1px solid #000';
        th.style.padding = '8px 4px';
        th.style.backgroundColor = '#e0e0e0';
        th.style.fontWeight = 'bold';
        th.style.fontSize = '10px';
        th.style.textAlign = 'center';
        th.innerHTML = `<div>الحصة ${slot.period}</div><div>${slot.start} - ${slot.end}</div>`;
        headerRow.appendChild(th);
      });
      
      thead.appendChild(headerRow);
      table.appendChild(thead);
      
      // Create table body
      const tbody = document.createElement('tbody');
      
      weekDays.slice(0, 6).forEach(day => {
        const row = document.createElement('tr');
        
        const dayCell = document.createElement('td');
        dayCell.style.border = '1px solid #000';
        dayCell.style.padding = '8px 4px';
        dayCell.style.backgroundColor = '#f5f5f5';
        dayCell.style.fontWeight = 'bold';
        dayCell.style.fontSize = '12px';
        dayCell.style.textAlign = 'center';
        dayCell.textContent = day.name;
        row.appendChild(dayCell);
        
        timeSlots.forEach(slot => {
          const sessionCell = document.createElement('td');
          sessionCell.style.border = '1px solid #000';
          sessionCell.style.padding = '4px';
          sessionCell.style.fontSize = '10px';
          sessionCell.style.textAlign = 'left';
          sessionCell.style.verticalAlign = 'top';
          sessionCell.style.height = '60px';
          
          const session = getSessionForSlot(day.value, slot.period);
          if (session) {
            const className = document.createElement('div');
            className.style.fontWeight = 'bold';
            className.style.fontSize = '11px';
            className.style.marginBottom = '2px';
            className.textContent = session.class_name || session.school_class_name || session.timetable?.school_class_name || '';
            
            const subject = document.createElement('div');
            subject.style.fontSize = '10px';
            subject.style.marginBottom = '1px';
            subject.textContent = session.subject_name;
            
            sessionCell.appendChild(className);
            sessionCell.appendChild(subject);
            
            if (session.room_name) {
              const room = document.createElement('div');
              room.style.fontSize = '9px';
              room.style.fontStyle = 'italic';
              room.textContent = session.room_name;
              sessionCell.appendChild(room);
            }
          }
          
          row.appendChild(sessionCell);
        });
        
        tbody.appendChild(row);
      });
      
      table.appendChild(tbody);
      
      tempContainer.appendChild(header);
      tempContainer.appendChild(table);
      document.body.appendChild(tempContainer);

      html2canvas(tempContainer, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        allowTaint: false,
        logging: false,
      }).then((canvas) => {
        document.body.removeChild(tempContainer);
        
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jspdf('l', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        
        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;
        const ratio = canvasWidth / canvasHeight;
        
        let width = pdfWidth - 20;
        let height = width / ratio;
        
        if (height > pdfHeight - 20) {
          height = pdfHeight - 20;
          width = height * ratio;
        }
        
        const x = (pdfWidth - width) / 2;
        const y = (pdfHeight - height) / 2;

        pdf.addImage(imgData, 'PNG', x, y, width, height);
        pdf.save(`my-schedule-${teacherSchedule?.teacher_name?.replace(/\s+/g, '-')}.pdf`);
        toast.success(t('timetables.pdfGenerated'));
      }).catch(err => {
        if (document.body.contains(tempContainer)) {
          document.body.removeChild(tempContainer);
        }
        console.error("Error generating PDF:", err);
        toast.error(t('error.failedToExport'));
      });
    }
  };

  const ActionButtons = () => (
    <div className="flex gap-2 hide-on-print">
      <Button
        variant="outline"
        onClick={handleRefresh}
        disabled={refreshing}
        className="flex items-center gap-2"
      >
        <RotateCcw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
        {t('common.refresh')}
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
    </div>
  );

  if (loading) {
    return (
      <TeacherPageLayout
        title={t('teacherSidebar.profile.mySchedule')}
        subtitle={t('teacherSidebar.profile.myScheduleDesc')}
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

  const stats = calculateStats();

  return (
    <TeacherPageLayout
      title={t('teacherSidebar.profile.mySchedule')}
      subtitle={t('teacherSidebar.profile.myScheduleDesc')}
      actions={[<ActionButtons key="action-buttons" />]}
    >
      <div className="space-y-6 printable-content" ref={scheduleRef}>
        {/* Print-Only Simple Header */}
        <div className="print-only-header hide-on-screen">
          <div className="print-school-name">
            {schoolConfig?.name_arabic || 'الطاود'} - {schoolConfig?.name || 'Taoud School'}
          </div>
          <div className="print-class-info">
            جدول الحصص - Teaching Schedule
          </div>
          <div className="print-class-info">
            {t('teacherSidebar.profile.myProfile')}: {teacherSchedule?.teacher_name}
          </div>
        </div>

        {/* Header Information */}
        <Card className="card-print">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-500" />
                {t('teacherSidebar.profile.myScheduleInfo')}
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{t('teacher.teacher')}:</span>
                  <span>{teacherSchedule?.teacher_name}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{t('timetables.totalSessions')}:</span>
                  <span>{stats.totalSessions}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{t('classes.classes')}:</span>
                  <span>{stats.uniqueClasses}</span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{t('timetables.weeklyHours')}:</span>
                  <span>{stats.totalWeeklyHours}h</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{t('timetables.subjects')}:</span>
                  <span>{stats.uniqueSubjects}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{t('timetables.rooms')}:</span>
                  <span>{stats.uniqueRooms}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 hide-on-print">
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
                <div className="text-2xl font-bold text-green-600">{stats.uniqueClasses}</div>
                <div className="text-xs text-muted-foreground">{t('classes.classes')}</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{stats.uniqueSubjects}</div>
                <div className="text-xs text-muted-foreground">{t('timetables.subjects')}</div>
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

        {/* No Sessions Message */}
        {!teacherSchedule?.sessions || teacherSchedule.sessions.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <AlertTriangle className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
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
          <>
            {/* Schedule Grid - Web View */}
            <Card className="card-print web-timetable-grid">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-blue-500" />
                  {t('teacherSidebar.profile.mySchedule')}
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
                                  className={`p-2 rounded border h-full cursor-pointer hover:opacity-80 transition-opacity ${getSessionTypeColor(session)}`}
                                  onClick={() => handleSessionClick(session)}
                                >
                                  <div className="text-xs font-bold mb-1 truncate">
                                    {session.class_name || session.school_class_name || session.timetable?.school_class_name}
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

            {/* Print-Only Simple Timetable Table */}
            <div className="print-only-table hide-on-screen">
              <table className="simple-print-table">
                <thead>
                  <tr>
                    <th className="day-header">Day</th>
                    {timeSlots.map((slot) => (
                      <th key={slot.period} className="time-header">
                        <div>الحصة {slot.period}</div>
                        <div>{slot.start} - {slot.end}</div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {weekDays.slice(0, 6).map((day) => (
                    <tr key={day.key}>
                      <td className="day-cell">{day.name}</td>
                      {timeSlots.map((slot) => {
                        const session = getSessionForSlot(day.value, slot.period);
                        return (
                          <td key={slot.period} className="session-cell">
                            {session ? (
                              <div>
                                <div className="class-name">{session.class_name || session.school_class_name || session.timetable?.school_class_name}</div>
                                <div className="subject">{session.subject_name}</div>
                                {session.room_name && (
                                  <div className="room">{session.room_name}</div>
                                )}
                              </div>
                            ) : (
                              ''
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Sessions List */}
            <Card className="hide-on-print">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-blue-500" />
                  {t('timetables.sessionsList')} ({teacherSchedule.sessions.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {teacherSchedule.sessions
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
                                <h4 className="font-medium">{session.class_name || session.school_class_name || session.timetable?.school_class_name}</h4>
                                <Badge variant="outline">{dayName}</Badge>
                                <Badge variant="outline">
                                  {t('timetables.period')} {session.session_order}
                                </Badge>
                              </div>
                              
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <BookOpen className="h-4 w-4" />
                                  <span>{session.subject_name}</span>
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
          </>
        )}
      </div>

      {/* Session Details Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-blue-500" />
              {t('timetables.sessionDetails')}
            </DialogTitle>
            <DialogDescription>
              {t('timetables.fullSessionInformation')}
            </DialogDescription>
          </DialogHeader>
          
          {selectedSession && (
            <div className="space-y-4">
              {/* Class Name */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">{t('classes.class')}:</span>
                </div>
                <div className="pl-6 text-sm bg-muted/50 p-2 rounded">
                  {selectedSession.class_name || selectedSession.school_class_name || selectedSession.timetable?.school_class_name || 'N/A'}
                </div>
              </div>

              {/* Subject */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">{t('timetables.subject')}:</span>
                </div>
                <div className="pl-6 text-sm bg-muted/50 p-2 rounded">
                  {selectedSession.subject_name || 'N/A'}
                </div>
              </div>

              {/* Day and Time */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">{t('timetables.schedule')}:</span>
                </div>
                <div className="pl-6 text-sm bg-muted/50 p-2 rounded">
                  <div className="flex justify-between">
                    <span>{weekDays.find(d => d.value === selectedSession.day_of_week)?.name}</span>
                    <span>{t('timetables.period')} {selectedSession.session_order}</span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {selectedSession.start_time} - {selectedSession.end_time}
                  </div>
                </div>
              </div>

              {/* Room */}
              {selectedSession.room_name && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">{t('timetables.room')}:</span>
                  </div>
                  <div className="pl-6 text-sm bg-muted/50 p-2 rounded">
                    {selectedSession.room_name}
                  </div>
                </div>
              )}

              {/* Academic Year */}
              {selectedSession.academic_year && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">{t('classes.academicYear')}:</span>
                  </div>
                  <div className="pl-6 text-sm bg-muted/50 p-2 rounded">
                    {selectedSession.academic_year}
                  </div>
                </div>
              )}

              {/* Notes */}
              {selectedSession.notes && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">{t('common.notes')}:</span>
                  </div>
                  <div className="pl-6 text-sm bg-muted/50 p-2 rounded">
                    {selectedSession.notes}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end gap-2 pt-4 border-t">
                <Button variant="outline" onClick={handleCloseModal}>
                  {t('common.close')}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </TeacherPageLayout>
  );
};

export default TeacherMySchedulePage;