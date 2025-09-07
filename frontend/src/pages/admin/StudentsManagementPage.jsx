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
  GraduationCap,
  CheckCircle,
  XCircle,
  UserPlus
} from 'lucide-react';
import AdminPageLayout from '../../components/admin/layout/AdminPageLayout';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '../../components/ui/dropdown-menu';
import { apiMethods } from '../../services/api';
import { toast } from 'sonner';

const StatCard = ({ icon, label, value, colorClass, description }) => (
  <Card className="bg-card border-border shadow-sm hover:shadow-lg transition-shadow duration-300 rounded-xl">
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
      {icon}
    </CardHeader>
    <CardContent>
      <div className={`text-3xl font-bold ${colorClass}`}>{value}</div>
      <p className="text-xs text-muted-foreground mt-1">{description}</p>
    </CardContent>
  </Card>
);

const StudentsManagementPage = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
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

  // Client-side filtering
  const filteredStudents = students.filter(student => {
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
        student.class_name?.toLowerCase().includes(query) ||
        student.ar_first_name?.toLowerCase().includes(query) ||
        student.ar_last_name?.toLowerCase().includes(query);
    }

    let matchesStatus = true;
    if (statusFilter !== 'all') {
      matchesStatus = statusFilter === 'active' ? student.is_active : !student.is_active;
    }

    return matchesSearch && matchesStatus;
  });

  // Helper function to get display name based on language
  const getDisplayName = (student) => {
    const isArabic = i18n.language === 'ar';
    if (isArabic && (student.ar_first_name || student.ar_last_name)) {
      return `${student.ar_first_name || ''} ${student.ar_last_name || ''}`.trim();
    }
    return student.full_name || `${student.first_name || ''} ${student.last_name || ''}`.trim();
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
    if (!dateString) return '—';
    return new Date(dateString).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  };

  // StudentCard component for card-based layout
  const StudentCard = ({ student }) => (
    <Card className="bg-card border-border shadow-md rounded-lg p-3 transition-transform transform hover:-translate-y-1 hover:shadow-xl flex flex-col justify-between">
      <div className="flex items-start">
        <div className="flex-shrink-0 mr-3">
          <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center overflow-hidden">
            {student.profile_picture_url ? (
              <img src={student.profile_picture_url} alt={student.full_name} className="h-full w-full object-cover" />
            ) : (
              <span className="text-xl font-bold text-primary">
                {(student.first_name?.[0] || '') + (student.last_name?.[0] || '')}
              </span>
            )}
          </div>
        </div>
        <div className="flex-1">
          <h3 className="text-base font-bold text-card-foreground leading-tight">{getDisplayName(student)}</h3>
          <p className="text-xs text-muted-foreground">{student.student_id || 'Student'}</p>
          <p className="text-xs text-muted-foreground">{student.class_name || student.grade || '—'}</p>
          <Badge
            className={`mt-1.5 text-xs ${student.is_active 
              ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300 border border-green-200 dark:border-green-700/60' 
              : 'bg-gray-100 text-gray-800 dark:bg-gray-700/40 dark:text-gray-300 border border-gray-200 dark:border-gray-600/60'
            }`}
          >
            {student.is_active ? t('status.active') : t('status.inactive')}
          </Badge>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild><Button variant="ghost" className="h-7 w-7 p-0"><MoreVertical className="h-4 w-4" /></Button></DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleViewStudent(student.id)}><Eye className="mr-2 h-4 w-4" /><span>{t('action.view')}</span></DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleEditStudent(student.id)}><Edit className="mr-2 h-4 w-4" /><span>{t('action.edit')}</span></DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleDeleteStudent(student.id)} className="text-red-600 focus:text-red-500 focus:bg-red-500/10"><Trash2 className="mr-2 h-4 w-4" /><span>{t('action.delete')}</span></DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="mt-3 pt-3 border-t border-border space-y-1.5 text-xs">
        <div className="flex items-center text-muted-foreground"><Mail className="h-3.5 w-3.5 mr-1.5 flex-shrink-0" /><span className="truncate">{student.email}</span></div>
        <div className="flex items-center text-muted-foreground"><Phone className="h-3.5 w-3.5 mr-1.5 flex-shrink-0" /><span>{student.phone || '—'}</span></div>
        <div className="flex items-center text-muted-foreground justify-between mt-1 pt-1 border-t border-border/50">
          <span className="font-semibold text-foreground/80">Enrolled:</span><span>{formatDate(student.enrollment_date || student.created_at)}</span>
        </div>
      </div>
    </Card>
  );

  const actions = [
    <Button key="add" onClick={handleAddStudent} className="gap-2">
      <Plus className="h-4 w-4" />
      {t('action.addStudent')}
    </Button>
  ];

  return (
    <div className="bg-background text-foreground min-h-screen">
      <AdminPageLayout
        title={t('admin.studentsManagement.title')}
        subtitle={t('admin.studentsManagement.subtitle')}
        actions={[
          <Button key="add-student" onClick={handleAddStudent} className="bg-primary text-primary-foreground gap-2 shadow-md hover:bg-primary/90">
            <Plus className="h-4 w-4" />{t('action.addStudent')}
          </Button>
        ]}
        loading={loading}
      >
      <div className="space-y-6">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <StatCard icon={<GraduationCap className="h-5 w-5 text-muted-foreground" />} label={t('admin.studentsManagement.stats.totalStudents')} value={stats.total} colorClass="text-primary" description={t('admin.studentsManagement.stats.totalStudentsDescription')} />
          <StatCard icon={<CheckCircle className="h-5 w-5 text-green-500" />} label={t('admin.studentsManagement.stats.activeStudents')} value={stats.active} colorClass="text-green-500" description={t('admin.studentsManagement.stats.activeStudentsDescription')} />
          <StatCard icon={<XCircle className="h-5 w-5 text-red-500" />} label={t('admin.studentsManagement.stats.inactiveStudents')} value={stats.inactive} colorClass="text-red-500" description={t('admin.studentsManagement.stats.inactiveStudentsDescription')} />
        </div>

        <Card className="mb-8 p-4 bg-card border-border shadow-sm rounded-xl">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="relative flex-grow w-full md:w-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input placeholder={t('admin.studentsManagement.searchPlaceholder')} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10 h-12 rounded-lg bg-background md:bg-input" />
            </div>
            <div className="flex items-center gap-4 w-full md:w-auto">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-[180px] h-12 rounded-lg bg-background md:bg-input"><Filter className="h-4 w-4 mr-2 text-muted-foreground" /><SelectValue placeholder={t('common.status')} /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('common.allStatus')}</SelectItem>
                  <SelectItem value="active">{t('status.active')}</SelectItem>
                  <SelectItem value="inactive">{t('status.inactive')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        {filteredStudents.length > 0 ? (
          // Adjusted grid to fit more cards
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-5">
            {filteredStudents.map((student) => <StudentCard key={student.id} student={student} />)}
          </div>
        ) : (
          <div className="text-center py-20 flex flex-col items-center bg-card rounded-xl border border-dashed border-border">
            <GraduationCap className="h-20 w-20 text-muted-foreground/50 mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">{t('admin.studentsManagement.noStudentsFound')}</h3>
            <p className="text-muted-foreground max-w-sm">
              {searchQuery || statusFilter !== 'all' ? t('admin.studentsManagement.noStudentsMatchingFilters') : t('admin.studentsManagement.noStudentsYet')}
            </p>
            {(!searchQuery && statusFilter === 'all' && students.length === 0) && (
              <Button onClick={handleAddStudent} className="mt-6 gap-2 bg-primary text-primary-foreground"><UserPlus className="h-4 w-4" />{t('action.addFirstStudent')}</Button>
            )}
          </div>
        )}
      </div>
      </AdminPageLayout>
    </div>
  );
};

export default StudentsManagementPage;