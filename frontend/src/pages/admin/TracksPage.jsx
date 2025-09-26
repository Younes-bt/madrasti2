import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import i18n from '../../lib/i18n';
import { motion, useInView, useMotionValue, useSpring, animate } from 'framer-motion';
import { Plus, Search, Filter, GitBranch, Users, MoreVertical, Edit, Trash2, Eye, BookOpen, TrendingUp, Sparkles, Star, Layers, Target, Hash } from 'lucide-react';
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

// Helper function to get localized grade name
const getLocalizedGradeName = (grade) => {
  const currentLanguage = i18n.language;
  switch (currentLanguage) {
    case 'ar':
      return grade.name_arabic || grade.name;
    case 'fr':
      return grade.name_french || grade.name;
    default:
      return grade.name;
  }
};

// Helper function to get localized track name
const getLocalizedTrackName = (track) => {
  const currentLanguage = i18n.language;
  switch (currentLanguage) {
    case 'ar':
      return track.name_arabic || track.name;
    case 'fr':
      return track.name_french || track.name;
    default:
      return track.name;
  }
};

// Helper function to get localized grade name from track object
const getLocalizedTrackGradeName = (track) => {
  const currentLanguage = i18n.language;
  switch (currentLanguage) {
    case 'ar':
      return track.grade_name_arabic || track.grade_name;
    case 'fr':
      return track.grade_name_french || track.grade_name;
    default:
      return track.grade_name;
  }
};

