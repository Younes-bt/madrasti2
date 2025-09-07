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

const TeachersManagementPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [teachers, setTeachers] = useState([]);
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

  const fetchTeachers = async () => {
    setLoading(true);
    try {
      // Fetch all teachers without pagination or filtering
      const params = {
        role: 'TEACHER'
        // Remove pagination to get all teachers at once
      };

      const response = await apiMethods.get('users/users/', { params });

      let teachersData = [];
      
      // Handle different response structures
      if (response.results && Array.isArray(response.results)) {
        // DRF paginated response - get all pages if paginated
        teachersData = response.results;
        // If there are more pages, we might want to fetch all, but for now assume small dataset
      } else if (Array.isArray(response)) {
        // Direct array response
        teachersData = response;
      } else if (response.data) {
        // Handle case where response is wrapped
        if (response.data.results && Array.isArray(response.data.results)) {
          teachersData = response.data.results;
        } else if (Array.isArray(response.data)) {
          teachersData = response.data;
        }
      }

      setTeachers(teachersData);

      // Update statistics based on all teachers data
      const activeCount = teachersData.filter(teacher => teacher.is_active).length;
      setStats({
        total: teachersData.length,
        active: activeCount,
        inactive: teachersData.length - activeCount
      });

      // Update pagination for display purposes
      setPagination({
        count: teachersData.length,
        currentPage: 1,
        totalPages: 1,
        pageSize: teachersData.length
      });

    } catch (error) {
      console.error('Failed to fetch teachers:', error);
      console.error('Error response:', error.response);
      toast.error(t('error.failedToLoadData'));
      setTeachers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  // Client-side filtering - no API calls needed
  const filteredTeachers = teachers.filter(teacher => {
    // Apply search filter
    let matchesSearch = true;
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      matchesSearch = 
        teacher.first_name?.toLowerCase().includes(query) ||
        teacher.last_name?.toLowerCase().includes(query) ||
        teacher.full_name?.toLowerCase().includes(query) ||
        teacher.email?.toLowerCase().includes(query) ||
        teacher.phone?.toLowerCase().includes(query) ||
        teacher.position?.toLowerCase().includes(query);
    }

    // Apply status filter
    let matchesStatus = true;
    if (statusFilter !== 'all') {
      matchesStatus = statusFilter === 'active' ? teacher.is_active : !teacher.is_active;
    }

    return matchesSearch && matchesStatus;
  });

  const handleSearch = () => {
    // No longer needed since filtering is automatic
  };

  const handleViewTeacher = (teacherId) => {
    navigate(`/admin/school-management/teachers/view/${teacherId}`);
  };

  const handleEditTeacher = (teacherId) => {
    navigate(`/admin/school-management/teachers/edit/${teacherId}`);
  };

  const handleDeleteTeacher = (teacherId) => {
    toast.info(`${t('action.delete')} teacher: ${teacherId}`);
  };

  const handleAddTeacher = () => {
    navigate('/admin/school-management/teachers/add');
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
    <Button key="add" onClick={handleAddTeacher} className="gap-2">
      <Plus className="h-4 w-4" />
      {t('action.addTeacher')}
    </Button>
  ];

  return (
    <AdminPageLayout
      title={t('admin.teachersManagement.title')}
      subtitle={t('admin.teachersManagement.subtitle')}
      actions={actions}
      loading={loading}
    >
      <div className="space-y-6">
        
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t('admin.teachersManagement.stats.totalTeachers')}
              </CardTitle>
              <GraduationCap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">
                {t('admin.teachersManagement.stats.totalTeachersDescription')}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t('admin.teachersManagement.stats.activeTeachers')}
              </CardTitle>
              <UserCheck className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.active}</div>
              <p className="text-xs text-muted-foreground">
                {t('admin.teachersManagement.stats.activeTeachersDescription')}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t('admin.teachersManagement.stats.inactiveTeachers')}
              </CardTitle>
              <UserX className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.inactive}</div>
              <p className="text-xs text-muted-foreground">
                {t('admin.teachersManagement.stats.inactiveTeachersDescription')}
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
                    placeholder={t('admin.teachersManagement.searchPlaceholder')}
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

        {/* Teachers List */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">{t('admin.teachersManagement.teachersList')}</h3>
              <div className="text-sm text-muted-foreground">
                {t('common.showingResults', {
                  start: 1,
                  end: filteredTeachers.length,
                  total: filteredTeachers.length
                })}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {filteredTeachers.length === 0 ? (
              <div className="text-center py-8">
                <GraduationCap className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-muted-foreground mb-2">
                  {t('admin.teachersManagement.noTeachersFound')}
                </h3>
                <p className="text-muted-foreground">
                  {searchQuery || statusFilter !== 'all'
                    ? t('admin.teachersManagement.noTeachersMatchingFilters')
                    : t('admin.teachersManagement.noTeachersYet')
                  }
                </p>
                {(!searchQuery && statusFilter === 'all' && teachers.length === 0) && (
                  <Button onClick={handleAddTeacher} className="mt-4">
                    <Plus className="h-4 w-4 mr-2" />
                    {t('action.addFirstTeacher')}
                  </Button>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t('common.name')}</TableHead>
                      <TableHead>{t('common.email')}</TableHead>
                      <TableHead>{t('common.phone')}</TableHead>
                      <TableHead>{t('teacher.position')}</TableHead>
                      <TableHead>{t('common.status')}</TableHead>
                      <TableHead>{t('common.joinedDate')}</TableHead>
                      <TableHead>{t('common.lastLogin')}</TableHead>
                      <TableHead className="text-right">{t('common.actions')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTeachers.map((teacher) => (
                      <TableRow key={teacher.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <div className="flex-shrink-0 h-8 w-8">
                              {teacher.profile_picture_url ? (
                                <img 
                                  className="h-8 w-8 rounded-full object-cover" 
                                  src={teacher.profile_picture_url} 
                                  alt={`${teacher.first_name} ${teacher.last_name}`} 
                                />
                              ) : (
                                <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                                  <GraduationCap className="h-4 w-4 text-gray-400" />
                                </div>
                              )}
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {teacher.first_name} {teacher.last_name}
                              </div>
                              {(teacher.ar_first_name || teacher.ar_last_name) && (
                                <div className="text-sm text-gray-500" dir="rtl">
                                  {teacher.ar_first_name} {teacher.ar_last_name}
                                </div>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                            {teacher.email}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                            {teacher.phone || '-'}
                          </div>
                        </TableCell>
                        <TableCell>
                          {teacher.position || '-'}
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(teacher.is_active)}
                        </TableCell>
                        <TableCell>
                          {formatDate(teacher.created_at)}
                        </TableCell>
                        <TableCell>
                          {formatDate(teacher.last_login)}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleViewTeacher(teacher.id)}>
                                <Eye className="h-4 w-4 mr-2" />
                                {t('action.view')}
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleEditTeacher(teacher.id)}>
                                <Edit className="h-4 w-4 mr-2" />
                                {t('action.edit')}
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                onClick={() => handleDeleteTeacher(teacher.id)}
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

export default TeachersManagementPage;