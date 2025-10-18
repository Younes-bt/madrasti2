import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { motion, useInView, useMotionValue, useSpring, animate } from 'framer-motion';
import { Plus, Search, Filter, Users, MoreVertical, Edit, Trash2, Eye, Building, X } from 'lucide-react';
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
import { apiMethods }from '../../services/api';
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

const ClassesPage = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [classes, setClasses] = useState([]);
  const [filteredClasses, setFilteredClasses] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [gradeFilter, setGradeFilter] = useState('all');
  const [academicYearFilter, setAcademicYearFilter] = useState('all');
  const [grades, setGrades] = useState([]);
  const [academicYears, setAcademicYears] = useState([]);

  const [stats, setStats] = useState({ 
    total: 0, 
    // Add more relevant stats for classes
  });

  const fetchClasses = async () => {
    setLoading(true);
    try {
      // Fetch ALL classes (pagination is now disabled on the backend)
      const response = await apiMethods.get('schools/classes/');
      let classesData = Array.isArray(response) ? response : (response.results || response.data?.results || response.data || []);

      setClasses(classesData);
      setFilteredClasses(classesData);

      setStats({
        total: classesData.length,
      });

    } catch (error) {
      console.error('Failed to fetch classes:', error);
      toast.error(t('error.failedToLoadData'));
    } finally {
      setLoading(false);
    }
  };

  const fetchFilterData = async () => {
    try {
      const [gradesResponse, academicYearsResponse] = await Promise.all([
        apiMethods.get('schools/grades/'),
        apiMethods.get('schools/academic-years/')
      ]);
      
      let gradesData = gradesResponse.results || (Array.isArray(gradesResponse) ? gradesResponse : gradesResponse.data?.results || gradesResponse.data || []);
      setGrades(gradesData);

      let academicYearsData = academicYearsResponse.results || (Array.isArray(academicYearsResponse) ? academicYearsResponse : academicYearsResponse.data?.results || academicYearsResponse.data || []);
      setAcademicYears(academicYearsData);

    } catch (error) {
      console.error('Failed to fetch filter data:', error);
    }
  };

  useEffect(() => {
    fetchClasses();
    fetchFilterData();
  }, [t]);

  useEffect(() => {
    let filtered = classes;

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(cls =>
        cls.name?.toLowerCase().includes(query) ||
        cls.grade_name?.toLowerCase().includes(query) ||
        cls.section?.toLowerCase().includes(query)
      );
    }

    if (gradeFilter !== 'all') {
      filtered = filtered.filter(cls => cls.grade === parseInt(gradeFilter));
    }
    
    if (academicYearFilter !== 'all') {
        const selectedYear = academicYears.find(y => y.id === parseInt(academicYearFilter));
        if (selectedYear) {
            filtered = filtered.filter(cls => cls.academic_year === selectedYear.year);
        }
    }

    setFilteredClasses(filtered);
  }, [searchQuery, gradeFilter, academicYearFilter, classes, academicYears]);

  const handleDeleteClass = async (classId) => {
    if (window.confirm(t('classes.confirmDelete'))) {
      try {
        await apiMethods.delete(`schools/classes/${classId}/`);
        toast.success(t('classes.deleteSuccess'));
        fetchClasses();
      } catch (error) {
        console.error('Failed to delete class:', error);
        toast.error(t('classes.deleteError'));
      }
    }
  };

  const actions = [
    <Button
      key="add-class"
      onClick={() => navigate('/admin/academic-management/classes/add')}
      className="gap-2"
    >
      <Plus className="h-4 w-4" />
      {t('classes.addClass')}
    </Button>
  ];

  return (
    <AdminPageLayout
      title={t('classes.title')}
      subtitle={t('classes.subtitle')}
      actions={actions}
    >
      <div className="space-y-6">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <StatCard
            icon={Building}
            label={t('classes.totalClasses')}
            value={stats.total}
            description={t('classes.totalClassesDesc')}
            iconColor="text-blue-600 dark:text-blue-400"
            iconBg="bg-blue-100 dark:bg-blue-900/40"
          />
          {/* Add more StatCards as needed */}
        </div>

        {/* Search and Filter Section */}
        <Card className="border-border/50">
          <CardContent className="p-6">
            <div className="space-y-4">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder={t('classes.searchPlaceholder')}
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
                  {/* Grade Filter */}
                  <Select value={gradeFilter} onValueChange={setGradeFilter}>
                    <SelectTrigger className="h-9 w-[180px] border-border/50">
                      <SelectValue placeholder={t('classes.filterByGrade')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t('grades.allGrades')}</SelectItem>
                      {grades.map((grade) => (
                        <SelectItem key={grade.id} value={grade.id.toString()}>
                          {grade.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* Academic Year Filter */}
                  <Select value={academicYearFilter} onValueChange={setAcademicYearFilter}>
                    <SelectTrigger className="h-9 w-[180px] border-border/50">
                      <SelectValue placeholder={t('classes.filterByYear')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t('academicYears.allYears')}</SelectItem>
                      {academicYears.map((year) => (
                        <SelectItem key={year.id} value={year.id.toString()}>
                          {year.year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* Active Filter Badges */}
                  {(searchQuery || gradeFilter !== 'all' || academicYearFilter !== 'all') && (
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
                      {gradeFilter !== 'all' && (
                        <Badge
                          variant="secondary"
                          className="gap-1 px-2 py-1 cursor-pointer hover:bg-secondary/80"
                          onClick={() => setGradeFilter('all')}
                        >
                          {grades.find(g => g.id.toString() === gradeFilter)?.name || 'Grade'}
                          <X className="h-3 w-3 ml-1" />
                        </Badge>
                      )}
                      {academicYearFilter !== 'all' && (
                        <Badge
                          variant="secondary"
                          className="gap-1 px-2 py-1 cursor-pointer hover:bg-secondary/80"
                          onClick={() => setAcademicYearFilter('all')}
                        >
                          {academicYears.find(y => y.id.toString() === academicYearFilter)?.year || 'Year'}
                          <X className="h-3 w-3 ml-1" />
                        </Badge>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSearchQuery('');
                          setGradeFilter('all');
                          setAcademicYearFilter('all');
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
                  {filteredClasses.length} {t('common.results') || 'results'}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Classes Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array(6).fill(0).map((_, i) => (
              <div key={i} className="animate-pulse">
                <Card className="border-border/50">
                  <CardContent className="p-6 space-y-3">
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                    <div className="h-3 bg-muted rounded w-1/2"></div>
                    <div className="h-8 bg-muted rounded w-full"></div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        ) : filteredClasses.length === 0 ? (
          <Card className="border-dashed border-2 border-border/60">
            <CardContent className="flex flex-col items-center justify-center gap-4 py-16 text-center">
              <div className="rounded-full bg-muted p-6">
                <Building className="h-12 w-12 text-muted-foreground" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-foreground">
                  {searchQuery || gradeFilter !== 'all' || academicYearFilter !== 'all' ? t('classes.noClassesFound') : t('classes.noClassesYet')}
                </h3>
                <p className="text-sm text-muted-foreground max-w-sm">
                  {t('classes.addFirstClass')}
                </p>
              </div>
              {(!searchQuery && gradeFilter === 'all' && academicYearFilter === 'all' && classes.length === 0) && (
                <Button onClick={() => navigate('/admin/academic-management/classes/add')} className="gap-2">
                  <Plus className="h-4 w-4" />
                  {t('classes.addClass')}
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredClasses.map((cls, index) => (
              <motion.div
                key={cls.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="group"
              >
                <Card
                  className="h-full border-border/50 hover:border-border transition-all duration-300 hover:shadow-lg cursor-pointer"
                  onClick={() => navigate(`/admin/academic-management/classes/${cls.id}`)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-2 flex-1 min-w-0">
                        <CardTitle className="text-base font-semibold text-foreground leading-tight">
                          {cls.name}
                        </CardTitle>
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge variant="outline" className="text-xs">
                            {cls.grade_name}
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            {cls.academic_year}
                          </Badge>
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
                              navigate(`/admin/academic-management/classes/${cls.id}/edit`);
                            }}
                            className="cursor-pointer"
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            {t('common.edit')}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteClass(cls.id);
                            }}
                            className="cursor-pointer text-destructive focus:text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            {t('common.delete')}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">{t('classes.section')}</span>
                        <Badge variant="outline" className="bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800">
                          {cls.section}
                        </Badge>
                      </div>
                      {/* Add more details if available in serializer */}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </AdminPageLayout>
  );
};

export default ClassesPage;
