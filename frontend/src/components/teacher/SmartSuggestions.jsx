import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Alert, AlertDescription } from '../ui/alert'
import {
  Lightbulb,
  TrendingUp,
  Users,
  Clock,
  Target,
  BookOpen,
  FileText,
  Zap,
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  X,
  Sparkles,
  Brain,
  Activity
} from 'lucide-react'
import { cn } from '../../lib/utils'

const SmartSuggestions = ({
  context = 'general', // 'lesson', 'homework', 'exercise', 'analytics'
  lessonId,
  data,
  className,
  onSuggestionApply,
  onSuggestionDismiss
}) => {
  const [suggestions, setSuggestions] = useState([])
  const [dismissedSuggestions, setDismissedSuggestions] = useState(new Set())

  useEffect(() => {
    generateSuggestions()
  }, [context, lessonId, data])

  const generateSuggestions = () => {
    const contextSuggestions = {
      lesson: getLessonSuggestions(),
      homework: getHomeworkSuggestions(),
      exercise: getExerciseSuggestions(),
      analytics: getAnalyticsSuggestions(),
      general: getGeneralSuggestions()
    }

    setSuggestions(contextSuggestions[context] || [])
  }

  const getLessonSuggestions = () => {
    const suggestions = []

    // Check if lesson has no exercises
    if (!data?.exercises || data.exercises.length === 0) {
      suggestions.push({
        id: 'add-exercise',
        type: 'opportunity',
        priority: 'high',
        title: 'Add Practice Exercise',
        description: 'Students learn better with practice. Create an exercise for this lesson.',
        action: 'Create Exercise',
        actionPath: `/teacher/content/lessons/${lessonId}/exercises/add`,
        icon: Target,
        color: 'green'
      })
    }

    // Check if lesson has low engagement
    if (data?.analytics?.engagement < 60) {
      suggestions.push({
        id: 'improve-engagement',
        type: 'improvement',
        priority: 'medium',
        title: 'Boost Student Engagement',
        description: 'Try adding interactive exercises or multimedia content.',
        action: 'View Ideas',
        icon: Sparkles,
        color: 'purple'
      })
    }

    // Check if lesson needs homework
    if (!data?.hasHomework) {
      suggestions.push({
        id: 'add-homework',
        type: 'opportunity',
        priority: 'medium',
        title: 'Create Homework Assignment',
        description: 'Reinforce learning with a mandatory assignment.',
        action: 'Create Homework',
        actionPath: '/teacher/assignments/homework/create',
        icon: FileText,
        color: 'blue'
      })
    }

    return suggestions
  }

  const getHomeworkSuggestions = () => {
    const suggestions = []

    // Check submission rates
    if (data?.submissionRate < 70) {
      suggestions.push({
        id: 'low-submission',
        type: 'warning',
        priority: 'high',
        title: 'Low Submission Rate',
        description: `Only ${data.submissionRate}% of students submitted. Consider extending deadline or sending reminders.`,
        action: 'Send Reminders',
        icon: AlertTriangle,
        color: 'orange'
      })
    }

    // Check if deadline is approaching
    if (data?.daysUntilDue <= 2 && data?.submissionRate < 90) {
      suggestions.push({
        id: 'deadline-approaching',
        type: 'urgent',
        priority: 'high',
        title: 'Deadline Approaching',
        description: 'Homework due soon. Send final reminder to students.',
        action: 'Send Reminder',
        icon: Clock,
        color: 'red'
      })
    }

    // Suggest creating exercises for preparation
    if (!data?.hasRelatedExercises) {
      suggestions.push({
        id: 'add-prep-exercise',
        type: 'opportunity',
        priority: 'low',
        title: 'Add Preparation Exercise',
        description: 'Create practice exercises to help students prepare.',
        action: 'Create Exercise',
        icon: Target,
        color: 'green'
      })
    }

    return suggestions
  }

  const getExerciseSuggestions = () => {
    const suggestions = []

    // Check completion rates
    if (data?.completionRate < 50) {
      suggestions.push({
        id: 'low-completion',
        type: 'warning',
        priority: 'high',
        title: 'Low Completion Rate',
        description: 'Consider reducing difficulty or adding hints.',
        action: 'Adjust Settings',
        icon: Target,
        color: 'orange'
      })
    }

    // Check if exercise is too easy
    if (data?.averageScore > 95 && data?.averageTime < data?.estimatedTime * 0.5) {
      suggestions.push({
        id: 'too-easy',
        type: 'improvement',
        priority: 'medium',
        title: 'Exercise May Be Too Easy',
        description: 'Students are completing very quickly with high scores.',
        action: 'Add Questions',
        icon: Brain,
        color: 'purple'
      })
    }

    // Check if exercise is too hard
    if (data?.averageScore < 60) {
      suggestions.push({
        id: 'too-hard',
        type: 'warning',
        priority: 'medium',
        title: 'Exercise May Be Too Difficult',
        description: 'Consider adding hints or breaking into smaller parts.',
        action: 'Adjust Difficulty',
        icon: Target,
        color: 'orange'
      })
    }

    // Suggest gamification improvements
    if (!data?.hasRewards) {
      suggestions.push({
        id: 'add-rewards',
        type: 'opportunity',
        priority: 'low',
        title: 'Add Reward System',
        description: 'Motivate students with points and badges.',
        action: 'Configure Rewards',
        icon: Zap,
        color: 'yellow'
      })
    }

    return suggestions
  }

  const getAnalyticsSuggestions = () => {
    const suggestions = []

    // Identify struggling students
    if (data?.strugglingStudents > 0) {
      suggestions.push({
        id: 'struggling-students',
        type: 'action',
        priority: 'high',
        title: `${data.strugglingStudents} Students Need Help`,
        description: 'Some students are consistently scoring below 60%.',
        action: 'View Students',
        icon: Users,
        color: 'red'
      })
    }

    // Suggest content gaps
    if (data?.lowPerformanceTopics?.length > 0) {
      suggestions.push({
        id: 'content-gaps',
        type: 'improvement',
        priority: 'medium',
        title: 'Content Gaps Identified',
        description: `Students struggling with: ${data.lowPerformanceTopics.join(', ')}`,
        action: 'Create Content',
        icon: BookOpen,
        color: 'purple'
      })
    }

    // Suggest engagement improvements
    if (data?.engagementTrend === 'declining') {
      suggestions.push({
        id: 'declining-engagement',
        type: 'warning',
        priority: 'medium',
        title: 'Engagement Declining',
        description: 'Student participation has decreased over time.',
        action: 'View Strategies',
        icon: TrendingUp,
        color: 'orange'
      })
    }

    return suggestions
  }

  const getGeneralSuggestions = () => {
    return [
      {
        id: 'explore-features',
        type: 'tip',
        priority: 'low',
        title: 'Explore New Features',
        description: 'Learn about the difference between homework and exercises.',
        action: 'Learn More',
        icon: Lightbulb,
        color: 'blue'
      }
    ]
  }

  const getSuggestionConfig = (type) => {
    const configs = {
      opportunity: {
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200',
        iconColor: 'text-green-600',
        titleColor: 'text-green-800'
      },
      warning: {
        bgColor: 'bg-orange-50',
        borderColor: 'border-orange-200',
        iconColor: 'text-orange-600',
        titleColor: 'text-orange-800'
      },
      urgent: {
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200',
        iconColor: 'text-red-600',
        titleColor: 'text-red-800'
      },
      improvement: {
        bgColor: 'bg-purple-50',
        borderColor: 'border-purple-200',
        iconColor: 'text-purple-600',
        titleColor: 'text-purple-800'
      },
      action: {
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200',
        iconColor: 'text-blue-600',
        titleColor: 'text-blue-800'
      },
      tip: {
        bgColor: 'bg-gray-50',
        borderColor: 'border-gray-200',
        iconColor: 'text-gray-600',
        titleColor: 'text-gray-800'
      }
    }
    return configs[type] || configs.tip
  }

  const handleSuggestionAction = (suggestion) => {
    if (suggestion.actionPath) {
      // Navigate to the suggested path
      window.location.href = suggestion.actionPath
    }
    if (onSuggestionApply) {
      onSuggestionApply(suggestion)
    }
  }

  const handleDismiss = (suggestionId) => {
    setDismissedSuggestions(prev => new Set([...prev, suggestionId]))
    if (onSuggestionDismiss) {
      onSuggestionDismiss(suggestionId)
    }
  }

  const visibleSuggestions = suggestions.filter(s => !dismissedSuggestions.has(s.id))

  if (visibleSuggestions.length === 0) {
    return null
  }

  return (
    <Card className={cn("", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <Lightbulb className="h-4 w-4 text-yellow-600" />
          Smart Suggestions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {visibleSuggestions
          .sort((a, b) => {
            const priority = { high: 3, medium: 2, low: 1 }
            return priority[b.priority] - priority[a.priority]
          })
          .map((suggestion) => {
            const config = getSuggestionConfig(suggestion.type)
            const IconComponent = suggestion.icon

            return (
              <div
                key={suggestion.id}
                className={cn(
                  "border rounded-lg p-3 relative",
                  config.bgColor,
                  config.borderColor
                )}
              >
                <div className="flex items-start gap-3">
                  <div className={cn("p-1 rounded", config.iconColor)}>
                    <IconComponent className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className={cn("font-medium text-sm", config.titleColor)}>
                        {suggestion.title}
                      </h4>
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-xs",
                          suggestion.priority === 'high' ? 'border-red-300 text-red-700' :
                          suggestion.priority === 'medium' ? 'border-orange-300 text-orange-700' :
                          'border-gray-300 text-gray-700'
                        )}
                      >
                        {suggestion.priority}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">
                      {suggestion.description}
                    </p>
                    {suggestion.action && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleSuggestionAction(suggestion)}
                        className="text-xs h-7"
                      >
                        {suggestion.action}
                        <ArrowRight className="h-3 w-3 ml-1" />
                      </Button>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDismiss(suggestion.id)}
                    className="h-6 w-6 p-0 hover:bg-white/50"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            )
          })}
      </CardContent>
    </Card>
  )
}

// Context-specific suggestion components
export const LessonSuggestions = ({ lesson, className }) => (
  <SmartSuggestions
    context="lesson"
    lessonId={lesson?.id}
    data={lesson}
    className={className}
  />
)

export const HomeworkSuggestions = ({ homework, className }) => (
  <SmartSuggestions
    context="homework"
    data={homework}
    className={className}
  />
)

export const ExerciseSuggestions = ({ exercise, className }) => (
  <SmartSuggestions
    context="exercise"
    data={exercise}
    className={className}
  />
)

export const AnalyticsSuggestions = ({ analytics, className }) => (
  <SmartSuggestions
    context="analytics"
    data={analytics}
    className={className}
  />
)

export default SmartSuggestions