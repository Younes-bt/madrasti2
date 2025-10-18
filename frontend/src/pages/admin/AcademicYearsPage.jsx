import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { motion, useInView, useMotionValue, useSpring, animate } from 'framer-motion';
import { Plus, Search, Filter, Calendar, Clock, MoreVertical, Edit, Trash2, Eye, GraduationCap, TrendingUp, Star, X } from 'lucide-react';
import AdminPageLayout from '../../components/admin/layout/AdminPageLayout';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '../../components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import { apiMethods } from '../../services/api';
import { toast } from 'sonner';

const AnimatedCounter = ({ from = 0, to, duration = 2, className = "" }) => {
  const ref = useRef()
  const motionValue = useMotionValue(from)
  const springValue = useSpring(motionValue, { duration: duration * 1000 })
  const isInView = useInView(ref, { once: true, margin: "-50px" })
  const [displayValue, setDisplayValue] = useState(from)

  useEffect(() => {
    if (isInView && to !== undefined) {
      animate(motionValue, to, { duration: duration })
    }
  }, [motionValue, isInView, to, duration])

  useEffect(() => {
    const unsubscribe = springValue.on("change", (latest) => {
      setDisplayValue(Math.round(latest))
    })
    return unsubscribe
  }, [springValue])

  return (
    <span ref={ref} className={className}>
      {displayValue.toLocaleString()}
    </span>
  )
}

