import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card'
import { Badge } from '../../ui/badge'
import { Button } from '../../ui/button'
import { useLanguage } from '../../../hooks/useLanguage'
import { 
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  TrendingUp,
  User,
  ChevronRight
} from 'lucide-react'

const AttendanceHistory = () => {
  const { t } = useLanguage()

  const [attendanceData, setAttendanceData] = useState({
    summary: {
      attendance_rate: 92.5,
      total_sessions: 40,
      present: 37,
      absent: 2,
      late: 1,
      excused: 1
    },
    recent_records: [
      {
        id: 1,
        date: '2024-09-02',
        day: 'Monday',
        sessions: [
          { subject: 'Mathematics', time: '08:00', status: 'present', teacher: 'Mr. Ahmed' },
          { subject: 'French', time: '09:30', status: 'present', teacher: 'Mme. Dubois' },
          { subject: 'Chemistry', time: '11:00', status: 'late', late_minutes: 15, teacher: 'Dr. Hassan' },
          { subject: 'History', time: '14:00', status: 'present', teacher: 'Ms. Fatima' }
        ]
      },
      {
        id: 2,
        date: '2024-09-01',
        day: 'Sunday',
        sessions: [
          { subject: 'Mathematics', time: '08:00', status: 'present', teacher: 'Mr. Ahmed' },
          { subject: 'Physics', time: '09:30', status: 'present', teacher: 'Dr. Omar' },
          { subject: 'Arabic', time: '11:00', status: 'present', teacher: 'Ms. Aisha' },
          { subject: 'English', time: '13:00', status: 'absent', absence_reason: 'Medical appointment', is_excused: true, teacher: 'Ms. Sarah' }
        ]
      },
      {
        id: 3,
        date: '2024-08-31',
        day: 'Saturday',
        sessions: [
          { subject: 'Mathematics', time: '08:00', status: 'present', teacher: 'Mr. Ahmed' },
          { subject: 'Chemistry', time: '09:30', status: 'present', teacher: 'Dr. Hassan' },
          { subject: 'French', time: '11:00', status: 'present', teacher: 'Mme. Dubois' },
          { subject: 'Sports', time: '14:00', status: 'present', teacher: 'Coach Ali' }
        ]
      }
    ],
    weekly_pattern: {
      monday: 95,
      tuesday: 100,
      wednesday: 88,
      thursday: 92,
      friday: 85,
      saturday: 98,
      sunday: 90
    }
  })

  const getStatusIcon = (status) => {
    switch(status) {
      case 'present': return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'absent': return <XCircle className="h-4 w-4 text-red-600" />
      case 'late': return <Clock className="h-4 w-4 text-yellow-600" />
      case 'excused': return <AlertTriangle className="h-4 w-4 text-blue-600" />
      default: return <User className="h-4 w-4 text-gray-400" />
    }
  }

  const getStatusColor = (status, isExcused = false) => {
    if (isExcused) return 'text-blue-700 bg-blue-50 border-blue-200'
    
    switch(status) {
      case 'present': return 'text-green-700 bg-green-50 border-green-200'
      case 'absent': return 'text-red-700 bg-red-50 border-red-200'
      case 'late': return 'text-yellow-700 bg-yellow-50 border-yellow-200'
      default: return 'text-gray-700 bg-gray-50 border-gray-200'
    }
  }

  const getStatusText = (status, isExcused = false) => {
    if (status === 'absent' && isExcused) return t('attendance.excused')
    return t(`attendance.${status}`)
  }

  const getAttendanceRateColor = (rate) => {
    if (rate >= 95) return 'text-green-600'
    if (rate >= 85) return 'text-yellow-600'
    return 'text-red-600'
  }

  const handleViewFullHistory = () => {
    console.log('Navigate to full attendance history')
    // Navigate to detailed attendance page
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-500" />
              {t('attendance.history')}
            </CardTitle>
            <CardDescription>
              {t('student.attendanceDescription')}
            </CardDescription>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleViewFullHistory}
            className="flex items-center gap-1"
          >
            {t('common.viewAll')}
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Attendance Summary */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-accent/30 rounded-lg">
            <div className={`text-2xl font-bold ${getAttendanceRateColor(attendanceData.summary.attendance_rate)}`}>
              {attendanceData.summary.attendance_rate}%
            </div>
            <div className="text-xs text-muted-foreground">{t('attendance.rate')}</div>
          </div>
          <div className="text-center p-3 bg-accent/30 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {attendanceData.summary.present}/{attendanceData.summary.total_sessions}
            </div>
            <div className="text-xs text-muted-foreground">{t('attendance.sessionsAttended')}</div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-4 gap-2 text-center">
          <div className="p-2 rounded">
            <div className="flex items-center justify-center mb-1">
              <CheckCircle className="h-4 w-4 text-green-600" />
            </div>
            <div className="text-sm font-semibold text-green-700">{attendanceData.summary.present}</div>
            <div className="text-xs text-muted-foreground">{t('attendance.present')}</div>
          </div>
          <div className="p-2 rounded">
            <div className="flex items-center justify-center mb-1">
              <XCircle className="h-4 w-4 text-red-600" />
            </div>
            <div className="text-sm font-semibold text-red-700">{attendanceData.summary.absent}</div>
            <div className="text-xs text-muted-foreground">{t('attendance.absent')}</div>
          </div>
          <div className="p-2 rounded">
            <div className="flex items-center justify-center mb-1">
              <Clock className="h-4 w-4 text-yellow-600" />
            </div>
            <div className="text-sm font-semibold text-yellow-700">{attendanceData.summary.late}</div>
            <div className="text-xs text-muted-foreground">{t('attendance.late')}</div>
          </div>
          <div className="p-2 rounded">
            <div className="flex items-center justify-center mb-1">
              <AlertTriangle className="h-4 w-4 text-blue-600" />
            </div>
            <div className="text-sm font-semibold text-blue-700">{attendanceData.summary.excused}</div>
            <div className="text-xs text-muted-foreground">{t('attendance.excused')}</div>
          </div>
        </div>

        {/* Recent Records */}
        <div className="space-y-3">
          <h4 className="font-medium text-sm flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            {t('attendance.recentDays')}
          </h4>
          
          {attendanceData.recent_records.slice(0, 3).map((record) => (
            <div key={record.id} className="border rounded-lg p-3 bg-card">
              <div className="flex items-center justify-between mb-2">
                <div className="font-medium text-sm">
                  {new Date(record.date).toLocaleDateString()} - {record.day}
                </div>
                <Badge variant="outline" className="text-xs">
                  {record.sessions.filter(s => s.status === 'present' || (s.status === 'absent' && s.is_excused)).length}/{record.sessions.length}
                </Badge>
              </div>
              
              <div className="space-y-1">
                {record.sessions.map((session, index) => (
                  <div key={index} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(session.status)}
                      <span className="font-medium">{session.subject}</span>
                      <span className="text-muted-foreground">{session.time}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {session.status === 'late' && session.late_minutes && (
                        <span className="text-yellow-600 text-xs">+{session.late_minutes}min</span>
                      )}
                      {session.absence_reason && (
                        <span className="text-muted-foreground text-xs truncate max-w-20" title={session.absence_reason}>
                          {session.absence_reason}
                        </span>
                      )}
                      <Badge 
                        className={`${getStatusColor(session.status, session.is_excused)} text-xs`}
                        variant="outline"
                      >
                        {getStatusText(session.status, session.is_excused)}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Weekly Pattern */}
        <div className="space-y-2">
          <h4 className="font-medium text-sm">{t('attendance.weeklyPattern')}</h4>
          <div className="grid grid-cols-7 gap-1 text-center">
            {Object.entries(attendanceData.weekly_pattern).map(([day, rate]) => (
              <div key={day} className="text-center">
                <div className="text-xs text-muted-foreground capitalize mb-1">
                  {t(`common.${day}`).slice(0, 3)}
                </div>
                <div className={`text-sm font-semibold ${getAttendanceRateColor(rate)}`}>
                  {rate}%
                </div>
                <div className="w-full bg-secondary rounded-full h-1 mt-1">
                  <div 
                    className={`h-1 rounded-full transition-all duration-300 ${
                      rate >= 95 ? 'bg-green-500' : 
                      rate >= 85 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${rate}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default AttendanceHistory