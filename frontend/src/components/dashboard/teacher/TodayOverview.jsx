import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card'
import { Badge } from '../../ui/badge'
import { Button } from '../../ui/button'
import { useLanguage } from '../../../hooks/useLanguage'
import { 
  Calendar,
  Clock,
  Users,
  BookOpen,
  CheckSquare,
  AlertTriangle,
  TrendingUp,
  FileText,
  Play,
  UserCheck
} from 'lucide-react'

const TodayOverview = () => {
  const { t } = useLanguage()

  const [todayStats, setTodayStats] = useState({
    total_sessions: 6,
    completed_sessions: 2,
    upcoming_sessions: 4,
    total_students: 125,
    present_students: 98,
    absent_students: 8,
    pending_assignments: 12,
    submissions_to_grade: 34
  })

  const [todaySessions, setTodaySessions] = useState([
    {
      id: 1,
      subject: 'Mathematics',
      subject_arabic: 'الرياضيات',
      class: '1ère Année A',
      time: '08:00 - 09:00',
      room: 'Salle 101',
      status: 'completed', // upcoming, in_progress, completed
      students_count: 25,
      present_count: 23,
      attendance_rate: 92,
      session_id: 205
    },
    {
      id: 2,
      subject: 'Mathematics',
      subject_arabic: 'الرياضيات',
      class: '1ère Année B',
      time: '09:30 - 10:30',
      room: 'Salle 101',
      status: 'completed',
      students_count: 27,
      present_count: 25,
      attendance_rate: 92.6,
      session_id: 206
    },
    {
      id: 3,
      subject: 'Mathematics',
      subject_arabic: 'الرياضيات',
      class: '1ère Année C',
      time: '11:00 - 12:00',
      room: 'Salle 101',
      status: 'upcoming',
      students_count: 24,
      present_count: null,
      attendance_rate: null,
      session_id: null
    },
    {
      id: 4,
      subject: 'Mathematics',
      subject_arabic: 'الرياضيات',
      class: '2ème Année A',
      time: '14:00 - 15:00',
      room: 'Salle 101',
      status: 'upcoming',
      students_count: 22,
      present_count: null,
      attendance_rate: null,
      session_id: null
    },
    {
      id: 5,
      subject: 'Mathematics',
      subject_arabic: 'الرياضيات',
      class: '2ème Année B',
      time: '15:30 - 16:30',
      room: 'Salle 101',
      status: 'upcoming',
      students_count: 26,
      present_count: null,
      attendance_rate: null,
      session_id: null
    }
  ])

  const getSessionStatusColor = (status) => {
    switch(status) {
      case 'completed': return 'bg-green-100 text-green-800'
      case 'in_progress': return 'bg-blue-100 text-blue-800'
      case 'upcoming': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getSessionStatusIcon = (status) => {
    switch(status) {
      case 'completed': return <CheckSquare className="h-4 w-4" />
      case 'in_progress': return <Play className="h-4 w-4" />
      case 'upcoming': return <Clock className="h-4 w-4" />
      default: return <Clock className="h-4 w-4" />
    }
  }

  const handleStartSession = (session) => {
    console.log('Start attendance session:', session.id)
    // Navigate to attendance marking interface
  }

  const handleViewSession = (session) => {
    console.log('View session details:', session.session_id)
    // Navigate to session details
  }

  const currentTime = new Date().toLocaleTimeString('fr-FR', { 
    hour: '2-digit', 
    minute: '2-digit' 
  })

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Today's Sessions */}
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                  {t('teacher.todaySessions')}
                </p>
                <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                  {todayStats.completed_sessions}/{todayStats.total_sessions}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        {/* Total Students */}
        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600 dark:text-green-400">
                  {t('teacher.totalStudents')}
                </p>
                <p className="text-2xl font-bold text-green-900 dark:text-green-100">
                  {todayStats.total_students}
                </p>
              </div>
              <Users className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        {/* Attendance Rate */}
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 border-purple-200 dark:border-purple-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600 dark:text-purple-400">
                  {t('attendance.rate')}
                </p>
                <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                  {Math.round((todayStats.present_students / todayStats.total_students) * 100)}%
                </p>
              </div>
              <UserCheck className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        {/* Pending Grading */}
        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-orange-200 dark:border-orange-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600 dark:text-orange-400">
                  {t('teacher.pendingGrading')}
                </p>
                <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">
                  {todayStats.submissions_to_grade}
                </p>
              </div>
              <FileText className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Today's Schedule */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-blue-500" />
                {t('teacher.todaySchedule')}
              </CardTitle>
              <CardDescription>
                {t('teacher.scheduleDescription')} • {t('common.currentTime')}: {currentTime}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">{todaySessions.length} {t('teacher.sessions')}</Badge>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-4">
            {todaySessions.map((session) => (
              <div
                key={session.id}
                className="flex items-center justify-between p-4 border rounded-lg bg-card hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  {/* Status Indicator */}
                  <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${getSessionStatusColor(session.status)}`}>
                    {getSessionStatusIcon(session.status)}
                    {t(`teacher.${session.status}`)}
                  </div>

                  {/* Session Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-sm">{session.subject}</h4>
                      <span className="text-muted-foreground">•</span>
                      <span className="text-sm text-muted-foreground">{session.class}</span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {session.time}
                      </span>
                      <span>{session.room}</span>
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {session.students_count} {t('student.students')}
                      </span>
                      {session.attendance_rate && (
                        <span className="text-green-600">
                          {session.attendance_rate}% {t('attendance.present')}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  {session.status === 'upcoming' ? (
                    <Button
                      size="sm"
                      onClick={() => handleStartSession(session)}
                    >
                      <Play className="h-4 w-4 mr-1" />
                      {t('teacher.startAttendance')}
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleViewSession(session)}
                    >
                      {t('common.view')}
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default TodayOverview