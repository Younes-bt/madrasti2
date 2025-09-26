import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useLanguage } from '../../hooks/useLanguage'
import { useAuth } from '../../hooks/useAuth'
import { TeacherPageLayout } from '../../components/teacher/layout'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import { exerciseService } from '../../services/exercises'
import lessonsService from '../../services/lessons'
import { toast } from 'sonner'
import {
  ArrowLeft,
  Plus,
  Target,
  BookOpen,
  Users,
  Clock,
  Edit,
  Eye,
  Trash2,
  MoreHorizontal,
  CheckCircle,
  AlertCircle,
  Timer,
  Trophy,
  Star,
  TrendingUp,
  Zap,
  Settings,
  Play,
  Pause
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '../../components/ui/dropdown-menu'
import { cn } from '../../lib/utils'
import { motion } from 'framer-motion'

const LessonExerciseManagementPage = () => {
  const { t, isRTL } = useLanguage()
  const { user } = useAuth()
  const navigate = useNavigate()
  const { lessonId } = useParams()

  const [lesson, setLesson] = useState(null)
  const [exercises, setExercises] = useState([])
  const [loading, setLoading] = useState(true)
  const [lessonLoading, setLessonLoading] = useState(true)

  // Statistics for this lesson's exercises
  const [stats, setStats] = useState({
    totalExercises: 0,
    activeExercises: 0,
    totalCompletions: 0,
    averageScore: 0
  })

  useEffect(() => {
    if (lessonId && user) {
      loadData()
    }
  }, [lessonId, user])

  const loadData = async () => {
    try {
      setLoading(true)
      setLessonLoading(true)

      // Load lesson details
      const lessonResult = await lessonsService.getLessonById(lessonId)
      if (lessonResult.success || lessonResult.id) {
        setLesson(lessonResult.data || lessonResult)
      } else {
        toast.error('Failed to load lesson details')
        navigate('/teacher/content/lessons')
        return
      }
      setLessonLoading(false)

      // Load exercises for this lesson
      const exercisesResult = await exerciseService.getExercises({
        lesson: lessonId,
        page_size: 100
      })

      if (exercisesResult.success) {
        setExercises(exercisesResult.data)

        // Calculate statistics
        const totalExercises = exercisesResult.data.length
        const activeExercises = exercisesResult.data.filter(ex => ex.is_active && ex.is_published).length
        const totalCompletions = exercisesResult.data.reduce((sum, ex) => sum + (ex.completion_count || 0), 0)
        const averageScore = totalExercises > 0
          ? exercisesResult.data.reduce((sum, ex) => sum + (ex.average_score || 0), 0) / totalExercises
          : 0

        setStats({
          totalExercises,
          activeExercises,
          totalCompletions,
          averageScore: Math.round(averageScore)
        })
      } else {
        toast.error('Failed to load exercises')
      }
    } catch (error) {
      console.error('Error loading data:', error)
      toast.error('Failed to load lesson data')
    } finally {
      setLoading(false)
    }
  }

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800'
      case 'intermediate': return 'bg-yellow-100 text-yellow-800'
      case 'advanced': return 'bg-orange-100 text-orange-800'
      case 'expert': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (exercise) => {
    if (exercise.is_active && exercise.is_published) return CheckCircle
    return AlertCircle
  }

  const getStatusColor = (exercise) => {
    if (exercise.is_active && exercise.is_published) return 'text-green-600'
    return 'text-gray-600'
  }

  const handleCreateExercise = () => {
    navigate(`/teacher/content/lessons/${lessonId}/exercises/add`)
  }

  const handleViewExercise = (exerciseId) => {
    navigate(`/teacher/content/lesson-exercises/${exerciseId}`)
  }

  const handleEditExercise = (exerciseId) => {
    navigate(`/teacher/content/lesson-exercises/${exerciseId}/edit`)
  }

  const handleDeleteExercise = async (exerciseId) => {
    if (window.confirm('Are you sure you want to delete this exercise?')) {
      try {
        const result = await exerciseService.deleteExercise(exerciseId)
        if (result.success) {
          toast.success('Exercise deleted successfully')
          loadData()
        } else {
          toast.error(result.error || 'Failed to delete exercise')
        }
      } catch (error) {
        console.error('Error deleting exercise:', error)
        toast.error('Failed to delete exercise')
      }
    }
  }

  const handleToggleExerciseStatus = async (exerciseId, currentStatus) => {
    try {
      const result = await exerciseService.updateExercise(exerciseId, {
        is_active: !currentStatus.is_active,
        is_published: !currentStatus.is_published
      })
      if (result.success) {
        toast.success(`Exercise ${!currentStatus.is_active ? 'activated' : 'deactivated'} successfully`)
        loadData()
      } else {
        toast.error(result.error || 'Failed to update exercise status')
      }
    } catch (error) {
      console.error('Error updating exercise status:', error)
      toast.error('Failed to update exercise status')
    }
  }

  if (lessonLoading) {
    return (
      <TeacherPageLayout
        title="Exercise Management"
        subtitle="Loading lesson details..."
      >
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading lesson...</p>
          </div>
        </div>
      </TeacherPageLayout>
    )
  }

  if (!lesson) {
    return (
      <TeacherPageLayout
        title="Exercise Management"
        subtitle="Lesson not found"
      >
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <p className="text-red-600 mb-4">Lesson not found</p>
              <Button onClick={() => navigate('/teacher/content/lessons')} variant="outline">
                Back to Lessons
              </Button>
            </div>
          </CardContent>
        </Card>
      </TeacherPageLayout>
    )
  }

  return (
    <TeacherPageLayout
      title={`Exercises for: ${lesson.title}`}
      subtitle={`Manage practice exercises for this lesson`}
      actions={[
        <Button key="back" variant="outline" onClick={() => navigate('/teacher/content/lessons')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Lessons
        </Button>,
        <Button key="create" onClick={handleCreateExercise} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Exercise
        </Button>
      ]}
      showRefreshButton={true}
      onRefresh={loadData}
    >
      {/* Lesson Info Card */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <BookOpen className="h-6 w-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold mb-2">{lesson.title}</h2>
              {lesson.description && (
                <p className="text-muted-foreground mb-3">{lesson.description}</p>
              )}
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <BookOpen className="h-4 w-4" />
                  <span>{lesson.subject_name}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>{lesson.grade_name}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Target className="h-4 w-4" />
                  <span>{stats.totalExercises} exercises</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Exercises</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalExercises}</div>
            <p className="text-xs text-muted-foreground">For this lesson</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.activeExercises}</div>
            <p className="text-xs text-muted-foreground">Available to students</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completions</CardTitle>
            <Trophy className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.totalCompletions}</div>
            <p className="text-xs text-muted-foreground">Total attempts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Score</CardTitle>
            <Star className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.averageScore}%</div>
            <p className="text-xs text-muted-foreground">Student performance</p>
          </CardContent>
        </Card>
      </div>

      {/* Exercises List */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Practice Exercises ({exercises.length})
            </CardTitle>
            {exercises.length > 0 && (
              <Button onClick={handleCreateExercise} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Exercise
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading exercises...</p>
              </div>
            </div>
          ) : exercises.length === 0 ? (
            <div className="text-center py-12">
              <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No exercises yet</h3>
              <p className="text-muted-foreground mb-4">
                Create practice exercises to help students learn this lesson content.
              </p>
              <Button onClick={handleCreateExercise}>
                <Plus className="h-4 w-4 mr-2" />
                Create First Exercise
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {exercises.map((exercise, index) => {
                const StatusIcon = getStatusIcon(exercise)
                const isActive = exercise.is_active && exercise.is_published

                return (
                  <motion.div
                    key={exercise.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <Card className="hover:shadow-md transition-shadow">
                      <CardContent className="pt-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <Target className="h-4 w-4 text-green-600" />
                              <h3 className="text-lg font-semibold">{exercise.title}</h3>
                              <Badge className={cn('text-xs', getDifficultyColor(exercise.difficulty_level))}>
                                {exercise.difficulty_level}
                              </Badge>
                              <div className={cn('flex items-center gap-1', getStatusColor(exercise))}>
                                <StatusIcon className="h-4 w-4" />
                                <span className="text-sm">
                                  {isActive ? 'Active' : 'Inactive'}
                                </span>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground mb-3">
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                <span>{exercise.estimated_duration ? `${exercise.estimated_duration} min` : 'No limit'}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Users className="h-4 w-4" />
                                <span>{exercise.completion_count || 0} completions</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <TrendingUp className="h-4 w-4" />
                                <span>{Math.round(exercise.average_score || 0)}% avg</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Trophy className="h-4 w-4" />
                                <span>{exercise.total_points} points</span>
                              </div>
                            </div>

                            {exercise.description && (
                              <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                                {exercise.description}
                              </p>
                            )}

                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="text-xs">
                                {exercise.exercise_format}
                              </Badge>
                              {exercise.is_timed && (
                                <Badge variant="outline" className="text-xs flex items-center gap-1">
                                  <Timer className="h-3 w-3" />
                                  {exercise.time_limit}min
                                </Badge>
                              )}
                              {exercise.allow_multiple_attempts && (
                                <Badge variant="outline" className="text-xs">
                                  Multiple attempts
                                </Badge>
                              )}
                            </div>
                          </div>

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleViewExercise(exercise.id)}>
                                <Eye className="h-4 w-4 mr-2" />
                                View Exercise
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleEditExercise(exercise.id)}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Exercise
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleToggleExerciseStatus(exercise.id, exercise)}>
                                {isActive ? (
                                  <>
                                    <Pause className="h-4 w-4 mr-2" />
                                    Deactivate
                                  </>
                                ) : (
                                  <>
                                    <Play className="h-4 w-4 mr-2" />
                                    Activate
                                  </>
                                )}
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => handleDeleteExercise(exercise.id)}
                                className="text-destructive"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete Exercise
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </TeacherPageLayout>
  )
}

export default LessonExerciseManagementPage