import React from 'react'
import { Button } from '../../ui/button'
import { useLanguage } from '../../../hooks/useLanguage'
import { 
  MessageCircle,
  Calendar,
  FileText,
  Users,
  Bell,
  CreditCard
} from 'lucide-react'

const QuickActions = () => {
  const { t } = useLanguage()

  const actions = [
    {
      id: 'contact-teacher',
      label: t('parent.contactTeacher'),
      icon: MessageCircle,
      variant: 'default',
      onClick: () => {
        console.log('Navigate to teacher contact')
      }
    },
    {
      id: 'view-calendar',
      label: t('parent.viewCalendar'),
      icon: Calendar,
      variant: 'outline',
      onClick: () => {
        console.log('Navigate to parent calendar')
      }
    },
    {
      id: 'view-reports',
      label: t('parent.viewReports'),
      icon: FileText,
      variant: 'outline',
      onClick: () => {
        console.log('Navigate to academic reports')
      }
    },
    {
      id: 'parent-meetings',
      label: t('parent.scheduleMeeting'),
      icon: Users,
      variant: 'outline',
      onClick: () => {
        console.log('Navigate to meeting scheduling')
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