const TracksPage = () => {
  const { t, i18n, ready } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [tracks, setTracks] = useState([]);
  const [filteredTracks, setFilteredTracks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [gradeFilter, setGradeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [grades, setGrades] = useState([]);

  // Statistics
  const totalTracks = tracks.length;
  const activeTracks = tracks.filter(track => track.is_active).length;
  const totalClasses = tracks.reduce((sum, track) => sum + (track.classes_count || 0), 0);

  useEffect(() => {
    fetchTracks();
    fetchGrades();
  }, []);

  useEffect(() => {
    filterTracks();
  }, [tracks, searchQuery, gradeFilter, statusFilter]);

  const fetchTracks = async () => {
    try {
      setLoading(true);
      const response = await apiMethods.get('/schools/tracks/');
      setTracks(response.results || response || []);
    } catch (error) {
      console.error('Error fetching tracks:', error);
      toast.error(t('common.error') + ': ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchGrades = async () => {
    try {
      const response = await apiMethods.get('/schools/grades/');
      setGrades(response.results || response || []);
    } catch (error) {
      console.error('Error fetching grades:', error);
    }
  };

  const filterTracks = () => {
    let filtered = tracks;

    if (searchQuery) {
      filtered = filtered.filter(track =>
        track.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        track.name_arabic?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        track.name_french?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        track.code?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        track.grade_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        track.grade_name_arabic?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        track.grade_name_french?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (gradeFilter !== 'all') {
      filtered = filtered.filter(track => track.grade === parseInt(gradeFilter));
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(track =>
        statusFilter === 'active' ? track.is_active : !track.is_active
      );
    }

    setFilteredTracks(filtered);
  };

  const handleDelete = async (trackId) => {
    if (window.confirm(t('adminSidebar.tracks.confirmDelete'))) {
      try {
        await apiMethods.delete(`/schools/tracks/${trackId}/`);
        toast.success(t('adminSidebar.tracks.deleteSuccess'));
        fetchTracks();
      } catch (error) {
        console.error('Error deleting track:', error);
        toast.error(t('common.error') + ': ' + error.message);
      }
    }
  };

  const toggleTrackStatus = async (track) => {
    try {
      await apiMethods.patch(`/schools/tracks/${track.id}/`, {
        is_active: !track.is_active
      });
      toast.success(t('adminSidebar.tracks.statusUpdated'));
      fetchTracks();
    } catch (error) {
      console.error('Error updating track status:', error);
      toast.error(t('common.error') + ': ' + error.message);
    }
  };

  const breadcrumbs = [
    { label: t('adminSidebar.academicManagement.title'), href: '/admin' },
    { label: t('adminSidebar.academicManagement.tracks'), href: '/admin/academic-management/tracks' }
  ];

  // Show loading screen if translations aren't ready yet
  if (!ready) {
    return (
      <AdminPageLayout
        title="Loading..."
        breadcrumbs={[]}
      >
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p>Loading translations...</p>
          </div>
        </div>
      </AdminPageLayout>
    );
  }

  return (
    <AdminPageLayout
      title={t('adminSidebar.academicManagement.tracks')}
      breadcrumbs={breadcrumbs}
    >
      <div className="space-y-6">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          <StatCard
            icon={GitBranch}
            label={t('adminSidebar.tracks.totalTracks')}
            value={totalTracks}
            colorClass="text-blue-600 dark:text-blue-400"
            description={t('adminSidebar.tracks.allTracksDescription')}
            glowColor="blue"
          />
          <StatCard
            icon={Target}
            label={t('adminSidebar.tracks.activeTracks')}
            value={activeTracks}
            colorClass="text-green-600 dark:text-green-400"
            description={t('adminSidebar.tracks.activeTracksDescription')}
            glowColor="green"
          />
          <StatCard
            icon={Users}
            label={t('adminSidebar.tracks.totalClasses')}
            value={totalClasses}
            colorClass="text-purple-600 dark:text-purple-400"
            description={t('adminSidebar.tracks.classesInTracks')}
            glowColor="purple"
          />
        </div>

        {/* Actions and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder={t('adminSidebar.tracks.searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-full sm:w-64"
              />
            </div>

            <Select value={gradeFilter} onValueChange={setGradeFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder={t('adminSidebar.tracks.filterByGrade')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('common.all')}</SelectItem>
                {grades.map((grade) => (
                  <SelectItem key={grade.id} value={grade.id.toString()}>
                    {getLocalizedGradeName(grade)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder={t('common.status')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('common.all')}</SelectItem>
                <SelectItem value="active">{t('common.active')}</SelectItem>
                <SelectItem value="inactive">{t('common.inactive')}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            onClick={() => navigate('/admin/academic-management/tracks/add')}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 w-full sm:w-auto"
          >
            <Plus className="mr-2 h-4 w-4" />
            {t('adminSidebar.tracks.addTrack')}
          </Button>
        </div>

        {/* Tracks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-muted rounded-lg h-48"></div>
              </div>
            ))
          ) : filteredTracks.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <GitBranch className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium text-muted-foreground mb-2">
                {t('adminSidebar.tracks.noTracksFound')}
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                {t('adminSidebar.tracks.noTracksDescription')}
              </p>
              <Button onClick={() => navigate('/admin/academic-management/tracks/add')}>
                <Plus className="mr-2 h-4 w-4" />
                {t('adminSidebar.tracks.addFirstTrack')}
              </Button>
            </div>
          ) : (
            filteredTracks.map((track) => (
              <GlowingCard key={track.id} glowColor="blue">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1 flex-1">
                      <CardTitle className="text-lg font-semibold line-clamp-1">
                        {getLocalizedTrackName(track)}
                      </CardTitle>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="text-xs">
                          {track.code}
                        </Badge>
                        <Badge variant={track.is_active ? "default" : "secondary"}>
                          {track.is_active ? t('common.active') : t('common.inactive')}
                        </Badge>
                      </div>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => navigate(`/admin/academic-management/tracks/${track.id}`)}>
                          <Eye className="mr-2 h-4 w-4" />
                          {t('common.view')}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => navigate(`/admin/academic-management/tracks/${track.id}/edit`)}>
                          <Edit className="mr-2 h-4 w-4" />
                          {t('common.edit')}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toggleTrackStatus(track)}>
                          <Target className="mr-2 h-4 w-4" />
                          {track.is_active ? t('adminSidebar.tracks.deactivate') : t('adminSidebar.tracks.activate')}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleDelete(track.id)}
                          className="text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          {t('common.delete')}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <BookOpen className="mr-2 h-4 w-4" />
                      <span>{getLocalizedTrackGradeName(track)}</span>
                    </div>

                    <div className="flex items-center text-sm text-muted-foreground">
                      <Users className="mr-2 h-4 w-4" />
                      <span>{track.classes_count || 0} {t('adminSidebar.tracks.classes')}</span>
                    </div>

                    {track.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {i18n.language === 'ar' && track.description_arabic ? track.description_arabic :
                         i18n.language === 'fr' && track.description_french ? track.description_french :
                         track.description}
                      </p>
                    )}
                  </div>
                </CardContent>
              </GlowingCard>
            ))
          )}
        </div>
      </div>
    </AdminPageLayout>
  );
};

export default TracksPage;
