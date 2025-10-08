import React, { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { DashboardLayout } from '../../components/layout/Layout'
import { useLanguage } from '../../hooks/useLanguage'
import { useAuth } from '../../hooks/useAuth'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import { Textarea } from '../../components/ui/textarea'
import {
  Loader2,
  BookOpen,
  CheckCircle,
  Clock,
  ArrowLeft,
  Info,
  Layers,
  Send,
  RotateCcw,
  AlertCircle,
} from 'lucide-react'
import { exerciseService } from '../../services/exercises'
import { ROUTES } from '../../utils/constants'

const SUPPORTED_AUTO_TYPES = ['qcm_single', 'qcm_multiple', 'true_false']
const TEXT_TYPES = ['open_short', 'open_long', 'fill_blank']

const StudentExerciseEntryPage = () => {
  const { t, currentLanguage } = useLanguage()
  const { user } = useAuth()
  const { exerciseId } = useParams()
  const location = useLocation()
  const navigate = useNavigate()

  const [exercise, setExercise] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [attemptState, setAttemptState] = useState('preview') // preview | in-progress | submitted
  const [submission, setSubmission] = useState(null)
  const [answers, setAnswers] = useState({})
  const [startLoading, setStartLoading] = useState(false)
  const [submitLoading, setSubmitLoading] = useState(false)
  const [submissionResult, setSubmissionResult] = useState(null)

  const lessonIdFromState = location.state?.lessonId || null

  useEffect(() => {
    const fetchExercise = async () => {
      if (!exerciseId) {
        setError(t('exercises.invalidExercise', 'Exercise not found'))
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)
        const response = await exerciseService.getExerciseById(exerciseId)
        if (response.success) {
          setExercise(response.data)
        } else {
          setError(response.error || t('exercises.loadError', 'Unable to load this exercise right now.'))
        }
      } catch (err) {
        console.error('Failed to load exercise details:', err)
        setError(t('exercises.loadError', 'Unable to load this exercise right now.'))
      } finally {
        setLoading(false)
      }
    }

    fetchExercise()
  }, [exerciseId, t])

  const goBackToLesson = () => {
    if (lessonIdFromState) {
      navigate(`/student/lessons/${lessonIdFromState}`)
      return
    }

    if (exercise?.lesson) {
      navigate(`/student/lessons/${exercise.lesson}`)
    } else {
      navigate(ROUTES.LESSONS.LIST)
    }
  }

  const lessonTitle = useMemo(() => {
    if (!exercise) return ''
    const lessonDetails = exercise.lesson_details || exercise.lesson
    if (lessonDetails && typeof lessonDetails === 'object') {
      return lessonDetails.title || lessonDetails.name || ''
    }
    return exercise.lesson_name || ''
  }, [exercise])

  const localizedTitle = useMemo(() => {
    if (!exercise) return ''
    const { title, title_arabic, title_french, title_fr } = exercise

    switch (currentLanguage) {
      case 'ar':
        return title_arabic || title || title_french || ''
      case 'fr':
        return title_french || title_fr || title || title_arabic || ''
      default:
        return title || title_arabic || title_french || ''
    }
  }, [exercise, currentLanguage])

  const buildInitialAnswers = (exerciseData, existingAnswers = []) => {
    const initial = {}
    if (!exerciseData?.questions) return initial

    const existingByQuestion = {}
    existingAnswers.forEach((answer) => {
      const questionId = answer?.question?.id ?? answer?.question
      if (questionId) {
        existingByQuestion[questionId] = answer
      }
    })

    exerciseData.questions.forEach((question) => {
      const existing = existingByQuestion[question.id]
      const existingChoices =
        existing?.selected_choices?.map((choice) => choice.id) ||
        existing?.selected_choice_ids ||
        []

      initial[question.id] = {
        textAnswer: existing?.text_answer || '',
        selectedChoices: existingChoices.map((value) => String(value)),
      }
    })

    return initial
  }

  const handleStartExercise = async () => {
    if (!exercise) return

    try {
      setStartLoading(true)
      const response = await exerciseService.startExercise(exercise.id)
      if (!response.success) {
        setError(response.error || t('exercises.startError', 'Unable to start this exercise.'))
        return
      }

      const submissionData = response.data?.submission || response.data || null
      setSubmission(submissionData)
      setAnswers(buildInitialAnswers(exercise, submissionData?.answers || []))
      setAttemptState('in-progress')
      setSubmissionResult(null)
      setError(null)
    } catch (err) {
      console.error('Failed to start exercise:', err)
      setError(t('exercises.startError', 'Unable to start this exercise.'))
    } finally {
      setStartLoading(false)
    }
  }

  const handleRetakeExercise = () => {
    setAnswers(buildInitialAnswers(exercise))
    setSubmission(null)
    setSubmissionResult(null)
    setAttemptState('preview')
  }

  const updateSelectedChoices = (questionId, updater) => {
    setAnswers((prev) => {
      const current = prev[questionId] || { textAnswer: '', selectedChoices: [] }
      const rawNext = typeof updater === 'function' ? updater(current.selectedChoices || []) : updater
      const normalizedNext = (Array.isArray(rawNext) ? rawNext : [rawNext])
        .filter((value) => value !== undefined && value !== null)
        .map((value) => String(value))

      return {
        ...prev,
        [questionId]: {
          ...current,
          selectedChoices: normalizedNext,
        },
      }
    })
  }
  const updateMultipleSelection = (questionId, choiceKey, checked) => {
    updateSelectedChoices(questionId, (prevSelected) => {
      const normalized = Array.isArray(prevSelected) ? prevSelected.map((value) => String(value)) : []
      const set = new Set(normalized)
      if (checked) {
        set.add(String(choiceKey))
      } else {
        set.delete(String(choiceKey))
      }
      return Array.from(set)
    })
  }
  const updateTextAnswer = (questionId, value) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: {
        ...(prev[questionId] || { selectedChoices: [] }),
        textAnswer: value,
      },
    }))
  }

  const answeredCount = useMemo(() => {
    if (!exercise?.questions?.length) return 0
    return exercise.questions.reduce((count, question) => {
      const answer = answers[question.id]
      if (!answer) return count

      if (SUPPORTED_AUTO_TYPES.includes(question.question_type)) {
        return answer.selectedChoices?.length ? count + 1 : count
      }

      if (TEXT_TYPES.includes(question.question_type)) {
        return answer.textAnswer?.trim() ? count + 1 : count
      }

      // Fallback for advanced types: consider answered when text provided
      return answer.textAnswer?.trim() ? count + 1 : count
    }, 0)
  }, [answers, exercise?.questions])

  const allRequiredAnswered = useMemo(() => {
    if (!exercise?.questions?.length) return false
    return exercise.questions.every((question) => {
      if (!question.is_required) return true
      const answer = answers[question.id]
      if (!answer) return false

      if (SUPPORTED_AUTO_TYPES.includes(question.question_type)) {
        return (answer.selectedChoices || []).length > 0
      }

      if (TEXT_TYPES.includes(question.question_type)) {
        return Boolean(answer.textAnswer && answer.textAnswer.trim())
      }

      return Boolean(answer.textAnswer && answer.textAnswer.trim())
    })
  }, [answers, exercise?.questions])

  const handleSubmitExercise = async () => {
    if (!exercise) return

    const payload = {
      answers: (exercise.questions || []).map((question) => {
        const rawChoices = answers[question.id]?.selectedChoices || []
        const selectedChoiceIds = rawChoices
          .map((choiceId) => Number(choiceId))
          .filter((value) => !Number.isNaN(value))

        return {
          question: question.id,
          text_answer: (answers[question.id]?.textAnswer || '').trim(),
          selected_choice_ids: selectedChoiceIds,
        }
      }),
    }

    if (submission?.id) {
      payload.submission_id = submission.id
    }

    try {
      setSubmitLoading(true)
      const response = await exerciseService.submitExercise(exercise.id, payload)
      if (!response.success) {
        setError(response.error || t('exercises.submitError', 'Unable to submit your answers right now.'))
        return
      }

      const submissionData = response.data?.submission || response.data || null
      if (submissionData) {
        setSubmission(submissionData)
      }

      setSubmissionResult({
        message: response.data?.message || response.message || t('exercises.submitSuccess', 'Exercise submitted successfully'),
        submission: submissionData,
      })
      setAttemptState('submitted')
      setError(null)
    } catch (err) {
      console.error('Failed to submit exercise:', err)
      setError(t('exercises.submitError', 'Unable to submit your answers right now.'))
    } finally {
      setSubmitLoading(false)
    }
  }

