import React, { useEffect, useMemo, useState, useCallback } from 'react'
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
import OrderingQuestion from '../../components/exercise/OrderingQuestion'
import MatchingQuestion from '../../components/exercise/MatchingQuestion'
import FillBlankQuestion from '../../components/exercise/FillBlankQuestion'
import { ExerciseProgressHeader } from '../../components/exercise/ExerciseProgressHeader'
import { QuestionContainer } from '../../components/exercise/QuestionContainer'
import { QuestionNavigation } from '../../components/exercise/QuestionNavigation'
import { ReviewScreen } from '../../components/exercise/ReviewScreen'
import { ImprovedMultipleChoiceQuestion } from '../../components/exercise/ImprovedMultipleChoiceQuestion'
import { TextWithMath, useMathText } from '../../components/exercise/MathRenderer'
import 'katex/dist/katex.min.css'
import '../../styles/katex-custom.css'

const SUPPORTED_AUTO_TYPES = ['qcm_single', 'qcm_multiple', 'true_false']
const TEXT_TYPES = ['open_short', 'open_long']
const INTERACTIVE_TYPES = ['ordering', 'matching', 'fill_blank']

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
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [showReview, setShowReview] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(null)

  const lessonIdFromState = location.state?.lessonId || null

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
        const nested = value.secure_url || value.url || value.path || value.src || null
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
        // For ordering questions
        orderingSequence: existing?.ordering_sequence || [],
        // For matching questions
        matchingAnswers: existing?.matching_answers || [],
        // For fill_blank questions
        blankAnswers: existing?.blank_answers || [],
      }
    })

    return initial
  }

  const handleSaveDraft = useCallback(async () => {
    if (!exercise || !submission) return

    try {
      // Save draft silently without showing toast
      if (exerciseService.saveDraft) {
        await exerciseService.saveDraft(exercise.id, { answers })
      }
    } catch (err) {
      console.error('Failed to save draft:', err)
    }
  }, [exercise, submission, answers])

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

      // Initialize timer if exercise is timed
      if (exercise.is_timed && exercise.estimated_duration) {
        setTimeRemaining(exercise.estimated_duration * 60) // Convert minutes to seconds
      }
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
        ...(prev[questionId] || { selectedChoices: [], orderingSequence: [], matchingAnswers: [], blankAnswers: [] }),
        textAnswer: value,
      },
    }))
  }

  // Handler for ordering questions
  const updateOrderingSequence = (questionId, sequence) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: {
        ...(prev[questionId] || { selectedChoices: [], textAnswer: '', matchingAnswers: [], blankAnswers: [] }),
        orderingSequence: sequence,
      },
    }))
  }

  // Handler for matching questions
  const updateMatchingAnswers = (questionId, matches) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: {
        ...(prev[questionId] || { selectedChoices: [], textAnswer: '', orderingSequence: [], blankAnswers: [] }),
        matchingAnswers: matches,
      },
    }))
  }

  // Handler for fill_blank questions
  const updateBlankAnswers = (questionId, blankAnswers) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: {
        ...(prev[questionId] || { selectedChoices: [], textAnswer: '', orderingSequence: [], matchingAnswers: [] }),
        blankAnswers: blankAnswers,
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

      if (question.question_type === 'ordering') {
        return answer.orderingSequence?.length ? count + 1 : count
      }

      if (question.question_type === 'matching') {
        return answer.matchingAnswers?.length ? count + 1 : count
      }

      if (question.question_type === 'fill_blank') {
        return answer.blankAnswers?.length ? count + 1 : count
      }

      // Fallback for other types
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

      if (question.question_type === 'ordering') {
        const expectedLength = question.ordering_items?.length || 0
        return (answer.orderingSequence || []).length === expectedLength
      }

      if (question.question_type === 'matching') {
        const expectedLength = question.matching_pairs?.length || 0
        return (answer.matchingAnswers || []).length === expectedLength
      }

      if (question.question_type === 'fill_blank') {
        const expectedLength = question.blanks?.length || 0
        return (answer.blankAnswers || []).length === expectedLength
      }

      return Boolean(answer.textAnswer && answer.textAnswer.trim())
    })
  }, [answers, exercise?.questions])

  const handleSubmitExercise = useCallback(async () => {
    if (!exercise) return

    const payload = {
      answers: (exercise.questions || []).map((question) => {
        const answer = answers[question.id] || {}
        const rawChoices = answer.selectedChoices || []
        const selectedChoiceIds = rawChoices
          .map((choiceId) => Number(choiceId))
          .filter((value) => !Number.isNaN(value))

        const answerPayload = {
          question: question.id,
          text_answer: (answer.textAnswer || '').trim(),
          selected_choice_ids: selectedChoiceIds,
        }

        // Add ordering sequence if present
        if (question.question_type === 'ordering' && answer.orderingSequence) {
          answerPayload.ordering_sequence = answer.orderingSequence
        }

        // Add matching answers if present
        if (question.question_type === 'matching' && answer.matchingAnswers) {
          answerPayload.matching_answers = answer.matchingAnswers
        }

        // Add blank answers if present
        if (question.question_type === 'fill_blank' && answer.blankAnswers) {
          answerPayload.blank_answers = answer.blankAnswers
        }

        return answerPayload
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
  }, [exercise, answers, submission, t])

  // Timer countdown effect
  useEffect(() => {
    if (!exercise?.is_timed || !timeRemaining || attemptState !== 'in-progress') return

    const interval = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          handleSubmitExercise()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [exercise?.is_timed, timeRemaining, attemptState, handleSubmitExercise])

  // Auto-save draft effect (debounced)
  useEffect(() => {
    if (attemptState !== 'in-progress' || !Object.keys(answers).length) return

    const timeout = setTimeout(() => {
      handleSaveDraft()
    }, 3000) // Save every 3 seconds after changes

    return () => clearTimeout(timeout)
  }, [answers, attemptState, handleSaveDraft])

  // Get current question and answered questions set - MUST be before any early returns
  const currentQuestion = exercise?.questions?.[currentQuestionIndex]
  const answeredQuestions = useMemo(() => {
    const set = new Set()
    exercise?.questions?.forEach((question, index) => {
      const answer = answers[question.id]
      if (!answer) return

      // Check if question is answered based on type
      if (SUPPORTED_AUTO_TYPES.includes(question.question_type)) {
        if (answer.selectedChoices?.length > 0) set.add(index + 1)
      } else if (TEXT_TYPES.includes(question.question_type)) {
        if (answer.textAnswer?.trim()) set.add(index + 1)
      } else if (question.question_type === 'ordering') {
        if (answer.orderingSequence?.length > 0) set.add(index + 1)
      } else if (question.question_type === 'matching') {
        if (answer.matchingAnswers?.length > 0) set.add(index + 1)
      } else if (question.question_type === 'fill_blank') {
        if (answer.blankAnswers?.length > 0) set.add(index + 1)
      }
    })
    return set
  }, [answers, exercise?.questions])

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

        // Process label for math formulas
        const processedLabel = useMathText(label)

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
            <span
              className="flex-1 text-sm"
              dangerouslySetInnerHTML={{ __html: processedLabel }}
            />
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

    const questionImage = getQuestionImageSource(question)

    const hint = question.hint || question.hint_text
    const explanation = question.explanation || question.explanation_text

    // Process question text for math formulas
    const processedQuestionText = useMathText(localizedQuestionText)

    return (
      <Card key={questionId} className="border-primary/10 shadow-sm">
        <CardHeader className="space-y-2">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base">
                {t('exercises.question', 'Question')} #{index + 1}
              </CardTitle>
              <p
                className="text-sm text-muted-foreground"
                dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}
                dangerouslySetInnerHTML={{ __html: processedQuestionText }}
              />
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
          {questionImage && (
            <div className="rounded-lg border border-muted/40 bg-muted/20 overflow-hidden">
              <img
                src={questionImage}
                alt={t('lessons.imagePreviewAlt', 'Question image preview')}
                className="w-full h-auto max-h-80 object-contain bg-background"
              />
            </div>
          )}

          {SUPPORTED_AUTO_TYPES.includes(question.question_type) && renderChoices(question)}

          {TEXT_TYPES.includes(question.question_type) && (
            <Textarea
              value={answer.textAnswer}
              onChange={(event) => updateTextAnswer(questionId, event.target.value)}
              placeholder={t('exercises.writeAnswer', 'Write your answer here...')}
              rows={question.question_type === 'open_long' ? 6 : 4}
            />
          )}

          {question.question_type === 'ordering' && (
            <OrderingQuestion
              question={question}
              currentOrder={answer.orderingSequence}
              onChange={(sequence) => updateOrderingSequence(questionId, sequence)}
              currentLanguage={currentLanguage}
              disabled={attemptState === 'submitted'}
            />
          )}

          {question.question_type === 'matching' && (
            <MatchingQuestion
              question={question}
              matches={answer.matchingAnswers}
              onChange={(matches) => updateMatchingAnswers(questionId, matches)}
              currentLanguage={currentLanguage}
              disabled={attemptState === 'submitted'}
            />
          )}

          {question.question_type === 'fill_blank' && (
            <FillBlankQuestion
              question={question}
              blankAnswers={answer.blankAnswers}
              onChange={(blankAnswers) => updateBlankAnswers(questionId, blankAnswers)}
              currentLanguage={currentLanguage}
              disabled={attemptState === 'submitted'}
            />
          )}

          {!SUPPORTED_AUTO_TYPES.includes(question.question_type) &&
            !TEXT_TYPES.includes(question.question_type) &&
            !INTERACTIVE_TYPES.includes(question.question_type) && (
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

  const renderInstructions = () => {
    if (!exercise?.instructions) return null

    return (
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2 text-blue-700">
            <Info className="h-4 w-4" />
            {t('exercises.instructions', 'Instructions')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className="prose prose-sm max-w-none text-blue-900/90"
            dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}
            dangerouslySetInnerHTML={{ __html: exercise.instructions }}
          />
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

  // Render current question content
  const renderCurrentQuestion = () => {
    if (!currentQuestion) return null

    const questionId = currentQuestion.id
    const answer = answers[questionId] || { textAnswer: '', selectedChoices: [], orderingSequence: [], matchingAnswers: [], blankAnswers: [] }
    const localizedQuestionText = currentLanguage === 'ar' && currentQuestion.question_text_arabic
      ? currentQuestion.question_text_arabic
      : currentQuestion.question_text

    const questionImage = getQuestionImageSource(currentQuestion)
    const hint = currentQuestion.hint || currentQuestion.hint_text

    return (
      <QuestionContainer
        questionNumber={currentQuestionIndex + 1}
        totalQuestions={exercise.questions.length}
        points={currentQuestion.points}
        questionText={localizedQuestionText}
        questionType={currentQuestion.question_type}
        questionImage={questionImage}
        hint={hint}
        explanation={currentQuestion.explanation}
        showExplanation={attemptState === 'submitted'}
      >
        {/* Render question type specific component */}
        {SUPPORTED_AUTO_TYPES.includes(currentQuestion.question_type) && (
          <ImprovedMultipleChoiceQuestion
            choices={currentQuestion.choices || []}
            allowMultiple={currentQuestion.question_type === 'qcm_multiple'}
            selectedChoices={answer.selectedChoices || []}
            onAnswerChange={(choices) => updateSelectedChoices(questionId, choices)}
            questionId={questionId}
          />
        )}

        {TEXT_TYPES.includes(currentQuestion.question_type) && (
          <Textarea
            value={answer.textAnswer}
            onChange={(event) => updateTextAnswer(questionId, event.target.value)}
            placeholder={t('exercises.writeAnswer', 'اكتب إجابتك هنا...')}
            rows={currentQuestion.question_type === 'open_long' ? 6 : 4}
            disabled={attemptState === 'submitted'}
          />
        )}

        {currentQuestion.question_type === 'ordering' && (
          <OrderingQuestion
            question={currentQuestion}
            currentOrder={answer.orderingSequence}
            onChange={(sequence) => updateOrderingSequence(questionId, sequence)}
            currentLanguage={currentLanguage}
            disabled={attemptState === 'submitted'}
          />
        )}

        {currentQuestion.question_type === 'matching' && (
          <MatchingQuestion
            question={currentQuestion}
            matches={answer.matchingAnswers}
            onChange={(matches) => updateMatchingAnswers(questionId, matches)}
            currentLanguage={currentLanguage}
            disabled={attemptState === 'submitted'}
          />
        )}

        {currentQuestion.question_type === 'fill_blank' && (
          <FillBlankQuestion
            question={currentQuestion}
            blankAnswers={answer.blankAnswers}
            onChange={(blankAnswers) => updateBlankAnswers(questionId, blankAnswers)}
            currentLanguage={currentLanguage}
            disabled={attemptState === 'submitted'}
          />
        )}

        {!SUPPORTED_AUTO_TYPES.includes(currentQuestion.question_type) &&
          !TEXT_TYPES.includes(currentQuestion.question_type) &&
          !INTERACTIVE_TYPES.includes(currentQuestion.question_type) && (
            <div className="space-y-2">
              <AlertCircle className="h-4 w-4 text-amber-500" />
              <p className="text-sm text-muted-foreground">
                {t('exercises.unsupportedTypeFallback', 'هذا النوع من الأسئلة غير مدعوم بالكامل بعد. يرجى وصف إجابتك في المربع أدناه.')}
              </p>
              <Textarea
                value={answer.textAnswer}
                onChange={(event) => updateTextAnswer(questionId, event.target.value)}
                placeholder={t('exercises.describeAnswer', 'اكتب إجابتك هنا...')}
                rows={5}
                disabled={attemptState === 'submitted'}
              />
            </div>
          )}
      </QuestionContainer>
    )
  }

  // Show review screen
  if (showReview && attemptState === 'in-progress') {
    return (
      <DashboardLayout user={user}>
        <ReviewScreen
          questions={exercise.questions}
          answers={answers}
          onEditQuestion={(questionNum) => {
            setCurrentQuestionIndex(questionNum - 1)
            setShowReview(false)
          }}
          onSubmit={handleSubmitExercise}
          onBack={() => setShowReview(false)}
          allowMultipleAttempts={exercise?.allow_multiple_attempts !== false}
        />
      </DashboardLayout>
    )
  }

  // Main exercise view
  return (
    <DashboardLayout user={user}>
      {attemptState === 'in-progress' && (
        <>
          {/* Progress Header */}
          <ExerciseProgressHeader
            exerciseTitle={localizedTitle || exercise?.title || t('exercises.exerciseDetails', 'التمرين')}
            currentQuestion={currentQuestionIndex + 1}
            totalQuestions={exercise?.questions?.length || 0}
            timeRemaining={timeRemaining}
            onBack={goBackToLesson}
            onSaveDraft={handleSaveDraft}
          />

          {/* Question View */}
          <div className="min-h-screen bg-neutral-50 pb-6">
            <div className="max-w-4xl mx-auto space-y-4">
              {renderCurrentQuestion()}

              {/* Navigation - placed right after question */}
              <QuestionNavigation
                currentQuestion={currentQuestionIndex + 1}
                totalQuestions={exercise?.questions?.length || 0}
                answeredQuestions={answeredQuestions}
                onPrevious={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                onNext={() => setCurrentQuestionIndex(prev => Math.min(exercise.questions.length - 1, prev + 1))}
                onJumpTo={(questionNum) => setCurrentQuestionIndex(questionNum - 1)}
                onSaveDraft={handleSaveDraft}
                onReview={() => setShowReview(true)}
              />
            </div>
          </div>
        </>
      )}

      {attemptState === 'preview' && (
        <div className="space-y-6 p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm" onClick={goBackToLesson}>
                <ArrowLeft className="h-4 w-4" />
                {t('common.back', 'رجوع')}
              </Button>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">{localizedTitle || t('exercises.exerciseDetails', 'تفاصيل التمرين')}</h1>
                {lessonTitle && (
                  <p className="text-muted-foreground mt-1">
                    {t('lessons.lesson', 'الدرس')}: {lessonTitle}
                  </p>
                )}
              </div>
            </div>

            <Button onClick={handleStartExercise} disabled={startLoading} className="flex items-center gap-2">
              {startLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <BookOpen className="h-4 w-4" />}
              {startLoading ? t('common.starting', 'جاري البدء...') : t('common.start', 'بدء')}
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {renderProgressCard()}
              {renderInstructions()}

              <Card className="bg-muted/40">
                <CardHeader>
                  <CardTitle className="text-base">{t('exercises.readyToPractice', 'هل أنت مستعد للممارسة؟')}</CardTitle>
                  <CardDescription>
                    {t('exercises.readyToPracticeDescription', 'ابدأ التمرين عندما تكون مستعداً. يمكنك الإجابة بالسرعة التي تناسبك وإرسال الإجابات عند الانتهاء.')}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-3">
                  <Button onClick={handleStartExercise} disabled={startLoading}>
                    {startLoading ? t('common.starting', 'جاري البدء...') : t('exercises.startExercise', 'بدء التمرين')}
                  </Button>
                  <p className="text-xs text-muted-foreground">
                    {t('exercises.progressNote', 'سيتم حفظ تقدمك عند الإرسال. إذا غادرت قبل الإرسال، قد تحتاج إلى إعادة البدء حسب إعدادات المعلم.')}
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              {renderSidebar()}
            </div>
          </div>
        </div>
      )}

      {attemptState === 'submitted' && (
        <div className="space-y-6 p-6">
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm" onClick={goBackToLesson}>
              <ArrowLeft className="h-4 w-4" />
              {t('common.back', 'رجوع')}
            </Button>
            <h1 className="text-3xl font-bold tracking-tight">{localizedTitle || t('exercises.exerciseDetails', 'تفاصيل التمرين')}</h1>
          </div>

          {renderSubmissionSummary()}
        </div>
      )}
    </DashboardLayout>
  )
}

export default StudentExerciseEntryPage





