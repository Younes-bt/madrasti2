import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import i18n from '../../lib/i18n';
import { motion, useInView, useMotionValue, useSpring, animate } from 'framer-motion';
import { Plus, Search, Filter, GitBranch, Users, MoreVertical, Edit, Trash2, Eye, BookOpen, Target, X } from 'lucide-react';
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
            description={t('adminSidebar.tracks.allTracksDescription')}
            iconColor="text-blue-600 dark:text-blue-400"
            iconBg="bg-blue-100 dark:bg-blue-900/40"
          />
          <StatCard
            icon={Target}
            label={t('adminSidebar.tracks.activeTracks')}
            value={activeTracks}
            description={t('adminSidebar.tracks.activeTracksDescription')}
            iconColor="text-green-600 dark:text-green-400"
            iconBg="bg-green-100 dark:bg-green-900/40"
          />
          <StatCard
            icon={Users}
            label={t('adminSidebar.tracks.totalClasses')}
            value={totalClasses}
            description={t('adminSidebar.tracks.classesInTracks')}
            iconColor="text-purple-600 dark:text-purple-400"
            iconBg="bg-purple-100 dark:bg-purple-900/40"
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
                  placeholder={t('adminSidebar.tracks.searchPlaceholder')}
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

                  {/* Status Filter */}
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="h-9 w-[140px] border-border/50">
                      <SelectValue placeholder={t('common.status')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t('common.all')}</SelectItem>
                      <SelectItem value="active">{t('common.active')}</SelectItem>
                      <SelectItem value="inactive">{t('common.inactive')}</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* Active Filter Badges */}
                  {(searchQuery || gradeFilter !== 'all' || statusFilter !== 'all') && (
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
                      {statusFilter !== 'all' && (
                        <Badge
                          variant="secondary"
                          className="gap-1 px-2 py-1 cursor-pointer hover:bg-secondary/80"
                          onClick={() => setStatusFilter('all')}
                        >
                          {t(`common.${statusFilter}`)}
                          <X className="h-3 w-3 ml-1" />
                        </Badge>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSearchQuery('');
                          setGradeFilter('all');
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
                  {filteredTracks.length} {t('common.results') || 'results'}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Add Track Button */}
        <div className="flex justify-end">
          <Button
            onClick={() => navigate('/admin/academic-management/tracks/add')}
            className="gap-2"
          >
            <Plus className="h-4 w-4" />
            {t('adminSidebar.tracks.addTrack')}
          </Button>
        </div>

        {/* Tracks Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="animate-pulse">
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
        ) : filteredTracks.length === 0 ? (
          <Card className="border-dashed border-2 border-border/60">
            <CardContent className="flex flex-col items-center justify-center gap-4 py-16 text-center">
              <div className="rounded-full bg-muted p-6">
                <GitBranch className="h-12 w-12 text-muted-foreground" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-foreground">
                  {t('adminSidebar.tracks.noTracksFound')}
                </h3>
                <p className="text-sm text-muted-foreground max-w-sm">
                  {t('adminSidebar.tracks.noTracksDescription')}
                </p>
              </div>
              {(!searchQuery && gradeFilter === 'all' && statusFilter === 'all' && tracks.length === 0) && (
                <Button onClick={() => navigate('/admin/academic-management/tracks/add')} className="gap-2">
                  <Plus className="h-4 w-4" />
                  {t('adminSidebar.tracks.addFirstTrack')}
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTracks.map((track, index) => (
              <motion.div
                key={track.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="group"
              >
                <Card
                  className="h-full border-border/50 hover:border-border transition-all duration-300 hover:shadow-lg cursor-pointer"
                  onClick={() => navigate(`/admin/academic-management/tracks/${track.id}`)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-2 flex-1 min-w-0">
                        <CardTitle className="text-base font-semibold text-foreground leading-tight line-clamp-1">
                          {getLocalizedTrackName(track)}
                        </CardTitle>
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge variant="outline" className="text-xs">
                            {track.code}
                          </Badge>
                          <Badge variant={track.is_active ? "default" : "secondary"} className="text-xs">
                            {track.is_active ? t('common.active') : t('common.inactive')}
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
                              navigate(`/admin/academic-management/tracks/${track.id}/edit`);
                            }}
                            className="cursor-pointer"
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            {t('common.edit')}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleTrackStatus(track);
                            }}
                            className="cursor-pointer"
                          >
                            <Target className="mr-2 h-4 w-4" />
                            {track.is_active ? t('adminSidebar.tracks.deactivate') : t('adminSidebar.tracks.activate')}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(track.id);
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

                  <CardContent className="pt-0">
                    <div className="space-y-2.5">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <BookOpen className="mr-2 h-3.5 w-3.5 flex-shrink-0" />
                        <span className="truncate">{getLocalizedTrackGradeName(track)}</span>
                      </div>

                      <div className="flex items-center text-sm text-muted-foreground">
                        <Users className="mr-2 h-3.5 w-3.5 flex-shrink-0" />
                        <span>{track.classes_count || 0} {t('adminSidebar.tracks.classes')}</span>
                      </div>

                      {track.description && (
                        <p className="text-xs text-muted-foreground line-clamp-2 pt-1">
                          {i18n.language === 'ar' && track.description_arabic ? track.description_arabic :
                           i18n.language === 'fr' && track.description_french ? track.description_french :
                           track.description}
                        </p>
                      )}
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

export default TracksPage;
