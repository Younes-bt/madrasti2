import React, { useEffect, useState, useMemo, useRef, useLayoutEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import {
  ArrowLeft,
  BookOpen,
  Clock,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Send,
  Save,
  Calendar,
  FileText,
  ChevronUp,
  ChevronDown,
  Shuffle,
  GripVertical,
} from 'lucide-react'

import { DashboardLayout } from '../../components/layout/Layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import { Alert, AlertDescription } from '../../components/ui/alert'
import { Textarea } from '../../components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '../../components/ui/radio-group'
import { Checkbox } from '../../components/ui/checkbox'
import { Label } from '../../components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select'

import { useLanguage } from '../../hooks/useLanguage'
import { homeworkService } from '../../services'
import { ROUTES } from '../../utils/constants'

const SUPPORTED_AUTO_TYPES = ['qcm_single', 'qcm_multiple', 'true_false', 'fill_blank', 'ordering', 'matching']

const shuffleArray = (array = []) => {
  const copy = [...array]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

const buildDefaultAnswerState = (question) => {
  if (!question) return {}
  const type = question.question_type

  switch (type) {
    case 'qcm_single':
    case 'qcm_multiple':
    case 'true_false':
      return { selected_choices: [] }
    case 'open_short':
    case 'open_long':
      return { text_answer: '' }
    case 'fill_blank':
      return {
        blank_answers: (question.blanks || []).map((blank) => ({
          blank: blank.id,
          selected_option: null
        }))
      }
    case 'ordering':
      return {
        ordering_sequence: shuffleArray((question.ordering_items || []).map((item) => item.id))
      }
    case 'matching':
      return {
        matching_answers: (question.matching_pairs || []).map((pair) => ({
          left_pair: pair.id,
          selected_right_pair: null
        }))
      }
    default:
      return {}
  }
}

const StudentHomeworkWorkPage = () => {
  const navigate = useNavigate()
  const { currentLanguage } = useLanguage()
  const { id: homeworkId } = useParams()

  const [homework, setHomework] = useState(null)
  const [submission, setSubmission] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [answers, setAnswers] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [draggedItem, setDraggedItem] = useState(null)
  const [dragOverIndex, setDragOverIndex] = useState(null)

  useEffect(() => {
    const fetchHomeworkDetails = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await homeworkService.getHomeworkById(homeworkId)
        setHomework(response)

        const questionLookup = {}
        ;(response.questions || []).forEach((question) => {
          questionLookup[question.id] = question
        })

        const initialAnswers = {}

        if (response.student_submission) {
          setSubmission(response.student_submission)

          const submissionAnswers = response.student_submission.answers || []
          submissionAnswers.forEach((answer) => {
            const questionId = answer.question?.id
            if (!questionId) return

            const questionDef = questionLookup[questionId]
            const defaults = buildDefaultAnswerState(questionDef)
            const answerState = { ...defaults }

            if (answer.text_answer !== undefined && answer.text_answer !== null) {
              answerState.text_answer = answer.text_answer
            } else if (defaults.text_answer !== undefined && answerState.text_answer === undefined) {
              answerState.text_answer = ''
            }

            if (answer.selected_choices?.length) {
              answerState.selected_choices = answer.selected_choices.map((choice) => choice.id)
            } else if (defaults.selected_choices && !answerState.selected_choices) {
              answerState.selected_choices = []
            }

            if (defaults.blank_answers) {
              const blankMap = new Map((answer.blank_selections || []).map((sel) => [sel.blank, sel]))
              answerState.blank_answers = defaults.blank_answers.map((blank) => ({
                blank: blank.blank,
                selected_option: blankMap.get(blank.blank)?.selected_option ?? null
              }))
            }

            if (answer.ordering_selections?.length) {
              const ordered = [...answer.ordering_selections].sort((a, b) => a.selected_position - b.selected_position)
              answerState.ordering_sequence = ordered.map((selection) => selection.item)
            } else if (defaults.ordering_sequence && !answerState.ordering_sequence) {
              answerState.ordering_sequence = defaults.ordering_sequence
            }

            if (defaults.matching_answers) {
              const matchingMap = new Map((answer.matching_selections || []).map((sel) => [sel.left_pair, sel]))
              answerState.matching_answers = defaults.matching_answers.map((pair) => ({
                left_pair: pair.left_pair,
                selected_right_pair: matchingMap.get(pair.left_pair)?.selected_right_pair ?? null
              }))
            }

            initialAnswers[questionId] = answerState
          })
        } else {
          setSubmission(null)
        }

        ;(response.questions || []).forEach((question) => {
          const defaults = buildDefaultAnswerState(question)
          const existing = initialAnswers[question.id]

          if (existing) {
            if (defaults.blank_answers) {
              const existingMap = new Map((existing.blank_answers || []).map((entry) => [entry.blank, entry]))
              existing.blank_answers = defaults.blank_answers.map((blank) => existingMap.get(blank.blank) || blank)
            }

            if (defaults.matching_answers) {
              const existingMap = new Map((existing.matching_answers || []).map((entry) => [entry.left_pair, entry]))
              existing.matching_answers = defaults.matching_answers.map((pair) => existingMap.get(pair.left_pair) || pair)
            }

            if (defaults.ordering_sequence && (!existing.ordering_sequence || existing.ordering_sequence.length === 0)) {
              existing.ordering_sequence = defaults.ordering_sequence
            }

            if (defaults.selected_choices && !existing.selected_choices) {
              existing.selected_choices = []
            }

            if (defaults.text_answer !== undefined && existing.text_answer === undefined) {
              existing.text_answer = ''
            }

            initialAnswers[question.id] = existing
          } else {
            initialAnswers[question.id] = defaults
          }
        })

        setAnswers(initialAnswers)
      } catch (err) {
        console.error('Error fetching homework:', err)
        setError('Failed to load homework')
        toast.error('Failed to load homework')
      } finally {
        setLoading(false)
      }
    }

    if (homeworkId) {
      fetchHomeworkDetails()
    }
  }, [homeworkId])

  const handleAnswerChange = (questionId, value, type) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        [type]: value
      }
    }))
  }

  const handleChoiceSelect = (questionId, choiceId, isMultiple) => {
    setAnswers(prev => {
      const currentAnswer = prev[questionId] || { selected_choices: [] }
      let newSelectedChoices

      if (isMultiple) {
        // Multiple choice - toggle selection
        const currentChoices = currentAnswer.selected_choices || []
        if (currentChoices.includes(choiceId)) {
          newSelectedChoices = currentChoices.filter(id => id !== choiceId)
        } else {
          newSelectedChoices = [...currentChoices, choiceId]
        }
      } else {
        // Single choice - replace selection
        newSelectedChoices = [choiceId]
      }

      return {
        ...prev,
        [questionId]: {
          ...currentAnswer,
          selected_choices: newSelectedChoices
        }
      }
    })
  }

  const handleBlankOptionSelect = (questionId, blankId, optionId) => {
    setAnswers(prev => {
      const currentAnswer = prev[questionId] || {}
      const currentBlanks = currentAnswer.blank_answers || []
      const blankExists = currentBlanks.some(blank => blank.blank === blankId)
      const updatedBlanks = blankExists
        ? currentBlanks.map(blank =>
            blank.blank === blankId ? { ...blank, selected_option: optionId } : blank
          )
        : [...currentBlanks, { blank: blankId, selected_option: optionId }]

      return {
        ...prev,
        [questionId]: {
          ...currentAnswer,
          blank_answers: updatedBlanks
        }
      }
    })
  }

  const handleOrderingMove = (questionId, itemId, direction) => {
    setAnswers(prev => {
      const currentAnswer = prev[questionId] || {}
      let sequence = [...(currentAnswer.ordering_sequence || [])]
      if (!sequence.length && homework?.questions) {
        const questionDef = homework.questions.find((q) => q.id === questionId)
        if (questionDef?.ordering_items) {
          sequence = questionDef.ordering_items.map((item) => item.id)
        }
      }
      const currentIndex = sequence.indexOf(itemId)
      if (currentIndex === -1) return prev

      const targetIndex = direction === 'up'
        ? Math.max(0, currentIndex - 1)
        : Math.min(sequence.length - 1, currentIndex + 1)

      if (currentIndex === targetIndex) return prev

      ;[sequence[currentIndex], sequence[targetIndex]] = [sequence[targetIndex], sequence[currentIndex]]

      return {
        ...prev,
        [questionId]: {
          ...currentAnswer,
          ordering_sequence: sequence
        }
      }
    })
  }

  const handleOrderingShuffle = (questionId, items = []) => {
    const shuffled = shuffleArray(items.map((item) => item.id))
    setAnswers(prev => ({
      ...prev,
      [questionId]: {
        ...prev[questionId],
        ordering_sequence: shuffled
      }
    }))
  }

  const handleDragStart = (questionId, itemId, index) => {
    setDraggedItem({ questionId, itemId, index })
  }

  const handleDragOver = (e, index) => {
    e.preventDefault()
    setDragOverIndex(index)
  }

  const handleDragLeave = () => {
    setDragOverIndex(null)
  }

  const handleDrop = (questionId, targetIndex) => {
    if (!draggedItem || draggedItem.questionId !== questionId) {
      setDraggedItem(null)
      setDragOverIndex(null)
      return
    }

    setAnswers(prev => {
      const currentAnswer = prev[questionId] || {}
      let sequence = [...(currentAnswer.ordering_sequence || [])]

      const sourceIndex = draggedItem.index
      if (sourceIndex === targetIndex) {
        return prev
      }

      const [movedItem] = sequence.splice(sourceIndex, 1)
      sequence.splice(targetIndex, 0, movedItem)

      return {
        ...prev,
        [questionId]: {
          ...currentAnswer,
          ordering_sequence: sequence
        }
      }
    })

    setDraggedItem(null)
    setDragOverIndex(null)
  }

  const handleDragEnd = () => {
    setDraggedItem(null)
    setDragOverIndex(null)
  }

  const handleMatchingSelect = (questionId, leftPairId, rightPairId) => {
    setAnswers(prev => {
      const currentAnswer = prev[questionId] || {}
      const currentMatches = currentAnswer.matching_answers || []
      const matchExists = currentMatches.some(match => match.left_pair === leftPairId)
      let updatedMatches = matchExists
        ? currentMatches.map(match =>
            match.left_pair === leftPairId
              ? { ...match, selected_right_pair: rightPairId }
              : match
          )
        : [...currentMatches, { left_pair: leftPairId, selected_right_pair: rightPairId }]

      if (rightPairId === null || rightPairId === undefined) {
        updatedMatches = updatedMatches.map(match =>
          match.left_pair === leftPairId
            ? { ...match, selected_right_pair: null }
            : match
        )
      } else {
        updatedMatches = updatedMatches.map(match =>
          match.left_pair !== leftPairId && match.selected_right_pair === rightPairId
            ? { ...match, selected_right_pair: null }
            : match
        )
      }

      return {
        ...prev,
        [questionId]: {
          ...currentAnswer,
          matching_answers: updatedMatches
        }
      }
    })
  }

