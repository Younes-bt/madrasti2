import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Calendar, Plus, Eye, Edit, Trash2, Copy, Filter, Search, Clock, Users, BookOpen, CheckCircle, XCircle, MoreVertical, X
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
      className="gap-2"
    >
      <Plus className="h-4 w-4" />
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

  const hasActiveFilters = filters.search || filters.class !== 'all' || filters.academicYear !== 'all' || filters.status !== 'all';

  const clearAllFilters = () => {
    handleFilterChange('search', '');
    handleFilterChange('class', 'all');
    handleFilterChange('academicYear', 'all');
    handleFilterChange('status', 'all');
  };

  return (
    <Card className="border-border/50">
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder={t('timetables.searchPlaceholder')}
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="pl-10 h-11 bg-muted/50 border-0 focus-visible:ring-1"
            />
          </div>

          {/* Filter Row */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Filter className="h-4 w-4" />
              <span>{t('common.filters')}:</span>
            </div>

            <div className="flex flex-wrap items-center gap-2 flex-1">
              {/* Class Filter */}
              <Select value={filters.class} onValueChange={(value) => handleFilterChange('class', value)}>
                <SelectTrigger className="h-9 w-[180px] border-border/50">
                  <SelectValue placeholder={t('common.allClasses')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('common.allClasses')}</SelectItem>
                  {classes.map((cls) => <SelectItem key={cls.id} value={cls.id.toString()}>{cls.name}</SelectItem>)}
                </SelectContent>
              </Select>

              {/* Academic Year Filter */}
              <Select value={filters.academicYear} onValueChange={(value) => handleFilterChange('academicYear', value)}>
                <SelectTrigger className="h-9 w-[180px] border-border/50">
                  <SelectValue placeholder={t('common.allAcademicYears')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('common.allAcademicYears')}</SelectItem>
                  {academicYears.map((year) => <SelectItem key={year.id} value={year.id.toString()}>{year.year} {year.is_current ? `(${t('common.current')})` : ''}</SelectItem>)}
                </SelectContent>
              </Select>

              {/* Status Filter */}
              <Select value={filters.status} onValueChange={(value) => handleFilterChange('status', value)}>
                <SelectTrigger className="h-9 w-[140px] border-border/50">
                  <SelectValue placeholder={t('common.allStatuses')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('common.allStatuses')}</SelectItem>
                  <SelectItem value="active">{t('common.active')}</SelectItem>
                  <SelectItem value="inactive">{t('common.inactive')}</SelectItem>
                </SelectContent>
              </Select>

              {/* Active Filter Badges */}
              {hasActiveFilters && (
                <>
                  {filters.search && (
                    <Badge
                      variant="secondary"
                      className="gap-1 px-2 py-1 cursor-pointer hover:bg-secondary/80"
                      onClick={() => handleFilterChange('search', '')}
                    >
                      <Search className="h-3 w-3" />
                      {filters.search}
                      <X className="h-3 w-3 ml-1" />
                    </Badge>
                  )}
                  {filters.class !== 'all' && (
                    <Badge
                      variant="secondary"
                      className="gap-1 px-2 py-1 cursor-pointer hover:bg-secondary/80"
                      onClick={() => handleFilterChange('class', 'all')}
                    >
                      {classes.find(c => c.id.toString() === filters.class)?.name || 'Class'}
                      <X className="h-3 w-3 ml-1" />
                    </Badge>
                  )}
                  {filters.academicYear !== 'all' && (
                    <Badge
                      variant="secondary"
                      className="gap-1 px-2 py-1 cursor-pointer hover:bg-secondary/80"
                      onClick={() => handleFilterChange('academicYear', 'all')}
                    >
                      {academicYears.find(y => y.id.toString() === filters.academicYear)?.year || 'Year'}
                      <X className="h-3 w-3 ml-1" />
                    </Badge>
                  )}
                  {filters.status !== 'all' && (
                    <Badge
                      variant="secondary"
                      className="gap-1 px-2 py-1 cursor-pointer hover:bg-secondary/80"
                      onClick={() => handleFilterChange('status', 'all')}
                    >
                      {t(`common.${filters.status}`)}
                      <X className="h-3 w-3 ml-1" />
                    </Badge>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearAllFilters}
                    className="h-7 px-2 text-xs"
                  >
                    {t('common.reset')}
                  </Button>
                </>
              )}
            </div>
          </div>
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
    {
      title: t('timetables.totalTimetables'),
      value: stats.total,
      icon: Calendar,
      iconColor: 'text-blue-600 dark:text-blue-400',
      iconBg: 'bg-blue-100 dark:bg-blue-900/40'
    },
    {
      title: t('timetables.activeTimetables'),
      value: stats.active,
      icon: CheckCircle,
      iconColor: 'text-green-600 dark:text-green-400',
      iconBg: 'bg-green-100 dark:bg-green-900/40'
    },
    {
      title: t('timetables.inactiveTimetables'),
      value: stats.inactive,
      icon: XCircle,
      iconColor: 'text-gray-600 dark:text-gray-400',
      iconBg: 'bg-gray-100 dark:bg-gray-900/40'
    },
    {
      title: t('timetables.totalSessions'),
      value: stats.sessions,
      icon: Clock,
      iconColor: 'text-purple-600 dark:text-purple-400',
      iconBg: 'bg-purple-100 dark:bg-purple-900/40'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {statItems.map(item => (
        <motion.div
          key={item.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ y: -4 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="border-border/50 hover:border-border transition-all duration-300 hover:shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${item.iconBg}`}>
                  <item.icon className={`h-6 w-6 ${item.iconColor}`} />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground mb-1">{item.title}</p>
                  <p className="text-3xl font-bold text-foreground">{item.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

const TimetablesList = ({ timetables, onDelete, onDuplicate, onToggleStatus }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  if (timetables.length === 0) {
    return (
      <Card className="border-dashed border-2 border-border/60">
        <CardContent className="flex flex-col items-center justify-center gap-4 py-16 text-center">
          <div className="rounded-full bg-muted p-6">
            <Calendar className="h-12 w-12 text-muted-foreground" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-foreground">{t('timetables.noTimetables')}</h3>
            <p className="text-sm text-muted-foreground max-w-sm">{t('timetables.noTimetablesDescription')}</p>
          </div>
          <Button onClick={() => navigate('/admin/timetables/add')} className="gap-2">
            <Plus className="h-4 w-4" />
            {t('timetables.createFirst')}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {timetables.map((timetable, index) => (
        <TimetableCard
          key={timetable.id}
          index={index}
          timetable={timetable}
          onDelete={onDelete}
          onDuplicate={onDuplicate}
          onToggleStatus={onToggleStatus}
        />
      ))}
    </div>
  );
};

const TimetableCard = ({ timetable, index, onDelete, onDuplicate, onToggleStatus }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const statusConfig = timetable.is_active
    ? { icon: CheckCircle, label: t('common.active') }
    : { icon: XCircle, label: t('common.inactive') };
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
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="group"
    >
      <Card
        className="h-full border-border/50 hover:border-border transition-all duration-300 hover:shadow-lg cursor-pointer flex flex-col"
        onClick={() => navigate(`/admin/timetables/view/${timetable.id}`)}
      >
        <CardContent className="p-5 flex-grow">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-base text-foreground mb-1 truncate">{timetable.school_class_name}</h3>
              <p className="text-sm text-muted-foreground truncate">{timetable.academic_year_name}</p>
            </div>
            <Badge variant={timetable.is_active ? 'default' : 'secondary'} className="flex items-center gap-1 ml-2">
              <StatusIcon className="h-3 w-3" />
              {statusConfig.label}
            </Badge>
          </div>

          <div className="space-y-2.5 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Clock className="h-3.5 w-3.5 flex-shrink-0" />
              <span>{sessionsCount} {t('timetables.sessions')}</span>
            </div>
            <div className="flex items-center gap-2">
              <BookOpen className="h-3.5 w-3.5 flex-shrink-0" />
              <span>{totalWeeklyHours.toFixed(1)}h {t('timetables.perWeek')}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-3.5 w-3.5 flex-shrink-0" />
              <span className="truncate">{t('common.createdBy')}: {timetable.created_by_name}</span>
            </div>
          </div>
        </CardContent>

        <div className="border-t border-border/50 p-4 bg-muted/30 flex items-center justify-between">
          <div className="text-xs text-muted-foreground">
            {t('common.updated')}: {new Date(timetable.updated_at).toLocaleDateString()}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/admin/timetables/edit/${timetable.id}`);
                }}
                className="cursor-pointer"
              >
                <Edit className="mr-2 h-4 w-4" />{t('common.edit')}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  onDuplicate(timetable);
                }}
                className="cursor-pointer"
              >
                <Copy className="mr-2 h-4 w-4" />{t('common.duplicate')}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleStatus(timetable);
                }}
                className="cursor-pointer"
              >
                {timetable.is_active ? <XCircle className="mr-2 h-4 w-4" /> : <CheckCircle className="mr-2 h-4 w-4" />}
                {timetable.is_active ? t('common.deactivate') : t('common.activate')}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(timetable.id);
                }}
                className="cursor-pointer text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />{t('common.delete')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </Card>
    </motion.div>
  );
};

const TimetableListSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
    {[...Array(6)].map((_, i) => (
      <Card key={i} className="border-border/50">
        <CardContent className="p-6 space-y-3">
          <div className="flex items-start justify-between">
            <div className="space-y-2 flex-1">
              <Skeleton className="h-5 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
            <Skeleton className="h-6 w-16" />
          </div>
          <div className="space-y-2.5 pt-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
);

export default TimetablesPage;