import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Progress } from '../ui/progress'
import { Separator } from '../ui/separator'
import {
  BookOpen,
  Target,
  FileText,
  Users,
  Clock,
  TrendingUp,
  Award,
  CheckCircle,
  AlertCircle,
  Plus,
  Eye,
  BarChart3,
  Calendar,
  Activity,
  Zap,
  Star
} from 'lucide-react'
import { cn } from '../../lib/utils'
import HomeworkExerciseGuide from './HomeworkExerciseGuide'
import { QuickActionCard, CompactQuickActions, AnalyticsQuickCard } from './QuickActionCard'
import SmartSuggestions from './SmartSuggestions'
import { motion } from 'framer-motion'

const TeacherDashboardOverview = ({ className }) => {
  const navigate = useNavigate()
  const [showGuide, setShowGuide] = useState(false)
  const [dashboardData, setDashboardData] = useState(null)
  const [loading, setLoading] = useState(true)

  // Check if user is new to the system
  useEffect(() => {
    const hasSeenGuide = localStorage.getItem('hasSeenHomeworkExerciseGuide')
    if (!hasSeenGuide) {
      setShowGuide(true)
    }
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    // Mock data - replace with real API calls
    const mockData = {
      overview: {
        totalLessons: 24,
        activeLessons: 18,
        totalExercises: 42,
        activeExercises: 38,
        totalHomework: 15,
        activeHomework: 8,
        totalStudents: 156
      },
      recentActivity: [
        {
          id: 1,
          type: 'exercise_completed',
          student: 'Ahmed Hassan',
          exercise: 'Algebra Basics',
          score: 95,
          time: '2 hours ago'
        },
        {
          id: 2,
          type: 'homework_submitted',
          student: 'Sara Mohamed',
          homework: 'Chemistry Lab Report',
          time: '3 hours ago'
        },
        {
          id: 3,
          type: 'exercise_created',
          exercise: 'Physics Motion',
          time: '1 day ago'
        }
      ],
      upcomingDeadlines: [
        {
          id: 1,
          type: 'homework',
          title: 'Math Problem Set 3',
          dueDate: '2024-01-25',
          submissions: 45,
          totalStudents: 60,
          status: 'active'
        },
        {
          id: 2,
          type: 'homework',
          title: 'Science Project',
          dueDate: '2024-01-30',
          submissions: 12,
          totalStudents: 60,
          status: 'urgent'
        }
      ],
      topPerformingExercises: [
        {
          id: 1,
          title: 'Basic Equations',
          completionRate: 92,
          averageScore: 87,
          attempts: 156
        },
        {
          id: 2,
          title: 'Chemical Reactions',
          completionRate: 88,
          averageScore: 82,
          attempts: 134
        },
        {
          id: 3,
          title: 'Reading Comprehension',
          completionRate: 85,
          averageScore: 79,
          attempts: 121
        }
      ],
      weeklyStats: {
        exerciseCompletions: 234,
        homeworkSubmissions: 89,
        activeStudents: 142,
        averageEngagement: 78
      }
    }

    setTimeout(() => {
      setDashboardData(mockData)
      setLoading(false)
    }, 1000)
  }

  const handleGuideComplete = () => {
    localStorage.setItem('hasSeenHomeworkExerciseGuide', 'true')
    setShowGuide(false)
  }

  if (loading) {
    return (
      <div className={cn("space-y-6", className)}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Welcome Section */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Welcome back! 👋
              </h2>
              <p className="text-gray-600">
                Here's what's happening with your lessons, exercises, and homework today.
              </p>
            </div>
            <div className="flex gap-3">
              <HomeworkExerciseGuide
                trigger={
                  <Button variant="outline" size="sm">
                    📚 Learn: Homework vs Exercises
                  </Button>
                }
                onComplete={handleGuideComplete}
              />
              <Button onClick={() => navigate('/teacher/content/lessons')}>
                <BookOpen className="h-4 w-4 mr-2" />
                View Lessons
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Lessons</CardTitle>
              <BookOpen className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{dashboardData.overview.totalLessons}</div>
              <p className="text-xs text-muted-foreground">
                {dashboardData.overview.activeLessons} active
              </p>
              <Progress
                value={(dashboardData.overview.activeLessons / dashboardData.overview.totalLessons) * 100}
                className="mt-2"
              />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Practice Exercises</CardTitle>
              <Target className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{dashboardData.overview.totalExercises}</div>
              <p className="text-xs text-muted-foreground">
                {dashboardData.overview.activeExercises} published
              </p>
              <Progress
                value={(dashboardData.overview.activeExercises / dashboardData.overview.totalExercises) * 100}
                className="mt-2"
              />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Homework Assignments</CardTitle>
              <FileText className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{dashboardData.overview.totalHomework}</div>
              <p className="text-xs text-muted-foreground">
                {dashboardData.overview.activeHomework} active
              </p>
              <Progress
                value={(dashboardData.overview.activeHomework / dashboardData.overview.totalHomework) * 100}
                className="mt-2"
              />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
              <Users className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{dashboardData.overview.totalStudents}</div>
              <p className="text-xs text-muted-foreground">
                {dashboardData.weeklyStats.activeStudents} active this week
              </p>
              <Progress
                value={(dashboardData.weeklyStats.activeStudents / dashboardData.overview.totalStudents) * 100}
                className="mt-2"
              />
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <CompactQuickActions type="lesson" />
              <CompactQuickActions type="exercise" />
              <CompactQuickActions type="homework" />
            </CardContent>
          </Card>

          {/* Smart Suggestions */}
          <SmartSuggestions
            context="general"
            data={dashboardData}
          />
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Upcoming Deadlines */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Upcoming Deadlines
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dashboardData.upcomingDeadlines.map((deadline) => (
                  <div key={deadline.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="h-4 w-4 text-blue-600" />
                      <div>
                        <h4 className="font-medium text-sm">{deadline.title}</h4>
                        <p className="text-xs text-muted-foreground">
                          Due: {new Date(deadline.dueDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-sm font-medium">
                          {deadline.submissions}/{deadline.totalStudents}
                        </div>
                        <div className="text-xs text-muted-foreground">submitted</div>
                      </div>
                      <Badge variant={deadline.status === 'urgent' ? 'destructive' : 'default'}>
                        {Math.round((deadline.submissions / deadline.totalStudents) * 100)}%
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dashboardData.recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-center gap-3 p-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="flex-1">
                      {activity.type === 'exercise_completed' && (
                        <p className="text-sm">
                          <span className="font-medium">{activity.student}</span> completed{' '}
                          <span className="text-green-600">{activity.exercise}</span> with {activity.score}%
                        </p>
                      )}
                      {activity.type === 'homework_submitted' && (
                        <p className="text-sm">
                          <span className="font-medium">{activity.student}</span> submitted{' '}
                          <span className="text-blue-600">{activity.homework}</span>
                        </p>
                      )}
                      {activity.type === 'exercise_created' && (
                        <p className="text-sm">
                          You created exercise <span className="text-green-600">{activity.exercise}</span>
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Top Performing Exercises */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5" />
                Top Performing Exercises
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dashboardData.topPerformingExercises.map((exercise, index) => (
                  <div key={exercise.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Badge variant="secondary" className="w-6 h-6 rounded-full p-0 flex items-center justify-center text-xs">
                        {index + 1}
                      </Badge>
                      <div>
                        <h4 className="font-medium text-sm">{exercise.title}</h4>
                        <p className="text-xs text-muted-foreground">
                          {exercise.attempts} attempts
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <div className="text-sm font-medium text-green-600">{exercise.completionRate}%</div>
                        <div className="text-xs text-muted-foreground">completion</div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm font-medium text-blue-600">{exercise.averageScore}%</div>
                        <div className="text-xs text-muted-foreground">avg score</div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Weekly Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            This Week's Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{dashboardData.weeklyStats.exerciseCompletions}</div>
              <div className="text-sm text-muted-foreground">Exercise Completions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{dashboardData.weeklyStats.homeworkSubmissions}</div>
              <div className="text-sm text-muted-foreground">Homework Submissions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{dashboardData.weeklyStats.activeStudents}</div>
              <div className="text-sm text-muted-foreground">Active Students</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{dashboardData.weeklyStats.averageEngagement}%</div>
              <div className="text-sm text-muted-foreground">Avg Engagement</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Show guide dialog if user is new */}
      {showGuide && (
        <HomeworkExerciseGuide
          trigger={<div />}
          onComplete={handleGuideComplete}
        />
      )}
    </div>
  )
}

export default TeacherDashboardOverview