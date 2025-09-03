import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { useLanguage } from '../../hooks/useLanguage'
import { 
  Bell,
  Mail,
  Phone,
  MessageSquare,
  Send,
  Eye,
  CheckCircle,
  Clock,
  AlertTriangle,
  User,
  Calendar,
  Filter,
  Search,
  Settings,
  Edit,
  Trash2,
  Copy,
  Download,
  Upload,
  Zap,
  Users,
  TrendingUp,
  FileText,
  Smartphone
} from 'lucide-react'

const ParentNotificationInterface = () => {
  const { t } = useLanguage()
  const [selectedTab, setSelectedTab] = useState('all') // all, sent, pending, failed
  const [notificationType, setNotificationType] = useState('all') // all, email, sms, app, call
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedNotifications, setSelectedNotifications] = useState([])

  const notifications = [
    {
      id: 1,
      type: 'absence_flag',
      method: 'email',
      recipient_name: 'Mrs. Hassan',
      recipient_contact: 'fatima.hassan@email.com',
      student_name: 'Ahmed Hassan',
      student_class: '1ère Année C',
      subject: 'Absence Flag Created - Mathematics',
      message: 'Your child Ahmed Hassan was absent from Mathematics class on 2024-09-02 (11:00-12:00). Please provide justification within 3 days.',
      status: 'sent', // pending, sent, delivered, read, failed
      priority: 'high', // low, medium, high
      created_at: '2024-09-02T11:30:00Z',
      sent_at: '2024-09-02T11:35:00Z',
      delivered_at: '2024-09-02T11:36:00Z',
      read_at: '2024-09-02T14:20:00Z',
      auto_generated: true,
      template_used: 'absence_flag_notification',
      related_flag_id: 1
    },
    {
      id: 2,
      type: 'attendance_summary',
      method: 'app',
      recipient_name: 'Mr. Benali',
      recipient_contact: '+212-612-345-678',
      student_name: 'Omar Benali',
      student_class: '2ème Année A',
      subject: 'Weekly Attendance Report',
      message: 'Weekly attendance report for Omar Benali: 18/20 sessions attended (90%). 2 absences recorded.',
      status: 'delivered',
      priority: 'medium',
      created_at: '2024-09-01T18:00:00Z',
      sent_at: '2024-09-01T18:00:00Z',
      delivered_at: '2024-09-01T18:01:00Z',
      read_at: null,
      auto_generated: true,
      template_used: 'weekly_attendance_summary',
      related_flag_id: null
    },
    {
      id: 3,
      type: 'urgent_absence',
      method: 'sms',
      recipient_name: 'Mrs. Al-Zahra',
      recipient_contact: '+212-612-987-654',
      student_name: 'Fatima Al-Zahra',
      student_class: '1ère Année C',
      subject: 'Urgent: Student Absence Alert',
      message: 'URGENT: Fatima Al-Zahra did not attend Physics Lab (09:00-11:00). Please confirm her whereabouts immediately.',
      status: 'sent',
      priority: 'high',
      created_at: '2024-08-30T09:15:00Z',
      sent_at: '2024-08-30T09:16:00Z',
      delivered_at: '2024-08-30T09:16:00Z',
      read_at: null,
      auto_generated: true,
      template_used: 'urgent_absence_alert',
      related_flag_id: 2
    },
    {
      id: 4,
      type: 'flag_reminder',
      method: 'email',
      recipient_name: 'Mrs. Mansour',
      recipient_contact: 'aisha.mansour@email.com',
      student_name: 'Aisha Mansour',
      student_class: '3ème Année C',
      subject: 'Reminder: Absence Flag Clearance Deadline Tomorrow',
      message: 'Reminder: The deadline for clearing Aisha Mansour\'s absence flag is tomorrow (2024-09-04). Please submit justification.',
      status: 'pending',
      priority: 'medium',
      created_at: '2024-09-02T08:00:00Z',
      sent_at: null,
      delivered_at: null,
      read_at: null,
      auto_generated: true,
      template_used: 'flag_deadline_reminder',
      related_flag_id: 4
    },
    {
      id: 5,
      type: 'custom_message',
      method: 'app',
      recipient_name: 'Dr. Alaoui',
      recipient_contact: 'parent_app_id_12345',
      student_name: 'Youssef Alaoui',
      student_class: '1ère Année C',
      subject: 'Meeting Request - Academic Performance',
      message: 'We would like to schedule a meeting to discuss Youssef\'s recent academic performance and attendance patterns.',
      status: 'failed',
      priority: 'medium',
      created_at: '2024-09-01T15:30:00Z',
      sent_at: '2024-09-01T15:32:00Z',
      delivered_at: null,
      read_at: null,
      auto_generated: false,
      template_used: null,
      related_flag_id: null,
      failure_reason: 'Parent app not installed'
    }
  ]

  const getStatusConfig = (status) => {
    const configs = {
      pending: {
        color: 'bg-yellow-100 text-yellow-800',
        icon: Clock,
        label: t('notifications.pending')
      },
      sent: {
        color: 'bg-blue-100 text-blue-800',
        icon: Send,
        label: t('notifications.sent')
      },
      delivered: {
        color: 'bg-green-100 text-green-800',
        icon: CheckCircle,
        label: t('notifications.delivered')
      },
      read: {
        color: 'bg-green-100 text-green-800',
        icon: Eye,
        label: t('notifications.read')
      },
      failed: {
        color: 'bg-red-100 text-red-800',
        icon: AlertTriangle,
        label: t('notifications.failed')
      }
    }
    return configs[status] || configs.pending
  }

  const getMethodIcon = (method) => {
    const icons = {
      email: Mail,
      sms: MessageSquare,
      app: Smartphone,
      call: Phone
    }
    return icons[method] || Bell
  }

  const getPriorityColor = (priority) => {
    const colors = {
      low: 'bg-blue-100 text-blue-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-red-100 text-red-800'
    }
    return colors[priority] || colors.medium
  }

  const filteredNotifications = notifications.filter(notification => {
    const matchesTab = selectedTab === 'all' || notification.status === selectedTab
    const matchesType = notificationType === 'all' || notification.method === notificationType
    const matchesSearch = notification.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.recipient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.subject.toLowerCase().includes(searchTerm.toLowerCase())
    
    return matchesTab && matchesType && matchesSearch
  })

  const notificationCounts = {
    all: notifications.length,
    sent: notifications.filter(n => n.status === 'sent' || n.status === 'delivered' || n.status === 'read').length,
    pending: notifications.filter(n => n.status === 'pending').length,
    failed: notifications.filter(n => n.status === 'failed').length
  }

  const sendNotification = (notificationId) => {
    console.log('Send notification:', notificationId)
    // API call to send notification
  }

  const resendNotification = (notificationId) => {
    console.log('Resend notification:', notificationId)
    // API call to resend failed notification
  }

  const createCustomNotification = () => {
    console.log('Create custom notification')
    // Open notification creation modal
  }

  const bulkSend = () => {
    console.log('Bulk send selected notifications:', selectedNotifications)
    // API call to send multiple notifications
  }

  const exportReport = () => {
    console.log('Export notification report')
    // Export notification data
  }

  const handleSelectNotification = (notificationId) => {
    setSelectedNotifications(prev => 
      prev.includes(notificationId)
        ? prev.filter(id => id !== notificationId)
        : [...prev, notificationId]
    )
  }

  const handleSelectAll = () => {
    if (selectedNotifications.length === filteredNotifications.length) {
      setSelectedNotifications([])
    } else {
      setSelectedNotifications(filteredNotifications.map(n => n.id))
    }
  }

  const formatDateTime = (dateString) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getDeliveryTime = (notification) => {
    if (notification.read_at) {
      const sentTime = new Date(notification.sent_at)
      const readTime = new Date(notification.read_at)
      const diffMinutes = Math.round((readTime - sentTime) / (1000 * 60))
      return `${diffMinutes}m`
    } else if (notification.delivered_at) {
      const sentTime = new Date(notification.sent_at)
      const deliveredTime = new Date(notification.delivered_at)
      const diffSeconds = Math.round((deliveredTime - sentTime) / 1000)
      return `${diffSeconds}s`
    }
    return '-'
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-blue-500" />
              {t('attendance.parentNotifications')}
            </CardTitle>
            <CardDescription>
              {t('attendance.parentNotificationsDescription')}
            </CardDescription>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={exportReport}>
              <Download className="h-4 w-4 mr-1" />
              {t('common.export')}
            </Button>
            <Button variant="outline" size="sm" onClick={() => console.log('Configure templates')}>
              <Settings className="h-4 w-4 mr-1" />
              {t('notifications.templates')}
            </Button>
            <Button size="sm" onClick={createCustomNotification}>
              <Send className="h-4 w-4 mr-1" />
              {t('notifications.createNotification')}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Summary Stats */}
        <div className="grid grid-cols-5 gap-3 p-3 bg-accent/30 rounded-lg">
          <div className="text-center">
            <div className="text-lg font-bold text-blue-600">{notificationCounts.all}</div>
            <div className="text-xs text-muted-foreground">{t('notifications.total')}</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-green-600">{notificationCounts.sent}</div>
            <div className="text-xs text-muted-foreground">{t('notifications.sent')}</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-yellow-600">{notificationCounts.pending}</div>
            <div className="text-xs text-muted-foreground">{t('notifications.pending')}</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-red-600">{notificationCounts.failed}</div>
            <div className="text-xs text-muted-foreground">{t('notifications.failed')}</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-purple-600">
              {Math.round((notificationCounts.sent / notificationCounts.all) * 100)}%
            </div>
            <div className="text-xs text-muted-foreground">{t('notifications.deliveryRate')}</div>
          </div>
        </div>

        {/* Filters and Controls */}
        <div className="flex items-center justify-between gap-4">
          {/* Status Tabs */}
          <div className="flex gap-1">
            {[
              { key: 'all', label: t('common.all'), count: notificationCounts.all },
              { key: 'sent', label: t('notifications.sent'), count: notificationCounts.sent },
              { key: 'pending', label: t('notifications.pending'), count: notificationCounts.pending },
              { key: 'failed', label: t('notifications.failed'), count: notificationCounts.failed }
            ].map((tab) => (
              <Button
                key={tab.key}
                variant={selectedTab === tab.key ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedTab(tab.key)}
              >
                {tab.label} ({tab.count})
              </Button>
            ))}
          </div>

          {/* Search and Filters */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="h-4 w-4 absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder={t('common.search')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 pr-3 py-1 border rounded text-sm w-40"
              />
            </div>
            
            <select 
              value={notificationType}
              onChange={(e) => setNotificationType(e.target.value)}
              className="border rounded px-2 py-1 text-sm"
            >
              <option value="all">{t('notifications.allMethods')}</option>
              <option value="email">{t('notifications.email')}</option>
              <option value="sms">{t('notifications.sms')}</option>
              <option value="app">{t('notifications.app')}</option>
              <option value="call">{t('notifications.call')}</option>
            </select>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedNotifications.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-blue-800 font-medium">
                {selectedNotifications.length} {t('notifications.selected')}
              </span>
              <div className="flex gap-2">
                <Button size="sm" onClick={bulkSend}>
                  <Send className="h-4 w-4 mr-1" />
                  {t('notifications.bulkSend')}
                </Button>
                <Button variant="outline" size="sm" onClick={() => console.log('Bulk delete')}>
                  <Trash2 className="h-4 w-4 mr-1" />
                  {t('common.delete')}
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setSelectedNotifications([])}>
                  {t('common.cancel')}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Notifications List */}
        <div className="space-y-3">
          {/* Header */}
          <div className="flex items-center justify-between p-2 bg-muted/30 rounded-lg text-sm font-medium">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={selectedNotifications.length === filteredNotifications.length && filteredNotifications.length > 0}
                onChange={handleSelectAll}
                className="rounded"
              />
              <span>{t('notifications.notification')}</span>
            </div>
            <div className="flex items-center gap-8 text-xs text-muted-foreground">
              <span>{t('notifications.method')}</span>
              <span>{t('notifications.status')}</span>
              <span>{t('notifications.sent')}</span>
              <span>{t('common.actions')}</span>
            </div>
          </div>

          {filteredNotifications.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Bell className="h-8 w-8 mx-auto mb-2" />
              <p>{t('notifications.noNotifications')}</p>
            </div>
          ) : (
            filteredNotifications.map((notification) => {
              const statusConfig = getStatusConfig(notification.status)
              const StatusIcon = statusConfig.icon
              const MethodIcon = getMethodIcon(notification.method)

              return (
                <div
                  key={notification.id}
                  className={`p-4 border rounded-lg transition-all ${
                    notification.status === 'failed' 
                      ? 'bg-red-50 border-red-200' 
                      : notification.status === 'pending'
                      ? 'bg-yellow-50 border-yellow-200'
                      : 'bg-card border-border'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={selectedNotifications.includes(notification.id)}
                      onChange={() => handleSelectNotification(notification.id)}
                      className="mt-1 rounded"
                    />
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="font-medium text-sm">
                            {notification.student_name} • {notification.student_class}
                          </div>
                          <Badge className={getPriorityColor(notification.priority)}>
                            {t(`notifications.${notification.priority}Priority`)}
                          </Badge>
                          {notification.auto_generated && (
                            <Badge variant="outline" className="text-xs">
                              {t('notifications.auto')}
                            </Badge>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            <MethodIcon className="h-4 w-4 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">
                              {t(`notifications.${notification.method}`)}
                            </span>
                          </div>
                          <Badge className={statusConfig.color}>
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {statusConfig.label}
                          </Badge>
                        </div>
                      </div>

                      <div className="space-y-1 text-sm">
                        <div className="font-medium">{notification.subject}</div>
                        <div className="text-muted-foreground line-clamp-2">
                          {notification.message}
                        </div>
                        
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>
                            {t('notifications.to')}: {notification.recipient_name} ({notification.recipient_contact})
                          </span>
                          <span>
                            {t('notifications.created')}: {formatDateTime(notification.created_at)}
                          </span>
                          {notification.sent_at && (
                            <span>
                              {t('notifications.sent')}: {formatDateTime(notification.sent_at)}
                            </span>
                          )}
                          {notification.delivered_at && (
                            <span>
                              {t('notifications.delivered')}: {getDeliveryTime(notification)}
                            </span>
                          )}
                        </div>

                        {notification.failure_reason && (
                          <div className="bg-red-50 border border-red-200 p-2 rounded text-red-700 text-xs">
                            <AlertTriangle className="h-3 w-3 inline mr-1" />
                            {t('notifications.failureReason')}: {notification.failure_reason}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex items-center gap-1">
                      {notification.status === 'pending' && (
                        <Button size="sm" onClick={() => sendNotification(notification.id)}>
                          <Send className="h-4 w-4 mr-1" />
                          {t('notifications.send')}
                        </Button>
                      )}
                      
                      {notification.status === 'failed' && (
                        <Button size="sm" onClick={() => resendNotification(notification.id)}>
                          <Send className="h-4 w-4 mr-1" />
                          {t('notifications.resend')}
                        </Button>
                      )}
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => console.log('View details:', notification.id)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => console.log('Copy notification:', notification.id)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      
                      {!notification.auto_generated && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => console.log('Edit notification:', notification.id)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* Quick Actions */}
        <div className="flex gap-2 pt-4 border-t">
          <Button
            variant="outline"
            onClick={() => console.log('Send pending notifications')}
          >
            <Zap className="h-4 w-4 mr-1" />
            {t('notifications.sendPending')}
          </Button>
          <Button
            variant="outline"
            onClick={() => console.log('Retry failed notifications')}
          >
            <Send className="h-4 w-4 mr-1" />
            {t('notifications.retryFailed')}
          </Button>
          <Button
            variant="outline"
            onClick={() => console.log('Notification analytics')}
          >
            <TrendingUp className="h-4 w-4 mr-1" />
            {t('notifications.analytics')}
          </Button>
          <Button
            variant="outline"
            onClick={() => console.log('Import contacts')}
          >
            <Upload className="h-4 w-4 mr-1" />
            {t('notifications.importContacts')}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default ParentNotificationInterface