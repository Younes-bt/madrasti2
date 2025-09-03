import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { useLanguage } from '../../hooks/useLanguage'
import { 
  Users,
  CheckCircle,
  XCircle,
  Clock,
  Calendar,
  Upload,
  Download,
  Filter,
  Search,
  Play,
  Pause,
  RotateCcw,
  Copy,
  Trash2,
  Flag,
  Bell,
  Settings,
  FileText,
  Activity,
  Zap,
  Target,
  AlertTriangle,
  Save,
  Eye,
  Edit,
  MoreHorizontal
} from 'lucide-react'

const BulkAttendanceOperations = () => {
  const { t } = useLanguage()
  const [selectedOperation, setSelectedOperation] = useState('mark_attendance')
  const [selectedItems, setSelectedItems] = useState([])
  const [bulkAction, setBulkAction] = useState('')
  const [filterClass, setFilterClass] = useState('all')
  const [filterDate, setFilterDate] = useState('today')
  const [searchTerm, setSearchTerm] = useState('')

  const operationTypes = [
    { id: 'mark_attendance', name: t('attendance.bulkMarkAttendance'), icon: CheckCircle },
    { id: 'create_sessions', name: t('attendance.bulkCreateSessions'), icon: Play },
    { id: 'manage_flags', name: t('attendance.bulkManageFlags'), icon: Flag },
    { id: 'send_notifications', name: t('attendance.bulkSendNotifications'), icon: Bell },
    { id: 'update_records', name: t('attendance.bulkUpdateRecords'), icon: Edit },
    { id: 'generate_reports', name: t('attendance.bulkGenerateReports'), icon: FileText }
  ]

  const classes = [
    { id: 'all', name: t('common.allClasses') },
    { id: '1ere_c', name: '1ère Année C', students: 24 },
    { id: '1ere_b', name: '1ère Année B', students: 26 },
    { id: '2eme_a', name: '2ème Année A', students: 22 },
    { id: '3eme_c', name: '3ème Année C', students: 20 }
  ]

  // Mock data based on selected operation
  const operationData = {
    mark_attendance: [
      {
        id: 1,
        type: 'session',
        title: 'Mathematics - 1ère C',
        subtitle: '09:00-10:00 • Salle 101',
        status: 'not_started',
        students_total: 24,
        students_marked: 0,
        date: '2024-09-02',
        teacher: 'Mr. Alami',
        priority: 'high'
      },
      {
        id: 2,
        type: 'session',
        title: 'Physics - 1ère C',
        subtitle: '10:00-11:00 • Lab 1',
        status: 'in_progress',
        students_total: 24,
        students_marked: 18,
        date: '2024-09-02',
        teacher: 'Mrs. Bennani',
        priority: 'medium'
      },
      {
        id: 3,
        type: 'session',
        title: 'Chemistry - 2ème A',
        subtitle: '11:20-12:20 • Lab 2',
        status: 'not_started',
        students_total: 22,
        students_marked: 0,
        date: '2024-09-02',
        teacher: 'Dr. Alaoui',
        priority: 'medium'
      }
    ],
    create_sessions: [
      {
        id: 1,
        type: 'template',
        title: 'Weekly Mathematics Sessions',
        subtitle: '5 sessions • 1ère Année C',
        status: 'ready',
        date_range: '2024-09-02 to 2024-09-06',
        teacher: 'Mr. Alami',
        priority: 'medium'
      },
      {
        id: 2,
        type: 'template',
        title: 'Physics Lab Sessions',
        subtitle: '2 sessions • 1ère Année C',
        status: 'ready',
        date_range: '2024-09-03 to 2024-09-05',
        teacher: 'Mrs. Bennani',
        priority: 'low'
      }
    ],
    manage_flags: [
      {
        id: 1,
        type: 'flag',
        title: 'Ahmed Hassan - Mathematics',
        subtitle: 'Unjustified absence • High severity',
        status: 'pending_clearance',
        deadline: '2024-09-05T23:59:59Z',
        student_class: '1ère C',
        priority: 'high'
      },
      {
        id: 2,
        type: 'flag',
        title: 'Fatima Al-Zahra - Physics Lab',
        subtitle: 'Late arrival • Low severity',
        status: 'under_review',
        deadline: '2024-09-02T23:59:59Z',
        student_class: '1ère C',
        priority: 'medium'
      }
    ],
    send_notifications: [
      {
        id: 1,
        type: 'notification',
        title: 'Absence Alerts - Mathematics',
        subtitle: '3 parents • Email + SMS',
        status: 'pending',
        priority: 'high',
        recipients: 3,
        method: 'email_sms'
      },
      {
        id: 2,
        type: 'notification',
        title: 'Weekly Attendance Summary',
        subtitle: '24 parents • App notification',
        status: 'scheduled',
        priority: 'medium',
        recipients: 24,
        method: 'app'
      }
    ]
  }

  const getStatusConfig = (status) => {
    const configs = {
      not_started: { color: 'bg-gray-100 text-gray-800', icon: Clock },
      in_progress: { color: 'bg-blue-100 text-blue-800', icon: Activity },
      completed: { color: 'bg-green-100 text-green-800', icon: CheckCircle },
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock },
      pending_clearance: { color: 'bg-red-100 text-red-800', icon: AlertTriangle },
      under_review: { color: 'bg-yellow-100 text-yellow-800', icon: Eye },
      scheduled: { color: 'bg-blue-100 text-blue-800', icon: Calendar },
      ready: { color: 'bg-green-100 text-green-800', icon: CheckCircle }
    }
    return configs[status] || configs.pending
  }

  const getPriorityColor = (priority) => {
    const colors = {
      high: 'bg-red-100 text-red-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-blue-100 text-blue-800'
    }
    return colors[priority] || colors.medium
  }

  const currentData = operationData[selectedOperation] || []

  const filteredData = currentData.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase())
    // Add more filters based on operation type
    return matchesSearch
  })

  const handleSelectItem = (itemId) => {
    setSelectedItems(prev => 
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    )
  }

  const handleSelectAll = () => {
    if (selectedItems.length === filteredData.length) {
      setSelectedItems([])
    } else {
      setSelectedItems(filteredData.map(item => item.id))
    }
  }

  const executeBulkAction = (action) => {
    console.log('Execute bulk action:', action, 'on items:', selectedItems)
    // API call for bulk operation
    setSelectedItems([])
  }

  const importData = () => {
    console.log('Import attendance data')
    // File import functionality
  }

  const exportSelected = () => {
    console.log('Export selected items:', selectedItems)
    // Export functionality
  }

  const scheduleOperation = () => {
    console.log('Schedule bulk operation')
    // Schedule operation
  }

  const getBulkActions = () => {
    switch(selectedOperation) {
      case 'mark_attendance':
        return [
          { id: 'mark_present', label: t('attendance.markAllPresent'), icon: CheckCircle, color: 'text-green-700' },
          { id: 'mark_absent', label: t('attendance.markAllAbsent'), icon: XCircle, color: 'text-red-700' },
          { id: 'start_sessions', label: t('attendance.startSessions'), icon: Play, color: 'text-blue-700' }
        ]
      case 'create_sessions':
        return [
          { id: 'create_all', label: t('attendance.createAllSessions'), icon: Play, color: 'text-green-700' },
          { id: 'schedule_all', label: t('attendance.scheduleAll'), icon: Calendar, color: 'text-blue-700' },
          { id: 'duplicate', label: t('attendance.duplicateTemplates'), icon: Copy, color: 'text-purple-700' }
        ]
      case 'manage_flags':
        return [
          { id: 'clear_flags', label: t('attendance.clearFlags'), icon: CheckCircle, color: 'text-green-700' },
          { id: 'extend_deadlines', label: t('attendance.extendDeadlines'), icon: Clock, color: 'text-yellow-700' },
          { id: 'notify_parents', label: t('attendance.notifyParents'), icon: Bell, color: 'text-blue-700' }
        ]
      case 'send_notifications':
        return [
          { id: 'send_now', label: t('notifications.sendNow'), icon: Zap, color: 'text-green-700' },
          { id: 'schedule_send', label: t('notifications.scheduleSend'), icon: Calendar, color: 'text-blue-700' },
          { id: 'test_send', label: t('notifications.testSend'), icon: Eye, color: 'text-purple-700' }
        ]
      default:
        return []
    }
  }

  const bulkActions = getBulkActions()

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-500" />
              {t('attendance.bulkOperations')}
            </CardTitle>
            <CardDescription>
              {t('attendance.bulkOperationsDescription')}
            </CardDescription>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={importData}>
              <Upload className="h-4 w-4 mr-1" />
              {t('common.import')}
            </Button>
            <Button variant="outline" size="sm" onClick={scheduleOperation}>
              <Calendar className="h-4 w-4 mr-1" />
              {t('attendance.schedule')}
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-1" />
              {t('common.settings')}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Operation Type Selection */}
        <div className="grid grid-cols-3 gap-2">
          {operationTypes.map((operation) => {
            const Icon = operation.icon
            return (
              <Button
                key={operation.id}
                variant={selectedOperation === operation.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedOperation(operation.id)}
                className="flex items-center gap-2 h-auto py-2 px-3"
              >
                <Icon className="h-4 w-4" />
                <span className="text-xs">{operation.name}</span>
              </Button>
            )
          })}
        </div>

        {/* Filters */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <select 
              value={filterClass}
              onChange={(e) => setFilterClass(e.target.value)}
              className="border rounded px-2 py-1 text-sm"
            >
              {classes.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.name}
                </option>
              ))}
            </select>
            
            <select 
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="border rounded px-2 py-1 text-sm"
            >
              <option value="today">{t('calendar.today')}</option>
              <option value="this_week">{t('calendar.thisWeek')}</option>
              <option value="this_month">{t('calendar.thisMonth')}</option>
            </select>
          </div>

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
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-4 gap-3 p-3 bg-accent/30 rounded-lg">
          <div className="text-center">
            <div className="text-lg font-bold text-blue-600">{filteredData.length}</div>
            <div className="text-xs text-muted-foreground">{t('common.totalItems')}</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-green-600">{selectedItems.length}</div>
            <div className="text-xs text-muted-foreground">{t('common.selected')}</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-yellow-600">
              {filteredData.filter(item => item.priority === 'high').length}
            </div>
            <div className="text-xs text-muted-foreground">{t('attendance.highPriority')}</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-purple-600">
              {filteredData.filter(item => item.status === 'pending' || item.status === 'not_started').length}
            </div>
            <div className="text-xs text-muted-foreground">{t('attendance.pending')}</div>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedItems.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-blue-800 font-medium">
                {selectedItems.length} {t('common.selected')}
              </span>
              <Button variant="ghost" size="sm" onClick={() => setSelectedItems([])}>
                {t('common.clearSelection')}
              </Button>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {bulkActions.map((action) => {
                const Icon = action.icon
                return (
                  <Button
                    key={action.id}
                    size="sm"
                    variant="outline"
                    onClick={() => executeBulkAction(action.id)}
                    className={`${action.color} hover:bg-white/50`}
                  >
                    <Icon className="h-4 w-4 mr-1" />
                    {action.label}
                  </Button>
                )
              })}
            </div>
          </div>
        )}

        {/* Items List */}
        <div className="space-y-2">
          {/* Header */}
          <div className="flex items-center justify-between p-2 bg-muted/30 rounded-lg text-sm font-medium">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={selectedItems.length === filteredData.length && filteredData.length > 0}
                onChange={handleSelectAll}
                className="rounded"
              />
              <span>{selectedOperation === 'mark_attendance' ? t('attendance.sessions') : t('common.items')}</span>
            </div>
            <div className="flex items-center gap-8 text-xs text-muted-foreground">
              <span>{t('common.status')}</span>
              <span>{t('common.priority')}</span>
              <span>{t('common.actions')}</span>
            </div>
          </div>

          {filteredData.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="h-8 w-8 mx-auto mb-2" />
              <p>{t('attendance.noItemsFound')}</p>
            </div>
          ) : (
            filteredData.map((item) => {
              const statusConfig = getStatusConfig(item.status)
              const StatusIcon = statusConfig.icon

              return (
                <div
                  key={item.id}
                  className={`p-4 border rounded-lg transition-all ${
                    selectedItems.includes(item.id) 
                      ? 'bg-blue-50 border-blue-200 shadow-sm' 
                      : 'bg-card border-border hover:bg-accent/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item.id)}
                      onChange={() => handleSelectItem(item.id)}
                      className="rounded"
                    />
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <div className="font-medium text-sm">{item.title}</div>
                        <div className="flex items-center gap-2">
                          <Badge className={getPriorityColor(item.priority)}>
                            {t(`attendance.${item.priority}Priority`)}
                          </Badge>
                          <Badge className={statusConfig.color}>
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {t(`attendance.${item.status}`)}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="text-sm text-muted-foreground mb-2">
                        {item.subtitle}
                      </div>
                      
                      {/* Operation-specific details */}
                      {selectedOperation === 'mark_attendance' && item.students_total && (
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>{t('teacher.teacher')}: {item.teacher}</span>
                          <span>
                            {t('attendance.progress')}: {item.students_marked}/{item.students_total}
                          </span>
                          <span>{t('calendar.date')}: {item.date}</span>
                        </div>
                      )}
                      
                      {selectedOperation === 'manage_flags' && item.deadline && (
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>{t('student.class')}: {item.student_class}</span>
                          <span>
                            {t('attendance.deadline')}: {new Date(item.deadline).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                      
                      {selectedOperation === 'send_notifications' && item.recipients && (
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>{t('notifications.recipients')}: {item.recipients}</span>
                          <span>{t('notifications.method')}: {t(`notifications.${item.method}`)}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
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
            onClick={() => console.log('Quick mark all present')}
            disabled={selectedOperation !== 'mark_attendance'}
          >
            <CheckCircle className="h-4 w-4 mr-1" />
            {t('attendance.quickMarkPresent')}
          </Button>
          <Button
            variant="outline"
            onClick={() => console.log('Auto-create sessions')}
            disabled={selectedOperation !== 'create_sessions'}
          >
            <Zap className="h-4 w-4 mr-1" />
            {t('attendance.autoCreateSessions')}
          </Button>
          <Button
            variant="outline"
            onClick={exportSelected}
            disabled={selectedItems.length === 0}
          >
            <Download className="h-4 w-4 mr-1" />
            {t('common.exportSelected')}
          </Button>
          <Button
            variant="outline"
            onClick={() => console.log('Save as template')}
          >
            <Save className="h-4 w-4 mr-1" />
            {t('attendance.saveAsTemplate')}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default BulkAttendanceOperations