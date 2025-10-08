import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import {
  ArrowLeft,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  Award,
  AlertCircle,
  FileText,
  Loader2,
  Trophy,
  Coins,
  Star,
  MessageSquare,
  Target,
  TrendingUp,
  BookOpen,
  User,
} from 'lucide-react'

import { DashboardLayout } from '../../components/layout/Layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import { Alert, AlertDescription } from '../../components/ui/alert'
import { Separator } from '../../components/ui/separator'

import { useLanguage } from '../../hooks/useLanguage'
import { homeworkService } from '../../services'
import { ROUTES } from '../../utils/constants'
import { cn } from '../../lib/utils'

const StudentSubmissionReviewPage = () => {
  const navigate = useNavigate()
  const { t, currentLanguage } = useLanguage()
  const { submissionId } = useParams()

  const [loading, setLoading] = useState(true)
  const [submission, setSubmission] = useState(null)
  const [error, setError] = useState(null)

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
      } else {
        setError(response.error || t('common.error'))
        toast.error(response.error || t('common.error'))
      }
    } catch (err) {
      console.error('Error fetching submission:', err)
      setError(t('common.error'))
      toast.error(t('common.error'))
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString(currentLanguage, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'auto_graded':
      case 'manually_graded':
        return 'bg-green-100 text-green-800'
      case 'submitted':
        return 'bg-blue-100 text-blue-800'
      case 'late':
        return 'bg-orange-100 text-orange-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getScoreColor = (score, maxScore) => {
    if (!score || !maxScore) return 'text-gray-500'
    const percentage = (parseFloat(score) / parseFloat(maxScore)) * 100
    if (percentage >= 90) return 'text-green-600'
    if (percentage >= 80) return 'text-blue-600'
    if (percentage >= 70) return 'text-yellow-600'
    if (percentage >= 60) return 'text-orange-600'
    return 'text-red-600'
  }

  const isGraded = (submission) => {
    return submission?.status === 'auto_graded' || submission?.status === 'manually_graded'
  }

  const renderQuestionReview = (answer, index) => {
    const question = answer.question
    const isCorrect = answer.is_correct
    const hasTeacherFeedback = answer.teacher_feedback && answer.teacher_feedback.trim() !== ''

    return (
      <Card key={answer.id} className="border border-border/70">
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <CardTitle className="text-base font-medium">
                  {t('studentSidebar.homework.submissionReview.question')} {index + 1}
                </CardTitle>
                <Badge variant="outline">{question.points} {t('studentSidebar.homework.submissionReview.pts')}</Badge>
                {isCorrect !== null && (
                  <Badge
                    variant={isCorrect ? 'default' : 'destructive'}
                    className="flex items-center gap-1"
                  >
                    {isCorrect ? (
                      <>
                        <CheckCircle className="h-3 w-3" />
                        {t('studentSidebar.homework.submissionReview.correct')}
                      </>
                    ) : (
                      <>
                        <XCircle className="h-3 w-3" />
                        {t('studentSidebar.homework.submissionReview.incorrect')}
                      </>
                    )}
                  </Badge>
                )}
              </div>
              <CardDescription className="text-sm leading-relaxed">
                {question.question_text}
              </CardDescription>
              {question.question_image && (
                <img
                  src={question.question_image}
                  alt={`${t('studentSidebar.homework.submissionReview.question')} ${index + 1}`}
                  className="mt-3 max-h-64 rounded-md border"
                />
              )}
            </div>
            {answer.points_earned !== null && (
              <div className="text-right">
                <div className={cn('text-2xl font-bold', getScoreColor(answer.points_earned, question.points))}>
                  {answer.points_earned}
                </div>
                <div className="text-xs text-muted-foreground">
                  {t('studentSidebar.homework.submissionReview.outOf')} {question.points}
                </div>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Your Answer */}
          <div>
            <h4 className="text-sm font-semibold mb-2 text-blue-900">{t('studentSidebar.homework.submissionReview.yourAnswer')}</h4>
            <div className="bg-blue-50 rounded-lg p-3">
              {answer.text_answer && (
                <p className="text-sm whitespace-pre-wrap">{answer.text_answer}</p>
              )}
              {answer.selected_choices && answer.selected_choices.length > 0 && (
                <div className="space-y-2">
                  {answer.selected_choices.map(choice => (
                    <div
                      key={choice.id}
                      className={cn(
                        'text-sm p-2 rounded flex items-center gap-2',
                        choice.is_correct
                          ? 'bg-green-100 text-green-800 border border-green-300'
                          : 'bg-red-100 text-red-800 border border-red-300'
                      )}
                    >
                      {choice.is_correct ? (
                        <CheckCircle className="h-4 w-4 flex-shrink-0" />
                      ) : (
                        <XCircle className="h-4 w-4 flex-shrink-0" />
                      )}
                      <span>{choice.choice_text}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Correct Answer (for QCM) */}
          {question.choices && question.choices.length > 0 && isGraded(submission) && (
            <div>
              <h4 className="text-sm font-semibold mb-2 text-green-900">{t('studentSidebar.homework.submissionReview.correctAnswer')}</h4>
              <div className="bg-green-50 rounded-lg p-3 space-y-1">
                {question.choices
                  .filter(choice => choice.is_correct)
                  .map(choice => (
                    <div
                      key={choice.id}
                      className="text-sm text-green-800 flex items-center gap-2"
                    >
                      <CheckCircle className="h-4 w-4 flex-shrink-0" />
                      <span>{choice.choice_text}</span>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Teacher Feedback */}
          {hasTeacherFeedback && (
            <Alert className="bg-purple-50 border-purple-200">
              <MessageSquare className="h-4 w-4 text-purple-600" />
              <AlertDescription>
                <div className="text-sm">
                  <p className="font-semibold text-purple-900 mb-1">{t('studentSidebar.homework.submissionReview.teacherFeedback')}</p>
                  <p className="text-purple-800">{answer.teacher_feedback}</p>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Explanation */}
          {question.explanation && isGraded(submission) && (
            <Alert className="bg-amber-50 border-amber-200">
              <AlertCircle className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-sm text-amber-800">
                <p className="font-semibold mb-1">{t('studentSidebar.homework.submissionReview.explanation')}</p>
                <p>{question.explanation}</p>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    )
  }

  if (loading) {
    return (
      <DashboardLayout title={t('common.loading')} description={t('common.loadingData')}>
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    )
  }

  if (error || !submission) {
    return (
      <DashboardLayout title={t('common.error')} description={t('common.error')}>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error || t('common.error')}</AlertDescription>
        </Alert>
        <Button
          variant="outline"
          onClick={() => navigate(ROUTES.STUDENT_HOMEWORK.COMPLETED)}
          className="mt-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          {t('studentSidebar.homework.submissionReview.backToHomework')}
        </Button>
      </DashboardLayout>
    )
  }

  const homework = submission.homework
  const graded = isGraded(submission)
  const scorePercentage = homework.total_points
    ? (parseFloat(submission.total_score || 0) / parseFloat(homework.total_points)) * 100
    : 0

  return (
    <DashboardLayout
      title={t('studentSidebar.homework.submissionReview.title')}
      description={t('studentSidebar.homework.submissionReview.subtitle')}
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => navigate(ROUTES.STUDENT_HOMEWORK.COMPLETED)}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('studentSidebar.homework.submissionReview.backToCompleted')}
          </Button>
          <Badge
            variant={graded ? 'default' : 'secondary'}
            className={cn(graded ? getStatusColor(submission.status) : '')}
          >
            {graded ? t('studentSidebar.homework.submissionReview.graded') : t('studentSidebar.homework.submissionReview.awaitingGrading')}
          </Badge>
        </div>

        {/* Homework Info */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-2xl">{homework.title}</CardTitle>
                {homework.description && (
                  <CardDescription className="mt-2">{homework.description}</CardDescription>
                )}
              </div>
              <Badge variant="outline" className="flex items-center gap-1">
                <BookOpen className="h-3 w-3" />
                {homework.subject_name}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-blue-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">{t('studentSidebar.homework.submissionReview.submitted')}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(submission.submitted_at)}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-amber-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">{t('studentSidebar.homework.submissionReview.timeTaken')}</p>
                  <p className="text-sm text-muted-foreground">
                    {submission.time_taken ? `${submission.time_taken} ${t('studentSidebar.homework.submissionReview.minutes')}` : t('studentSidebar.homework.submissionReview.notRecorded')}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Target className="h-5 w-5 text-purple-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">{t('studentSidebar.homework.submissionReview.attempt')}</p>
                  <p className="text-sm text-muted-foreground">
                    #{submission.attempt_number}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <TrendingUp className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium">{t('common.status')}</p>
                  <p className="text-sm text-muted-foreground capitalize">
                    {submission.is_late ? t('studentSidebar.homework.submissionReview.lateSubmission') : t('studentSidebar.homework.submissionReview.onTime')}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Grading Status */}
        {!graded ? (
          <Alert className="bg-blue-50 border-blue-200">
            <Clock className="h-4 w-4 text-blue-600" />
            <AlertDescription>
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold text-blue-900 mb-1">{t('studentSidebar.homework.submissionReview.notGradedYet')}</p>
                  <p className="text-sm text-blue-800">
                    {t('studentSidebar.homework.submissionReview.notGradedMessage')}
                  </p>
                </div>
                <Loader2 className="h-6 w-6 text-blue-600 animate-spin flex-shrink-0" />
              </div>
            </AlertDescription>
          </Alert>
        ) : (
          <>
            {/* Score Summary */}
            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-green-600" />
                  {t('studentSidebar.homework.submissionReview.yourScore')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-white/50 rounded-lg">
                    <div className="text-sm font-medium text-gray-700 mb-1">{t('studentSidebar.homework.submissionReview.totalScore')}</div>
                    <div className={cn('text-3xl font-bold', getScoreColor(submission.total_score, homework.total_points))}>
                      {submission.total_score || 0}
                    </div>
                    <div className="text-xs text-gray-600">{t('studentSidebar.homework.submissionReview.outOf')} {homework.total_points}</div>
                  </div>
                  <div className="text-center p-4 bg-white/50 rounded-lg">
                    <div className="text-sm font-medium text-gray-700 mb-1">{t('studentSidebar.homework.submissionReview.percentage')}</div>
                    <div className={cn('text-3xl font-bold', getScoreColor(scorePercentage, 100))}>
                      {scorePercentage.toFixed(0)}%
                    </div>
                    <div className="text-xs text-gray-600">{t('studentSidebar.homework.submissionReview.performance')}</div>
                  </div>
                  <div className="text-center p-4 bg-amber-100 rounded-lg">
                    <div className="text-sm font-medium text-amber-900 mb-1">{t('studentSidebar.homework.submissionReview.pointsEarned')}</div>
                    <div className="text-3xl font-bold text-amber-700 flex items-center justify-center gap-1">
                      <Coins className="h-6 w-6" />
                      {submission.points_earned || 0}
                    </div>
                    <div className="text-xs text-amber-700">{t('studentSidebar.homework.submissionReview.rewardPoints')}</div>
                  </div>
                  <div className="text-center p-4 bg-yellow-100 rounded-lg">
                    <div className="text-sm font-medium text-yellow-900 mb-1">{t('studentSidebar.homework.submissionReview.coinsEarned')}</div>
                    <div className="text-3xl font-bold text-yellow-700 flex items-center justify-center gap-1">
                      <Star className="h-6 w-6" />
                      {submission.coins_earned || 0}
                    </div>
                    <div className="text-xs text-yellow-700">{t('studentSidebar.homework.submissionReview.rewardCoins')}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Teacher Feedback */}
            {submission.teacher_feedback && submission.teacher_feedback.trim() !== '' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5 text-purple-600" />
                    {t('studentSidebar.homework.submissionReview.teacherOverallFeedback')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                    <p className="text-sm leading-relaxed text-purple-900 whitespace-pre-wrap">
                      {submission.teacher_feedback}
                    </p>
                  </div>
                  {submission.graded_by && (
                    <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                      <User className="h-4 w-4" />
                      <span>
                        {t('studentSidebar.homework.submissionReview.gradedBy')} {submission.graded_by.full_name || `${submission.graded_by.first_name} ${submission.graded_by.last_name}`}
                      </span>
                      {submission.graded_at && (
                        <>
                          <span>•</span>
                          <span>{formatDate(submission.graded_at)}</span>
                        </>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </>
        )}

        {/* Questions & Answers */}
        <Card>
          <CardHeader>
            <CardTitle>{t('studentSidebar.homework.submissionReview.yourAnswers')}</CardTitle>
            <CardDescription>
              {graded
                ? t('studentSidebar.homework.submissionReview.reviewAnswersGraded')
                : t('studentSidebar.homework.submissionReview.reviewAnswersPending')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {submission.answers && submission.answers.length > 0 ? (
              submission.answers.map((answer, index) => renderQuestionReview(answer, index))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>{t('studentSidebar.homework.submissionReview.noAnswersFound')}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Performance Summary */}
        {graded && (
          <Card>
            <CardHeader>
              <CardTitle>{t('studentSidebar.homework.submissionReview.performanceSummary')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-green-900">{t('studentSidebar.homework.submissionReview.correctAnswers')}</p>
                    <p className="text-2xl font-bold text-green-700">
                      {submission.answers?.filter(a => a.is_correct === true).length || 0}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg">
                  <XCircle className="h-8 w-8 text-red-600" />
                  <div>
                    <p className="text-sm font-medium text-red-900">{t('studentSidebar.homework.submissionReview.incorrectAnswers')}</p>
                    <p className="text-2xl font-bold text-red-700">
                      {submission.answers?.filter(a => a.is_correct === false).length || 0}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                  <Award className="h-8 w-8 text-blue-600" />
                  <div>
                    <p className="text-sm font-medium text-blue-900">{t('studentSidebar.homework.submissionReview.totalRewards')}</p>
                    <p className="text-xl font-bold text-blue-700">
                      {submission.points_earned || 0} {t('studentSidebar.homework.submissionReview.pts')} • {submission.coins_earned || 0} {t('studentSidebar.homework.submissionReview.coins')}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => navigate(ROUTES.STUDENT_HOMEWORK.COMPLETED)}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('studentSidebar.homework.submissionReview.backToHomework')}
          </Button>
          {graded && (
            <Button
              variant="default"
              onClick={() => navigate(ROUTES.STUDENT_REWARDS)}
            >
              <Trophy className="mr-2 h-4 w-4" />
              {t('studentSidebar.homework.submissionReview.viewMyRewards')}
            </Button>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}

export default StudentSubmissionReviewPage
