import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { motion, useInView, useMotionValue, useSpring, animate } from 'framer-motion';
import { Plus, Search, Filter, Users, MoreVertical, Edit, Trash2, Eye, BookOpen, TrendingUp, Sparkles, Star, Layers, Target, Hash, Building } from 'lucide-react';
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
      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
    >
      <Plus className="h-4 w-4 mr-2" />
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
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <StatCard
            icon={Building}
            label={t('classes.totalClasses')}
            value={stats.total}
            colorClass="text-blue-600"
            description={t('classes.totalClassesDesc')}
            glowColor="blue"
          />
          {/* Add more StatCards as needed */}
        </motion.div>

        <motion.div
          className="flex flex-col sm:flex-row gap-4 bg-card p-4 rounded-lg border shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder={t('classes.searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={gradeFilter} onValueChange={setGradeFilter}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <Filter className="h-4 w-4 mr-2" />
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
          <Select value={academicYearFilter} onValueChange={setAcademicYearFilter}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <Filter className="h-4 w-4 mr-2" />
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
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            Array(6).fill(0).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-card rounded-lg p-6 space-y-3 border shadow-sm">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                  <div className="h-8 bg-muted rounded w-full"></div>
                </div>
              </div>
            ))
          ) : filteredClasses.length === 0 ? (
            <motion.div 
              className="col-span-full text-center py-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <Building className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <p className="text-lg font-medium text-muted-foreground">
                {searchQuery || gradeFilter !== 'all' || academicYearFilter !== 'all' ? t('classes.noClassesFound') : t('classes.noClassesYet')}
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                {t('classes.addFirstClass')}
              </p>
            </motion.div>
          ) : (
            filteredClasses.map((cls, index) => (
              <motion.div
                key={cls.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <GlowingCard glowColor="purple">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1 flex-1">
                        <CardTitle className="text-lg font-semibold text-foreground">
                          {cls.name}
                        </CardTitle>
                        <div className="flex items-center gap-2">
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
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => navigate(`/admin/academic-management/classes/${cls.id}`)}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            {t('common.view')}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => navigate(`/admin/academic-management/classes/${cls.id}/edit`)}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            {t('common.edit')}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleDeleteClass(cls.id)}
                            className="text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            {t('common.delete')}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">{t('classes.section')}</span>
                        <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                          {cls.section}
                        </Badge>
                      </div>
                      {/* Add more details if available in serializer */}
                    </div>
                  </CardContent>
                </GlowingCard>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </AdminPageLayout>
  );
};

export default ClassesPage;
