import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { useLanguage } from '../../hooks/useLanguage'
import { 
  BarChart3,
  PieChart,
  TrendingUp,
  TrendingDown,
  Calendar,
  Users,
  Clock,
  Target,
  AlertTriangle,
  CheckCircle,
  Download,
  Filter,
  Eye,
  RefreshCw,
  BookOpen,
  User,
  Building,
  Flag,
  FileText,
  Activity,
  Zap,
  Settings,
  Search
} from 'lucide-react'

const AttendanceReporting = () => {
  const { t } = useLanguage()
  const [selectedReport, setSelectedReport] = useState('overview')
  const [dateRange, setDateRange] = useState('current_month')
  const [selectedClass, setSelectedClass] = useState('all')
  const [selectedSubject, setSelectedSubject] = useState('all')

  const reportTypes = [
    { id: 'overview', name: t('reports.attendanceOverview'), icon: BarChart3 },
    { id: 'trends', name: t('reports.attendanceTrends'), icon: TrendingUp },
    { id: 'patterns', name: t('reports.attendancePatterns'), icon: Activity },
    { id: 'flags', name: t('reports.flagAnalysis'), icon: Flag },
    { id: 'comparative', name: t('reports.comparativeAnalysis'), icon: PieChart },
    { id: 'detailed', name: t('reports.detailedReports'), icon: FileText }
  ]

  const classes = [
    { id: 'all', name: t('common.allClasses') },
    { id: '1ere_c', name: '1ère Année C' },
    { id: '1ere_b', name: '1ère Année B' },
    { id: '2eme_a', name: '2ème Année A' },
    { id: '3eme_c', name: '3ème Année C' }
  ]

  const subjects = [
    { id: 'all', name: t('common.allSubjects') },
    { id: 'math', name: 'Mathematics' },
    { id: 'physics', name: 'Physics' },
    { id: 'chemistry', name: 'Chemistry' },
    { id: 'arabic', name: 'Arabic' },
    { id: 'french', name: 'French' }
  ]

  // Mock data for reports
  const attendanceData = {
    overview: {
      total_sessions: 1240,
      total_students: 92,
      overall_rate: 88.5,
      present_total: 10974,
      absent_total: 932,
      late_total: 334,
      trend: 'improving', // improving, declining, stable
      trend_percentage: 2.3
    },
    by_class: [
      { class: '1ère Année C', students: 24, rate: 91.2, trend: 'improving', sessions: 320 },
      { class: '1ère Année B', students: 26, rate: 89.7, trend: 'stable', sessions: 330 },
      { class: '2ème Année A', students: 22, rate: 85.3, trend: 'declining', sessions: 290 },
      { class: '3ème Année C', students: 20, rate: 87.8, trend: 'improving', sessions: 300 }
    ],
    by_subject: [
      { subject: 'Mathematics', rate: 92.1, sessions: 248, trend: 'stable' },
      { subject: 'Physics', rate: 87.4, sessions: 186, trend: 'improving' },
      { subject: 'Chemistry', rate: 85.9, sessions: 155, trend: 'declining' },
      { subject: 'Arabic', rate: 94.2, sessions: 310, trend: 'stable' },
      { subject: 'French', rate: 83.7, sessions: 217, trend: 'improving' }
    ],
    by_time: [
      { period: '08:00-09:00', rate: 85.2, label: t('attendance.period1') },
      { period: '09:00-10:00', rate: 89.7, label: t('attendance.period2') },
      { period: '10:00-11:00', rate: 91.3, label: t('attendance.period3') },
      { period: '11:20-12:20', rate: 88.9, label: t('attendance.period4') },
      { period: '12:20-13:20', rate: 86.1, label: t('attendance.period5') },
      { period: '14:30-15:30', rate: 82.4, label: t('attendance.period6') },
      { period: '15:30-16:30', rate: 79.8, label: t('attendance.period7') }
    ],
    weekly_trend: [
      { week: 'Week 1', rate: 86.2, sessions: 310 },
      { week: 'Week 2', rate: 88.7, sessions: 315 },
      { week: 'Week 3', rate: 87.9, sessions: 308 },
      { week: 'Week 4', rate: 90.1, sessions: 312 }
    ],
    flag_statistics: {
      total_flags: 156,
      pending: 23,
      under_review: 41,
      cleared: 92,
      by_severity: {
        low: 67,
        medium: 58,
        high: 31
      },
      by_type: {
        full_absence: 98,
        late_arrival: 42,
        early_departure: 16
      }
    },
    top_performers: [
      { name: 'Fatima Al-Zahra', class: '1ère C', rate: 98.5, streak: 45 },
      { name: 'Ahmed Hassan', class: '2ème A', rate: 97.2, streak: 38 },
      { name: 'Omar Benali', class: '3ème C', rate: 96.8, streak: 42 },
      { name: 'Aisha Mansour', class: '1ère B', rate: 96.1, streak: 33 }
    ],
    concerning_students: [
      { name: 'Youssef Tazi', class: '2ème A', rate: 67.3, flags: 8, trend: 'declining' },
      { name: 'Salma Alaoui', class: '1ère C', rate: 72.1, flags: 5, trend: 'declining' },
      { name: 'Mohamed Cherif', class: '3ème C', rate: 74.8, flags: 6, trend: 'stable' }
    ]
  }

  const getTrendIcon = (trend) => {
    switch(trend) {
      case 'improving': return <TrendingUp className="h-4 w-4 text-green-600" />
      case 'declining': return <TrendingDown className="h-4 w-4 text-red-600" />
      case 'stable': return <div className="h-4 w-4 bg-yellow-400 rounded-full" />
      default: return <div className="h-4 w-4 bg-gray-400 rounded-full" />
    }
  }

  const getRateColor = (rate) => {
    if (rate >= 90) return 'text-green-600 bg-green-50'
    if (rate >= 80) return 'text-yellow-600 bg-yellow-50'
    if (rate >= 70) return 'text-orange-600 bg-orange-50'
    return 'text-red-600 bg-red-50'
  }

  const generateReport = () => {
    console.log('Generate report:', { selectedReport, dateRange, selectedClass, selectedSubject })
    // API call to generate report
  }

  const exportReport = (format) => {
    console.log('Export report as:', format)
    // API call to export report
  }

  const scheduleReport = () => {
    console.log('Schedule automatic report')
    // Open scheduling modal
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-blue-500" />
              {t('attendance.reportingAnalytics')}
            </CardTitle>
            <CardDescription>
              {t('attendance.reportingDescription')}
            </CardDescription>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={scheduleReport}>
              <Clock className="h-4 w-4 mr-1" />
              {t('reports.schedule')}
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-1" />
              {t('reports.configure')}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Report Configuration */}
        <div className="grid grid-cols-4 gap-4 p-3 bg-accent/30 rounded-lg">
          <div>
            <label className="text-sm font-medium">{t('reports.reportType')}</label>
            <select 
              value={selectedReport}
              onChange={(e) => setSelectedReport(e.target.value)}
              className="w-full mt-1 border rounded px-2 py-1 text-sm"
            >
              {reportTypes.map((report) => (
                <option key={report.id} value={report.id}>
                  {report.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium">{t('reports.dateRange')}</label>
            <select 
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full mt-1 border rounded px-2 py-1 text-sm"
            >
              <option value="current_week">{t('reports.currentWeek')}</option>
              <option value="current_month">{t('reports.currentMonth')}</option>
              <option value="current_semester">{t('reports.currentSemester')}</option>
              <option value="academic_year">{t('reports.academicYear')}</option>
            </select>
          </div>

          <div>
            <label className="text-sm font-medium">{t('student.class')}</label>
            <select 
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full mt-1 border rounded px-2 py-1 text-sm"
            >
              {classes.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium">{t('student.subject')}</label>
            <select 
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full mt-1 border rounded px-2 py-1 text-sm"
            >
              {subjects.map((subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Overview Statistics */}
        <div className="grid grid-cols-5 gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="text-center">
            <div className="text-lg font-bold text-blue-600">{attendanceData.overview.overall_rate}%</div>
            <div className="text-xs text-blue-700">{t('attendance.overallRate')}</div>
            <div className="flex items-center justify-center gap-1 mt-1">
              {getTrendIcon(attendanceData.overview.trend)}
              <span className="text-xs text-green-600">+{attendanceData.overview.trend_percentage}%</span>
            </div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-blue-600">{attendanceData.overview.total_sessions}</div>
            <div className="text-xs text-blue-700">{t('attendance.totalSessions')}</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-green-600">{attendanceData.overview.present_total}</div>
            <div className="text-xs text-green-700">{t('attendance.totalPresent')}</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-red-600">{attendanceData.overview.absent_total}</div>
            <div className="text-xs text-red-700">{t('attendance.totalAbsent')}</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-yellow-600">{attendanceData.overview.late_total}</div>
            <div className="text-xs text-yellow-700">{t('attendance.totalLate')}</div>
          </div>
        </div>

        {/* Report Content based on selected report type */}
        {selectedReport === 'overview' && (
          <div className="space-y-4">
            {/* By Class Performance */}
            <div className="space-y-2">
              <h4 className="font-medium text-sm flex items-center gap-2">
                <Building className="h-4 w-4 text-blue-500" />
                {t('reports.performanceByClass')}
              </h4>
              {attendanceData.by_class.map((cls, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded bg-card">
                  <div className="flex items-center gap-3">
                    <span className="font-medium text-sm">{cls.class}</span>
                    {getTrendIcon(cls.trend)}
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-muted-foreground">
                      {cls.students} {t('student.students')} • {cls.sessions} {t('attendance.sessions')}
                    </span>
                    <div className={`px-2 py-1 rounded text-sm font-medium ${getRateColor(cls.rate)}`}>
                      {cls.rate}%
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* By Subject Performance */}
            <div className="space-y-2">
              <h4 className="font-medium text-sm flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-green-500" />
                {t('reports.performanceBySubject')}
              </h4>
              {attendanceData.by_subject.map((subject, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded bg-card">
                  <div className="flex items-center gap-3">
                    <span className="font-medium text-sm">{subject.subject}</span>
                    {getTrendIcon(subject.trend)}
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-muted-foreground">
                      {subject.sessions} {t('attendance.sessions')}
                    </span>
                    <div className={`px-2 py-1 rounded text-sm font-medium ${getRateColor(subject.rate)}`}>
                      {subject.rate}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedReport === 'patterns' && (
          <div className="space-y-4">
            {/* By Time Period */}
            <div className="space-y-2">
              <h4 className="font-medium text-sm flex items-center gap-2">
                <Clock className="h-4 w-4 text-purple-500" />
                {t('reports.attendanceByTime')}
              </h4>
              {attendanceData.by_time.map((period, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded bg-card">
                  <div className="flex items-center gap-3">
                    <span className="font-medium text-sm">{period.label}</span>
                    <span className="text-xs text-muted-foreground">{period.period}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${period.rate}%` }}
                      ></div>
                    </div>
                    <div className={`px-2 py-1 rounded text-sm font-medium ${getRateColor(period.rate)}`}>
                      {period.rate}%
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Weekly Trends */}
            <div className="space-y-2">
              <h4 className="font-medium text-sm flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-blue-500" />
                {t('reports.weeklyTrends')}
              </h4>
              {attendanceData.weekly_trend.map((week, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded bg-card">
                  <span className="font-medium text-sm">{week.week}</span>
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-muted-foreground">
                      {week.sessions} {t('attendance.sessions')}
                    </span>
                    <div className={`px-2 py-1 rounded text-sm font-medium ${getRateColor(week.rate)}`}>
                      {week.rate}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {selectedReport === 'flags' && (
          <div className="space-y-4">
            {/* Flag Statistics */}
            <div className="grid grid-cols-4 gap-3 p-3 bg-red-50 rounded-lg border border-red-200">
              <div className="text-center">
                <div className="text-lg font-bold text-red-600">{attendanceData.flag_statistics.total_flags}</div>
                <div className="text-xs text-red-700">{t('attendance.totalFlags')}</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-yellow-600">{attendanceData.flag_statistics.pending}</div>
                <div className="text-xs text-yellow-700">{t('attendance.pending')}</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-blue-600">{attendanceData.flag_statistics.under_review}</div>
                <div className="text-xs text-blue-700">{t('attendance.underReview')}</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-bold text-green-600">{attendanceData.flag_statistics.cleared}</div>
                <div className="text-xs text-green-700">{t('attendance.cleared')}</div>
              </div>
            </div>

            {/* Flag Breakdown */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium text-sm">{t('reports.flagsBySeverity')}</h4>
                {Object.entries(attendanceData.flag_statistics.by_severity).map(([severity, count]) => (
                  <div key={severity} className="flex items-center justify-between p-2 border rounded bg-card">
                    <span className="text-sm">{t(`attendance.${severity}Severity`)}</span>
                    <Badge className={
                      severity === 'high' ? 'bg-red-100 text-red-800' :
                      severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-blue-100 text-blue-800'
                    }>
                      {count}
                    </Badge>
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <h4 className="font-medium text-sm">{t('reports.flagsByType')}</h4>
                {Object.entries(attendanceData.flag_statistics.by_type).map(([type, count]) => (
                  <div key={type} className="flex items-center justify-between p-2 border rounded bg-card">
                    <span className="text-sm">{t(`attendance.${type}`)}</span>
                    <Badge variant="outline">{count}</Badge>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {selectedReport === 'comparative' && (
          <div className="space-y-4">
            {/* Top Performers */}
            <div className="space-y-2">
              <h4 className="font-medium text-sm flex items-center gap-2">
                <Target className="h-4 w-4 text-green-500" />
                {t('reports.topPerformers')}
              </h4>
              {attendanceData.top_performers.map((student, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded">
                  <div className="flex items-center gap-3">
                    <Badge className="bg-green-100 text-green-800">#{index + 1}</Badge>
                    <div>
                      <div className="font-medium text-sm">{student.name}</div>
                      <div className="text-xs text-muted-foreground">{student.class}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-green-600">{student.rate}%</div>
                    <div className="text-xs text-green-700">
                      {student.streak} {t('attendance.dayStreak')}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Students of Concern */}
            <div className="space-y-2">
              <h4 className="font-medium text-sm flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-red-500" />
                {t('reports.studentsOfConcern')}
              </h4>
              {attendanceData.concerning_students.map((student, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                    <div>
                      <div className="font-medium text-sm">{student.name}</div>
                      <div className="text-xs text-muted-foreground">{student.class}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-red-600">{student.rate}%</div>
                    <div className="flex items-center gap-1 text-xs">
                      <Flag className="h-3 w-3 text-red-600" />
                      <span className="text-red-700">{student.flags} {t('attendance.flags')}</span>
                      {getTrendIcon(student.trend)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Export Options */}
        <div className="flex gap-2 pt-4 border-t">
          <Button onClick={generateReport}>
            <RefreshCw className="h-4 w-4 mr-1" />
            {t('reports.generateReport')}
          </Button>
          <Button variant="outline" onClick={() => exportReport('pdf')}>
            <Download className="h-4 w-4 mr-1" />
            PDF
          </Button>
          <Button variant="outline" onClick={() => exportReport('excel')}>
            <Download className="h-4 w-4 mr-1" />
            Excel
          </Button>
          <Button variant="outline" onClick={() => exportReport('csv')}>
            <Download className="h-4 w-4 mr-1" />
            CSV
          </Button>
          <Button variant="outline" onClick={() => console.log('View detailed analytics')}>
            <Eye className="h-4 w-4 mr-1" />
            {t('reports.detailedView')}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default AttendanceReporting