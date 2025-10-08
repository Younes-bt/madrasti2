import React, { useEffect, useState, useMemo } from 'react'
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

import { useLanguage } from '../../hooks/useLanguage'
import { homeworkService } from '../../services'
import { ROUTES } from '../../utils/constants'

const SUPPORTED_AUTO_TYPES = ['qcm_single', 'qcm_multiple', 'true_false']

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

  useEffect(() => {
    const fetchHomeworkDetails = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await homeworkService.getHomeworkById(homeworkId)
        setHomework(response)

        // Check if student has a submission
        if (response.student_submission) {
          setSubmission(response.student_submission)

          // Load existing answers if any
          const existingAnswers = {}
          if (response.student_submission.answers) {
            response.student_submission.answers.forEach(answer => {
              if (answer.question) {
                existingAnswers[answer.question.id] = {
                  text_answer: answer.text_answer || '',
                  selected_choices: answer.selected_choices?.map(c => c.id) || []
                }
              }
            })
          }
          setAnswers(existingAnswers)
        }
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
        selected_choice_ids: answer.selected_choices || []
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
    const isAutoGraded = SUPPORTED_AUTO_TYPES.includes(question.question_type)

    return (
      <Card key={question.id} className="border border-border/70">
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <CardTitle className="text-base font-medium">
                Question {index + 1}
                {question.is_required && <span className="ml-1 text-destructive">*</span>}
              </CardTitle>
              <CardDescription className="mt-2 text-sm leading-relaxed">
                {question.question_text}
              </CardDescription>
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

export default StudentHomeworkWorkPage
