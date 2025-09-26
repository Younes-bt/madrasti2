import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../../hooks/useLanguage'
import { useAuth } from '../../hooks/useAuth'
import { TeacherPageLayout } from '../../components/teacher/layout'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Badge } from '../../components/ui/badge'
import { exerciseService } from '../../services/exercises'
import lessonsService from '../../services/lessons'
import { toast } from 'sonner'
import {
  Plus,
  Search,
  Filter,
  Target,
  BookOpen,
  Users,
  Clock,
  Play,
  Edit,
  Eye,
  Trash2,
  MoreHorizontal,
  Zap,
  Trophy,
  Star,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Timer
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '../../components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select'
import { cn } from '../../lib/utils'

const LessonExercisesPage = () => {
  const { t, isRTL } = useLanguage()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [exercises, setExercises] = useState([])
  const [lessons, setLessons] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedLesson, setSelectedLesson] = useState('all')
  const [selectedDifficulty, setSelectedDifficulty] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')

  // Statistics
  const [stats, setStats] = useState({
    totalExercises: 0,
    activeExercises: 0,
    completions: 0,
    averageScore: 0
  })

  useEffect(() => {
    if (user) {
      loadData()
    }
  }, [user])

  const loadData = async () => {
    try {
      setLoading(true)

      // Load teacher's lessons first
      const lessonsResult = await lessonsService.getLessons({
        page_size: 100,
        teacher: user.id
      })

      if (lessonsResult.success || lessonsResult.results) {
        const lessonsData = lessonsResult.results || lessonsResult.data || []
        setLessons(lessonsData)

        // Load exercises for teacher's lessons
        const exercisesResult = await exerciseService.getExercises({
          page_size: 100,
          lesson__in: lessonsData.map(l => l.id).join(',')
        })

        if (exercisesResult.success) {
          setExercises(exercisesResult.data)

          // Calculate statistics
          const totalExercises = exercisesResult.data.length
          const activeExercises = exercisesResult.data.filter(ex => ex.is_active && ex.is_published).length
          const completions = exercisesResult.data.reduce((sum, ex) => sum + (ex.completion_count || 0), 0)
          const averageScore = totalExercises > 0
            ? exercisesResult.data.reduce((sum, ex) => sum + (ex.average_score || 0), 0) / totalExercises
            : 0

          setStats({
            totalExercises,
            activeExercises,
            completions,
            averageScore: Math.round(averageScore)
          })
        } else {
          toast.error('Failed to load exercises')
        }
      } else {
        toast.error('Failed to load lessons')
      }
    } catch (error) {
      console.error('Error loading data:', error)
      toast.error('Failed to load exercise data')
    } finally {
      setLoading(false)
    }
  }

  // Filter exercises
  const filteredExercises = exercises.filter(exercise => {
    const matchesSearch = exercise.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exercise.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesLesson = selectedLesson === 'all' || exercise.lesson?.toString() === selectedLesson
    const matchesDifficulty = selectedDifficulty === 'all' || exercise.difficulty_level === selectedDifficulty
    const matchesStatus = selectedStatus === 'all' ||
                         (selectedStatus === 'active' && exercise.is_active && exercise.is_published) ||
                         (selectedStatus === 'inactive' && (!exercise.is_active || !exercise.is_published))

    return matchesSearch && matchesLesson && matchesDifficulty && matchesStatus
  })

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
    navigate('/teacher/content/lesson-exercises/create')
  }

  const handleViewExercise = (exerciseId) => {
    navigate(`/teacher/content/lesson-exercises/${exerciseId}`)
  }

  const handleEditExercise = (exerciseId) => {
    navigate(`/teacher/content/lesson-exercises/${exerciseId}/edit`)
  }

  const handleDeleteExercise = async (exerciseId) => {
    if (window.confirm(t('exercises.confirmDelete'))) {
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

  const handleManageLessonExercises = (lessonId) => {
    navigate(`/teacher/content/lessons/${lessonId}/exercises`)
  }

  if (loading) {
    return (
      <TeacherPageLayout
        title="Lesson Exercises"
        subtitle="Manage practice exercises for your lessons"
      >
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading exercises...</p>
          </div>
        </div>
      </TeacherPageLayout>
    )
  }

  return (
    <TeacherPageLayout
      title="Lesson Exercises"
      subtitle="Manage optional practice exercises for your lessons"
      actions={[
        <Button key="create" onClick={handleCreateExercise} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Create Exercise
        </Button>
      ]}
      showRefreshButton={true}
      onRefresh={loadData}
    >
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Exercises</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalExercises}</div>
            <p className="text-xs text-muted-foreground">Practice exercises created</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Exercises</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.activeExercises}</div>
            <p className="text-xs text-muted-foreground">Available for students</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Completions</CardTitle>
            <Trophy className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.completions}</div>
            <p className="text-xs text-muted-foreground">Students completed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <Star className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.averageScore}%</div>
            <p className="text-xs text-muted-foreground">Student performance</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Search and Filter
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <Input
                placeholder="Search exercises..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>

            <Select value={selectedLesson} onValueChange={setSelectedLesson}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by lesson" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Lessons</SelectItem>
                {lessons.map(lesson => (
                  <SelectItem key={lesson.id} value={lesson.id.toString()}>
                    {lesson.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Difficulties</SelectItem>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
                <SelectItem value="expert">Expert</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Exercises List */}
      <Card>
        <CardHeader>
          <CardTitle>Exercises ({filteredExercises.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredExercises.length === 0 ? (
            <div className="text-center py-12">
              <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No exercises found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm || selectedLesson !== 'all' || selectedDifficulty !== 'all' || selectedStatus !== 'all'
                  ? 'Try adjusting your filters to find more exercises.'
                  : 'Create practice exercises to help students learn your lesson content.'
                }
              </p>
              <Button onClick={handleCreateExercise}>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Exercise
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredExercises.map((exercise) => {
                const StatusIcon = getStatusIcon(exercise)
                const lesson = lessons.find(l => l.id === exercise.lesson)

                return (
                  <Card key={exercise.id} className="hover:shadow-md transition-shadow">
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
                                {exercise.is_active && exercise.is_published ? 'Active' : 'Inactive'}
                              </span>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-muted-foreground mb-3">
                            <div className="flex items-center gap-1">
                              <BookOpen className="h-4 w-4" />
                              <span>{lesson?.title || 'Unknown Lesson'}</span>
                            </div>
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
                              <span>{Math.round(exercise.average_score || 0)}% avg score</span>
                            </div>
                          </div>

                          {exercise.description && (
                            <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                              {exercise.description}
                            </p>
                          )}

                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {exercise.total_points} points
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {exercise.exercise_format}
                            </Badge>
                            {exercise.is_timed && (
                              <Badge variant="outline" className="text-xs flex items-center gap-1">
                                <Timer className="h-3 w-3" />
                                Timed
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
                            {lesson && (
                              <DropdownMenuItem onClick={() => handleManageLessonExercises(lesson.id)}>
                                <Zap className="h-4 w-4 mr-2" />
                                Manage Lesson Exercises
                              </DropdownMenuItem>
                            )}
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
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </TeacherPageLayout>
  )
}

export default LessonExercisesPage