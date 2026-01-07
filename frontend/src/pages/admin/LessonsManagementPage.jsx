import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import i18n from '../../lib/i18n';
import { motion as Motion, useInView, useMotionValue, useSpring, animate } from 'framer-motion';
import {
  Plus,
  Search,
  Filter,
  BookOpen,
  GraduationCap,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Users,
  TrendingUp,
  Sparkles,
  Award,
  FileText,
  Clock,
  Target
} from 'lucide-react';
import AdminPageLayout from '../../components/admin/layout/AdminPageLayout';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '../../components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import lessonsService from '../../services/lessons';
import schoolsService from '../../services/schools';
import { toast } from 'sonner';
import { getLocalizedName, getLocalizedTitle } from '@/lib/utils';


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
  <Motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ y: -5, transition: { duration: 0.2 } }}
    className={`relative group ${className}`}
  >
    <div className={`absolute -inset-0.5 bg-gradient-to-r from-${glowColor}-500 to-purple-600 rounded-lg blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200`}></div>
    <div className="relative bg-card border rounded-xl backdrop-blur-sm">
      {children}
    </div>
  </Motion.div>
)

const StatCard = ({ icon: CardIcon, label, value, colorClass, description, glowColor }) => (
  <GlowingCard glowColor={glowColor}>
    <CardContent className="p-4 sm:p-6">
      <div className="flex items-center space-x-3 sm:space-x-4">
        <Motion.div
          className={`p-2 sm:p-3 rounded-full bg-gradient-to-br from-${glowColor}-500 to-${glowColor}-600 text-white shadow-lg flex-shrink-0`}
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <CardIcon className="h-5 w-5 sm:h-6 sm:w-6" />
        </Motion.div>
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

const LessonsManagementPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // State management
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('all');
  const [selectedTrack, setSelectedTrack] = useState('all');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedCycle, setSelectedCycle] = useState('all');
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Options data
  const [subjects, setSubjects] = useState([]);
  const [grades, setGrades] = useState([]);
  const [tracks, setTracks] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    firstCycle: 0,
    secondCycle: 0
  });

  // Load initial data
  useEffect(() => {
    loadData();
    loadGrades();
    loadSubjects();
  }, [loadData, loadGrades, loadSubjects]);

  // Load tracks when grade changes
  useEffect(() => {
    if (selectedGrade !== 'all') {
      loadTracksForGrade(selectedGrade);
    } else {
      setTracks([]);
      setSelectedTrack('all');
    }
  }, [selectedGrade, loadTracksForGrade]);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        search: searchTerm || undefined,
        grade: selectedGrade !== 'all' ? selectedGrade : undefined,
        tracks: selectedTrack !== 'all' ? selectedTrack : undefined,
        subject: selectedSubject !== 'all' ? selectedSubject : undefined,
        cycle: selectedCycle !== 'all' ? selectedCycle : undefined,
      };

      const response = await lessonsService.getLessons(params);
      setLessons(response.results || response);
      setTotalPages(Math.ceil((response.count || response.length) / 20));

      // Calculate stats
      const totalLessons = response.count || response.length;
      const activeLessons = (response.results || response).filter(lesson => lesson.is_active).length;
      const firstCycleLessons = (response.results || response).filter(lesson => lesson.cycle === 'first').length;
      const secondCycleLessons = (response.results || response).filter(lesson => lesson.cycle === 'second').length;

      setStats({
        total: totalLessons,
        active: activeLessons,
        firstCycle: firstCycleLessons,
        secondCycle: secondCycleLessons
      });
    } catch (error) {
      console.error('Error loading lessons:', error);
      toast.error(t('error.loadingData'));
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchTerm, selectedGrade, selectedTrack, selectedSubject, selectedCycle, t]);

  const loadGrades = useCallback(async () => {
    try {
      const gradesRes = await schoolsService.getGrades();
      setGrades(gradesRes.results || gradesRes);
    } catch (error) {
      console.error('Error loading grades:', error);
      toast.error(t('error.loadingData'));
    }
  }, [t]);

  const loadTracksForGrade = useCallback(async (gradeId) => {
    try {
      const tracksRes = await schoolsService.getTracksForGrade(gradeId);
      setTracks(tracksRes.results || tracksRes);
    } catch (error) {
      console.error('Error loading tracks:', error);
      toast.error(t('error.loadingData'));
    }
  }, [t]);

  const loadSubjects = useCallback(async () => {
    try {
      const subjectsRes = await schoolsService.getSubjects();
      setSubjects(subjectsRes.results || subjectsRes);
    } catch (error) {
      console.error('Error loading subjects:', error);
      toast.error(t('error.loadingData'));
    }
  }, [t]);

  const handleEdit = (lesson) => {
    navigate(`/admin/education-management/lessons/${lesson.id}/edit`);
  };

  const handleDelete = async () => {
    try {
      await lessonsService.deleteLesson(selectedLesson.id);
      toast.success(t('lessons.deleteSuccess'));
      setShowDeleteDialog(false);
      setSelectedLesson(null);
      loadData();
    } catch (error) {
      console.error('Error deleting lesson:', error);
      toast.error(t('lessons.deleteError'));
    }
  };

  const toggleLessonStatus = async (lesson) => {
    try {
      await lessonsService.patchLesson(lesson.id, { is_active: !lesson.is_active });
      toast.success(t('lessons.statusUpdateSuccess'));
      loadData();
    } catch (error) {
      console.error('Error updating lesson status:', error);
      toast.error(t('lessons.statusUpdateError'));
    }
  };


  const cycleOptions = [
    { value: 'first', label: t('lessons.firstCycle') },
    { value: 'second', label: t('lessons.secondCycle') }
  ];

  return (
    <AdminPageLayout
      title={t('lessons.management')}
      subtitle={t('lessons.managementSubtitle')}
    >
      <div className="space-y-6">
        {/* Statistics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            icon={BookOpen}
            label={t('lessons.totalLessons')}
            value={stats.total}
            colorClass="text-blue-600"
            description={t('lessons.totalDescription')}
            glowColor="blue"
          />
          <StatCard
            icon={CheckCircle}
            label={t('lessons.activeLessons')}
            value={stats.active}
            colorClass="text-green-600"
            description={t('lessons.activeDescription')}
            glowColor="green"
          />
          <StatCard
            icon={Target}
            label={t('lessons.firstCycle')}
            value={stats.firstCycle}
            colorClass="text-purple-600"
            description={t('lessons.firstCycleDescription')}
            glowColor="purple"
          />
          <StatCard
            icon={Award}
            label={t('lessons.secondCycle')}
            value={stats.secondCycle}
            colorClass="text-orange-600"
            description={t('lessons.secondCycleDescription')}
            glowColor="orange"
          />
        </div>

        {/* Filters and Actions */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
              <div className="flex-1 space-y-4 sm:space-y-0 sm:flex sm:gap-4">
                <div className="flex-1 min-w-0">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      placeholder={t('lessons.searchPlaceholder')}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="flex gap-2 flex-wrap">
                  <Select value={selectedGrade} onValueChange={(value) => {
                    setSelectedGrade(value);
                    setSelectedTrack('all'); // Reset track when grade changes
                  }}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder={t('lessons.allGrades')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t('lessons.allGrades')}</SelectItem>
                      {grades.map((grade) => (
                        <SelectItem key={grade.id} value={grade.id.toString()}>
                          {getLocalizedName(grade, i18n.language)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select
                    value={selectedTrack}
                    onValueChange={setSelectedTrack}
                    disabled={selectedGrade === 'all'}
                  >
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder={t('lessons.allTracks')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t('lessons.allTracks')}</SelectItem>
                      {tracks.map((track) => (
                        <SelectItem key={track.id} value={track.id.toString()}>
                          {getLocalizedName(track, i18n.language)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder={t('lessons.allSubjects')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t('lessons.allSubjects')}</SelectItem>
                      {subjects.map((subject) => (
                        <SelectItem key={subject.id} value={subject.id.toString()}>
                          {getLocalizedName(subject, i18n.language)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={selectedCycle} onValueChange={setSelectedCycle}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder={t('lessons.allCycles')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t('lessons.allCycles')}</SelectItem>
                      {cycleOptions.map((cycle) => (
                        <SelectItem key={cycle.value} value={cycle.value}>
                          {cycle.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button onClick={() => navigate('/admin/education-management/lessons/create')} className="shrink-0">
                <Plus className="h-4 w-4 mr-2" />
                {t('lessons.createLesson')}
              </Button>
            </div>
          </CardHeader>
        </Card>

        {/* Lessons List */}
        <Card>
          <CardHeader>
            <CardTitle>{t('lessons.list')}</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : lessons.length === 0 ? (
              <div className="text-center py-8">
                <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">{t('lessons.noLessons')}</p>
              </div>
            ) : (
              <div className="space-y-4">
                {lessons.map((lesson) => (
                  <motion.div
                    key={lesson.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold text-lg">{getLocalizedTitle(lesson, i18n.language)}</h3>
                          <Badge
                            variant={lesson.is_active ? "success" : "secondary"}
                            className="shrink-0"
                          >
                            {lesson.is_active ? t('common.active') : t('common.inactive')}
                          </Badge>
                          <Badge variant="outline" className="shrink-0">
                            {lesson.cycle_display}
                          </Badge>
                          <Badge variant="outline" className="shrink-0">
                            {lesson.difficulty_display}
                          </Badge>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <GraduationCap className="h-4 w-4" />
                            {getLocalizedName(lesson.subject_details, i18n.language) || lesson.subject_name}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            {getLocalizedName(lesson.grade_details, i18n.language) || lesson.grade_name}
                          </span>
                          {lesson.tracks && lesson.tracks.length > 0 && (
                            <span className="flex items-center gap-1">
                              <Award className="h-4 w-4" />
                              {lesson.tracks.map(t => getLocalizedName(t, i18n.language)).join(', ')}
                            </span>
                          )}
                          <span className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {t('lessons.order')}: {lesson.order}
                          </span>
                          <span className="flex items-center gap-1">
                            <FileText className="h-4 w-4" />
                            {lesson.resources?.length || 0} {t('lessons.resources')}
                          </span>
                          <span className="flex items-center gap-1">
                            <Target className="h-4 w-4" />
                            {lesson.exercise_count || 0} {t('lessons.exercises')}
                          </span>
                        </div>

                        {lesson.description && (
                          <p className="text-sm text-muted-foreground">
                            {lesson.description}
                          </p>
                        )}
                      </div>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => navigate(`/admin/lessons/${lesson.id}`)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            {t('common.view')}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEdit(lesson)}>
                            <Edit className="h-4 w-4 mr-2" />
                            {t('common.edit')}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => toggleLessonStatus(lesson)}
                          >
                            {lesson.is_active ? (
                              <>
                                <XCircle className="h-4 w-4 mr-2" />
                                {t('common.deactivate')}
                              </>
                            ) : (
                              <>
                                <CheckCircle className="h-4 w-4 mr-2" />
                                {t('common.activate')}
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedLesson(lesson);
                              setShowDeleteDialog(true);
                            }}
                            className="text-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            {t('common.delete')}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </motion.div>
                ))}

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center gap-2 mt-6">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                    >
                      {t('common.previous')}
                    </Button>
                    <span className="px-4 py-2 text-sm text-muted-foreground">
                      {t('common.pageOf', { current: currentPage, total: totalPages })}
                    </span>
                    <Button
                      variant="outline"
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                    >
                      {t('common.next')}
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>


        {/* Delete Confirmation Dialog */}
        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t('lessons.confirmDelete')}</DialogTitle>
              <DialogDescription>
                {t('lessons.deleteDescription', { title: selectedLesson ? getLocalizedTitle(selectedLesson, i18n.language) : '' })}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowDeleteDialog(false);
                  setSelectedLesson(null);
                }}
              >
                {t('common.cancel')}
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
              >
                {t('common.delete')}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminPageLayout>
  );
};

export default LessonsManagementPage;