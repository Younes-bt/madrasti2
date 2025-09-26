import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import {
  Target,
  FileText,
  BookOpen,
  Plus,
  ArrowRight,
  Clock,
  Users,
  TrendingUp,
  Zap
} from 'lucide-react'
import { cn } from '../../lib/utils'

const QuickActionCard = ({
  type,
  title,
  description,
  stats,
  actions,
  className,
  variant = 'default'
}) => {
  const navigate = useNavigate()

  const getTypeConfig = () => {
    switch (type) {
      case 'homework':
        return {
          icon: FileText,
          color: 'blue',
          bgColor: 'bg-blue-50',
          iconColor: 'text-blue-600',
          borderColor: 'border-blue-200'
        }
      case 'exercise':
        return {
          icon: Target,
          color: 'green',
          bgColor: 'bg-green-50',
          iconColor: 'text-green-600',
          borderColor: 'border-green-200'
        }
      case 'lesson':
        return {
          icon: BookOpen,
          color: 'purple',
          bgColor: 'bg-purple-50',
          iconColor: 'text-purple-600',
          borderColor: 'border-purple-200'
        }
      default:
        return {
          icon: BookOpen,
          color: 'gray',
          bgColor: 'bg-gray-50',
          iconColor: 'text-gray-600',
          borderColor: 'border-gray-200'
        }
    }
  }

  const config = getTypeConfig()
  const IconComponent = config.icon

  return (
    <Card className={cn(
      "hover:shadow-md transition-shadow cursor-pointer",
      variant === 'compact' ? 'h-fit' : '',
      config.borderColor,
      className
    )}>
      <CardHeader className={cn(
        config.bgColor,
        variant === 'compact' ? 'pb-3' : 'pb-4'
      )}>
        <CardTitle className={cn(
          "flex items-center gap-2",
          variant === 'compact' ? 'text-base' : 'text-lg'
        )}>
          <IconComponent className={cn(
            variant === 'compact' ? 'h-4 w-4' : 'h-5 w-5',
            config.iconColor
          )} />
          {title}
        </CardTitle>
        {description && (
          <p className={cn(
            "text-muted-foreground",
            variant === 'compact' ? 'text-xs' : 'text-sm'
          )}>
            {description}
          </p>
        )}
      </CardHeader>

      <CardContent className={variant === 'compact' ? 'pt-4' : 'pt-6'}>
        {/* Stats Section */}
        {stats && (
          <div className={cn(
            "grid gap-4 mb-4",
            stats.length <= 2 ? 'grid-cols-2' : 'grid-cols-3'
          )}>
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className={cn(
                  "font-bold",
                  variant === 'compact' ? 'text-lg' : 'text-2xl',
                  `text-${config.color}-600`
                )}>
                  {stat.value}
                </div>
                <div className={cn(
                  "text-muted-foreground",
                  variant === 'compact' ? 'text-xs' : 'text-xs'
                )}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Actions Section */}
        {actions && (
          <div className="space-y-2">
            {actions.map((action, index) => (
              <Button
                key={index}
                variant={action.variant || (index === 0 ? 'default' : 'outline')}
                size={variant === 'compact' ? 'sm' : 'default'}
                className="w-full justify-between"
                onClick={() => action.onClick ? action.onClick() : navigate(action.path)}
              >
                <span className="flex items-center gap-2">
                  {action.icon && <action.icon className="h-4 w-4" />}
                  {action.label}
                </span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Predefined quick action cards
export const HomeworkQuickActions = ({ lessonId, stats, className }) => {
  const navigate = useNavigate()

  return (
    <QuickActionCard
      type="homework"
      title="Mandatory Homework"
      description="Create graded assignments with due dates"
      stats={stats || [
        { value: '0', label: 'Active' },
        { value: '0', label: 'Draft' }
      ]}
      actions={[
        {
          label: 'Create Homework',
          icon: Plus,
          path: '/teacher/assignments/homework/create'
        },
        {
          label: 'Manage All Homework',
          path: '/teacher/assignments/homework',
          variant: 'outline'
        }
      ]}
      className={className}
    />
  )
}

export const ExerciseQuickActions = ({ lessonId, stats, className }) => {
  const navigate = useNavigate()

  return (
    <QuickActionCard
      type="exercise"
      title="Practice Exercises"
      description="Create optional practice activities for this lesson"
      stats={stats || [
        { value: '0', label: 'Exercises' },
        { value: '0', label: 'Active' }
      ]}
      actions={[
        {
          label: 'Add Exercise',
          icon: Zap,
          path: lessonId
            ? `/teacher/content/lessons/${lessonId}/exercises/add`
            : '/teacher/content/lesson-exercises/create'
        },
        {
          label: 'Manage Exercises',
          path: lessonId
            ? `/teacher/content/lessons/${lessonId}/exercises`
            : '/teacher/content/lesson-exercises',
          variant: 'outline'
        }
      ]}
      className={className}
    />
  )
}

export const LessonQuickActions = ({ stats, className }) => {
  const navigate = useNavigate()

  return (
    <QuickActionCard
      type="lesson"
      title="Lesson Content"
      description="Manage your lesson materials and structure"
      stats={stats || [
        { value: '0', label: 'Lessons' },
        { value: '0', label: 'Active' }
      ]}
      actions={[
        {
          label: 'Create Lesson',
          icon: Plus,
          path: '/teacher/content/lessons/create'
        },
        {
          label: 'View All Lessons',
          path: '/teacher/content/lessons',
          variant: 'outline'
        }
      ]}
      className={className}
    />
  )
}

// Compact version for sidebar or smaller spaces
export const CompactQuickActions = ({ type, lessonId, className }) => {
  const getActions = () => {
    switch (type) {
      case 'homework':
        return [
          {
            label: 'New Homework',
            icon: Plus,
            path: '/teacher/assignments/homework/create'
          }
        ]
      case 'exercise':
        return [
          {
            label: 'New Exercise',
            icon: Zap,
            path: lessonId
              ? `/teacher/content/lessons/${lessonId}/exercises/add`
              : '/teacher/content/lesson-exercises/create'
          }
        ]
      case 'lesson':
        return [
          {
            label: 'New Lesson',
            icon: Plus,
            path: '/teacher/content/lessons/create'
          }
        ]
      default:
        return []
    }
  }

  const config = {
    homework: {
      title: 'Quick Homework',
      description: 'Create mandatory assignment'
    },
    exercise: {
      title: 'Quick Exercise',
      description: 'Add practice activity'
    },
    lesson: {
      title: 'Quick Lesson',
      description: 'Create new lesson'
    }
  }

  return (
    <QuickActionCard
      type={type}
      title={config[type]?.title}
      description={config[type]?.description}
      actions={getActions()}
      variant="compact"
      className={className}
    />
  )
}

// Usage analytics card
export const AnalyticsQuickCard = ({ type, data, className }) => {
  const getAnalyticsData = () => {
    switch (type) {
      case 'homework':
        return {
          title: 'Homework Analytics',
          stats: [
            { value: data?.completion_rate || '0%', label: 'Avg Completion' },
            { value: data?.on_time_rate || '0%', label: 'On Time' },
            { value: data?.avg_grade || '0', label: 'Avg Grade' }
          ]
        }
      case 'exercise':
        return {
          title: 'Exercise Analytics',
          stats: [
            { value: data?.attempt_rate || '0%', label: 'Attempt Rate' },
            { value: data?.completion_rate || '0%', label: 'Completion' },
            { value: data?.avg_score || '0%', label: 'Avg Score' }
          ]
        }
      default:
        return {
          title: 'Analytics',
          stats: [
            { value: '0', label: 'No Data' }
          ]
        }
    }
  }

  const analyticsData = getAnalyticsData()

  return (
    <QuickActionCard
      type={type}
      title={analyticsData.title}
      description="Performance insights"
      stats={analyticsData.stats}
      actions={[
        {
          label: 'View Details',
          icon: TrendingUp,
          path: `/teacher/analytics/${type}`,
          variant: 'outline'
        }
      ]}
      variant="compact"
      className={className}
    />
  )
}

export default QuickActionCard