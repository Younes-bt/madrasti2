import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useLanguage } from '../../hooks/useLanguage'
import { useAuth } from '../../hooks/useAuth'
import { TeacherPageLayout } from '../../components/teacher/layout'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import { Separator } from '../../components/ui/separator'
import { Progress } from '../../components/ui/progress'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../../components/ui/dialog'
import {
  ArrowLeft,
  Edit,
  Trash2,
  BookOpen,
  GraduationCap,
  Clock,
  Users,
  Target,
  Trophy,
  CheckCircle,
  XCircle,
  HelpCircle,
  Award,
  BarChart3,
  FileText,
  Brain,
  PlayCircle,
  Settings,
  AlertCircle,
  TrendingUp,
  Star,
  Calendar,
  Activity,
  Timer,
  Coins
} from 'lucide-react'
import { exerciseService } from '../../services/exercises'
import { toast } from 'sonner'

const ViewLessonExercisePage = () => {
  const { t } = useTranslation()
  const { currentLanguage } = useLanguage()
  const { user } = useAuth()
  const navigate = useNavigate()
  const { id } = useParams()

  const [exercise, setExercise] = useState(null)
  const [loading, setLoading] = useState(true)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [analytics, setAnalytics] = useState(null)

  useEffect(() => {
    fetchExerciseData()
  }, [id])

  const fetchExerciseData = async () => {
    setLoading(true)
    try {
      const exerciseResult = await exerciseService.getExerciseById(id)

      if (exerciseResult.success) {
        setExercise(exerciseResult.data)
        setAnalytics({
          total_attempts: exerciseResult.data.completion_count || 0,
          completions: exerciseResult.data.completion_count || 0,
          unique_students: exerciseResult.data.completion_count || 0,
          average_score: exerciseResult.data.average_score || 0,
          completion_rate: exerciseResult.data.completion_count > 0 ? 85 : 0
        })
      } else {
        toast.error(exerciseResult.error || t('exercises.fetchError'))
        navigate('/teacher/content/lesson-exercises')
        return
      }
    } catch (error) {
      console.error('Error fetching exercise data:', error)
      toast.error(t('common.error'))
      navigate('/teacher/content/lesson-exercises')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteExercise = async () => {
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
    setDeleteDialogOpen(false)
  }

  const getFormatIcon = (format) => {
    switch (format) {
      case 'qcm_only': return <Target className="h-5 w-5" />
      case 'open_only': return <FileText className="h-5 w-5" />
      case 'practical': return <Brain className="h-5 w-5" />
      case 'interactive': return <PlayCircle className="h-5 w-5" />
      default: return <BookOpen className="h-5 w-5" />
    }
  }

  const getDifficultyBadgeVariant = (difficulty) => {
    switch (difficulty) {
      case 'beginner': return 'success'
      case 'intermediate': return 'warning'
      case 'advanced': return 'destructive'
      case 'expert': return 'secondary'
      default: return 'outline'
    }
  }

  const getQuestionImageSource = (question) => {
    const absoluteUrl = typeof question?.question_image_url === 'string' ? question.question_image_url : null
    const isAbsolute = (value) => typeof value === 'string' && /^https?:\/\//i.test(value)

    const resolveImageValue = (value) => {
      if (!value) return null
      if (typeof value === 'string') {
        if (isAbsolute(value)) return value
        if (absoluteUrl) return absoluteUrl
        return value
      }
      if (Array.isArray(value)) {
        for (const item of value) {
          const resolved = resolveImageValue(item)
          if (resolved) return resolved
        }
        return null
      }
      if (typeof value === 'object') {
        const nested =
          value.secure_url ||
          value.url ||
          value.path ||
          value.src ||
          null
        if (nested) {
          return isAbsolute(nested) ? nested : (absoluteUrl || nested)
        }
      }
      return null
    }

    const candidates = [
      question?.question_image_url,
      question?.question_image,
      question?.image_url,
      question?.image
    ]

    for (const candidate of candidates) {
      const resolved = resolveImageValue(candidate)
      if (resolved) return resolved
    }
    return null
  }

  const formatDateTime = (dateTime) => {
    if (!dateTime) return t('exercises.noLimit')
    return new Date(dateTime).toLocaleString()
  }

  // Helper function to get text based on current language
  const getLocalizedText = (englishText, arabicText) => {
    if (currentLanguage === 'ar' && arabicText) {
      return arabicText
    }
    return englishText
  }

  // Helper function to get choice text based on current language
  const getLocalizedChoiceText = (choice) => {
    if (currentLanguage === 'ar' && choice.choice_text_arabic) {
      return choice.choice_text_arabic
    }
    return choice.choice_text
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
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
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
            <Button variant="outline" onClick={() => navigate(`/teacher/content/lesson-exercises/${exercise.id}/edit`)}>
              <Edit className="h-4 w-4 mr-2" />
              {t('common.edit')}
            </Button>
            <Button
              variant="destructive"
              onClick={() => setDeleteDialogOpen(true)}
            >
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium text-sm text-muted-foreground">{t('exercises.title')}</h3>
                    <p className="text-base">{exercise.title}</p>
                  </div>
                  {exercise.title_arabic && (
                    <div>
                      <h3 className="font-medium text-sm text-muted-foreground">{t('exercises.titleArabic')}</h3>
                      <p className="text-base" dir="rtl">{exercise.title_arabic}</p>
                    </div>
                  )}
                </div>

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
                      <GraduationCap className="h-4 w-4" />
                      <span className="text-sm">{exercise.lesson?.title || t('exercises.noLesson')}</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium text-sm text-muted-foreground">{t('exercises.formatLabel')}</h3>
                    <div className="flex items-center gap-2">
                      {getFormatIcon(exercise.exercise_format)}
                      <span className="text-sm">{t(`exercises.format.${exercise.exercise_format}`)}</span>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium text-sm text-muted-foreground">{t('exercises.difficultyLabel')}</h3>
                    <Badge variant={getDifficultyBadgeVariant(exercise.difficulty_level)}>
                      {t(`exercises.difficulty.${exercise.difficulty_level}`)}
                    </Badge>
                  </div>
                  <div>
                    <h3 className="font-medium text-sm text-muted-foreground">{t('exercises.totalPoints')}</h3>
                    <div className="flex items-center gap-1">
                      <Trophy className="h-4 w-4 text-yellow-600" />
                      <span className="text-sm font-medium">{exercise.total_points}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Questions List */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HelpCircle className="h-5 w-5" />
                  {t('exercises.questions')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {exercise.questions && exercise.questions.length > 0 ? (
                  exercise.questions.map((question, index) => (
                    <div key={question.id} className="border p-4 rounded-lg">
                      <div className="flex justify-between items-start">
                        <h4 className="font-semibold" dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
                          {t('exercises.question')} #{index + 1}: {getLocalizedText(question.question_text, question.question_text_arabic)}
                        </h4>
                        <Badge variant="secondary">{question.points} {t('exercises.points')}</Badge>
                      </div>
                      <Badge variant="outline" className="mt-2 mb-3">{t(`exercises.questionTypes.${question.question_type}`)}</Badge>

                      {/* Display question image if available */}
                      {getQuestionImageSource(question) && (
                        <div className="mt-3 mb-3">
                          <img
                            src={getQuestionImageSource(question)}
                            alt={`Question ${index + 1} diagram`}
                            className="max-w-full h-auto rounded-md border border-muted/50 shadow-sm"
                            style={{ maxHeight: '400px' }}
                          />
                        </div>
                      )}

                      {/* Display Arabic question text if available and different from English */}
                      {currentLanguage !== 'ar' && question.question_text_arabic && question.question_text_arabic !== question.question_text && (
                        <div className="mt-2 p-2 bg-muted/30 rounded-md">
                          <p className="text-sm text-muted-foreground mb-1">Arabic:</p>
                          <p className="text-sm" dir="rtl">{question.question_text_arabic}</p>
                        </div>
                      )}

                      {['qcm_single', 'qcm_multiple', 'true_false'].includes(question.question_type) && (
                        <div className="mt-2 space-y-2">
                          <h5 className="text-sm font-medium text-muted-foreground">{t('exercises.choices')}</h5>
                          <ul className="space-y-1">
                            {question.choices.map(choice => (
                              <li key={choice.id} className={`flex items-center gap-2 text-sm p-2 rounded-md ${choice.is_correct ? 'bg-green-100 dark:bg-green-900/50' : 'bg-muted/50'}`}>
                                {choice.is_correct ? <CheckCircle className="h-4 w-4 text-green-600" /> : <XCircle className="h-4 w-4 text-muted-foreground" />}
                                <span dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
                                  {getLocalizedChoiceText(choice)}
                                </span>
                                {/* Show both languages when not in Arabic mode and Arabic text is available */}
                                {currentLanguage !== 'ar' && choice.choice_text_arabic && choice.choice_text_arabic !== choice.choice_text && (
                                  <span className="text-xs text-muted-foreground" dir="rtl">
                                    ({choice.choice_text_arabic})
                                  </span>
                                )}
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

            {/* Analytics Dashboard */}
            {analytics && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    {t('exercises.analytics.title')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{analytics.total_attempts || 0}</div>
                      <div className="text-sm text-muted-foreground">{t('exercises.analytics.totalAttempts')}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{analytics.completions || 0}</div>
                      <div className="text-sm text-muted-foreground">{t('exercises.analytics.completions')}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">{analytics.unique_students || 0}</div>
                      <div className="text-sm text-muted-foreground">{t('exercises.analytics.uniqueStudents')}</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">{Math.round(analytics.average_score || 0)}%</div>
                      <div className="text-sm text-muted-foreground">{t('exercises.analytics.averageScore')}</div>
                    </div>
                  </div>

                  {analytics.completion_rate !== undefined && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{t('exercises.analytics.completionRate')}</span>
                        <span className="font-medium">{Math.round(analytics.completion_rate)}%</span>
                      </div>
                      <Progress value={analytics.completion_rate} className="h-2" />
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

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
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-3 bg-muted rounded-lg">
                      <div className="text-lg font-bold text-blue-600">{exercise.reward_config.attempt_points}</div>
                      <div className="text-xs text-muted-foreground">{t('exercises.rewards.attemptPoints')}</div>
                    </div>
                    <div className="text-center p-3 bg-muted rounded-lg">
                      <div className="text-lg font-bold text-green-600">{exercise.reward_config.completion_points}</div>
                      <div className="text-xs text-muted-foreground">{t('exercises.rewards.completionPoints')}</div>
                    </div>
                    <div className="text-center p-3 bg-muted rounded-lg">
                      <div className="text-lg font-bold text-yellow-600 flex items-center justify-center gap-1">
                        <Coins className="h-4 w-4" />
                        {exercise.reward_config.completion_coins}
                      </div>
                      <div className="text-xs text-muted-foreground">{t('exercises.rewards.completionCoins')}</div>
                    </div>
                    <div className="text-center p-3 bg-muted rounded-lg">
                      <div className="text-lg font-bold text-purple-600">{exercise.reward_config.perfect_score_bonus}</div>
                      <div className="text-xs text-muted-foreground">{t('exercises.rewards.perfectScoreBonus')}</div>
                    </div>
                  </div>

                  <Separator className="my-4" />

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="font-medium">{t('exercises.rewards.highScoreBonus')}: </span>
                      <span>{exercise.reward_config.high_score_bonus}</span>
                    </div>
                    <div>
                      <span className="font-medium">{t('exercises.rewards.improvementBonus')}: </span>
                      <span>{exercise.reward_config.improvement_bonus}</span>
                    </div>
                    <div>
                      <span className="font-medium">{t('exercises.rewards.baseXP')}: </span>
                      <span>{exercise.reward_config.base_xp}</span>
                    </div>
                    <div>
                      <span className="font-medium">{t('exercises.rewards.bonusXP')}: </span>
                      <span>{exercise.reward_config.bonus_xp}</span>
                    </div>
                    <div>
                      <span className="font-medium">{t('exercises.rewards.difficultyMultiplier')}: </span>
                      <span>{exercise.reward_config.difficulty_multiplier}x</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Status Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
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

                <Separator />

                <div>
                  <h4 className="text-sm font-medium mb-2">{t('exercises.availability')}</h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3 w-3" />
                      <span className="font-medium">{t('exercises.availableFrom')}:</span>
                      <span className="text-muted-foreground">{formatDateTime(exercise.available_from)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3 w-3" />
                      <span className="font-medium">{t('exercises.availableUntil')}:</span>
                      <span className="text-muted-foreground">{formatDateTime(exercise.available_until)}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Settings Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  {t('exercises.exerciseSettings')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">{t('exercises.isTimedExercise')}</span>
                  <div className="flex items-center gap-2">
                    {exercise.is_timed ? (
                      <>
                        <Timer className="h-4 w-4 text-orange-600" />
                        <span className="text-sm font-medium">{exercise.time_limit} {t('common.minutes')}</span>
                      </>
                    ) : (
                      <span className="text-sm text-muted-foreground">{t('exercises.noTimeLimit')}</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm">{t('exercises.estimatedDuration')}</span>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-blue-600" />
                    <span className="text-sm">{exercise.estimated_duration || t('exercises.notSpecified')} {exercise.estimated_duration && t('common.minutes')}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm">{t('exercises.maxAttempts')}</span>
                  <span className="text-sm font-medium">
                    {exercise.max_attempts === 0 ? t('exercises.unlimited') : exercise.max_attempts}
                  </span>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs">{t('exercises.autoGrade')}</span>
                    {exercise.auto_grade ? (
                      <CheckCircle className="h-3 w-3 text-green-600" />
                    ) : (
                      <XCircle className="h-3 w-3 text-red-600" />
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs">{t('exercises.randomizeQuestions')}</span>
                    {exercise.randomize_questions ? (
                      <CheckCircle className="h-3 w-3 text-green-600" />
                    ) : (
                      <XCircle className="h-3 w-3 text-red-600" />
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs">{t('exercises.showResultsImmediately')}</span>
                    {exercise.show_results_immediately ? (
                      <CheckCircle className="h-3 w-3 text-green-600" />
                    ) : (
                      <XCircle className="h-3 w-3 text-red-600" />
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs">{t('exercises.allowMultipleAttempts')}</span>
                    {exercise.allow_multiple_attempts ? (
                      <CheckCircle className="h-3 w-3 text-green-600" />
                    ) : (
                      <XCircle className="h-3 w-3 text-red-600" />
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  {t('exercises.quickStats')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-blue-600" />
                    <span className="text-sm">{t('exercises.completions')}</span>
                  </div>
                  <span className="text-sm font-bold">{exercise.completion_count || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-yellow-600" />
                    <span className="text-sm">{t('exercises.avgScore')}</span>
                  </div>
                  <span className="text-sm font-bold">{Math.round(exercise.average_score || 0)}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-green-600" />
                    <span className="text-sm">{t('exercises.created')}</span>
                  </div>
                  <span className="text-sm">{new Date(exercise.created_at).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-purple-600" />
                    <span className="text-sm">{t('exercises.lastUpdated')}</span>
                  </div>
                  <span className="text-sm">{new Date(exercise.updated_at).toLocaleDateString()}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Delete Dialog */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t('exercises.deleteDialog.title')}</DialogTitle>
              <DialogDescription>
                {t('exercises.deleteDialog.description', { title: exercise.title })}
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
    </TeacherPageLayout>
  )
}

export default ViewLessonExercisePage
