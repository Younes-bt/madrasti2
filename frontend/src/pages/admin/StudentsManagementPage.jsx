import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Filter, 
  Users, 
  Mail, 
  Phone, 
  MoreVertical, 
  Eye, 
  Edit, 
  Trash2,
  UserCheck,
  UserX,
  GraduationCap
} from 'lucide-react';
import AdminPageLayout from '../../components/admin/layout/AdminPageLayout';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '../../components/ui/dropdown-menu';
import { apiMethods } from '../../services/api';
import { toast } from 'sonner';

const StudentsManagementPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [pagination, setPagination] = useState({
    count: 0,
    currentPage: 1,
    totalPages: 1,
    pageSize: 20
  });
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0
  });

  const fetchStudents = async () => {
    setLoading(true);
    try {
      // Fetch all students without pagination or filtering
      const params = {
        role: 'STUDENT'
        // Remove pagination to get all students at once
      };

      const response = await apiMethods.get('users/users/', { params });

      let studentsData = [];
      
      // Handle different response structures
      if (response.results && Array.isArray(response.results)) {
        // DRF paginated response - get all pages if paginated
        studentsData = response.results;
        // If there are more pages, we might want to fetch all, but for now assume small dataset
      } else if (Array.isArray(response)) {
        // Direct array response
        studentsData = response;
      } else if (response.data) {
        // Handle case where response is wrapped
        if (response.data.results && Array.isArray(response.data.results)) {
          studentsData = response.data.results;
        } else if (Array.isArray(response.data)) {
          studentsData = response.data;
        }
      }

      setStudents(studentsData);

      // Update statistics based on all students data
      const activeCount = studentsData.filter(student => student.is_active).length;
      setStats({
        total: studentsData.length,
        active: activeCount,
        inactive: studentsData.length - activeCount
      });

      // Update pagination for display purposes
      setPagination({
        count: studentsData.length,
        currentPage: 1,
        totalPages: 1,
        pageSize: studentsData.length
      });

    } catch (error) {
      console.error('Failed to fetch students:', error);
      console.error('Error response:', error.response);
      toast.error(t('error.failedToLoadData'));
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Client-side filtering - no API calls needed
  const filteredStudents = students.filter(student => {
    // Apply search filter
    let matchesSearch = true;
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      matchesSearch = 
        student.first_name?.toLowerCase().includes(query) ||
        student.last_name?.toLowerCase().includes(query) ||
        student.full_name?.toLowerCase().includes(query) ||
        student.email?.toLowerCase().includes(query) ||
        student.phone?.toLowerCase().includes(query) ||
        student.student_id?.toLowerCase().includes(query) ||
        student.class_name?.toLowerCase().includes(query);
    }

    // Apply status filter
    let matchesStatus = true;
    if (statusFilter !== 'all') {
      matchesStatus = statusFilter === 'active' ? student.is_active : !student.is_active;
    }

    return matchesSearch && matchesStatus;
  });

  const handleSearch = () => {
    // No longer needed since filtering is automatic
  };

  const handleViewStudent = (studentId) => {
    navigate(`/admin/school-management/students/view/${studentId}`);
  };

  const handleEditStudent = (studentId) => {
    navigate(`/admin/school-management/students/edit/${studentId}`);
  };

  const handleDeleteStudent = (studentId) => {
    toast.info(`${t('action.delete')} student: ${studentId}`);
  };

  const handleAddStudent = () => {
    navigate('/admin/school-management/students/add');
  };

  const getStatusBadge = (isActive) => {
    return (
      <Badge 
        variant={isActive ? 'default' : 'secondary'}
        className={isActive ? 'bg-green-100 text-green-800 hover:bg-green-100' : 'bg-red-100 text-red-800 hover:bg-red-100'}
      >
        {isActive ? t('status.active') : t('status.inactive')}
      </Badge>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString();
  };

  const actions = [
    <Button key="add" onClick={handleAddStudent} className="gap-2">
      <Plus className="h-4 w-4" />
      {t('action.addStudent')}
    </Button>
  ];

  return (
    <AdminPageLayout
      title={t('admin.studentsManagement.title')}
      subtitle={t('admin.studentsManagement.subtitle')}
      actions={actions}
      loading={loading}
    >
      <div className="space-y-6">
        
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t('admin.studentsManagement.stats.totalStudents')}
              </CardTitle>
              <GraduationCap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">
                {t('admin.studentsManagement.stats.totalStudentsDescription')}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t('admin.studentsManagement.stats.activeStudents')}
              </CardTitle>
              <UserCheck className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.active}</div>
              <p className="text-xs text-muted-foreground">
                {t('admin.studentsManagement.stats.activeStudentsDescription')}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t('admin.studentsManagement.stats.inactiveStudents')}
              </CardTitle>
              <UserX className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.inactive}</div>
              <p className="text-xs text-muted-foreground">
                {t('admin.studentsManagement.stats.inactiveStudentsDescription')}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder={t('admin.studentsManagement.searchPlaceholder')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder={t('common.status')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('common.allStatus')}</SelectItem>
                  <SelectItem value="active">{t('status.active')}</SelectItem>
                  <SelectItem value="inactive">{t('status.inactive')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Students List */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">{t('admin.studentsManagement.studentsList')}</h3>
              <div className="text-sm text-muted-foreground">
                {t('common.showingResults', {
                  start: 1,
                  end: filteredStudents.length,
                  total: filteredStudents.length
                })}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {filteredStudents.length === 0 ? (
              <div className="text-center py-8">
                <GraduationCap className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-muted-foreground mb-2">
                  {t('admin.studentsManagement.noStudentsFound')}
                </h3>
                <p className="text-muted-foreground">
                  {searchQuery || statusFilter !== 'all'
                    ? t('admin.studentsManagement.noStudentsMatchingFilters')
                    : t('admin.studentsManagement.noStudentsYet')
                  }
                </p>
                {(!searchQuery && statusFilter === 'all' && students.length === 0) && (
                  <Button onClick={handleAddStudent} className="mt-4">
                    <Plus className="h-4 w-4 mr-2" />
                    {t('action.addFirstStudent')}
                  </Button>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t('common.name')}</TableHead>
                      <TableHead>{t('student.studentId')}</TableHead>
                      <TableHead>{t('common.email')}</TableHead>
                      <TableHead>{t('common.phone')}</TableHead>
                      <TableHead>{t('student.class')}</TableHead>
                      <TableHead>{t('common.status')}</TableHead>
                      <TableHead>{t('common.enrollmentDate')}</TableHead>
                      <TableHead>{t('common.lastLogin')}</TableHead>
                      <TableHead className="text-right">{t('common.actions')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStudents.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <div className="flex-shrink-0 h-8 w-8">
                              {student.profile_picture_url ? (
                                <img 
                                  className="h-8 w-8 rounded-full object-cover" 
                                  src={student.profile_picture_url} 
                                  alt={`${student.first_name} ${student.last_name}`} 
                                />
                              ) : (
                                <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                                  <GraduationCap className="h-4 w-4 text-gray-400" />
                                </div>
                              )}
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {student.first_name} {student.last_name}
                              </div>
                              {(student.ar_first_name || student.ar_last_name) && (
                                <div className="text-sm text-gray-500" dir="rtl">
                                  {student.ar_first_name} {student.ar_last_name}
                                </div>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm font-medium">
                            {student.student_id || '-'}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                            {student.email}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                            {student.phone || '-'}
                          </div>
                        </TableCell>
                        <TableCell>
                          {student.class_name || student.grade || '-'}
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(student.is_active)}
                        </TableCell>
                        <TableCell>
                          {formatDate(student.enrollment_date || student.created_at)}
                        </TableCell>
                        <TableCell>
                          {formatDate(student.last_login)}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleViewStudent(student.id)}>
                                <Eye className="h-4 w-4 mr-2" />
                                {t('action.view')}
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleEditStudent(student.id)}>
                                <Edit className="h-4 w-4 mr-2" />
                                {t('action.edit')}
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                onClick={() => handleDeleteStudent(student.id)}
                                className="text-red-600"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                {t('action.delete')}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}

            {/* Pagination removed - showing all results with client-side filtering */}
          </CardContent>
        </Card>
      </div>
    </AdminPageLayout>
  );
};

export default StudentsManagementPage;