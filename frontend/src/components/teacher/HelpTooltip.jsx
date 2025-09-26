import React from 'react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip'
import { Badge } from '../ui/badge'
import { Card, CardContent } from '../ui/card'
import {
  HelpCircle,
  Info,
  Target,
  FileText,
  BookOpen,
  Clock,
  Award,
  Users,
  CheckCircle,
  PlayCircle,
  Trophy,
  Zap,
  Calendar
} from 'lucide-react'
import { cn } from '../../lib/utils'

const HelpTooltip = ({
  type = 'info',
  content,
  title,
  position = 'top',
  children,
  className,
  size = 'md',
  variant = 'default'
}) => {
  const getIcon = () => {
    switch (type) {
      case 'homework':
        return <FileText className="h-4 w-4 text-blue-600" />
      case 'exercise':
        return <Target className="h-4 w-4 text-green-600" />
      case 'lesson':
        return <BookOpen className="h-4 w-4 text-purple-600" />
      case 'timing':
        return <Clock className="h-4 w-4 text-orange-600" />
      case 'reward':
        return <Award className="h-4 w-4 text-yellow-600" />
      case 'students':
        return <Users className="h-4 w-4 text-indigo-600" />
      default:
        return <HelpCircle className="h-4 w-4 text-gray-600" />
    }
  }

  const getSize = () => {
    switch (size) {
      case 'sm':
        return 'h-3 w-3'
      case 'lg':
        return 'h-5 w-5'
      default:
        return 'h-4 w-4'
    }
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {children || (
            <button
              className={cn(
                "inline-flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors",
                variant === 'discrete' ? 'text-muted-foreground hover:text-foreground' : '',
                className
              )}
            >
              <div className={getSize()}>
                {getIcon()}
              </div>
            </button>
          )}
        </TooltipTrigger>
        <TooltipContent side={position} className="max-w-xs">
          <div className="space-y-2">
            {title && (
              <div className="font-semibold text-sm">{title}</div>
            )}
            <div className="text-sm leading-relaxed">
              {content}
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

// Predefined help tooltips for common concepts
export const HomeworkVsExerciseTooltip = ({ className }) => (
  <HelpTooltip
    type="info"
    title="Homework vs Exercises"
    content={
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <FileText className="h-3 w-3 text-blue-500" />
          <span className="text-blue-200">Homework: Mandatory assignments with due dates</span>
        </div>
        <div className="flex items-center gap-2">
          <Target className="h-3 w-3 text-green-500" />
          <span className="text-green-200">Exercises: Optional practice tied to lessons</span>
        </div>
      </div>
    }
    className={className}
  />
)

export const ExerciseTypesTooltip = ({ className }) => (
  <HelpTooltip
    type="exercise"
    title="Exercise Types"
    content={
      <div className="space-y-1 text-xs">
        <div><strong>Mixed:</strong> Combination of question types</div>
        <div><strong>QCM Only:</strong> Multiple choice questions</div>
        <div><strong>Open Only:</strong> Written response questions</div>
        <div><strong>Practical:</strong> Hands-on activities</div>
        <div><strong>Interactive:</strong> Dynamic content</div>
      </div>
    }
    className={className}
  />
)

export const DifficultyTooltip = ({ className }) => (
  <HelpTooltip
    type="info"
    title="Difficulty Levels"
    content={
      <div className="space-y-1 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span><strong>Beginner:</strong> Basic concepts</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
          <span><strong>Intermediate:</strong> Moderate difficulty</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
          <span><strong>Advanced:</strong> Complex problems</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-red-500 rounded-full"></div>
          <span><strong>Expert:</strong> Challenging exercises</span>
        </div>
      </div>
    }
    className={className}
  />
)

export const RewardSystemTooltip = ({ className }) => (
  <HelpTooltip
    type="reward"
    title="Reward System"
    content={
      <div className="space-y-2 text-xs">
        <div className="font-medium">Students earn rewards for:</div>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <PlayCircle className="h-3 w-3 text-blue-400" />
            <span>Attempting exercises</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-3 w-3 text-green-400" />
            <span>Completing exercises</span>
          </div>
          <div className="flex items-center gap-2">
            <Trophy className="h-3 w-3 text-yellow-400" />
            <span>Perfect scores</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="h-3 w-3 text-purple-400" />
            <span>Improvement streaks</span>
          </div>
        </div>
      </div>
    }
    className={className}
  />
)

export const TimingTooltip = ({ className }) => (
  <HelpTooltip
    type="timing"
    title="Exercise Timing"
    content={
      <div className="space-y-2 text-xs">
        <div><strong>Estimated Duration:</strong> How long students should spend</div>
        <div><strong>Time Limit:</strong> Maximum time allowed (if timed)</div>
        <div><strong>Timed Exercise:</strong> Students must complete within time limit</div>
        <div className="pt-1 text-orange-200">💡 Use timing for focused practice sessions</div>
      </div>
    }
    className={className}
  />
)

export const GradingTooltip = ({ className }) => (
  <HelpTooltip
    type="info"
    title="Auto Grading"
    content={
      <div className="space-y-2 text-xs">
        <div><strong>Auto Grade:</strong> Automatically scores QCM questions</div>
        <div><strong>Manual Review:</strong> Open questions need teacher review</div>
        <div className="pt-1 text-blue-200">💡 Enable for immediate feedback on practice</div>
      </div>
    }
    className={className}
  />
)

export const AvailabilityTooltip = ({ className }) => (
  <HelpTooltip
    type="info"
    title="Exercise Availability"
    content={
      <div className="space-y-2 text-xs">
        <div className="flex items-center gap-2">
          <CheckCircle className="h-3 w-3 text-green-400" />
          <span><strong>Active:</strong> Exercise is enabled</span>
        </div>
        <div className="flex items-center gap-2">
          <Users className="h-3 w-3 text-blue-400" />
          <span><strong>Published:</strong> Visible to students</span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="h-3 w-3 text-purple-400" />
          <span><strong>Scheduled:</strong> Available during time window</span>
        </div>
      </div>
    }
    className={className}
  />
)

// Context-aware help card
export const ContextHelp = ({ type, className }) => {
  const getHelpContent = () => {
    switch (type) {
      case 'homework-creation':
        return {
          title: "Creating Homework",
          icon: <FileText className="h-5 w-5 text-blue-600" />,
          tips: [
            "Set clear due dates and late submission policies",
            "Include detailed instructions and grading rubrics",
            "Use for assessments that count toward final grades",
            "Monitor submission rates and follow up with students"
          ]
        }
      case 'exercise-creation':
        return {
          title: "Creating Exercises",
          icon: <Target className="h-5 w-5 text-green-600" />,
          tips: [
            "Create after each lesson for immediate practice",
            "Allow multiple attempts to encourage learning",
            "Use rewards to motivate student engagement",
            "Provide immediate feedback when possible"
          ]
        }
      case 'lesson-integration':
        return {
          title: "Lesson Integration",
          icon: <BookOpen className="h-5 w-5 text-purple-600" />,
          tips: [
            "Link exercises directly to lesson concepts",
            "Create a progression from simple to complex",
            "Use lesson materials as reference in exercises",
            "Track which students need additional support"
          ]
        }
      default:
        return null
    }
  }

  const helpContent = getHelpContent()

  if (!helpContent) return null

  return (
    <Card className={cn("border-dashed border-2", className)}>
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-3">
          {helpContent.icon}
          <h4 className="font-semibold text-sm">{helpContent.title}</h4>
          <Badge variant="secondary" className="text-xs">Tips</Badge>
        </div>
        <ul className="space-y-2 text-xs text-muted-foreground">
          {helpContent.tips.map((tip, index) => (
            <li key={index} className="flex items-start gap-2">
              <div className="w-1 h-1 bg-current rounded-full mt-2 flex-shrink-0"></div>
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

export default HelpTooltip