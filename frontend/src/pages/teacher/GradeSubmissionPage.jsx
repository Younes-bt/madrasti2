import React, { useEffect, useState, useMemo, useRef, useLayoutEffect } from 'react'
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

const getNotAnsweredLabel = (t) => t?.('teacher.grading.notAnswered') || 'Not answered'

const buildBlankSelectionMap = (question, selections, t) => {
  const placeholder = getNotAnsweredLabel(t)
  const blanks = question.blanks || []
  const map = {}

  blanks.forEach(blank => {
    map[blank.id] = { text: placeholder, status: 'empty' }
  })

  const blankLookup = blanks.reduce((acc, blank) => {
    acc[blank.id] = blank
    return acc
  }, {})

  selections.forEach(selection => {
    const blank = blankLookup[selection.blank]
    if (!blank) return
    if (selection.selected_option == null || selection.selected_option === undefined) {
      map[blank.id] = { text: placeholder, status: 'empty' }
      return
    }
    const option = (blank.options || []).find(opt => opt.id === selection.selected_option)
    map[blank.id] = {
      text: option?.option_text || placeholder,
      status: selection.is_correct ? 'correct' : 'incorrect'
    }
  })

  return map
}

const buildBlankCorrectMap = (question, t) => {
  const fallback = t?.('teacher.grading.notProvided') || 'Not provided'
  const blanks = question.blanks || []
  const map = {}

  blanks.forEach(blank => {
    const correctOptions = (blank.options || []).filter(opt => opt.is_correct)
    const text = correctOptions.length
      ? correctOptions.map(opt => opt.option_text).join(', ')
      : fallback
    map[blank.id] = { text, status: 'correct' }
  })

  return map
}

