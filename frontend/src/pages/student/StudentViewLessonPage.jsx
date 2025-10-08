import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { DashboardLayout } from '../../components/layout/Layout'
import { useLanguage } from '../../hooks/useLanguage'
import { useAuth } from '../../hooks/useAuth'
import lessonsService from '../../services/lessons'
import { ROUTES } from '../../utils/constants'
import { exerciseService } from '../../services/exercises'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import { Button } from '../../components/ui/button'
import {
  BookOpen,
  GraduationCap,
  Users,
  Target,
  Award,
  Clock,
  Calendar,
  FileText,
  File,
  FileVideo,
  FileAudio,
  Image as ImageIcon,
  Link as LinkIcon,
  ExternalLink,
  Loader2,
  Eye,
  Brain,
  HelpCircle,
  Trophy,
  CheckCircle,
  ChevronLeft,
  Layers
} from 'lucide-react'

const getLocalizedValue = (value, valueArabic, valueFrench, language) => {
  switch (language) {
    case 'ar':
      return valueArabic || value || valueFrench || ''
    case 'fr':
      return valueFrench || value || valueArabic || ''
    default:
      return value || valueArabic || valueFrench || ''
  }
}

const getResourceIcon = (type) => {
  switch (type) {
    case 'video':
      return FileVideo
    case 'audio':
      return FileAudio
    case 'image':
      return ImageIcon
    case 'link':
      return LinkIcon
    case 'pdf':
    case 'presentation':
      return FileText
    default:
      return File
  }
}

