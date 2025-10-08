import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import {
  ArrowLeft,
  Save,
  Send,
  User,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  Trophy,
  Coins,
  Award,
  AlertCircle,
  FileText,
  Loader2,
  Target,
  Star,
  Download,
} from 'lucide-react'

import { TeacherPageLayout } from '../../components/teacher/layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Textarea } from '../../components/ui/textarea'
import { Alert, AlertDescription } from '../../components/ui/alert'
import { Separator } from '../../components/ui/separator'

import { useLanguage } from '../../hooks/useLanguage'
import { homeworkService } from '../../services'
import { cn } from '../../lib/utils'

const GradeSubmissionPage = () => {
  const navigate = useNavigate()
  const { t } = useLanguage()
  const { submissionId } = useParams()

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [submission, setSubmission] = useState(null)
  const [error, setError] = useState(null)

  // Grading state
  const [manualScore, setManualScore] = useState('')
  const [teacherFeedback, setTeacherFeedback] = useState('')
  const [questionFeedbacks, setQuestionFeedbacks] = useState({})
  const [questionScores, setQuestionScores] = useState({})

  useEffect(() => {
    fetchSubmissionDetails()
  }, [submissionId])

  const fetchSubmissionDetails = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await homeworkService.getSubmissionById(submissionId)

      if (response.success) {
        setSubmission(response.data)
        setManualScore(response.data.manual_score || '')
        setTeacherFeedback(response.data.teacher_feedback || '')

        // Initialize question feedbacks and scores
        const feedbacks = {}
        const scores = {}
        response.data.answers?.forEach(answer => {
          feedbacks[answer.id] = answer.teacher_feedback || ''
          scores[answer.id] = answer.points_earned || ''
        })
        setQuestionFeedbacks(feedbacks)
        setQuestionScores(scores)
      } else {
        setError(response.error || 'Failed to load submission')
        toast.error(response.error || 'Failed to load submission')
      }
    } catch (err) {
      console.error('Error fetching submission:', err)
      setError('Failed to load submission')
      toast.error('Failed to load submission')
    } finally {
      setLoading(false)
    }
  }

  const handleQuestionFeedbackChange = (answerId, feedback) => {
    setQuestionFeedbacks(prev => ({
      ...prev,
      [answerId]: feedback
    }))
  }

  const handleQuestionScoreChange = (answerId, score) => {
    setQuestionScores(prev => ({
      ...prev,
      [answerId]: score
    }))
  }

  const calculateTotalScore = () => {
    let total = 0

    // Add auto-graded scores
    submission?.answers?.forEach(answer => {
      if (answer.is_correct !== null && answer.points_earned) {
        total += parseFloat(answer.points_earned) || 0
      }
    })

    // Add manual scores for open-ended questions
    Object.entries(questionScores).forEach(([answerId, score]) => {
      const answer = submission?.answers?.find(a => a.id === parseInt(answerId))
      if (answer && answer.is_correct === null && score) {
        total += parseFloat(score) || 0
      }
    })

    return total
  }

  const handleSaveDraft = async () => {
    try {
      setSaving(true)

      const gradeData = {
        teacher_feedback: teacherFeedback,
        manual_score: manualScore ? parseFloat(manualScore) : null,
        status: 'in_progress'
      }

      const response = await homeworkService.gradeSubmission(submissionId, gradeData)

      if (response.success) {
        toast.success('Draft saved successfully')
        fetchSubmissionDetails()
      } else {
        toast.error(response.error || 'Failed to save draft')
      }
    } catch (err) {
      console.error('Error saving draft:', err)
      toast.error('Failed to save draft')
    } finally {
      setSaving(false)
    }
  }

  const handleSubmitGrade = async () => {
    try {
      setSaving(true)

      const totalScore = calculateTotalScore()

      const gradeData = {
        total_score: totalScore,
        manual_score: manualScore ? parseFloat(manualScore) : null,
        teacher_feedback: teacherFeedback,
        status: 'manually_graded'
      }

      const response = await homeworkService.gradeSubmission(submissionId, gradeData)

      if (response.success) {
        toast.success('Grading completed! Student will receive their rewards.')
        navigate('/teacher/grading')
      } else {
        toast.error(response.error || 'Failed to submit grade')
      }
    } catch (err) {
      console.error('Error submitting grade:', err)
      toast.error('Failed to submit grade')
    } finally {
      setSaving(false)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getScoreColor = (score, maxScore) => {
    if (!score || !maxScore) return 'text-gray-500'
    const percentage = (score / maxScore) * 100
    if (percentage >= 90) return 'text-green-600'
    if (percentage >= 80) return 'text-blue-600'
    if (percentage >= 70) return 'text-yellow-600'
    if (percentage >= 60) return 'text-orange-600'
    return 'text-red-600'
  }

  if (loading) {
    return (
      <TeacherPageLayout title="Loading..." subtitle="Please wait">
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </TeacherPageLayout>
    )
  }

  if (error || !submission) {
    return (
      <TeacherPageLayout title="Error" subtitle="Unable to load submission">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error || 'Submission not found'}</AlertDescription>
        </Alert>
        <Button
          variant="outline"
          onClick={() => navigate('/teacher/grading')}
          className="mt-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Grading
        </Button>
      </TeacherPageLayout>
    )
  }

  const homework = submission.homework
  const student = submission.student
  const totalScore = calculateTotalScore()
  const scorePercentage = homework.total_points ? (totalScore / parseFloat(homework.total_points)) * 100 : 0

  return (
    <TeacherPageLayout
      title="Grade Submission"
      subtitle="Review student work and provide feedback"
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => navigate('/teacher/grading')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Grading
          </Button>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleSaveDraft}
              disabled={saving}
            >
              <Save className="mr-2 h-4 w-4" />
              Save Draft
            </Button>
            <Button
              onClick={handleSubmitGrade}
              disabled={saving}
            >
              <Send className="mr-2 h-4 w-4" />
              Submit Grade & Award Rewards
            </Button>
          </div>
        </div>

        {/* Student & Assignment Info */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-2xl">{homework.title}</CardTitle>
                <CardDescription className="mt-2">
                  {homework.description}
                </CardDescription>
              </div>
              <Badge
                variant={submission.is_late ? 'destructive' : 'default'}
              >
                {submission.is_late ? 'Late Submission' : 'On Time'}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex items-start gap-3">
                <User className="h-5 w-5 text-blue-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Student</p>
                  <p className="text-sm text-muted-foreground">
                    {student.full_name || `${student.first_name} ${student.last_name}`}
                  </p>
                  <p className="text-xs text-muted-foreground">{student.email}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-purple-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Submitted</p>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(submission.submitted_at)}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-amber-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Time Taken</p>
                  <p className="text-sm text-muted-foreground">
                    {submission.time_taken ? `${submission.time_taken} minutes` : 'N/A'}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Target className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Attempt</p>
                  <p className="text-sm text-muted-foreground">
                    #{submission.attempt_number}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Score Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Score Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-sm font-medium text-blue-900 mb-1">Auto Score</div>
                <div className="text-2xl font-bold text-blue-600">
                  {submission.auto_score || '—'}
                </div>
                <div className="text-xs text-blue-700">QCM Questions</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-sm font-medium text-purple-900 mb-1">Manual Score</div>
                <div className="text-2xl font-bold text-purple-600">
                  {manualScore || '—'}
                </div>
                <div className="text-xs text-purple-700">Open Questions</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-sm font-medium text-green-900 mb-1">Total Score</div>
                <div className={cn('text-2xl font-bold', getScoreColor(totalScore, parseFloat(homework.total_points)))}>
                  {totalScore.toFixed(2)}
                </div>
                <div className="text-xs text-green-700">out of {homework.total_points}</div>
              </div>
              <div className="text-center p-4 bg-amber-50 rounded-lg">
                <div className="text-sm font-medium text-amber-900 mb-1">Percentage</div>
                <div className={cn('text-2xl font-bold', getScoreColor(scorePercentage, 100))}>
                  {scorePercentage.toFixed(0)}%
                </div>
                <div className="text-xs text-amber-700">Performance</div>
              </div>
            </div>

            {/* Rewards Preview */}
            {homework.reward_config && (
              <Alert className="mt-4 bg-yellow-50 border-yellow-200">
                <Trophy className="h-4 w-4 text-yellow-600" />
                <AlertDescription>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="font-medium text-yellow-900">
                      Estimated Rewards:
                    </span>
                    <div className="flex items-center gap-2">
                      <Coins className="h-4 w-4 text-amber-600" />
                      <span className="text-amber-700">
                        {homework.reward_config.completion_points} points
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-yellow-600" />
                      <span className="text-yellow-700">
                        {homework.reward_config.completion_coins} coins
                      </span>
                    </div>
                    {scorePercentage >= 100 && (
                      <Badge variant="default" className="bg-green-600">
                        +{homework.reward_config.perfect_score_bonus} Perfect Score Bonus!
                      </Badge>
                    )}
                    {!submission.is_late && (
                      <Badge variant="default" className="bg-blue-600">
                        +{homework.reward_config.on_time_bonus} On-Time Bonus!
                      </Badge>
                    )}
                  </div>
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Questions & Answers */}
        <Card>
          <CardHeader>
            <CardTitle>Student Answers</CardTitle>
            <CardDescription>Review and grade each question</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {submission.answers?.map((answer, index) => {
              const question = answer.question
              const isAutoGraded = answer.is_correct !== null

              return (
                <div key={answer.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">Question {index + 1}</h3>
                        <Badge variant="outline">{question.points} pts</Badge>
                        {isAutoGraded && (
                          <Badge
                            variant={answer.is_correct ? 'default' : 'destructive'}
                            className="flex items-center gap-1"
                          >
                            {answer.is_correct ? (
                              <>
                                <CheckCircle className="h-3 w-3" />
                                Correct
                              </>
                            ) : (
                              <>
                                <XCircle className="h-3 w-3" />
                                Incorrect
                              </>
                            )}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">
                        {question.question_text}
                      </p>
                    </div>
                  </div>

                  {/* Student's Answer */}
                  <div className="bg-gray-50 rounded-lg p-3 mb-3">
                    <p className="text-sm font-medium mb-2">Student's Answer:</p>
                    {answer.text_answer && (
                      <p className="text-sm whitespace-pre-wrap">{answer.text_answer}</p>
                    )}
                    {answer.selected_choices && answer.selected_choices.length > 0 && (
                      <div className="space-y-1">
                        {answer.selected_choices.map(choice => (
                          <div
                            key={choice.id}
                            className={cn(
                              'text-sm p-2 rounded',
                              choice.is_correct
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            )}
                          >
                            {choice.choice_text}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Grading Section for Open Questions */}
                  {!isAutoGraded && (
                    <div className="space-y-3">
                      <div>
                        <Label htmlFor={`score-${answer.id}`}>
                          Points Earned (max: {question.points})
                        </Label>
                        <Input
                          id={`score-${answer.id}`}
                          type="number"
                          min="0"
                          max={question.points}
                          step="0.5"
                          value={questionScores[answer.id] || ''}
                          onChange={(e) => handleQuestionScoreChange(answer.id, e.target.value)}
                          placeholder="Enter score"
                          className="max-w-xs"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`feedback-${answer.id}`}>
                          Feedback for this question
                        </Label>
                        <Textarea
                          id={`feedback-${answer.id}`}
                          value={questionFeedbacks[answer.id] || ''}
                          onChange={(e) => handleQuestionFeedbackChange(answer.id, e.target.value)}
                          placeholder="Provide specific feedback..."
                          rows={3}
                        />
                      </div>
                    </div>
                  )}

                  {/* Auto-graded points */}
                  {isAutoGraded && (
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-medium">Points Earned:</span>
                      <span className={answer.is_correct ? 'text-green-600' : 'text-red-600'}>
                        {answer.points_earned} / {question.points}
                      </span>
                    </div>
                  )}
                </div>
              )
            })}
          </CardContent>
        </Card>

        {/* General Feedback */}
        <Card>
          <CardHeader>
            <CardTitle>Overall Feedback</CardTitle>
            <CardDescription>
              Provide general feedback for the student
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              value={teacherFeedback}
              onChange={(e) => setTeacherFeedback(e.target.value)}
              placeholder="Write your overall feedback here..."
              rows={6}
            />
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => navigate('/teacher/grading')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Cancel
          </Button>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleSaveDraft}
              disabled={saving}
            >
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Draft
                </>
              )}
            </Button>
            <Button
              onClick={handleSubmitGrade}
              disabled={saving}
            >
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  <Trophy className="mr-1 h-4 w-4" />
                  Submit Grade & Award Rewards
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </TeacherPageLayout>
  )
}

export default GradeSubmissionPage
