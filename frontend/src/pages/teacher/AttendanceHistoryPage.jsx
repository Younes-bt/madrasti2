import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Calendar,
  Users,
  FileText,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  RotateCcw,
  Search
} from 'lucide-react';
import TeacherPageLayout from '../../components/teacher/layout/TeacherPageLayout';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../../components/ui/dialog';
import attendanceService from '../../services/attendance';
import { toast } from 'sonner';

const AttendanceHistoryPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [attendanceSessions, setAttendanceSessions] = useState([]);
  const [filteredSessions, setFilteredSessions] = useState([]);
  const [teacherClasses, setTeacherClasses] = useState([]);

  // Filters
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    classId: '',
    status: '',
    searchTerm: ''
  });

  // View details modal
  const [selectedSession, setSelectedSession] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [sessionStudents, setSessionStudents] = useState([]);
  const [loadingDetails, setLoadingDetails] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, attendanceSessions]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch attendance sessions
      const sessionsResponse = await attendanceService.getAttendanceSessions({
        my_sessions: true
      });

      const sessions = sessionsResponse.results || sessionsResponse || [];
      setAttendanceSessions(sessions);
      setFilteredSessions(sessions);

      console.log('Attendance sessions:', sessions);

      // Extract unique classes from sessions
      const uniqueClasses = [];
      const classIds = new Set();

      sessions.forEach(session => {
        console.log('Session:', session);

        // Try multiple ways to get class info
        const classId = session.timetable_session?.school_class?.id ||
                       session.timetable_session?.school_class_id ||
                       session.class_id;
        const className = session.timetable_session?.school_class?.name ||
                         session.timetable_session?.class_name ||
                         session.class_name;

        console.log('Extracted class:', { classId, className });

        if (classId && className && !classIds.has(classId)) {
          classIds.add(classId);
          uniqueClasses.push({ id: classId, name: className });
        }
      });

      console.log('Unique classes:', uniqueClasses);
      setTeacherClasses(uniqueClasses);
    } catch (error) {
      console.error('Failed to fetch attendance data:', error);
      toast.error(t('error.failedToLoadData'));
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
    toast.success(t('common.refreshed'));
  };

  const applyFilters = () => {
    let filtered = [...attendanceSessions];

    // Filter by date range
    if (filters.startDate) {
      filtered = filtered.filter(session =>
        new Date(session.date) >= new Date(filters.startDate)
      );
    }

    if (filters.endDate) {
      filtered = filtered.filter(session =>
        new Date(session.date) <= new Date(filters.endDate)
      );
    }

    // Filter by class
    if (filters.classId) {
      filtered = filtered.filter(session => {
        const classId = session.timetable_session?.school_class_id || session.class_id;
        return classId === parseInt(filters.classId);
      });
    }

    // Filter by status
    if (filters.status) {
      filtered = filtered.filter(session => session.status === filters.status);
    }

    // Filter by search term (class name, subject, date)
    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(session => {
        const className = (session.timetable_session?.class_name || session.class_name || '').toLowerCase();
        const subjectName = (session.timetable_session?.subject_name || session.subject_name || '').toLowerCase();
        const date = session.date;

        return className.includes(term) || subjectName.includes(term) || date.includes(term);
      });
    }

    setFilteredSessions(filtered);
  };

  const handleViewDetails = async (session) => {
    setSelectedSession(session);
    setIsDetailsModalOpen(true);
    setLoadingDetails(true);

    try {
      const response = await attendanceService.getSessionStudents(session.id);
      setSessionStudents(response.students || []);
    } catch (error) {
      console.error('Failed to load session details:', error);
      toast.error(t('error.failedToLoadData'));
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleEditAttendance = (session) => {
    // Navigate to the attendance page and open the session
    navigate('/teacher/attendance', { state: { openSession: session } });
  };

  const handleExportAttendance = async (session) => {
    try {
      // You can implement CSV export here
      const csvData = await generateCSV(session);
      downloadCSV(csvData, `attendance_${session.date}_${session.id}.csv`);
      toast.success(t('common.exported'));
    } catch (error) {
      console.error('Failed to export attendance:', error);
      toast.error(t('error.failedToExport'));
    }
  };

  const generateCSV = async (session) => {
    const response = await attendanceService.getSessionStudents(session.id);
    const students = response.students || [];

    const headers = ['Student Name', 'Student ID', 'Status', 'Notes'];
    const rows = students.map(record => [
      record.student.full_name,
      record.student.student_id || record.student.id,
      record.status,
      record.notes || ''
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    return csvContent;
  };

  const downloadCSV = (csvContent, filename) => {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDeleteAttendance = async (session) => {
    if (!window.confirm(t('attendance.confirmDelete'))) {
      return;
    }

    try {
      await attendanceService.deleteAttendanceSession(session.id);
      toast.success(t('attendance.deleteSuccess'));

      // Refresh the data
      await fetchData();
    } catch (error) {
      console.error('Failed to delete attendance:', error);
      toast.error(t('error.failedToDelete'));
    }
  };

  const clearFilters = () => {
    setFilters({
      startDate: '',
      endDate: '',
      classId: '',
      status: '',
      searchTerm: ''
    });
  };

  const getStatusBadge = (status) => {
    const variants = {
      not_started: { variant: 'secondary', icon: Clock, label: t('status.pending') },
      in_progress: { variant: 'default', icon: Clock, label: t('status.in_progress') },
      completed: { variant: 'success', icon: CheckCircle2, label: t('status.completed') }
    };

    const config = variants[status] || variants.not_started;
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
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
        title={t('attendance.history')}
        subtitle={t('attendance.historySubtitle')}
        actions={[<ActionButtons key="actions" />]}
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
      title={t('attendance.history')}
      subtitle={t('attendance.historySubtitle')}
      actions={[<ActionButtons key="actions" />]}
    >
      <div className="space-y-6">
        {/* Filters Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-blue-500" />
              {t('common.filters')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {/* Search */}
              <div className="space-y-2">
                <Label htmlFor="search">{t('common.search')}</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder={t('attendance.searchPlaceholder')}
                    value={filters.searchTerm}
                    onChange={(e) => setFilters({ ...filters, searchTerm: e.target.value })}
                    className="pl-9"
                  />
                </div>
              </div>

              {/* Start Date */}
              <div className="space-y-2">
                <Label htmlFor="start-date">{t('attendance.startDate')}</Label>
                <Input
                  id="start-date"
                  type="date"
                  value={filters.startDate}
                  onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                />
              </div>

              {/* End Date */}
              <div className="space-y-2">
                <Label htmlFor="end-date">{t('attendance.endDate')}</Label>
                <Input
                  id="end-date"
                  type="date"
                  value={filters.endDate}
                  onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                />
              </div>

              {/* Class Filter */}
              <div className="space-y-2">
                <Label htmlFor="class-filter">{t('common.class')}</Label>
                <Select
                  value={filters.classId || undefined}
                  onValueChange={(value) => setFilters({ ...filters, classId: value === 'all' ? '' : value })}
                >
                  <SelectTrigger id="class-filter">
                    <SelectValue placeholder={t('common.allClasses')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('common.allClasses')}</SelectItem>
                    {teacherClasses.map(cls => (
                      <SelectItem key={cls.id} value={cls.id.toString()}>
                        {cls.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Status Filter */}
              <div className="space-y-2">
                <Label htmlFor="status-filter">{t('common.status')}</Label>
                <Select
                  value={filters.status || undefined}
                  onValueChange={(value) => setFilters({ ...filters, status: value === 'all' ? '' : value })}
                >
                  <SelectTrigger id="status-filter">
                    <SelectValue placeholder={t('common.allStatuses')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('common.allStatuses')}</SelectItem>
                    <SelectItem value="not_started">{t('status.pending')}</SelectItem>
                    <SelectItem value="in_progress">{t('status.in_progress')}</SelectItem>
                    <SelectItem value="completed">{t('status.completed')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Clear Filters Button */}
            <div className="mt-4 flex justify-end">
              <Button variant="outline" onClick={clearFilters} size="sm">
                <XCircle className="h-4 w-4 mr-2" />
                {t('common.reset')}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results Summary */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  {t('attendance.showingResults', { count: filteredSessions.length, total: attendanceSessions.length })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Attendance Records Table */}
        {filteredSessions.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {t('attendance.noRecords')}
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                {t('attendance.noRecordsDescription')}
              </p>
              <Button onClick={() => navigate('/teacher/attendance')}>
                {t('attendance.takeAttendance')}
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('attendance.date')}</TableHead>
                    <TableHead>{t('common.class')}</TableHead>
                    <TableHead>{t('subjects.subject')}</TableHead>
                    <TableHead>{t('common.status')}</TableHead>
                    <TableHead>{t('attendance.present')}</TableHead>
                    <TableHead>{t('attendance.absent')}</TableHead>
                    <TableHead>{t('attendance.late')}</TableHead>
                    <TableHead className="text-right">{t('common.actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSessions.map((session, index) => (
                    <motion.tr
                      key={session.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.02 }}
                      className="border-b hover:bg-muted/50"
                    >
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          {new Date(session.date).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        {session.timetable_session?.class_name || session.class_name || '-'}
                      </TableCell>
                      <TableCell>
                        {session.timetable_session?.subject_name || session.subject_name || '-'}
                      </TableCell>
                      <TableCell>{getStatusBadge(session.status)}</TableCell>
                      <TableCell>
                        <span className="text-green-600 font-medium">
                          {session.present_count || 0}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-red-600 font-medium">
                          {session.absent_count || 0}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-yellow-600 font-medium">
                          {session.late_count || 0}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewDetails(session)}
                            title={t('common.view')}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditAttendance(session)}
                            title={t('common.edit')}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleExportAttendance(session)}
                            title={t('common.export')}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteAttendance(session)}
                            title={t('common.delete')}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Details Modal */}
      <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-500" />
              {t('attendance.sessionDetails')}
            </DialogTitle>
            <DialogDescription>
              {selectedSession && (
                <div className="space-y-2 mt-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(selectedSession.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4" />
                    <span>{selectedSession.timetable_session?.class_name || selectedSession.class_name}</span>
                  </div>
                </div>
              )}
            </DialogDescription>
          </DialogHeader>

          {loadingDetails ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('students.studentName')}</TableHead>
                    <TableHead>{t('common.status')}</TableHead>
                    <TableHead>{t('common.notes')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sessionStudents.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell className="font-medium">
                        {record.student.full_name}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(record.status)}>
                          {t(`attendance.${record.status}`)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {record.notes || '-'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </TeacherPageLayout>
  );
};

export default AttendanceHistoryPage;
