import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Calendar, Plus, Eye, Edit, Trash2, Copy, Filter, Search, Clock, Users, BookOpen, CheckCircle, XCircle, MoreVertical
} from 'lucide-react';
import AdminPageLayout from '../../components/admin/layout/AdminPageLayout';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from '../../components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu"
import attendanceService from '../../services/attendance';
import { apiMethods } from '../../services/api';
import { toast } from 'sonner';
import { Skeleton } from '../../components/ui/skeleton';

const TimetablesPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [timetables, setTimetables] = useState([]);
  const [classes, setClasses] = useState([]);
  const [academicYears, setAcademicYears] = useState([]);
  
  const [filters, setFilters] = useState({
    search: '',
    class: 'all',
    academicYear: 'all',
    status: 'all'
  });

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [timetablesResponse, classesResponse, academicYearsResponse] = await Promise.all([
        attendanceService.getTimetables(),
        apiMethods.get('schools/classes/'),
        apiMethods.get('schools/academic-years/')
      ]);

      const safeData = (res) => res.results || (Array.isArray(res) ? res : res.data?.results || res.data || []);
      setTimetables(safeData(timetablesResponse));
      setClasses(safeData(classesResponse));
      setAcademicYears(safeData(academicYearsResponse));
      
    } catch (error) {
      console.error('Failed to fetch data:', error);
      toast.error(t('error.failedToLoadData'));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredTimetables = useMemo(() => {
    return timetables.filter(timetable => {
      const searchTerm = filters.search.toLowerCase();
      const matchesSearch = !filters.search || 
        timetable.school_class_name?.toLowerCase().includes(searchTerm) ||
        timetable.academic_year_name?.toLowerCase().includes(searchTerm) ||
        timetable.created_by_name?.toLowerCase().includes(searchTerm);
      
      const matchesClass = filters.class === 'all' || timetable.school_class?.toString() === filters.class;
      const matchesYear = filters.academicYear === 'all' || timetable.academic_year?.toString() === filters.academicYear;
      const matchesStatus = filters.status === 'all' || timetable.is_active === (filters.status === 'active');

      return matchesSearch && matchesClass && matchesYear && matchesStatus;
    });
  }, [timetables, filters]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleDelete = async (timetableId) => {
    if (!confirm(t('timetables.confirmDelete'))) return;
    try {
      await attendanceService.deleteTimetable(timetableId);
      toast.success(t('timetables.deleteSuccess'));
      fetchData();
    } catch {
      toast.error(t('timetables.deleteError'));
    }
  };

  const handleDuplicate = async (timetable) => {
    try {
      const duplicateData = {
        school_class: timetable.school_class,
        academic_year: timetable.academic_year,
        is_active: false
      };
      const newTimetable = await attendanceService.createTimetable(duplicateData);
      toast.success(t('timetables.duplicateSuccess'));
      navigate(`/admin/timetables/edit/${newTimetable.id}`);
    } catch {
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
    } catch {
      toast.error(t('timetables.statusUpdateError'));
    }
  };

  const ActionButtons = () => (
    <Button
      onClick={() => navigate('/admin/timetables/add')}
      className="bg-primary text-primary-foreground hover:bg-primary/90"
    >
      <Plus className="h-4 w-4 mr-2" />
      {t('timetables.addTimetable')}
    </Button>
  );

  return (
    <AdminPageLayout
      title={t('timetables.timetables')}
      subtitle={t('timetables.manageAllTimetables')}
      actions={[<ActionButtons key="actions" />]}
    >
      <div className="space-y-6">
        <FilterControls 
          filters={filters} 
          handleFilterChange={handleFilterChange} 
          classes={classes} 
          academicYears={academicYears} 
        />
        <StatisticsCards timetables={timetables} />
        
        {loading ? (
          <TimetableListSkeleton />
        ) : (
          <TimetablesList 
            timetables={filteredTimetables}
            onDelete={handleDelete}
            onDuplicate={handleDuplicate}
            onToggleStatus={toggleStatus}
          />
        )}
      </div>
    </AdminPageLayout>
  );
};

const FilterControls = ({ filters, handleFilterChange, classes, academicYears }) => {
  const { t } = useTranslation();
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg font-semibold">
          <Filter className="h-5 w-5 text-primary" />
          {t('common.filters')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder={t('timetables.searchPlaceholder')}
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filters.class} onValueChange={(value) => handleFilterChange('class', value)}>
            <SelectTrigger><SelectValue placeholder={t('common.allClasses')} /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('common.allClasses')}</SelectItem>
              {classes.map((cls) => <SelectItem key={cls.id} value={cls.id.toString()}>{cls.name}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={filters.academicYear} onValueChange={(value) => handleFilterChange('academicYear', value)}>
            <SelectTrigger><SelectValue placeholder={t('common.allAcademicYears')} /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('common.allAcademicYears')}</SelectItem>
              {academicYears.map((year) => <SelectItem key={year.id} value={year.id.toString()}>{year.year} {year.is_current ? `(${t('common.current')})` : ''}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={filters.status} onValueChange={(value) => handleFilterChange('status', value)}>
            <SelectTrigger><SelectValue placeholder={t('common.allStatuses')} /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('common.allStatuses')}</SelectItem>
              <SelectItem value="active">{t('common.active')}</SelectItem>
              <SelectItem value="inactive">{t('common.inactive')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};

const StatisticsCards = ({ timetables }) => {
  const { t } = useTranslation();
  const stats = useMemo(() => ({
    total: timetables.length,
    active: timetables.filter(t => t.is_active).length,
    inactive: timetables.filter(t => !t.is_active).length,
    sessions: timetables.reduce((sum, t) => sum + (t.sessions?.length || 0), 0)
  }), [timetables]);

  const statItems = [
    { title: t('timetables.totalTimetables'), value: stats.total, icon: Calendar, color: 'text-blue-500' },
    { title: t('timetables.activeTimetables'), value: stats.active, icon: CheckCircle, color: 'text-green-500' },
    { title: t('timetables.inactiveTimetables'), value: stats.inactive, icon: XCircle, color: 'text-gray-500' },
    { title: t('timetables.totalSessions'), value: stats.sessions, icon: Clock, color: 'text-purple-500' }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {statItems.map(item => (
        <Card key={item.title}>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">{item.title}</p>
              <p className={`text-2xl font-bold ${item.color.replace('text-', 'text-')}`}>{item.value}</p>
            </div>
            <item.icon className={`h-8 w-8 ${item.color}`} />
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

const TimetablesList = ({ timetables, onDelete, onDuplicate, onToggleStatus }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  if (timetables.length === 0) {
    return (
      <div className="text-center py-16">
        <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2">{t('timetables.noTimetables')}</h3>
        <p className="text-muted-foreground mb-6">{t('timetables.noTimetablesDescription')}</p>
        <Button onClick={() => navigate('/admin/timetables/add')}>
          <Plus className="h-4 w-4 mr-2" />
          {t('timetables.createFirst')}
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {timetables.map((timetable) => (
        <TimetableCard 
          key={timetable.id} 
          timetable={timetable} 
          onDelete={onDelete}
          onDuplicate={onDuplicate}
          onToggleStatus={onToggleStatus}
        />
      ))}
    </div>
  );
};

const TimetableCard = ({ timetable, onDelete, onDuplicate, onToggleStatus }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const statusConfig = timetable.is_active 
    ? { icon: CheckCircle, color: 'bg-green-100 text-green-800', label: t('common.active') }
    : { icon: XCircle, color: 'bg-gray-100 text-gray-800', label: t('common.inactive') };
  const StatusIcon = statusConfig.icon;

  const sessionsCount = timetable.sessions?.length || 0;
  const totalWeeklyHours = useMemo(() => 
    timetable.sessions?.reduce((sum, session) => {
      const start = new Date(`1970-01-01T${session.start_time}`);
      const end = new Date(`1970-01-01T${session.end_time}`);
      return sum + (end - start) / (1000 * 60 * 60);
    }, 0) || 0, 
  [timetable.sessions]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-card border rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300 flex flex-col"
    >
      <div className="p-6 flex-grow">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="font-bold text-xl text-primary mb-1">{timetable.school_class_name}</h3>
            <p className="text-sm text-muted-foreground">{timetable.academic_year_name}</p>
          </div>
          <Badge className={`${statusConfig.color} flex items-center gap-1`}>
            <StatusIcon className="h-3 w-3" />
            {statusConfig.label}
          </Badge>
        </div>
        
        <div className="space-y-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-2"><Clock className="h-4 w-4" /><span>{sessionsCount} {t('timetables.sessions')}</span></div>
          <div className="flex items-center gap-2"><BookOpen className="h-4 w-4" /><span>{totalWeeklyHours.toFixed(1)}h {t('timetables.perWeek')}</span></div>
          <div className="flex items-center gap-2"><Users className="h-4 w-4" /><span>{t('common.createdBy')}: {timetable.created_by_name}</span></div>
        </div>
      </div>

      <div className="border-t p-4 bg-muted/50 flex items-center justify-between">
        <div className="text-xs text-muted-foreground">
          {t('common.updated')}: {new Date(timetable.updated_at).toLocaleDateString()}
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => navigate(`/admin/timetables/view/${timetable.id}`)}><Eye className="mr-2 h-4 w-4" />{t('common.view')}</DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate(`/admin/timetables/edit/${timetable.id}`)}><Edit className="mr-2 h-4 w-4" />{t('common.edit')}</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDuplicate(timetable)}><Copy className="mr-2 h-4 w-4" />{t('common.duplicate')}</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onToggleStatus(timetable)}>
              {timetable.is_active ? <XCircle className="mr-2 h-4 w-4" /> : <CheckCircle className="mr-2 h-4 w-4" />}
              {timetable.is_active ? t('common.deactivate') : t('common.activate')}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onDelete(timetable.id)} className="text-red-600 focus:text-red-600 focus:bg-red-50">
              <Trash2 className="mr-2 h-4 w-4" />{t('common.delete')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </motion.div>
  );
};

const TimetableListSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
    {[...Array(6)].map((_, i) => (
      <Card key={i}>
        <CardHeader>
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </CardContent>
      </Card>
    ))}
  </div>
);

export default TimetablesPage;