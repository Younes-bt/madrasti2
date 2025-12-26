import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { DashboardLayout } from '../../components/layout/Layout'
import { useLanguage } from '../../hooks/useLanguage'
import { useAuth } from '../../hooks/useAuth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import { Button } from '../../components/ui/button'
import { Progress } from '../../components/ui/progress'
import { Alert, AlertDescription } from '../../components/ui/alert'
import { exerciseService } from '../../services/exercises'
import { rewardsService } from '../../services'
import { ROUTES } from '../../utils/constants'
import ExerciseReviewModal from '../../components/ExerciseReviewModal'
import {
  Award,
  CheckCircle,
  Coins as CoinsIcon,
  Layers,
  Loader2,
  PlayCircle,
  RefreshCw,
  RotateCcw,
  Target,
  Trophy
} from 'lucide-react'
import { cn } from '../../lib/utils'

const STATUS_CONFIG = {
  completed: {
    label: 'Completed',
    className: 'bg-emerald-50 text-emerald-700 border-emerald-200'
  },
  in_progress: {
    label: 'In progress',
    className: 'bg-amber-50 text-amber-700 border-amber-200'
  },
  available: {
    label: 'Not started',
    className: 'bg-slate-50 text-slate-700 border-slate-200'
  },
  draft: {
    label: 'Draft',
    className: 'bg-slate-50 text-slate-700 border-slate-200'
  }
}

const formatNumber = (value) => {
  const numeric = Number(value)
  if (Number.isNaN(numeric)) return '--'
  return new Intl.NumberFormat().format(numeric)
}

