import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card'
import { Badge } from '../../ui/badge'
import { Button } from '../../ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar'
import { useLanguage } from '../../../hooks/useLanguage'
import { 
  FileText,
  Download,
  TrendingUp,
  TrendingDown,
  Calendar,
  User,
  BookOpen,
  Target,
  Award,
  Clock,
  BarChart3,
  PieChart,
  Eye,
  Printer,
  Share,
  Filter
} from 'lucide-react'

const DetailedProgressReports = () => {
  const { t } = useLanguage()
  const [selectedChild, setSelectedChild] = useState('child1')
  const [reportType, setReportType] = useState('monthly') // weekly, monthly, semester, year
  const [selectedPeriod, setSelectedPeriod] = useState('2024-09')
  const [isGenerating, setIsGenerating] = useState(false)

  const children = [
    { id: 'child1', name: 'Ahmed Hassan', class: '1ère C', avatar: null },
    { id: 'child2', name: 'Fatima Hassan', class: '3ème A', avatar: null }
  ]

  const reportData = {
    child1: {
      basic_info: {
        name: 'Ahmed Hassan',
        class: '1ère Année C',
        academic_year: '2024-2025',
        report_period: 'September 2024',
        generated_at: '2024-09-02T16:00:00Z'
      },
      academic_performance: {
        overall_average: 78.5,
        class_rank: 8,
        total_students: 24,
        trend: 'improving', // improving, declining, stable
        subjects: [
          {
            name: 'Mathematics',
            grade: 85,
            coefficient: 4,
            assignments_completed: 12,
            assignments_total: 15,
            attendance_rate: 95,
            teacher_comment: 'Excellent progress in algebra, needs work on geometry',
            trend: 'improving'
          },
          {
            name: 'Physics',
            grade: 72,
            coefficient: 3,
            assignments_completed: 8,
            assignments_total: 10,
            attendance_rate: 90,
            teacher_comment: 'Good understanding of concepts, more practice needed',
            trend: 'stable'
          },
          {
            name: 'Chemistry',
            grade: 79,
            coefficient: 3,
            assignments_completed: 10,
            assignments_total: 12,
            attendance_rate: 92,
            teacher_comment: 'Shows great interest and participation',
            trend: 'improving'
          },
          {
            name: 'Arabic',
            grade: 88,
            coefficient: 4,
            assignments_completed: 14,
            assignments_total: 15,
            attendance_rate: 98,
            teacher_comment: 'Outstanding literary analysis skills',
            trend: 'stable'
          },
          {
            name: 'French',
            grade: 75,
            coefficient: 3,
            assignments_completed: 11,
            assignments_total: 14,
            attendance_rate: 88,
            teacher_comment: 'Good comprehension, needs improvement in writing',
            trend: 'declining'
          }
        ]
      },
      attendance_summary: {
        total_sessions: 120,
        present: 108,
        absent: 8,
        late: 4,
        attendance_rate: 90,
        flags_received: 2,
        flags_cleared: 1
      },
      gamification_stats: {
        total_points: 2450,
        points_this_period: 340,
        current_level: 12,
        badges_earned: 15,
        current_streak: 8,
        leaderboard_position: 6
      },
      behavioral_notes: [
        {
          date: '2024-09-01',
          teacher: 'Mr. Alami',
          subject: 'Mathematics',
          type: 'positive',
          comment: 'Helped classmates with difficult problems'
        },
        {
          date: '2024-08-28',
          teacher: 'Mrs. Bennani',
          subject: 'Physics',
          type: 'improvement',
          comment: 'Needs to arrive on time for lab sessions'
        }
      ],
      strengths: [
        'Strong mathematical reasoning',
        'Excellent Arabic language skills',
        'Good collaborative spirit',
        'Consistent study habits'
      ],
      areas_for_improvement: [
        'French writing skills',
        'Punctuality for morning classes',
        'Physics problem-solving speed',
        'Chemistry lab technique'
      ],
      recommendations: [
        'Consider additional French tutoring',
        'Practice physics problems daily',
        'Join chemistry lab study group',
        'Set earlier sleep schedule for better attendance'
      ]
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

  const getGradeColor = (grade) => {
    if (grade >= 80) return 'text-green-600 bg-green-50'
    if (grade >= 60) return 'text-yellow-600 bg-yellow-50'
    return 'text-red-600 bg-red-50'
  }

  const generateReport = async () => {
    setIsGenerating(true)
    console.log('Generating report for:', selectedChild, reportType, selectedPeriod)
    
    // Simulate API call
    setTimeout(() => {
      setIsGenerating(false)
    }, 2000)
  }

  const exportReport = (format) => {
    console.log('Export report as:', format)
    // API call to export report
  }

  const currentData = reportData[selectedChild]
  const attendanceRate = Math.round((currentData.attendance_summary.present / currentData.attendance_summary.total_sessions) * 100)

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-500" />
              {t('parent.progressReports')}
            </CardTitle>
            <CardDescription>
              {t('parent.progressReportsDescription')}
            </CardDescription>
          </div>
          
          <div className="flex items-center gap-2">
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
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Report Configuration */}
        <div className="grid grid-cols-3 gap-4 p-3 bg-accent/30 rounded-lg">
          <div>
            <label className="text-sm font-medium">{t('student.child')}</label>
            <div className="flex gap-2 mt-1">
              {children.map((child) => (
                <Button
                  key={child.id}
                  variant={selectedChild === child.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedChild(child.id)}
                >
                  {child.name.split(' ')[0]}
                </Button>
              ))}
            </div>
          </div>
          
          <div>
            <label className="text-sm font-medium">{t('reports.period')}</label>
            <select 
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full mt-1 border rounded px-2 py-1 text-sm"
            >
              <option value="weekly">{t('reports.weekly')}</option>
              <option value="monthly">{t('reports.monthly')}</option>
              <option value="semester">{t('reports.semester')}</option>
              <option value="year">{t('reports.yearly')}</option>
            </select>
          </div>
          
          <div>
            <label className="text-sm font-medium">{t('reports.date')}</label>
            <input
              type="month"
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="w-full mt-1 border rounded px-2 py-1 text-sm"
            />
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-4 gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="text-center">
            <div className="text-lg font-bold text-blue-600">{currentData.academic_performance.overall_average}%</div>
            <div className="text-xs text-blue-700">{t('reports.overallAverage')}</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-blue-600">#{currentData.academic_performance.class_rank}</div>
            <div className="text-xs text-blue-700">{t('reports.classRank')}</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-blue-600">{attendanceRate}%</div>
            <div className="text-xs text-blue-700">{t('attendance.rate')}</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-blue-600">{currentData.gamification_stats.current_level}</div>
            <div className="text-xs text-blue-700">{t('gamification.level')}</div>
          </div>
        </div>

        {/* Academic Performance */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-blue-500" />
            <h3 className="font-medium">{t('reports.academicPerformance')}</h3>
          </div>
          
          <div className="space-y-2">
            {currentData.academic_performance.subjects.map((subject, index) => (
              <div key={index} className="p-3 border rounded-lg bg-card">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{subject.name}</span>
                    {getTrendIcon(subject.trend)}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`px-2 py-1 rounded-full text-sm font-medium ${getGradeColor(subject.grade)}`}>
                      {subject.grade}%
                    </div>
                    <Badge variant="outline">Coef. {subject.coefficient}</Badge>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground mb-2">
                  <div>
                    {t('assignment.assignments')}: {subject.assignments_completed}/{subject.assignments_total}
                  </div>
                  <div>
                    {t('attendance.rate')}: {subject.attendance_rate}%
                  </div>
                </div>
                
                <div className="text-sm italic text-gray-700 bg-gray-50 p-2 rounded">
                  "{subject.teacher_comment}"
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Attendance Summary */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-green-500" />
            <h3 className="font-medium">{t('attendance.summary')}</h3>
          </div>
          
          <div className="grid grid-cols-4 gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
            <div className="text-center">
              <div className="text-lg font-bold text-green-600">{currentData.attendance_summary.present}</div>
              <div className="text-xs text-green-700">{t('attendance.present')}</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-red-600">{currentData.attendance_summary.absent}</div>
              <div className="text-xs text-red-700">{t('attendance.absent')}</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-yellow-600">{currentData.attendance_summary.late}</div>
              <div className="text-xs text-yellow-700">{t('attendance.late')}</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-orange-600">{currentData.attendance_summary.flags_received}</div>
              <div className="text-xs text-orange-700">{t('attendance.flags')}</div>
            </div>
          </div>
        </div>

        {/* Behavioral Notes */}
        {currentData.behavioral_notes.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-purple-500" />
              <h3 className="font-medium">{t('reports.behavioralNotes')}</h3>
            </div>
            
            <div className="space-y-2">
              {currentData.behavioral_notes.map((note, index) => (
                <div key={index} className={`p-3 rounded-lg border ${
                  note.type === 'positive' ? 'bg-green-50 border-green-200' : 'bg-yellow-50 border-yellow-200'
                }`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-muted-foreground">
                      {new Date(note.date).toLocaleDateString()} - {note.subject}
                    </span>
                    <Badge className={note.type === 'positive' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                      {t(`reports.${note.type}`)}
                    </Badge>
                  </div>
                  <div className="text-sm">{note.comment}</div>
                  <div className="text-xs text-muted-foreground mt-1">{note.teacher}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Strengths and Improvements */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4 text-green-500" />
              <h4 className="font-medium text-sm">{t('reports.strengths')}</h4>
            </div>
            <div className="space-y-1">
              {currentData.strengths.map((strength, index) => (
                <div key={index} className="text-sm text-green-700 bg-green-50 p-2 rounded">
                  • {strength}
                </div>
              ))}
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-orange-500" />
              <h4 className="font-medium text-sm">{t('reports.improvements')}</h4>
            </div>
            <div className="space-y-1">
              {currentData.areas_for_improvement.map((area, index) => (
                <div key={index} className="text-sm text-orange-700 bg-orange-50 p-2 rounded">
                  • {area}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recommendations */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-blue-500" />
            <h4 className="font-medium text-sm">{t('reports.recommendations')}</h4>
          </div>
          <div className="space-y-1">
            {currentData.recommendations.map((rec, index) => (
              <div key={index} className="text-sm text-blue-700 bg-blue-50 p-2 rounded">
                • {rec}
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-4 border-t">
          <Button
            onClick={generateReport}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <>
                <Clock className="h-4 w-4 mr-1 animate-spin" />
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
            <Printer className="h-4 w-4 mr-1" />
            {t('reports.print')}
          </Button>
          
          <Button variant="outline" onClick={() => console.log('Share report')}>
            <Share className="h-4 w-4 mr-1" />
            {t('reports.share')}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default DetailedProgressReports