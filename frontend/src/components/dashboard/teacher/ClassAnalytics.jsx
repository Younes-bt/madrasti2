import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card'
import { Badge } from '../../ui/badge'
import { Button } from '../../ui/button'
import { useLanguage } from '../../../hooks/useLanguage'
import { 
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  Target,
  Award,
  AlertTriangle,
  CheckCircle,
  ChevronRight
} from 'lucide-react'

const ClassAnalytics = () => {
  const { t } = useLanguage()
  const [selectedClass, setSelectedClass] = useState('1ère Année A')

  const [classStats, setClassStats] = useState({
    '1ère Année A': {
      total_students: 25,
      average_attendance: 92.5,
      average_score: 78.2,
      assignments_completed: 85,
      top_performers: 8,
      needs_attention: 3,
      recent_trend: 'up',
      subject_performance: [
        { subject: 'Mathematics', average: 82.1, trend: 'up' },
        { subject: 'French', average: 76.5, trend: 'stable' },
        { subject: 'Science', average: 74.8, trend: 'down' }
      ],
      attendance_pattern: [
        { day: 'Monday', rate: 96 },
        { day: 'Tuesday', rate: 94 },
        { day: 'Wednesday', rate: 89 },
        { day: 'Thursday', rate: 91 },
        { day: 'Friday', rate: 87 }
      ],
      struggling_students: [
        { name: 'Ahmed Hassan', average: 62.5, attendance: 78, issues: ['Low scores', 'Absences'] },
        { name: 'Fatima Said', average: 58.3, attendance: 85, issues: ['Homework incomplete'] },
        { name: 'Omar Alami', average: 65.2, attendance: 82, issues: ['Participation low'] }
      ]
    },
    '1ère Année B': {
      total_students: 27,
      average_attendance: 89.3,
      average_score: 82.7,
      assignments_completed: 78,
      top_performers: 12,
      needs_attention: 5,
      recent_trend: 'stable',
      subject_performance: [
        { subject: 'Mathematics', average: 85.3, trend: 'up' },
        { subject: 'French', average: 81.2, trend: 'up' },
        { subject: 'Science', average: 79.6, trend: 'stable' }
      ],
      attendance_pattern: [
        { day: 'Monday', rate: 92 },
        { day: 'Tuesday', rate: 91 },
        { day: 'Wednesday', rate: 86 },
        { day: 'Thursday', rate: 88 },
        { day: 'Friday', rate: 90 }
      ],
      struggling_students: [
        { name: 'Youssef Tazi', average: 55.8, attendance: 70, issues: ['Chronic absences', 'Low engagement'] },
        { name: 'Khadija Ben', average: 61.2, attendance: 88, issues: ['Math difficulties'] }
      ]
    }
  })

  const currentStats = classStats[selectedClass]
  
  const getTrendIcon = (trend) => {
    switch(trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-600" />
      case 'down': return <TrendingDown className="h-4 w-4 text-red-600" />
      default: return <div className="h-4 w-4" />
    }
  }

  const getTrendColor = (trend) => {
    switch(trend) {
      case 'up': return 'text-green-600'
      case 'down': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  const getAttendanceColor = (rate) => {
    if (rate >= 95) return 'text-green-600 bg-green-100'
    if (rate >= 85) return 'text-yellow-600 bg-yellow-100'
    return 'text-red-600 bg-red-100'
  }

  const handleViewFullAnalytics = () => {
    console.log('Navigate to full class analytics')
  }

  const handleViewStudentDetails = (student) => {
    console.log('View student details:', student)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-blue-500" />
              {t('teacher.classAnalytics')}
            </CardTitle>
            <CardDescription>
              {t('teacher.analyticsDescription')}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <select
              className="px-3 py-2 border border-input bg-background rounded-md text-sm"
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
            >
              <option value="1ère Année A">1ère Année A</option>
              <option value="1ère Année B">1ère Année B</option>
            </select>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleViewFullAnalytics}
            >
              {t('common.viewAll')}
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Overview Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <Users className="h-6 w-6 text-blue-600 mx-auto mb-2" />
            <div className="text-xl font-bold text-blue-900 dark:text-blue-100">
              {currentStats.total_students}
            </div>
            <div className="text-xs text-blue-600 dark:text-blue-400">
              {t('teacher.totalStudents')}
            </div>
          </div>

          <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <CheckCircle className="h-6 w-6 text-green-600 mx-auto mb-2" />
            <div className="text-xl font-bold text-green-900 dark:text-green-100">
              {currentStats.average_attendance}%
            </div>
            <div className="text-xs text-green-600 dark:text-green-400">
              {t('attendance.rate')}
            </div>
          </div>

          <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <Target className="h-6 w-6 text-purple-600 mx-auto mb-2" />
            <div className="text-xl font-bold text-purple-900 dark:text-purple-100">
              {currentStats.average_score}%
            </div>
            <div className="text-xs text-purple-600 dark:text-purple-400">
              {t('homework.avgScore')}
            </div>
          </div>

          <div className="text-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
            <Award className="h-6 w-6 text-orange-600 mx-auto mb-2" />
            <div className="text-xl font-bold text-orange-900 dark:text-orange-100">
              {currentStats.top_performers}
            </div>
            <div className="text-xs text-orange-600 dark:text-orange-400">
              {t('teacher.topPerformers')}
            </div>
          </div>
        </div>

        {/* Performance Trends */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Subject Performance */}
          <div>
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <Target className="h-4 w-4" />
              {t('teacher.subjectPerformance')}
            </h4>
            <div className="space-y-3">
              {currentStats.subject_performance.map((subject, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-accent/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="font-medium text-sm">{subject.subject}</span>
                    {getTrendIcon(subject.trend)}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`font-semibold ${getTrendColor(subject.trend)}`}>
                      {subject.average}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Weekly Attendance Pattern */}
          <div>
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <Users className="h-4 w-4" />
              {t('teacher.weeklyAttendance')}
            </h4>
            <div className="space-y-2">
              {currentStats.attendance_pattern.map((day, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground capitalize">
                    {t(`common.${day.day.toLowerCase()}`)}
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-secondary rounded-full h-2">
                      <div 
                        className="h-2 rounded-full transition-all duration-300"
                        style={{ 
                          width: `${day.rate}%`,
                          backgroundColor: day.rate >= 95 ? '#22C55E' : day.rate >= 85 ? '#EAB308' : '#EF4444'
                        }}
                      ></div>
                    </div>
                    <Badge className={getAttendanceColor(day.rate)} variant="secondary">
                      {day.rate}%
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Students Needing Attention */}
        {currentStats.needs_attention > 0 && (
          <div>
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-orange-500" />
              {t('teacher.needsAttention')} ({currentStats.needs_attention})
            </h4>
            <div className="space-y-3">
              {currentStats.struggling_students.slice(0, 3).map((student, index) => (
                <div key={index} className="flex items-center justify-between p-3 border border-orange-200 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                  <div>
                    <div className="font-medium text-sm">{student.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {student.issues.join(' • ')}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-xs">
                    <div className="text-center">
                      <div className="font-semibold text-red-600">{student.average}%</div>
                      <div className="text-muted-foreground">{t('homework.avgScore')}</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-yellow-600">{student.attendance}%</div>
                      <div className="text-muted-foreground">{t('attendance.rate')}</div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleViewStudentDetails(student)}
                    >
                      {t('common.view')}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Insights */}
        <div className="grid lg:grid-cols-3 gap-4 pt-4 border-t">
          <div className="text-center p-3 bg-accent/30 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {currentStats.assignments_completed}%
            </div>
            <div className="text-xs text-muted-foreground">{t('homework.completion')}</div>
          </div>
          <div className="text-center p-3 bg-accent/30 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {currentStats.top_performers}
            </div>
            <div className="text-xs text-muted-foreground">{t('teacher.highAchievers')}</div>
          </div>
          <div className="text-center p-3 bg-accent/30 rounded-lg">
            <div className="text-2xl font-bold text-orange-600">
              {currentStats.needs_attention}
            </div>
            <div className="text-xs text-muted-foreground">{t('teacher.atRisk')}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default ClassAnalytics