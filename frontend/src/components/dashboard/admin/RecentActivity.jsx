import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card'
import { Badge } from '../../ui/badge'
import { Button } from '../../ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar'
import { useLanguage } from '../../../hooks/useLanguage'
import { 
  Activity,
  UserPlus,
  UserX,
  Settings,
  Database,
  Shield,
  AlertTriangle,
  CheckCircle,
  FileText,
  Users,
  BookOpen,
  ChevronRight
} from 'lucide-react'

const RecentActivity = () => {
  const { t } = useLanguage()
  const [selectedFilter, setSelectedFilter] = useState('all') // all, users, system, security, academic

  const [activities, setActivities] = useState([
    {
      id: 1,
      type: 'user_created',
      category: 'users',
      user_name: 'Admin System',
      user_avatar: null,
      target_name: 'Ahmed Hassan',
      target_type: 'student',
      description: 'New student account created',
      timestamp: '2024-09-01T16:30:00Z',
      severity: 'info',
      details: {
        email: 'ahmed.hassan@student.ma',
        class: '1ère Année A'
      }
    },
    {
      id: 2,
      type: 'failed_login_attempts',
      category: 'security',
      user_name: 'Security System',
      user_avatar: null,
      target_name: 'unknown@suspicious.com',
      target_type: 'ip',
      description: 'Multiple failed login attempts detected',
      timestamp: '2024-09-01T15:45:00Z',
      severity: 'warning',
      details: {
        attempts: 15,
        ip_address: '192.168.1.100',
        blocked: true
      }
    },
    {
      id: 3,
      type: 'assignment_created',
      category: 'academic',
      user_name: 'Fatima Alaoui',
      user_avatar: null,
      target_name: 'Mathematics Quiz Chapter 5',
      target_type: 'assignment',
      description: 'New assignment created for 1ère Année A',
      timestamp: '2024-09-01T14:20:00Z',
      severity: 'info',
      details: {
        subject: 'Mathematics',
        class: '1ère Année A',
        due_date: '2024-09-05T23:59:00Z'
      }
    },
    {
      id: 4,
      type: 'system_backup',
      category: 'system',
      user_name: 'System',
      user_avatar: null,
      target_name: 'Daily Backup',
      target_type: 'backup',
      description: 'Automated system backup completed successfully',
      timestamp: '2024-09-01T06:00:00Z',
      severity: 'success',
      details: {
        size: '2.4 GB',
        duration: '45 minutes'
      }
    },
    {
      id: 5,
      type: 'user_suspended',
      category: 'users',
      user_name: 'Admin System',
      user_avatar: null,
      target_name: 'Youssef Tazi',
      target_type: 'student',
      description: 'Student account suspended for policy violation',
      timestamp: '2024-08-31T11:15:00Z',
      severity: 'warning',
      details: {
        reason: 'Multiple attendance violations',
        duration: '7 days'
      }
    },
    {
      id: 6,
      type: 'database_maintenance',
      category: 'system',
      user_name: 'System',
      user_avatar: null,
      target_name: 'Database Optimization',
      target_type: 'maintenance',
      description: 'Database optimization and cleanup completed',
      timestamp: '2024-08-31T02:00:00Z',
      severity: 'info',
      details: {
        tables_optimized: 45,
        space_freed: '150 MB'
      }
    },
    {
      id: 7,
      type: 'attendance_session',
      category: 'academic',
      user_name: 'Hassan Benali',
      user_avatar: null,
      target_name: 'Physics Class Session',
      target_type: 'attendance',
      description: 'Attendance session completed for 2ème Année B',
      timestamp: '2024-08-30T14:30:00Z',
      severity: 'success',
      details: {
        present: 24,
        absent: 3,
        late: 1
      }
    }
  ])

  const filteredActivities = activities.filter(activity => {
    if (selectedFilter === 'all') return true
    return activity.category === selectedFilter
  }).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))

  const getActivityIcon = (type) => {
    switch(type) {
      case 'user_created': return <UserPlus className="h-4 w-4 text-green-600" />
      case 'user_suspended': return <UserX className="h-4 w-4 text-red-600" />
      case 'failed_login_attempts': return <Shield className="h-4 w-4 text-red-600" />
      case 'assignment_created': return <BookOpen className="h-4 w-4 text-blue-600" />
      case 'system_backup': return <Database className="h-4 w-4 text-green-600" />
      case 'database_maintenance': return <Settings className="h-4 w-4 text-purple-600" />
      case 'attendance_session': return <Users className="h-4 w-4 text-blue-600" />
      default: return <Activity className="h-4 w-4 text-gray-600" />
    }
  }

  const getSeverityColor = (severity) => {
    switch(severity) {
      case 'success': return 'text-green-700 bg-green-100'
      case 'warning': return 'text-yellow-700 bg-yellow-100'
      case 'error': return 'text-red-700 bg-red-100'
      case 'info': return 'text-blue-700 bg-blue-100'
      default: return 'text-gray-700 bg-gray-100'
    }
  }

  const getCategoryColor = (category) => {
    switch(category) {
      case 'users': return 'text-blue-600'
      case 'system': return 'text-purple-600'
      case 'security': return 'text-red-600'
      case 'academic': return 'text-green-600'
      default: return 'text-gray-600'
    }
  }

  const formatTimeAgo = (dateString) => {
    const now = new Date()
    const date = new Date(dateString)
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return t('common.justNow')
    if (diffInHours < 24) return `${diffInHours}h ${t('common.ago')}`
    
    const diffInDays = Math.floor(diffInHours / 24)
    return `${diffInDays}d ${t('common.ago')}`
  }

  const handleViewDetails = (activity) => {
    console.log('View activity details:', activity.id)
  }

  const handleViewAllLogs = () => {
    console.log('Navigate to full activity logs')
  }

  const activityCounts = {
    all: activities.length,
    users: activities.filter(a => a.category === 'users').length,
    system: activities.filter(a => a.category === 'system').length,
    security: activities.filter(a => a.category === 'security').length,
    academic: activities.filter(a => a.category === 'academic').length
  }

  return (
    <Card>
      <CardHeader className="card-content">
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-orange-500" />
          {t('admin.recentActivity')}
        </CardTitle>
        <CardDescription>
          {t('admin.activityDescription')}
        </CardDescription>
        
        {/* Filter Tabs */}
        <div className="flex gap-1 p-1 bg-muted rounded-lg text-xs">
          {[
            { key: 'all', label: t('common.all'), count: activityCounts.all },
            { key: 'users', label: t('admin.users'), count: activityCounts.users },
            { key: 'system', label: t('admin.system'), count: activityCounts.system },
            { key: 'security', label: t('admin.security'), count: activityCounts.security },
            { key: 'academic', label: t('admin.academic'), count: activityCounts.academic }
          ].map(filter => (
            <button
              key={filter.key}
              onClick={() => setSelectedFilter(filter.key)}
              className={`px-2 py-1 font-medium rounded-md transition-colors flex items-center gap-1 ${
                selectedFilter === filter.key
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {filter.label}
              <Badge variant="secondary" className="text-xs px-1 py-0 min-w-4 h-4">
                {filter.count}
              </Badge>
            </button>
          ))}
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-3 max-h-80 overflow-y-auto">
          {filteredActivities.length > 0 ? (
            filteredActivities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-3 p-3 border rounded-lg bg-card hover:bg-accent/50 transition-colors"
              >
                <div className="flex-shrink-0 mt-0.5">
                  {getActivityIcon(activity.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm">{activity.target_name}</span>
                    <Badge className={getSeverityColor(activity.severity)}>
                      {t(`admin.${activity.severity}`)}
                    </Badge>
                    <Badge variant="outline" className={`${getCategoryColor(activity.category)} text-xs`}>
                      {t(`admin.${activity.category}`)}
                    </Badge>
                  </div>
                  
                  <p className="text-xs text-muted-foreground mb-2">
                    {activity.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{activity.user_name}</span>
                      <span>•</span>
                      <span>{formatTimeAgo(activity.timestamp)}</span>
                    </div>
                    
                    {activity.details && (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleViewDetails(activity)}
                        className="h-6 px-2 text-xs"
                      >
                        {t('common.details')}
                      </Button>
                    )}
                  </div>
                  
                  {/* Activity Details Preview */}
                  {activity.details && selectedFilter !== 'all' && (
                    <div className="mt-2 p-2 bg-accent/20 rounded text-xs">
                      {activity.type === 'user_created' && (
                        <div className="space-y-1">
                          <div>📧 {activity.details.email}</div>
                          <div>🎓 {activity.details.class}</div>
                        </div>
                      )}
                      {activity.type === 'failed_login_attempts' && (
                        <div className="space-y-1">
                          <div>🔢 {activity.details.attempts} attempts</div>
                          <div>🌐 {activity.details.ip_address}</div>
                          {activity.details.blocked && <div>🚫 IP Blocked</div>}
                        </div>
                      )}
                      {activity.type === 'system_backup' && (
                        <div className="space-y-1">
                          <div>💾 {activity.details.size}</div>
                          <div>⏱️ {activity.details.duration}</div>
                        </div>
                      )}
                      {activity.type === 'attendance_session' && (
                        <div className="space-y-1">
                          <div>✅ {activity.details.present} present</div>
                          <div>❌ {activity.details.absent} absent</div>
                          <div>⏰ {activity.details.late} late</div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">
                {t('admin.noRecentActivity')}
              </p>
            </div>
          )}
        </div>
        
        {filteredActivities.length > 0 && (
          <div className="flex justify-between items-center pt-3 mt-3 border-t">
            <div className="text-xs text-muted-foreground">
              {filteredActivities.length} {t('admin.activities')} • {t('admin.last24Hours')}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleViewAllLogs}
            >
              {t('admin.viewAllLogs')}
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default RecentActivity