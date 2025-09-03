import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { useLanguage } from '../../hooks/useLanguage'
import { 
  Flag,
  AlertTriangle,
  User,
  Calendar,
  Clock,
  MessageSquare,
  Bell,
  CheckCircle,
  XCircle,
  Eye,
  Edit,
  Send,
  Filter,
  Search,
  FileText,
  Users,
  TrendingUp,
  AlertCircle,
  Mail,
  Phone,
  History
} from 'lucide-react'

const AbsenceFlagSystem = () => {
  const { t } = useLanguage()
  const [selectedTab, setSelectedTab] = useState('pending') // pending, under_review, cleared, all
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedFlag, setSelectedFlag] = useState(null)
  const [filterSeverity, setFilterSeverity] = useState('all') // all, low, medium, high

  const absenceFlags = [
    {
      id: 1,
      student_id: 101,
      student_name: 'Ahmed Hassan',
      student_class: '1ère Année C',
      student_avatar: null,
      session_id: 207,
      subject: 'Mathematics',
      teacher: 'Mr. Alami',
      date: '2024-09-02',
      time: '11:00 - 12:00',
      absence_type: 'full_absence', // full_absence, late_arrival, early_departure
      reason: 'Unjustified absence',
      severity: 'medium', // low, medium, high
      status: 'pending_clearance', // pending_clearance, under_review, cleared, rejected
      points_deducted: 5,
      created_at: '2024-09-02T11:30:00Z',
      deadline: '2024-09-05T23:59:59Z',
      auto_generated: true,
      parent_notified: true,
      parent_response: null,
      teacher_notes: 'Student did not attend without prior notification',
      admin_notes: null
    },
    {
      id: 2,
      student_id: 102,
      student_name: 'Fatima Al-Zahra',
      student_class: '1ère Année C',
      student_avatar: null,
      session_id: 205,
      subject: 'Physics Lab',
      teacher: 'Mrs. Bennani',
      date: '2024-08-30',
      time: '09:00 - 11:00',
      absence_type: 'late_arrival',
      reason: 'Late arrival (>15 minutes)',
      severity: 'low',
      status: 'under_review',
      points_deducted: 2,
      created_at: '2024-08-30T09:20:00Z',
      deadline: '2024-09-02T23:59:59Z',
      auto_generated: true,
      parent_notified: true,
      parent_response: {
        submitted_at: '2024-08-30T16:00:00Z',
        justification: 'Medical appointment with pediatrician',
        documents: ['medical_certificate.pdf']
      },
      teacher_notes: 'Student arrived 20 minutes late, missed lab setup',
      admin_notes: 'Parent provided medical documentation - reviewing validity'
    },
    {
      id: 3,
      student_id: 103,
      student_name: 'Omar Benali',
      student_class: '2ème Année A',
      student_avatar: null,
      session_id: 198,
      subject: 'Chemistry',
      teacher: 'Dr. Alaoui',
      date: '2024-08-28',
      time: '14:30 - 15:30',
      absence_type: 'full_absence',
      reason: 'Absent without notification',
      severity: 'high',
      status: 'cleared',
      points_deducted: 0, // Points restored after clearance
      created_at: '2024-08-28T14:35:00Z',
      deadline: '2024-08-31T23:59:59Z',
      cleared_at: '2024-08-29T10:15:00Z',
      auto_generated: true,
      parent_notified: true,
      parent_response: {
        submitted_at: '2024-08-28T18:30:00Z',
        justification: 'Family emergency - grandmother hospitalized',
        documents: ['hospital_admission.pdf', 'family_statement.pdf']
      },
      teacher_notes: 'Complete absence from important lab session',
      admin_notes: 'Valid family emergency. Documentation verified. Points restored.',
      clearance_reason: 'Family emergency verified with hospital documentation'
    },
    {
      id: 4,
      student_id: 104,
      student_name: 'Aisha Mansour',
      student_class: '3ème Année C',
      student_avatar: null,
      session_id: 189,
      subject: 'Arabic Literature',
      teacher: 'Mrs. Alaoui',
      date: '2024-09-01',
      time: '08:00 - 09:00',
      absence_type: 'early_departure',
      reason: 'Left class early without permission',
      severity: 'medium',
      status: 'pending_clearance',
      points_deducted: 3,
      created_at: '2024-09-01T08:45:00Z',
      deadline: '2024-09-04T23:59:59Z',
      auto_generated: false, // Manually created by teacher
      parent_notified: true,
      parent_response: null,
      teacher_notes: 'Student left 15 minutes before class ended, claimed illness',
      admin_notes: null
    }
  ]

  const getSeverityConfig = (severity) => {
    const configs = {
      low: {
        color: 'bg-blue-100 text-blue-800 border-blue-200',
        icon: AlertCircle,
        points: '1-3'
      },
      medium: {
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        icon: AlertTriangle,
        points: '4-7'
      },
      high: {
        color: 'bg-red-100 text-red-800 border-red-200',
        icon: Flag,
        points: '8-15'
      }
    }
    return configs[severity] || configs.medium
  }

  const getStatusConfig = (status) => {
    const configs = {
      pending_clearance: {
        color: 'bg-red-100 text-red-800',
        icon: AlertTriangle,
        label: t('attendance.pendingClearance')
      },
      under_review: {
        color: 'bg-yellow-100 text-yellow-800',
        icon: Eye,
        label: t('attendance.underReview')
      },
      cleared: {
        color: 'bg-green-100 text-green-800',
        icon: CheckCircle,
        label: t('attendance.cleared')
      },
      rejected: {
        color: 'bg-gray-100 text-gray-800',
        icon: XCircle,
        label: t('attendance.rejected')
      }
    }
    return configs[status] || configs.pending_clearance
  }

  const getAbsenceTypeLabel = (type) => {
    const labels = {
      full_absence: t('attendance.fullAbsence'),
      late_arrival: t('attendance.lateArrival'),
      early_departure: t('attendance.earlyDeparture')
    }
    return labels[type] || type
  }

  const filteredFlags = absenceFlags.filter(flag => {
    const matchesTab = selectedTab === 'all' || flag.status === selectedTab
    const matchesSearch = flag.student_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         flag.subject.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesSeverity = filterSeverity === 'all' || flag.severity === filterSeverity
    
    return matchesTab && matchesSearch && matchesSeverity
  })

  const flagCounts = {
    pending: absenceFlags.filter(f => f.status === 'pending_clearance').length,
    under_review: absenceFlags.filter(f => f.status === 'under_review').length,
    cleared: absenceFlags.filter(f => f.status === 'cleared').length,
    all: absenceFlags.length
  }

  const createFlag = (studentId, sessionId, reason) => {
    console.log('Create flag:', { studentId, sessionId, reason })
    // API call to create absence flag
  }

  const updateFlagStatus = (flagId, status, notes) => {
    console.log('Update flag status:', { flagId, status, notes })
    // API call to update flag status
  }

  const notifyParent = (flagId, method = 'email') => {
    console.log('Notify parent:', flagId, method)
    // API call to send notification
  }

  const exportFlags = () => {
    console.log('Export flags report')
    // Export filtered flags to Excel/PDF
  }

  const isDeadlineNear = (deadline) => {
    const now = new Date()
    const deadlineDate = new Date(deadline)
    const hoursUntilDeadline = (deadlineDate - now) / (1000 * 60 * 60)
    return hoursUntilDeadline <= 24 && hoursUntilDeadline > 0
  }

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Flag className="h-5 w-5 text-red-500" />
              {t('attendance.absenceFlagSystem')}
            </CardTitle>
            <CardDescription>
              {t('attendance.absenceFlagDescription')}
            </CardDescription>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={exportFlags}>
              <FileText className="h-4 w-4 mr-1" />
              {t('common.export')}
            </Button>
            <Button size="sm" onClick={() => console.log('Create manual flag')}>
              <Flag className="h-4 w-4 mr-1" />
              {t('attendance.createFlag')}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Summary Stats */}
        <div className="grid grid-cols-4 gap-3 p-3 bg-accent/30 rounded-lg">
          <div className="text-center">
            <div className="text-lg font-bold text-red-600">{flagCounts.pending}</div>
            <div className="text-xs text-muted-foreground">{t('attendance.pending')}</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-yellow-600">{flagCounts.under_review}</div>
            <div className="text-xs text-muted-foreground">{t('attendance.underReview')}</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-green-600">{flagCounts.cleared}</div>
            <div className="text-xs text-muted-foreground">{t('attendance.cleared')}</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-blue-600">
              {absenceFlags.reduce((sum, f) => sum + (f.status !== 'cleared' ? f.points_deducted : 0), 0)}
            </div>
            <div className="text-xs text-muted-foreground">{t('attendance.totalPointsDeducted')}</div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="flex items-center justify-between gap-4">
          {/* Status Tabs */}
          <div className="flex gap-1">
            {[
              { key: 'pending', label: t('attendance.pending'), count: flagCounts.pending },
              { key: 'under_review', label: t('attendance.reviewing'), count: flagCounts.under_review },
              { key: 'cleared', label: t('attendance.cleared'), count: flagCounts.cleared },
              { key: 'all', label: t('common.all'), count: flagCounts.all }
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
              value={filterSeverity}
              onChange={(e) => setFilterSeverity(e.target.value)}
              className="border rounded px-2 py-1 text-sm"
            >
              <option value="all">{t('attendance.allSeverities')}</option>
              <option value="low">{t('attendance.lowSeverity')}</option>
              <option value="medium">{t('attendance.mediumSeverity')}</option>
              <option value="high">{t('attendance.highSeverity')}</option>
            </select>
          </div>
        </div>

        {/* Flags List */}
        <div className="space-y-3">
          {filteredFlags.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Flag className="h-8 w-8 mx-auto mb-2" />
              <p>{t('attendance.noFlags')}</p>
            </div>
          ) : (
            filteredFlags.map((flag) => {
              const severityConfig = getSeverityConfig(flag.severity)
              const statusConfig = getStatusConfig(flag.status)
              const SeverityIcon = severityConfig.icon
              const StatusIcon = statusConfig.icon

              return (
                <div
                  key={flag.id}
                  className={`p-4 border rounded-lg transition-all ${
                    flag.status === 'pending_clearance' && isDeadlineNear(flag.deadline)
                      ? 'bg-red-50 border-red-200 shadow-sm'
                      : flag.status === 'pending_clearance'
                      ? 'bg-yellow-50 border-yellow-200'
                      : 'bg-card border-border'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={flag.student_avatar} />
                        <AvatarFallback className="text-xs">
                          {flag.student_name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div>
                        <div className="font-medium text-sm">
                          {flag.student_name}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {flag.student_class} • {flag.subject}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                          <Calendar className="h-3 w-3" />
                          <span>{flag.date} {flag.time}</span>
                          <span>•</span>
                          <User className="h-3 w-3" />
                          <span>{flag.teacher}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Badge className={severityConfig.color}>
                        <SeverityIcon className="h-3 w-3 mr-1" />
                        {t(`attendance.${flag.severity}Severity`)}
                      </Badge>
                      <Badge className={statusConfig.color}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {statusConfig.label}
                      </Badge>
                    </div>
                  </div>

                  {/* Flag Details */}
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="font-medium">{t('attendance.absenceType')}: </span>
                      <span>{getAbsenceTypeLabel(flag.absence_type)}</span>
                    </div>
                    
                    <div>
                      <span className="font-medium">{t('attendance.reason')}: </span>
                      <span>{flag.reason}</span>
                    </div>

                    {flag.points_deducted > 0 && flag.status !== 'cleared' && (
                      <div className="text-red-600">
                        <span className="font-medium">{t('attendance.pointsDeducted')}: </span>
                        <span>-{flag.points_deducted} {t('gamification.points')}</span>
                      </div>
                    )}

                    {flag.status === 'pending_clearance' && (
                      <div className="flex items-center gap-1 text-orange-600">
                        <Clock className="h-3 w-3" />
                        <span className="font-medium">{t('attendance.deadline')}: </span>
                        <span>{formatDateTime(flag.deadline)}</span>
                        {isDeadlineNear(flag.deadline) && (
                          <Badge className="bg-red-100 text-red-800 ml-2">
                            {t('attendance.urgent')}
                          </Badge>
                        )}
                      </div>
                    )}

                    {flag.teacher_notes && (
                      <div className="bg-blue-50 border border-blue-200 p-2 rounded">
                        <div className="font-medium text-xs text-blue-800 mb-1">
                          {t('attendance.teacherNotes')}:
                        </div>
                        <div className="text-blue-700">{flag.teacher_notes}</div>
                      </div>
                    )}

                    {flag.parent_response && (
                      <div className="bg-green-50 border border-green-200 p-2 rounded">
                        <div className="font-medium text-xs text-green-800 mb-1">
                          {t('attendance.parentResponse')} ({formatDateTime(flag.parent_response.submitted_at)}):
                        </div>
                        <div className="text-green-700">{flag.parent_response.justification}</div>
                        {flag.parent_response.documents && (
                          <div className="flex items-center gap-1 text-green-600 text-xs mt-1">
                            <FileText className="h-3 w-3" />
                            <span>{flag.parent_response.documents.length} {t('attendance.documents')}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {flag.admin_notes && (
                      <div className="bg-purple-50 border border-purple-200 p-2 rounded">
                        <div className="font-medium text-xs text-purple-800 mb-1">
                          {t('attendance.adminNotes')}:
                        </div>
                        <div className="text-purple-700">{flag.admin_notes}</div>
                      </div>
                    )}

                    {flag.clearance_reason && (
                      <div className="bg-green-50 border border-green-200 p-2 rounded">
                        <div className="font-medium text-xs text-green-800 mb-1">
                          {t('attendance.clearanceReason')}:
                        </div>
                        <div className="text-green-700">{flag.clearance_reason}</div>
                      </div>
                    )}
                  </div>

                  {/* Flag Status Indicators */}
                  <div className="flex items-center gap-4 text-xs text-muted-foreground mt-3 pt-3 border-t">
                    <div className="flex items-center gap-1">
                      {flag.auto_generated ? (
                        <>
                          <TrendingUp className="h-3 w-3" />
                          <span>{t('attendance.autoGenerated')}</span>
                        </>
                      ) : (
                        <>
                          <User className="h-3 w-3" />
                          <span>{t('attendance.manuallyCreated')}</span>
                        </>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-1">
                      {flag.parent_notified ? (
                        <>
                          <CheckCircle className="h-3 w-3 text-green-600" />
                          <span className="text-green-600">{t('attendance.parentNotified')}</span>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="h-3 w-3 text-red-600" />
                          <span className="text-red-600">{t('attendance.parentNotNotified')}</span>
                        </>
                      )}
                    </div>
                    
                    <div className="text-muted-foreground">
                      {t('attendance.created')}: {formatDateTime(flag.created_at)}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 mt-3">
                    {flag.status === 'pending_clearance' && (
                      <>
                        {!flag.parent_notified && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => notifyParent(flag.id, 'email')}
                          >
                            <Mail className="h-4 w-4 mr-1" />
                            {t('attendance.notifyParent')}
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => console.log('Extend deadline:', flag.id)}
                        >
                          <Clock className="h-4 w-4 mr-1" />
                          {t('attendance.extendDeadline')}
                        </Button>
                      </>
                    )}
                    
                    {flag.status === 'under_review' && (
                      <>
                        <Button
                          size="sm"
                          onClick={() => updateFlagStatus(flag.id, 'cleared', 'Approved by admin')}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          {t('attendance.approve')}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateFlagStatus(flag.id, 'rejected', 'Insufficient evidence')}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          {t('attendance.reject')}
                        </Button>
                      </>
                    )}
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedFlag(selectedFlag === flag.id ? null : flag.id)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      {t('common.details')}
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => console.log('Edit flag:', flag.id)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      {t('common.edit')}
                    </Button>
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* Bulk Actions */}
        {filteredFlags.length > 0 && (
          <div className="flex gap-2 pt-4 border-t">
            <Button
              variant="outline"
              onClick={() => console.log('Bulk notify parents')}
            >
              <Bell className="h-4 w-4 mr-1" />
              {t('attendance.bulkNotifyParents')}
            </Button>
            <Button
              variant="outline"
              onClick={() => console.log('Bulk extend deadlines')}
            >
              <Clock className="h-4 w-4 mr-1" />
              {t('attendance.bulkExtendDeadlines')}
            </Button>
            <Button
              variant="outline"
              onClick={() => console.log('Flag analytics')}
            >
              <TrendingUp className="h-4 w-4 mr-1" />
              {t('attendance.flagAnalytics')}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default AbsenceFlagSystem