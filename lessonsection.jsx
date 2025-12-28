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
import { LessonProvider, useLesson } from '../../contexts/LessonContext'
import { StickyHeader } from '../../components/lesson/StickyHeader'
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
  Layers,
  Download,
  ExternalLink,
  ChevronRight,
  Clock,
  Target,
  Award
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

// Component to render blocks content with clean UI
const BlocksContentRenderer = ({ blocksContent, language }) => {
  const isRTL = language === 'ar'
  
  if (!blocksContent || !blocksContent.blocks || !Array.isArray(blocksContent.blocks)) {
    return null
  }

  const renderBlock = (block) => {
    switch (block.type) {
      case 'heading':
        const HeadingTag = `h${block.level || 2}`
        const headingClasses = {
          1: 'text-4xl font-bold text-indigo-900 mb-6',
          2: 'text-3xl font-bold text-indigo-800 mb-6 border-r-4 border-indigo-600 pr-4',
          3: 'text-2xl font-bold text-indigo-700 mb-4',
          4: 'text-xl font-semibold text-indigo-700 mb-3',
          5: 'text-lg font-semibold text-indigo-600 mb-2',
          6: 'text-base font-semibold text-indigo-600 mb-2'
        }
        
        return (
          <HeadingTag 
            key={block.id} 
            className={headingClasses[block.level || 2]}
            dir={isRTL ? 'rtl' : 'ltr'}
          >
            {block.content?.text || ''}
          </HeadingTag>
        )

      case 'paragraph':
        const semanticType = block.properties?.semanticType
        let paragraphClasses = 'text-lg text-gray-700 leading-relaxed mb-6'
        
        if (semanticType === 'definition') {
          return (
            <div key={block.id} className="bg-indigo-50 border-r-4 border-indigo-500 p-6 rounded-lg mb-6" dir={isRTL ? 'rtl' : 'ltr'}>
              <p className="text-lg text-gray-800 leading-relaxed">
                {block.content?.text || ''}
              </p>
            </div>
          )
        }
        
        return (
          <p 
            key={block.id} 
            className={paragraphClasses}
            dir={isRTL ? 'rtl' : 'ltr'}
          >
            {block.content?.text || ''}
          </p>
        )

      case 'image':
        const imageSrc = block.content?.data || block.content?.url
        if (!imageSrc) return null
        
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
                  alt={block.content?.alt_text || block.content?.description || 'Lesson image'}
                  className="w-full max-w-2xl mx-auto"
                />
              )}
              {block.content?.description && (
                <p className="text-sm text-gray-600 text-center mt-4" dir={isRTL ? 'rtl' : 'ltr'}>
                  {block.content.description}
                </p>
              )}
            </div>
          </div>
        )

      case 'table':
        if (!block.content?.html) return null
        
        return (
          <div key={block.id} className="mb-6 overflow-x-auto">
            <div 
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: block.content.html }}
              dir={isRTL ? 'rtl' : 'ltr'}
            />
          </div>
        )

      case 'list':
        const ListTag = block.content?.ordered ? 'ol' : 'ul'
        const listClass = block.content?.ordered 
          ? 'list-decimal list-inside space-y-2 mb-6 text-lg text-gray-700' 
          : 'list-disc list-inside space-y-2 mb-6 text-lg text-gray-700'
        
        return (
          <ListTag key={block.id} className={listClass} dir={isRTL ? 'rtl' : 'ltr'}>
            {block.content?.items?.map((item, idx) => (
              <li key={idx} className="leading-relaxed">
                {item}
              </li>
            ))}
          </ListTag>
        )

      case 'code':
        return (
          <div key={block.id} className="mb-6">
            <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
              <code className="text-sm font-mono">
                {block.content?.code || ''}
              </code>
            </pre>
          </div>
        )

      case 'quote':
        return (
          <blockquote 
            key={block.id} 
            className="border-l-4 border-indigo-500 pl-6 italic text-gray-700 mb-6"
            dir={isRTL ? 'rtl' : 'ltr'}
          >
            {block.content?.text || ''}
          </blockquote>
        )

      case 'divider':
        return <hr key={block.id} className="my-8 border-gray-200" />

      default:
        return null
    }
  }

  return (
    <div className="space-y-4">
      {blocksContent.blocks.map(block => renderBlock(block))}
    </div>
  )
}

