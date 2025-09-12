import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Plus, 
  Eye, 
  Edit, 
  Trash2,
  Copy,
  Download,
  Filter,
  Search,
  Clock,
  Users,
  BookOpen,
  MapPin,
  CheckCircle,
  XCircle,
  AlertTriangle
} from 'lucide-react';
import AdminPageLayout from '../../components/admin/layout/AdminPageLayout';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '../../components/ui/select';
import attendanceService from '../../services/attendance';
import { apiMethods } from '../../services/api';
import { toast } from 'sonner';

const TimetablesPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [timetables, setTimetables] = useState([]);
  const [filteredTimetables, setFilteredTimetables] = useState([]);
  const [classes, setClasses] = useState([]);
  const [academicYears, setAcademicYears] = useState([]);
  
  // Filters
  const [filters, setFilters] = useState({
    search: '',
    class: 'all',
    academicYear: 'all',
    status: 'all' // all, active, inactive
  });

  // attendanceService is already imported as a singleton

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [timetables, filters]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [timetablesResponse, classesResponse, academicYearsResponse] = await Promise.all([
        attendanceService.getTimetables(),
        apiMethods.get('schools/classes/'),
        apiMethods.get('schools/academic-years/')
      ]);

      let timetablesData = timetablesResponse.results || (Array.isArray(timetablesResponse) ? timetablesResponse : timetablesResponse.data?.results || timetablesResponse.data || []);
      let classesData = classesResponse.results || (Array.isArray(classesResponse) ? classesResponse : classesResponse.data?.results || classesResponse.data || []);
      let academicYearsData = academicYearsResponse.results || (Array.isArray(academicYearsResponse) ? academicYearsResponse : academicYearsResponse.data?.results || academicYearsResponse.data || []);

      setTimetables(timetablesData);
      setClasses(classesData);
      setAcademicYears(academicYearsData);
      
    } catch (error) {
      console.error('Failed to fetch data:', error);
      toast.error(t('error.failedToLoadData'));
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...timetables];

    // Search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(timetable => 
        timetable.school_class_name?.toLowerCase().includes(searchTerm) ||
        timetable.academic_year_name?.toLowerCase().includes(searchTerm) ||
        timetable.created_by_name?.toLowerCase().includes(searchTerm)
      );
    }

    // Class filter
    if (filters.class && filters.class !== 'all') {
      filtered = filtered.filter(timetable => timetable.school_class?.toString() === filters.class);
    }

    // Academic year filter
    if (filters.academicYear && filters.academicYear !== 'all') {
      filtered = filtered.filter(timetable => timetable.academic_year?.toString() === filters.academicYear);
    }

    // Status filter
    if (filters.status !== 'all') {
      const isActive = filters.status === 'active';
      filtered = filtered.filter(timetable => timetable.is_active === isActive);
    }

    setFilteredTimetables(filtered);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleDelete = async (timetableId) => {
    if (!confirm(t('timetables.confirmDelete'))) return;

    try {
      await attendanceService.deleteTimetable(timetableId);
      toast.success(t('timetables.deleteSuccess'));
      fetchData();
    } catch (error) {
      console.error('Failed to delete timetable:', error);
      toast.error(t('timetables.deleteError'));
    }
  };

  const handleDuplicate = async (timetable) => {
    try {
      const duplicateData = {
        school_class: timetable.school_class,
        academic_year: timetable.academic_year,
        is_active: false // New duplicates are inactive by default
      };
      
      const newTimetable = await attendanceService.createTimetable(duplicateData);
      toast.success(t('timetables.duplicateSuccess'));
      navigate(`/admin/timetables/edit/${newTimetable.id}`);
    } catch (error) {
      console.error('Failed to duplicate timetable:', error);
      toast.error(t('timetables.duplicateError'));
    }
  };

  const toggleStatus = async (timetable) => {
    try {
      await attendanceService.updateTimetable(timetable.id, {
        ...timetable,
        is_active: !timetable.is_active
      });
      toast.success(t('timetables.statusUpdateSuccess'));
      fetchData();
    } catch (error) {
      console.error('Failed to update status:', error);
      toast.error(t('timetables.statusUpdateError'));
    }
  };

  const getStatusConfig = (isActive) => {
    return isActive 
      ? { 
          icon: CheckCircle, 
          color: 'bg-green-100 text-green-800 border-green-200', 
          label: t('common.active') 
        }
      : { 
          icon: XCircle, 
          color: 'bg-gray-100 text-gray-800 border-gray-200', 
          label: t('common.inactive') 
        };
  };

  const ActionButtons = () => (
    <div className="flex gap-2">
      <Button
        onClick={() => navigate('/admin/timetables/add')}
        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
      >
        <Plus className="h-4 w-4 mr-2" />
        {t('timetables.addTimetable')}
      </Button>
    </div>
  );

  if (loading) {
    return (
      <AdminPageLayout
        title={t('timetables.timetables')}
        subtitle={t('timetables.manageAllTimetables')}
        actions={[<ActionButtons key="actions" />]}
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

  return (
    <AdminPageLayout
      title={t('timetables.timetables')}
      subtitle={t('timetables.manageAllTimetables')}
      actions={[<ActionButtons key="actions" />]}
    >
      <div className="space-y-6">
        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Filter className="h-5 w-5 text-blue-500" />
              {t('common.filters')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder={t('timetables.searchPlaceholder')}
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="pl-9"
                />
              </div>

              {/* Class Filter */}
              <Select 
                value={filters.class} 
                onValueChange={(value) => handleFilterChange('class', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('common.allClasses')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('common.allClasses')}</SelectItem>
                  {classes.map((cls) => (
                    <SelectItem key={cls.id} value={cls.id.toString()}>
                      {cls.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Academic Year Filter */}
              <Select 
                value={filters.academicYear} 
                onValueChange={(value) => handleFilterChange('academicYear', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('common.allAcademicYears')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('common.allAcademicYears')}</SelectItem>
                  {academicYears.map((year) => (
                    <SelectItem key={year.id} value={year.id.toString()}>
                      {year.year} {year.is_current ? `(${t('common.current')})` : ''}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Status Filter */}
              <Select 
                value={filters.status} 
                onValueChange={(value) => handleFilterChange('status', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('common.allStatuses')}</SelectItem>
                  <SelectItem value="active">{t('common.active')}</SelectItem>
                  <SelectItem value="inactive">{t('common.inactive')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{t('timetables.totalTimetables')}</p>
                  <p className="text-2xl font-bold text-blue-600">{timetables.length}</p>
                </div>
                <Calendar className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{t('timetables.activeTimetables')}</p>
                  <p className="text-2xl font-bold text-green-600">{timetables.filter(t => t.is_active).length}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{t('timetables.inactiveTimetables')}</p>
                  <p className="text-2xl font-bold text-gray-600">{timetables.filter(t => !t.is_active).length}</p>
                </div>
                <XCircle className="h-8 w-8 text-gray-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{t('timetables.totalSessions')}</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {timetables.reduce((sum, t) => sum + (t.sessions?.length || 0), 0)}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Timetables List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-500" />
              {t('timetables.timetablesList')} ({filteredTimetables.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredTimetables.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {t('timetables.noTimetables')}
                </h3>
                <p className="text-sm text-gray-500 mb-6">
                  {t('timetables.noTimetablesDescription')}
                </p>
                <Button 
                  onClick={() => navigate('/admin/timetables/add')}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {t('timetables.createFirst')}
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredTimetables.map((timetable) => {
                  const statusConfig = getStatusConfig(timetable.is_active);
                  const StatusIcon = statusConfig.icon;
                  const sessionsCount = timetable.sessions?.length || 0;
                  const totalWeeklyHours = timetable.sessions?.reduce((sum, session) => {
                    const start = new Date(`1970-01-01T${session.start_time}`);
                    const end = new Date(`1970-01-01T${session.end_time}`);
                    return sum + (end - start) / (1000 * 60 * 60);
                  }, 0) || 0;

                  return (
                    <motion.div
                      key={timetable.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="p-6 border border-border rounded-lg hover:shadow-md transition-all"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-lg">
                              {timetable.school_class_name}
                            </h3>
                            <Badge className={statusConfig.color}>
                              <StatusIcon className="h-3 w-3 mr-1" />
                              {statusConfig.label}
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              <span>{timetable.academic_year_name}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              <span>{sessionsCount} {t('timetables.sessions')}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <BookOpen className="h-4 w-4" />
                              <span>{totalWeeklyHours}h {t('timetables.perWeek')}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="h-4 w-4" />
                              <span>{t('common.createdBy')}: {timetable.created_by_name}</span>
                            </div>
                          </div>

                          <div className="text-xs text-muted-foreground">
                            {t('common.created')}: {new Date(timetable.created_at).toLocaleDateString()}
                            {timetable.updated_at !== timetable.created_at && (
                              <span className="ml-4">
                                {t('common.updated')}: {new Date(timetable.updated_at).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 ml-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`/admin/timetables/view/${timetable.id}`)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate(`/admin/timetables/edit/${timetable.id}`)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDuplicate(timetable)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toggleStatus(timetable)}
                            className={timetable.is_active ? 'text-red-600 hover:text-red-700' : 'text-green-600 hover:text-green-700'}
                          >
                            {timetable.is_active ? <XCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(timetable.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminPageLayout>
  );
};

export default TimetablesPage;