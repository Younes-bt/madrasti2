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
          { name: 'Mathematics', avg_score: 82.1, completion: 87 },
          { name: 'Physics', avg_score: 78.9, completion: 84 },
          { name: 'Chemistry', avg_score: 75.3, completion: 81 }
        ],
        struggling_subjects: [
          { name: 'Literature', avg_score: 68.5, completion: 72 },
          { name: 'History', avg_score: 71.2, completion: 76 }
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
          { day: 'Monday', rate: 92 },
          { day: 'Tuesday', rate: 94 },
          { day: 'Wednesday', rate: 88 },
          { day: 'Thursday', rate: 91 },
          { day: 'Friday', rate: 85 }
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
          { level: '1ère Année', students: 324, classes: 12 },
          { level: '2ème Année', students: 298, classes: 11 },
          { level: '3ème Année', students: 276, classes: 10 },
          { level: 'Terminale', students: 252, classes: 9 }
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
      case 'week': return t('common.thisWeek')
      case 'month': return t('common.thisMonth')
      case 'term': return t('common.thisTerm')
      case 'year': return t('common.thisYear')
      default: return period
    }
  }

  return (
    <Card>
      <CardHeader>
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
              <option value="week">{t('common.week')}</option>
              <option value="month">{t('common.month')}</option>
              <option value="term">{t('common.term')}</option>
              <option value="year">{t('common.year')}</option>
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
      
      <CardContent className="space-y-6">
        {/* Key Performance Indicators */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
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

        {/* Academic Performance */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              {t('admin.academicPerformance')} ({formatPeriod(selectedPeriod)})
            </h4>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleViewDetailedReport('academic')}
            >
              {t('common.viewDetails')}
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-4">
            {/* Top Performing Subjects */}
            <div>
              <h5 className="text-sm font-medium mb-2 flex items-center gap-2">
                <Award className="h-3 w-3 text-green-600" />
                {t('admin.topSubjects')}
              </h5>
              <div className="space-y-2">
                {currentAcademic.top_subjects.map((subject, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-green-50 dark:bg-green-900/20 rounded">
                    <span className="text-sm font-medium">{subject.name}</span>
                    <div className="flex items-center gap-2">
                      <Badge className={getPerformanceColor(subject.avg_score)}>
                        {subject.avg_score}%
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {subject.completion}% {t('homework.completion')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Struggling Subjects */}
            <div>
              <h5 className="text-sm font-medium mb-2 flex items-center gap-2">
                <AlertTriangle className="h-3 w-3 text-orange-600" />
                {t('admin.strugglingSubjects')}
              </h5>
              <div className="space-y-2">
                {currentAcademic.struggling_subjects.map((subject, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-orange-50 dark:bg-orange-900/20 rounded">
                    <span className="text-sm font-medium">{subject.name}</span>
                    <div className="flex items-center gap-2">
                      <Badge className={getPerformanceColor(subject.avg_score)}>
                        {subject.avg_score}%
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {subject.completion}% {t('homework.completion')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Attendance Patterns */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium flex items-center gap-2">
              <UserCheck className="h-4 w-4" />
              {t('admin.attendancePatterns')}
            </h4>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                <span>{currentAttendance.perfect_attendance} {t('attendance.perfect')}</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                <span>{currentAttendance.chronic_absences} {t('attendance.chronic')}</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            {currentAttendance.daily_pattern.map((day, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground capitalize w-20">
                  {t(`common.${day.day.toLowerCase()}`)}
                </span>
                <div className="flex items-center gap-3 flex-1">
                  <div className="flex-1 bg-secondary rounded-full h-2 mx-4">
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

        {/* Enrollment and Demographics */}
        <div>
          <h4 className="font-medium mb-3 flex items-center gap-2">
            <GraduationCap className="h-4 w-4" />
            {t('admin.enrollmentOverview')}
          </h4>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {currentEnrollment.class_distribution.map((level, index) => (
              <div key={index} className="text-center p-3 border rounded-lg">
                <div className="text-lg font-bold">{level.students}</div>
                <div className="text-xs text-muted-foreground">{level.level}</div>
                <div className="text-xs text-blue-600">{level.classes} {t('admin.classes')}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-3">
            <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="text-lg font-bold text-blue-600">+{currentEnrollment.new_enrollments}</div>
              <div className="text-xs text-blue-600">{t('admin.newEnrollments')}</div>
            </div>
            <div className="text-center p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <div className="text-lg font-bold text-red-600">-{currentEnrollment.withdrawals}</div>
              <div className="text-xs text-red-600">{t('admin.withdrawals')}</div>
            </div>
            <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="text-lg font-bold text-green-600">{currentEnrollment.retention_rate}%</div>
              <div className="text-xs text-green-600">{t('admin.retentionRate')}</div>
            </div>
            <div className="text-center p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <div className="text-lg font-bold text-purple-600">+{currentPerformance.improvement_rate}%</div>
              <div className="text-xs text-purple-600">{t('admin.improvementRate')}</div>
            </div>
          </div>
        </div>

        {/* Performance Distribution */}
        <div>
          <h4 className="font-medium mb-3 flex items-center gap-2">
            <Target className="h-4 w-4" />
            {t('admin.performanceDistribution')}
          </h4>
          
          <div className="grid grid-cols-5 gap-2">
            <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded">
              <div className="text-lg font-bold text-green-600">{currentPerformance.grade_distribution.excellent}%</div>
              <div className="text-xs text-green-600">{t('admin.excellent')}</div>
              <div className="text-xs text-muted-foreground">90-100%</div>
            </div>
            <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded">
              <div className="text-lg font-bold text-blue-600">{currentPerformance.grade_distribution.very_good}%</div>
              <div className="text-xs text-blue-600">{t('admin.veryGood')}</div>
              <div className="text-xs text-muted-foreground">80-89%</div>
            </div>
            <div className="text-center p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded">
              <div className="text-lg font-bold text-yellow-600">{currentPerformance.grade_distribution.good}%</div>
              <div className="text-xs text-yellow-600">{t('admin.good')}</div>
              <div className="text-xs text-muted-foreground">70-79%</div>
            </div>
            <div className="text-center p-3 bg-orange-50 dark:bg-orange-900/20 rounded">
              <div className="text-lg font-bold text-orange-600">{currentPerformance.grade_distribution.satisfactory}%</div>
              <div className="text-xs text-orange-600">{t('admin.satisfactory')}</div>
              <div className="text-xs text-muted-foreground">60-69%</div>
            </div>
            <div className="text-center p-3 bg-red-50 dark:bg-red-900/20 rounded">
              <div className="text-lg font-bold text-red-600">{currentPerformance.grade_distribution.needs_improvement}%</div>
              <div className="text-xs text-red-600">{t('admin.needsImprovement')}</div>
              <div className="text-xs text-muted-foreground">&lt; 60%</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default SchoolStatistics