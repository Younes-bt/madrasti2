import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import i18n from '../../lib/i18n';
import {
  Plus,
  Search,
  MoreVertical,
  Edit,
  Trash2,
  GraduationCap,
  CheckCircle,
  XCircle,
  UserPlus,
  Upload,
  Library,
  Building,
  Users2,
  ChevronLeft,
  ChevronRight,
  FileWarning,
  MessageSquare,
  Send,
  Loader2
} from 'lucide-react';
import AdminPageLayout from '../../components/admin/layout/AdminPageLayout';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '../../components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { apiMethods } from '../../services/api';
import communicationService from '../../services/communication';
import { toast } from 'sonner';
import { getLocalizedName } from '@/lib/utils';

const StatCard = (props) => {
  const { icon: CardIcon, label, value, colorClass, description } = props;
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{label}</CardTitle>
        <CardIcon className={`h-4 w-4 text-muted-foreground ${colorClass}`} />
      </CardHeader>
      <CardContent>
        <div className={`text-2xl font-bold ${colorClass}`}>{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
};

const StudentsManagementPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [enrollments, setEnrollments] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');

  const [educationalStructure, setEducationalStructure] = useState({ levels: [], academicYears: [] });
  const [allClasses, setAllClasses] = useState([]);
  const [levelFilter, setLevelFilter] = useState('');
  const [gradeFilter, setGradeFilter] = useState('');
  const [classFilter, setClassFilter] = useState('');

  const [pagination, setPagination] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0
  });

  // Message Modal State
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [selectedStudentForMessage, setSelectedStudentForMessage] = useState(null);
  const [messageContent, setMessageContent] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);

  const fetchEducationalData = useCallback(async () => {
    try {
      const [structureData, classesData] = await Promise.all([
        apiMethods.get('users/bulk-import/status/'),
        apiMethods.get('schools/classes/')
      ]);

      setEducationalStructure({
        levels: structureData.educational_levels || [],
        academicYears: structureData.academic_years || [],
      });

      const classes = classesData.results && Array.isArray(classesData.results) ? classesData.results : Array.isArray(classesData) ? classesData : [];
      setAllClasses(classes);

    } catch (error) {
      console.error('Failed to fetch educational data:', error);
      toast.error(t('error.failedToLoadEducationalData'));
    }
  }, [t]);

  const fetchEnrollments = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (levelFilter) params.append('school_class__grade__educational_level', levelFilter);
      if (gradeFilter) params.append('school_class__grade', gradeFilter);
      if (classFilter) params.append('school_class', classFilter);
      if (debouncedSearchQuery) params.append('search', debouncedSearchQuery);
      if (currentPage) params.append('page', currentPage);

      const response = await apiMethods.get(`users/enrollments/?${params.toString()}`);

      if (response.results && Array.isArray(response.results)) {
        setEnrollments(response.results);
        setPagination({
          count: response.count,
          next: response.next,
          previous: response.previous
        });
      } else {
        setEnrollments([]);
        setPagination(null);
      }

    } catch (error) {
      console.error('Failed to fetch enrollments:', error);
      toast.error(t('error.failedToLoadData'));
      setEnrollments([]);
      setPagination(null);
    } finally {
      setLoading(false);
    }
  }, [levelFilter, gradeFilter, classFilter, debouncedSearchQuery, currentPage, t]);

  const fetchStats = useCallback(async () => {
    try {
      const totalParams = new URLSearchParams();
      if (levelFilter) totalParams.append('school_class__grade__educational_level', levelFilter);
      if (gradeFilter) totalParams.append('school_class__grade', gradeFilter);
      if (classFilter) totalParams.append('school_class', classFilter);
      if (debouncedSearchQuery) totalParams.append('search', debouncedSearchQuery);

      const activeParams = new URLSearchParams(totalParams);
      activeParams.append('is_active', 'true');

      const inactiveParams = new URLSearchParams(totalParams);
      inactiveParams.append('is_active', 'false');

      const [totalResponse, activeResponse, inactiveResponse] = await Promise.all([
        apiMethods.get(`users/enrollments/?${totalParams.toString()}&page=1`),
        apiMethods.get(`users/enrollments/?${activeParams.toString()}&page=1`),
        apiMethods.get(`users/enrollments/?${inactiveParams.toString()}&page=1`)
      ]);

      setStats({
        total: totalResponse.count || 0,
        active: activeResponse.count || 0,
        inactive: inactiveResponse.count || 0
      });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
      setStats({ total: 0, active: 0, inactive: 0 });
    }
  }, [levelFilter, gradeFilter, classFilter, debouncedSearchQuery]);

  useEffect(() => {
    fetchEducationalData();
  }, [fetchEducationalData]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  useEffect(() => {
    fetchEnrollments();
  }, [fetchEnrollments]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const gradesForSelectedLevel = useMemo(() => {
    if (!levelFilter) return [];
    const selectedLevel = educationalStructure.levels.find(l => l.id === parseInt(levelFilter));
    return selectedLevel?.grades || [];
  }, [levelFilter, educationalStructure.levels]);

  const classesForSelectedGrade = useMemo(() => {
    if (!gradeFilter) return [];
    return allClasses.filter(c => c.grade_id === parseInt(gradeFilter));
  }, [gradeFilter, allClasses]);

  const getDisplayName = (student) => {
    const isArabic = i18n.language === 'ar';
    if (isArabic && (student.ar_first_name || student.ar_last_name)) {
      return `${student.ar_first_name || ''} ${student.ar_last_name || ''}`.trim();
    }
    return student.full_name || `${student.first_name || ''} ${student.last_name || ''}`.trim();
  };

  const handleViewStudent = (studentId) => navigate(`/admin/school-management/students/view/${studentId}`);
  const handleEditStudent = (studentId) => navigate(`/admin/school-management/students/edit/${studentId}`);
  const handleDeleteStudent = (studentId) => toast.info(`${t('action.delete')} student: ${studentId}`);
  const handleAddStudent = () => navigate('/admin/school-management/students/add');
  const handleBulkImportStudents = () => navigate('/admin/school-management/students/bulk-import');

  const handleSendMessage = (student) => {
    setSelectedStudentForMessage(student);
    setIsMessageModalOpen(true);
    setMessageContent('');
  };

  const handleSendMessageSubmit = async () => {
    if (!messageContent.trim() || !selectedStudentForMessage) return;
    setSendingMessage(true);
    try {
      const conversation = await communicationService.startDirectConversation(selectedStudentForMessage.id);
      await communicationService.sendMessage({
        conversation: conversation.id,
        content: messageContent.trim()
      });
      toast.success(t('Message sent successfully'));
      setIsMessageModalOpen(false);
      setMessageContent('');
      setSelectedStudentForMessage(null);
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error(t('Failed to send message'));
    } finally {
      setSendingMessage(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleDateString(i18n.language, { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const handleFilterChange = (setter) => (value) => {
    setter(value === 'all' ? '' : value);
    setCurrentPage(1);
  };

  const PaginationControls = () => {
    if (!pagination || pagination.count <= 20) return null;
    const totalPages = Math.ceil(pagination.count / 20);
    return (
      <div className="flex items-center justify-between px-2 mt-4">
        <div className="text-sm text-muted-foreground">
          {t('common.total_rows', { count: pagination.count })}
        </div>
        <div className="flex items-center space-x-6 lg:space-x-8">
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium">{t('common.page')}</p>
            <Select
              value={currentPage.toString()}
              onValueChange={(value) => setCurrentPage(Number(value))}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: totalPages }, (_, i) => (
                  <SelectItem key={i + 1} value={(i + 1).toString()}>
                    {i + 1}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-sm text-muted-foreground">
              {t('common.of')} {totalPages}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => setCurrentPage(prev => prev - 1)}
              disabled={!pagination?.previous}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              className="h-8 w-8 p-0"
              onClick={() => setCurrentPage(prev => prev + 1)}
              disabled={!pagination?.next}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <AdminPageLayout
      title={t('admin.studentsManagement.title')}
      subtitle={t('admin.studentsManagement.subtitle')}
      actions={[
        <Button key="add-student" onClick={handleAddStudent} className="gap-2">
          <Plus className="h-4 w-4" />{t('action.addStudent')}
        </Button>,
        <Button key="bulk-import" onClick={handleBulkImportStudents} variant="outline" className="gap-2">
          <Upload className="h-4 w-4" />{t('action.bulkImport')}
        </Button>
      ]}
      loading={loading}
    >
      <div
        className="space-y-6"
      >
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <StatCard
            icon={GraduationCap}
            label={t('admin.studentsManagement.stats.totalStudents')}
            value={stats.total}
            colorClass="text-blue-500"
            description={t('admin.studentsManagement.stats.totalStudentsDescription')}
          />
          <StatCard
            icon={CheckCircle}
            label={t('admin.studentsManagement.stats.activeStudents')}
            value={stats.active}
            colorClass="text-green-500"
            description={t('admin.studentsManagement.stats.activeStudentsDescription')}
          />
          <StatCard
            icon={XCircle}
            label={t('admin.studentsManagement.stats.inactiveStudents')}
            value={stats.inactive}
            colorClass="text-red-500"
            description={t('admin.studentsManagement.stats.inactiveStudentsDescription')}
          />
        </div>

        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row items-center gap-4 mb-4">
              <div className="relative w-full sm:max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={t('admin.studentsManagement.searchPlaceholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 w-full sm:w-auto ml-auto">
                <Select value={levelFilter} onValueChange={handleFilterChange(setLevelFilter)}>
                  <SelectTrigger>
                    <Library className="h-4 w-4 mr-2 text-muted-foreground" />
                    <SelectValue placeholder={t('common.level')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('common.allLevels')}</SelectItem>
                    {educationalStructure.levels.map(level => (
                      <SelectItem key={level.id} value={level.id.toString()}>{getLocalizedName(level, i18n.language)}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={gradeFilter} onValueChange={handleFilterChange(setGradeFilter)} disabled={!levelFilter}>
                  <SelectTrigger>
                    <Building className="h-4 w-4 mr-2 text-muted-foreground" />
                    <SelectValue placeholder={t('common.grade')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('common.allGrades')}</SelectItem>
                    {gradesForSelectedLevel.map(grade => (
                      <SelectItem key={grade.id} value={grade.id.toString()}>{getLocalizedName(grade, i18n.language)}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={classFilter} onValueChange={handleFilterChange(setClassFilter)} disabled={!gradeFilter}>
                  <SelectTrigger>
                    <Users2 className="h-4 w-4 mr-2 text-muted-foreground" />
                    <SelectValue placeholder={t('common.class')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('common.allClasses')}</SelectItem>
                    {classesForSelectedGrade.map(cls => (
                      <SelectItem key={cls.id} value={cls.id.toString()}>{getLocalizedName(cls, i18n.language)}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('common.student')}</TableHead>
                    <TableHead>{t('common.studentId')}</TableHead>
                    <TableHead>{t('common.class')}</TableHead>
                    <TableHead>{t('common.status')}</TableHead>
                    <TableHead>{t('common.enrolledOn')}</TableHead>
                    <TableHead>{t('common.actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center">
                        {t('common.loading')}
                      </TableCell>
                    </TableRow>
                  ) : enrollments.length > 0 ? (
                    enrollments.map(({ id, student, student_number, school_class_name, is_active, enrollment_date }) => (
                      <TableRow
                        key={id}
                        className="cursor-pointer hover:bg-muted/50 transition-colors"
                        onClick={() => handleViewStudent(student.id)}
                      >
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9">
                              <AvatarImage src={student.profile_picture_url} alt={getDisplayName(student)} />
                              <AvatarFallback>
                                {(student.first_name?.[0] || '') + (student.last_name?.[0] || '')}
                              </AvatarFallback>
                            </Avatar>
                            <div className="font-medium">{getDisplayName(student)}</div>
                          </div>
                        </TableCell>
                        <TableCell>{student_number || 'N/A'}</TableCell>
                        <TableCell>{school_class_name || '—'}</TableCell>
                        <TableCell>
                          <Badge variant={is_active ? 'default' : 'outline'} className={is_active ? 'bg-green-100 text-green-800' : ''}>
                            {is_active ? t('status.active') : t('status.inactive')}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatDate(enrollment_date)}</TableCell>
                        <TableCell onClick={(e) => e.stopPropagation()}>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleEditStudent(student.id); }}>
                                <Edit className="mr-2 h-4 w-4" /><span>{t('action.edit')}</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleSendMessage(student); }}>
                                <MessageSquare className="mr-2 h-4 w-4" /><span>{t('action.sendMessage') || 'Send Message'}</span>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleDeleteStudent(student.id); }} className="text-red-600">
                                <Trash2 className="mr-2 h-4 w-4" /><span>{t('action.delete')}</span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="h-48 text-center">
                        <div className="flex flex-col items-center justify-center space-y-4">
                          <FileWarning className="h-12 w-12 text-muted-foreground" />
                          <h3 className="text-lg font-semibold">{t('admin.studentsManagement.noStudentsFound')}</h3>
                          <Button size="sm" onClick={handleAddStudent}>
                            <UserPlus className="mr-2 h-4 w-4" />
                            {t('action.addStudent')}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
        <PaginationControls />

        <Dialog open={isMessageModalOpen} onOpenChange={setIsMessageModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {t('Send Message to')} {selectedStudentForMessage ? getDisplayName(selectedStudentForMessage) : ''}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">{t('Message')}</label>
                <textarea
                  value={messageContent}
                  onChange={(e) => setMessageContent(e.target.value)}
                  placeholder={t('Type your message...')}
                  className="w-full min-h-[120px] p-3 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                  disabled={sendingMessage}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsMessageModalOpen(false)}
                disabled={sendingMessage}
              >
                {t('Cancel')}
              </Button>
              <Button
                onClick={handleSendMessageSubmit}
                disabled={!messageContent.trim() || sendingMessage}
              >
                {sendingMessage ? t('Sending...') : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    {t('Send Message')}
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminPageLayout>
  );
};

export default StudentsManagementPage;
