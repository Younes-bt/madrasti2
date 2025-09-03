import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card'
import { Badge } from '../../ui/badge'
import { Button } from '../../ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar'
import { useLanguage } from '../../../hooks/useLanguage'
import { 
  GraduationCap,
  CheckCircle,
  Clock,
  AlertCircle,
  Eye,
  Edit,
  Save,
  TrendingUp,
  TrendingDown,
  Minus,
  Award,
  Target,
  BarChart3
} from 'lucide-react'

const AutoGradingDisplay = () => {
  const { t } = useLanguage()
  const [selectedAssignment, setSelectedAssignment] = useState(null)

  const assignments = [
    {
      id: 1,
      title: 'Mathematics Quiz - Chapter 5',
      type: 'QCM',
      total_questions: 15,
      auto_graded: 12,
      manual_review: 3,
      total_submissions: 24,
      graded_submissions: 20,
      pending_review: 4,
      avg_score: 78,
      created_at: '2024-09-01T10:00:00Z',
      due_date: '2024-09-05T23:59:59Z',
      status: 'active'
    },
    {
      id: 2, 
      title: 'Physics Lab Report',
      type: 'MIXED',
      total_questions: 8,
      auto_graded: 4,
      manual_review: 4,
      total_submissions: 22,
      graded_submissions: 18,
      pending_review: 4,
      avg_score: 85,
      created_at: '2024-08-28T09:00:00Z',
      due_date: '2024-09-02T23:59:59Z',
      status: 'completed'
    }
  ]

  const submissions = [
    {
      id: 1,
      student_name: 'Ahmed Hassan',
      student_id: 101,
      assignment_id: 1,
      auto_score: 12,
      manual_score: 3,
      total_score: 15,
      max_score: 20,
      percentage: 75,
      status: 'graded',
      auto_grading_status: 'completed',
      manual_review_needed: false,
      submitted_at: '2024-09-02T14:30:00Z',
      graded_at: '2024-09-02T14:31:00Z',
      feedback_generated: true,
      confidence_score: 95
    },
    {
      id: 2,
      student_name: 'Fatima Al-Zahra',
      student_id: 102,
      assignment_id: 1,
      auto_score: 10,
      manual_score: null,
      total_score: null,
      max_score: 20,
      percentage: null,
      status: 'needs_review',
      auto_grading_status: 'completed',
      manual_review_needed: true,
      submitted_at: '2024-09-02T15:45:00Z',
      graded_at: null,
      feedback_generated: false,
      confidence_score: 72
    },
    {
      id: 3,
      student_name: 'Omar Benali',
      student_id: 103, 
      assignment_id: 1,
      auto_score: null,
      manual_score: null,
      total_score: null,
      max_score: 20,
      percentage: null,
      status: 'processing',
      auto_grading_status: 'in_progress',
      manual_review_needed: false,
      submitted_at: '2024-09-02T16:20:00Z',
      graded_at: null,
      feedback_generated: false,
      confidence_score: null
    }
  ]

  const getStatusBadge = (status) => {
    const styles = {
      graded: 'bg-green-100 text-green-800',
      needs_review: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      failed: 'bg-red-100 text-red-800'
    }
    
    return (
      <Badge className={styles[status] || styles.processing}>
        {t(`grading.${status}`)}
      </Badge>
    )
  }

  const getStatusIcon = (status) => {
    switch(status) {
      case 'graded': return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'needs_review': return <AlertCircle className="h-4 w-4 text-yellow-600" />
      case 'processing': return <Clock className="h-4 w-4 text-blue-600" />
      default: return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  const getScoreColor = (percentage) => {
    if (percentage >= 80) return 'text-green-600'
    if (percentage >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const handleReviewSubmission = (submissionId) => {
    console.log('Review submission:', submissionId)
    // Navigate to detailed grading interface
  }

  const handleApproveGrade = (submissionId) => {
    console.log('Approve auto grade:', submissionId)
    // API call to approve auto-generated grade
  }

  const getGradingStats = () => {
    const totalSubmissions = submissions.length
    const gradedCount = submissions.filter(s => s.status === 'graded').length
    const needsReviewCount = submissions.filter(s => s.status === 'needs_review').length
    const processingCount = submissions.filter(s => s.status === 'processing').length
    
    return {
      total: totalSubmissions,
      graded: gradedCount,
      needsReview: needsReviewCount,
      processing: processingCount,
      completionRate: totalSubmissions > 0 ? Math.round((gradedCount / totalSubmissions) * 100) : 0
    }
  }

  const stats = getGradingStats()

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-blue-500" />
              {t('teacher.autoGrading')}
            </CardTitle>
            <CardDescription>
              {t('teacher.autoGradingDescription')}
            </CardDescription>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <BarChart3 className="h-4 w-4 mr-1" />
              {t('teacher.gradingAnalytics')}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Grading Summary */}
        <div className="grid grid-cols-4 gap-3 p-3 bg-accent/30 rounded-lg">
          <div className="text-center">
            <div className="text-lg font-bold">{stats.total}</div>
            <div className="text-xs text-muted-foreground">{t('assignment.submissions')}</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-green-600">{stats.graded}</div>
            <div className="text-xs text-muted-foreground">{t('grading.graded')}</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-yellow-600">{stats.needsReview}</div>
            <div className="text-xs text-muted-foreground">{t('grading.needs_review')}</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-blue-600">{stats.processing}</div>
            <div className="text-xs text-muted-foreground">{t('grading.processing')}</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span>{t('grading.progress')}</span>
            <span>{stats.completionRate}% {t('common.completed')}</span>
          </div>
          <div className="w-full bg-secondary rounded-full h-2">
            <div 
              className="bg-green-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${stats.completionRate}%` }}
            ></div>
          </div>
        </div>

        {/* Assignment Selection */}
        <div className="space-y-2">
          <h4 className="font-medium text-sm">{t('assignment.recentAssignments')}</h4>
          <div className="grid gap-2">
            {assignments.slice(0, 2).map((assignment) => (
              <div
                key={assignment.id}
                className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                  selectedAssignment?.id === assignment.id ? 'bg-blue-50 border-blue-200' : 'hover:bg-accent/50'
                }`}
                onClick={() => setSelectedAssignment(assignment)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-sm">{assignment.title}</div>
                    <div className="text-xs text-muted-foreground">
                      {assignment.graded_submissions}/{assignment.total_submissions} {t('grading.graded')} 
                      • {t('common.average')}: {assignment.avg_score}%
                    </div>
                  </div>
                  <Badge className={assignment.type === 'QCM' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'}>
                    {assignment.type}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Submissions List */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-sm">{t('assignment.submissions')}</h4>
            <Button variant="ghost" size="sm">
              {t('common.viewAll')}
            </Button>
          </div>
          
          <div className="space-y-2 max-h-80 overflow-y-auto">
            {submissions.map((submission) => (
              <div
                key={submission.id}
                className="flex items-center justify-between p-3 border rounded-lg bg-card hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="text-xs">
                      {submission.student_name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div>
                    <div className="font-medium text-sm">{submission.student_name}</div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      {getStatusIcon(submission.status)}
                      <span>
                        {submission.confidence_score && (
                          <>AI {t('grading.confidence')}: {submission.confidence_score}%</>
                        )}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  {submission.total_score !== null && (
                    <div className="text-right">
                      <div className={`font-bold ${getScoreColor(submission.percentage)}`}>
                        {submission.total_score}/{submission.max_score}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {submission.percentage}%
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-1">
                    {getStatusBadge(submission.status)}
                    
                    {submission.status === 'needs_review' && (
                      <Button
                        size="sm"
                        onClick={() => handleReviewSubmission(submission.id)}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        {t('grading.review')}
                      </Button>
                    )}
                    
                    {submission.status === 'graded' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleReviewSubmission(submission.id)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Auto-Grading Insights */}
        <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="font-medium text-sm text-blue-800 mb-2 flex items-center gap-1">
            <Target className="h-4 w-4" />
            {t('grading.insights')}
          </h4>
          <div className="space-y-1 text-sm text-blue-700">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-3 w-3" />
              <span>80% {t('grading.autoGradingAccuracy')}</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="h-3 w-3" />
              <span>{t('grading.commonMistakes')}: Question 7, Question 12</span>
            </div>
            <div className="flex items-center gap-2">
              <BarChart3 className="h-3 w-3" />
              <span>{t('grading.classAverage')}: 78% (+3% {t('grading.fromLastWeek')})</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-2 pt-4 border-t">
          <Button
            onClick={() => console.log('Process pending grades')}
            disabled={stats.processing === 0}
          >
            <CheckCircle className="h-4 w-4 mr-1" />
            {t('grading.processAll')}
          </Button>
          <Button
            variant="outline"
            onClick={() => console.log('Review flagged submissions')}
            disabled={stats.needsReview === 0}
          >
            <AlertCircle className="h-4 w-4 mr-1" />
            {t('grading.reviewFlagged')}
          </Button>
          <Button
            variant="outline"
            onClick={() => console.log('Export grades')}
          >
            <Save className="h-4 w-4 mr-1" />
            {t('grading.exportGrades')}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default AutoGradingDisplay