import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import i18n from '../../lib/i18n'
import { TeacherPageLayout } from '../../components/teacher/layout'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import {
  Edit,
  Share2,
  Download,
  Copy,
  BookOpen,
  Users,
  Clock,
  Calendar,
  FileText,
  Video,
  Image as ImageIcon,
  Link,
  CheckCircle,
  PlayCircle,
  Target,
  Loader2,
  FileAudio,
  FileVideo,
  File,
  ExternalLink,
  Eye,
  Tags,
  User,
  GraduationCap,
  Award,
  HelpCircle,
  Trophy,
  Clock2,
  BarChart3,
  CheckSquare,
  Brain,
  Plus
} from 'lucide-react'
import { cn } from '../../lib/utils'
import lessonsService from '../../services/lessons'
import { exerciseService } from '../../services/exercises'
import { toast } from 'sonner'

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

const ViewLessonPage = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { id } = useParams()

  const [loading, setLoading] = useState(true)
  const [lesson, setLesson] = useState(null)
  const [exercises, setExercises] = useState([])
  const [exercisesLoading, setExercisesLoading] = useState(false)

  // Load lesson data
  useEffect(() => {
    if (id) {
      loadLesson()
    }
  }, [id])

  // Load exercises after lesson is loaded
  useEffect(() => {
    if (lesson?.id) {
      loadExercises()
    }
  }, [lesson?.id])

  const loadLesson = async () => {
    try {
      setLoading(true)
      const response = await lessonsService.getLessonById(id)
      setLesson(response)
    } catch (error) {
      console.error('Error loading lesson:', error)
      toast.error(t('error.loadingData') || 'Error loading lesson data')
      navigate('/teacher/content/lessons')
    } finally {
      setLoading(false)
    }
  }

  const loadExercises = async () => {
    try {
      setExercisesLoading(true)
      const response = await exerciseService.getExercisesByLesson(id)
      if (response.success) {
        setExercises(response.data || [])
      } else {
        console.error('Failed to load exercises:', response.error)
        setExercises([])
      }
    } catch (error) {
      console.error('Error loading exercises:', error)
      setExercises([])
    } finally {
      setExercisesLoading(false)
    }
  }

  const getResourceIcon = (resourceType) => {
    switch (resourceType) {
      case 'pdf':
        return File
      case 'video':
        return FileVideo
      case 'audio':
        return FileAudio
      case 'image':
        return ImageIcon
      case 'link':
        return Link
      case 'presentation':
        return FileText
      default:
        return File
    }
  }

  const handleEdit = () => {
    navigate(`/teacher/content/lessons/edit/${id}`)
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: getLocalizedLessonTitle(lesson),
        url: window.location.href
      })
    } else {
      // Copy lesson URL to clipboard
      const url = window.location.href
      navigator.clipboard.writeText(url)
      toast.success('Link copied to clipboard')
    }
  }

  const handleResourceClick = (resource) => {
    if (resource.file_url || resource.external_url) {
      window.open(resource.file_url || resource.external_url, '_blank')
    }
  }

  const handleDownloadResource = (resource) => {
    if (resource.file_url && resource.is_downloadable) {
      const link = document.createElement('a')
      link.href = resource.file_url
      link.download = resource.title
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const handleAddExercise = () => {
    navigate(`/teacher/content/lessons/${id}/exercises/add`)
  }

  const handleViewExercise = (exerciseId) => {
    navigate(`/teacher/content/lessons/${id}/exercises/${exerciseId}`)
  }

  const handleEditExercise = (exerciseId) => {
    navigate(`/teacher/content/lessons/${id}/exercises/${exerciseId}/edit`)
  }

  const getDifficultyBadgeColor = (difficulty) => {
    const colors = {
      beginner: 'bg-green-100 text-green-800',
      intermediate: 'bg-yellow-100 text-yellow-800',
      advanced: 'bg-orange-100 text-orange-800',
      expert: 'bg-red-100 text-red-800'
    }
    return colors[difficulty] || colors.beginner
  }

  if (loading) {
    return (
      <TeacherPageLayout
        title={t('lessons.viewLesson') || 'View Lesson'}
        subtitle={t('lessons.loading') || 'Loading lesson details...'}
        showBackButton={true}
        backButtonPath="/teacher/content/lessons"
      >
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">{t('lessons.loading') || 'Loading lesson details...'}</span>
        </div>
      </TeacherPageLayout>
    )
  }

  if (!lesson) {
    return (
      <TeacherPageLayout
        title={t('lessons.viewLesson') || 'View Lesson'}
        subtitle={t('lessons.notFound') || 'The requested lesson could not be found'}
        showBackButton={true}
        backButtonPath="/teacher/content/lessons"
      >
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">{t('lessons.notFound') || 'Lesson Not Found'}</h3>
              <p className="text-muted-foreground">
                {t('lessons.notFoundDescription') || 'The lesson you\'re looking for doesn\'t exist or has been removed.'}
              </p>
            </div>
          </CardContent>
        </Card>
      </TeacherPageLayout>
    )
  }

  return (
    <TeacherPageLayout
      title={getLocalizedLessonTitle(lesson)}
      subtitle={`${lesson.subject_name} • ${lesson.grade_name}${lesson.track_name ? ` • ${lesson.track_name}` : ''}`}
      showBackButton={true}
      backButtonPath="/teacher/content/lessons"
      actions={[
        <Button key="share" variant="outline" onClick={handleShare}>
          <Share2 className="h-4 w-4 mr-2" />
          {t('common.share') || 'Share'}
        </Button>,
        <Button key="edit" onClick={handleEdit}>
          <Edit className="h-4 w-4 mr-2" />
          {t('common.edit') || 'Edit Lesson'}
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
                    variant={lesson.is_active ? "default" : "secondary"}
                    className="shrink-0"
                  >
                    {lesson.is_active ? (t('common.active') || 'Active') : (t('common.inactive') || 'Inactive')}
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
                  {lesson.track_name && (
                    <span className="flex items-center gap-1">
                      <Tags className="h-4 w-4" />
                      {lesson.track_name}
                    </span>
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
                    {t('lessons.order') || 'Order'}: {lesson.order}
                  </span>
                </div>

                {lesson.description && (
                  <p className="text-muted-foreground">{lesson.description}</p>
                )}
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
                    {t('lessons.objectives') || 'Learning Objectives'}
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
                    {t('lessons.prerequisites') || 'Prerequisites'}
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
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  {t('lessons.resources') || 'Resources'} ({lesson.resources?.length || 0})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {lesson.resources && lesson.resources.length > 0 ? (
                  <div className="space-y-3">
                    {lesson.resources.map((resource) => {
                      const ResourceIcon = getResourceIcon(resource.resource_type)
                      return (
                        <div
                          key={resource.id}
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
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">{t('lessons.noResources') || 'No resources available for this lesson.'}</p>
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
                    {t('lessons.tags') || 'Tags'}
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
                <CardTitle>{t('lessons.metadata') || 'Lesson Information'}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{t('lessons.created') || 'Created'}</span>
                  <div className="flex items-center gap-1 text-sm">
                    <Calendar className="h-4 w-4" />
                    {new Date(lesson.created_at).toLocaleDateString()}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{t('lessons.updated') || 'Updated'}</span>
                  <div className="flex items-center gap-1 text-sm">
                    <Calendar className="h-4 w-4" />
                    {new Date(lesson.updated_at).toLocaleDateString()}
                  </div>
                </div>

                {lesson.created_by_name && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{t('lessons.createdBy') || 'Created By'}</span>
                    <div className="flex items-center gap-1 text-sm">
                      <User className="h-4 w-4" />
                      {lesson.created_by_name}
                    </div>
                  </div>
                )}

                <div className="border-t pt-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{t('lessons.status') || 'Status'}</span>
                    <Badge variant={lesson.is_active ? "default" : "secondary"}>
                      {lesson.is_active ? (t('common.active') || 'Active') : (t('common.inactive') || 'Inactive')}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{t('lessons.cycle') || 'Cycle'}</span>
                    <Badge variant="outline">{lesson.cycle_display}</Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{t('lessons.difficulty') || 'Difficulty'}</span>
                    <Badge variant="outline">{lesson.difficulty_display}</Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{t('lessons.exercises') || 'Exercises'}</span>
                    <Badge variant="outline">{exercises.length}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>{t('lessons.quickActions') || 'Quick Actions'}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={handleEdit}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  {t('common.edit') || 'Edit'}
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
                  onClick={handleShare}
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  {t('common.share') || 'Share'}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
        </div>
    </TeacherPageLayout>
  )
}

export default ViewLessonPage