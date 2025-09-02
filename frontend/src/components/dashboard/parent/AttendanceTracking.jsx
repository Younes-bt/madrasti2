import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card'
import { Badge } from '../../ui/badge'
import { Button } from '../../ui/button'
import { useLanguage } from '../../../hooks/useLanguage'
import { 
  UserCheck,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  ChevronRight
} from 'lucide-react'

const AttendanceTracking = () => {
  const { t } = useLanguage()
  const [selectedChild, setSelectedChild] = useState('1')
  const [selectedPeriod, setSelectedPeriod] = useState('week') // week, month, term

  const [attendanceData, setAttendanceData] = useState({
    '1': { // Ahmed Hassan
      name: 'Ahmed Hassan',
      class: '1ère Année A',
      current_streak: 5,
      this_week: {
        total_sessions: 30,
        present: 28,
        absent: 1,
        late: 1,
        rate: 93.3
      },
      this_month: {
        total_sessions: 120,
        present: 110,
        absent: 6,
        late: 4,
        rate: 91.7
      },
      this_term: {
        total_sessions: 480,
        present: 445,
        absent: 20,
        late: 15,
        rate: 92.7
      },
      weekly_pattern: [
        { day: 'Monday', sessions: 6, present: 6, rate: 100 },
        { day: 'Tuesday', sessions: 6, present: 6, rate: 100 },
        { day: 'Wednesday', sessions: 6, present: 5, rate: 83.3 },
        { day: 'Thursday', sessions: 6, present: 6, rate: 100 },
        { day: 'Friday', sessions: 6, present: 5, rate: 83.3 }
      ],
      recent_absences: [
        {
          date: '2024-09-01',
          subject: 'Mathematics',
          time: '09:00',
          type: 'absent',
          reason: 'Illness',
          justified: true
        },
        {
          date: '2024-08-30',
          subject: 'Physics',
          time: '14:00',
          type: 'late',
          reason: 'Traffic',
          justified: false
        }
      ]
    },
    '2': { // Fatima Hassan
      name: 'Fatima Hassan',
      class: '3ème Année B',
      current_streak: 2,
      this_week: {
        total_sessions: 35,
        present: 30,
        absent: 3,
        late: 2,
        rate: 85.7
      },
      this_month: {
        total_sessions: 140,
        present: 125,
        absent: 10,
        late: 5,
        rate: 89.3
      },
      this_term: {
        total_sessions: 560,
        present: 495,
        absent: 40,
        late: 25,
        rate: 88.4
      },
      weekly_pattern: [
        { day: 'Monday', sessions: 7, present: 6, rate: 85.7 },
        { day: 'Tuesday', sessions: 7, present: 7, rate: 100 },
        { day: 'Wednesday', sessions: 7, present: 6, rate: 85.7 },
        { day: 'Thursday', sessions: 7, present: 5, rate: 71.4 },
        { day: 'Friday', sessions: 7, present: 6, rate: 85.7 }
      ],
      recent_absences: [
        {
          date: '2024-09-01',
          subject: 'Chemistry',
          time: '11:00',
          type: 'absent',
          reason: 'Medical appointment',
          justified: true
        },
        {
          date: '2024-08-31',
          subject: 'Biology',
          time: '10:00',
          type: 'absent',
          reason: 'Family emergency',
          justified: true
        },
        {
          date: '2024-08-29',
          subject: 'Literature',
          time: '13:00',
          type: 'late',
          reason: 'Transportation delay',
          justified: false
        }
      ]
    }
  })

  const currentData = attendanceData[selectedChild]
  const currentPeriodData = currentData[`this_${selectedPeriod}`]

  const getAttendanceColor = (rate) => {
    if (rate >= 95) return 'text-green-600 bg-green-100'
    if (rate >= 85) return 'text-yellow-600 bg-yellow-100'
    return 'text-red-600 bg-red-100'
  }

  const getStatusIcon = (type) => {
    switch(type) {
      case 'absent': return <XCircle className="h-4 w-4 text-red-600" />
      case 'late': return <Clock className="h-4 w-4 text-yellow-600" />
      default: return <CheckCircle className="h-4 w-4 text-green-600" />
    }
  }

  const getStatusColor = (type, justified) => {
    if (type === 'absent') {
      return justified 
        ? 'text-orange-700 bg-orange-100 border-orange-200'
        : 'text-red-700 bg-red-100 border-red-200'
    }
    return 'text-yellow-700 bg-yellow-100 border-yellow-200'
  }

  const formatPeriodLabel = (period) => {
    switch(period) {
      case 'week': return t('common.thisWeek')
      case 'month': return t('common.thisMonth')
      case 'term': return t('common.thisTerm')
      default: return period
    }
  }

  const handleViewFullReport = () => {
    console.log('Navigate to full attendance report')
  }

  const handleJustifyAbsence = (absence) => {
    console.log('Justify absence:', absence)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <UserCheck className="h-5 w-5 text-green-500" />
              {t('parent.attendanceTracking')}
            </CardTitle>
            <CardDescription>
              {t('parent.attendanceDescription')}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <select
              className="px-3 py-2 border border-input bg-background rounded-md text-sm"
              value={selectedChild}
              onChange={(e) => setSelectedChild(e.target.value)}
            >
              <option value="1">Ahmed Hassan</option>
              <option value="2">Fatima Hassan</option>
            </select>
            <select
              className="px-3 py-2 border border-input bg-background rounded-md text-sm"
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
            >
              <option value="week">{t('common.week')}</option>
              <option value="month">{t('common.month')}</option>
              <option value="term">{t('common.term')}</option>
            </select>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Current Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <CheckCircle className="h-6 w-6 text-green-600 mx-auto mb-2" />
            <div className="text-xl font-bold text-green-900 dark:text-green-100">
              {currentPeriodData.present}
            </div>
            <div className="text-xs text-green-600 dark:text-green-400">
              {t('attendance.present')}
            </div>
          </div>

          <div className="text-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
            <XCircle className="h-6 w-6 text-red-600 mx-auto mb-2" />
            <div className="text-xl font-bold text-red-900 dark:text-red-100">
              {currentPeriodData.absent}
            </div>
            <div className="text-xs text-red-600 dark:text-red-400">
              {t('attendance.absent')}
            </div>
          </div>

          <div className="text-center p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
            <Clock className="h-6 w-6 text-yellow-600 mx-auto mb-2" />
            <div className="text-xl font-bold text-yellow-900 dark:text-yellow-100">
              {currentPeriodData.late}
            </div>
            <div className="text-xs text-yellow-600 dark:text-yellow-400">
              {t('attendance.late')}
            </div>
          </div>

          <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className={`text-xl font-bold ${getAttendanceColor(currentPeriodData.rate).split(' ')[0]}`}>
              {currentPeriodData.rate}%
            </div>
            <div className="text-xs text-blue-600 dark:text-blue-400">
              {t('attendance.rate')}
            </div>
          </div>
        </div>

        {/* Attendance Streak */}
        <div className="p-3 bg-accent/30 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-medium">{t('parent.attendanceStreak')}</h4>
              <p className="text-sm text-muted-foreground">
                {t('parent.consecutiveDays')}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-2xl font-bold text-green-600">
                🔥 {currentData.current_streak}
              </div>
              <div className="text-sm text-muted-foreground">
                {t('common.days')}
              </div>
            </div>
          </div>
        </div>

        {/* Weekly Pattern */}
        <div>
          <h4 className="font-medium mb-3 flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            {t('parent.weeklyPattern')} ({formatPeriodLabel(selectedPeriod)})
          </h4>
          <div className="space-y-2">
            {currentData.weekly_pattern.map((day, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground capitalize">
                  {t(`common.${day.day.toLowerCase()}`)}
                </span>
                <div className="flex items-center gap-3">
                  <div className="w-32 bg-secondary rounded-full h-2">
                    <div 
                      className="h-2 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${day.rate}%`,
                        backgroundColor: day.rate >= 95 ? '#22C55E' : day.rate >= 85 ? '#EAB308' : '#EF4444'
                      }}
                    ></div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getAttendanceColor(day.rate)} variant="secondary">
                      {day.rate}%
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {day.present}/{day.sessions}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Absences */}
        {currentData.recent_absences.length > 0 && (
          <div>
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-orange-500" />
              {t('parent.recentAbsences')}
            </h4>
            <div className="space-y-3">
              {currentData.recent_absences.map((absence, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg border ${getStatusColor(absence.type, absence.justified)}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      {getStatusIcon(absence.type)}
                      <div>
                        <div className="font-medium text-sm">
                          {absence.subject} • {absence.time}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(absence.date).toLocaleDateString()} • {absence.reason}
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge 
                            variant="outline" 
                            className={absence.justified ? 'text-green-600' : 'text-red-600'}
                          >
                            {absence.justified ? t('parent.justified') : t('parent.notJustified')}
                          </Badge>
                          <Badge variant="outline">
                            {t(`attendance.${absence.type}`)}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    {!absence.justified && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleJustifyAbsence(absence)}
                      >
                        {t('parent.justify')}
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-between items-center pt-4 border-t">
          <div className="text-sm text-muted-foreground">
            {formatPeriodLabel(selectedPeriod)}: {currentPeriodData.present}/{currentPeriodData.total_sessions} {t('attendance.sessions')}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleViewFullReport}
          >
            {t('parent.viewFullReport')}
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default AttendanceTracking