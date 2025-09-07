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

const TeachersManagementPage = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [teachers, setTeachers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
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
        teacher.position?.toLowerCase().includes(query) ||
        teacher.ar_first_name?.toLowerCase().includes(query) ||
        teacher.ar_last_name?.toLowerCase().includes(query);
    }

    // Apply status filter
    let matchesStatus = true;
    if (statusFilter !== 'all') {
      matchesStatus = statusFilter === 'active' ? teacher.is_active : !teacher.is_active;
    }

    return matchesSearch && matchesStatus;
  });

  // Helper function to get display name based on language
  const getDisplayName = (teacher) => {
    const isArabic = i18n.language === 'ar';
    if (isArabic && (teacher.ar_first_name || teacher.ar_last_name)) {
      return `${teacher.ar_first_name || ''} ${teacher.ar_last_name || ''}`.trim();
    }
    return teacher.full_name || `${teacher.first_name || ''} ${teacher.last_name || ''}`.trim();
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

  const formatDate = (dateString) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  };

  // TeacherCard component for card-based layout
  const TeacherCard = ({ teacher }) => (
    <Card className="bg-card border-border shadow-md rounded-lg p-3 transition-transform transform hover:-translate-y-1 hover:shadow-xl flex flex-col justify-between">
      <div className="flex items-start">
        <div className="flex-shrink-0 mr-3">
          <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center overflow-hidden">
            {teacher.profile_picture_url ? (
              <img src={teacher.profile_picture_url} alt={teacher.full_name} className="h-full w-full object-cover" />
            ) : (
              <span className="text-xl font-bold text-primary">
                {(teacher.first_name?.[0] || '') + (teacher.last_name?.[0] || '')}
              </span>
            )}
          </div>
        </div>
        <div className="flex-1">
          <h3 className="text-base font-bold text-card-foreground leading-tight">{getDisplayName(teacher)}</h3>
          <p className="text-xs text-muted-foreground">{teacher.position || 'Teacher'}</p>
          <Badge
            className={`mt-1.5 text-xs ${teacher.is_active 
              ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300 border border-green-200 dark:border-green-700/60' 
              : 'bg-gray-100 text-gray-800 dark:bg-gray-700/40 dark:text-gray-300 border border-gray-200 dark:border-gray-600/60'
            }`}
          >
            {teacher.is_active ? t('status.active') : t('status.inactive')}
          </Badge>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild><Button variant="ghost" className="h-7 w-7 p-0"><MoreVertical className="h-4 w-4" /></Button></DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleViewTeacher(teacher.id)}><Eye className="mr-2 h-4 w-4" /><span>{t('action.view')}</span></DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleEditTeacher(teacher.id)}><Edit className="mr-2 h-4 w-4" /><span>{t('action.edit')}</span></DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => handleDeleteTeacher(teacher.id)} className="text-red-600 focus:text-red-500 focus:bg-red-500/10"><Trash2 className="mr-2 h-4 w-4" /><span>{t('action.delete')}</span></DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="mt-3 pt-3 border-t border-border space-y-1.5 text-xs">
        <div className="flex items-center text-muted-foreground"><Mail className="h-3.5 w-3.5 mr-1.5 flex-shrink-0" /><span className="truncate">{teacher.email}</span></div>
        <div className="flex items-center text-muted-foreground"><Phone className="h-3.5 w-3.5 mr-1.5 flex-shrink-0" /><span>{teacher.phone || '—'}</span></div>
        <div className="flex items-center text-muted-foreground justify-between mt-1 pt-1 border-t border-border/50">
          <span className="font-semibold text-foreground/80">Joined:</span><span>{formatDate(teacher.created_at)}</span>
        </div>
      </div>
    </Card>
  );

  const actions = [
    <Button key="add" onClick={handleAddTeacher} className="gap-2">
      <Plus className="h-4 w-4" />
      {t('action.addTeacher')}
    </Button>
  ];

  return (
    <div className="bg-background text-foreground min-h-screen">
      <AdminPageLayout
        title={t('admin.teachersManagement.title')}
        subtitle={t('admin.teachersManagement.subtitle')}
        actions={[
          <Button key="add-teacher" onClick={handleAddTeacher} className="bg-primary text-primary-foreground gap-2 shadow-md hover:bg-primary/90">
            <Plus className="h-4 w-4" />{t('action.addTeacher')}
          </Button>
        ]}
        loading={loading}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <StatCard icon={<GraduationCap className="h-5 w-5 text-muted-foreground" />} label={t('admin.teachersManagement.stats.totalTeachers')} value={stats.total} colorClass="text-primary" description={t('admin.teachersManagement.stats.totalTeachersDescription')} />
          <StatCard icon={<CheckCircle className="h-5 w-5 text-green-500" />} label={t('admin.teachersManagement.stats.activeTeachers')} value={stats.active} colorClass="text-green-500" description={t('admin.teachersManagement.stats.activeTeachersDescription')} />
          <StatCard icon={<XCircle className="h-5 w-5 text-red-500" />} label={t('admin.teachersManagement.stats.inactiveTeachers')} value={stats.inactive} colorClass="text-red-500" description={t('admin.teachersManagement.stats.inactiveTeachersDescription')} />
        </div>

        <Card className="mb-8 p-4 bg-card border-border shadow-sm rounded-xl">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="relative flex-grow w-full md:w-auto">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input placeholder={t('admin.teachersManagement.searchPlaceholder')} value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10 h-12 rounded-lg bg-background md:bg-input" />
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

        {filteredTeachers.length > 0 ? (
          // Adjusted grid to fit more cards
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-5">
            {filteredTeachers.map((teacher) => <TeacherCard key={teacher.id} teacher={teacher} />)}
          </div>
        ) : (
          <div className="text-center py-20 flex flex-col items-center bg-card rounded-xl border border-dashed border-border">
            <GraduationCap className="h-20 w-20 text-muted-foreground/50 mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">{t('admin.teachersManagement.noTeachersFound')}</h3>
            <p className="text-muted-foreground max-w-sm">
              {searchQuery || statusFilter !== 'all' ? t('admin.teachersManagement.noTeachersMatchingFilters') : t('admin.teachersManagement.noTeachersYet')}
            </p>
            {(!searchQuery && statusFilter === 'all' && teachers.length === 0) && (
              <Button onClick={handleAddTeacher} className="mt-6 gap-2 bg-primary text-primary-foreground"><UserPlus className="h-4 w-4" />{t('action.addFirstTeacher')}</Button>
            )}
          </div>
        )}
      </AdminPageLayout>
    </div>
  );
};

export default TeachersManagementPage;