// Inner component that uses LessonContext
const LessonContent = ({ lesson, exercises, exercisesLoading, t, currentLanguage, navigate, lessonId }) => {
  const { state, dispatch } = useLesson()
  const isRTL = currentLanguage === 'ar'

  const localizedTitle = useMemo(() => {
    if (!lesson) return ''
    return getLocalizedValue(lesson.title, lesson.title_arabic, lesson.title_french, currentLanguage)
  }, [lesson, currentLanguage])

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

  const blocksResources = useMemo(() => {
    return visibleResources.filter(r => r.resource_type?.toLowerCase() === 'blocks')
  }, [visibleResources])

  const otherResources = useMemo(() => {
    return visibleResources.filter(r =>
      !['video', 'blocks'].includes(r.resource_type?.toLowerCase())
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
    if (resource.id) {
      dispatch({
        type: 'VIEW_RESOURCE',
        payload: { resourceId: resource.id }
      })
    }
  }

  const handleBookmark = () => {
    dispatch({ type: 'TOGGLE_BOOKMARK' })
  }

  const handleNextLesson = () => {
    console.log('Next lesson')
  }

  const canProceed = state.progress.overall >= 70

  // Parse learning objectives
  const learningObjectives = useMemo(() => {
    if (!lesson?.objectives) return []
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

      {/* Main Content Area */}
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 pb-20" dir={isRTL ? 'rtl' : 'ltr'}>
        <div className="max-w-5xl mx-auto px-4 py-12">
          
          {/* Header Section */}
          <header className="mb-12 text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-indigo-900 mb-4">
              {localizedTitle}
            </h1>
            <div className="w-24 h-1 bg-indigo-600 mx-auto rounded-full"></div>
            
            {/* Meta Information */}
            <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm text-gray-600">
              {lesson?.estimated_duration && (
                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm">
                  <Clock className="h-4 w-4 text-indigo-600" />
                  <span>{lesson.estimated_duration} {t('lessons.minutes', 'دقيقة')}</span>
                </div>
              )}
              {lesson?.difficulty_level && (
                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm">
                  <Award className="h-4 w-4 text-indigo-600" />
                  <span>{lesson.difficulty_level}</span>
                </div>
              )}
              {localizedSubject && (
                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm">
                  <BookOpen className="h-4 w-4 text-indigo-600" />
                  <span>{localizedSubject}</span>
                </div>
              )}
            </div>
          </header>

          {/* Learning Objectives */}
          {learningObjectives.length > 0 && (
            <section className="mb-12 bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-indigo-800 mb-6 flex items-center gap-2">
                <Target className="h-6 w-6" />
                {t('lessons.learningObjectives', 'أهداف التعلم')}
              </h2>
              <ul className="space-y-3">
                {learningObjectives.map((objective, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="text-indigo-500 mt-1">•</span>
                    <span className="text-lg text-gray-700">{objective}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Description */}
          {lesson?.description && (
            <section className="mb-12 bg-white rounded-2xl shadow-lg p-8">
              <p className="text-lg text-gray-700 leading-relaxed">
                {lesson.description}
              </p>
            </section>
          )}

          {/* Video Resources */}
          {videoResources.map((video) => (
            <section key={video.id} className="mb-12 bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-indigo-800 mb-6 flex items-center gap-2">
                <FileVideo className="h-6 w-6" />
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
                <p className="mt-4 text-gray-600">{video.description}</p>
              )}
            </section>
          ))}

          {/* Blocks Content */}
          {blocksResources.map((resource) => (
            <section key={resource.id} className="mb-12 bg-white rounded-2xl shadow-lg p-8">
              {resource.title && (
                <h2 className="text-2xl font-bold text-indigo-800 mb-6 flex items-center gap-2">
                  <FileText className="h-6 w-6" />
                  {resource.title}
                </h2>
              )}
              <BlocksContentRenderer 
                blocksContent={resource.blocks_content}
                language={currentLanguage}
              />
            </section>
          ))}

          {/* Other Resources */}
          {otherResources.length > 0 && (
            <section className="mb-12 bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-indigo-800 mb-6 flex items-center gap-2">
                <File className="h-6 w-6" />
                {t('lessons.additionalResources', 'موارد إضافية')}
              </h2>
              <div className="space-y-3">
                {otherResources.map((resource) => {
                  const ResourceIcon = getResourceIcon(resource.resource_type)
                  return (
                    <div 
                      key={resource.id} 
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-50 rounded-lg">
                          <ResourceIcon className="h-5 w-5 text-indigo-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {resource.title || t('lessons.resource', 'مورد')}
                          </h3>
                          {resource.description && (
                            <p className="text-sm text-gray-600">{resource.description}</p>
                          )}
                        </div>
                      </div>
                      {(resource.file_url || resource.external_url) && (
                        <Button 
                          size="sm" 
                          onClick={() => handleOpenResource(resource)}
                          className="gap-2"
                        >
                          <ExternalLink className="h-4 w-4" />
                          {t('common.open', 'فتح')}
                        </Button>
                      )}
                    </div>
                  )
                })}
              </div>
            </section>
          )}

          {/* Exercises Section */}
          <section className="bg-gradient-to-br from-indigo-900 to-purple-900 rounded-2xl shadow-lg p-8 text-white">
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
              <Brain className="h-8 w-8" />
              {t('lessons.practiceExercises', 'تمارين تطبيقية')}
            </h2>
            
            {exercisesLoading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : exercises.length > 0 ? (
              <div className="space-y-4">
                {exercises.map((exercise) => {
                  const exerciseStatus = exerciseService.calculateExerciseStatus(exercise)
                  const isCompleted = exerciseStatus === 'completed'
                  const inProgress = exerciseStatus === 'in_progress'

                  return (
                    <div 
                      key={exercise.id} 
                      className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all"
                    >
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-bold">
                              {exercise.title}
                            </h3>
                            {isCompleted && (
                              <Badge className="bg-green-500 text-white">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                {t('common.completed', 'مكتمل')}
                              </Badge>
                            )}
                            {inProgress && (
                              <Badge className="bg-yellow-500 text-white">
                                <Clock className="h-3 w-3 mr-1" />
                                {t('common.inProgress', 'قيد التقدم')}
                              </Badge>
                            )}
                          </div>
                          
                          {exercise.description && (
                            <p className="text-white/80 mb-3">{exercise.description}</p>
                          )}
                          
                          <div className="flex flex-wrap gap-4 text-sm text-white/70">
                            {(exercise.questions_count || exercise.questions?.length) && (
                              <span className="flex items-center gap-1">
                                <HelpCircle className="h-4 w-4" />
                                {exercise.questions_count || exercise.questions.length} {t('lessons.questions', 'أسئلة')}
                              </span>
                            )}
                            {exercise.total_points && (
                              <span className="flex items-center gap-1">
                                <Trophy className="h-4 w-4" />
                                {exercise.total_points} {t('lessons.points', 'نقطة')}
                              </span>
                            )}
                            {exercise.difficulty_level && (
                              <Badge variant="outline" className="text-white border-white/30">
                                {exercise.difficulty_level}
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        <Button
                          size="lg"
                          onClick={() => handleOpenExercise(exercise.id)}
                          className="bg-white text-indigo-900 hover:bg-gray-100 gap-2"
                          disabled={isCompleted}
                        >
                          {isCompleted ? (
                            <>
                              <CheckCircle className="h-5 w-5" />
                              {t('lessons.completed', 'مكتمل')}
                            </>
                          ) : inProgress ? (
                            <>
                              <RotateCcw className="h-5 w-5" />
                              {t('lessons.continue', 'متابعة')}
                            </>
                          ) : (
                            <>
                              <PlayCircle className="h-5 w-5" />
                              {t('lessons.start', 'ابدأ')}
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <Layers className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p className="text-white/80">
                  {t('lessons.noExercises', 'لا توجد تمارين متاحة حالياً')}
                </p>
              </div>
            )}
          </section>

          {/* Footer Note */}
          <footer className="mt-12 text-center text-gray-600">
            <p className="text-sm">
              {t('lessons.progressNote', 'تقدمك في هذا الدرس يتم حفظه تلقائياً')}
            </p>
          </footer>
        </div>
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

// Main component
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
        setError(t('lessons.loadError', 'Unable to load this lesson.'))
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
        console.error('Failed to load exercises:', err)
        setExercises([])
      } finally {
        setExercisesLoading(false)
      }
    }

    fetchExercises()
  }, [lesson?.id])

  if (loading) {
    return (
      <DashboardLayout user={user}>
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-center space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
            <p className="text-muted-foreground">{t('common.loading', 'جاري التحميل...')}</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (error || !lesson) {
    return (
      <DashboardLayout user={user}>
        <div className="flex justify-center items-center min-h-screen">
          <Card className="max-w-md w-full">
            <CardContent className="py-12 text-center space-y-4">
              <BookOpen className="h-16 w-16 text-destructive mx-auto" />
              <div className="space-y-2">
                <h2 className="text-xl font-semibold">
                  {t('common.error', 'خطأ')}
                </h2>
                <p className="text-muted-foreground">
                  {error || t('lessons.notFound', 'الدرس غير موجود')}
                </p>
              </div>
              <Button onClick={() => navigate('/student/lessons')}>
                {t('common.backToLessons', 'العودة إلى الدروس')}
              </Button>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout user={user}>
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
    </DashboardLayout>
  )
}

export default StudentViewLessonPage