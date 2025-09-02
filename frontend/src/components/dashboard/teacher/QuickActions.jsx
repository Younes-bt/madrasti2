import React from 'react'
import { Button } from '../../ui/button'
import { useLanguage } from '../../../hooks/useLanguage'
import { 
  Plus,
  UserCheck,
  FileText,
  BarChart3,
  Calendar,
  Users
} from 'lucide-react'

const QuickActions = () => {
  const { t } = useLanguage()

  const actions = [
    {
      id: 'create-assignment',
      label: t('teacher.createAssignment'),
      icon: Plus,
      variant: 'default',
      onClick: () => {
        console.log('Navigate to create assignment')
      }
    },
    {
      id: 'mark-attendance',
      label: t('teacher.markAttendance'),
      icon: UserCheck,
      variant: 'outline',
      onClick: () => {
        console.log('Navigate to attendance marking')
      }
    },
    {
      id: 'grade-submissions',
      label: t('teacher.gradeSubmissions'),
      icon: FileText,
      variant: 'outline',
      onClick: () => {
        console.log('Navigate to grading interface')
      }
    },
    {
      id: 'view-analytics',
      label: t('teacher.viewAnalytics'),
      icon: BarChart3,
      variant: 'outline',
      onClick: () => {
        console.log('Navigate to class analytics')
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