import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { motion, useInView, useMotionValue, useSpring, animate } from 'framer-motion';
import { Plus, Search, Filter, Calendar, Clock, Users, MoreVertical, Edit, Trash2, Eye, CheckCircle, XCircle, GraduationCap, TrendingUp, Sparkles, Star } from 'lucide-react';
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

const GlowingCard = ({ children, className = "", glowColor = "blue" }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ y: -5, transition: { duration: 0.2 } }}
    className={`relative group ${className}`}
  >
    <div className={`absolute -inset-0.5 bg-gradient-to-r from-${glowColor}-500 to-purple-600 rounded-lg blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200`}></div>
    <div className="relative bg-card border rounded-xl backdrop-blur-sm">
      {children}
    </div>
  </motion.div>
)

const StatCard = ({ icon: Icon, label, value, colorClass, description, glowColor }) => (
  <GlowingCard glowColor={glowColor}>
    <CardContent className="p-4 sm:p-6">
      <div className="flex items-center space-x-3 sm:space-x-4">
        <motion.div 
          className={`p-2 sm:p-3 rounded-full bg-gradient-to-br from-${glowColor}-500 to-${glowColor}-600 text-white shadow-lg flex-shrink-0`}
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
        </motion.div>
        <div className="flex-1 space-y-1 min-w-0">
          <p className="text-xs sm:text-sm text-muted-foreground truncate">{label}</p>
          <div className={`text-lg sm:text-3xl font-bold ${colorClass}`}>
            <AnimatedCounter to={value} />
          </div>
          <p className="text-xs text-muted-foreground mt-1 truncate">{description}</p>
        </div>
      </div>
    </CardContent>
  </GlowingCard>
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

  // Get status color
  const getStatusColor = (status) => {
    const colorMap = {
      'current': 'bg-green-100 text-green-800',
      'upcoming': 'bg-blue-100 text-blue-800',
      'past': 'bg-gray-100 text-gray-800',
    };
    return colorMap[status] || 'bg-gray-100 text-gray-800';
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
        transition={{ delay: index * 0.1, duration: 0.5 }}
        whileHover={{ y: -8, scale: 1.02 }}
        className="group"
      >
        <GlowingCard glowColor="violet" className="h-full">
          <CardContent className="p-4 h-full flex flex-col">
            <div className="flex items-start space-x-3 mb-4">
              <motion.div 
                className="flex-shrink-0 relative"
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg">
                  {year.is_current ? (
                    <Star className="h-6 w-6 text-white" />
                  ) : (
                    <Calendar className="h-6 w-6 text-white" />
                  )}
                </div>
              </motion.div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <h3 className="text-lg font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                    {year.year}
                  </h3>
                  <Badge variant="secondary" className={`text-xs ${getStatusColor(status)}`}>
                    {getStatusLabel(status)}
                  </Badge>
                  {year.is_current && (
                    <Badge variant="secondary" className="text-xs bg-yellow-100 text-yellow-800">
                      {t('academicYears.currentYear')}
                    </Badge>
                  )}
                </div>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{new Date(year.start_date).toLocaleDateString()} - {new Date(year.end_date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-1">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>{t('academicYears.duration')}: {duration} {t('academicYears.durationInDays')}</span>
                  </div>
                </div>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-muted"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem 
                    onClick={() => handleViewYear(year.id)}
                    className="cursor-pointer"
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    {t('action.view')}
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => handleEditYear(year.id)}
                    className="cursor-pointer"
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    {t('action.edit')}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={() => handleDeleteYear(year.id)}
                    className="cursor-pointer text-destructive focus:text-destructive"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    {t('action.delete')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="mt-auto pt-4 border-t border-muted">
              <div className="flex justify-between items-center">
                <span className="text-xs text-muted-foreground">
                  {t('academicYears.academicPeriod')}
                </span>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleViewYear(year.id)}
                    className="text-xs px-2 py-1 h-auto hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    {t('action.details')}
                  </Button>
                </motion.div>
              </div>
            </div>
          </CardContent>
        </GlowingCard>
      </motion.div>
    );
  };

  const actions = [
    <Button key="add-year" onClick={handleAddYear} className="bg-primary text-primary-foreground gap-2 shadow-md hover:bg-primary/90">
      <Plus className="h-4 w-4" />{t('academicYears.addAcademicYear')}
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
          colorClass="text-blue-600"
          description={t('academicYears.allYears')}
          glowColor="blue"
        />
        <StatCard
          icon={Star}
          label={t('academicYears.currentYear')}
          value={stats.current}
          colorClass="text-green-600"
          description={t('academicYears.current')}
          glowColor="green"
        />
        <StatCard
          icon={TrendingUp}
          label={t('academicYears.upcomingYears')}
          value={stats.upcoming}
          colorClass="text-purple-600"
          description={t('academicYears.upcoming')}
          glowColor="purple"
        />
        <StatCard
          icon={GraduationCap}
          label={t('academicYears.pastYears')}
          value={stats.past}
          colorClass="text-orange-600"
          description={t('academicYears.past')}
          glowColor="orange"
        />
      </div>

      {/* Search and Filter Section */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder={t('academicYears.searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder={t('academicYears.filterByStatus')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('academicYears.allYears')}</SelectItem>
            <SelectItem value="current">{t('academicYears.current')}</SelectItem>
            <SelectItem value="upcoming">{t('academicYears.upcoming')}</SelectItem>
            <SelectItem value="past">{t('academicYears.past')}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Academic Years Grid */}
      {filteredYears.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <Calendar className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">
            {searchQuery || statusFilter !== 'all' ? t('academicYears.noYearsFound') : t('academicYears.noYearsYet')}
          </h3>
          <p className="text-muted-foreground mb-6">
            {searchQuery || statusFilter !== 'all' 
              ? t('academicYears.tryDifferentSearch')
              : t('academicYears.addFirstYear')
            }
          </p>
          {!searchQuery && statusFilter === 'all' && (
            <Button onClick={handleAddYear} className="gap-2">
              <Plus className="h-4 w-4" />
              {t('academicYears.addAcademicYear')}
            </Button>
          )}
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6">
          {filteredYears.map((year, index) => (
            <YearCard key={year.id} year={year} index={index} />
          ))}
        </div>
      )}
    </AdminPageLayout>
  );
};

export default AcademicYearsPage;