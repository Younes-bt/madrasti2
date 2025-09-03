import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { useLanguage } from '../../hooks/useLanguage'
import { 
  Play,
  Pause,
  CheckCircle,
  Clock,
  Users,
  AlertTriangle,
  MapPin,
  BookOpen,
  User,
  Calendar,
  Timer,
  Save,
  RotateCcw,
  Flag,
  MessageSquare,
  Eye,
  Activity,
  TrendingUp,
  Zap
} from 'lucide-react'

const SessionWorkflow = () => {
  const { t } = useLanguage()
  const [activeSession, setActiveSession] = useState(null)
  const [sessionList, setSessionList] = useState([
    {
      id: 207,
      subject: 'Mathematics',
      teacher: 'Mr. Alami',
      class: '1ère Année C',
      room: 'Salle 101',
      scheduled_time: '11:00 - 12:00',
      date: '2024-09-02',
      status: 'not_started', // not_started, in_progress, completed, cancelled
      students_total: 24,
      students_present: 0,
      students_absent: 0,
      students_late: 0,
      created_at: '2024-09-02T10:55:00Z',
      started_at: null,
      completed_at: null,
      duration_minutes: null,
      flags_created: 0,
      notes: ''
    },
    {
      id: 206,
      subject: 'Physics',
      teacher: 'Mrs. Bennani',
      class: '1ère Année C',
      room: 'Lab 1',
      scheduled_time: '09:00 - 10:00',
      date: '2024-09-02',
      status: 'in_progress',
      students_total: 24,
      students_present: 18,
      students_absent: 4,
      students_late: 2,
      created_at: '2024-09-02T08:55:00Z',
      started_at: '2024-09-02T09:05:00Z',
      completed_at: null,
      duration_minutes: 55,
      flags_created: 2,
      notes: 'Lab session - equipment setup delayed start'
    },
    {
      id: 205,
      subject: 'Arabic',
      teacher: 'Mr. Tazi',
      class: '1ère Année C', 
      room: 'Salle 203',
      scheduled_time: '08:00 - 09:00',
      date: '2024-09-02',
      status: 'completed',
      students_total: 24,
      students_present: 22,
      students_absent: 2,
      students_late: 0,
      created_at: '2024-09-02T07:55:00Z',
      started_at: '2024-09-02T08:00:00Z',
      completed_at: '2024-09-02T08:58:00Z',
      duration_minutes: 58,
      flags_created: 1,
      notes: 'Good participation from students'
    }
  ])

  const getStatusConfig = (status) => {
    const configs = {
      not_started: {
        color: 'bg-gray-100 text-gray-800',
        icon: Clock,
        iconColor: 'text-gray-600'
      },
      in_progress: {
        color: 'bg-blue-100 text-blue-800',
        icon: Activity,
        iconColor: 'text-blue-600'
      },
      completed: {
        color: 'bg-green-100 text-green-800',
        icon: CheckCircle,
        iconColor: 'text-green-600'
      },
      cancelled: {
        color: 'bg-red-100 text-red-800',
        icon: AlertTriangle,
        iconColor: 'text-red-600'
      }
    }
    return configs[status] || configs.not_started
  }

  const startSession = (sessionId) => {
    setSessionList(prev => prev.map(session => 
      session.id === sessionId 
        ? { 
            ...session, 
            status: 'in_progress',
            started_at: new Date().toISOString()
          }
        : session
    ))
    setActiveSession(sessionId)
    console.log('Session started:', sessionId)
  }

  const pauseSession = (sessionId) => {
    setSessionList(prev => prev.map(session => 
      session.id === sessionId 
        ? { 
            ...session, 
            status: 'not_started' // Paused sessions revert to not_started
          }
        : session
    ))
    console.log('Session paused:', sessionId)
  }

  const completeSession = (sessionId) => {
    setSessionList(prev => prev.map(session => 
      session.id === sessionId 
        ? { 
            ...session, 
            status: 'completed',
            completed_at: new Date().toISOString(),
            duration_minutes: session.started_at 
              ? Math.round((new Date() - new Date(session.started_at)) / (1000 * 60))
              : 60
          }
        : session
    ))
    setActiveSession(null)
    console.log('Session completed:', sessionId)
  }

  const cancelSession = (sessionId) => {
    setSessionList(prev => prev.map(session => 
      session.id === sessionId 
        ? { 
            ...session, 
            status: 'cancelled'
          }
        : session
    ))
    console.log('Session cancelled:', sessionId)
  }

  const addSessionNotes = (sessionId, notes) => {
    setSessionList(prev => prev.map(session => 
      session.id === sessionId 
        ? { ...session, notes }
        : session
    ))
  }

  const getSessionProgress = (session) => {
    const totalStudents = session.students_total
    const markedStudents = session.students_present + session.students_absent + session.students_late
    return totalStudents > 0 ? Math.round((markedStudents / totalStudents) * 100) : 0
  }

  const getAttendanceRate = (session) => {
    const totalMarked = session.students_present + session.students_absent + session.students_late
    return totalMarked > 0 ? Math.round((session.students_present / totalMarked) * 100) : 0
  }

  const formatDuration = (minutes) => {
    if (!minutes) return '0m'
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
  }

  const upcomingSessions = sessionList.filter(s => s.status === 'not_started')
  const activeSessions = sessionList.filter(s => s.status === 'in_progress')
  const completedSessions = sessionList.filter(s => s.status === 'completed')

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-500" />
              {t('attendance.sessionWorkflow')}
            </CardTitle>
            <CardDescription>
              {t('attendance.sessionWorkflowDescription')}
            </CardDescription>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Eye className="h-4 w-4 mr-1" />
              {t('attendance.viewAll')}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Session Stats */}
        <div className="grid grid-cols-4 gap-3 p-3 bg-accent/30 rounded-lg">
          <div className="text-center">
            <div className="text-lg font-bold text-gray-600">{upcomingSessions.length}</div>
            <div className="text-xs text-muted-foreground">{t('attendance.upcoming')}</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-blue-600">{activeSessions.length}</div>
            <div className="text-xs text-muted-foreground">{t('attendance.active')}</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-green-600">{completedSessions.length}</div>
            <div className="text-xs text-muted-foreground">{t('attendance.completed')}</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-orange-600">
              {sessionList.reduce((sum, s) => sum + s.flags_created, 0)}
            </div>
            <div className="text-xs text-muted-foreground">{t('attendance.flagsCreated')}</div>
          </div>
        </div>

        {/* Active Session Alert */}
        {activeSessions.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg">
            <div className="flex items-center gap-2 text-blue-800">
              <Zap className="h-4 w-4" />
              <span className="font-medium">
                {activeSessions.length} {t('attendance.activeSession')}
              </span>
            </div>
          </div>
        )}

        {/* Sessions List */}
        <div className="space-y-3">
          {sessionList.slice(0, 6).map((session) => {
            const statusConfig = getStatusConfig(session.status)
            const StatusIcon = statusConfig.icon
            const progress = getSessionProgress(session)
            const attendanceRate = getAttendanceRate(session)

            return (
              <div
                key={session.id}
                className={`p-4 border rounded-lg transition-all ${
                  session.status === 'in_progress' 
                    ? 'bg-blue-50 border-blue-200 shadow-sm' 
                    : 'bg-card border-border'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0">
                      <StatusIcon className={`h-5 w-5 ${statusConfig.iconColor}`} />
                    </div>
                    <div>
                      <div className="font-medium text-sm">
                        {session.subject} - {session.class}
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {session.scheduled_time}
                        </span>
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {session.teacher}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {session.room}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge className={statusConfig.color}>
                      {t(`attendance.${session.status}`)}
                    </Badge>
                    {session.duration_minutes && (
                      <Badge variant="outline" className="text-xs">
                        <Timer className="h-3 w-3 mr-1" />
                        {formatDuration(session.duration_minutes)}
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Progress Information */}
                <div className="grid grid-cols-3 gap-4 mb-3 text-sm">
                  <div>
                    <div className="text-xs text-muted-foreground">{t('attendance.progress')}</div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full transition-all"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                      <span className="text-xs font-medium">{progress}%</span>
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-xs text-muted-foreground">{t('attendance.attendance')}</div>
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3 text-green-600" />
                      <span className="text-green-600 font-medium">{session.students_present}</span>
                      <span className="text-muted-foreground">/</span>
                      <span className="text-red-600 font-medium">{session.students_absent}</span>
                      <span className="text-muted-foreground">/</span>
                      <span className="text-yellow-600 font-medium">{session.students_late}</span>
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-xs text-muted-foreground">{t('attendance.rate')}</div>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-3 w-3 text-blue-600" />
                      <span className="font-medium">{attendanceRate}%</span>
                    </div>
                  </div>
                </div>

                {/* Session Notes */}
                {session.notes && (
                  <div className="bg-yellow-50 border border-yellow-200 p-2 rounded text-xs mb-3">
                    <div className="flex items-center gap-1 text-yellow-800">
                      <MessageSquare className="h-3 w-3" />
                      <span>{session.notes}</span>
                    </div>
                  </div>
                )}

                {/* Flags Alert */}
                {session.flags_created > 0 && (
                  <div className="flex items-center gap-1 text-red-600 text-xs mb-3">
                    <Flag className="h-3 w-3" />
                    <span>{session.flags_created} {t('attendance.flagsCreated')}</span>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex items-center gap-2">
                  {session.status === 'not_started' && (
                    <>
                      <Button
                        size="sm"
                        onClick={() => startSession(session.id)}
                      >
                        <Play className="h-4 w-4 mr-1" />
                        {t('attendance.startSession')}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => cancelSession(session.id)}
                      >
                        {t('common.cancel')}
                      </Button>
                    </>
                  )}
                  
                  {session.status === 'in_progress' && (
                    <>
                      <Button
                        size="sm"
                        onClick={() => completeSession(session.id)}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        {t('attendance.completeSession')}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => pauseSession(session.id)}
                      >
                        <Pause className="h-4 w-4 mr-1" />
                        {t('attendance.pauseSession')}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => console.log('Take attendance:', session.id)}
                      >
                        <Users className="h-4 w-4 mr-1" />
                        {t('attendance.takeAttendance')}
                      </Button>
                    </>
                  )}
                  
                  {session.status === 'completed' && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => console.log('View details:', session.id)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        {t('common.view')}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => console.log('Add notes:', session.id)}
                      >
                        <MessageSquare className="h-4 w-4 mr-1" />
                        {t('attendance.addNotes')}
                      </Button>
                    </>
                  )}
                  
                  {session.status === 'cancelled' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => console.log('Reschedule:', session.id)}
                    >
                      <RotateCcw className="h-4 w-4 mr-1" />
                      {t('attendance.reschedule')}
                    </Button>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* Quick Actions */}
        <div className="flex gap-2 pt-4 border-t">
          <Button
            variant="outline"
            onClick={() => console.log('Create new session')}
          >
            <Play className="h-4 w-4 mr-1" />
            {t('attendance.createSession')}
          </Button>
          <Button
            variant="outline"
            onClick={() => console.log('Bulk session operations')}
          >
            <Users className="h-4 w-4 mr-1" />
            {t('attendance.bulkOperations')}
          </Button>
          <Button
            variant="outline"
            onClick={() => console.log('Session reports')}
          >
            <Calendar className="h-4 w-4 mr-1" />
            {t('attendance.sessionReports')}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default SessionWorkflow