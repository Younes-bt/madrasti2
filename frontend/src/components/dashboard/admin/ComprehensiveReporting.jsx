import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card'
import { Badge } from '../../ui/badge'
import { Button } from '../../ui/button'
import { useLanguage } from '../../../hooks/useLanguage'
import { 
  BarChart3,
  FileText,
  Download,
  Filter,
  Calendar,
  Users,
  GraduationCap,
  TrendingUp,
  TrendingDown,
  PieChart,
  Activity,
  Target,
  AlertCircle,
  CheckCircle,
  Clock,
  Eye,
  Settings,
  Database,
  RefreshCw
} from 'lucide-react'

const ComprehensiveReporting = () => {
  const { t } = useLanguage()
  const [selectedReport, setSelectedReport] = useState('academic_overview')
  const [dateRange, setDateRange] = useState('current_month')
  const [isGenerating, setIsGenerating] = useState(false)

  const reportTypes = [
    {
      id: 'academic_overview',
      name: t('reports.academicOverview'),
      description: t('reports.academicOverviewDesc'),
      icon: GraduationCap,
      category: 'academic'
    },
    {
      id: 'attendance_analytics',
      name: t('reports.attendanceAnalytics'),
      description: t('reports.attendanceAnalyticsDesc'),
      icon: Users,
      category: 'attendance'
    },
    {
      id: 'performance_trends',
      name: t('reports.performanceTrends'),
      description: t('reports.performanceTrendsDesc'),
      icon: TrendingUp,
      category: 'academic'
    },
    {
      id: 'teacher_effectiveness',
      name: t('reports.teacherEffectiveness'),
      description: t('reports.teacherEffectivenessDesc'),
      icon: Target,
      category: 'staff'
    },
    {
      id: 'system_usage',
      name: t('reports.systemUsage'),
      description: t('reports.systemUsageDesc'),
      icon: Activity,
      category: 'system'
    },
    {
      id: 'financial_summary',
      name: t('reports.financialSummary'),
      description: t('reports.financialSummaryDesc'),
      icon: BarChart3,
      category: 'financial'
    }
  ]

  const reportData = {
    academic_overview: {
      summary: {
        total_students: 1250,
        total_teachers: 68,
        total_classes: 42,
        avg_performance: 76.8,
        performance_trend: 'improving'
      },
      subjects_performance: [
        { name: 'Mathematics', avg_score: 72.5, trend: 'improving', students: 425 },
        { name: 'Arabic', avg_score: 81.2, trend: 'stable', students: 450 },
        { name: 'Physics', avg_score: 68.9, trend: 'declining', students: 380 },
        { name: 'Chemistry', avg_score: 75.3, trend: 'improving', students: 360 },
        { name: 'French', avg_score: 69.7, trend: 'stable', students: 420 }
      ],
      grade_distribution: [
        { grade: 'A (90-100%)', count: 156, percentage: 12.5 },
        { grade: 'B (80-89%)', count: 287, percentage: 23.0 },
        { grade: 'C (70-79%)', count: 398, percentage: 31.8 },
        { grade: 'D (60-69%)', count: 284, percentage: 22.7 },
        { grade: 'F (<60%)', count: 125, percentage: 10.0 }
      ]
    },
    attendance_analytics: {
      overall_stats: {
        total_sessions: 15600,
        present: 14040,
        absent: 936,
        late: 624,
        overall_rate: 90.0
      },
      by_grade: [
        { grade: '1ère Année', rate: 92.3, students: 320 },
        { grade: '2ème Année', rate: 89.7, students: 305 },
        { grade: '3ème Année', rate: 87.2, students: 290 },
        { grade: 'Terminale', rate: 91.8, students: 285 }
      ],
      flags_summary: {
        total_flags: 234,
        pending_clearance: 45,
        under_review: 67,
        cleared: 122
      }
    }
  }

  const getTrendIcon = (trend) => {
    switch(trend) {
      case 'improving': return <TrendingUp className="h-4 w-4 text-green-600" />
      case 'declining': return <TrendingDown className="h-4 w-4 text-red-600" />
      case 'stable': return <div className="h-4 w-4 bg-yellow-400 rounded-full" />
      default: return <div className="h-4 w-4 bg-gray-400 rounded-full" />
    }
  }

  const getPerformanceColor = (score) => {
    if (score >= 80) return 'text-green-600 bg-green-50'
    if (score >= 70) return 'text-yellow-600 bg-yellow-50'
    return 'text-red-600 bg-red-50'
  }

  const getCategoryColor = (category) => {
    const colors = {
      academic: 'bg-blue-100 text-blue-800',
      attendance: 'bg-green-100 text-green-800',
      staff: 'bg-purple-100 text-purple-800',
      system: 'bg-orange-100 text-orange-800',
      financial: 'bg-yellow-100 text-yellow-800'
    }
    return colors[category] || colors.system
  }

  const generateReport = async () => {
    setIsGenerating(true)
    console.log('Generating report:', selectedReport, dateRange)
    
    // Simulate API call
    setTimeout(() => {
      setIsGenerating(false)
    }, 3000)
  }

  const exportReport = (format) => {
    console.log('Export report as:', format)
    // API call to export report
  }

  const scheduleReport = () => {
    console.log('Schedule recurring report')
    // Open scheduling modal
  }

  const currentData = reportData[selectedReport]

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-blue-500" />
              {t('admin.comprehensiveReporting')}
            </CardTitle>
            <CardDescription>
              {t('admin.comprehensiveReportingDescription')}
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
        <div className="grid grid-cols-2 gap-4 p-3 bg-accent/30 rounded-lg">
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
              <option value="custom">{t('reports.customRange')}</option>
            </select>
          </div>
          
          <div>
            <label className="text-sm font-medium">{t('reports.exportFormat')}</label>
            <div className="flex gap-2 mt-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => exportReport('pdf')}
              >
                <Download className="h-4 w-4 mr-1" />
                PDF
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => exportReport('excel')}
              >
                <Download className="h-4 w-4 mr-1" />
                Excel
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => exportReport('csv')}
              >
                <Download className="h-4 w-4 mr-1" />
                CSV
              </Button>
            </div>
          </div>
        </div>

        {/* Report Types Grid */}
        <div className="grid grid-cols-2 gap-3">
          {reportTypes.map((report) => {
            const Icon = report.icon
            return (
              <div
                key={report.id}
                className={`p-3 border rounded-lg cursor-pointer transition-all ${
                  selectedReport === report.id 
                    ? 'bg-blue-50 border-blue-200 shadow-sm' 
                    : 'hover:bg-accent/50 border-border'
                }`}
                onClick={() => setSelectedReport(report.id)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-blue-500" />
                    <span className="font-medium text-sm">{report.name}</span>
                  </div>
                  <Badge className={getCategoryColor(report.category)}>
                    {t(`reports.${report.category}`)}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">{report.description}</p>
              </div>
            )
          })}
        </div>

        {/* Report Preview */}
        {currentData && (
          <div className="space-y-4 border-t pt-4">
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4 text-blue-500" />
              <h3 className="font-medium">{t('reports.preview')}</h3>
            </div>

            {/* Academic Overview Preview */}
            {selectedReport === 'academic_overview' && (
              <div className="space-y-4">
                {/* Summary Stats */}
                <div className="grid grid-cols-4 gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="text-center">
                    <div className="text-lg font-bold text-blue-600">{currentData.summary.total_students}</div>
                    <div className="text-xs text-blue-700">{t('admin.totalStudents')}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-blue-600">{currentData.summary.total_teachers}</div>
                    <div className="text-xs text-blue-700">{t('admin.totalTeachers')}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-blue-600">{currentData.summary.total_classes}</div>
                    <div className="text-xs text-blue-700">{t('admin.totalClasses')}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-blue-600">{currentData.summary.avg_performance}%</div>
                    <div className="text-xs text-blue-700">{t('reports.avgPerformance')}</div>
                  </div>
                </div>

                {/* Subject Performance */}
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">{t('reports.subjectPerformance')}</h4>
                  {currentData.subjects_performance.map((subject, index) => (
                    <div key={index} className="flex items-center justify-between p-2 border rounded bg-card">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{subject.name}</span>
                        {getTrendIcon(subject.trend)}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">{subject.students} {t('student.students')}</span>
                        <div className={`px-2 py-1 rounded text-xs font-medium ${getPerformanceColor(subject.avg_score)}`}>
                          {subject.avg_score}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Grade Distribution */}
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">{t('reports.gradeDistribution')}</h4>
                  {currentData.grade_distribution.map((grade, index) => (
                    <div key={index} className="flex items-center justify-between p-2 border rounded bg-card">
                      <span className="text-sm">{grade.grade}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{grade.count}</span>
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: `${grade.percentage}%` }}
                          ></div>
                        </div>
                        <span className="text-xs text-muted-foreground">{grade.percentage}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Attendance Analytics Preview */}
            {selectedReport === 'attendance_analytics' && (
              <div className="space-y-4">
                {/* Overall Stats */}
                <div className="grid grid-cols-4 gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-600">{currentData.overall_stats.overall_rate}%</div>
                    <div className="text-xs text-green-700">{t('attendance.overallRate')}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-600">{currentData.overall_stats.present}</div>
                    <div className="text-xs text-green-700">{t('attendance.present')}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-red-600">{currentData.overall_stats.absent}</div>
                    <div className="text-xs text-red-700">{t('attendance.absent')}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-yellow-600">{currentData.overall_stats.late}</div>
                    <div className="text-xs text-yellow-700">{t('attendance.late')}</div>
                  </div>
                </div>

                {/* By Grade */}
                <div className="space-y-2">
                  <h4 className="font-medium text-sm">{t('reports.attendanceByGrade')}</h4>
                  {currentData.by_grade.map((grade, index) => (
                    <div key={index} className="flex items-center justify-between p-2 border rounded bg-card">
                      <span className="text-sm font-medium">{grade.grade}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">{grade.students} {t('student.students')}</span>
                        <div className={`px-2 py-1 rounded text-xs font-medium ${getPerformanceColor(grade.rate)}`}>
                          {grade.rate}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Flags Summary */}
                <div className="grid grid-cols-4 gap-3 p-3 bg-red-50 rounded-lg border border-red-200">
                  <div className="text-center">
                    <div className="text-lg font-bold text-red-600">{currentData.flags_summary.total_flags}</div>
                    <div className="text-xs text-red-700">{t('attendance.totalFlags')}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-red-600">{currentData.flags_summary.pending_clearance}</div>
                    <div className="text-xs text-red-700">{t('attendance.pending')}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-yellow-600">{currentData.flags_summary.under_review}</div>
                    <div className="text-xs text-yellow-700">{t('attendance.under_review')}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-600">{currentData.flags_summary.cleared}</div>
                    <div className="text-xs text-green-700">{t('attendance.cleared')}</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-4 border-t">
          <Button
            onClick={generateReport}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <>
                <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
                {t('reports.generating')}
              </>
            ) : (
              <>
                <FileText className="h-4 w-4 mr-1" />
                {t('reports.generateReport')}
              </>
            )}
          </Button>
          
          <Button variant="outline" onClick={() => exportReport('pdf')}>
            <Download className="h-4 w-4 mr-1" />
            {t('reports.export')}
          </Button>
          
          <Button variant="outline" onClick={() => console.log('View detailed analytics')}>
            <BarChart3 className="h-4 w-4 mr-1" />
            {t('reports.detailedAnalytics')}
          </Button>
          
          <Button variant="outline" onClick={scheduleReport}>
            <Clock className="h-4 w-4 mr-1" />
            {t('reports.autoSchedule')}
          </Button>
        </div>

        {/* Recent Reports */}
        <div className="space-y-2 pt-4 border-t">
          <h4 className="font-medium text-sm">{t('reports.recentReports')}</h4>
          <div className="space-y-2">
            {[
              { name: 'Academic Overview - September 2024', date: '2024-09-01', status: 'completed', type: 'pdf' },
              { name: 'Attendance Analytics - August 2024', date: '2024-08-31', status: 'completed', type: 'excel' },
              { name: 'Performance Trends - Q1 2024', date: '2024-08-30', status: 'processing', type: 'pdf' }
            ].map((report, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-accent/30 rounded">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-gray-500" />
                  <div>
                    <div className="text-sm font-medium">{report.name}</div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(report.date).toLocaleDateString()} • {report.type.toUpperCase()}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {report.status === 'completed' ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <Clock className="h-4 w-4 text-yellow-600" />
                  )}
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default ComprehensiveReporting