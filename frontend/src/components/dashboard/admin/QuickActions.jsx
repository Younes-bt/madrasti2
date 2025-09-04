import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card'
import { Button } from '../../ui/button'
import { useLanguage } from '../../../hooks/useLanguage'
import { 
  Users,
  Settings,
  BarChart3,
  Shield,
  ChevronRight
} from 'lucide-react'

const QuickActions = () => {
  const { t } = useLanguage()

  const actions = [
    {
      id: 'manage-users',
      label: t('admin.manageUsers'),
      icon: Users,
      onClick: () => console.log('Navigate to user management')
    },
    {
      id: 'system-settings',
      label: t('admin.systemSettings'),
      icon: Settings,
      onClick: () => console.log('Navigate to system settings')
    },
    {
      id: 'view-reports',
      label: t('admin.viewReports'),
      icon: BarChart3,
      onClick: () => console.log('Navigate to system reports')
    },
    {
      id: 'security-center',
      label: t('admin.securityCenter'),
      icon: Shield,
      onClick: () => console.log('Navigate to security center')
    }
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('admin.quickActions')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {actions.map((action) => {
          const Icon = action.icon
          return (
            <Button
              key={action.id}
              variant="outline"
              size="sm"
              onClick={action.onClick}
              className="w-full flex justify-between items-center"
            >
              <div className="flex items-center gap-2">
                <Icon className="h-4 w-4" />
                <span>{action.label}</span>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </Button>
          )
        })}
      </CardContent>
    </Card>
  )
}

export default QuickActions