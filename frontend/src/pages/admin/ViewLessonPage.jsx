import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import i18n from '../../lib/i18n';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  BookOpen,
  GraduationCap,
  Users,
  Clock,
  Target,
  Award,
  CheckCircle,
  XCircle,
  FileText,
  Download,
  ExternalLink,
  Edit,
  Trash2,
  Share2,
  Star,
  Calendar,
  User,
  Tags,
  Eye,
  Play,
  Image as ImageIcon,
  FileAudio,
  FileVideo,
  File,
  Link,
  Plus,
  HelpCircle,
  Trophy,
  Clock2,
  BarChart3,
  CheckSquare,
  Brain
} from 'lucide-react';
import AdminPageLayout from '../../components/admin/layout/AdminPageLayout';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Separator } from '../../components/ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../../components/ui/dialog';
import lessonsService from '../../services/lessons';
import { exerciseService } from '../../services/exercises';
import { toast } from 'sonner';

const getLocalizedLessonTitle = (lesson) => {
  const currentLanguage = i18n.language;
  switch (currentLanguage) {
    case 'ar':
      return lesson.title_arabic || lesson.title;
    case 'fr':
      return lesson.title_french || lesson.title;
    default:
      return lesson.title;
  }
};

const getResourceIcon = (resourceType) => {
  switch (resourceType) {
    case 'pdf':
      return File;
    case 'video':
      return FileVideo;
    case 'audio':
      return FileAudio;
    case 'image':
      return ImageIcon;
    case 'link':
      return Link;
    case 'presentation':
      return FileText;
    default:
      return File;
  }
};

const ViewLessonPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  // State management
  const [lesson, setLesson] = useState(null);
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [exercisesLoading, setExercisesLoading] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // Load lesson data
  useEffect(() => {
    if (id) {
      loadLesson();
    }
  }, [id]);

  const loadLesson = async () => {
    try {
      setLoading(true);
      const response = await lessonsService.getLessonById(id);
      setLesson(response);
      // Load exercises for this lesson
      loadExercises();
    } catch (error) {
      console.error('Error loading lesson:', error);
      toast.error(t('error.loadingData'));
      navigate('/admin/education-management/lessons');
    } finally {
      setLoading(false);
    }
  };

  const loadExercises = async () => {
    try {
      setExercisesLoading(true);
      const response = await exerciseService.getExercisesByLesson(id);
      if (response.success) {
        setExercises(response.data);
      }
    } catch (error) {
      console.error('Error loading exercises:', error);
    } finally {
      setExercisesLoading(false);
    }
  };

  const handleEdit = () => {
    navigate(`/admin/education-management/lessons/${id}/edit`);
  };

  const handleDelete = async () => {
    try {
      await lessonsService.deleteLesson(id);
      toast.success(t('lessons.deleteSuccess'));
      setShowDeleteDialog(false);
      navigate('/admin/education-management/lessons');
    } catch (error) {
      console.error('Error deleting lesson:', error);
      toast.error(t('lessons.deleteError'));
    }
  };

  const toggleLessonStatus = async () => {
    try {
      await lessonsService.patchLesson(id, { is_active: !lesson.is_active });
      toast.success(t('lessons.statusUpdateSuccess'));
      setLesson(prev => ({ ...prev, is_active: !prev.is_active }));
    } catch (error) {
      console.error('Error updating lesson status:', error);
      toast.error(t('lessons.statusUpdateError'));
    }
  };

  const handleResourceClick = (resource) => {
    if (resource.file_url || resource.external_url) {
      window.open(resource.file_url || resource.external_url, '_blank');
    }
  };

  const handleDownloadResource = (resource) => {
    if (resource.file_url && resource.is_downloadable) {
      const link = document.createElement('a');
      link.href = resource.file_url;
      link.download = resource.title;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleAddResource = () => {
    // Navigate to add resource page or open modal
    // For now, we'll add a placeholder action
    toast.info(t('lessons.addResourcePlaceholder', 'Add Resource functionality will be implemented soon'));
  };

  const handleAddExercise = () => {
    navigate(`/admin/education-management/exercises/add?lesson=${id}`);
  };

  const handleViewExercise = (exerciseId) => {
    navigate(`/admin/education-management/exercises/view/${exerciseId}`);
  };

  const handleEditExercise = (exerciseId) => {
    navigate(`/admin/education-management/exercises/edit/${exerciseId}`);
  };

  const getDifficultyBadgeColor = (difficulty) => {
    const colors = {
      beginner: 'bg-green-100 text-green-800',
      intermediate: 'bg-yellow-100 text-yellow-800',
      advanced: 'bg-orange-100 text-orange-800',
      expert: 'bg-red-100 text-red-800'
    };
    return colors[difficulty] || colors.beginner;
  };

  if (loading) {
    return (
      <AdminPageLayout
        title={t('lessons.viewLesson')}
        subtitle={t('lessons.loading')}
      >
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </AdminPageLayout>
    );
  }

  if (!lesson) {
    return (
      <AdminPageLayout
        title={t('lessons.viewLesson')}
        subtitle={t('lessons.notFound')}
      >
        <div className="text-center py-12">
          <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">{t('lessons.notFound')}</h3>
          <p className="text-muted-foreground mb-4">{t('lessons.notFoundDescription')}</p>
          <Button onClick={() => navigate('/admin/education-management/lessons')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t('common.backToList')}
          </Button>
        </div>
      </AdminPageLayout>
    );
  }

  return (
    <AdminPageLayout
      title={getLocalizedLessonTitle(lesson)}
      subtitle={`${lesson.subject_name} - ${lesson.grade_name}`}
      actions={[
        <Button
          key="back"
          variant="outline"
          onClick={() => navigate('/admin/education-management/lessons')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t('common.back')}
        </Button>,
        <Button key="edit" variant="outline" onClick={handleEdit}>
          <Edit className="h-4 w-4 mr-2" />
          {t('common.edit')}
        </Button>,
        <Button
          key="toggle"
          variant={lesson.is_active ? "destructive" : "default"}
          onClick={toggleLessonStatus}
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
        </Button>
      ]}
    >
      <div className="space-y-6">
        {/* Lesson Header */}
        <Card>
          <CardHeader>
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
              <div className="flex-1 space-y-4">
                <div className="flex flex-wrap items-center gap-3">
                  <h1 className="text-2xl font-bold">{getLocalizedLessonTitle(lesson)}</h1>
                  <Badge
                    variant={lesson.is_active ? "success" : "secondary"}
                    className="shrink-0"
                  >
                    {lesson.is_active ? t('common.active') : t('common.inactive')}
                  </Badge>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <GraduationCap className="h-4 w-4" />
                    {lesson.subject_name}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {lesson.grade_name}
                  </span>
                  {lesson.tracks && lesson.tracks.length > 0 && (
                    <div className="flex flex-wrap items-center gap-2">
                      <Tags className="h-4 w-4" />
                      {lesson.tracks.map(track => (
                        <Badge key={track.id} variant="outline">{track.name}</Badge>
                      ))}
                    </div>
                  )}
                  <span className="flex items-center gap-1">
                    <Target className="h-4 w-4" />
                    {lesson.cycle_display}
                  </span>
                  <span className="flex items-center gap-1">
                    <Award className="h-4 w-4" />
                    {lesson.difficulty_display}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {t('lessons.order')}: {lesson.order}
                  </span>
                </div>

                {lesson.description && (
                  <p className="text-muted-foreground">{lesson.description}</p>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowDeleteDialog(true)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  {t('common.delete')}
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Lesson Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Learning Objectives */}
            {lesson.objectives && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    {t('lessons.objectives')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-sm max-w-none">
                    <p className="whitespace-pre-wrap">{lesson.objectives}</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Prerequisites */}
            {lesson.prerequisites && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    {t('lessons.prerequisites')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-sm max-w-none">
                    <p className="whitespace-pre-wrap">{lesson.prerequisites}</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Resources */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    {t('lessons.resources')} ({lesson.resources?.length || 0})
                  </CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleAddResource}
                    className="flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    {t('lessons.addResource')}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {lesson.resources && lesson.resources.length > 0 ? (
                  <div className="space-y-3">
                    {lesson.resources.map((resource) => {
                      const ResourceIcon = getResourceIcon(resource.resource_type);
                      return (
                        <motion.div
                          key={resource.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              <div className="flex-shrink-0">
                                <ResourceIcon className="h-8 w-8 text-primary" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium truncate">{resource.title}</h4>
                                {resource.description && (
                                  <p className="text-sm text-muted-foreground truncate">
                                    {resource.description}
                                  </p>
                                )}
                                <div className="flex items-center gap-2 mt-1">
                                  <Badge variant="outline" className="text-xs">
                                    {resource.resource_type}
                                  </Badge>
                                  {resource.file_size && (
                                    <span className="text-xs text-muted-foreground">
                                      {Math.round(resource.file_size / 1024)} KB
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {resource.is_visible_to_students && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleResourceClick(resource)}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                              )}
                              {resource.is_downloadable && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDownloadResource(resource)}
                                >
                                  <Download className="h-4 w-4" />
                                </Button>
                              )}
                              {resource.external_url && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => window.open(resource.external_url, '_blank')}
                                >
                                  <ExternalLink className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-4">{t('lessons.noResources')}</p>
                    <Button
                      variant="outline"
                      onClick={handleAddResource}
                      className="flex items-center gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      {t('lessons.addFirstResource')}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Exercises */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5" />
                    {t('lessons.exercises') || 'Exercises'} ({exercises.length})
                  </CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleAddExercise}
                    className="flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    {t('exercises.addExercise') || 'Add Exercise'}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {exercisesLoading ? (
                  <div className="flex justify-center items-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    <span className="ml-2">Loading exercises...</span>
                  </div>
                ) : exercises.length > 0 ? (
                  <div className="space-y-4">
                    {exercises.map((exercise) => (
                      <div
                        key={exercise.id}
                        className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="font-medium truncate">{exercise.title}</h4>
                              <Badge
                                variant="outline"
                                className={getDifficultyBadgeColor(exercise.difficulty_level)}
                              >
                                {exercise.difficulty_level}
                              </Badge>
                              <Badge variant={exercise.is_published ? "default" : "secondary"}>
                                {exercise.is_published ? (t('common.published') || 'Published') : (t('common.draft') || 'Draft')}
                              </Badge>
                            </div>
                            {exercise.description && (
                              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                                {exercise.description}
                              </p>
                            )}
                            <div className="flex items-center gap-4 text-xs text-muted-foreground">
                              {exercise.estimated_duration && (
                                <span className="flex items-center gap-1">
                                  <Clock2 className="h-3 w-3" />
                                  {exercise.estimated_duration} min
                                </span>
                              )}
                              <span className="flex items-center gap-1">
                                <HelpCircle className="h-3 w-3" />
                                {exercise.questions?.length || 0} questions
                              </span>
                              <span className="flex items-center gap-1">
                                <Trophy className="h-3 w-3" />
                                {exercise.total_points || 0} points
                              </span>
                              {exercise.completion_count > 0 && (
                                <span className="flex items-center gap-1">
                                  <CheckSquare className="h-3 w-3" />
                                  {exercise.completion_count} completions
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewExercise(exercise.id)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditExercise(exercise.id)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Brain className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-4">{t('lessons.noExercises') || 'No exercises created for this lesson yet.'}</p>
                    <Button
                      variant="outline"
                      onClick={handleAddExercise}
                      className="flex items-center gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      {t('exercises.addFirstExercise') || 'Add First Exercise'}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Tags */}
            {lesson.tags && lesson.tags.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Tags className="h-5 w-5" />
                    {t('lessons.tags')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {lesson.tags.map((tag) => (
                      <Badge
                        key={tag.id}
                        variant="outline"
                        style={{ backgroundColor: `${tag.color}20`, borderColor: tag.color }}
                      >
                        {tag.name}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Lesson Metadata */}
            <Card>
              <CardHeader>
                <CardTitle>{t('lessons.metadata')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{t('lessons.created')}</span>
                  <div className="flex items-center gap-1 text-sm">
                    <Calendar className="h-4 w-4" />
                    {new Date(lesson.created_at).toLocaleDateString()}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{t('lessons.updated')}</span>
                  <div className="flex items-center gap-1 text-sm">
                    <Calendar className="h-4 w-4" />
                    {new Date(lesson.updated_at).toLocaleDateString()}
                  </div>
                </div>

                {lesson.created_by_name && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{t('lessons.createdBy')}</span>
                    <div className="flex items-center gap-1 text-sm">
                      <User className="h-4 w-4" />
                      {lesson.created_by_name}
                    </div>
                  </div>
                )}

                <Separator />

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{t('lessons.status')}</span>
                    <Badge variant={lesson.is_active ? "success" : "secondary"}>
                      {lesson.is_active ? t('common.active') : t('common.inactive')}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{t('lessons.cycle')}</span>
                    <Badge variant="outline">{lesson.cycle_display}</Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{t('lessons.difficulty')}</span>
                    <Badge variant="outline">{lesson.difficulty_display}</Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{t('lessons.exercises')}</span>
                    <Badge variant="outline">{exercises.length}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>{t('lessons.quickActions')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={handleEdit}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  {t('common.edit')}
                </Button>

                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={handleAddExercise}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {t('exercises.addExercise') || 'Add Exercise'}
                </Button>

                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => navigator.share && navigator.share({
                    title: getLocalizedLessonTitle(lesson),
                    url: window.location.href
                  })}
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  {t('common.share')}
                </Button>

                <Button
                  variant="outline"
                  className="w-full justify-start text-destructive hover:text-destructive"
                  onClick={() => setShowDeleteDialog(true)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  {t('common.delete')}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Delete Confirmation Dialog */}
        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t('lessons.confirmDelete')}</DialogTitle>
              <DialogDescription>
                {t('lessons.deleteDescription', { title: getLocalizedLessonTitle(lesson) })}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="gap-2">
              <Button
                variant="outline"
                onClick={() => setShowDeleteDialog(false)}
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

export default ViewLessonPage;