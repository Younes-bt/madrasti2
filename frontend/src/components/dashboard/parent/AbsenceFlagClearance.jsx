import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card'
import { Badge } from '../../ui/badge'
import { Button } from '../../ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar'
import { useLanguage } from '../../../hooks/useLanguage'
import { 
  Flag,
  AlertTriangle,
  CheckCircle,
  Clock,
  Upload,
  FileText,
  Calendar,
  User,
  MessageSquare,
  Eye,
  X,
  Send,
  Paperclip
} from 'lucide-react'

const AbsenceFlagClearance = () => {
  const { t } = useLanguage()
  const [selectedChild, setSelectedChild] = useState('child1')
  const [selectedFlag, setSelectedFlag] = useState(null)
  const [justificationText, setJustificationText] = useState('')
  const [uploadedFile, setUploadedFile] = useState(null)

  const children = [
    { id: 'child1', name: 'Ahmed Hassan', class: '1ère C', avatar: null },
    { id: 'child2', name: 'Fatima Hassan', class: '3ème A', avatar: null }
  ]

  const absenceFlags = {
    child1: [
      {
        id: 1,
        date: '2024-09-02',
        session: 'Mathematics - Period 2',
        teacher: 'Mr. Alami',
        reason: 'Unjustified absence',
        status: 'pending_clearance',
        created_at: '2024-09-02T11:30:00Z',
        deadline: '2024-09-05T23:59:59Z',
        severity: 'medium',
        points_deducted: 5,
        justification_submitted: false
      },
      {
        id: 2,
        date: '2024-08-30',
        session: 'Physics - Lab Session',
        teacher: 'Mrs. Bennani', 
        reason: 'Late arrival (>15 minutes)',
        status: 'under_review',
        created_at: '2024-08-30T14:45:00Z',
        deadline: '2024-09-02T23:59:59Z',
        severity: 'low',
        points_deducted: 2,
        justification_submitted: true,
        justification: 'Medical appointment confirmed by doctor note',
        documents: ['medical_certificate.pdf']
      },
      {
        id: 3,
        date: '2024-08-28',
        session: 'Chemistry - Period 1', 
        teacher: 'Mr. Tazi',
        reason: 'Absent without notification',
        status: 'cleared',
        created_at: '2024-08-28T09:00:00Z',
        cleared_at: '2024-08-29T16:20:00Z',
        severity: 'high',
        points_deducted: 0, // restored after clearance
        justification_submitted: true,
        justification: 'Family emergency - grandmother hospitalized',
        clearance_reason: 'Valid family emergency with documentation'
      }
    ],
    child2: [
      {
        id: 4,
        date: '2024-09-01',
        session: 'Arabic Literature - Period 3',
        teacher: 'Mrs. Alaoui',
        reason: 'Partial absence (left early)',
        status: 'pending_clearance', 
        created_at: '2024-09-01T15:30:00Z',
        deadline: '2024-09-04T23:59:59Z',
        severity: 'low',
        points_deducted: 3,
        justification_submitted: false
      }
    ]
  }

  const getStatusBadge = (status) => {
    const styles = {
      pending_clearance: 'bg-red-100 text-red-800',
      under_review: 'bg-yellow-100 text-yellow-800',
      cleared: 'bg-green-100 text-green-800',
      rejected: 'bg-gray-100 text-gray-800'
    }
    
    return (
      <Badge className={styles[status] || styles.pending_clearance}>
        {t(`attendance.${status}`)}
      </Badge>
    )
  }

  const getSeverityBadge = (severity) => {
    const styles = {
      low: 'bg-blue-100 text-blue-800',
      medium: 'bg-yellow-100 text-yellow-800', 
      high: 'bg-red-100 text-red-800'
    }
    
    return (
      <Badge variant="outline" className={styles[severity]}>
        {t(`attendance.severity_${severity}`)}
      </Badge>
    )
  }

  const getStatusIcon = (status) => {
    switch(status) {
      case 'pending_clearance': return <AlertTriangle className="h-4 w-4 text-red-600" />
      case 'under_review': return <Clock className="h-4 w-4 text-yellow-600" />
      case 'cleared': return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'rejected': return <X className="h-4 w-4 text-gray-600" />
      default: return <Flag className="h-4 w-4 text-gray-600" />
    }
  }

  const handleSubmitJustification = (flagId) => {
    if (!justificationText.trim()) return

    console.log('Submit justification for flag:', flagId, {
      justification: justificationText,
      document: uploadedFile
    })
    
    // API call to submit justification
    setJustificationText('')
    setUploadedFile(null)
    setSelectedFlag(null)
  }

  const handleFileUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      setUploadedFile(file)
    }
  }

  const currentFlags = absenceFlags[selectedChild] || []
  const pendingFlags = currentFlags.filter(f => f.status === 'pending_clearance')
  const reviewFlags = currentFlags.filter(f => f.status === 'under_review')
  const clearedFlags = currentFlags.filter(f => f.status === 'cleared')

  const getTotalDeductedPoints = () => {
    return currentFlags
      .filter(f => f.status !== 'cleared')
      .reduce((sum, flag) => sum + flag.points_deducted, 0)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR')
  }

  const isDeadlineNear = (deadline) => {
    const now = new Date()
    const deadlineDate = new Date(deadline)
    const hoursUntilDeadline = (deadlineDate - now) / (1000 * 60 * 60)
    return hoursUntilDeadline <= 24 && hoursUntilDeadline > 0
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Flag className="h-5 w-5 text-red-500" />
              {t('parent.absenceFlagClearance')}
            </CardTitle>
            <CardDescription>
              {t('parent.absenceFlagDescription')}
            </CardDescription>
          </div>
          
          <div className="flex items-center gap-2">
            {getTotalDeductedPoints() > 0 && (
              <Badge variant="outline" className="text-red-700 border-red-300">
                -{getTotalDeductedPoints()} {t('gamification.points')}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Child Selector */}
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-muted-foreground" />
          <div className="flex gap-2">
            {children.map((child) => (
              <Button
                key={child.id}
                variant={selectedChild === child.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedChild(child.id)}
              >
                {child.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-4 gap-3 p-3 bg-accent/30 rounded-lg">
          <div className="text-center">
            <div className="text-lg font-bold text-red-600">{pendingFlags.length}</div>
            <div className="text-xs text-muted-foreground">{t('attendance.pending')}</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-yellow-600">{reviewFlags.length}</div>
            <div className="text-xs text-muted-foreground">{t('attendance.under_review')}</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-green-600">{clearedFlags.length}</div>
            <div className="text-xs text-muted-foreground">{t('attendance.cleared')}</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-red-600">{getTotalDeductedPoints()}</div>
            <div className="text-xs text-muted-foreground">{t('attendance.pointsLost')}</div>
          </div>
        </div>

        {/* Flags List */}
        <div className="space-y-3">
          {currentFlags.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Flag className="h-8 w-8 mx-auto mb-2" />
              <p>{t('attendance.noFlags')}</p>
            </div>
          ) : (
            currentFlags.map((flag) => (
              <div
                key={flag.id}
                className={`p-4 border rounded-lg transition-all ${
                  flag.status === 'pending_clearance' && isDeadlineNear(flag.deadline)
                    ? 'bg-red-50 border-red-200'
                    : flag.status === 'pending_clearance' 
                    ? 'bg-yellow-50 border-yellow-200'
                    : 'bg-card border-border'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(flag.status)}
                    <div>
                      <div className="font-medium text-sm">
                        {formatDate(flag.date)} - {flag.session}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {t('teacher.teacher')}: {flag.teacher}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {getSeverityBadge(flag.severity)}
                    {getStatusBadge(flag.status)}
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MessageSquare className="h-4 w-4" />
                    <span>{flag.reason}</span>
                  </div>

                  {flag.status === 'pending_clearance' && (
                    <div className="flex items-center gap-2 text-red-600">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {t('attendance.deadline')}: {formatDate(flag.deadline)}
                        {isDeadlineNear(flag.deadline) && (
                          <span className="ml-1 font-medium">({t('attendance.urgent')})</span>
                        )}
                      </span>
                    </div>
                  )}

                  {flag.points_deducted > 0 && flag.status !== 'cleared' && (
                    <div className="text-red-600">
                      -{flag.points_deducted} {t('gamification.points')} {t('attendance.deducted')}
                    </div>
                  )}

                  {flag.justification && (
                    <div className="bg-blue-50 p-2 rounded text-blue-800">
                      <div className="font-medium text-xs mb-1">{t('attendance.justification')}:</div>
                      <div>{flag.justification}</div>
                    </div>
                  )}

                  {flag.clearance_reason && (
                    <div className="bg-green-50 p-2 rounded text-green-800">
                      <div className="font-medium text-xs mb-1">{t('attendance.clearanceReason')}:</div>
                      <div>{flag.clearance_reason}</div>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 mt-3 pt-3 border-t">
                  {flag.status === 'pending_clearance' && (
                    <Button
                      size="sm"
                      onClick={() => setSelectedFlag(selectedFlag === flag.id ? null : flag.id)}
                    >
                      <MessageSquare className="h-4 w-4 mr-1" />
                      {t('attendance.provideJustification')}
                    </Button>
                  )}
                  
                  {flag.documents && (
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4 mr-1" />
                      {t('attendance.viewDocuments')}
                    </Button>
                  )}
                </div>

                {/* Justification Form */}
                {selectedFlag === flag.id && (
                  <div className="mt-4 p-3 bg-accent/50 rounded-lg space-y-3">
                    <div>
                      <label className="text-sm font-medium">{t('attendance.justification')}</label>
                      <textarea
                        value={justificationText}
                        onChange={(e) => setJustificationText(e.target.value)}
                        placeholder={t('attendance.justificationPlaceholder')}
                        className="w-full mt-1 p-2 border rounded-md text-sm resize-none"
                        rows={3}
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="file"
                        id="document-upload"
                        className="hidden"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={handleFileUpload}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => document.getElementById('document-upload').click()}
                      >
                        <Paperclip className="h-4 w-4 mr-1" />
                        {t('attendance.attachDocument')}
                      </Button>
                      {uploadedFile && (
                        <span className="text-xs text-green-600">
                          {uploadedFile.name}
                        </span>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleSubmitJustification(flag.id)}
                        disabled={!justificationText.trim()}
                      >
                        <Send className="h-4 w-4 mr-1" />
                        {t('attendance.submitJustification')}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedFlag(null)}
                      >
                        {t('common.cancel')}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Help Section */}
        {pendingFlags.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg">
            <h4 className="font-medium text-sm text-blue-800 mb-2">
              {t('attendance.helpTitle')}
            </h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• {t('attendance.helpTip1')}</li>
              <li>• {t('attendance.helpTip2')}</li>
              <li>• {t('attendance.helpTip3')}</li>
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default AbsenceFlagClearance