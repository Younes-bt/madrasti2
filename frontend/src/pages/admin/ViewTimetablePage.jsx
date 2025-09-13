import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
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
import jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import AdminPageLayout from '../../components/admin/layout/AdminPageLayout';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import attendanceService from '../../services/attendance';
import { toast } from 'sonner';
import api from '../../services/api';
import '../../styles/print.css';

const ViewTimetablePage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [timetable, setTimetable] = useState(null);
  const [schoolConfig, setSchoolConfig] = useState(null);
  const timetableRef = useRef(null);

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
    fetchSchoolConfig();
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

  const fetchSchoolConfig = async () => {
    try {
      let configResponse;
      try {
        // First try: list endpoint (should return array with single school)
        configResponse = await api.get('/schools/config/');
        const data = configResponse.data;
        
        // Handle different possible response structures
        let schoolData;
        if (data.results && Array.isArray(data.results)) {
          // DRF paginated response
          schoolData = data.results[0];
        } else if (Array.isArray(data)) {
          // Direct array response
          schoolData = data[0];
        } else {
          // Direct object response
          schoolData = data;
        }
        
        setSchoolConfig(schoolData);
      } catch (listError) {
        // Second try: detail endpoint with ID 1
        try {
          configResponse = await api.get('/schools/config/1/');
          setSchoolConfig(configResponse.data);
        } catch (detailError) {
          console.error('Both config endpoints failed:', { listError, detailError });
          // Use fallback from user data if available
          if (user?.school_info) {
            setSchoolConfig(user.school_info);
          }
        }
      }
    } catch (err) {
      console.error('Error fetching school config:', err);
      // Use fallback from user data if available
      if (user?.school_info) {
        setSchoolConfig(user.school_info);
      }
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
    // Create a dedicated print window with better control
    const printWindow = window.open('', '_blank', 'width=1200,height=800');
    
    const printContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Timetable - ${timetable.school_class_name}</title>
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
          .class-info {
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
          .subject { font-weight: bold; font-size: 11px; margin-bottom: 2px; }
          .teacher { font-size: 10px; margin-bottom: 1px; }
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
            <div class="class-info">جدول الحصص - Class Timetable</div>
            <div class="class-info">${timetable?.school_class_name} - ${timetable?.academic_year_name}</div>
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
                          <div class="subject">${session.subject_name}</div>
                          <div class="teacher">${session.teacher_name}</div>
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
    
    // Wait for content to load, then print
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 500);
    };
  };

  const handleExport = () => {
    if (timetableRef.current) {
      toast.info(t('timetables.generatingPdf'));
      
      // Create a clean HTML structure for PDF export
      const tempContainer = document.createElement('div');
      tempContainer.style.position = 'absolute';
      tempContainer.style.left = '-9999px';
      tempContainer.style.top = '-9999px';
      tempContainer.style.width = '1200px';
      tempContainer.style.backgroundColor = 'white';
      tempContainer.style.padding = '40px';
      tempContainer.style.fontFamily = 'Arial, sans-serif';
      tempContainer.style.textAlign = 'center';
      
      // Create header
      const header = document.createElement('div');
      header.style.textAlign = 'center';
      header.style.marginBottom = '30px';
      
      const schoolName = document.createElement('div');
      schoolName.style.fontSize = '24px';
      schoolName.style.fontWeight = 'bold';
      schoolName.style.marginBottom = '10px';
      schoolName.textContent = `${schoolConfig?.name_arabic || 'الطاود'} - ${schoolConfig?.name || 'Taoud School'}`;
      
      const classInfo1 = document.createElement('div');
      classInfo1.style.fontSize = '18px';
      classInfo1.style.marginBottom = '5px';
      classInfo1.textContent = 'جدول الحصص - Class Timetable';
      
      const classInfo2 = document.createElement('div');
      classInfo2.style.fontSize = '18px';
      classInfo2.style.marginBottom = '5px';
      classInfo2.textContent = `${timetable?.school_class_name} - ${timetable?.academic_year_name}`;
      
      header.appendChild(schoolName);
      header.appendChild(classInfo1);
      header.appendChild(classInfo2);
      
      // Create table
      const table = document.createElement('table');
      table.style.width = '100%';
      table.style.borderCollapse = 'collapse';
      table.style.border = '2px solid #000';
      table.style.margin = '0 auto';
      
      // Create table header
      const thead = document.createElement('thead');
      const headerRow = document.createElement('tr');
      
      // Day header
      const dayHeader = document.createElement('th');
      dayHeader.style.border = '1px solid #000';
      dayHeader.style.padding = '8px 4px';
      dayHeader.style.backgroundColor = '#f5f5f5';
      dayHeader.style.fontWeight = 'bold';
      dayHeader.style.fontSize = '12px';
      dayHeader.textContent = 'Day';
      headerRow.appendChild(dayHeader);
      
      // Time slot headers
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
        
        // Day cell
        const dayCell = document.createElement('td');
        dayCell.style.border = '1px solid #000';
        dayCell.style.padding = '8px 4px';
        dayCell.style.backgroundColor = '#f5f5f5';
        dayCell.style.fontWeight = 'bold';
        dayCell.style.fontSize = '12px';
        dayCell.style.textAlign = 'center';
        dayCell.textContent = day.name;
        row.appendChild(dayCell);
        
        // Session cells
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
            const subject = document.createElement('div');
            subject.style.fontWeight = 'bold';
            subject.style.fontSize = '11px';
            subject.style.marginBottom = '2px';
            subject.textContent = session.subject_name;
            
            const teacher = document.createElement('div');
            teacher.style.fontSize = '10px';
            teacher.style.marginBottom = '1px';
            teacher.textContent = session.teacher_name;
            
            sessionCell.appendChild(subject);
            sessionCell.appendChild(teacher);
            
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
      
      // Add elements to container
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
        // Remove temporary container
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
        pdf.save(`timetable-${timetable.school_class_name}.pdf`);
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
        actions={[<ActionButtons key="action-buttons" />]}
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
        actions={[<ActionButtons key="action-buttons" />]}
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
      actions={[<ActionButtons key="action-buttons" />]}
    >
      <div className="space-y-6 printable-content" ref={timetableRef}>
        {/* Print-Only Simple Header */}
        <div className="print-only-header hide-on-screen">
          <div className="print-school-name">
            {schoolConfig?.name_arabic || 'الطاود'} - {schoolConfig?.name || 'Taoud School'}
          </div>
          <div className="print-class-info">
            جدول الحصص - Class Timetable
          </div>
          <div className="print-class-info">
            {timetable?.school_class_name} - {timetable?.academic_year_name}
          </div>
        </div>

        {/* Header Information */}
        <Card className="card-print">
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
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 hide-on-print">
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

        {/* Timetable Grid - Web View */}
        <Card className="card-print web-timetable-grid">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-500" />
              {t('timetables.weeklySchedule')}
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
                            <div className={`p-2 rounded border h-full ${getSessionTypeColor(session)}`}>
                              <div className="text-xs font-bold mb-1 truncate">
                                {session.subject_name}
                              </div>
                              <div className="space-y-1 text-[11px]">
                                <div className="flex items-center gap-1">
                                  <User className="h-3 w-3 flex-shrink-0" />
                                  <span className="truncate">{session.teacher_name}</span>
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
                            <div className="subject">{session.subject_name}</div>
                            <div className="teacher">{session.teacher_name}</div>
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
        {timetable.sessions && timetable.sessions.length > 0 && (
          <Card className="hide-on-print">
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