const StatCard = ({ icon: Icon, label, value, description, iconColor, iconBg }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ y: -4 }}
    transition={{ duration: 0.3 }}
  >
    <Card className="border-border/50 hover:border-border transition-all duration-300 hover:shadow-lg">
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-xl ${iconBg}`}>
            <Icon className={`h-6 w-6 ${iconColor}`} />
          </div>
          <div className="flex-1">
            <p className="text-sm text-muted-foreground mb-1">{label}</p>
            <div className="text-3xl font-bold text-foreground">
              <AnimatedCounter to={value} />
            </div>
            <p className="text-xs text-muted-foreground mt-1">{description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  </motion.div>
);

const AcademicYearsPage = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [academicYears, setAcademicYears] = useState([]);
  const [filteredYears, setFilteredYears] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const [stats, setStats] = useState({ 
    total: 0, 
    current: 0, 
    upcoming: 0, 
    past: 0 
  });

  const fetchAcademicYears = async () => {
    setLoading(true);
    try {
      const response = await apiMethods.get('schools/academic-years/');
      let yearsData = response.results || (Array.isArray(response) ? response : response.data?.results || response.data || []);
      
      setAcademicYears(yearsData);
      setFilteredYears(yearsData);

      // Calculate statistics
      const currentDate = new Date();
      const currentCount = yearsData.filter(year => year.is_current).length;
      const upcomingCount = yearsData.filter(year => new Date(year.start_date) > currentDate).length;
      const pastCount = yearsData.filter(year => new Date(year.end_date) < currentDate && !year.is_current).length;

      setStats({
        total: yearsData.length,
        current: currentCount,
        upcoming: upcomingCount,
        past: pastCount
      });

    } catch (error) {
      console.error('Failed to fetch academic years:', error);
      toast.error(t('error.failedToLoadData'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAcademicYears();
  }, [t]);

  useEffect(() => {
    let filtered = academicYears;
    
    // Search filtering
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(year =>
        year.year.toLowerCase().includes(query)
      );
    }
    
    // Status filtering
    if (statusFilter !== 'all') {
      const currentDate = new Date();
      if (statusFilter === 'current') {
        filtered = filtered.filter(year => year.is_current);
      } else if (statusFilter === 'upcoming') {
        filtered = filtered.filter(year => new Date(year.start_date) > currentDate);
      } else if (statusFilter === 'past') {
        filtered = filtered.filter(year => new Date(year.end_date) < currentDate && !year.is_current);
      }
    }
    
    setFilteredYears(filtered);
  }, [searchQuery, statusFilter, academicYears]);

  const handleViewYear = (yearId) => navigate(`/admin/academic-management/academic-years/view/${yearId}`);
  const handleEditYear = (yearId) => navigate(`/admin/academic-management/academic-years/edit/${yearId}`);
  const handleDeleteYear = async (yearId) => {
    if (window.confirm(t('academicYears.confirmDelete'))) {
      try {
        await apiMethods.delete(`schools/academic-years/${yearId}/`);
        toast.success(t('academicYears.deletedSuccessfully'));
        fetchAcademicYears(); // Refresh the list
      } catch (error) {
        console.error('Failed to delete academic year:', error);
        toast.error(t('error.failedToDelete'));
      }
    }
  };
  const handleAddYear = () => navigate('/admin/academic-management/academic-years/add');

  // Get year status
  const getYearStatus = (year) => {
    if (year.is_current) return 'current';
    const currentDate = new Date();
    if (new Date(year.start_date) > currentDate) return 'upcoming';
    if (new Date(year.end_date) < currentDate) return 'past';
    return 'current';
  };

  // Get status label
  const getStatusLabel = (status) => {
    const statusMap = {
      'current': t('academicYears.status.current'),
      'upcoming': t('academicYears.status.upcoming'),
      'past': t('academicYears.status.past'),
    };
    return statusMap[status] || status;
  };

  // Calculate duration in days
  const calculateDuration = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Academic Year Card component with animations
  const YearCard = ({ year, index }) => {
    const status = getYearStatus(year);
    const duration = calculateDuration(year.start_date, year.end_date);

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05, duration: 0.3 }}
        className="group"
      >
        <Card
          className="h-full border-border/50 hover:border-border transition-all duration-300 hover:shadow-lg cursor-pointer"
          onClick={() => handleViewYear(year.id)}
        >
          <CardContent className="p-5 h-full flex flex-col">
            <div className="flex items-start gap-3 mb-4">
              <motion.div
                className="flex-shrink-0 relative"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className={`h-12 w-12 rounded-full flex items-center justify-center overflow-hidden ring-2 ${
                  year.is_current
                    ? 'bg-yellow-100 dark:bg-yellow-900/40 ring-yellow-500/20'
                    : 'bg-primary/10 ring-primary/20'
                }`}>
                  {year.is_current ? (
                    <Star className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                  ) : (
                    <Calendar className="h-6 w-6 text-primary" />
                  )}
                </div>
              </motion.div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h3 className="text-base font-semibold text-foreground leading-tight">
                    {year.year}
                  </h3>
                  <Badge variant={status === 'current' ? 'default' : 'secondary'} className="text-xs">
                    {getStatusLabel(status)}
                  </Badge>
                  {year.is_current && (
                    <Badge variant="secondary" className="text-xs bg-yellow-100 dark:bg-yellow-900/40 text-yellow-800 dark:text-yellow-300">
                      {t('academicYears.currentYear')}
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                  <Clock className="h-3.5 w-3.5" />
                  <span>{new Date(year.start_date).toLocaleDateString()} - {new Date(year.end_date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>{t('academicYears.duration')}: {duration} {t('academicYears.durationInDays')}</span>
                </div>
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
                      handleEditYear(year.id);
                    }}
                    className="cursor-pointer"
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    {t('action.edit')}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteYear(year.id);
                    }}
                    className="cursor-pointer text-destructive focus:text-destructive"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    {t('action.delete')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="mt-auto space-y-2.5 pt-3 border-t border-border/50">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">
                  {t('academicYears.academicPeriod')}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleViewYear(year.id);
                  }}
                  className="h-8 gap-2"
                >
                  <Eye className="h-4 w-4" />
                  {t('action.details')}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  const actions = [
    <Button key="add-year" onClick={handleAddYear} className="gap-2">
      <Plus className="h-4 w-4" />
      {t('academicYears.addAcademicYear')}
    </Button>
  ];

  if (loading) {
    return (
      <AdminPageLayout
        title={t('academicYears.title')}
        subtitle={t('academicYears.subtitle')}
        actions={actions}
        loading={loading}
      />
    );
  }

  return (
    <AdminPageLayout
      title={t('academicYears.title')}
      subtitle={t('academicYears.subtitle')}
      actions={actions}
    >
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6 mb-6">
        <StatCard
          icon={Calendar}
          label={t('academicYears.totalYears')}
          value={stats.total}
          description={t('academicYears.allYears')}
          iconColor="text-blue-600 dark:text-blue-400"
          iconBg="bg-blue-100 dark:bg-blue-900/40"
        />
        <StatCard
          icon={Star}
          label={t('academicYears.currentYear')}
          value={stats.current}
          description={t('academicYears.current')}
          iconColor="text-green-600 dark:text-green-400"
          iconBg="bg-green-100 dark:bg-green-900/40"
        />
        <StatCard
          icon={TrendingUp}
          label={t('academicYears.upcomingYears')}
          value={stats.upcoming}
          description={t('academicYears.upcoming')}
          iconColor="text-purple-600 dark:text-purple-400"
          iconBg="bg-purple-100 dark:bg-purple-900/40"
        />
        <StatCard
          icon={GraduationCap}
          label={t('academicYears.pastYears')}
          value={stats.past}
          description={t('academicYears.past')}
          iconColor="text-orange-600 dark:text-orange-400"
          iconBg="bg-orange-100 dark:bg-orange-900/40"
        />
      </div>

      {/* Search and Filter Section */}
      <Card className="border-border/50 mb-6">
        <CardContent className="p-6">
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder={t('academicYears.searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
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
                {/* Status Filter */}
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="h-9 w-[180px] border-border/50">
                    <SelectValue placeholder={t('academicYears.filterByStatus')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('academicYears.allYears')}</SelectItem>
                    <SelectItem value="current">{t('academicYears.current')}</SelectItem>
                    <SelectItem value="upcoming">{t('academicYears.upcoming')}</SelectItem>
                    <SelectItem value="past">{t('academicYears.past')}</SelectItem>
                  </SelectContent>
                </Select>

                {/* Active Filter Badges */}
                {(searchQuery || statusFilter !== 'all') && (
                  <>
                    {searchQuery && (
                      <Badge
                        variant="secondary"
                        className="gap-1 px-2 py-1 cursor-pointer hover:bg-secondary/80"
                        onClick={() => setSearchQuery('')}
                      >
                        <Search className="h-3 w-3" />
                        {searchQuery}
                        <X className="h-3 w-3 ml-1" />
                      </Badge>
                    )}
                    {statusFilter !== 'all' && (
                      <Badge
                        variant="secondary"
                        className="gap-1 px-2 py-1 cursor-pointer hover:bg-secondary/80"
                        onClick={() => setStatusFilter('all')}
                      >
                        {t(`academicYears.${statusFilter}`)}
                        <X className="h-3 w-3 ml-1" />
                      </Badge>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSearchQuery('');
                        setStatusFilter('all');
                      }}
                      className="h-7 px-2 text-xs"
                    >
                      {t('common.reset')}
                    </Button>
                  </>
                )}
              </div>

              {/* Results Count */}
              <div className="text-sm text-muted-foreground whitespace-nowrap">
                {filteredYears.length} {t('common.results') || 'results'}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Academic Years Grid */}
      {filteredYears.length === 0 ? (
        <Card className="border-dashed border-2 border-border/60">
          <CardContent className="flex flex-col items-center justify-center gap-4 py-16 text-center">
            <div className="rounded-full bg-muted p-6">
              <Calendar className="h-12 w-12 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-foreground">
                {searchQuery || statusFilter !== 'all' ? t('academicYears.noYearsFound') : t('academicYears.noYearsYet')}
              </h3>
              <p className="text-sm text-muted-foreground max-w-sm">
                {searchQuery || statusFilter !== 'all'
                  ? t('academicYears.tryDifferentSearch')
                  : t('academicYears.addFirstYear')
                }
              </p>
            </div>
            {(!searchQuery && statusFilter === 'all' && academicYears.length === 0) && (
              <Button onClick={handleAddYear} className="gap-2">
                <Plus className="h-4 w-4" />
                {t('academicYears.addAcademicYear')}
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
          {filteredYears.map((year, index) => (
            <YearCard key={year.id} year={year} index={index} />
          ))}
        </div>
      )}
    </AdminPageLayout>
  );
};

export default AcademicYearsPage;