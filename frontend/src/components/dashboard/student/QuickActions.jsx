import React from 'react'
import { Button } from '../../ui/button'
import { useLanguage } from '../../../hooks/useLanguage'
import { 
  BookOpen, 
  Calendar, 
  Trophy, 
  Users,
  Timer,
  Bell
} from 'lucide-react'

const QuickActions = () => {
  const { t } = useLanguage()

  const actions = [
    {
      id: 'assignments',
      label: t('homework.viewAssignments'),
      icon: BookOpen,
      variant: 'default',
      onClick: () => {
        // Navigate to assignments
        console.log('Navigate to assignments')
      }
    },
    {
      id: 'schedule',
      label: t('common.schedule'),
      icon: Calendar,
      variant: 'outline',
      onClick: () => {
        // Navigate to schedule
        console.log('Navigate to schedule')
      }
    },
    {
      id: 'leaderboard',
      label: t('gamification.leaderboard'),
      icon: Trophy,
      variant: 'outline',
      onClick: () => {
        // Navigate to leaderboard
        console.log('Navigate to leaderboard')
      }
    }
  ]

  return (
    <div className="flex flex-col sm:flex-row gap-2">
      {actions.map((action) => {
        const Icon = action.icon
        return (
          <Button
            key={action.id}
            variant={action.variant}
            size="sm"
            onClick={action.onClick}
            className="flex items-center gap-2"
          >
            <Icon className="h-4 w-4" />
            {action.label}
          </Button>
        )
      })}
    </div>
  )
}

export default QuickActions