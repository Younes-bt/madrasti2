import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import i18n from '../../lib/i18n';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
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
  Brain,
  FileCode,
  Layout,
  X,
  PlayCircle
} from 'lucide-react';
import AdminPageLayout from '../../components/admin/layout/AdminPageLayout';
import BlockRenderer from '../../components/blocks/BlockRenderer';
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
    case 'markdown':
      return FileCode;
    case 'blocks':
      return Layout;
    default:
      return File;
  }
};

// ========================================
// STUDENT PREVIEW MODAL COMPONENT
// ========================================
const StudentPreviewModal = ({ open, onClose, lesson, exercises, language }) => {
  const { t } = useTranslation();
  const isRTL = language === 'ar';

  const learningObjectives = useMemo(() => {
    if (!lesson?.objectives) return [];
    return lesson.objectives
      .split(/[\n•]/)
      .map(obj => obj.trim())
      .filter(obj => obj.length > 0);
  }, [lesson]);

  const visibleResources = useMemo(() => {
    if (!lesson?.resources) return [];
    return lesson.resources.filter((resource) => resource.is_visible_to_students !== false);
  }, [lesson]);

  const videoResources = useMemo(() => {
    return visibleResources.filter(r => r.resource_type?.toLowerCase() === 'video');
  }, [visibleResources]);

  const blocksResources = useMemo(() => {
    return visibleResources.filter(r => r.resource_type?.toLowerCase() === 'blocks');
  }, [visibleResources]);

  const otherResources = useMemo(() => {
    return visibleResources.filter(r =>
      !['video', 'blocks'].includes(r.resource_type?.toLowerCase())
    );
  }, [visibleResources]);

  // Simple block renderer for preview
  const renderBlock = (block) => {
    switch (block.type) {
      case 'heading':
        const HeadingTag = `h${block.level || 2}`;
        const headingClasses = {
          1: 'text-4xl font-bold text-indigo-900 mb-6',
          2: 'text-3xl font-bold text-indigo-800 mb-6 border-r-4 border-indigo-600 pr-4',
          3: 'text-2xl font-bold text-indigo-700 mb-4',
          4: 'text-xl font-semibold text-indigo-700 mb-3',
        };
        return (
          <HeadingTag 
            key={block.id} 
            className={headingClasses[block.level || 2]}
            dir={isRTL ? 'rtl' : 'ltr'}
          >
            {block.content?.text || ''}
          </HeadingTag>
        );

      case 'paragraph':
        return (
          <p 
            key={block.id} 
            className="text-lg text-gray-700 leading-relaxed mb-6"
            dir={isRTL ? 'rtl' : 'ltr'}
          >
            {block.content?.text || ''}
          </p>
        );

      case 'image':
        const imageSrc = block.content?.data || block.content?.url;
        if (!imageSrc) return null;
        
        return (
          <div key={block.id} className="mb-6">
            <div className="rounded-xl overflow-hidden bg-gray-50 p-6">
              {imageSrc.startsWith('<svg') ? (
                <div 
                  className="w-full max-w-2xl mx-auto"
                  dangerouslySetInnerHTML={{ __html: imageSrc }}
                />
              ) : (
                <img
                  src={imageSrc}
                  alt={block.content?.alt_text || ''}
                  className="w-full max-w-2xl mx-auto"
                />
              )}
            </div>
          </div>
        );

      case 'table':
        if (!block.content?.html) return null;
        return (
          <div key={block.id} className="mb-6 overflow-x-auto">
            <div 
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: block.content.html }}
              dir={isRTL ? 'rtl' : 'ltr'}
            />
          </div>
        );

      default:
        return null;
    }
  };

  if (!lesson) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] p-0 overflow-hidden">
        {/* Modal Header */}
        <div className="sticky top-0 z-50 bg-white border-b shadow-sm px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Eye className="h-5 w-5 text-indigo-600" />
              <div>
                <h2 className="font-semibold text-lg">{t('lessons.lessonContentPreview', 'معاينة محتوى الدرس')}</h2>
                <p className="text-sm text-muted-foreground">{getLocalizedLessonTitle(lesson)}</p>
              </div>
            </div>
            <Button onClick={onClose} variant="ghost" size="icon">
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-80px)] bg-gradient-to-br from-blue-50 to-indigo-50" dir={isRTL ? 'rtl' : 'ltr'}>
          <div className="max-w-5xl mx-auto px-6 py-8">
            {/* Header */}
            <header className="mb-8 text-center">
              <h1 className="text-3xl md:text-4xl font-bold text-indigo-900 mb-4">
                {getLocalizedLessonTitle(lesson)}
              </h1>
              <div className="w-24 h-1 bg-indigo-600 mx-auto rounded-full"></div>
              
              {/* Meta Information */}
              <div className="mt-6 flex flex-wrap justify-center gap-3 text-sm text-gray-600">
                {lesson?.estimated_duration && (
                  <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-full shadow-sm">
                    <Clock className="h-4 w-4 text-indigo-600" />
                    <span>{lesson.estimated_duration} {t('lessons.minutes', 'دقيقة')}</span>
                  </div>
                )}
                {lesson?.difficulty_display && (
                  <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-full shadow-sm">
                    <Award className="h-4 w-4 text-indigo-600" />
                    <span>{lesson.difficulty_display}</span>
                  </div>
                )}
                {lesson?.subject_name && (
                  <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-full shadow-sm">
                    <BookOpen className="h-4 w-4 text-indigo-600" />
                    <span>{lesson.subject_name}</span>
                  </div>
                )}
              </div>
            </header>

            {/* Learning Objectives */}
            {learningObjectives.length > 0 && (
              <section className="mb-8 bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-indigo-800 mb-4 flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  {t('lessons.learningObjectives', 'أهداف التعلم')}
                </h2>
                <ul className="space-y-2">
                  {learningObjectives.map((objective, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-indigo-500 mt-1">•</span>
                      <span className="text-gray-700">{objective}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Description */}
            {lesson?.description && (
              <section className="mb-8 bg-white rounded-2xl shadow-lg p-6">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {lesson.description}
                </p>
              </section>
            )}

            {/* Video Resources */}
            {videoResources.map((video) => (
              <section key={video.id} className="mb-8 bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-indigo-800 mb-4 flex items-center gap-2">
                  <FileVideo className="h-5 w-5" />
                  {video.title || t('lessons.videoContent', 'محتوى الفيديو')}
                </h2>
                <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
                  <video
                    src={video.file_url || video.external_url}
                    controls
                    className="w-full h-full"
                  />
                </div>
                {video.description && (
                  <p className="mt-3 text-gray-600 text-sm">{video.description}</p>
                )}
              </section>
            ))}

            {/* Blocks Content */}
            {blocksResources.map((resource) => (
              <section key={resource.id} className="mb-8 bg-white rounded-2xl shadow-lg p-6">
                {resource.title && (
                  <h2 className="text-xl font-bold text-indigo-800 mb-4 flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    {resource.title}
                  </h2>
                )}
                <div className="space-y-4">
                  {resource.blocks_content?.blocks?.map(block => renderBlock(block))}
                </div>
              </section>
            ))}

            {/* Other Resources */}
            {otherResources.length > 0 && (
              <section className="mb-8 bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-indigo-800 mb-4 flex items-center gap-2">
                  <File className="h-5 w-5" />
                  {t('lessons.additionalResources', 'موارد إضافية')}
                </h2>
                <div className="space-y-2">
                  {otherResources.map((resource) => {
                    const ResourceIcon = getResourceIcon(resource.resource_type);
                    return (
                      <div 
                        key={resource.id} 
                        className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <div className="p-2 bg-indigo-50 rounded-lg">
                            <ResourceIcon className="h-4 w-4 text-indigo-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-sm text-gray-900">
                              {resource.title || t('lessons.resource', 'مورد')}
                            </h3>
                            {resource.description && (
                              <p className="text-xs text-gray-600">{resource.description}</p>
                            )}
                          </div>
                        </div>
                        {(resource.file_url || resource.external_url) && (
                          <Button 
                            size="sm" 
                            onClick={() => window.open(resource.file_url || resource.external_url, '_blank')}
                            className="gap-2"
                          >
                            <ExternalLink className="h-4 w-4" />
                            {t('common.open', 'فتح')}
                          </Button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Exercises */}
            {exercises.length > 0 && (
              <section className="bg-gradient-to-br from-indigo-900 to-purple-900 rounded-2xl shadow-lg p-6 text-white">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <Brain className="h-6 w-6" />
                  {t('lessons.practiceExercises', 'تمارين تطبيقية')}
                </h2>
                
                <div className="space-y-3">
                  {exercises.map((exercise) => (
                    <div 
                      key={exercise.id} 
                      className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20"
                    >
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                        <div className="flex-1">
                          <h3 className="text-lg font-bold mb-2">{exercise.title}</h3>
                          {exercise.description && (
                            <p className="text-white/80 text-sm mb-2">{exercise.description}</p>
                          )}
                          <div className="flex flex-wrap gap-3 text-sm text-white/70">
                            {exercise.questions_count && (
                              <span className="flex items-center gap-1">
                                <HelpCircle className="h-4 w-4" />
                                {exercise.questions_count} {t('lessons.questions', 'أسئلة')}
                              </span>
                            )}
                            {exercise.total_points && (
                              <span className="flex items-center gap-1">
                                <Trophy className="h-4 w-4" />
                                {exercise.total_points} {t('lessons.points', 'نقطة')}
                              </span>
                            )}
                          </div>
                        </div>
                        <Button
                          size="lg"
                          className="bg-white text-indigo-900 hover:bg-gray-100 gap-2"
                        >
                          <PlayCircle className="h-5 w-5" />
                          {t('lessons.start', 'ابدأ')}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// ========================================
// MAIN ADMIN VIEW LESSON PAGE
// ========================================
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
  const [previewModalOpen, setPreviewModalOpen] = useState(false);

  const loadExercises = useCallback(async () => {
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
  }, [id]);

  const loadLesson = useCallback(async () => {
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
  }, [id, navigate, t, loadExercises]);

  // Load lesson data
  useEffect(() => {
    if (id) {
      loadLesson();
    }
  }, [id, loadLesson]);

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
      subtitle={`${lesson.subject_name} • ${lesson.grade_name}${lesson.track_name ? ` • ${lesson.track_name}` : ''}`}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Header Actions */}
        <div className="flex flex-wrap gap-3 mb-6">
          <Button onClick={() => navigate('/admin/education-management/lessons')} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t('common.back')}
          </Button>
          <Button onClick={handleEdit}>
            <Edit className="h-4 w-4 mr-2" />
            {t('common.edit')}
          </Button>
          <Button
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
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Overview Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  {t('lessons.overview')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">{t('lessons.description')}</h3>
                  <p className="text-muted-foreground whitespace-pre-wrap">
                    {lesson.description || t('lessons.noDescription')}
                  </p>
                </div>

                {lesson.objectives && (
                  <div>
                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                      <Target className="h-4 w-4" />
                      {t('lessons.objectives')}
                    </h3>
                    <div className="prose prose-sm max-w-none">
                      <p className="text-muted-foreground whitespace-pre-wrap">{lesson.objectives}</p>
                    </div>
                  </div>
                )}

                {lesson.prerequisites && (
                  <div>
                    <h3 className="font-semibold mb-2">{t('lessons.prerequisites')}</h3>
                    <p className="text-muted-foreground whitespace-pre-wrap">{lesson.prerequisites}</p>
                  </div>
                )}

                {lesson.estimated_duration && (
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{t('lessons.estimatedDuration')}: {lesson.estimated_duration} {t('lessons.minutes')}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Resources Summary Card - NOT COLLAPSIBLE */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    {t('lessons.resources')} ({lesson.resources?.length || 0})
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPreviewModalOpen(true)}
                      className="flex items-center gap-2"
                    >
                      <Eye className="h-4 w-4" />
                      {t('lessons.viewContent', 'عرض محتوى الدرس')}
                    </Button>
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
                </div>
              </CardHeader>
              <CardContent>
                {lesson.resources && lesson.resources.length > 0 ? (
                  <div className="space-y-2">
                    {lesson.resources.slice(0, 3).map((resource, index) => {
                      const ResourceIcon = getResourceIcon(resource.resource_type);
                      return (
                        <div key={resource.id || index} className="flex items-center gap-2 text-sm">
                          <ResourceIcon className="h-4 w-4 text-muted-foreground" />
                          <span className="truncate flex-1">{resource.title || t('lessons.resource', 'مورد')}</span>
                          <Badge variant="outline" className="text-xs">
                            {resource.resource_type || 'file'}
                          </Badge>
                        </div>
                      );
                    })}
                    {lesson.resources.length > 3 && (
                      <p className="text-sm text-muted-foreground pt-2">
                        +{lesson.resources.length - 3} {t('lessons.moreResources', 'موارد أخرى')}
                      </p>
                    )}
                    <div className="pt-3 border-t">
                      <p className="text-xs text-muted-foreground mb-2">
                        {t('lessons.viewContentDescription', 'هذا المورد يحتوي على كتل محتوى تفاعلية.')}
                      </p>
                    </div>
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
                                {exercise.questions_count || 0} {t('exercises.questions')}
                              </span>
                              <span className="flex items-center gap-1">
                                <Trophy className="h-3 w-3" />
                                {exercise.total_points || 0} {t('exercises.points')}
                              </span>
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
                    <p className="text-muted-foreground mb-4">{t('lessons.noExercises')}</p>
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
                        style={{
                          backgroundColor: `${tag.color}20`,
                          borderColor: tag.color,
                          color: tag.color
                        }}
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
            {/* Metadata */}
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

        {/* Student Preview Modal */}
        <StudentPreviewModal
          open={previewModalOpen}
          onClose={() => setPreviewModalOpen(false)}
          lesson={lesson}
          exercises={exercises}
          language={i18n.language}
        />
      </motion.div>
    </AdminPageLayout>
  );
};

export default ViewLessonPage;