const StudentMyExercisesPage = () => {
  const { t } = useLanguage()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [wallet, setWallet] = useState(null)
  const [exercises, setExercises] = useState([])
  const [reviewExercise, setReviewExercise] = useState(null)

  const loadData = async () => {
    setLoading(true)
    setError(null)

    try {
      // Fetch submissions first - backend auto-filters by current student
      const [submissionsResponse, walletResult] = await Promise.all([
        exerciseService.getExerciseSubmissions({ page_size: 1000, ordering: '-submitted_at' }),
        rewardsService.getMyWallet().catch(() => null)
      ])

      const submissions = submissionsResponse?.success ? submissionsResponse.data || [] : []

      // Group submissions by exercise_id and keep only the best attempt
      const submissionByExercise = new Map()
      submissions.forEach((submission) => {
        const exerciseId = submission?.exercise_id ?? submission?.exercise?.id
        if (!exerciseId) return

        const existing = submissionByExercise.get(exerciseId)
        const candidateScore = Number(submission?.total_score ?? 0)
        const existingScore = Number(existing?.total_score ?? -1)

        if (!existing || candidateScore > existingScore) {
          submissionByExercise.set(exerciseId, submission)
        }
      })

      // Fetch full exercise details for all submitted exercises
      const uniqueExerciseIds = Array.from(submissionByExercise.keys())
      const exerciseDetailsPromises = uniqueExerciseIds.map(id =>
        exerciseService.getExerciseById(id).catch(() => null)
      )
      const exerciseDetails = await Promise.all(exerciseDetailsPromises)

      // Create exercise lookup map
      const exerciseMap = new Map()
      exerciseDetails.forEach(result => {
        if (result?.success && result?.data) {
          exerciseMap.set(result.data.id, result.data)
        }
      })

      // Convert submissions to exercise-like objects for display
      const exercisesFromSubmissions = Array.from(submissionByExercise.values()).map((submission) => {
        const submissionStatus = (submission?.status || '').toString().toLowerCase()
        const exerciseId = submission.exercise_id || submission.exercise?.id
        const exerciseDetails = exerciseMap.get(exerciseId)

        // Determine status based on submission
        let status = 'available'
        if (['completed', 'auto_graded', 'reviewed'].includes(submissionStatus)) {
          status = 'completed'
        } else if (['in_progress', 'started'].includes(submissionStatus)) {
          status = 'in_progress'
        }

        return {
          id: exerciseId,
          title: exerciseDetails?.title || `Exercise ${exerciseId}`,
          description: exerciseDetails?.description || '',
          questions: exerciseDetails?.questions || [],
          total_points: exerciseDetails?.total_points || 0,
          submission,
          status,
          bestScore: submission?.total_score ?? null,
          earnedPoints: submission?.points_earned ?? null
        }
      })

      console.log('✅ Final exercises with details:', exercisesFromSubmissions.length, exercisesFromSubmissions)

      setExercises(exercisesFromSubmissions)
      setWallet(walletResult || null)

      if (!submissionsResponse.success) {
        setError(submissionsResponse.error || t('errors.loadData', 'Unable to load exercises right now.'))
      }
    } catch (err) {
      console.error('Failed to load exercises overview:', err)
      setError(t('errors.loadData', 'Unable to load exercises right now.'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [user?.id])

  const stats = useMemo(() => {
    const total = exercises.length
    const completed = exercises.filter((ex) => ex.status === 'completed').length
    const inProgress = exercises.filter((ex) => ex.status === 'in_progress').length
    const notStarted = Math.max(0, total - completed - inProgress)

    const completedWithScores = exercises.filter(
      (ex) => ex.status === 'completed' && typeof ex.bestScore === 'number'
    )
    const avgScore =
      completedWithScores.length > 0
        ? completedWithScores.reduce((sum, ex) => sum + Number(ex.bestScore || 0), 0) /
        completedWithScores.length
        : 0

    const earnedPoints = exercises.reduce(
      (sum, ex) => sum + (Number(ex.earnedPoints || 0) || 0),
      0
    )

    return {
      total,
      completed,
      inProgress,
      notStarted,
      avgScore: Math.round(avgScore),
      earnedPoints
    }
  }, [exercises])

  const completedExercises = useMemo(
    () => exercises.filter((ex) => ex.status === 'completed'),
    [exercises]
  )

  const activeExercises = useMemo(
    () => exercises.filter((ex) => ex.status !== 'completed'),
    [exercises]
  )

  const handleOpenExercise = (exerciseId) => {
    const target = ROUTES.STUDENT_EXERCISES.VIEW.replace(':exerciseId', exerciseId)
    navigate(target)
  }

  const renderExerciseRow = (exercise, isCompleted = false) => {
    const statusConfig = STATUS_CONFIG[exercise.status] || STATUS_CONFIG.available
    const questionsCount =
      exercise.questions_count || exercise.questions?.length || exercise.total_questions
    const totalPoints = exercise.total_points || exercise.total_score || exercise.max_score
    const difficulty = exercise.difficulty_level || exercise.difficulty
    const lessonTitle =
      exercise.lesson_details?.title ||
      exercise.lesson_details?.name ||
      exercise.lesson_title ||
      exercise.lesson_name

    const buttonProps = (() => {
      if (exercise.status === 'completed') {
        return {
          label: t('exercises.viewResults', 'View result'),
          Icon: CheckCircle,
          variant: 'outline',
          disabled: false,
          onClick: () => setReviewExercise(exercise)
        }
      }
      if (exercise.status === 'in_progress') {
        return {
          label: t('exercises.continue', 'Continue'),
          Icon: RotateCcw,
          variant: 'outline',
          disabled: false
        }
      }
      if (exercise.status === 'draft') {
        return {
          label: t('common.unavailable', 'Unavailable'),
          Icon: Layers,
          variant: 'secondary',
          disabled: true
        }
      }
      return {
        label: t('exercises.start', 'Start exercise'),
        Icon: PlayCircle,
        variant: 'default',
        disabled: false
      }
    })()

    return (
      <div
        key={exercise.id}
        className="rounded-lg border border-border/70 bg-card/60 p-4 shadow-sm"
      >
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-base font-semibold leading-tight">
                {exercise.title || t('exercises.untitled', 'Untitled exercise')}
              </h3>
              <Badge variant="outline" className={cn('border px-2 py-0.5 text-xs', statusConfig.className)}>
                {t(`exercises.status.${exercise.status}`, statusConfig.label)}
              </Badge>
              {difficulty ? (
                <Badge variant="outline" className="text-xs uppercase">
                  {difficulty}
                </Badge>
              ) : null}
            </div>

            {lessonTitle ? (
              <p className="text-sm text-muted-foreground">{lessonTitle}</p>
            ) : null}

            <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
              {questionsCount ? (
                <span className="flex items-center gap-1">
                  <Target className="h-3.5 w-3.5" />
                  {questionsCount} {t('exercises.questions', 'questions')}
                </span>
              ) : null}
              {totalPoints ? (
                <span className="flex items-center gap-1">
                  <Trophy className="h-3.5 w-3.5" />
                  {totalPoints} {t('exercises.points', 'points')}
                </span>
              ) : null}
              {exercise.earnedPoints ? (
                <span className="flex items-center gap-1">
                  <Award className="h-3.5 w-3.5 text-amber-500" />
                  {formatNumber(exercise.earnedPoints)} {t('exercises.rewardPoints', 'reward pts')}
                </span>
              ) : null}
            </div>

            {isCompleted ? (
              <div className="flex flex-wrap items-center gap-3 text-sm">
                <div className="flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-emerald-700">
                  <CheckCircle className="h-4 w-4" />
                  <span>
                    {t('exercises.score', 'Score')}:{' '}
                    {exercise.bestScore != null
                      ? `${exercise.bestScore}${totalPoints ? ` / ${totalPoints}` : ''
                      }`
                      : t('exercises.awaitingReview', 'Awaiting review')}
                  </span>
                </div>
                {exercise.submission?.submitted_at ? (
                  <span className="text-xs text-muted-foreground">
                    {t('exercises.submittedOn', 'Submitted on')}{' '}
                    {new Date(exercise.submission.submitted_at).toLocaleDateString()}
                  </span>
                ) : null}
              </div>
            ) : null}
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant={buttonProps.variant}
              disabled={buttonProps.disabled}
              onClick={buttonProps.onClick || (() => handleOpenExercise(exercise.id))}
              className="flex items-center gap-2"
            >
              <buttonProps.Icon className="h-4 w-4" />
              {buttonProps.label}
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <DashboardLayout user={user}>
      <div className="space-y-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold leading-tight">
              {t('studentSidebar.exercises.title', 'My Exercises')}
            </h1>
            <p className="text-sm text-muted-foreground">
              {t(
                'studentExercises.subtitle',
                'Track completed exercises, continue in-progress ones, and see the points you earned.'
              )}
            </p>
          </div>
          <Button variant="outline" onClick={loadData} disabled={loading} className="flex items-center gap-2">
            <RefreshCw className={cn('h-4 w-4', loading ? 'animate-spin' : '')} />
            {t('common.refresh', 'Refresh')}
          </Button>
        </div>

        {error ? (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : null}

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>{t('exercises.completed', 'Completed')}</CardDescription>
              <CardTitle className="text-3xl">{stats.completed}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              {t('exercises.completedHelper', 'Finished attempts with scores.')}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>{t('exercises.inProgress', 'In progress')}</CardDescription>
              <CardTitle className="text-3xl">{stats.inProgress}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              {t('exercises.inProgressHelper', 'You can pick up where you left off.')}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>{t('exercises.notStarted', 'Not started')}</CardDescription>
              <CardTitle className="text-3xl">{stats.notStarted}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              {t('exercises.notStartedHelper', 'Exercises waiting for you.')}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>{t('exercises.averageScore', 'Average score')}</CardDescription>
              <CardTitle className="text-3xl">{stats.avgScore || 0}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              {t('exercises.averageScoreHelper', 'Across completed exercises.')}
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-emerald-600" />
                <CardTitle className="text-lg">
                  {t('exercises.completedList', 'Completed exercises')}
                </CardTitle>
              </div>
              <CardDescription>
                {t('exercises.completedListHelper', 'See your scores and rewards.')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {loading ? (
                <div className="flex items-center justify-center gap-2 py-10 text-muted-foreground">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  {t('common.loading', 'Loading...')}
                </div>
              ) : completedExercises.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed p-8 text-center text-muted-foreground">
                  <Layers className="h-8 w-8" />
                  <p>{t('exercises.noCompleted', 'No completed exercises yet.')}</p>
                </div>
              ) : (
                completedExercises.map((exercise) => renderExerciseRow(exercise, true))
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-amber-500" />
                <CardTitle className="text-lg">
                  {t('exercises.myScores', 'My scores')}
                </CardTitle>
              </div>
              <CardDescription>
                {t('exercises.myScoresHelper', 'Points, coins, and recent achievements.')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg border border-border/70 bg-card/60 p-3">
                  <p className="text-xs text-muted-foreground">{t('exercises.points', 'Points')}</p>
                  <p className="text-xl font-semibold">
                    {formatNumber(wallet?.total_points ?? wallet?.points ?? stats.earnedPoints)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {t('exercises.fromExercises', 'From exercises & rewards')}
                  </p>
                </div>
                <div className="rounded-lg border border-border/70 bg-card/60 p-3">
                  <p className="text-xs text-muted-foreground">{t('exercises.coins', 'Coins')}</p>
                  <p className="text-xl font-semibold">
                    {formatNumber(wallet?.total_coins ?? wallet?.coins ?? 0)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {t('exercises.coinsHelper', 'Spend in rewards center')}
                  </p>
                </div>
              </div>

              <div className="rounded-lg border border-border/70 bg-card/60 p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">
                      {t('exercises.averageScore', 'Average score')}
                    </p>
                    <p className="text-lg font-semibold">{stats.avgScore || 0}</p>
                  </div>
                  <Award className="h-5 w-5 text-amber-500" />
                </div>
                <Progress value={Math.min(100, stats.avgScore || 0)} className="mt-3" />
              </div>

              <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground">
                  {t('exercises.recentScores', 'Recent completed exercises')}
                </p>
                {completedExercises.length === 0 ? (
                  <p className="text-xs text-muted-foreground">
                    {t('exercises.noRecentScores', 'Scores will appear here after you finish an exercise.')}
                  </p>
                ) : (
                  completedExercises.slice(0, 3).map((exercise) => {
                    const totalPoints = exercise.total_points || exercise.total_score || exercise.max_score
                    return (
                      <div
                        key={`score-${exercise.id}`}
                        className="flex items-center justify-between rounded-md border border-border/60 bg-muted/40 px-3 py-2 text-sm"
                      >
                        <div className="flex flex-col">
                          <span className="font-medium text-foreground">
                            {exercise.title || t('exercises.untitled', 'Untitled exercise')}
                          </span>
                          {exercise.bestScore != null ? (
                            <span className="text-xs text-muted-foreground">
                              {exercise.bestScore}
                              {totalPoints ? ` / ${totalPoints}` : ''}{' '}
                              {t('exercises.points', 'points')}
                            </span>
                          ) : (
                            <span className="text-xs text-muted-foreground">
                              {t('exercises.awaitingReview', 'Awaiting review')}
                            </span>
                          )}
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {t('exercises.completed', 'Completed')}
                        </Badge>
                      </div>
                    )
                  })
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <RotateCcw className="h-5 w-5 text-blue-600" />
              <CardTitle className="text-lg">
                {t('exercises.activeList', 'In progress or not started')}
              </CardTitle>
            </div>
            <CardDescription>
              {t('exercises.activeListHelper', 'Resume or begin any exercise from here.')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {loading ? (
              <div className="flex items-center justify-center gap-2 py-10 text-muted-foreground">
                <Loader2 className="h-5 w-5 animate-spin" />
                {t('common.loading', 'Loading...')}
              </div>
            ) : activeExercises.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed p-8 text-center text-muted-foreground">
                <Layers className="h-8 w-8" />
                <p>{t('exercises.noPending', 'You are caught up!')}</p>
              </div>
            ) : (
              activeExercises.map((exercise) => renderExerciseRow(exercise, false))
            )}
          </CardContent>
        </Card>
      </div>

      {/* Exercise Review Modal */}
      <ExerciseReviewModal
        exercise={reviewExercise}
        open={!!reviewExercise}
        onClose={() => setReviewExercise(null)}
      />
    </DashboardLayout>
  )
}

export default StudentMyExercisesPage
