import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { Progress } from '../ui/progress'
import { Separator } from '../ui/separator'
import {
  Target,
  TrendingUp,
  Users,
  Clock,
  Trophy,
  Star,
  CheckCircle,
  AlertCircle,
  BarChart3,
  PieChart,
  Activity,
  Zap,
  Award,
  BookOpen
} from 'lucide-react'
import { cn } from '../../lib/utils'

const ExerciseAnalytics = ({ exerciseId, lessonId, className, variant = 'full' }) => {
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)

  // Mock analytics data - replace with real API call
  useEffect(() => {
    const mockData = {
      overview: {
        totalAttempts: 156,
        uniqueStudents: 42,
        completionRate: 78,
        averageScore: 85,
        averageTimeSpent: 12, // minutes
        perfectScores: 18
      },
      difficulty: {
        tooEasy: 15,
        justRight: 70,
        tooHard: 15
      },
      performance: {
        excellent: 35, // 90-100%
        good: 40,      // 70-89%
        needs_work: 25 // <70%
      },
      engagement: {
        multipleAttempts: 65,
        completedFirstTry: 35,
        droppedOut: 8,
        timeOnTask: 85 // percentage of estimated time
      },
      questions: [
        { id: 1, question: "What is 2+2?", correctRate: 95, avgTime: 30 },
        { id: 2, question: "Solve for x: 2x = 10", correctRate: 78, avgTime: 45 },
        { id: 3, question: "What is the area of a circle?", correctRate: 62, avgTime: 90 }
      ],
      trends: {
        lastWeek: { attempts: 89, completion: 82 },
        thisWeek: { attempts: 67, completion: 74 },
        change: { attempts: -25, completion: -10 }
      },
      rewards: {
        totalPointsAwarded: 1420,
        totalCoinsAwarded: 89,
        totalXpAwarded: 2340,
        badges: ['Perfect Score', 'Quick Learner', 'Persistent']
      }
    }

    // Simulate API delay
    setTimeout(() => {
      setAnalytics(mockData)
      setLoading(false)
    }, 1000)
  }, [exerciseId, lessonId])

  if (loading) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
            <span className="ml-2 text-sm text-muted-foreground">Loading analytics...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!analytics) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="text-center text-muted-foreground">
            <BarChart3 className="h-8 w-8 mx-auto mb-2" />
            <p>No analytics data available</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (variant === 'compact') {
    return (
      <Card className={className}>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Activity className="h-4 w-4 text-green-600" />
            Exercise Analytics
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-3 text-center">
            <div>
              <div className="text-lg font-bold text-green-600">{analytics.overview.completionRate}%</div>
              <div className="text-xs text-muted-foreground">Completion</div>
            </div>
            <div>
              <div className="text-lg font-bold text-blue-600">{analytics.overview.averageScore}%</div>
              <div className="text-xs text-muted-foreground">Avg Score</div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 text-center">
            <div>
              <div className="text-lg font-bold text-purple-600">{analytics.overview.uniqueStudents}</div>
              <div className="text-xs text-muted-foreground">Students</div>
            </div>
            <div>
              <div className="text-lg font-bold text-orange-600">{analytics.overview.totalAttempts}</div>
              <div className="text-xs text-muted-foreground">Attempts</div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{analytics.overview.completionRate}%</div>
            <p className="text-xs text-muted-foreground">
              {analytics.overview.uniqueStudents} of {Math.round(analytics.overview.uniqueStudents / (analytics.overview.completionRate / 100))} students
            </p>
            <Progress value={analytics.overview.completionRate} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <Star className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{analytics.overview.averageScore}%</div>
            <p className="text-xs text-muted-foreground">
              {analytics.overview.perfectScores} perfect scores
            </p>
            <Progress value={analytics.overview.averageScore} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Engagement</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{analytics.overview.totalAttempts}</div>
            <p className="text-xs text-muted-foreground">
              Total attempts made
            </p>
            <div className="text-xs text-muted-foreground mt-1">
              {analytics.engagement.multipleAttempts}% tried multiple times
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Time on Task</CardTitle>
            <Clock className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{analytics.overview.averageTimeSpent}m</div>
            <p className="text-xs text-muted-foreground">
              Average time spent
            </p>
            <div className="text-xs text-muted-foreground mt-1">
              {analytics.engagement.timeOnTask}% of estimated time
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Performance Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Excellent (90-100%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Progress value={analytics.performance.excellent} className="w-20" />
                  <span className="text-sm font-medium">{analytics.performance.excellent}%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span className="text-sm">Good (70-89%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Progress value={analytics.performance.good} className="w-20" />
                  <span className="text-sm font-medium">{analytics.performance.good}%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="text-sm">Needs Work (&lt;70%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Progress value={analytics.performance.needs_work} className="w-20" />
                  <span className="text-sm font-medium">{analytics.performance.needs_work}%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Difficulty Perception */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Difficulty Assessment
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-red-500" />
                  <span className="text-sm">Too Hard</span>
                </div>
                <div className="flex items-center gap-2">
                  <Progress value={analytics.difficulty.tooHard} className="w-20" />
                  <span className="text-sm font-medium">{analytics.difficulty.tooHard}%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Just Right</span>
                </div>
                <div className="flex items-center gap-2">
                  <Progress value={analytics.difficulty.justRight} className="w-20" />
                  <span className="text-sm font-medium">{analytics.difficulty.justRight}%</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-orange-500" />
                  <span className="text-sm">Too Easy</span>
                </div>
                <div className="flex items-center gap-2">
                  <Progress value={analytics.difficulty.tooEasy} className="w-20" />
                  <span className="text-sm font-medium">{analytics.difficulty.tooEasy}%</span>
                </div>
              </div>
            </div>
            <div className="pt-2 text-xs text-muted-foreground">
              💡 Based on student performance and time spent
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Question-by-Question Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Question Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {analytics.questions.map((question, index) => (
              <div key={question.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-sm">Question {index + 1}</h4>
                  <Badge variant={question.correctRate >= 80 ? 'default' : question.correctRate >= 60 ? 'secondary' : 'destructive'}>
                    {question.correctRate}% correct
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{question.question}</p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    <span>{question.avgTime}s avg</span>
                  </div>
                  <Progress value={question.correctRate} className="flex-1" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Rewards Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Rewards & Gamification
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600">{analytics.rewards.totalPointsAwarded}</div>
              <div className="text-xs text-muted-foreground">Points Awarded</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{analytics.rewards.totalCoinsAwarded}</div>
              <div className="text-xs text-muted-foreground">Coins Earned</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{analytics.rewards.totalXpAwarded}</div>
              <div className="text-xs text-muted-foreground">XP Gained</div>
            </div>
          </div>
          <Separator className="my-4" />
          <div>
            <h4 className="font-medium text-sm mb-2">Badges Earned</h4>
            <div className="flex flex-wrap gap-2">
              {analytics.rewards.badges.map((badge, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  <Trophy className="h-3 w-3 mr-1" />
                  {badge}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Trends */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Weekly Trends
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-sm mb-3">Attempts</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Last Week</span>
                  <span className="font-medium">{analytics.trends.lastWeek.attempts}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">This Week</span>
                  <span className="font-medium">{analytics.trends.thisWeek.attempts}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Change</span>
                  <Badge variant={analytics.trends.change.attempts >= 0 ? 'default' : 'destructive'}>
                    {analytics.trends.change.attempts >= 0 ? '+' : ''}{analytics.trends.change.attempts}%
                  </Badge>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-medium text-sm mb-3">Completion Rate</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Last Week</span>
                  <span className="font-medium">{analytics.trends.lastWeek.completion}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">This Week</span>
                  <span className="font-medium">{analytics.trends.thisWeek.completion}%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Change</span>
                  <Badge variant={analytics.trends.change.completion >= 0 ? 'default' : 'destructive'}>
                    {analytics.trends.change.completion >= 0 ? '+' : ''}{analytics.trends.change.completion}%
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default ExerciseAnalytics