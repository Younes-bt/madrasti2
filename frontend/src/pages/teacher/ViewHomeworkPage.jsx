import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useLanguage } from '../../hooks/useLanguage'
import { useAuth } from '../../hooks/useAuth'
import { TeacherPageLayout } from '../../components/teacher/layout'
import homeworkService from '../../services/homework'
import { toast } from 'sonner'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import {
  ArrowLeft,
  Edit,
  Copy,
  Trash2,
  Calendar,
  Clock,
  Target,
  Users,
  FileText,
  BookOpen,
  CheckSquare,
  HelpCircle,
  Timer,
  BarChart3,
  Trophy,
  Eye,
  Download,
  Settings
} from 'lucide-react'
import { cn } from '../../lib/utils'

const ViewHomeworkPage = () => {
  const { t, isRTL } = useLanguage()
  const { user } = useAuth()
  const navigate = useNavigate()
  const { id } = useParams()

  const [homework, setHomework] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (id) {
      loadHomeworkDetails(id)
    }
  }, [id])

  const loadHomeworkDetails = async (homeworkId) => {
    try {
      setLoading(true)
      setError(null)
      const homeworkData = await homeworkService.getHomeworkById(homeworkId)
      console.log('Loaded homework details:', homeworkData)

      // Debug QCM questions
      if (homeworkData.questions) {
        console.log(`Found ${homeworkData.questions.length} questions`)
        homeworkData.questions.forEach((question, index) => {
          console.log(`Question ${index + 1}: type=${question.question_type}, choices=${question.choices?.length || 0}`)
          if (question.choices && question.choices.length > 0) {
            console.log('  Choices:', question.choices.map(c => ({ text: c.choice_text, correct: c.is_correct })))
          }
        })
      }

      setHomework(homeworkData)
    } catch (error) {
      console.error('Error loading homework details:', error)
      setError('Failed to load homework details')
      toast.error('Failed to load homework details')
    } finally {
      setLoading(false)
    }
  }

  const handleBack = () => {
    navigate('/teacher/homework')
  }

  const handleEdit = () => {
    navigate(`/teacher/homework/edit/${id}`)
  }

  const handleDuplicate = () => {
    // TODO: Implement duplicate functionality
    toast.info('Duplicate functionality coming soon')
  }

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this homework?')) {
      try {
        await homeworkService.deleteHomework(id)
        toast.success('Homework deleted successfully')
        navigate('/teacher/homework')
      } catch (error) {
        console.error('Error deleting homework:', error)
        toast.error('Failed to delete homework')
      }
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'No date set'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'draft':
        return 'bg-gray-100 text-gray-800 border-gray-200'
      case 'expired':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200'
    }
  }

  const getHomeworkTypeInfo = (format) => {
    switch (format) {
      case 'qcm_only':
        return {
          name: 'QCM Only',
          icon: CheckSquare,
          color: 'text-blue-600',
          bgColor: 'bg-blue-100'
        }
      case 'open_only':
        return {
          name: 'Open Questions',
          icon: HelpCircle,
          color: 'text-green-600',
          bgColor: 'bg-green-100'
        }
      case 'book_exercises':
        return {
          name: 'Book Exercises',
          icon: BookOpen,
          color: 'text-purple-600',
          bgColor: 'bg-purple-100'
        }
      default:
        return {
          name: 'Mixed',
          icon: FileText,
          color: 'text-gray-600',
          bgColor: 'bg-gray-100'
        }
    }
  }

  if (loading) {
    return (
      <TeacherPageLayout
        title="View Homework"
        subtitle="Loading homework details..."
        showRefreshButton={false}
      >
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading homework details...</p>
          </div>
        </div>
      </TeacherPageLayout>
    )
  }

  if (error || !homework) {
    return (
      <TeacherPageLayout
        title="View Homework"
        subtitle="Error loading homework"
        showRefreshButton={false}
      >
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <div className="text-red-500 mb-4">
              <FileText className="h-16 w-16 mx-auto mb-4 opacity-50" />
            </div>
            <h3 className="text-lg font-medium mb-2">Homework Not Found</h3>
            <p className="text-muted-foreground mb-4">
              {error || 'The homework you are looking for does not exist or has been deleted.'}
            </p>
            <Button onClick={handleBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Homework
            </Button>
          </div>
        </div>
      </TeacherPageLayout>
    )
  }

  const typeInfo = getHomeworkTypeInfo(homework.homework_format)
  const isOverdue = homework.due_date && new Date(homework.due_date) < new Date()
  const status = homework.is_published ? (isOverdue ? 'expired' : 'active') : 'draft'

  return (
    <TeacherPageLayout
      title="View Homework"
      subtitle={homework.title}
      showRefreshButton={false}
    >
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header Actions */}
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Homework
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleEdit}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button variant="outline" onClick={handleDuplicate}>
              <Copy className="h-4 w-4 mr-2" />
              Duplicate
            </Button>
            <Button variant="outline" className="text-red-600 hover:text-red-700" onClick={handleDelete}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        </div>

        {/* Homework Overview */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className={cn('p-3 rounded-lg', typeInfo.bgColor)}>
                  <typeInfo.icon className={cn('h-6 w-6', typeInfo.color)} />
                </div>
                <div>
                  <CardTitle className="text-2xl">{homework.title}</CardTitle>
                  <p className="text-muted-foreground mt-1">
                    {typeInfo.name} • {homework.homework_type || 'Homework'}
                  </p>
                </div>
              </div>
              <Badge className={cn('ml-4', getStatusColor(status))}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Description */}
              {homework.description && (
                <div>
                  <h4 className="font-semibold mb-2">Description</h4>
                  <p className="text-muted-foreground">{homework.description}</p>
                </div>
              )}

              {/* Instructions */}
              {homework.instructions && (
                <div>
                  <h4 className="font-semibold mb-2">Instructions</h4>
                  <p className="text-muted-foreground">{homework.instructions}</p>
                </div>
              )}

              {/* Details Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-4 border-t">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Users className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Class</p>
                    <p className="font-semibold">{homework.class_name || 'Unknown Class'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <BookOpen className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Subject</p>
                    <p className="font-semibold">{homework.subject_name || 'Unknown Subject'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Target className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Points</p>
                    <p className="font-semibold">{homework.total_points || 0} pts</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Calendar className="h-4 w-4 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Due Date</p>
                    <p className="font-semibold text-sm">{formatDate(homework.due_date)}</p>
                  </div>
                </div>
              </div>

              {/* Additional Details */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 pt-4 border-t">
                {homework.estimated_duration && (
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Duration: {homework.estimated_duration} min</span>
                  </div>
                )}

                {homework.is_timed && homework.time_limit && (
                  <div className="flex items-center gap-2">
                    <Timer className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Time Limit: {homework.time_limit} min</span>
                  </div>
                )}

                {homework.allow_late_submissions && (
                  <div className="flex items-center gap-2">
                    <CheckSquare className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Late submissions allowed</span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Questions Section */}
        {homework.questions && homework.questions.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Questions ({homework.questions.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {homework.questions.map((question, index) => (
                  <Card key={question.id} className="border-l-4 border-l-blue-500">
                    <CardContent className="pt-4">
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="font-semibold">Question {index + 1}</h4>
                        <Badge variant="outline">{question.points} pts</Badge>
                      </div>
                      <p className="text-muted-foreground mb-3">{question.question_text}</p>

                      {/* QCM Choices */}
                      {question.choices && Array.isArray(question.choices) && question.choices.length > 0 && (
                        <div className="space-y-2">
                          <p className="text-sm font-semibold">Choices:</p>
                          {question.choices.map((choice, choiceIndex) => {
                            // Ensure choice is a valid object with required fields
                            if (!choice || typeof choice !== 'object') {
                              console.warn('Invalid choice object:', choice)
                              return null
                            }

                            return (
                              <div key={choice.id || choiceIndex} className={cn(
                                "flex items-center gap-2 p-2 rounded border",
                                choice.is_correct
                                  ? "bg-green-50 border-green-200 text-green-800"
                                  : "bg-gray-50 border-gray-200"
                              )}>
                                <span className="w-6 h-6 rounded-full bg-white border flex items-center justify-center text-xs">
                                  {String.fromCharCode(65 + choiceIndex)}
                                </span>
                                <span className="flex-1">{choice.choice_text || 'No text'}</span>
                                {choice.is_correct && (
                                  <Badge variant="default" className="bg-green-600">Correct</Badge>
                                )}
                              </div>
                            )
                          })}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Book Exercises Section */}
        {homework.book_exercises && homework.book_exercises.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Book Exercises ({homework.book_exercises.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {homework.book_exercises.map((exercise, index) => (
                  <Card key={exercise.id} className="border-l-4 border-l-purple-500">
                    <CardContent className="pt-4">
                      <div className="flex items-start justify-between mb-3">
                        <h4 className="font-semibold">Exercise {index + 1}</h4>
                        <Badge variant="outline">{exercise.points} pts</Badge>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-semibold">Book:</span> {exercise.book_title}
                        </div>
                        {exercise.chapter && (
                          <div>
                            <span className="font-semibold">Chapter:</span> {exercise.chapter}
                          </div>
                        )}
                        {exercise.page_number && (
                          <div>
                            <span className="font-semibold">Page:</span> {exercise.page_number}
                          </div>
                        )}
                        <div>
                          <span className="font-semibold">Exercise:</span> {exercise.exercise_number}
                        </div>
                      </div>

                      {exercise.specific_questions && (
                        <div className="mt-3">
                          <span className="font-semibold text-sm">Specific Questions:</span>
                          <p className="text-muted-foreground text-sm">{exercise.specific_questions}</p>
                        </div>
                      )}

                      {exercise.additional_notes && (
                        <div className="mt-3">
                          <span className="font-semibold text-sm">Notes:</span>
                          <p className="text-muted-foreground text-sm">{exercise.additional_notes}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Statistics Section (TODO: Implement when submission data is available) */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Statistics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">0</div>
                <div className="text-sm text-muted-foreground">Submissions</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">0%</div>
                <div className="text-sm text-muted-foreground">Completion Rate</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">-</div>
                <div className="text-sm text-muted-foreground">Average Score</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">0</div>
                <div className="text-sm text-muted-foreground">Late Submissions</div>
              </div>
            </div>
            <div className="text-center mt-4 text-sm text-muted-foreground">
              Statistics will be available once students start submitting
            </div>
          </CardContent>
        </Card>
      </div>
    </TeacherPageLayout>
  )
}

export default ViewHomeworkPage