import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../../hooks/useLanguage'
import { useAuth } from '../../hooks/useAuth'
import { DashboardLayout } from '../../components/layout/Layout'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import { Progress } from '../../components/ui/progress'
import {
  BookOpen,
  CheckCircle2,
  Clock,
  Target,
  TrendingUp,
  Award,
  Loader2,
  BarChart3,
  PieChart,
  Activity,
  Star,
  Trophy,
  ArrowLeft
} from 'lucide-react'
import progressService from '../../services/progress'
import { toast } from 'sonner'

const StudentProgressPage = () => {
  const { t } = useLanguage()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [progressData, setProgressData] = useState(null)
  const [lessonProgressList, setLessonProgressList] = useState([])

  // Fetch progress report
  const fetchProgressReport = async () => {
    setLoading(true)
    try {
      const report = await progressService.getStudentProgressReport('me')
      setProgressData(report)
    } catch (error) {
      console.error('Error fetching progress report:', error)
      toast.error(t('error.failedToLoadProgressData', 'Failed to load progress data'))
    } finally {
      setLoading(false)
    }
  }

  // Fetch lesson progress list
  const fetchLessonProgress = async () => {
    try {
      const response = await progressService.getLessonProgress({ student: 'me' })
      setLessonProgressList(response.results || response || [])
    } catch (error) {
      console.error('Error fetching lesson progress:', error)
    }
  }

  useEffect(() => {
    fetchProgressReport()
    fetchLessonProgress()
  }, [])

  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'completed':
        return 'default'
      case 'in_progress':
        return 'secondary'
      case 'not_started':
        return 'outline'
      default:
        return 'outline'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-4 w-4" />
      case 'in_progress':
        return <Activity className="h-4 w-4" />
      case 'not_started':
        return <BookOpen className="h-4 w-4" />
      default:
        return <BookOpen className="h-4 w-4" />
    }
  }

  const getPerformanceColor = (percentage) => {
    if (percentage >= 90) return 'text-green-600 dark:text-green-400'
    if (percentage >= 75) return 'text-blue-600 dark:text-blue-400'
    if (percentage >= 60) return 'text-yellow-600 dark:text-yellow-400'
    return 'text-red-600 dark:text-red-400'
  }

  const getPerformanceBgColor = (percentage) => {
    if (percentage >= 90) return 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800/50'
    if (percentage >= 75) return 'bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800/50'
    if (percentage >= 60) return 'bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-800/50'
    return 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800/50'
  }

  if (loading) {
    return (
      <DashboardLayout user={user}>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                {t('progress.studentProgress', 'My Progress')}
              </h1>
              <p className="text-muted-foreground mt-1">
                {t('progress.viewDetailedProgress', 'View detailed progress report')}
              </p>
            </div>
            <Button onClick={() => navigate('/student/profile/overview')} variant="outline" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              {t('common.goBack', 'Go Back')}
            </Button>
          </div>
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
              <p className="text-muted-foreground">{t('common.loadingData', 'Loading data...')}</p>
            </div>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (!progressData) {
    return (
      <DashboardLayout user={user}>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                {t('progress.studentProgress', 'My Progress')}
              </h1>
              <p className="text-muted-foreground mt-1">
                {t('progress.viewDetailedProgress', 'View detailed progress report')}
              </p>
            </div>
            <Button onClick={() => navigate('/student/profile/overview')} variant="outline" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              {t('common.goBack', 'Go Back')}
            </Button>
          </div>
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <p className="text-muted-foreground">{t('error.noProgressData', 'No progress data available')}</p>
            </div>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout user={user}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {t('progress.studentProgress', 'My Progress')}
            </h1>
            <p className="text-muted-foreground mt-1">
              {t('progress.comprehensiveProgressReport', 'Comprehensive Progress Report')}
            </p>
          </div>
          <Button onClick={() => navigate('/student/profile/overview')} variant="outline" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            {t('common.goBack', 'Go Back')}
          </Button>
        </div>

        {/* Summary Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Overall Completion */}
          <Card className={getPerformanceBgColor(progressData.overall_completion_percentage)}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">{t('progress.overallCompletion', 'Overall Completion')}</p>
                  <p className={`text-3xl font-bold ${getPerformanceColor(progressData.overall_completion_percentage)}`}>
                    {progressData.overall_completion_percentage}%
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {progressData.lessons_completed}/{progressData.total_lessons} {t('progress.lessonsCompleted', 'lessons completed')}
                  </p>
                </div>
                <Target className={`h-10 w-10 ${getPerformanceColor(progressData.overall_completion_percentage)}`} />
              </div>
            </CardContent>
          </Card>

          {/* Average Score */}
          <Card className={getPerformanceBgColor(progressData.overall_average_score)}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">{t('progress.averageScore', 'Average Score')}</p>
                  <p className={`text-3xl font-bold ${getPerformanceColor(progressData.overall_average_score)}`}>
                    {progressData.overall_average_score}%
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {t('progress.acrossAllLessons', 'Across all lessons')}
                  </p>
                </div>
                <Star className={`h-10 w-10 ${getPerformanceColor(progressData.overall_average_score)}`} />
              </div>
            </CardContent>
          </Card>

          {/* Accuracy */}
          <Card className={getPerformanceBgColor(progressData.overall_accuracy_percentage)}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">{t('progress.accuracy', 'Accuracy')}</p>
                  <p className={`text-3xl font-bold ${getPerformanceColor(progressData.overall_accuracy_percentage)}`}>
                    {progressData.overall_accuracy_percentage}%
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {t('progress.correctAnswers', 'Correct answers')}
                  </p>
                </div>
                <TrendingUp className={`h-10 w-10 ${getPerformanceColor(progressData.overall_accuracy_percentage)}`} />
              </div>
            </CardContent>
          </Card>

          {/* Time Spent */}
          <Card className="bg-purple-50 dark:bg-purple-950/20 border-purple-200 dark:border-purple-800/50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-foreground">{t('progress.timeSpent', 'Time Spent')}</p>
                  <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                    {Math.floor(progressData.total_time_spent / 60)}h
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {progressData.total_time_spent % 60}m {t('progress.minutes', 'minutes')}
                  </p>
                </div>
                <Clock className="h-10 w-10 text-purple-600 dark:text-purple-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Statistics Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Learning Progress */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5 text-primary" />
                {t('progress.learningProgress', 'Learning Progress')}
              </CardTitle>
              <CardDescription>{t('progress.breakdownByStatus', 'Breakdown by lesson status')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-medium">{t('progress.completed', 'Completed')}</span>
                  </div>
                  <span className="text-sm font-bold text-green-600">
                    {progressData.lessons_completed} ({progressData.total_lessons > 0 ? ((progressData.lessons_completed / progressData.total_lessons) * 100).toFixed(1) : 0}%)
                  </span>
                </div>
                <Progress
                  value={progressData.total_lessons > 0 ? (progressData.lessons_completed / progressData.total_lessons) * 100 : 0}
                  className="h-3"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium">{t('progress.inProgress', 'In Progress')}</span>
                  </div>
                  <span className="text-sm font-bold text-blue-600">
                    {progressData.lessons_in_progress} ({progressData.total_lessons > 0 ? ((progressData.lessons_in_progress / progressData.total_lessons) * 100).toFixed(1) : 0}%)
                  </span>
                </div>
                <Progress
                  value={progressData.total_lessons > 0 ? (progressData.lessons_in_progress / progressData.total_lessons) * 100 : 0}
                  className="h-3"
                  indicatorClassName="bg-blue-500"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-gray-600" />
                    <span className="text-sm font-medium">{t('progress.notStarted', 'Not Started')}</span>
                  </div>
                  <span className="text-sm font-bold text-gray-600">
                    {progressData.lessons_not_started} ({progressData.total_lessons > 0 ? ((progressData.lessons_not_started / progressData.total_lessons) * 100).toFixed(1) : 0}%)
                  </span>
                </div>
                <Progress
                  value={progressData.total_lessons > 0 ? (progressData.lessons_not_started / progressData.total_lessons) * 100 : 0}
                  className="h-3"
                  indicatorClassName="bg-gray-400"
                />
              </div>
            </CardContent>
          </Card>

          {/* Rewards & Achievements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-primary" />
                {t('progress.rewardsAchievements', 'Rewards & Achievements')}
              </CardTitle>
              <CardDescription>{t('progress.earnedRewards', 'Points, coins, and badges earned')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg border border-yellow-200 dark:border-yellow-800/50">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-yellow-100 dark:bg-yellow-900/50 flex items-center justify-center">
                    <Award className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{t('progress.totalPoints', 'Total Points')}</p>
                    <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                      {progressData.total_points_earned || 0}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-amber-50 dark:bg-amber-950/20 rounded-lg border border-amber-200 dark:border-amber-800/50">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center">
                    <Star className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{t('progress.totalCoins', 'Total Coins')}</p>
                    <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                      {progressData.total_coins_earned || 0}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-purple-50 dark:bg-purple-950/20 rounded-lg border border-purple-200 dark:border-purple-800/50">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center">
                    <Trophy className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{t('progress.badgesEarned', 'Badges Earned')}</p>
                    <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                      {progressData.badges_earned || 0}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Lesson Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              {t('progress.lessonByLessonProgress', 'Lesson-by-Lesson Progress')}
            </CardTitle>
            <CardDescription>
              {t('progress.detailedBreakdown', 'Detailed breakdown of each lesson')} ({lessonProgressList.length} {t('progress.lessons', 'lessons')})
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {lessonProgressList.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <BookOpen className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>{t('progress.noLessonsYet', 'No lessons tracked yet')}</p>
                </div>
              ) : (
                lessonProgressList.map((progress) => (
                  <div
                    key={progress.id}
                    className="flex items-center gap-4 p-4 rounded-lg border border-border/50 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-medium text-foreground">
                          {progress.lesson_title || progress.lesson_title_arabic || progress.lesson_title_french}
                        </h4>
                        <Badge variant={getStatusBadgeVariant(progress.status)} className="gap-1">
                          {getStatusIcon(progress.status)}
                          {t(`progress.status.${progress.status}`)}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                        <div>
                          <p className="text-xs text-muted-foreground">{t('progress.completion', 'Completion')}</p>
                          <p className="text-sm font-medium">{progress.completion_percentage}%</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">{t('progress.score', 'Score')}</p>
                          <p className="text-sm font-medium">{progress.average_score || 0}%</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">{t('progress.accuracy', 'Accuracy')}</p>
                          <p className="text-sm font-medium">{progress.accuracy_percentage || 0}%</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">{t('progress.exercises', 'Exercises')}</p>
                          <p className="text-sm font-medium">{progress.exercises_completed}/{progress.exercises_total}</p>
                        </div>
                      </div>

                      <Progress value={progress.completion_percentage} className="h-2" />
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

      </div>
    </DashboardLayout>
  )
}

export default StudentProgressPage
