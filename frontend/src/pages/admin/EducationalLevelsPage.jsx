import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { motion, useInView, useMotionValue, useSpring, animate } from 'framer-motion';
import { Plus, Search, Filter, GraduationCap, Users, MoreVertical, Edit, Trash2, Eye, BookOpen, TrendingUp, Sparkles, Star, Layers, Target } from 'lucide-react';
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

  // Get level color
  const getLevelColor = (levelType) => {
    const colorMap = {
      'PRESCHOOL': 'bg-pink-100 text-pink-800',
      'PRIMARY': 'bg-blue-100 text-blue-800',
      'LOWER_SECONDARY': 'bg-green-100 text-green-800',
      'UPPER_SECONDARY': 'bg-purple-100 text-purple-800',
    };
    return colorMap[levelType] || 'bg-gray-100 text-gray-800';
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
        transition={{ delay: index * 0.1, duration: 0.5 }}
        whileHover={{ y: -8, scale: 1.02 }}
        className="group"
      >
        <GlowingCard glowColor="emerald" className="h-full">
          <CardContent className="p-4 h-full flex flex-col">
            <div className="flex items-start space-x-3 mb-4">
              <motion.div 
                className="flex-shrink-0 relative"
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-lg">
                  <LevelIcon className="h-6 w-6 text-white" />
                </div>
              </motion.div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <h3 className="text-lg font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                    {level.name}
                  </h3>
                  <Badge variant="secondary" className={`text-xs ${getLevelColor(level.level)}`}>
                    {getLevelTypeLabel(level.level)}
                  </Badge>
                </div>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Users className="h-4 w-4" />
                    <span>{level.grades_count || 0} {t('educationalLevels.grades')}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Layers className="h-4 w-4" />
                    <span>{t('educationalLevels.order')}: {level.order}</span>
                  </div>
                </div>
                {level.name_arabic && (
                  <p className="text-sm text-muted-foreground mt-1 truncate" dir="rtl">
                    {level.name_arabic}
                  </p>
                )}
                {level.name_french && (
                  <p className="text-sm text-muted-foreground mt-1 truncate">
                    {level.name_french}
                  </p>
                )}
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
                    onClick={() => handleViewLevel(level.id)}
                    className="cursor-pointer"
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    {t('action.view')}
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => handleEditLevel(level.id)}
                    className="cursor-pointer"
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    {t('action.edit')}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onClick={() => handleDeleteLevel(level.id)}
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
                  {t('educationalLevels.educationalLevel')}
                </span>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleViewLevel(level.id)}
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
    <Button key="add-level" onClick={handleAddLevel} className="bg-primary text-primary-foreground gap-2 shadow-md hover:bg-primary/90">
      <Plus className="h-4 w-4" />{t('educationalLevels.addEducationalLevel')}
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
          colorClass="text-blue-600"
          description={t('educationalLevels.allLevels')}
          glowColor="blue"
        />
        <StatCard
          icon={BookOpen}
          label={t('educationalLevels.totalGrades')}
          value={stats.totalGrades}
          colorClass="text-green-600"
          description={t('educationalLevels.gradesAcrossLevels')}
          glowColor="green"
        />
        <StatCard
          icon={Target}
          label={t('educationalLevels.preschoolLevels')}
          value={stats.preschool}
          colorClass="text-pink-600"
          description={t('educationalLevels.earlyEducation')}
          glowColor="pink"
        />
        <StatCard
          icon={GraduationCap}
          label={t('educationalLevels.secondaryLevels')}
          value={stats.lowerSecondary + stats.upperSecondary}
          colorClass="text-purple-600"
          description={t('educationalLevels.secondaryEducation')}
          glowColor="purple"
        />
      </div>

      {/* Search and Filter Section */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder={t('educationalLevels.searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={levelFilter} onValueChange={setLevelFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <Filter className="w-4 h-4 mr-2" />
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
      </div>

      {/* Educational Levels Grid */}
      {filteredLevels.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <Layers className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">
            {searchQuery || levelFilter !== 'all' ? t('educationalLevels.noLevelsFound') : t('educationalLevels.noLevelsYet')}
          </h3>
          <p className="text-muted-foreground mb-6">
            {searchQuery || levelFilter !== 'all' 
              ? t('educationalLevels.tryDifferentSearch')
              : t('educationalLevels.addFirstLevel')
            }
          </p>
          {!searchQuery && levelFilter === 'all' && (
            <Button onClick={handleAddLevel} className="gap-2">
              <Plus className="h-4 w-4" />
              {t('educationalLevels.addEducationalLevel')}
            </Button>
          )}
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6">
          {filteredLevels.map((level, index) => (
            <LevelCard key={level.id} level={level} index={index} />
          ))}
        </div>
      )}
    </AdminPageLayout>
  );
};

export default EducationalLevelsPage;