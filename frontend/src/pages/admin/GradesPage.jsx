import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { motion, useInView, useMotionValue, useSpring, animate } from 'framer-motion';
import { Plus, Search, Filter, GraduationCap, Users, MoreVertical, Edit, Trash2, Eye, TrendingUp, Sparkles, Layers, Target, Hash, X } from 'lucide-react';
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
        grade.code?.toLowerCase().includes(query) ||
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
      className="gap-2"
    >
      <Plus className="h-4 w-4" />
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <StatCard
            icon={Target}
            label={t('grades.totalGrades')}
            value={stats.total}
            description={t('grades.totalGradesDesc')}
            iconColor="text-blue-600 dark:text-blue-400"
            iconBg="bg-blue-100 dark:bg-blue-900/40"
          />
          <StatCard
            icon={Users}
            label={t('grades.totalClasses')}
            value={stats.totalClasses}
            description={t('grades.totalClassesDesc')}
            iconColor="text-green-600 dark:text-green-400"
            iconBg="bg-green-100 dark:bg-green-900/40"
          />
          <StatCard
            icon={TrendingUp}
            label={t('grades.averagePassingGrade')}
            value={stats.averagePassingGrade}
            description={t('grades.averagePassingGradeDesc')}
            iconColor="text-purple-600 dark:text-purple-400"
            iconBg="bg-purple-100 dark:bg-purple-900/40"
          />
          <StatCard
            icon={Sparkles}
            label={t('grades.highestLevel')}
            value={stats.upperSecondaryGrades}
            description={t('grades.upperSecondaryGrades')}
            iconColor="text-orange-600 dark:text-orange-400"
            iconBg="bg-orange-100 dark:bg-orange-900/40"
          />
        </div>

        {/* Search and Filter Section */}
        <Card className="border-border/50">
          <CardContent className="p-6">
            <div className="space-y-4">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder={t('grades.searchPlaceholder')}
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
                  {/* Level Filter */}
                  <Select value={levelFilter} onValueChange={setLevelFilter}>
                    <SelectTrigger className="h-9 w-[200px] border-border/50">
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

                  {/* Active Filter Badges */}
                  {(searchQuery || levelFilter !== 'all') && (
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
                      {levelFilter !== 'all' && (
                        <Badge
                          variant="secondary"
                          className="gap-1 px-2 py-1 cursor-pointer hover:bg-secondary/80"
                          onClick={() => setLevelFilter('all')}
                        >
                          {educationalLevels.find(l => l.id.toString() === levelFilter)?.name || 'Level'}
                          <X className="h-3 w-3 ml-1" />
                        </Badge>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSearchQuery('');
                          setLevelFilter('all');
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
                  {filteredGrades.length} {t('common.results') || 'results'}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Grades Grid */}
        {loading ? (
          // Loading skeletons
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
        ) : filteredGrades.length === 0 ? (
          <Card className="border-dashed border-2 border-border/60">
            <CardContent className="flex flex-col items-center justify-center gap-4 py-16 text-center">
              <div className="rounded-full bg-muted p-6">
                <GraduationCap className="h-12 w-12 text-muted-foreground" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-foreground">
                  {searchQuery || levelFilter !== 'all' ? t('grades.noGradesFound') : t('grades.noGradesYet')}
                </h3>
                <p className="text-sm text-muted-foreground max-w-sm">
                  {t('grades.addFirstGrade')}
                </p>
              </div>
              {(!searchQuery && levelFilter === 'all' && grades.length === 0) && (
                <Button onClick={() => navigate('/admin/academic-management/grades/add')} className="gap-2">
                  <Plus className="h-4 w-4" />
                  {t('grades.addGrade')}
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredGrades.map((grade, index) => (
              <motion.div
                key={grade.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="group"
              >
                <Card
                  className="h-full border-border/50 hover:border-border transition-all duration-300 hover:shadow-lg cursor-pointer"
                  onClick={() => navigate(`/admin/academic-management/grades/${grade.id}`)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-2 flex-1 min-w-0">
                        <CardTitle className="text-base font-semibold text-foreground leading-tight">
                          {getGradeDisplayName(grade)}
                        </CardTitle>
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge variant="outline" className="text-xs">
                            #{grade.code || 'N/A'}
                          </Badge>
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
                              navigate(`/admin/academic-management/grades/${grade.id}/edit`);
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
                              handleDeleteGrade(grade.id);
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
                      {/* Passing Grade */}
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">{t('grades.passingGrade')}</span>
                        <Badge variant="outline" className="bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800">
                          {grade.passing_grade}/20
                        </Badge>
                      </div>

                      {/* Classes Count */}
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">{t('grades.classes')}</span>
                        <div className="flex items-center gap-1">
                          <Users className="h-3.5 w-3.5 text-muted-foreground" />
                          <span className="font-medium text-foreground">{grade.classes_count || 0}</span>
                        </div>
                      </div>

                      {/* Educational Level Order */}
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">{t('grades.levelOrder')}</span>
                        <div className="flex items-center gap-1">
                          <Layers className="h-3.5 w-3.5 text-muted-foreground" />
                          <span className="font-medium text-foreground">{grade.educational_level_order}</span>
                        </div>
                      </div>
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

export default GradesPage;