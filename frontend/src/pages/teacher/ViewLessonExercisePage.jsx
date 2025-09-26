import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useLanguage } from '../../hooks/useLanguage'
import { useAuth } from '../../hooks/useAuth'
import { TeacherPageLayout } from '../../components/teacher/layout'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import { Separator } from '../../components/ui/separator'
import { Progress } from '../../components/ui/progress'
import {
  ArrowLeft,
  Edit,
  Trash2,
  BookOpen,
  Clock,
  Users,
  Target,
  Trophy,
  CheckCircle,
  XCircle,
  HelpCircle,
  Award,
  BarChart3
} from 'lucide-react'
import { exerciseService } from '../../services/exercises'
import { toast } from 'sonner'

const ViewLessonExercisePage = () => {
  const { t } = useLanguage()
  const { user } = useAuth()
  const navigate = useNavigate()
  const { id } = useParams()

  const [exercise, setExercise] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchExercise()
  }, [id])

  const fetchExercise = async () => {
    setLoading(true)
    try {
      const result = await exerciseService.getExerciseById(id)
      if (result.success) {
        setExercise(result.data)
      } else {
        toast.error(result.error || t('exercises.fetchError'))
        navigate('/teacher/content/lesson-exercises')
      }
    } catch (error) {
      console.error('Error fetching exercise:', error)
      toast.error(t('common.error'))
      navigate('/teacher/content/lesson-exercises')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = () => {
    navigate(`/teacher/content/lesson-exercises/${id}/edit`)
  }

  const handleDelete = async () => {
    if (window.confirm(t('exercises.deleteDialog.description', { title: exercise.title }))) {
      try {
        const result = await exerciseService.deleteExercise(id)
        if (result.success) {
          toast.success(t('exercises.deleteSuccess'))
          navigate('/teacher/content/lesson-exercises')
        } else {
          toast.error(result.error || t('exercises.deleteError'))
        }
      } catch (error) {
        console.error('Error deleting exercise:', error)
        toast.error(t('exercises.deleteError'))
      }
    }
  }

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-600'
      case 'intermediate': return 'text-yellow-600'
      case 'advanced': return 'text-orange-600'
      case 'expert': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  const getFormatIcon = (format) => {
    switch (format) {
      case 'qcm_only': return <Target className="h-4 w-4" />
      case 'open_only': return <HelpCircle className="h-4 w-4" />
      default: return <BookOpen className="h-4 w-4" />
    }
  }

  if (loading) {
    return (
      <TeacherPageLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">{t('common.loadingData')}</p>
          </div>
        </div>
      </TeacherPageLayout>
    )
  }

  if (!exercise) {
    return (
      <TeacherPageLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <p className="text-destructive">{t('exercises.notFound')}</p>
          </div>
        </div>
      </TeacherPageLayout>
    )
  }

  return (
    <TeacherPageLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={() => navigate('/teacher/content/lesson-exercises')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t('common.back')}
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">{exercise.title}</h1>
              <p className="text-muted-foreground">{t('exercises.exerciseDetails')}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleEdit}>
              <Edit className="h-4 w-4 mr-2" />
              {t('common.edit')}
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              <Trash2 className="h-4 w-4 mr-2" />
              {t('common.delete')}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {getFormatIcon(exercise.exercise_format)}
                  {t('exercises.basicInfo')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-medium text-sm text-muted-foreground mb-2">{t('exercises.description')}</h3>
                  <p className="text-base">{exercise.description}</p>
                </div>

                {exercise.instructions && (
                  <div>
                    <h3 className="font-medium text-sm text-muted-foreground mb-2">{t('exercises.instructions')}</h3>
                    <p className="text-base">{exercise.instructions}</p>
                  </div>
                )}

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <h3 className="font-medium text-sm text-muted-foreground">{t('exercises.lesson')}</h3>
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4" />
                      <span className="text-sm">{exercise.lesson?.title || t('exercises.noLesson')}</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium text-sm text-muted-foreground">{t('exercises.difficultyLabel')}</h3>
                    <Badge variant="outline">
                      <span className={getDifficultyColor(exercise.difficulty_level)}>
                        {t(`exercises.difficulty.${exercise.difficulty_level}`)}
                      </span>
                    </Badge>
                  </div>
                  <div>
                    <h3 className="font-medium text-sm text-muted-foreground">{t('exercises.totalPoints')}</h3>
                    <div className="flex items-center gap-1">
                      <Trophy className="h-4 w-4 text-yellow-600" />
                      <span className="text-sm font-medium">{exercise.total_points}</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium text-sm text-muted-foreground">{t('exercises.estimatedDuration')}</h3>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4 text-blue-600" />
                      <span className="text-sm">{exercise.estimated_duration || t('exercises.notSpecified')} {exercise.estimated_duration && t('common.minutes')}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Questions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HelpCircle className="h-5 w-5" />
                  {t('exercises.questions')} ({exercise.questions?.length || 0})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {exercise.questions && exercise.questions.length > 0 ? (
                  exercise.questions.map((question, index) => (
                    <div key={question.id} className="border p-4 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold">{t('exercises.question')} #{index + 1}: {question.question_text}</h4>
                        <Badge variant="secondary">{question.points} {t('exercises.points')}</Badge>
                      </div>
                      <Badge variant="outline" className="mb-3">{t(`exercises.questionTypes.${question.question_type}`)}</Badge>

                      {['qcm_single', 'qcm_multiple', 'true_false'].includes(question.question_type) && question.choices && (
                        <div className="mt-2 space-y-2">
                          <h5 className="text-sm font-medium text-muted-foreground">{t('exercises.choices')}</h5>
                          <ul className="space-y-1">
                            {question.choices.map(choice => (
                              <li key={choice.id} className={`flex items-center gap-2 text-sm p-2 rounded-md ${choice.is_correct ? 'bg-green-100 dark:bg-green-900/50' : 'bg-muted/50'}`}>
                                {choice.is_correct ? <CheckCircle className="h-4 w-4 text-green-600" /> : <XCircle className="h-4 w-4 text-muted-foreground" />}
                                <span>{choice.choice_text}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground text-center py-4">{t('exercises.noQuestionsFound')}</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Status Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  {t('exercises.statusTitle')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">{t('exercises.isActive')}</span>
                  <div className="flex items-center gap-2">
                    {exercise.is_active ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-600" />
                    )}
                    <Badge variant={exercise.is_active ? 'default' : 'secondary'}>
                      {exercise.is_active ? t('exercises.status.active') : t('exercises.status.inactive')}
                    </Badge>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm">{t('exercises.isPublished')}</span>
                  <div className="flex items-center gap-2">
                    {exercise.is_published ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-600" />
                    )}
                    <Badge variant={exercise.is_published ? 'default' : 'secondary'}>
                      {exercise.is_published ? t('exercises.status.published') : t('exercises.status.draft')}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  {t('exercises.quickStats')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">{t('exercises.completions')}</span>
                  <span className="text-sm font-bold">{exercise.completion_count || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">{t('exercises.avgScore')}</span>
                  <span className="text-sm font-bold">{Math.round(exercise.average_score || 0)}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">{t('exercises.maxAttempts')}</span>
                  <span className="text-sm font-medium">
                    {exercise.max_attempts === 0 ? t('exercises.unlimited') : exercise.max_attempts}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Reward Configuration */}
            {exercise.reward_config && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    {t('exercises.rewardConfiguration')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-muted rounded-lg">
                      <div className="text-lg font-bold text-blue-600">{exercise.reward_config.attempt_points}</div>
                      <div className="text-xs text-muted-foreground">{t('exercises.rewards.attemptPoints')}</div>
                    </div>
                    <div className="text-center p-3 bg-muted rounded-lg">
                      <div className="text-lg font-bold text-green-600">{exercise.reward_config.completion_points}</div>
                      <div className="text-xs text-muted-foreground">{t('exercises.rewards.completionPoints')}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </TeacherPageLayout>
  )
}

export default ViewLessonExercisePage