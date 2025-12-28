import React from 'react'
import { FileText, Brain, Target, Users } from 'lucide-react'
import { Card, CardContent } from '../../ui/card'
import { Badge } from '../../ui/badge'
import { cn } from '../../../lib/utils'

/**
 * LessonOverviewStats Component
 *
 * Displays quick overview statistics for a lesson including:
 * - Number of resources
 * - Number of exercises
 * - Number of learning objectives
 * - Published classes count
 * - Lesson status, difficulty, and order
 *
 * @param {Object} props
 * @param {Object} props.lesson - Lesson object
 * @param {number} props.resourcesCount - Total number of resources
 * @param {number} props.exercisesCount - Total number of exercises
 * @param {number} props.objectivesCount - Total number of learning objectives
 * @param {number} props.publishedClassesCount - Number of classes with access
 * @param {number} props.totalClassesCount - Total number of classes
 * @param {string} [props.className] - Optional additional CSS classes
 */
export function LessonOverviewStats({
  lesson,
  resourcesCount,
  exercisesCount,
  objectivesCount,
  publishedClassesCount,
  totalClassesCount,
  className
}) {
  const stats = [
    {
      icon: FileText,
      value: resourcesCount,
      label: 'مورد',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      icon: Brain,
      value: exercisesCount,
      label: 'تمرين',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      icon: Target,
      value: objectivesCount,
      label: 'هدف',
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      icon: Users,
      value: `${publishedClassesCount}/${totalClassesCount}`,
      label: 'فصول',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ]

  return (
    <Card className={cn('', className)}>
      <CardContent className="p-6">
        <h2 className="text-lg font-bold mb-4">نظرة عامة</h2>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <div
                key={index}
                className={cn(
                  'text-center p-4 rounded-lg transition-all hover:shadow-md',
                  stat.bgColor
                )}
              >
                <Icon className={cn('h-8 w-8 mx-auto mb-2', stat.color)} />
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            )
          })}
        </div>

        {/* Status Badges Row */}
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">الحالة:</span>
            <Badge variant={lesson.is_active ? 'default' : 'secondary'}>
              {lesson.is_active ? 'نشط' : 'غير نشط'}
            </Badge>
          </div>

          {lesson.difficulty_display && (
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">الصعوبة:</span>
              <Badge variant="outline">{lesson.difficulty_display}</Badge>
            </div>
          )}

          {lesson.cycle_display && (
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">الدورة:</span>
              <Badge variant="outline">{lesson.cycle_display}</Badge>
            </div>
          )}

          {lesson.order !== undefined && lesson.order !== null && (
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">الترتيب:</span>
              <Badge variant="outline">{lesson.order}</Badge>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default LessonOverviewStats
