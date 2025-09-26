import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import i18n from '../../lib/i18n';
import { motion, useInView, useMotionValue, useSpring, animate } from 'framer-motion';
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
  Target,
  Brain,
  Trophy,
  Star,
  PlayCircle
} from 'lucide-react';
import AdminPageLayout from '../../components/admin/layout/AdminPageLayout';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '../../components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import { exerciseService } from '../../services/exercises';
import lessonsService from '../../services/lessons';
import schoolsService from '../../services/schools';
import { toast } from 'sonner';

// Helper function to get localized exercise title
const getLocalizedExerciseTitle = (exercise) => {
  const currentLanguage = i18n.language;
  switch (currentLanguage) {
    case 'ar':
      return exercise.title_arabic || exercise.title;
    case 'fr':
      return exercise.title_french || exercise.title;
    default:
      return exercise.title;
  }
};

// Animated counter component
const AnimatedCounter = ({ value, duration = 2000 }) => {
  const ref = useRef(null);
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, { duration });
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      animate(motionValue, value, { duration });
    }
  }, [isInView, motionValue, value, duration]);

  useEffect(() => {
    springValue.on('change', (latest) => {
      if (ref.current) {
        ref.current.textContent = Math.floor(latest);
      }
    });
  }, [springValue]);

  return <span ref={ref}>0</span>;
};

const ExercisesManagementPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [exercises, setExercises] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [exerciseToDelete, setExerciseToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [gradeFilter, setGradeFilter] = useState('all');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [formatFilter, setFormatFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Statistics
  const [stats, setStats] = useState({
    totalExercises: 0,
    activeExercises: 0,
    completions: 0,
    averageScore: 0
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch exercises
      const exercisesResult = await exerciseService.getExercises();
      if (exercisesResult.success) {
        setExercises(exercisesResult.data);

        // Calculate statistics
        const totalExercises = exercisesResult.data.length;
        const activeExercises = exercisesResult.data.filter(ex => ex.is_active && ex.is_published).length;
        const completions = exercisesResult.data.reduce((sum, ex) => sum + (ex.completion_count || 0), 0);
        const averageScore = exercisesResult.data.reduce((sum, ex) => sum + (ex.average_score || 0), 0) / totalExercises || 0;

        setStats({
          totalExercises,
          activeExercises,
          completions,
          averageScore: Math.round(averageScore)
        });
      }

      // Fetch lessons for filtering
      const lessonsResult = await lessonsService.getLessons();
      if (lessonsResult.success) {
        setLessons(lessonsResult.data);
      }

      // Fetch subjects and grades
      const [subjectsResult, gradesResult] = await Promise.all([
        schoolsService.getSubjects(),
        schoolsService.getGrades()
      ]);

      if (subjectsResult.success) setSubjects(subjectsResult.data);
      if (gradesResult.success) setGrades(gradesResult.data);

    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error(t('common.error'));
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteExercise = async () => {
    if (!exerciseToDelete) return;

    try {
      const result = await exerciseService.deleteExercise(exerciseToDelete.id);
      if (result.success) {
        toast.success(t('exercises.deleteSuccess'));
        await fetchData();
        setDeleteDialogOpen(false);
        setExerciseToDelete(null);
      } else {
        toast.error(result.error || t('exercises.deleteError'));
      }
    } catch (error) {
      console.error('Error deleting exercise:', error);
      toast.error(t('exercises.deleteError'));
    }
  };

  const getDifficultyBadgeVariant = (difficulty) => {
    switch (difficulty) {
      case 'beginner': return 'success';
      case 'intermediate': return 'warning';
      case 'advanced': return 'destructive';
      case 'expert': return 'secondary';
      default: return 'outline';
    }
  };

  const getFormatIcon = (format) => {
    switch (format) {
      case 'qcm_only': return <Target className="h-4 w-4" />;
      case 'open_only': return <FileText className="h-4 w-4" />;
      case 'practical': return <Brain className="h-4 w-4" />;
      case 'interactive': return <PlayCircle className="h-4 w-4" />;
      default: return <BookOpen className="h-4 w-4" />;
    }
  };

  // Filter exercises
  const filteredExercises = exercises.filter(exercise => {
    const matchesSearch = getLocalizedExerciseTitle(exercise).toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exercise.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = subjectFilter === 'all' || exercise.lesson?.subject?.id?.toString() === subjectFilter;
    const matchesGrade = gradeFilter === 'all' || exercise.lesson?.subject?.grade?.id?.toString() === gradeFilter;
    const matchesDifficulty = difficultyFilter === 'all' || exercise.difficulty_level === difficultyFilter;
    const matchesFormat = formatFilter === 'all' || exercise.exercise_format === formatFilter;
    const matchesStatus = statusFilter === 'all' ||
                         (statusFilter === 'active' && exercise.is_active && exercise.is_published) ||
                         (statusFilter === 'inactive' && (!exercise.is_active || !exercise.is_published));

    return matchesSearch && matchesSubject && matchesGrade && matchesDifficulty && matchesFormat && matchesStatus;
  });

  if (loading) {
    return (
      <AdminPageLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">{t('common.loadingData')}</p>
          </div>
        </div>
      </AdminPageLayout>
    );
  }

  return (
    <AdminPageLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">{t('exercises.management.title')}</h1>
            <p className="text-muted-foreground">{t('exercises.management.description')}</p>
          </div>
          <Button onClick={() => navigate('add')} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            {t('exercises.addNew')}
          </Button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t('exercises.stats.total')}</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  <AnimatedCounter value={stats.totalExercises} />
                </div>
                <p className="text-xs text-muted-foreground">{t('exercises.stats.totalDescription')}</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t('exercises.stats.active')}</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  <AnimatedCounter value={stats.activeExercises} />
                </div>
                <p className="text-xs text-muted-foreground">{t('exercises.stats.activeDescription')}</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t('exercises.stats.completions')}</CardTitle>
                <Trophy className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">
                  <AnimatedCounter value={stats.completions} />
                </div>
                <p className="text-xs text-muted-foreground">{t('exercises.stats.completionsDescription')}</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t('exercises.stats.averageScore')}</CardTitle>
                <Star className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  <AnimatedCounter value={stats.averageScore} />%
                </div>
                <p className="text-xs text-muted-foreground">{t('exercises.stats.averageScoreDescription')}</p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              {t('common.searchAndFilter')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
              <div>
                <Input
                  placeholder={t('exercises.searchPlaceholder')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                />
              </div>

              <Select value={subjectFilter} onValueChange={setSubjectFilter}>
                <SelectTrigger>
                  <SelectValue placeholder={t('exercises.filters.subject')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('exercises.filters.allSubjects')}</SelectItem>
                  {subjects.map(subject => (
                    <SelectItem key={subject.id} value={subject.id.toString()}>
                      {subject.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={gradeFilter} onValueChange={setGradeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder={t('exercises.filters.grade')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('exercises.filters.allGrades')}</SelectItem>
                  {grades.map(grade => (
                    <SelectItem key={grade.id} value={grade.id.toString()}>
                      {grade.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
                <SelectTrigger>
                  <SelectValue placeholder={t('exercises.filters.difficulty')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('exercises.filters.allDifficulties')}</SelectItem>
                  <SelectItem value="beginner">{t('exercises.difficulty.beginner')}</SelectItem>
                  <SelectItem value="intermediate">{t('exercises.difficulty.intermediate')}</SelectItem>
                  <SelectItem value="advanced">{t('exercises.difficulty.advanced')}</SelectItem>
                  <SelectItem value="expert">{t('exercises.difficulty.expert')}</SelectItem>
                </SelectContent>
              </Select>

              <Select value={formatFilter} onValueChange={setFormatFilter}>
                <SelectTrigger>
                  <SelectValue placeholder={t('exercises.filters.format')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('exercises.filters.allFormats')}</SelectItem>
                  <SelectItem value="mixed">{t('exercises.format.mixed')}</SelectItem>
                  <SelectItem value="qcm_only">{t('exercises.format.qcmOnly')}</SelectItem>
                  <SelectItem value="open_only">{t('exercises.format.openOnly')}</SelectItem>
                  <SelectItem value="practical">{t('exercises.format.practical')}</SelectItem>
                  <SelectItem value="interactive">{t('exercises.format.interactive')}</SelectItem>
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder={t('exercises.filters.status')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t('common.allStatus')}</SelectItem>
                  <SelectItem value="active">{t('exercises.status.active')}</SelectItem>
                  <SelectItem value="inactive">{t('exercises.status.inactive')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Exercises List */}
        <Card>
          <CardHeader>
            <CardTitle>{t('exercises.list.title')} ({filteredExercises.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredExercises.length === 0 ? (
              <div className="text-center py-8">
                <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">{t('exercises.list.empty')}</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredExercises.map((exercise, index) => (
                  <motion.div
                    key={exercise.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          {getFormatIcon(exercise.exercise_format)}
                          <h3 className="text-lg font-semibold">{getLocalizedExerciseTitle(exercise)}</h3>
                          <Badge variant={getDifficultyBadgeVariant(exercise.difficulty_level)}>
                            {t(`exercises.difficulty.${exercise.difficulty_level}`)}
                          </Badge>
                          <Badge variant={exercise.is_active && exercise.is_published ? 'default' : 'secondary'}>
                            {exercise.is_active && exercise.is_published ? t('exercises.status.active') : t('exercises.status.inactive')}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground mb-3">
                          <div className="flex items-center gap-1">
                            <GraduationCap className="h-4 w-4" />
                            <span>{exercise.lesson?.title || t('exercises.noLesson')}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>{exercise.estimated_duration ? `${exercise.estimated_duration} ${t('common.minutes')}` : t('exercises.noTimeLimit')}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            <span>{exercise.completion_count || 0} {t('exercises.completions')}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <TrendingUp className="h-4 w-4" />
                            <span>{Math.round(exercise.average_score || 0)}% {t('exercises.avgScore')}</span>
                          </div>
                        </div>

                        {exercise.description && (
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {exercise.description}
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
                          <DropdownMenuItem onClick={() => navigate(`view/${exercise.id}`)}>
                            <Eye className="h-4 w-4 mr-2" />
                            {t('common.view')}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => navigate(`edit/${exercise.id}`)}>
                            <Edit className="h-4 w-4 mr-2" />
                            {t('common.edit')}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => {
                              setExerciseToDelete(exercise);
                              setDeleteDialogOpen(true);
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
              </div>
            )}
          </CardContent>
        </Card>

        {/* Delete Dialog */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t('exercises.deleteDialog.title')}</DialogTitle>
              <DialogDescription>
                {t('exercises.deleteDialog.description', { title: exerciseToDelete ? getLocalizedExerciseTitle(exerciseToDelete) : '' })}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                {t('common.cancel')}
              </Button>
              <Button variant="destructive" onClick={handleDeleteExercise}>
                {t('common.delete')}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminPageLayout>
  );
};

export default ExercisesManagementPage;