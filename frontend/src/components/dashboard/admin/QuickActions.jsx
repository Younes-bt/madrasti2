import React from 'react'
import { Button } from '../../ui/button'
import { useLanguage } from '../../../hooks/useLanguage'
import { 
  Users,
  Settings,
  BarChart3,
  Shield,
  Database,
  FileText
} from 'lucide-react'

const QuickActions = () => {
  const { t } = useLanguage()

  const actions = [
    {
      id: 'manage-users',
      label: t('admin.manageUsers'),
      icon: Users,
      variant: 'default',
      onClick: () => {
        console.log('Navigate to user management')
      }
    },
    {
      id: 'system-settings',
      label: t('admin.systemSettings'),
      icon: Settings,
      variant: 'outline',
      onClick: () => {
        console.log('Navigate to system settings')
      }
    },
    {
      id: 'view-reports',
      label: t('admin.viewReports'),
      icon: BarChart3,
      variant: 'outline',
      onClick: () => {
        console.log('Navigate to system reports')
      }
    },
    {
      id: 'security-center',
      label: t('admin.securityCenter'),
      icon: Shield,
      variant: 'outline',
      onClick: () => {
        console.log('Navigate to security center')
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