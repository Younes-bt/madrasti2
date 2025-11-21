import { useEffect, useState, useMemo, useRef, useLayoutEffect } from 'react'
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

import { useLanguage } from '../../hooks/useLanguage'
import { homeworkService } from '../../services'
import { ROUTES } from '../../utils/constants'
import { cn } from '../../lib/utils'

const getNotAnsweredLabel = (t) => t?.('studentSidebar.homework.submissionReview.notAnswered') || 'Not answered'

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
  const fallback = t?.('studentSidebar.homework.submissionReview.notProvided') || 'Not provided'
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

    const byLabel = blanks.find(blank =>
      Boolean(blank.label) && blank.label.toLowerCase() === normalized.toLowerCase()
    )
    if (byLabel) return byLabel

    const orderNumber = parseInt(normalized.replace(/[^0-9]/g, ''), 10)
    if (!Number.isNaN(orderNumber)) {
      const byOrder = blanks.find(blank => blank.order === orderNumber)
      if (byOrder) return byOrder
    }

    const fallbackToken = blanks.find(blank => `B${blank.order}`.toLowerCase() === normalized.toLowerCase())
    return fallbackToken || null
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
          styling = cn(styling, 'border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400')
        } else if (status === 'incorrect') {
          styling = cn(styling, 'border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400')
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

  const correctLabel = t?.('studentSidebar.homework.submissionReview.correctPosition') || 'Correct position'
  const positionLabel = t?.('studentSidebar.homework.submissionReview.position') || 'Position'

  return (
    <div className="space-y-2">
      {sortedRows.map(row => {
        let styling = 'flex items-center justify-between rounded-md border px-3 py-2 text-sm transition'
        if (mode === 'correct') {
          styling = cn(styling, 'border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400')
        } else if (row.selectedPosition === null || row.selectedPosition === undefined) {
          styling = cn(styling, 'border-border/60 bg-muted/40 text-muted-foreground')
        } else if (row.isCorrect) {
          styling = cn(styling, 'border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400')
        } else {
          styling = cn(styling, 'border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400')
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
          <marker id={`${arrowId}-correct`} markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto">
            <path d="M0,0 L10,5 L0,10 z" fill="rgba(34, 197, 94, 0.8)" className="dark:fill-green-400" />
          </marker>
          <marker id={`${arrowId}-incorrect`} markerWidth="10" markerHeight="10" refX="8" refY="5" orient="auto">
            <path d="M0,0 L10,5 L0,10 z" fill="rgba(239, 68, 68, 0.8)" className="dark:fill-red-400" />
          </marker>
        </defs>
        {lines.map(line => (
          <g key={`line-${line.leftId}`}>
            <line
              x1={line.x1}
              y1={line.y1}
              x2={line.x2}
              y2={line.y2}
              className={line.isCorrect ? 'stroke-green-600 dark:stroke-green-400' : 'stroke-red-600 dark:stroke-red-400'}
              strokeWidth="2.5"
              strokeOpacity="0.7"
              markerEnd={`url(#${arrowId}-${line.isCorrect ? 'correct' : 'incorrect'})`}
            />
            <circle
              cx={line.x1}
              cy={line.y1}
              r="4"
              className={line.isCorrect ? 'fill-green-600 dark:fill-green-400' : 'fill-red-600 dark:fill-red-400'}
              fillOpacity="0.9"
            />
          </g>
        ))}
      </svg>

      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-3">
          {(question.matching_pairs || []).map(pair => {
            const selection = selectionMap[pair.id]
            const status = selection ? (selection.is_correct ? 'correct' : 'incorrect') : 'empty'
            let styling = 'w-full rounded-full border px-4 py-3 text-left text-sm font-semibold tracking-wide'
            if (status === 'correct') {
              styling = cn(styling, 'border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400')
            } else if (status === 'incorrect') {
              styling = cn(styling, 'border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400')
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
              styling = cn(styling, 'border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400')
            } else if (status === 'incorrect') {
              styling = cn(styling, 'border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400')
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
        return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800'
      case 'submitted':
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800'
      case 'late':
        return 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 border-orange-200 dark:border-orange-800'
      default:
        return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700'
    }
  }

  const getScoreColor = (score, maxScore) => {
    if (!score || !maxScore) return 'text-muted-foreground'
    const percentage = (parseFloat(score) / parseFloat(maxScore)) * 100
    if (percentage >= 90) return 'text-green-600 dark:text-green-400'
    if (percentage >= 80) return 'text-blue-600 dark:text-blue-400'
    if (percentage >= 70) return 'text-yellow-600 dark:text-yellow-400'
    if (percentage >= 60) return 'text-orange-600 dark:text-orange-400'
    return 'text-red-600 dark:text-red-400'
  }

  const isGraded = (submission) => {
    return submission?.status === 'auto_graded' || submission?.status === 'manually_graded'
  }

  const renderQuestionReview = (answer, index) => {
    const question = answer.question
    const isCorrect = answer.is_correct
    const hasTeacherFeedback = answer.teacher_feedback && answer.teacher_feedback.trim() !== ''
    const questionType = question.question_type
    const blankSelections = answer.blank_selections || []
    const orderingSelections = answer.ordering_selections || []
    const matchingSelections = answer.matching_selections || []
    const blankAnswerMap = questionType === 'fill_blank' ? buildBlankSelectionMap(question, blankSelections, t) : null
    const blankCorrectMap = questionType === 'fill_blank' ? buildBlankCorrectMap(question, t) : null
    const hasChoices = answer.selected_choices && answer.selected_choices.length > 0

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
            <h4 className="text-sm font-semibold mb-2 text-blue-600 dark:text-blue-400">{t('studentSidebar.homework.submissionReview.yourAnswer')}</h4>
            <div className="bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/50 rounded-lg p-4 space-y-3">
              {answer.text_answer && (
                <p className="text-sm whitespace-pre-wrap text-foreground">{answer.text_answer}</p>
              )}

              {hasChoices && (
                <div className="space-y-2">
                  {answer.selected_choices.map(choice => (
                    <div
                      key={choice.id}
                      className={cn(
                        'text-sm p-3 rounded-md flex items-center gap-2 transition-colors',
                        choice.is_correct
                          ? 'bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800'
                          : 'bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800'
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

              {questionType === 'fill_blank' && blankAnswerMap && (
                <div>{renderBlankTokens(question, blankAnswerMap, t)}</div>
              )}

              {questionType === 'ordering' && (
                <div>{renderOrderingList(question, orderingSelections, t)}</div>
              )}

              {questionType === 'matching' && (
                <div className="rounded-lg bg-background/60 dark:bg-background/30 p-4 border border-border">
                  <MatchingReview question={question} selections={matchingSelections} />
                </div>
              )}
            </div>
          </div>

          {/* Correct Answer */}
          {isGraded(submission) && (() => {
            if (['qcm_single', 'qcm_multiple', 'true_false'].includes(questionType) && question.choices && question.choices.length > 0) {
              return (
                <div>
                  <h4 className="text-sm font-semibold mb-2 text-green-600 dark:text-green-400">{t('studentSidebar.homework.submissionReview.correctAnswer')}</h4>
                  <div className="bg-green-50/50 dark:bg-green-950/20 border border-green-100 dark:border-green-900/50 rounded-lg p-4 space-y-2">
                    {question.choices
                      .filter(choice => choice.is_correct)
                      .map(choice => (
                        <div
                          key={choice.id}
                          className="text-sm text-green-700 dark:text-green-400 flex items-center gap-2"
                        >
                          <CheckCircle className="h-4 w-4 flex-shrink-0" />
                          <span>{choice.choice_text}</span>
                        </div>
                      ))}
                  </div>
                </div>
              )
            }

            if (questionType === 'fill_blank' && blankCorrectMap) {
              return (
                <div>
                  <h4 className="text-sm font-semibold mb-2 text-green-600 dark:text-green-400">{t('studentSidebar.homework.submissionReview.correctAnswer')}</h4>
                  <div className="bg-green-50/50 dark:bg-green-950/20 border border-green-100 dark:border-green-900/50 rounded-lg p-4">
                    {renderBlankTokens(question, blankCorrectMap, t)}
                  </div>
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
                <div>
                  <h4 className="text-sm font-semibold mb-2 text-green-600 dark:text-green-400">{t('studentSidebar.homework.submissionReview.correctAnswer')}</h4>
                  <div className="bg-green-50/50 dark:bg-green-950/20 border border-green-100 dark:border-green-900/50 rounded-lg p-4">
                    {renderOrderingList(question, correctSelections, t, { mode: 'correct' })}
                  </div>
                </div>
              )
            }

            if (questionType === 'matching') {
              return (
                <div>
                  <h4 className="text-sm font-semibold mb-2 text-green-600 dark:text-green-400">{t('studentSidebar.homework.submissionReview.correctAnswer')}</h4>
                  <div className="bg-green-50/50 dark:bg-green-950/20 border border-green-100 dark:border-green-900/50 rounded-lg p-4 space-y-2">
                    {(question.matching_pairs || []).map(pair => (
                      <div key={pair.id} className="flex items-center gap-2 text-sm text-green-700 dark:text-green-400">
                        <CheckCircle className="h-4 w-4 flex-shrink-0" />
                        <span>{pair.left_text} {'->'} {pair.right_text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )
            }

            return null
          })()}

          {/* Teacher Feedback */}
          {hasTeacherFeedback && (
            <Alert className="bg-purple-50/50 dark:bg-purple-950/20 border-purple-200 dark:border-purple-900/50">
              <MessageSquare className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              <AlertDescription>
                <div className="text-sm">
                  <p className="font-semibold text-purple-900 dark:text-purple-300 mb-1">{t('studentSidebar.homework.submissionReview.teacherFeedback')}</p>
                  <p className="text-purple-800 dark:text-purple-400">{answer.teacher_feedback}</p>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Explanation */}
          {question.explanation && isGraded(submission) && (
            <Alert className="bg-amber-50/50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-900/50">
              <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              <AlertDescription className="text-sm text-amber-800 dark:text-amber-300">
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
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <Button
            variant="ghost"
            onClick={() => navigate(ROUTES.STUDENT_HOMEWORK.COMPLETED)}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('studentSidebar.homework.submissionReview.backToCompleted')}
          </Button>
          <Badge
            variant={graded ? 'default' : 'secondary'}
            className={cn('border', graded ? getStatusColor(submission.status) : '')}
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-blue-50/50 dark:bg-blue-950/20 border border-blue-100 dark:border-blue-900/50">
                <Calendar className="h-5 w-5 text-blue-500 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-foreground">{t('studentSidebar.homework.submissionReview.submitted')}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(submission.submitted_at)}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-amber-50/50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-900/50">
                <Clock className="h-5 w-5 text-amber-500 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-foreground">{t('studentSidebar.homework.submissionReview.timeTaken')}</p>
                  <p className="text-sm text-muted-foreground">
                    {submission.time_taken ? `${submission.time_taken} ${t('studentSidebar.homework.submissionReview.minutes')}` : t('studentSidebar.homework.submissionReview.notRecorded')}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-purple-50/50 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/50">
                <Target className="h-5 w-5 text-purple-500 dark:text-purple-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-foreground">{t('studentSidebar.homework.submissionReview.attempt')}</p>
                  <p className="text-sm text-muted-foreground">
                    #{submission.attempt_number}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-green-50/50 dark:bg-green-950/20 border border-green-100 dark:border-green-900/50">
                <TrendingUp className="h-5 w-5 text-green-500 dark:text-green-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-foreground">{t('common.status')}</p>
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
          <Alert className="bg-blue-50/50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900/50">
            <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <AlertDescription>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex-1">
                  <p className="font-semibold text-blue-900 dark:text-blue-300 mb-1">{t('studentSidebar.homework.submissionReview.notGradedYet')}</p>
                  <p className="text-sm text-blue-800 dark:text-blue-400">
                    {t('studentSidebar.homework.submissionReview.notGradedMessage')}
                  </p>
                </div>
                <Loader2 className="h-6 w-6 text-blue-600 dark:text-blue-400 animate-spin flex-shrink-0" />
              </div>
            </AlertDescription>
          </Alert>
        ) : (
          <>
            {/* Score Summary */}
            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border-green-200 dark:border-green-900/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-400">
                  <Trophy className="h-5 w-5" />
                  {t('studentSidebar.homework.submissionReview.yourScore')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-white/60 dark:bg-white/5 rounded-lg border border-green-100 dark:border-green-900/30 backdrop-blur-sm">
                    <div className="text-sm font-medium text-foreground mb-1">{t('studentSidebar.homework.submissionReview.totalScore')}</div>
                    <div className={cn('text-3xl font-bold', getScoreColor(submission.total_score, homework.total_points))}>
                      {submission.total_score || 0}
                    </div>
                    <div className="text-xs text-muted-foreground">{t('studentSidebar.homework.submissionReview.outOf')} {homework.total_points}</div>
                  </div>
                  <div className="text-center p-4 bg-white/60 dark:bg-white/5 rounded-lg border border-green-100 dark:border-green-900/30 backdrop-blur-sm">
                    <div className="text-sm font-medium text-foreground mb-1">{t('studentSidebar.homework.submissionReview.percentage')}</div>
                    <div className={cn('text-3xl font-bold', getScoreColor(scorePercentage, 100))}>
                      {scorePercentage.toFixed(0)}%
                    </div>
                    <div className="text-xs text-muted-foreground">{t('studentSidebar.homework.submissionReview.performance')}</div>
                  </div>
                  <div className="text-center p-4 bg-amber-100/60 dark:bg-amber-950/30 rounded-lg border border-amber-200 dark:border-amber-900/50">
                    <div className="text-sm font-medium text-amber-900 dark:text-amber-300 mb-1">{t('studentSidebar.homework.submissionReview.pointsEarned')}</div>
                    <div className="text-3xl font-bold text-amber-700 dark:text-amber-400 flex items-center justify-center gap-1">
                      <Coins className="h-6 w-6" />
                      {submission.points_earned || 0}
                    </div>
                    <div className="text-xs text-amber-700 dark:text-amber-500">{t('studentSidebar.homework.submissionReview.rewardPoints')}</div>
                  </div>
                  <div className="text-center p-4 bg-yellow-100/60 dark:bg-yellow-950/30 rounded-lg border border-yellow-200 dark:border-yellow-900/50">
                    <div className="text-sm font-medium text-yellow-900 dark:text-yellow-300 mb-1">{t('studentSidebar.homework.submissionReview.coinsEarned')}</div>
                    <div className="text-3xl font-bold text-yellow-700 dark:text-yellow-400 flex items-center justify-center gap-1">
                      <Star className="h-6 w-6" />
                      {submission.coins_earned || 0}
                    </div>
                    <div className="text-xs text-yellow-700 dark:text-yellow-500">{t('studentSidebar.homework.submissionReview.rewardCoins')}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Teacher Feedback */}
            {submission.teacher_feedback && submission.teacher_feedback.trim() !== '' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
                    <User className="h-5 w-5" />
                    {t('studentSidebar.homework.submissionReview.teacherOverallFeedback')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-purple-50/50 dark:bg-purple-950/20 rounded-lg p-4 border border-purple-200 dark:border-purple-900/50">
                    <p className="text-sm leading-relaxed text-purple-900 dark:text-purple-300 whitespace-pre-wrap">
                      {submission.teacher_feedback}
                    </p>
                  </div>
                  {submission.graded_by && (
                    <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
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
                <div className="flex items-center gap-3 p-4 bg-green-50/50 dark:bg-green-950/20 rounded-lg border border-green-100 dark:border-green-900/50">
                  <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-green-900 dark:text-green-300">{t('studentSidebar.homework.submissionReview.correctAnswers')}</p>
                    <p className="text-2xl font-bold text-green-700 dark:text-green-400">
                      {submission.answers?.filter(a => a.is_correct === true).length || 0}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-red-50/50 dark:bg-red-950/20 rounded-lg border border-red-100 dark:border-red-900/50">
                  <XCircle className="h-8 w-8 text-red-600 dark:text-red-400 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-red-900 dark:text-red-300">{t('studentSidebar.homework.submissionReview.incorrectAnswers')}</p>
                    <p className="text-2xl font-bold text-red-700 dark:text-red-400">
                      {submission.answers?.filter(a => a.is_correct === false).length || 0}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-blue-50/50 dark:bg-blue-950/20 rounded-lg border border-blue-100 dark:border-blue-900/50">
                  <Award className="h-8 w-8 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-blue-900 dark:text-blue-300">{t('studentSidebar.homework.submissionReview.totalRewards')}</p>
                    <p className="text-lg lg:text-xl font-bold text-blue-700 dark:text-blue-400">
                      {submission.points_earned || 0} {t('studentSidebar.homework.submissionReview.pts')} • {submission.coins_earned || 0} {t('studentSidebar.homework.submissionReview.coins')}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <Button
            variant="outline"
            onClick={() => navigate(ROUTES.STUDENT_HOMEWORK.COMPLETED)}
            className="w-full sm:w-auto"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t('studentSidebar.homework.submissionReview.backToHomework')}
          </Button>
          {graded && (
            <Button
              variant="default"
              onClick={() => navigate(ROUTES.STUDENT_REWARDS)}
              className="w-full sm:w-auto"
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
