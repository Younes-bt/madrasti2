import React, { useState, useMemo } from 'react'
import {
  Brain,
  ChevronDown,
  ChevronUp,
  Plus,
  Eye,
  Edit,
  Clock,
  Trophy,
  HelpCircle,
  CheckSquare
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card'
import { Button } from '../../ui/button'
import { Badge } from '../../ui/badge'
import { cn } from '../../../lib/utils'

/**
 * Get color classes for difficulty level
 */
const getDifficultyColor = (difficulty) => {
  const colors = {
    beginner: 'bg-green-100 text-green-800 border-green-200',
    intermediate: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    advanced: 'bg-orange-100 text-orange-800 border-orange-200',
    expert: 'bg-red-100 text-red-800 border-red-200'
  }
  return colors[difficulty?.toLowerCase()] || colors.beginner
}

/**
 * Collaps

ibleExercisesSection Component
 *
 * Displays exercises in a collapsible list with expandable previews.
 * Shows question previews and stats when expanded.
 *
 * @param {Object} props
 * @param {Array} props.exercises - Array of exercise objects
 * @param {function} props.onAddExercise - Callback to add new exercise
 * @param {function} props.onViewExercise - Callback to view exercise details
 * @param {function} props.onEditExercise - Callback to edit exercise
 * @param {'teacher' | 'student'} [props.viewMode] - Current view mode
 * @param {string} [props.className] - Optional additional CSS classes
 */
export function CollapsibleExercisesSection({
  exercises = [],
  onAddExercise,
  onViewExercise,
  onEditExercise,
  viewMode = 'teacher',
  className
}) {
  // Track which exercises are expanded
  const [expandedExerciseIds, setExpandedExerciseIds] = useState(new Set())

  // Filter exercises based on view mode
  const visibleExercises = useMemo(() => {
    if (viewMode === 'student') {
      return exercises.filter(e => e.is_published)
    }
    return exercises
  }, [exercises, viewMode])

  // Toggle exercise expansion
  const toggleExercise = (exerciseId) => {
    setExpandedExerciseIds(prev => {
      const newSet = new Set(prev)
      if (newSet.has(exerciseId)) {
        newSet.delete(exerciseId)
      } else {
        newSet.add(exerciseId)
      }
      return newSet
    })
  }

  // Empty state
  if (visibleExercises.length === 0) {
    return (
      <Card className={cn('', className)}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              التمارين (0)
            </CardTitle>
            {viewMode === 'teacher' && onAddExercise && (
              <Button onClick={onAddExercise} variant="outline" size="sm" className="gap-2">
                <Plus className="h-4 w-4" />
                إضافة تمرين
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Brain className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">
              {viewMode === 'student'
                ? 'لا توجد تمارين منشورة'
                : 'لا توجد تمارين لهذا الدرس'}
            </p>
            {viewMode === 'teacher' && onAddExercise && (
              <Button onClick={onAddExercise} variant="outline" className="gap-2">
                <Plus className="h-4 w-4" />
                إضافة أول تمرين
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={cn('', className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            التمارين ({visibleExercises.length})
          </CardTitle>
          {viewMode === 'teacher' && onAddExercise && (
            <Button onClick={onAddExercise} variant="outline" size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
              إضافة تمرين
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {visibleExercises.map((exercise) => {
            const isExpanded = expandedExerciseIds.has(exercise.id)
            const questionsCount = exercise.questions?.length || 0
            const previewQuestions = exercise.questions?.slice(0, 3) || []

            return (
              <div
                key={exercise.id}
                className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* Exercise Header - Always Visible */}
                <div className="flex items-center justify-between p-4 bg-muted/30 hover:bg-muted/50 transition-colors">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <h4 className="font-medium truncate">{exercise.title}</h4>
                      {exercise.difficulty_level && (
                        <Badge
                          variant="outline"
                          className={cn('text-xs', getDifficultyColor(exercise.difficulty_level))}
                        >
                          {exercise.difficulty_level}
                        </Badge>
                      )}
                      <Badge variant={exercise.is_published ? 'default' : 'secondary'}>
                        {exercise.is_published ? 'منشور' : 'مسودة'}
                      </Badge>
                    </div>

                    {exercise.description && (
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {exercise.description}
                      </p>
                    )}

                    {/* Exercise Metadata */}
                    <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
                      {exercise.estimated_duration && (
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {exercise.estimated_duration} دقيقة
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <HelpCircle className="h-3 w-3" />
                        {questionsCount} {questionsCount === 1 ? 'سؤال' : 'أسئلة'}
                      </span>
                      {exercise.total_points !== undefined && (
                        <span className="flex items-center gap-1">
                          <Trophy className="h-3 w-3" />
                          {exercise.total_points} نقطة
                        </span>
                      )}
                      {exercise.completion_count > 0 && (
                        <span className="flex items-center gap-1">
                          <CheckSquare className="h-3 w-3" />
                          {exercise.completion_count} {exercise.completion_count === 1 ? 'طالب' : 'طلاب'} أكمل
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2">
                    {viewMode === 'teacher' && (
                      <>
                        {onViewExercise && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onViewExercise(exercise.id)}
                            title="عرض التمرين"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        )}
                        {onEditExercise && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onEditExercise(exercise.id)}
                            title="تعديل التمرين"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        )}
                      </>
                    )}

                    {/* Expand/Collapse button */}
                    {questionsCount > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleExercise(exercise.id)}
                        aria-label={isExpanded ? 'إخفاء التفاصيل' : 'عرض التفاصيل'}
                      >
                        {isExpanded ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : (
                          <ChevronDown className="h-4 w-4" />
                        )}
                      </Button>
                    )}
                  </div>
                </div>

                {/* Expandable Preview */}
                {isExpanded && questionsCount > 0 && (
                  <div className="p-4 border-t bg-white space-y-4">
                    {/* Questions Preview */}
                    <div>
                      <h5 className="font-medium mb-2 text-sm">معاينة الأسئلة:</h5>
                      <div className="space-y-2">
                        {previewQuestions.map((question, idx) => (
                          <div key={idx} className="text-sm text-muted-foreground pr-2">
                            <span className="font-medium">{idx + 1}.</span>{' '}
                            {question.question_text || question.title}{' '}
                            <span className="text-xs text-gray-500">
                              ({question.question_type} - {question.points} نقاط)
                            </span>
                          </div>
                        ))}
                        {questionsCount > 3 && (
                          <p className="text-xs text-muted-foreground pr-2">
                            ... +{questionsCount - 3} {questionsCount - 3 === 1 ? 'سؤال آخر' : 'أسئلة أخرى'}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Stats (if available) */}
                    {exercise.completion_count > 0 && (
                      <div className="pt-3 border-t">
                        <h5 className="font-medium mb-2 text-sm">الإحصائيات:</h5>
                        <div className="text-sm text-muted-foreground space-y-1 pr-2">
                          <p>• {exercise.completion_count} {exercise.completion_count === 1 ? 'طالب' : 'طلاب'} أكمل التمرين</p>
                          {exercise.average_score && (
                            <p>• متوسط الدرجة: {exercise.average_score}%</p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Action Buttons in expanded view */}
                    {viewMode === 'teacher' && (onViewExercise || onEditExercise) && (
                      <div className="flex items-center gap-2 pt-3 border-t">
                        {onViewExercise && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onViewExercise(exercise.id)}
                          >
                            عرض كامل
                          </Button>
                        )}
                        {onEditExercise && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onEditExercise(exercise.id)}
                          >
                            تعديل
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

// Memoize component to prevent unnecessary re-renders
export default React.memo(CollapsibleExercisesSection, (prevProps, nextProps) => {
  return (
    prevProps.exercises === nextProps.exercises &&
    prevProps.viewMode === nextProps.viewMode
  )
})
