import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { motion, useInView, useMotionValue, useSpring, animate } from 'framer-motion';
import { Plus, Search, Filter, GraduationCap, Users, MoreVertical, Edit, Trash2, Eye, BookOpen, TrendingUp, Sparkles, Star, Layers, Target, Hash } from 'lucide-react';
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

const GradesPage = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [grades, setGrades] = useState([]);
  const [filteredGrades, setFilteredGrades] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [levelFilter, setLevelFilter] = useState('all');
  const [educationalLevels, setEducationalLevels] = useState([]);

  const [stats, setStats] = useState({ 
    total: 0, 
    totalClasses: 0, 
    preschoolGrades: 0, 
    primaryGrades: 0,
    lowerSecondaryGrades: 0,
    upperSecondaryGrades: 0,
    averagePassingGrade: 0
  });

  const fetchGrades = async () => {
    setLoading(true);
    try {
      const response = await apiMethods.get('schools/grades/');
      let gradesData = response.results || (Array.isArray(response) ? response : response.data?.results || response.data || []);
      
      setGrades(gradesData);
      setFilteredGrades(gradesData);

      // Calculate statistics
      const totalClasses = gradesData.reduce((sum, grade) => sum + (grade.classes_count || 0), 0);
      const preschoolCount = gradesData.filter(grade => grade.educational_level_name?.includes('Preschool') || grade.educational_level_name?.includes('Préscolaire')).length;
      const primaryCount = gradesData.filter(grade => grade.educational_level_name?.includes('Primary') || grade.educational_level_name?.includes('Primaire')).length;
      const lowerSecondaryCount = gradesData.filter(grade => grade.educational_level_name?.includes('Lower') || grade.educational_level_name?.includes('Collège')).length;
      const upperSecondaryCount = gradesData.filter(grade => grade.educational_level_name?.includes('Upper') || grade.educational_level_name?.includes('Lycée')).length;
      
      const averagePassingGrade = gradesData.length > 0 
        ? gradesData.reduce((sum, grade) => sum + parseFloat(grade.passing_grade || 0), 0) / gradesData.length
        : 0;

      setStats({
        total: gradesData.length,
        totalClasses: totalClasses,
        preschoolGrades: preschoolCount,
        primaryGrades: primaryCount,
        lowerSecondaryGrades: lowerSecondaryCount,
        upperSecondaryGrades: upperSecondaryCount,
        averagePassingGrade: Math.round(averagePassingGrade * 100) / 100
      });

    } catch (error) {
      console.error('Failed to fetch grades:', error);
      toast.error(t('error.failedToLoadData'));
    } finally {
      setLoading(false);
    }
  };

  const fetchEducationalLevels = async () => {
    try {
      const response = await apiMethods.get('schools/levels/');
      let levelsData = response.results || (Array.isArray(response) ? response : response.data?.results || response.data || []);
      setEducationalLevels(levelsData);
    } catch (error) {
      console.error('Failed to fetch educational levels:', error);
    }
  };

  useEffect(() => {
    fetchGrades();
    fetchEducationalLevels();
  }, [t]);

  useEffect(() => {
    let filtered = grades;

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(grade =>
        grade.name?.toLowerCase().includes(query) ||
        grade.name_arabic?.toLowerCase().includes(query) ||
        grade.name_french?.toLowerCase().includes(query) ||
        grade.educational_level_name?.toLowerCase().includes(query) ||
        grade.grade_number?.toString().includes(query)
      );
    }

    // Filter by educational level
    if (levelFilter !== 'all') {
      filtered = filtered.filter(grade => grade.educational_level === parseInt(levelFilter));
    }

    setFilteredGrades(filtered);
  }, [searchQuery, levelFilter, grades]);

  const getGradeDisplayName = (grade) => {
    if (i18n.language === 'ar' && grade.name_arabic) return grade.name_arabic;
    if (i18n.language === 'fr' && grade.name_french) return grade.name_french;
    return grade.name;
  };

  const getEducationalLevelDisplayName = (grade) => {
    if (i18n.language === 'ar' && grade.educational_level_name_arabic) return grade.educational_level_name_arabic;
    if (i18n.language === 'fr' && grade.educational_level_name_french) return grade.educational_level_name_french;
    return grade.educational_level_name;
  };

  const handleDeleteGrade = async (gradeId) => {
    if (window.confirm(t('grades.confirmDelete'))) {
      try {
        await apiMethods.delete(`schools/grades/${gradeId}/`);
        toast.success(t('grades.deleteSuccess'));
        fetchGrades();
      } catch (error) {
        console.error('Failed to delete grade:', error);
        toast.error(t('grades.deleteError'));
      }
    }
  };

  const actions = [
    <Button
      key="add-grade"
      onClick={() => navigate('/admin/academic-management/grades/add')}
      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
    >
      <Plus className="h-4 w-4 mr-2" />
      {t('grades.addGrade')}
    </Button>
  ];

  return (
    <AdminPageLayout
      title={t('grades.title')}
      subtitle={t('grades.subtitle')}
      actions={actions}
    >
      <div className="space-y-6">
        {/* Statistics Cards */}
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <StatCard
            icon={Target}
            label={t('grades.totalGrades')}
            value={stats.total}
            colorClass="text-blue-600"
            description={t('grades.totalGradesDesc')}
            glowColor="blue"
          />
          <StatCard
            icon={Users}
            label={t('grades.totalClasses')}
            value={stats.totalClasses}
            colorClass="text-green-600"
            description={t('grades.totalClassesDesc')}
            glowColor="green"
          />
          <StatCard
            icon={TrendingUp}
            label={t('grades.averagePassingGrade')}
            value={stats.averagePassingGrade}
            colorClass="text-purple-600"
            description={t('grades.averagePassingGradeDesc')}
            glowColor="purple"
          />
          <StatCard
            icon={Sparkles}
            label={t('grades.highestLevel')}
            value={stats.upperSecondaryGrades}
            colorClass="text-orange-600"
            description={t('grades.upperSecondaryGrades')}
            glowColor="orange"
          />
        </motion.div>

        {/* Search and Filter Section */}
        <motion.div 
          className="flex flex-col sm:flex-row gap-4 bg-card/50 p-4 rounded-lg border backdrop-blur-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder={t('grades.searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-background/50"
            />
          </div>
          <Select value={levelFilter} onValueChange={setLevelFilter}>
            <SelectTrigger className="w-full sm:w-[200px] bg-background/50">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder={t('grades.filterByLevel')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('grades.allLevels')}</SelectItem>
              {educationalLevels.map((level) => (
                <SelectItem key={level.id} value={level.id.toString()}>
                  {i18n.language === 'ar' && level.name_arabic ? level.name_arabic :
                   i18n.language === 'fr' && level.name_french ? level.name_french :
                   level.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </motion.div>

        {/* Grades Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            // Loading skeletons
            Array(6).fill(0).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-card/50 rounded-lg p-6 space-y-3">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                  <div className="h-8 bg-muted rounded w-full"></div>
                </div>
              </div>
            ))
          ) : filteredGrades.length === 0 ? (
            <motion.div 
              className="col-span-full text-center py-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <GraduationCap className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <p className="text-lg font-medium text-muted-foreground">
                {searchQuery || levelFilter !== 'all' ? t('grades.noGradesFound') : t('grades.noGradesYet')}
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                {t('grades.addFirstGrade')}
              </p>
            </motion.div>
          ) : (
            filteredGrades.map((grade, index) => (
              <motion.div
                key={grade.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <GlowingCard glowColor="blue">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1 flex-1">
                        <CardTitle className="text-lg font-semibold text-foreground">
                          {getGradeDisplayName(grade)}
                        </CardTitle>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            <Hash className="h-3 w-3 mr-1" />
                            {grade.grade_number}
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            {getEducationalLevelDisplayName(grade)}
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
                            onClick={() => navigate(`/admin/academic-management/grades/${grade.id}`)}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            {t('common.view')}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => navigate(`/admin/academic-management/grades/${grade.id}/edit`)}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            {t('common.edit')}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleDeleteGrade(grade.id)}
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
                      {/* Passing Grade */}
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">{t('grades.passingGrade')}</span>
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          {grade.passing_grade}/20
                        </Badge>
                      </div>

                      {/* Classes Count */}
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">{t('grades.classes')}</span>
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm font-medium">{grade.classes_count || 0}</span>
                        </div>
                      </div>

                      {/* Educational Level Order */}
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">{t('grades.levelOrder')}</span>
                        <div className="flex items-center gap-1">
                          <Layers className="h-3 w-3 text-muted-foreground" />
                          <span className="text-sm font-medium">{grade.educational_level_order}</span>
                        </div>
                      </div>
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

export default GradesPage;