const renderBlankTokens = (question, blankMap, t) => {
  const blanks = question.blanks || []
  const text = question.question_text || ''
  const tokens = []
  const regex = /\[(.+?)\]/g
  let lastIndex = 0
  const usedBlankIds = new Set()

  const findBlankForToken = (tokenValue) => {
    const normalized = (tokenValue || '').trim()
    if (!normalized) return null

    const byLabel = blanks.find(blank => Boolean(blank.label) && blank.label.toLowerCase() === normalized.toLowerCase())
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

  blanks.forEach(blank => {
    if (!usedBlankIds.has(blank.id)) {
      tokens.push({ type: 'text', value: tokens.length ? ' ' : '' })
      tokens.push({ type: 'blank', blank })
      usedBlankIds.add(blank.id)
    }
  })

  const placeholder = getNotAnsweredLabel(t)

  return (
    <div className="flex flex-wrap items-baseline gap-2 text-base leading-relaxed">
      {tokens.map((token, idx) => {
        if (token.type === 'text') {
          return (
            <span key={`text-${idx}`} className="whitespace-pre-wrap">
              {token.value}
            </span>
          )
        }

        const blank = token.blank
        const entry = blankMap?.[blank.id]
        const displayText = entry?.text || placeholder
        const status = entry?.status || 'empty'

        let styling = 'inline-flex h-8 min-w-[120px] items-center justify-center rounded-full border px-4 text-sm font-medium shadow-sm'
        if (status === 'correct') {
          styling = cn(styling, 'border-green-300 bg-green-50 text-green-700')
        } else if (status === 'incorrect') {
          styling = cn(styling, 'border-red-300 bg-red-50 text-red-700')
        } else {
          styling = cn(styling, 'border-border/60 bg-muted/40 text-muted-foreground')
        }

        return (
          <span key={`blank-${blank.id}-${idx}`} className={styling}>
            {displayText}
          </span>
        )
      })}
    </div>
  )
}

const renderOrderingList = (question, selections, t, { mode = 'student' } = {}) => {
  const items = question.ordering_items || []
  if (!items.length) {
    return (
      <p className="text-sm text-muted-foreground">
        {getNotAnsweredLabel(t)}
      </p>
    )
  }

  const selectionMap = new Map()
  selections.forEach(selection => {
    if (selection && selection.item !== undefined && selection.item !== null) {
      selectionMap.set(selection.item, selection)
    }
  })

  const rows = items.map(item => {
    const selection = selectionMap.get(item.id)
    return {
      id: item.id,
      text: item.text,
      selectedPosition: selection?.selected_position ?? null,
      isCorrect: selection?.is_correct ?? false,
      correctPosition: item.correct_position
    }
  })

  const sortedRows = [...rows].sort((a, b) => {
    if (mode === 'correct') {
      return a.correctPosition - b.correctPosition
    }
    if (a.selectedPosition === null || a.selectedPosition === undefined) return 1
    if (b.selectedPosition === null || b.selectedPosition === undefined) return -1
    return a.selectedPosition - b.selectedPosition
  })

  const correctLabel = t?.('teacher.grading.correctPosition') || 'Correct position'
  const positionLabel = t?.('teacher.grading.position') || 'Position'

  return (
    <div className="space-y-2">
      {sortedRows.map(row => {
        let styling = 'flex items-center justify-between rounded-md border px-3 py-2 text-sm transition'
        if (mode === 'correct') {
          styling = cn(styling, 'border-green-200 bg-green-50 text-green-700')
        } else if (row.selectedPosition === null || row.selectedPosition === undefined) {
          styling = cn(styling, 'border-border/60 bg-muted/40 text-muted-foreground')
        } else if (row.isCorrect) {
          styling = cn(styling, 'border-green-300 bg-green-50 text-green-700')
        } else {
          styling = cn(styling, 'border-red-300 bg-red-50 text-red-700')
        }

        const badgeValue = mode === 'correct'
          ? row.correctPosition
          : row.selectedPosition !== null && row.selectedPosition !== undefined
            ? row.selectedPosition
            : '—'

        return (
          <div key={row.id} className={styling}>
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="min-w-[2rem] justify-center">
                {badgeValue}
              </Badge>
              <span>{row.text}</span>
            </div>
            <span className="text-xs text-muted-foreground">
              {mode === 'correct'
                ? `${positionLabel} ${row.correctPosition}`
                : `${correctLabel}: ${row.correctPosition}`}
            </span>
          </div>
        )
      })}
    </div>
  )
}

const MatchingReview = ({ question, selections }) => {
  const containerRef = useRef(null)
  const leftRefs = useRef({})
  const rightRefs = useRef({})
  const [lines, setLines] = useState([])

  const selectionMap = useMemo(() => {
    const map = {}
    selections.forEach(selection => {
      if (selection && selection.left_pair !== undefined && selection.left_pair !== null) {
        map[selection.left_pair] = selection
      }
    })
    return map
  }, [selections])

  const rightStatusMap = useMemo(() => {
    const map = {}
    selections.forEach(selection => {
      if (selection && selection.selected_right_pair !== undefined && selection.selected_right_pair !== null) {
        map[selection.selected_right_pair] = selection.is_correct ? 'correct' : 'incorrect'
      }
    })
    return map
  }, [selections])

  useLayoutEffect(() => {
    const updateLines = () => {
      if (!containerRef.current) return
      const containerRect = containerRef.current.getBoundingClientRect()
      const newLines = (question.matching_pairs || []).map(pair => {
        const selection = selectionMap[pair.id]
        if (!selection || !selection.selected_right_pair) return null

        const leftEl = leftRefs.current[pair.id]
        const rightEl = rightRefs.current[selection.selected_right_pair]
        if (!leftEl || !rightEl) return null

        const leftRect = leftEl.getBoundingClientRect()
        const rightRect = rightEl.getBoundingClientRect()

        return {
          leftId: pair.id,
          isCorrect: selection.is_correct,
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
  }, [question.matching_pairs, selectionMap])

  const arrowId = `matching-review-arrow-${question.id}`

  return (
    <div ref={containerRef} className="relative">
      <svg className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden="true">
        <defs>
          <marker id={arrowId} markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto">
            <path d="M0,0 L10,5 L0,10 z" fill="rgba(148, 163, 184, 0.8)" />
          </marker>
        </defs>
        {lines.map(line => (
          <g key={`line-${line.leftId}`}>
            <line
              x1={line.x1}
              y1={line.y1}
              x2={line.x2}
              y2={line.y2}
              stroke={line.isCorrect ? 'rgba(34, 197, 94, 0.7)' : 'rgba(239, 68, 68, 0.7)'}
              strokeWidth="2.5"
              markerEnd={`url(#${arrowId})`}
            />
            <circle
              cx={line.x1}
              cy={line.y1}
              r="4"
              fill={line.isCorrect ? 'rgba(34, 197, 94, 0.9)' : 'rgba(239, 68, 68, 0.9)'}
            />
          </g>
        ))}
      </svg>

      <div className="relative z-10 grid grid-cols-2 gap-4">
        <div className="space-y-3">
          {(question.matching_pairs || []).map(pair => {
            const selection = selectionMap[pair.id]
            const status = selection ? (selection.is_correct ? 'correct' : 'incorrect') : 'empty'
            let styling = 'w-full rounded-full border px-4 py-3 text-left text-sm font-semibold tracking-wide'
            if (status === 'correct') {
              styling = cn(styling, 'border-green-300 bg-green-50 text-green-700')
            } else if (status === 'incorrect') {
              styling = cn(styling, 'border-red-300 bg-red-50 text-red-700')
            } else {
              styling = cn(styling, 'border-border/60 bg-muted/40 text-muted-foreground')
            }

            return (
              <div
                key={pair.id}
                ref={el => {
                  if (el) {
                    leftRefs.current[pair.id] = el
                  } else {
                    delete leftRefs.current[pair.id]
                  }
                }}
                className={styling}
              >
                {pair.left_text}
              </div>
            )
          })}
        </div>

        <div className="space-y-3">
          {(question.matching_pairs || []).map(option => {
            const status = rightStatusMap[option.id] || 'empty'
            let styling = 'w-full rounded-full border px-4 py-3 text-right text-sm font-semibold tracking-wide'
            if (status === 'correct') {
              styling = cn(styling, 'border-green-300 bg-green-50 text-green-700')
            } else if (status === 'incorrect') {
              styling = cn(styling, 'border-red-300 bg-red-50 text-red-700')
            } else {
              styling = cn(styling, 'border-border/60 bg-muted/40 text-muted-foreground')
            }

            return (
              <div
                key={option.id}
                ref={el => {
                  if (el) {
                    rightRefs.current[option.id] = el
                  } else {
                    delete rightRefs.current[option.id]
                  }
                }}
                className={styling}
              >
                {option.right_text}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

const getQuestionTypeLabel = (question) => {
  switch (question.question_type) {
    case 'qcm_single':
      return 'QCM - Single Choice'
    case 'qcm_multiple':
      return 'QCM - Multiple Choice'
    case 'true_false':
      return 'True / False'
    case 'open_short':
      return 'Open - Short Answer'
    case 'open_long':
      return 'Open - Long Answer'
    case 'fill_blank':
      return 'Fill in the Blanks'
    case 'ordering':
      return 'Ordering'
    case 'matching':
      return 'Matching'
    default:
      return 'Question'
  }
}

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
              const questionType = question.question_type
              const blankSelections = answer.blank_selections || []
              const orderingSelections = answer.ordering_selections || []
              const matchingSelections = answer.matching_selections || []
              const hasChoices = answer.selected_choices && answer.selected_choices.length > 0
              const blankAnswerMap = questionType === 'fill_blank' ? buildBlankSelectionMap(question, blankSelections, t) : null
              const blankCorrectMap = questionType === 'fill_blank' ? buildBlankCorrectMap(question, t) : null

              return (
                <div key={answer.id} className="border rounded-lg p-4 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold">Question {index + 1}</h3>
                        <Badge variant="secondary" className="bg-muted-foreground/20 text-muted-foreground">
                          {getQuestionTypeLabel(question)}
                        </Badge>
                        <Badge variant="outline">{question.points} pts</Badge>
                        {isAutoGraded && (
                          <Badge variant={answer.is_correct ? 'default' : 'destructive'} className="flex items-center gap-1">
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
                      {questionType === 'fill_blank'
                        ? renderBlankTokens(question, buildBlankSelectionMap(question, [], t), t)
                        : (
                          <p className="text-sm text-muted-foreground">
                            {question.question_text}
                          </p>
                        )}
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-3 space-y-3">
                    <p className="text-sm font-medium">Student's Answer:</p>
                    {answer.text_answer && (
                      <p className="text-sm whitespace-pre-wrap">{answer.text_answer}</p>
                    )}
                    {hasChoices && (
                      <div className="space-y-1">
                        {answer.selected_choices.map(choice => (
                          <div
                            key={choice.id}
                            className={cn(
                              'text-sm p-2 rounded',
                              choice.is_correct ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            )}
                          >
                            {choice.choice_text}
                          </div>
                        ))}
                      </div>
                    )}
                    {questionType === 'fill_blank' && blankAnswerMap && (
                      <div>{renderBlankTokens(question, blankAnswerMap, t)}</div>
                    )}
                    {questionType === 'ordering' && (
                      <div>{renderOrderingList(question, orderingSelections, t)}</div>
                    )}
                    {questionType === 'matching' && (
                      <div className="rounded-lg bg-white p-4">
                        <MatchingReview question={question} selections={matchingSelections} />
                      </div>
                    )}
                  </div>

                  {isAutoGraded && (() => {
                    if (['qcm_single', 'qcm_multiple', 'true_false'].includes(questionType) && question.choices && question.choices.length > 0) {
                      return (
                        <div className="bg-green-50 rounded-lg p-3 space-y-1">
                          <p className="text-sm font-medium">Correct Answer:</p>
                          {question.choices.filter(choice => choice.is_correct).map(choice => (
                            <div key={choice.id} className="text-sm text-green-700 flex items-center gap-2">
                              <CheckCircle className="h-4 w-4" />
                              <span>{choice.choice_text}</span>
                            </div>
                          ))}
                        </div>
                      )
                    }

                    if (questionType === 'fill_blank' && blankCorrectMap) {
                      return (
                        <div className="bg-green-50 rounded-lg p-3">
                          <p className="text-sm font-medium mb-2">Correct Answer:</p>
                          {renderBlankTokens(question, blankCorrectMap, t)}
                        </div>
                      )
                    }

                    if (questionType === 'ordering') {
                      const correctSelections = (question.ordering_items || []).map(item => ({
                        item: item.id,
                        selected_position: item.correct_position,
                        is_correct: true
                      }))
                      return (
                        <div className="bg-green-50 rounded-lg p-3">
                          <p className="text-sm font-medium mb-2">Correct Order:</p>
                          {renderOrderingList(question, correctSelections, t, { mode: 'correct' })}
                        </div>
                      )
                    }

                    if (questionType === 'matching') {
                      return (
                        <div className="bg-green-50 rounded-lg p-3 space-y-2">
                          <p className="text-sm font-medium">Correct Pairs:</p>
                          {(question.matching_pairs || []).map(pair => (
                            <div key={pair.id} className="flex items-center gap-2 text-sm text-green-700">
                              <CheckCircle className="h-4 w-4" />
                              <span>{pair.left_text} {'->'} {pair.right_text}</span>
                            </div>
                          ))}
                        </div>
                      )
                    }

                    return null
                  })()}

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
