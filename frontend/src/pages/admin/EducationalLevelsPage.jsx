import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { motion, useInView, useMotionValue, useSpring, animate } from 'framer-motion';
import { Plus, Search, Filter, GraduationCap, Users, MoreVertical, Edit, Trash2, Eye, BookOpen, Star, Layers, Target, X } from 'lucide-react';
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

const EducationalLevelsPage = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [educationalLevels, setEducationalLevels] = useState([]);
  const [filteredLevels, setFilteredLevels] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [levelFilter, setLevelFilter] = useState('all');

  const [stats, setStats] = useState({ 
    total: 0, 
    totalGrades: 0, 
    preschool: 0, 
    primary: 0,
    lowerSecondary: 0,
    upperSecondary: 0
  });

  const fetchEducationalLevels = async () => {
    setLoading(true);
    try {
      const response = await apiMethods.get('schools/levels/');
      let levelsData = response.results || (Array.isArray(response) ? response : response.data?.results || response.data || []);
      
      setEducationalLevels(levelsData);
      setFilteredLevels(levelsData);

      // Calculate statistics
      const totalGrades = levelsData.reduce((sum, level) => sum + (level.grades_count || 0), 0);
      const preschoolCount = levelsData.filter(level => level.level === 'PRESCHOOL').length;
      const primaryCount = levelsData.filter(level => level.level === 'PRIMARY').length;
      const lowerSecondaryCount = levelsData.filter(level => level.level === 'LOWER_SECONDARY').length;
      const upperSecondaryCount = levelsData.filter(level => level.level === 'UPPER_SECONDARY').length;

      setStats({
        total: levelsData.length,
        totalGrades: totalGrades,
        preschool: preschoolCount,
        primary: primaryCount,
        lowerSecondary: lowerSecondaryCount,
        upperSecondary: upperSecondaryCount
      });

    } catch (error) {
      console.error('Failed to fetch educational levels:', error);
      toast.error(t('error.failedToLoadData'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEducationalLevels();
  }, [t]);

  useEffect(() => {
    let filtered = educationalLevels;
    
    // Search filtering
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(level =>
        level.name.toLowerCase().includes(query) ||
        (level.name_arabic && level.name_arabic.toLowerCase().includes(query)) ||
        (level.name_french && level.name_french.toLowerCase().includes(query))
      );
    }
    
    // Level type filtering
    if (levelFilter !== 'all') {
      filtered = filtered.filter(level => level.level === levelFilter);
    }
    
    setFilteredLevels(filtered);
  }, [searchQuery, levelFilter, educationalLevels]);

  const handleViewLevel = (levelId) => navigate(`/admin/academic-management/educational-levels/view/${levelId}`);
  const handleEditLevel = (levelId) => navigate(`/admin/academic-management/educational-levels/edit/${levelId}`);
  const handleDeleteLevel = async (levelId) => {
    if (window.confirm(t('educationalLevels.confirmDelete'))) {
      try {
        await apiMethods.delete(`schools/levels/${levelId}/`);
        toast.success(t('educationalLevels.deletedSuccessfully'));
        fetchEducationalLevels(); // Refresh the list
      } catch (error) {
        console.error('Failed to delete educational level:', error);
        toast.error(t('error.failedToDelete'));
      }
    }
  };
  const handleAddLevel = () => navigate('/admin/academic-management/educational-levels/add');

  // Get level type label
  const getLevelTypeLabel = (levelType) => {
    const typeMap = {
      'PRESCHOOL': t('educationalLevels.levelTypes.preschool'),
      'PRIMARY': t('educationalLevels.levelTypes.primary'),
      'LOWER_SECONDARY': t('educationalLevels.levelTypes.lowerSecondary'),
      'UPPER_SECONDARY': t('educationalLevels.levelTypes.upperSecondary'),
    };
    return typeMap[levelType] || levelType;
  };

  // Get level color (now dark/light friendly)
  const getLevelVariant = (levelType) => {
    // We'll use variant="secondary" for all and style with custom classes
    return 'secondary';
  };

  // Get level icon
  const getLevelIcon = (levelType) => {
    const iconMap = {
      'PRESCHOOL': Target,
      'PRIMARY': BookOpen,
      'LOWER_SECONDARY': GraduationCap,
      'UPPER_SECONDARY': Star,
    };
    return iconMap[levelType] || Layers;
  };

  // Educational Level Card component with animations
  const LevelCard = ({ level, index }) => {
    const LevelIcon = getLevelIcon(level.level);

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05, duration: 0.3 }}
        className="group"
      >
        <Card
          className="h-full border-border/50 hover:border-border transition-all duration-300 hover:shadow-lg cursor-pointer"
          onClick={() => handleViewLevel(level.id)}
        >
          <CardContent className="p-5 h-full flex flex-col">
            <div className="flex items-start gap-3 mb-4">
              <motion.div
                className="flex-shrink-0 relative"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="h-12 w-12 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center overflow-hidden ring-2 ring-emerald-500/20">
                  <LevelIcon className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                </div>
              </motion.div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h3 className="text-base font-semibold text-foreground leading-tight">
                    {level.name}
                  </h3>
                  <Badge variant="secondary" className="text-xs">
                    {getLevelTypeLabel(level.level)}
                  </Badge>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1 flex-wrap">
                  <div className="flex items-center gap-1">
                    <Users className="h-3.5 w-3.5" />
                    <span>{level.grades_count || 0} {t('educationalLevels.grades')}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Layers className="h-3.5 w-3.5" />
                    <span>{t('educationalLevels.order')}: {level.order}</span>
                  </div>
                </div>
                {level.name_arabic && (
                  <p className="text-xs text-muted-foreground mt-1 truncate" dir="rtl">
                    {level.name_arabic}
                  </p>
                )}
                {level.name_french && (
                  <p className="text-xs text-muted-foreground mt-1 truncate">
                    {level.name_french}
                  </p>
                )}
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
                      handleEditLevel(level.id);
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
                      handleDeleteLevel(level.id);
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
                  {t('educationalLevels.educationalLevel')}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleViewLevel(level.id);
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
    <Button key="add-level" onClick={handleAddLevel} className="gap-2">
      <Plus className="h-4 w-4" />
      {t('educationalLevels.addEducationalLevel')}
    </Button>
  ];

  if (loading) {
    return (
      <AdminPageLayout
        title={t('educationalLevels.title')}
        subtitle={t('educationalLevels.subtitle')}
        actions={actions}
        loading={loading}
      />
    );
  }

  return (
    <AdminPageLayout
      title={t('educationalLevels.title')}
      subtitle={t('educationalLevels.subtitle')}
      actions={actions}
    >
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6 mb-6">
        <StatCard
          icon={Layers}
          label={t('educationalLevels.totalLevels')}
          value={stats.total}
          description={t('educationalLevels.allLevels')}
          iconColor="text-blue-600 dark:text-blue-400"
          iconBg="bg-blue-100 dark:bg-blue-900/40"
        />
        <StatCard
          icon={BookOpen}
          label={t('educationalLevels.totalGrades')}
          value={stats.totalGrades}
          description={t('educationalLevels.gradesAcrossLevels')}
          iconColor="text-green-600 dark:text-green-400"
          iconBg="bg-green-100 dark:bg-green-900/40"
        />
        <StatCard
          icon={Target}
          label={t('educationalLevels.preschoolLevels')}
          value={stats.preschool}
          description={t('educationalLevels.earlyEducation')}
          iconColor="text-pink-600 dark:text-pink-400"
          iconBg="bg-pink-100 dark:bg-pink-900/40"
        />
        <StatCard
          icon={GraduationCap}
          label={t('educationalLevels.secondaryLevels')}
          value={stats.lowerSecondary + stats.upperSecondary}
          description={t('educationalLevels.secondaryEducation')}
          iconColor="text-purple-600 dark:text-purple-400"
          iconBg="bg-purple-100 dark:bg-purple-900/40"
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
                placeholder={t('educationalLevels.searchPlaceholder')}
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
                {/* Level Type Filter */}
                <Select value={levelFilter} onValueChange={setLevelFilter}>
                  <SelectTrigger className="h-9 w-[200px] border-border/50">
                    <SelectValue placeholder={t('educationalLevels.filterByType')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('educationalLevels.allLevels')}</SelectItem>
                    <SelectItem value="PRESCHOOL">{t('educationalLevels.levelTypes.preschool')}</SelectItem>
                    <SelectItem value="PRIMARY">{t('educationalLevels.levelTypes.primary')}</SelectItem>
                    <SelectItem value="LOWER_SECONDARY">{t('educationalLevels.levelTypes.lowerSecondary')}</SelectItem>
                    <SelectItem value="UPPER_SECONDARY">{t('educationalLevels.levelTypes.upperSecondary')}</SelectItem>
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
                        {getLevelTypeLabel(levelFilter)}
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
                {filteredLevels.length} {t('common.results') || 'results'}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Educational Levels Grid */}
      {filteredLevels.length === 0 ? (
        <Card className="border-dashed border-2 border-border/60">
          <CardContent className="flex flex-col items-center justify-center gap-4 py-16 text-center">
            <div className="rounded-full bg-muted p-6">
              <Layers className="h-12 w-12 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-foreground">
                {searchQuery || levelFilter !== 'all' ? t('educationalLevels.noLevelsFound') : t('educationalLevels.noLevelsYet')}
              </h3>
              <p className="text-sm text-muted-foreground max-w-sm">
                {searchQuery || levelFilter !== 'all'
                  ? t('educationalLevels.tryDifferentSearch')
                  : t('educationalLevels.addFirstLevel')
                }
              </p>
            </div>
            {(!searchQuery && levelFilter === 'all' && educationalLevels.length === 0) && (
              <Button onClick={handleAddLevel} className="gap-2">
                <Plus className="h-4 w-4" />
                {t('educationalLevels.addEducationalLevel')}
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
          {filteredLevels.map((level, index) => (
            <LevelCard key={level.id} level={level} index={index} />
          ))}
        </div>
      )}
    </AdminPageLayout>
  );
};

export default EducationalLevelsPage;