const StudentViewLessonPage = () => {
  const { t, currentLanguage } = useLanguage()
  const { user } = useAuth()
  const { lessonId } = useParams()
  const navigate = useNavigate()

  const [lesson, setLesson] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [exercises, setExercises] = useState([])
  const [exercisesLoading, setExercisesLoading] = useState(false)

  useEffect(() => {
    const fetchLesson = async () => {
      if (!lessonId) {
        setError(t('lessons.invalidLesson', 'Lesson not found.'))
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)
        const data = await lessonsService.getLessonById(lessonId)
        setLesson(data)
      } catch (err) {
        console.error('Failed to load lesson details:', err)
        setError(t('lessons.loadError', 'Unable to load this lesson. Please try again later.'))
      } finally {
        setLoading(false)
      }
    }

    fetchLesson()
  }, [lessonId, t])

  useEffect(() => {
    const fetchExercises = async () => {
      if (!lesson?.id) return

      try {
        setExercisesLoading(true)
        const response = await exerciseService.getExercisesByLesson(lesson.id)
        if (response.success) {
          setExercises((response.data || []).filter((exercise) => exercise.is_published !== false))
        } else {
          setExercises([])
        }
      } catch (err) {
        console.error('Failed to load exercises for lesson:', err)
        setExercises([])
      } finally {
        setExercisesLoading(false)
      }
    }

    fetchExercises()
  }, [lesson?.id])

  const localizedTitle = useMemo(() => {
    if (!lesson) return ''
    return getLocalizedValue(lesson.title, lesson.title_arabic, lesson.title_french, currentLanguage)
  }, [lesson, currentLanguage])

  const localizedSubject = useMemo(() => {
    if (!lesson?.subject_details) return lesson?.subject_name || ''
    const subject = lesson.subject_details
    return getLocalizedValue(subject.name, subject.name_arabic, subject.name_french, currentLanguage)
  }, [lesson, currentLanguage])

  const localizedGrade = useMemo(() => {
    if (!lesson?.grade_details) return lesson?.grade_name || ''
    const grade = lesson.grade_details
    return getLocalizedValue(grade.name, grade.name_arabic, grade.name_french, currentLanguage)
  }, [lesson, currentLanguage])

  const visibleResources = useMemo(() => {
    if (!lesson?.resources) return []
    return lesson.resources.filter((resource) => resource.is_visible_to_students !== false)
  }, [lesson])

  const cycleLabel = useMemo(() => {
    if (!lesson?.cycle) return null
    const map = {
      first: t('lessons.firstCycle', 'First Cycle'),
      second: t('lessons.secondCycle', 'Second Cycle'),
    }
    return map[lesson.cycle] || lesson.cycle_display || lesson.cycle
  }, [lesson, t])

  const difficultyLabel = useMemo(() => {
    if (!lesson?.difficulty_level) return null
    const map = {
      easy: t('difficulty.easy', 'Easy'),
      medium: t('difficulty.medium', 'Medium'),
      hard: t('difficulty.hard', 'Hard'),
    }
    return map[lesson.difficulty_level] || lesson.difficulty_display || lesson.difficulty_level
  }, [lesson, t])

  const handleGoBack = () => {

    navigate('/student/lessons')

  }



  const handleOpenExercise = (exerciseId) => {

    const target = ROUTES.STUDENT_EXERCISES.VIEW.replace(':exerciseId', exerciseId)

    navigate(target, { state: { lessonId: lesson?.id || lessonId } })

  }



  const handleOpenResource = (resource) => {
    const url = resource.file_url || resource.external_url
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer')
    }
  }

  return (
    <DashboardLayout user={user}>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={handleGoBack} size="sm">
            <ChevronLeft className="h-4 w-4" />
            {t('common.back', 'Back')}
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{localizedTitle || t('lessons.viewLesson', 'Lesson details')}</h1>
            {lesson && (
              <p className="text-muted-foreground mt-1">
                {localizedSubject}  {localizedGrade}
              </p>
            )}
          </div>
        </div>

        {loading ? (
          <Card>
            <CardContent className="py-12 flex flex-col items-center gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">{t('common.loading', 'Loading...')}</p>
            </CardContent>
          </Card>
        ) : error ? (
          <Card className="border-destructive">
            <CardContent className="py-12 text-center space-y-4">
              <BookOpen className="h-10 w-10 text-destructive mx-auto" />
              <p className="text-muted-foreground">{error}</p>
              <Button variant="outline" onClick={handleGoBack}>
                {t('common.backToList', 'Back to lessons')}
              </Button>
            </CardContent>
          </Card>
        ) : !lesson ? (
          <Card>
            <CardContent className="py-12 text-center space-y-3">
              <BookOpen className="h-10 w-10 text-muted-foreground mx-auto" />
              <p className="text-muted-foreground">{t('lessons.notFound', 'Lesson not found')}</p>
              <Button variant="outline" onClick={handleGoBack}>
                {t('common.backToList', 'Back to lessons')}
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex flex-wrap items-center gap-3">
                  <Badge variant="outline" className="text-xs">
                    {localizedSubject || t('lessons.subject', 'Subject')}
                  </Badge>
                  {cycleLabel && (
                    <Badge variant="outline" className="text-xs">
                      {cycleLabel}
                    </Badge>
                  )}
                  {difficultyLabel && (
                    <Badge variant="outline" className="text-xs">
                      {difficultyLabel}
                    </Badge>
                  )}
                  <Badge variant="outline" className="text-xs">
                    {t('lessons.order', 'Order')} #{lesson.order || 0}
                  </Badge>
                  {lesson.is_active === false && (
                    <Badge variant="secondary" className="text-xs">
                      {t('common.inactive', 'Inactive')}
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {lesson.description && (
                  <p className="text-muted-foreground whitespace-pre-line">{lesson.description}</p>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <GraduationCap className="h-4 w-4" />
                    <span>{localizedGrade}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Target className="h-4 w-4" />
                    <span>{lesson.cycle_display || cycleLabel || t('lessons.cycle', 'Cycle')}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Award className="h-4 w-4" />
                    <span>{lesson.difficulty_display || difficultyLabel || t('difficulty.medium', 'Medium')}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{t('common.updated', 'Updated')} {lesson.updated_at ? new Date(lesson.updated_at).toLocaleDateString() : t('common.notAvailable', 'N/A')}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                {lesson.objectives && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-base">
                        <Target className="h-5 w-5" />
                        {t('lessons.objectives', 'Learning objectives')}
                      </CardTitle>
                      <CardDescription>{t('lessons.objectivesDescription', 'What you will achieve after completing this lesson')}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground whitespace-pre-line">{lesson.objectives}</p>
                    </CardContent>
                  </Card>
                )}

                {lesson.prerequisites && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-base">
                        <BookOpen className="h-5 w-5" />
                        {t('lessons.prerequisites', 'Prerequisites')}
                      </CardTitle>
                      <CardDescription>{t('lessons.prerequisitesDescription', 'Recommended knowledge before starting')}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground whitespace-pre-line">{lesson.prerequisites}</p>
                    </CardContent>
                  </Card>
                )}

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <FileText className="h-5 w-5" />
                      {t('lessons.resources', 'Lesson resources')}
                    </CardTitle>
                    <CardDescription>
                      {visibleResources.length > 0
                        ? t('lessons.resourcesDescription', 'Download or open the materials provided for this lesson')
                        : t('lessons.noResources', 'No resources available for this lesson yet.')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {visibleResources.length > 0 ? (
                      <div className="space-y-3">
                        {visibleResources.map((resource) => {
                          const ResourceIcon = getResourceIcon(resource.resource_type)
                          return (
                            <div key={resource.id} className="border rounded-lg p-4">
                              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                                <div className="flex items-start gap-3 flex-1 min-w-0">
                                  <ResourceIcon className="h-6 w-6 text-primary mt-1" />
                                  <div className="space-y-1 min-w-0">
                                    <h4 className="font-medium truncate">{resource.title || t('lessons.resourceUntitled', 'Untitled resource')}</h4>
                                    {resource.description && (
                                      <p className="text-xs text-muted-foreground truncate">
                                        {resource.description}
                                      </p>
                                    )}
                                    <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                                      {resource.resource_type && (
                                        <Badge variant="outline" className="text-[10px] uppercase tracking-wide">
                                          {resource.resource_type}
                                        </Badge>
                                      )}
                                      {resource.file_size && (
                                        <span>
                                          {Math.round(resource.file_size / 1024)} KB
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  {(resource.file_url || resource.external_url) && (
                                    <Button size="sm" onClick={() => handleOpenResource(resource)} className="flex items-center gap-1">
                                      <Eye className="h-4 w-4" />
                                      {t('common.open', 'Open')}
                                    </Button>
                                  )}
                                  {resource.external_url && (
                                    <Button size="sm" variant="ghost" onClick={() => window.open(resource.external_url, '_blank')}>
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
                      <div className="flex flex-col items-center justify-center py-10 text-center gap-3 text-muted-foreground">
                        <FileText className="h-10 w-10" />
                        <p>{t('lessons.noResources', 'No resources available for this lesson yet.')}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                      <Brain className="h-5 w-5" />
                      {t('lessons.exercises', 'Exercises')}
                    </CardTitle>
                    <CardDescription>
                      {t('lessons.exercisesDescription', 'Practice what you learned with these exercises')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {exercisesLoading ? (
                      <div className="flex justify-center items-center py-8 text-muted-foreground gap-3">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <span>{t('lessons.loadingExercises', 'Loading exercises...')}</span>
                      </div>
                    ) : exercises.length > 0 ? (
                      <div className="space-y-3">
                        {exercises.map((exercise) => (
                          <div key={exercise.id} className="border rounded-lg p-4">
                            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                              <div className="space-y-2">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <h4 className="font-medium text-base">{exercise.title}</h4>
                                  {exercise.difficulty_level && (
                                    <Badge variant="outline" className="text-xs uppercase">
                                      {exercise.difficulty_level}
                                    </Badge>
                                  )}
                                  {exercise.is_published === false && (
                                    <Badge variant="secondary" className="text-xs">
                                      {t('common.draft', 'Draft')}
                                    </Badge>
                                  )}
                                </div>
                                {exercise.description && (
                                  <p className="text-sm text-muted-foreground line-clamp-3">
                                    {exercise.description}
                                  </p>
                                )}
                                <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                                  {(exercise.questions_count || (exercise.questions && exercise.questions.length)) && (
                                    <span className="flex items-center gap-1">
                                      <HelpCircle className="h-3 w-3" />
                                      {(exercise.questions_count || (exercise.questions && exercise.questions.length) || 0)} {t('lessons.questions', 'questions')}
                                    </span>
                                  )}
                                  {(exercise.total_points || exercise.total_score) && (
                                    <span className="flex items-center gap-1">
                                      <Trophy className="h-3 w-3" />
                                      {(exercise.total_points || exercise.total_score)} {t('lessons.points', 'points')}
                                    </span>
                                  )}
                                  {exercise.estimated_duration && (
                                    <span className="flex items-center gap-1">
                                      <Clock className="h-3 w-3" />
                                      {exercise.estimated_duration} {t('lessons.minutes', 'min')}
                                    </span>
                                  )}
                                </div>
                              </div>
                              <div className="flex items-center gap-2">

                                <Button

                                  size="sm"

                                  onClick={() => handleOpenExercise(exercise.id)}

                                  className="flex items-center gap-2"

                                >

                                  <CheckCircle className="h-4 w-4" />

                                  {t('lessons.startExercise', 'Start exercise')}

                                </Button>

                              </div>

                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-10 text-center gap-3 text-muted-foreground">
                        <Layers className="h-10 w-10" />
                        <p>{t('lessons.noExercises', 'No exercises available for this lesson yet.')}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">{t('lessons.metadata', 'Lesson information')}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm text-muted-foreground">
                    <div className="flex items-center justify-between">
                      <span>{t('lessons.created', 'Created')}</span>
                      <span className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {lesson.created_at ? new Date(lesson.created_at).toLocaleDateString() : t('common.notAvailable', 'N/A')}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>{t('lessons.updated', 'Updated')}</span>
                      <span className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {lesson.updated_at ? new Date(lesson.updated_at).toLocaleDateString() : t('common.notAvailable', 'N/A')}
                      </span>
                    </div>
                    {lesson.created_by_name && (
                      <div className="flex items-center justify-between">
                        <span>{t('lessons.createdBy', 'Created by')}</span>
                        <span className="flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          {lesson.created_by_name}
                        </span>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {lesson.tags && lesson.tags.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">{t('lessons.tags', 'Tags')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {lesson.tags.map((tag) => (
                          <Badge key={tag.id} variant="outline" style={{ backgroundColor: `${tag.color}22`, borderColor: tag.color }}>
                            {tag.name}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

export default StudentViewLessonPage




