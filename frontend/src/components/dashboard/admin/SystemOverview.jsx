import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card'
import { Badge } from '../../ui/badge'
import { Button } from '../../ui/button'
import { useLanguage } from '../../../hooks/useLanguage'
import { 
  Server,
  Users,
  GraduationCap,
  BookOpen,
  TrendingUp,
  TrendingDown,
  Activity,
  Database,
  Cpu,
  HardDrive,
  Wifi
} from 'lucide-react'

const SystemOverview = () => {
  const { t } = useLanguage()

  const [systemStats, setSystemStats] = useState({
    total_users: 1247,
    active_users_today: 892,
    total_students: 1150,
    total_teachers: 85,
    total_parents: 650,
    total_classes: 48,
    total_subjects: 12,
    assignments_created_today: 23,
    attendance_sessions_today: 156,
    system_uptime: 99.8,
    server_load: 68,
    database_size: 2.4, // GB
    storage_usage: 45, // percentage
    active_sessions: 234,
    monthly_growth: {
      students: 5.2,
      teachers: 2.1,
      assignments: 18.5,
      attendance_rate: 3.2
    }
  })

  const getStatusColor = (value, thresholds) => {
    if (value >= thresholds.good) return 'text-green-600 bg-green-100'
    if (value >= thresholds.warning) return 'text-yellow-600 bg-yellow-100'
    return 'text-red-600 bg-red-100'
  }

  const getGrowthIcon = (value) => {
    return value >= 0 
      ? <TrendingUp className="h-4 w-4 text-green-600" />
      : <TrendingDown className="h-4 w-4 text-red-600" />
  }

  const handleViewSystemDetails = () => {
    console.log('Navigate to system details')
  }

  const handleManageUsers = () => {
    console.log('Navigate to user management')
  }

  const handleViewReports = () => {
    console.log('Navigate to system reports')
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="card-content">
            <CardTitle className="flex items-center gap-2">
              <Server className="h-5 w-5 text-blue-500" />
              {t('admin.systemOverview')}
            </CardTitle>
            <CardDescription>
              {t('admin.overviewDescription')}
            </CardDescription>
          </div>
          <Badge className={getStatusColor(systemStats.system_uptime, { good: 99, warning: 95 })}>
            {systemStats.system_uptime}% {t('admin.uptime')}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6 card-content">
        {/* Core Statistics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <Users className="h-6 w-6 text-blue-600 mx-auto mb-2" />
            <div className="text-xl font-bold text-blue-900 dark:text-blue-100">
              {systemStats.total_users.toLocaleString()}
            </div>
            <div className="text-xs text-blue-600 dark:text-blue-400">
              {t('admin.totalUsers')}
            </div>
          </div>

          <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <Activity className="h-6 w-6 text-green-600 mx-auto mb-2" />
            <div className="text-xl font-bold text-green-900 dark:text-green-100">
              {systemStats.active_users_today.toLocaleString()}
            </div>
            <div className="text-xs text-green-600 dark:text-green-400">
              {t('admin.activeToday')}
            </div>
          </div>

          <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <GraduationCap className="h-6 w-6 text-purple-600 mx-auto mb-2" />
            <div className="text-xl font-bold text-purple-900 dark:text-purple-100">
              {systemStats.total_classes}
            </div>
            <div className="text-xs text-purple-600 dark:text-purple-400">
              {t('admin.totalClasses')}
            </div>
          </div>

          <div className="text-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
            <BookOpen className="h-6 w-6 text-orange-600 mx-auto mb-2" />
            <div className="text-xl font-bold text-orange-900 dark:text-orange-100">
              {systemStats.assignments_created_today}
            </div>
            <div className="text-xs text-orange-600 dark:text-orange-400">
              {t('admin.assignmentsToday')}
            </div>
          </div>
        </div>

        {/* User Breakdown */}
        <div>
          <h4 className="font-medium mb-3">{t('admin.userBreakdown')}</h4>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="p-3 bg-accent/30 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-muted-foreground">{t('student.students')}</div>
                  <div className="text-lg font-bold">{systemStats.total_students.toLocaleString()}</div>
                </div>
                <div className="flex items-center gap-1">
                  {getGrowthIcon(systemStats.monthly_growth.students)}
                  <span className="text-sm text-green-600">
                    +{systemStats.monthly_growth.students}%
                  </span>
                </div>
              </div>
            </div>

            <div className="p-3 bg-accent/30 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-muted-foreground">{t('teacher.teachers')}</div>
                  <div className="text-lg font-bold">{systemStats.total_teachers}</div>
                </div>
                <div className="flex items-center gap-1">
                  {getGrowthIcon(systemStats.monthly_growth.teachers)}
                  <span className="text-sm text-green-600">
                    +{systemStats.monthly_growth.teachers}%
                  </span>
                </div>
              </div>
            </div>

            <div className="p-3 bg-accent/30 rounded-lg">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-muted-foreground">{t('parent.parents')}</div>
                  <div className="text-lg font-bold">{systemStats.total_parents.toLocaleString()}</div>
                </div>
                <div className="text-sm text-muted-foreground">
                  {Math.round((systemStats.total_parents / systemStats.total_students) * 100)}% {t('admin.coverage')}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* System Performance Metrics */}
        <div>
          <h4 className="font-medium mb-3">{t('admin.systemPerformance')}</h4>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-3 border rounded-lg">
              <Cpu className="h-5 w-5 text-gray-600 mx-auto mb-1" />
              <div className={`text-sm font-bold ${systemStats.server_load > 80 ? 'text-red-600' : systemStats.server_load > 60 ? 'text-yellow-600' : 'text-green-600'}`}>
                {systemStats.server_load}%
              </div>
              <div className="text-xs text-muted-foreground">{t('admin.serverLoad')}</div>
            </div>

            <div className="text-center p-3 border rounded-lg">
              <Database className="h-5 w-5 text-gray-600 mx-auto mb-1" />
              <div className="text-sm font-bold text-blue-600">
                {systemStats.database_size}GB
              </div>
              <div className="text-xs text-muted-foreground">{t('admin.databaseSize')}</div>
            </div>

            <div className="text-center p-3 border rounded-lg">
              <HardDrive className="h-5 w-5 text-gray-600 mx-auto mb-1" />
              <div className={`text-sm font-bold ${systemStats.storage_usage > 80 ? 'text-red-600' : systemStats.storage_usage > 60 ? 'text-yellow-600' : 'text-green-600'}`}>
                {systemStats.storage_usage}%
              </div>
              <div className="text-xs text-muted-foreground">{t('admin.storageUsage')}</div>
            </div>

            <div className="text-center p-3 border rounded-lg">
              <Wifi className="h-5 w-5 text-gray-600 mx-auto mb-1" />
              <div className="text-sm font-bold text-purple-600">
                {systemStats.active_sessions}
              </div>
              <div className="text-xs text-muted-foreground">{t('admin.activeSessions')}</div>
            </div>
          </div>
        </div>

        {/* Today's Activity Summary */}
        <div className="p-4 bg-accent/20 rounded-lg">
          <h4 className="font-medium mb-3">{t('admin.todayActivity')}</h4>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
            <div className="text-center">
              <div className="font-bold text-green-600">{systemStats.active_users_today}</div>
              <div className="text-muted-foreground">{t('admin.activeUsers')}</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-blue-600">{systemStats.assignments_created_today}</div>
              <div className="text-muted-foreground">{t('admin.newAssignments')}</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-purple-600">{systemStats.attendance_sessions_today}</div>
              <div className="text-muted-foreground">{t('admin.attendanceSessions')}</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-orange-600">
                {Math.round((systemStats.active_users_today / systemStats.total_users) * 100)}%
              </div>
              <div className="text-muted-foreground">{t('admin.engagementRate')}</div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-col sm:flex-row gap-2 pt-4 border-t">
          <Button onClick={handleViewSystemDetails} variant="outline" className="flex-1">
            {t('admin.viewSystemDetails')}
          </Button>
          <Button onClick={handleManageUsers} variant="outline" className="flex-1">
            {t('admin.manageUsers')}
          </Button>
          <Button onClick={handleViewReports} className="flex-1">
            {t('admin.viewReports')}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default SystemOverview