const renderChoices = (question) => {
  const questionId = question.id
  const selected = answers[questionId]?.selectedChoices || []
  const choices = Array.isArray(question.choices) ? question.choices : []

  if (!choices.length) {
    return (
      <div className="rounded-md border border-dashed p-4 text-sm text-muted-foreground">
        {t('exercises.noChoices', 'Choices are not configured for this question.')}
      </div>
    )
  }

  const isMultiple = question.question_type === 'qcm_multiple'

  return (
    <div className="space-y-2">
      {choices.map((choice, index) => {
        const rawId = choice.id ?? choice.value ?? `${questionId}-${index}`
        const choiceKey = String(rawId)
        const isChecked = selected.includes(choiceKey)
        const label = currentLanguage === 'ar' && choice.choice_text_arabic
          ? choice.choice_text_arabic
          : choice.choice_text || choice.label || choice.value

        return (
          <label
            key={choice.id ?? choiceKey}
            className={`flex items-center gap-2 rounded-md border p-3 text-sm transition-colors ${isChecked ? 'border-primary bg-primary/10' : 'hover:bg-muted/40'}`}
            dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}
          >
            <input
              type={isMultiple ? 'checkbox' : 'radio'}
              name={`question-${questionId}`}
              value={choiceKey}
              checked={isChecked}
              onChange={(event) => {
                if (isMultiple) {
                  updateMultipleSelection(questionId, choiceKey, event.target.checked)
                } else {
                  updateSelectedChoices(questionId, [choiceKey])
                }
              }}
              className="h-4 w-4"
            />
            <span className="flex-1 text-sm">
              {label}
            </span>
          </label>
        )
      })}
    </div>
  )
}
  const renderQuestion = (question, index) => {
    const questionId = question.id
    const answer = answers[questionId] || { textAnswer: '', selectedChoices: [] }
    const localizedQuestionText = currentLanguage === 'ar' && question.question_text_arabic
      ? question.question_text_arabic
      : question.question_text

    const hint = question.hint || question.hint_text
    const explanation = question.explanation || question.explanation_text

    return (
      <Card key={questionId} className="border-primary/10 shadow-sm">
        <CardHeader className="space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base">
                {t('exercises.question', 'Question')} #{index + 1}
              </CardTitle>
              <p className="text-sm text-muted-foreground" dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
                {localizedQuestionText}
              </p>
            </div>
            <Badge variant="outline">{question.points} {t('exercises.points', 'points')}</Badge>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <Badge variant="secondary">{t(`exercises.questionTypes.${question.question_type}`, question.question_type)}</Badge>
            {!question.is_required && (
              <Badge variant="outline">{t('common.optional', 'Optional')}</Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {SUPPORTED_AUTO_TYPES.includes(question.question_type) && renderChoices(question)}

          {TEXT_TYPES.includes(question.question_type) && (
            <Textarea
              value={answer.textAnswer}
              onChange={(event) => updateTextAnswer(questionId, event.target.value)}
              placeholder={t('exercises.writeAnswer', 'Write your answer here...')}
              rows={question.question_type === 'open_long' ? 6 : 4}
            />
          )}

          {!SUPPORTED_AUTO_TYPES.includes(question.question_type) &&
            !TEXT_TYPES.includes(question.question_type) && (
              <div className="space-y-2">
                <AlertCircle className="h-4 w-4 text-amber-500" />
                <p className="text-sm text-muted-foreground">
                  {t('exercises.unsupportedTypeFallback', 'This question type is not fully interactive yet. Please describe your answer in the box below.')}
                </p>
                <Textarea
                  value={answer.textAnswer}
                  onChange={(event) => updateTextAnswer(questionId, event.target.value)}
                  placeholder={t('exercises.describeAnswer', 'Describe your answer here...')}
                  rows={5}
                />
              </div>
            )}

          {hint && (
            <div className="rounded-md bg-muted/40 p-3 text-sm">
              <p className="font-medium">{t('exercises.hint', 'Hint')}</p>
              <p className="text-muted-foreground">{hint}</p>
            </div>
          )}

          {explanation && attemptState === 'submitted' && (
            <div className="rounded-md border border-green-200 bg-green-50 p-3 text-sm">
              <p className="font-medium text-green-700">{t('exercises.solution', 'Solution')}</p>
              <p className="text-green-700/80">{explanation}</p>
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  const renderProgressCard = () => {
    if (!exercise) return null

    const totalQuestions = exercise.questions?.length || exercise.questions_count || 0

    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            {t('exercises.exerciseOverview', 'Exercise overview')}
          </CardTitle>
          <CardDescription>
            {t('exercises.exerciseOverviewDescription', 'Preview key information before you start practicing.')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-muted-foreground">
          {exercise.description && (
            <p className="whitespace-pre-line">{exercise.description}</p>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="flex items-center gap-2">
              <Info className="h-4 w-4" />
              <span>{totalQuestions} {t('lessons.questions', 'questions')}</span>
            </div>
            {exercise.estimated_duration && (
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{exercise.estimated_duration} {t('lessons.minutes', 'min')}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              <span>{exercise.total_points} {t('lessons.points', 'points')}</span>
            </div>
            {lessonTitle && (
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                <span>{lessonTitle}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  const renderSidebar = () => (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">{t('exercises.exerciseStatus', 'Exercise status')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm text-muted-foreground">
        <div className="flex items-center justify-between">
          <span>{t('common.status', 'Status')}</span>
          <Badge variant={exercise?.is_published === false ? 'secondary' : 'default'}>
            {exercise?.is_published === false ? t('common.draft', 'Draft') : t('common.published', 'Published')}
          </Badge>
        </div>
        {submission && (
          <div className="flex items-center justify-between">
            <span>{t('exercises.attempt', 'Attempt')}</span>
            <span className="font-medium">#{submission.attempt_number || 1}</span>
          </div>
        )}
        <div className="flex items-center justify-between">
          <span>{t('exercises.answered', 'Answered')}</span>
          <span className="font-medium">{answeredCount}/{exercise?.questions?.length || 0}</span>
        </div>
        {exercise?.updated_at && (
          <div className="flex items-center justify-between">
            <span>{t('lessons.updated', 'Updated')}</span>
            <span>{new Date(exercise.updated_at).toLocaleDateString()}</span>
          </div>
        )}
        {exercise?.allow_multiple_attempts === false && (
          <div className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-700">
            {t('exercises.singleAttemptOnly', 'This exercise can be attempted once. Submit carefully!')}
          </div>
        )}
      </CardContent>
    </Card>
  )

  const renderSubmissionSummary = () => (
    <Card className="border-green-200 bg-green-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base text-green-700">
          <CheckCircle className="h-4 w-4" />
          {t('exercises.submissionReceived', 'Your answers were submitted!')}
        </CardTitle>
        <CardDescription className="text-green-700/80">
          {t('exercises.submissionProcessing', 'Your teacher will review your answers or the system will auto-grade where possible.')}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 text-sm text-green-700/90">
        {submissionResult?.message && <p>{submissionResult.message}</p>}
        {submissionResult?.submission?.total_score && (
          <p>
            {t('exercises.score', 'Score')}: <strong>{submissionResult.submission.total_score}</strong> / {exercise?.total_points}
          </p>
        )}
        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant="outline" onClick={goBackToLesson}>
            {t('exercises.backToLesson', 'Back to lesson overview')}
          </Button>
          {exercise?.allow_multiple_attempts !== false && (
            <Button size="sm" variant="ghost" onClick={handleRetakeExercise}>
              <RotateCcw className="h-4 w-4 mr-1" />
              {t('exercises.retryExercise', 'Try again')}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )

  if (loading) {
    return (
      <DashboardLayout user={user}>
        <div className="flex h-full items-center justify-center py-20">
          <div className="flex flex-col items-center gap-3 text-muted-foreground">
            <Loader2 className="h-8 w-8 animate-spin" />
            <p>{t('common.loading', 'Loading...')}</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (error) {
    return (
      <DashboardLayout user={user}>
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={goBackToLesson}>
              <ArrowLeft className="h-4 w-4" />
              {t('common.back', 'Back')}
            </Button>
            <h1 className="text-3xl font-bold tracking-tight">{t('exercises.exerciseDetails', 'Exercise details')}</h1>
          </div>
          <Card className="border-destructive">
            <CardContent className="py-10 text-center space-y-3">
              <Layers className="h-10 w-10 text-destructive mx-auto" />
              <p className="text-muted-foreground">{error}</p>
              <Button variant="outline" onClick={goBackToLesson}>
                {t('common.backToList', 'Back to lessons')}
              </Button>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout user={user}>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={goBackToLesson}>
              <ArrowLeft className="h-4 w-4" />
              {t('common.back', 'Back')}
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight">{localizedTitle || t('exercises.exerciseDetails', 'Exercise details')}</h1>
              {lessonTitle && (
                <p className="text-muted-foreground mt-1">
                  {t('lessons.lesson', 'Lesson')}: {lessonTitle}
                </p>
              )}
            </div>
          </div>

          {attemptState === 'preview' && (
            <Button onClick={handleStartExercise} disabled={startLoading} className="flex items-center gap-2">
              {startLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <BookOpen className="h-4 w-4" />}
              {startLoading ? t('common.starting', 'Starting...') : t('common.start', 'Start')}
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {renderProgressCard()}

            {attemptState === 'preview' && (
              <Card className="bg-muted/40">
                <CardHeader>
                  <CardTitle className="text-base">{t('exercises.readyToPractice', 'Ready to practice?')}</CardTitle>
                  <CardDescription>
                    {t('exercises.readyToPracticeDescription', 'Start the exercise when you are ready. You can answer at your own pace and submit when finished.')}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-3">
                  <Button onClick={handleStartExercise} disabled={startLoading}>
                    {startLoading ? t('common.starting', 'Starting...') : t('exercises.startExercise', 'Start exercise')}
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    {t('exercises.progressNote', 'Your progress will be saved when you submit. If you leave before submitting, you may need to restart depending on teacher settings.')}
                  </p>
                </CardContent>
              </Card>
            )}

            {attemptState !== 'preview' && exercise?.questions?.length > 0 && (
              <div className="space-y-4">
                {exercise.questions.map((question, index) => renderQuestion(question, index))}

                {attemptState === 'in-progress' && (
                  <div className="flex flex-col gap-3 rounded-md border border-primary/20 bg-primary/5 p-4">
                    <p className="text-sm text-muted-foreground">
                      {t('exercises.submitReminder', 'Review your answers before submitting. You can only submit once if multiple attempts are disabled.')}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        onClick={handleSubmitExercise}
                        disabled={!allRequiredAnswered || submitLoading}
                        className="flex items-center gap-2"
                      >
                        {submitLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                        {submitLoading ? t('common.submitting', 'Submitting...') : t('common.submit', 'Submit')}
                      </Button>
                      {!allRequiredAnswered && (
                        <Badge variant="outline" className="text-xs">
                          {t('exercises.answerAllRequired', 'Answer all required questions to submit')}
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                {attemptState === 'submitted' && renderSubmissionSummary()}
              </div>
            )}
          </div>

          <div className="space-y-6">
            {renderSidebar()}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default StudentExerciseEntryPage





