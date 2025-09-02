import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card'
import { Badge } from '../../ui/badge'
import { Button } from '../../ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar'
import { useLanguage } from '../../../hooks/useLanguage'
import { 
  UserCheck,
  Users,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Save,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react'

const AttendanceSession = () => {
  const { t } = useLanguage()
  const [currentSession, setCurrentSession] = useState({
    id: 207,
    subject: 'Mathematics',
    class: '1ère Année C',
    room: 'Salle 101',
    time: '11:00 - 12:00',
    status: 'in_progress', // not_started, in_progress, completed
    started_at: '2024-09-01T11:05:00Z',
    total_students: 24,
    marked_students: 18,
    present_count: 16,
    absent_count: 2,
    late_count: 0
  })

  const [students, setStudents] = useState([
    {
      id: 1,
      name: 'Ahmed Hassan',
      profile_picture: null,
      status: 'present', // not_marked, present, absent, late
      marked_at: '2024-09-01T11:05:00Z',
      notes: '',
      previous_attendance: 'present'
    },
    {
      id: 2,
      name: 'Fatima Al-Zahra',
      profile_picture: null,
      status: 'present',
      marked_at: '2024-09-01T11:05:00Z',
      notes: '',
      previous_attendance: 'present'
    },
    {
      id: 3,
      name: 'Omar Benali',
      profile_picture: null,
      status: 'absent',
      marked_at: '2024-09-01T11:05:00Z',
      notes: 'Illness reported by parent',
      previous_attendance: 'present'
    },
    {
      id: 4,
      name: 'Aisha Mansour',
      profile_picture: null,
      status: 'present',
      marked_at: '2024-09-01T11:05:00Z',
      notes: '',
      previous_attendance: 'late'
    },
    {
      id: 5,
      name: 'Mohamed Cherif',
      profile_picture: null,
      status: 'absent',
      marked_at: '2024-09-01T11:05:00Z',
      notes: 'Medical appointment',
      previous_attendance: 'present'
    },
    {
      id: 6,
      name: 'Salma Alaoui',
      profile_picture: null,
      status: 'not_marked',
      marked_at: null,
      notes: '',
      previous_attendance: 'present'
    },
    {
      id: 7,
      name: 'Youssef Tazi',
      profile_picture: null,
      status: 'not_marked',
      marked_at: null,
      notes: '',
      previous_attendance: 'absent'
    },
    {
      id: 8,
      name: 'Khadija Benjelloun',
      profile_picture: null,
      status: 'not_marked',
      marked_at: null,
      notes: '',
      previous_attendance: 'present'
    }
  ])

  const getStatusColor = (status) => {
    switch(status) {
      case 'present': return 'text-green-700 bg-green-100 border-green-300'
      case 'absent': return 'text-red-700 bg-red-100 border-red-300'
      case 'late': return 'text-yellow-700 bg-yellow-100 border-yellow-300'
      case 'not_marked': return 'text-gray-700 bg-gray-100 border-gray-300'
      default: return 'text-gray-700 bg-gray-100 border-gray-300'
    }
  }

  const getStatusIcon = (status) => {
    switch(status) {
      case 'present': return <CheckCircle className="h-4 w-4" />
      case 'absent': return <XCircle className="h-4 w-4" />
      case 'late': return <Clock className="h-4 w-4" />
      case 'not_marked': return <AlertTriangle className="h-4 w-4" />
      default: return <AlertTriangle className="h-4 w-4" />
    }
  }

  const handleMarkStudent = (studentId, status) => {
    setStudents(prev => 
      prev.map(student => 
        student.id === studentId 
          ? { ...student, status, marked_at: new Date().toISOString() }
          : student
      )
    )
    
    // Update session stats
    const updatedStudents = students.map(s => 
      s.id === studentId ? { ...s, status } : s
    )
    
    const presentCount = updatedStudents.filter(s => s.status === 'present').length
    const absentCount = updatedStudents.filter(s => s.status === 'absent').length
    const lateCount = updatedStudents.filter(s => s.status === 'late').length
    const markedCount = updatedStudents.filter(s => s.status !== 'not_marked').length
    
    setCurrentSession(prev => ({
      ...prev,
      marked_students: markedCount,
      present_count: presentCount,
      absent_count: absentCount,
      late_count: lateCount
    }))
  }

  const handleBulkMarkPresent = () => {
    const unmarkedStudents = students.filter(s => s.status === 'not_marked')
    unmarkedStudents.forEach(student => {
      handleMarkStudent(student.id, 'present')
    })
  }

  const handleSaveSession = () => {
    console.log('Save attendance session:', currentSession.id)
    // API call to save attendance
  }

  const handleCompleteSession = () => {
    console.log('Complete attendance session:', currentSession.id)
    // API call to complete session
  }

  const attendanceRate = Math.round((currentSession.present_count / currentSession.total_students) * 100)

  if (currentSession.status === 'not_started') {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCheck className="h-5 w-5 text-blue-500" />
            {t('teacher.attendanceSession')}
          </CardTitle>
          <CardDescription>
            {t('teacher.noActiveSession')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground mb-4">
              {t('teacher.startSessionDescription')}
            </p>
            <Button>
              <Play className="h-4 w-4 mr-2" />
              {t('teacher.startAttendance')}
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <UserCheck className="h-5 w-5 text-blue-500" />
              {t('teacher.attendanceSession')}
            </CardTitle>
            <CardDescription>
              {currentSession.subject} • {currentSession.class}
            </CardDescription>
          </div>
          <Badge 
            className={currentSession.status === 'in_progress' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}
          >
            {t(`teacher.${currentSession.status}`)}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Session Stats */}
        <div className="grid grid-cols-3 gap-3 p-3 bg-accent/30 rounded-lg">
          <div className="text-center">
            <div className="text-lg font-bold text-green-600">
              {currentSession.present_count}
            </div>
            <div className="text-xs text-muted-foreground">{t('attendance.present')}</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-red-600">
              {currentSession.absent_count}
            </div>
            <div className="text-xs text-muted-foreground">{t('attendance.absent')}</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-blue-600">
              {attendanceRate}%
            </div>
            <div className="text-xs text-muted-foreground">{t('attendance.rate')}</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span>{t('teacher.progress')}</span>
            <span>{currentSession.marked_students}/{currentSession.total_students}</span>
          </div>
          <div className="w-full bg-secondary rounded-full h-2">
            <div 
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentSession.marked_students / currentSession.total_students) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={handleBulkMarkPresent}
            disabled={students.filter(s => s.status === 'not_marked').length === 0}
          >
            {t('teacher.markAllPresent')}
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={handleSaveSession}
          >
            <Save className="h-4 w-4 mr-1" />
            {t('common.save')}
          </Button>
        </div>

        {/* Student List */}
        <div className="space-y-2 max-h-80 overflow-y-auto">
          <h4 className="font-medium text-sm flex items-center gap-2">
            <Users className="h-4 w-4" />
            {t('student.students')} ({students.length})
          </h4>
          
          {students.slice(0, 8).map((student) => (
            <div
              key={student.id}
              className="flex items-center justify-between p-2 border rounded-lg bg-card"
            >
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={student.profile_picture} />
                  <AvatarFallback className="text-xs">
                    {student.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium text-sm">{student.name}</div>
                  {student.notes && (
                    <div className="text-xs text-muted-foreground">{student.notes}</div>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-1">
                {/* Status Buttons */}
                <button
                  onClick={() => handleMarkStudent(student.id, 'present')}
                  className={`p-1 rounded border ${
                    student.status === 'present' 
                      ? 'bg-green-100 border-green-300 text-green-700'
                      : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-green-50'
                  }`}
                  title={t('attendance.present')}
                >
                  <CheckCircle className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleMarkStudent(student.id, 'absent')}
                  className={`p-1 rounded border ${
                    student.status === 'absent'
                      ? 'bg-red-100 border-red-300 text-red-700'
                      : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-red-50'
                  }`}
                  title={t('attendance.absent')}
                >
                  <XCircle className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleMarkStudent(student.id, 'late')}
                  className={`p-1 rounded border ${
                    student.status === 'late'
                      ? 'bg-yellow-100 border-yellow-300 text-yellow-700'
                      : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-yellow-50'
                  }`}
                  title={t('attendance.late')}
                >
                  <Clock className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}

          {students.length > 8 && (
            <div className="text-center pt-2">
              <Button variant="outline" size="sm">
                {t('common.viewAll')} ({students.length - 8} {t('common.more')})
              </Button>
            </div>
          )}
        </div>

        {/* Session Actions */}
        <div className="flex gap-2 pt-4 border-t">
          <Button
            onClick={handleCompleteSession}
            disabled={currentSession.marked_students < currentSession.total_students}
            className="flex-1"
          >
            {t('teacher.completeSession')}
          </Button>
          <Button
            variant="outline"
            onClick={() => console.log('Reset session')}
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default AttendanceSession