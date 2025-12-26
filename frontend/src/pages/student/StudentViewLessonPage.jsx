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
import EnhancedMarkdown from '../../components/markdown/EnhancedMarkdown'
import BlockRenderer from '../../components/blocks/BlockRenderer'
import { LessonProvider, useLesson } from '../../contexts/LessonContext'
import { StickyHeader } from '../../components/lesson/StickyHeader'
import { LessonOverview } from '../../components/lesson/LessonOverview'
import { VideoSection } from '../../components/lesson/VideoSection'
import { StickyFooter } from '../../components/lesson/StickyFooter'
import 'katex/dist/katex.min.css'
import {
  BookOpen,
  FileText,
  File,
  FileVideo,
  FileAudio,
  Image as ImageIcon,
  Link as LinkIcon,
  Loader2,
  Eye,
  Brain,
  HelpCircle,
  Trophy,
  CheckCircle,
  PlayCircle,
  RotateCcw,
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

// Inner component that uses LessonContext
const LessonContent = ({ lesson, exercises, exercisesLoading, t, currentLanguage, navigate, lessonId }) => {
  const { state, dispatch } = useLesson()

  const localizedSubject = useMemo(() => {
    if (!lesson?.subject_details) return lesson?.subject_name || ''
    const subject = lesson.subject_details
    return getLocalizedValue(subject.name, subject.name_arabic, subject.name_french, currentLanguage)
  }, [lesson, currentLanguage])

  const visibleResources = useMemo(() => {
    if (!lesson?.resources) return []
    return lesson.resources.filter((resource) => resource.is_visible_to_students !== false)
  }, [lesson])

  const videoResources = useMemo(() => {
    return visibleResources.filter(r => r.resource_type?.toLowerCase() === 'video')
  }, [visibleResources])

  const markdownResources = useMemo(() => {
    return visibleResources.filter(r => r.resource_type?.toLowerCase() === 'markdown')
  }, [visibleResources])

  const blocksResources = useMemo(() => {
    return visibleResources.filter(r => r.resource_type?.toLowerCase() === 'blocks')
  }, [visibleResources])

  const otherResources = useMemo(() => {
    return visibleResources.filter(r =>
      !['video', 'markdown', 'blocks'].includes(r.resource_type?.toLowerCase())
    )
  }, [visibleResources])

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
    // Mark resource as viewed
    if (resource.id) {
      dispatch({
        type: 'VIEW_RESOURCE',
        payload: { resourceId: resource.id }
      })
    }
  }

  const handleBookmark = () => {
    dispatch({ type: 'TOGGLE_BOOKMARK' })
    // TODO: API call to save bookmark
  }

  const handleNextLesson = () => {
    // TODO: Navigate to next lesson
    console.log('Next lesson')
  }

  const canProceed = state.progress.overall >= 70 // Require 70% completion

  // Parse learning objectives if they're in the objectives field
  const learningObjectives = useMemo(() => {
    if (!lesson?.objectives) return []
    // Split by newlines or bullets
    return lesson.objectives
      .split(/[\n•]/)
      .map(obj => obj.trim())
      .filter(obj => obj.length > 0)
  }, [lesson])

  return (
    <>
      <StickyHeader
        subject={localizedSubject}
        lessonNumber={lesson?.order}
        onBack={handleGoBack}
        currentLanguage={currentLanguage}
      />

      <div className="space-y-6">
        {/* Lesson Overview Card */}
        {lesson && (
          <LessonOverview
            duration={lesson.estimated_duration || 15}
            difficulty={lesson.difficulty_level}
            learningObjectives={learningObjectives}
            description={lesson.description}
            attachments={otherResources}
            currentLanguage={currentLanguage}
          />
        )}

        {/* Video Sections */}
        {videoResources.map((video) => (
          <VideoSection
            key={video.id}
            videoUrl={video.file_url || video.external_url}
            title={video.title}
            sectionId={`video-${video.id}`}
            currentLanguage={currentLanguage}
          />
        ))}

        {/* Main Content - Blocks */}
        {blocksResources.map((resource) => (
          <Card key={resource.id} className="mb-6">
            <CardHeader dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                {resource.title || t('lessons.content', 'Lesson Content')}
              </CardTitle>
            </CardHeader>
            <CardContent dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
              <BlockRenderer
                blocksContent={resource.blocks_content}
                language={currentLanguage}
              />
            </CardContent>
          </Card>
        ))}

        {/* Main Content - Markdown */}
        {markdownResources.map((resource) => (
          <Card key={resource.id} className="mb-6">
            <CardHeader dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                {resource.title || t('lessons.content', 'Lesson Content')}
              </CardTitle>
            </CardHeader>
            <CardContent dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
              <EnhancedMarkdown
                content={resource.markdown_content}
                language={currentLanguage}
                showCopyButton={true}
                collapsibleHeadings={false}
              />
            </CardContent>
          </Card>
        ))}

        {/* Other Resources */}
        {otherResources.length > 0 && (
          <Card>
            <CardHeader dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                {t('lessons.additionalResources', 'Additional Resources')}
              </CardTitle>
            </CardHeader>
            <CardContent dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
              <div className="space-y-3">
                {otherResources.map((resource) => {
                  const ResourceIcon = getResourceIcon(resource.resource_type)
                  return (
                    <div key={resource.id} className="border rounded-lg p-4 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <ResourceIcon className="h-6 w-6 text-primary" />
                          <div>
                            <h4 className="font-medium">{resource.title || t('lessons.resourceUntitled', 'Untitled resource')}</h4>
                            {resource.description && (
                              <p className="text-sm text-muted-foreground">{resource.description}</p>
                            )}
                          </div>
                        </div>
                        {(resource.file_url || resource.external_url) && (
                          <Button size="sm" onClick={() => handleOpenResource(resource)} className="flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            {t('common.open', 'Open')}
                          </Button>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Exercises Section */}
        <Card>
          <CardHeader dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              {t('lessons.exercises', 'Practice Exercises')}
            </CardTitle>
            <CardDescription>
              {t('lessons.exercisesDescription', 'Test your knowledge with these exercises')}
            </CardDescription>
          </CardHeader>
          <CardContent dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
            {exercisesLoading ? (
              <div className="flex justify-center items-center py-8 text-muted-foreground gap-3">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>{t('lessons.loadingExercises', 'Loading exercises...')}</span>
              </div>
            ) : exercises.length > 0 ? (
              <div className="space-y-3">
                {exercises.map((exercise) => {
                  const exerciseStatus = exerciseService.calculateExerciseStatus(exercise)
                  const isExerciseCompleted = exerciseStatus === 'completed'
                  const hasExerciseAttempts = exerciseStatus === 'in_progress'

                  let buttonLabel = t('lessons.startExercise', 'Start Exercise')
                  let ButtonIcon = PlayCircle
                  let buttonVariant = 'default'
                  let buttonClassName = 'flex items-center gap-2'
                  let buttonDisabled = false

                  if (isExerciseCompleted) {
                    buttonLabel = t('lessons.exerciseCompleted', 'Completed')
                    ButtonIcon = CheckCircle
                    buttonVariant = 'outline'
                    buttonClassName += ' text-emerald-600 border-emerald-200 bg-emerald-50 dark:text-emerald-300 dark:border-emerald-500 dark:bg-emerald-900/20 cursor-default'
                    buttonDisabled = true
                  } else if (hasExerciseAttempts) {
                    buttonLabel = t('lessons.continueExercise', 'Continue')
                    ButtonIcon = RotateCcw
                    buttonVariant = 'outline'
                  }

                  return (
                    <div key={exercise.id} className="border rounded-lg p-4 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors">
                      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-medium text-base">{exercise.title}</h4>
                            {exercise.difficulty_level && (
                              <Badge variant="outline" className="text-xs uppercase">
                                {exercise.difficulty_level}
                              </Badge>
                            )}
                          </div>
                          {exercise.description && (
                            <p className="text-sm text-muted-foreground line-clamp-2">
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
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant={buttonVariant}
                          onClick={buttonDisabled ? undefined : () => handleOpenExercise(exercise.id)}
                          disabled={buttonDisabled}
                          className={buttonClassName}
                        >
                          <ButtonIcon className="h-4 w-4" />
                          {buttonLabel}
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-center gap-3 text-muted-foreground">
                <Layers className="h-10 w-10" />
                <p>{t('lessons.noExercises', 'No exercises available yet')}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <StickyFooter
        onBookmark={handleBookmark}
        onNextLesson={handleNextLesson}
        isBookmarked={state.bookmarked}
        isLastLesson={false}
        canProceed={canProceed}
        currentLanguage={currentLanguage}
      />
    </>
  )
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

  return (
    <DashboardLayout user={user}>
      {loading ? (
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-center space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
            <p className="text-muted-foreground">{t('common.loading', 'Loading lesson...')}</p>
          </div>
        </div>
      ) : error ? (
        <div className="flex justify-center items-center min-h-screen">
          <Card className="max-w-md w-full">
            <CardContent className="py-12 text-center space-y-4">
              <BookOpen className="h-16 w-16 text-destructive mx-auto" />
              <div className="space-y-2">
                <h2 className="text-xl font-semibold">{t('common.error', 'Error')}</h2>
                <p className="text-muted-foreground">{error}</p>
              </div>
              <Button onClick={() => navigate('/student/lessons')}>
                {t('common.backToLessons', 'Back to Lessons')}
              </Button>
            </CardContent>
          </Card>
        </div>
      ) : !lesson ? (
        <div className="flex justify-center items-center min-h-screen">
          <Card className="max-w-md w-full">
            <CardContent className="py-12 text-center space-y-4">
              <BookOpen className="h-16 w-16 text-muted-foreground mx-auto" />
              <div className="space-y-2">
                <h2 className="text-xl font-semibold">{t('lessons.notFound', 'Lesson Not Found')}</h2>
                <p className="text-muted-foreground">{t('lessons.notFoundDescription', 'The lesson you\'re looking for doesn\'t exist.')}</p>
              </div>
              <Button onClick={() => navigate('/student/lessons')}>
                {t('common.backToLessons', 'Back to Lessons')}
              </Button>
            </CardContent>
          </Card>
        </div>
      ) : (
        <LessonProvider lessonId={lessonId}>
          <LessonContent
            lesson={lesson}
            exercises={exercises}
            exercisesLoading={exercisesLoading}
            t={t}
            currentLanguage={currentLanguage}
            navigate={navigate}
            lessonId={lessonId}
          />
        </LessonProvider>
      )}
    </DashboardLayout>
  )
}

export default StudentViewLessonPage
