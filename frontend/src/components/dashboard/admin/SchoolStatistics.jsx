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
  BookOpen,
  GraduationCap,
  UserCheck,
  Target,
  Award,
  AlertTriangle,
  Calendar,
  ChevronRight
} from 'lucide-react'

const SchoolStatistics = () => {
  const { t } = useLanguage()
  const [selectedPeriod, setSelectedPeriod] = useState('month') // week, month, term, year

  const [statistics, setStatistics] = useState({
    academic: {
      month: {
        total_assignments: 245,
        assignments_completed: 198,
        completion_rate: 80.8,
        average_score: 76.5,
        trending_up: true,
        top_subjects: [
          { name: 'subjects.mathematics', avg_score: 82.1, completion: 87 },
          { name: 'subjects.physics', avg_score: 78.9, completion: 84 },
          { name: 'subjects.chemistry', avg_score: 75.3, completion: 81 }
        ],
        struggling_subjects: [
          { name: 'subjects.literature', avg_score: 68.5, completion: 72 },
          { name: 'subjects.history', avg_score: 71.2, completion: 76 }
        ]
      }
    },
    attendance: {
      month: {
        total_sessions: 2640,
        attended_sessions: 2375,
        attendance_rate: 89.9,
        chronic_absences: 45,
        perfect_attendance: 312,
        trending_up: false,
        daily_pattern: [
          { day: 'common.monday', rate: 92 },
          { day: 'common.tuesday', rate: 94 },
          { day: 'common.wednesday', rate: 88 },
          { day: 'common.thursday', rate: 91 },
          { day: 'common.friday', rate: 85 }
        ]
      }
    },
    enrollment: {
      month: {
        total_students: 1150,
        new_enrollments: 23,
        withdrawals: 8,
        net_growth: 15,
        retention_rate: 97.8,
        class_distribution: [
          { level: 'levels.firstYear', students: 324, classes: 12 },
          { level: 'levels.secondYear', students: 298, classes: 11 },
          { level: 'levels.thirdYear', students: 276, classes: 10 },
          { level: 'levels.terminal', students: 252, classes: 9 }
        ]
      }
    },
    performance: {
      month: {
        high_performers: 289,
        at_risk_students: 156,
        improvement_rate: 12.5,
        grade_distribution: {
          excellent: 18, // 90-100%
          very_good: 32, // 80-89%
          good: 35, // 70-79%
          satisfactory: 12, // 60-69%
          needs_improvement: 3 // below 60%
        }
      }
    }
  })

  const currentAcademic = statistics.academic[selectedPeriod]
  const currentAttendance = statistics.attendance[selectedPeriod]
  const currentEnrollment = statistics.enrollment[selectedPeriod]
  const currentPerformance = statistics.performance[selectedPeriod]

  const getTrendIcon = (trending) => {
    return trending 
      ? <TrendingUp className="h-4 w-4 text-green-600" />
      : <TrendingDown className="h-4 w-4 text-red-600" />
  }

  const getTrendColor = (trending) => {
    return trending ? 'text-green-600' : 'text-red-600'
  }

  const getPerformanceColor = (score) => {
    if (score >= 85) return 'text-green-600 bg-green-100'
    if (score >= 75) return 'text-yellow-600 bg-yellow-100'
    return 'text-red-600 bg-red-100'
  }

  const getAttendanceColor = (rate) => {
    if (rate >= 95) return 'text-green-600 bg-green-100'
    if (rate >= 85) return 'text-yellow-600 bg-yellow-100'
    return 'text-red-600 bg-red-100'
  }

  const handleViewDetailedReport = (category) => {
    console.log('View detailed report for:', category)
  }

  const handleExportStatistics = () => {
    console.log('Export statistics')
  }

  const formatPeriod = (period) => {
    switch(period) {
      case 'week': return t('misc.thisWeek')
      case 'month': return t('misc.thisMonth')
      case 'term': return t('misc.thisTerm')
      case 'year': return t('misc.thisYear')
      default: return period
    }
  }

  return (
    <Card>
      <CardHeader className="card-content">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-purple-500" />
              {t('admin.schoolStatistics')}
            </CardTitle>
            <CardDescription>
              {t('admin.statisticsDescription')}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <select
              className="px-3 py-2 border border-input bg-background rounded-md text-sm"
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
            >
              <option value="week">{t('misc.week')}</option>
              <option value="month">{t('misc.month')}</option>
              <option value="term">{t('misc.term')}</option>
              <option value="year">{t('misc.year')}</option>
            </select>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportStatistics}
            >
              {t('admin.export')}
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4 card-content">
        {/* Key Performance Indicators */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <BookOpen className="h-6 w-6 text-blue-600 mx-auto mb-2" />
            <div className="text-xl font-bold text-blue-900 dark:text-blue-100">
              {currentAcademic.completion_rate}%
            </div>
            <div className="text-xs text-blue-600 dark:text-blue-400">
              {t('homework.completion')}
            </div>
            <div className="flex items-center justify-center gap-1 mt-1">
              {getTrendIcon(currentAcademic.trending_up)}
            </div>
          </div>

          <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <UserCheck className="h-6 w-6 text-green-600 mx-auto mb-2" />
            <div className="text-xl font-bold text-green-900 dark:text-green-100">
              {currentAttendance.attendance_rate}%
            </div>
            <div className="text-xs text-green-600 dark:text-green-400">
              {t('attendance.rate')}
            </div>
            <div className="flex items-center justify-center gap-1 mt-1">
              {getTrendIcon(currentAttendance.trending_up)}
            </div>
          </div>

          <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <Target className="h-6 w-6 text-purple-600 mx-auto mb-2" />
            <div className="text-xl font-bold text-purple-900 dark:text-purple-100">
              {currentAcademic.average_score}%
            </div>
            <div className="text-xs text-purple-600 dark:text-purple-400">
              {t('homework.avgScore')}
            </div>
          </div>

          <div className="text-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
            <Users className="h-6 w-6 text-orange-600 mx-auto mb-2" />
            <div className="text-xl font-bold text-orange-900 dark:text-orange-100">
              +{currentEnrollment.net_growth}
            </div>
            <div className="text-xs text-orange-600 dark:text-orange-400">
              {t('admin.netGrowth')}
            </div>
          </div>
        </div>

        {/* Summary Sections */}
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-accent/30 rounded-lg">
            <div className="flex items-center gap-3">
              <BookOpen className="h-5 w-5 text-blue-600" />
              <div>
                <h4 className="font-medium">{t('admin.academicPerformance')}</h4>
                <p className="text-xs text-muted-foreground">
                  {t('admin.topSubjects')}: {t(currentAcademic.top_subjects[0].name)}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleViewDetailedReport('academic')}
            >
              {t('misc.viewDetails')}
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>

          <div className="flex items-center justify-between p-3 bg-accent/30 rounded-lg">
            <div className="flex items-center gap-3">
              <UserCheck className="h-5 w-5 text-green-600" />
              <div>
                <h4 className="font-medium">{t('admin.attendancePatterns')}</h4>
                <p className="text-xs text-muted-foreground">
                  {currentAttendance.chronic_absences} {t('attendance.chronic')}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleViewDetailedReport('attendance')}
            >
              {t('misc.viewDetails')}
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>

          <div className="flex items-center justify-between p-3 bg-accent/30 rounded-lg">
            <div className="flex items-center gap-3">
              <GraduationCap className="h-5 w-5 text-purple-600" />
              <div>
                <h4 className="font-medium">{t('admin.enrollmentOverview')}</h4>
                <p className="text-xs text-muted-foreground">
                  {currentEnrollment.retention_rate}% {t('admin.retentionRate')}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleViewDetailedReport('enrollment')}
            >
              {t('misc.viewDetails')}
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default SchoolStatistics