const renderFillBlankInline = (questionObj, blankAnswerList) => {
  const blanks = questionObj.blanks || []
  const text = questionObj.question_text || ''
  const tokens = []
  const regex = /\[(.+?)\]/g
  let lastIndex = 0
  const usedBlankIds = new Set()

    const findBlankForToken = (tokenValue) => {
      const normalized = (tokenValue || '').trim()
      if (!normalized) return null

      const byLabel = blanks.find(blank =>
        Boolean(blank.label) && blank.label.toLowerCase() === normalized.toLowerCase()
      )
      if (byLabel) return byLabel

      const orderNumber = parseInt(normalized.replace(/[^0-9]/g, ''), 10)
      if (!Number.isNaN(orderNumber)) {
        const byOrder = blanks.find(blank => blank.order === orderNumber)
        if (byOrder) return byOrder
      }

      const fallback = blanks.find(blank => `B${blank.order}`.toLowerCase() === normalized.toLowerCase())
      return fallback || null
    }

    text.replace(regex, (match, inner, offset) => {
      if (offset > lastIndex) {
        tokens.push({ type: 'text', value: text.slice(lastIndex, offset) })
      }

      const blank = findBlankForToken(inner)
      if (blank) {
        tokens.push({ type: 'blank', blank })
        usedBlankIds.add(blank.id)
      } else {
        tokens.push({ type: 'text', value: match })
      }

      lastIndex = offset + match.length
      return match
    })

    if (lastIndex < text.length) {
      tokens.push({ type: 'text', value: text.slice(lastIndex) })
    }

    if (!tokens.length) {
      tokens.push({ type: 'text', value: text })
    }

    if (blanks.length) {
      blanks.forEach(blank => {
        if (!usedBlankIds.has(blank.id)) {
          tokens.push({ type: 'text', value: tokens.length ? ' ' : '' })
          tokens.push({ type: 'blank', blank })
          usedBlankIds.add(blank.id)
        }
      })
    }

    return (
      <div className="text-base leading-relaxed">
        {tokens.map((token, idx) => {
          if (token.type === 'text') {
            return (
              <span key={`text-${idx}`}>
                {token.value}
              </span>
            )
          }

          const blank = token.blank
          const currentBlankAnswer = blankAnswerList.find(entry => entry.blank === blank.id)
          const selectedOption = currentBlankAnswer?.selected_option ?? null
          const selectValue = selectedOption !== null && selectedOption !== undefined
            ? selectedOption.toString()
            : '__none'

          return (
            <span key={`blank-${blank.id}-${idx}`} className="inline-block align-middle mx-1">
              <Select
                value={selectValue}
                onValueChange={(value) =>
                  handleBlankOptionSelect(
                    questionObj.id,
                    blank.id,
                    value === '__none' ? null : parseInt(value, 10)
                  )
                }
              >
                <SelectTrigger className="h-8 w-[140px] text-sm">
                  <SelectValue placeholder="Not Selected" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none">Not Selected</SelectItem>
                  {(blank.options || []).map(option => (
                    <SelectItem key={option.id} value={option.id.toString()}>
                      {option.option_text}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </span>
          )
        })}
      </div>
    )
  }

  const handleSubmit = async () => {
    try {
      setSubmitting(true)

      if (!submission) {
        toast.error('No active submission found')
        return
      }

      // Format answers for submission
      const formattedAnswers = Object.entries(answers).map(([questionId, answer]) => ({
        question: parseInt(questionId),
        text_answer: answer.text_answer || '',
        selected_choice_ids: answer.selected_choices || [],
        ...(answer.blank_answers && answer.blank_answers.length
          ? {
              blank_answers: answer.blank_answers
                .filter(blank => blank.selected_option !== null && blank.selected_option !== undefined)
                .map(blank => ({
                  blank: blank.blank,
                  selected_option: blank.selected_option
                }))
            }
          : {}),
        ...(answer.ordering_sequence && answer.ordering_sequence.length
          ? { ordering_sequence: answer.ordering_sequence }
          : {}),
        ...(answer.matching_answers && answer.matching_answers.length
          ? {
              matching_answers: answer.matching_answers
                .filter(match => match.selected_right_pair !== null && match.selected_right_pair !== undefined)
                .map(match => ({
                  left_pair: match.left_pair,
                  selected_right_pair: match.selected_right_pair
                }))
            }
          : {})
      }))

      const result = await homeworkService.submitHomework(submission.id, {
        answers: formattedAnswers
      })

      if (result.success) {
        toast.success('Homework submitted successfully!')
        navigate(ROUTES.STUDENT_HOMEWORK.COMPLETED)
      } else {
        toast.error(result.error || 'Failed to submit homework')
      }
    } catch (err) {
      console.error('Error submitting homework:', err)
      toast.error('Failed to submit homework')
    } finally {
      setSubmitting(false)
    }
  }

  const renderQuestion = (question, index) => {
    const currentAnswer = answers[question.id] || {}
    const blankAnswers = currentAnswer.blank_answers || []
    const orderingSequence = question.question_type === 'ordering'
      ? ((currentAnswer.ordering_sequence && currentAnswer.ordering_sequence.length)
          ? currentAnswer.ordering_sequence
          : (question.ordering_items || []).map((item) => item.id))
      : []

    return (
      <Card key={question.id} className="border border-border/70">
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <CardTitle className="text-base font-medium">
                Question {index + 1}
                {question.is_required && <span className="ml-1 text-destructive">*</span>}
              </CardTitle>
              {question.question_type !== 'fill_blank' && (
                <CardDescription className="mt-2 text-sm leading-relaxed">
                  {question.question_text}
                </CardDescription>
              )}
              {question.question_type === 'fill_blank' && (
                <p className="mt-2 text-sm text-muted-foreground">
                  Select the correct option for each blank.
                </p>
              )}
              {question.question_image && (
                <img
                  src={question.question_image}
                  alt={`Question ${index + 1}`}
                  className="mt-3 max-h-64 rounded-md border"
                />
              )}
            </div>
            <Badge variant="outline" className="capitalize">
              {question.points} pts
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {question.question_type === 'qcm_single' && (
            <RadioGroup
              value={currentAnswer.selected_choices?.[0]?.toString()}
              onValueChange={(value) => handleChoiceSelect(question.id, parseInt(value), false)}
            >
              <div className="space-y-3">
                {question.choices?.map((choice) => (
                  <div key={choice.id} className="flex items-center space-x-3">
                    <RadioGroupItem value={choice.id.toString()} id={`choice-${choice.id}`} />
                    <Label htmlFor={`choice-${choice.id}`} className="flex-1 cursor-pointer">
                      {choice.choice_text}
                      {choice.choice_image && (
                        <img
                          src={choice.choice_image}
                          alt="Choice"
                          className="mt-2 max-h-32 rounded border"
                        />
                      )}
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          )}

          {question.question_type === 'qcm_multiple' && (
            <div className="space-y-3">
              {question.choices?.map((choice) => (
                <div key={choice.id} className="flex items-center space-x-3">
                  <Checkbox
                    id={`choice-${choice.id}`}
                    checked={currentAnswer.selected_choices?.includes(choice.id)}
                    onCheckedChange={() => handleChoiceSelect(question.id, choice.id, true)}
                  />
                  <Label htmlFor={`choice-${choice.id}`} className="flex-1 cursor-pointer">
                    {choice.choice_text}
                    {choice.choice_image && (
                      <img
                        src={choice.choice_image}
                        alt="Choice"
                        className="mt-2 max-h-32 rounded border"
                      />
                    )}
                  </Label>
                </div>
              ))}
            </div>
          )}

          {question.question_type === 'true_false' && (
            <RadioGroup
              value={currentAnswer.selected_choices?.[0]?.toString()}
              onValueChange={(value) => handleChoiceSelect(question.id, parseInt(value), false)}
            >
              <div className="space-y-3">
                {question.choices?.map((choice) => (
                  <div key={choice.id} className="flex items-center space-x-3">
                    <RadioGroupItem value={choice.id.toString()} id={`choice-${choice.id}`} />
                    <Label htmlFor={`choice-${choice.id}`} className="cursor-pointer">
                      {choice.choice_text}
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
          )}

          {(question.question_type === 'open_short' || question.question_type === 'open_long') && (
            <Textarea
              placeholder="Type your answer here..."
              value={currentAnswer.text_answer || ''}
              onChange={(e) => handleAnswerChange(question.id, e.target.value, 'text_answer')}
              rows={question.question_type === 'open_long' ? 8 : 3}
              className="w-full"
            />
          )}

          {question.question_type === 'fill_blank' && (
            <div className="space-y-3">
              {renderFillBlankInline(question, blankAnswers)}
            </div>
          )}

          {question.question_type === 'ordering' && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm text-muted-foreground">
                  Drag and drop the items to reorder them into the correct sequence.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleOrderingShuffle(question.id, question.ordering_items || [])}
                >
                  <Shuffle className="mr-2 h-4 w-4" /> Shuffle
                </Button>
              </div>
              <div className="space-y-2">
                {orderingSequence.map((itemId, itemIndex) => {
                  const item = (question.ordering_items || []).find((entry) => entry.id === itemId)
                  if (!item) return null

                  const isDragging = draggedItem?.itemId === item.id
                  const isOver = dragOverIndex === itemIndex

                  return (
                    <div
                      key={item.id}
                      draggable
                      onDragStart={() => handleDragStart(question.id, item.id, itemIndex)}
                      onDragOver={(e) => handleDragOver(e, itemIndex)}
                      onDragLeave={handleDragLeave}
                      onDrop={() => handleDrop(question.id, itemIndex)}
                      onDragEnd={handleDragEnd}
                      className={`flex items-center gap-3 rounded-md border p-3 transition-all cursor-move ${
                        isDragging
                          ? 'opacity-50 border-primary bg-primary/10'
                          : isOver
                          ? 'border-primary bg-primary/5 shadow-md'
                          : 'border-border/70 bg-muted/20 hover:border-primary/50 hover:bg-muted/30'
                      }`}
                    >
                      <GripVertical className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                      <Badge variant="secondary" className="min-w-[2rem] justify-center">
                        {itemIndex + 1}
                      </Badge>
                      <div className="flex-1 text-sm leading-relaxed">
                        {item.text}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {question.question_type === 'matching' && (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Match each item on the left with the correct option on the right.
              </p>
              <MatchingQuestion
                question={question}
                answerState={currentAnswer}
                onSelect={(leftId, rightId) => handleMatchingSelect(question.id, leftId, rightId)}
              />
            </div>
          )}

          {question.explanation && (
            <Alert className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-sm">{question.explanation}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    )
  }

  const renderBookExercise = (exercise, index) => {
    return (
      <Card key={exercise.id} className="border border-border/70">
        <CardHeader>
          <CardTitle className="text-base font-medium">
            Book Exercise {index + 1}
          </CardTitle>
          <CardDescription>
            <div className="mt-2 space-y-1 text-sm">
              <p>
                <strong>Book:</strong> {exercise.book_title}
              </p>
              {exercise.chapter && (
                <p>
                  <strong>Chapter:</strong> {exercise.chapter}
                </p>
              )}
              {exercise.page_number && (
                <p>
                  <strong>Page:</strong> {exercise.page_number}
                </p>
              )}
              {exercise.exercise_number && (
                <p>
                  <strong>Exercise:</strong> {exercise.exercise_number}
                </p>
              )}
              {exercise.specific_questions && (
                <p>
                  <strong>Questions:</strong> {exercise.specific_questions}
                </p>
              )}
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent>
          {exercise.page_image && (
            <img
              src={exercise.page_image}
              alt="Book page"
              className="mb-4 max-h-96 rounded-md border"
            />
          )}
          <Textarea
            placeholder="Write your solution here..."
            rows={8}
            className="w-full"
          />
          {exercise.additional_notes && (
            <Alert className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-sm">{exercise.additional_notes}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    )
  }

  if (loading) {
    return (
      <DashboardLayout title="Loading..." description="Please wait">
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    )
  }

  if (error || !homework) {
    return (
      <DashboardLayout title="Error" description="Unable to load homework">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error || 'Homework not found'}</AlertDescription>
        </Alert>
        <Button variant="outline" onClick={() => navigate(ROUTES.STUDENT_HOMEWORK.PENDING)} className="mt-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Pending Homework
        </Button>
      </DashboardLayout>
    )
  }

  const hasQuestions = homework.questions && homework.questions.length > 0
  const hasBookExercises = homework.book_exercises && homework.book_exercises.length > 0

  return (
    <DashboardLayout
      title={homework.title || 'Homework'}
      description={homework.description || 'Complete your homework assignment'}
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => navigate(ROUTES.STUDENT_HOMEWORK.PENDING)}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Pending
          </Button>
          {submission && (
            <Badge variant={submission.status === 'in_progress' ? 'default' : 'outline'}>
              {submission.status}
            </Badge>
          )}
        </div>

        {/* Homework Info */}
        <Card>
          <CardHeader>
            <CardTitle>{homework.title}</CardTitle>
            <CardDescription>{homework.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="flex items-start gap-3">
                <Calendar className="mt-1 h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-sm font-medium">Due Date</p>
                  <p className="text-sm text-muted-foreground">
                    {homework.due_date
                      ? new Date(homework.due_date).toLocaleDateString()
                      : 'Not specified'}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="mt-1 h-5 w-5 text-amber-500" />
                <div>
                  <p className="text-sm font-medium">Time Limit</p>
                  <p className="text-sm text-muted-foreground">
                    {homework.time_limit ? `${homework.time_limit} minutes` : 'No limit'}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="mt-1 h-5 w-5 text-emerald-500" />
                <div>
                  <p className="text-sm font-medium">Total Points</p>
                  <p className="text-sm text-muted-foreground">
                    {homework.total_points || 0} points
                  </p>
                </div>
              </div>
            </div>

            {homework.instructions && (
              <Alert className="mt-4">
                <FileText className="h-4 w-4" />
                <AlertDescription className="whitespace-pre-wrap">
                  {homework.instructions}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Questions */}
        {hasQuestions && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Questions</h2>
            {homework.questions.map((question, index) => renderQuestion(question, index))}
          </div>
        )}

        {/* Book Exercises */}
        {hasBookExercises && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Book Exercises</h2>
            {homework.book_exercises.map((exercise, index) => renderBookExercise(exercise, index))}
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={() => navigate(ROUTES.STUDENT_HOMEWORK.PENDING)}
          >
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={submitting || !submission}>
            {submitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Submit Homework
              </>
            )}
          </Button>
        </div>
      </div>
    </DashboardLayout>
  )
}

const MatchingQuestion = ({ question, answerState, onSelect }) => {
  const containerRef = useRef(null)
  const leftRefs = useRef({})
  const rightRefs = useRef({})
  const [activeLeft, setActiveLeft] = useState(null)
  const [lines, setLines] = useState([])

  const matchingMap = useMemo(() => {
    const map = {}
    ;(answerState?.matching_answers || []).forEach(match => {
      if (match && match.left_pair !== undefined && match.left_pair !== null) {
        map[match.left_pair] = match.selected_right_pair ?? null
      }
    })
    return map
  }, [answerState?.matching_answers])

  const selectedRightIds = useMemo(() => {
    return new Set(
      Object.values(matchingMap).filter(val => val !== null && val !== undefined)
    )
  }, [matchingMap])

  useEffect(() => {
    setActiveLeft(prev => (question.matching_pairs?.some(pair => pair.id === prev) ? prev : null))
  }, [question.matching_pairs])

  useLayoutEffect(() => {
    const updateLines = () => {
      if (!containerRef.current) return
      const containerRect = containerRef.current.getBoundingClientRect()
      const newLines = (question.matching_pairs || []).map(pair => {
        const selectedRightId = matchingMap[pair.id]
        if (!selectedRightId) return null

        const leftEl = leftRefs.current[pair.id]
        const rightEl = rightRefs.current[selectedRightId]
        if (!leftEl || !rightEl) return null

        const leftRect = leftEl.getBoundingClientRect()
        const rightRect = rightEl.getBoundingClientRect()

        return {
          leftId: pair.id,
          x1: leftRect.right - containerRect.left,
          y1: leftRect.top + leftRect.height / 2 - containerRect.top,
          x2: rightRect.left - containerRect.left,
          y2: rightRect.top + rightRect.height / 2 - containerRect.top
        }
      }).filter(Boolean)

      setLines(newLines)
    }

    updateLines()
    window.addEventListener('resize', updateLines)
    return () => window.removeEventListener('resize', updateLines)
  }, [question.matching_pairs, matchingMap])

  const handleLeftClick = (leftId) => {
    setActiveLeft(prev => (prev === leftId ? null : leftId))
  }

  const handleRightClick = (rightId) => {
    if (activeLeft) {
      if (matchingMap[activeLeft] === rightId) {
        onSelect(activeLeft, null)
      } else {
        onSelect(activeLeft, rightId)
      }
      setActiveLeft(null)
      return
    }

    const existing = Object.entries(matchingMap).find(([, value]) => value === rightId)
    if (existing) {
      setActiveLeft(Number(existing[0]))
    }
  }

  const handleClear = (leftId) => {
    onSelect(leftId, null)
    setActiveLeft(null)
  }

  const arrowId = `matching-arrow-${question.id}`

  return (
    <div ref={containerRef} className="relative mt-3">
      <svg className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true">
        <defs>
          <marker id={arrowId} markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto">
            <path d="M0,0 L10,5 L0,10 z" fill="hsl(var(--primary))" fillOpacity="0.8" />
          </marker>
        </defs>
        {lines.map(line => (
          <g key={`line-${line.leftId}`}>
            <line
              x1={line.x1}
              y1={line.y1}
              x2={line.x2}
              y2={line.y2}
              stroke="hsl(var(--primary))"
              strokeOpacity="0.7"
              strokeWidth="3"
              markerEnd={`url(#${arrowId})`}
            />
            <circle cx={line.x1} cy={line.y1} r="5" fill="hsl(var(--primary))" fillOpacity="0.9" />
          </g>
        ))}
      </svg>

      <div className="relative z-10 grid grid-cols-2 gap-6">
        <div className="space-y-3">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
            Column A
          </h4>
          {(question.matching_pairs || []).map((pair, index) => {
            const isActive = activeLeft === pair.id
            const isPaired = matchingMap[pair.id] !== null && matchingMap[pair.id] !== undefined
            const matchedRight = isPaired ? question.matching_pairs.find(p => p.id === matchingMap[pair.id]) : null

            return (
              <div key={pair.id} className="relative">
                <button
                  type="button"
                  ref={el => {
                    if (el) {
                      leftRefs.current[pair.id] = el
                    } else {
                      delete leftRefs.current[pair.id]
                    }
                  }}
                  onClick={() => handleLeftClick(pair.id)}
                  onDoubleClick={() => handleClear(pair.id)}
                  className={`group w-full rounded-lg border-2 px-4 py-3 text-left text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                    isActive
                      ? 'border-primary bg-primary/10 text-primary shadow-lg scale-105'
                      : isPaired
                      ? 'border-primary/50 bg-primary/5 text-foreground hover:border-primary/70'
                      : 'border-border bg-card text-foreground hover:border-primary/40 hover:bg-muted/50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                      {index + 1}
                    </span>
                    <span className="flex-1">{pair.left_text}</span>
                  </div>
                  {isPaired && matchedRight && (
                    <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="inline-block h-1 w-1 rounded-full bg-primary"></span>
                      <span>Matched with: {matchedRight.right_text}</span>
                    </div>
                  )}
                </button>
                {isActive && (
                  <div className="absolute -right-2 top-1/2 -translate-y-1/2">
                    <div className="h-3 w-3 animate-pulse rounded-full bg-primary shadow-lg"></div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        <div className="space-y-3">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
            Column B
          </h4>
          {(question.matching_pairs || []).map((option, index) => {
            const isChosen = selectedRightIds.has(option.id)
            const isHighlighted = activeLeft && matchingMap[activeLeft] === option.id

            return (
              <div key={option.id} className="relative">
                {isHighlighted && (
                  <div className="absolute -left-2 top-1/2 -translate-y-1/2">
                    <div className="h-3 w-3 animate-pulse rounded-full bg-primary shadow-lg"></div>
                  </div>
                )}
                <button
                  type="button"
                  ref={el => {
                    if (el) {
                      rightRefs.current[option.id] = el
                    } else {
                      delete rightRefs.current[option.id]
                    }
                  }}
                  onClick={() => handleRightClick(option.id)}
                  className={`group w-full rounded-lg border-2 px-4 py-3 text-right text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
                    isHighlighted
                      ? 'border-primary bg-primary/10 text-primary shadow-lg scale-105'
                      : isChosen
                      ? 'border-primary/50 bg-primary/5 text-foreground hover:border-primary/70'
                      : 'border-border bg-card text-foreground hover:border-primary/40 hover:bg-muted/50'
                  }`}
                >
                  <div className="flex items-center justify-end gap-2">
                    <span className="flex-1">{option.right_text}</span>
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                      {String.fromCharCode(65 + index)}
                    </span>
                  </div>
                </button>
              </div>
            )
          })}
        </div>
      </div>

      {activeLeft && (
        <div className="mt-4">
          <Alert className="border-primary/50 bg-primary/5">
            <AlertCircle className="h-4 w-4 text-primary" />
            <AlertDescription className="text-sm">
              Click on an item in Column B to create a match, or click the same item in Column A to cancel.
            </AlertDescription>
          </Alert>
        </div>
      )}
    </div>
  )
}

export default StudentHomeworkWorkPage
