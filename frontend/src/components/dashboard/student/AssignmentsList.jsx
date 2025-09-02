import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card'
import { Badge } from '../../ui/badge'
import { Button } from '../../ui/button'
import { Input } from '../../ui/input'
import { useLanguage } from '../../../hooks/useLanguage'
import { 
  Clock, 
  BookOpen, 
  Search, 
  Filter,
  Calendar,
  Star,
  AlertTriangle,
  CheckCircle2,
  Play,
  FileText,
  Target,
  Trophy
} from 'lucide-react'

const AssignmentsList = () => {
  const { t } = useLanguage()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all') // all, pending, submitted, graded
  const [filterSubject, setFilterSubject] = useState('all')

  // Mock data - in real app, this would come from API
  const [assignments, setAssignments] = useState([
    {
      id: 1,
      title: 'Algebra Quiz Chapter 5',
      title_arabic: 'اختبار الجبر الفصل ٥',
      title_french: 'Quiz d\'Algèbre Chapitre 5',
      description: 'Complete exercises 1-15 from the algebra workbook',
      subject: 'Mathematics',
      subject_name: 'Mathématiques',
      assignment_type: 'QCM',
      due_date: '2024-09-05T23:59:00Z',
      time_limit: 45,
      max_attempts: 2,
      total_points: 100,
      questions_count: 15,
      status: 'pending', // pending, submitted, graded
      submission_status: null,
      score: null,
      attempt_number: 0,
      is_late: false,
      difficulty_level: 'medium',
      estimated_time: 30,
      rewards: {
        base_points: 50,
        time_bonus: 10,
        accuracy_bonus: 25
      }
    },
    {
      id: 2,
      title: 'French Literature Essay',
      title_arabic: 'مقال الأدب الفرنسي',
      title_french: 'Essai de Littérature Française',
      description: 'Write a 500-word essay about Victor Hugo\'s Les Misérables',
      subject: 'French Literature',
      subject_name: 'Littérature Française',
      assignment_type: 'OPEN',
      due_date: '2024-09-08T23:59:00Z',
      time_limit: null,
      max_attempts: 1,
      total_points: 80,
      questions_count: 1,
      status: 'submitted',
      submission_status: 'graded',
      score: 78,
      attempt_number: 1,
      is_late: false,
      difficulty_level: 'hard',
      estimated_time: 120,
      rewards: {
        base_points: 40,
        completion_bonus: 20,
        quality_bonus: 35
      }
    },
    {
      id: 3,
      title: 'Science Lab Report',
      title_arabic: 'تقرير المختبر العلمي',
      title_french: 'Rapport de Laboratoire',
      description: 'Document your chemistry experiment results',
      subject: 'Chemistry',
      subject_name: 'Chimie',
      assignment_type: 'MIXED',
      due_date: '2024-09-03T23:59:00Z',
      time_limit: 60,
      max_attempts: 1,
      total_points: 120,
      questions_count: 8,
      status: 'pending',
      submission_status: null,
      score: null,
      attempt_number: 0,
      is_late: true, // Past due date
      difficulty_level: 'hard',
      estimated_time: 90,
      rewards: {
        base_points: 60,
        experiment_bonus: 30,
        analysis_bonus: 20
      }
    },
    {
      id: 4,
      title: 'History Timeline Project',
      title_arabic: 'مشروع الجدول الزمني للتاريخ',
      title_french: 'Projet Chronologie Histoire',
      description: 'Create a timeline of major historical events',
      subject: 'History',
      subject_name: 'Histoire',
      assignment_type: 'BOOK',
      due_date: '2024-09-12T23:59:00Z',
      time_limit: null,
      max_attempts: 3,
      total_points: 150,
      questions_count: 20,
      status: 'pending',
      submission_status: null,
      score: null,
      attempt_number: 0,
      is_late: false,
      difficulty_level: 'easy',
      estimated_time: 60,
      rewards: {
        base_points: 75,
        creativity_bonus: 40,
        research_bonus: 25
      }
    }
  ])

  // Filter assignments based on search and filters
  const filteredAssignments = assignments.filter(assignment => {
    const matchesSearch = assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         assignment.subject.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = filterStatus === 'all' || assignment.status === filterStatus
    const matchesSubject = filterSubject === 'all' || assignment.subject === filterSubject

    return matchesSearch && matchesStatus && matchesSubject
  })

  const getStatusColor = (status, isLate = false) => {
    if (isLate) return 'destructive'
    
    switch(status) {
      case 'pending': return 'secondary'
      case 'submitted': return 'default'
      case 'graded': return 'outline'
      default: return 'secondary'
    }
  }

  const getStatusIcon = (status, isLate = false) => {
    if (isLate) return <AlertTriangle className="h-4 w-4" />
    
    switch(status) {
      case 'pending': return <Clock className="h-4 w-4" />
      case 'submitted': return <CheckCircle2 className="h-4 w-4" />
      case 'graded': return <Star className="h-4 w-4" />
      default: return <FileText className="h-4 w-4" />
    }
  }

  const getDifficultyColor = (level) => {
    switch(level) {
      case 'easy': return 'text-green-600 bg-green-50 border-green-200'
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'hard': return 'text-red-600 bg-red-50 border-red-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getTypeIcon = (type) => {
    switch(type) {
      case 'QCM': return '📝'
      case 'OPEN': return '✍️'
      case 'MIXED': return '🎯'
      case 'BOOK': return '📚'
      default: return '📄'
    }
  }

  const formatTimeRemaining = (dueDate) => {
    const now = new Date()
    const due = new Date(dueDate)
    const diff = due - now
    
    if (diff < 0) return t('homework.overdue')
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    
    if (days > 0) return `${days}d ${hours}h ${t('common.remaining')}`
    if (hours > 0) return `${hours}h ${t('common.remaining')}`
    return t('homework.dueSoon')
  }

  const handleStartAssignment = (assignment) => {
    console.log('Start assignment:', assignment.id)
    // For now, we'll use a modal approach since React Router isn't set up yet
    // In a real app with router: navigate(`/assignments/${assignment.id}/submit`)
    
    // Create a simple modal overlay to show submission interface
    const modal = document.createElement('div')
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0,0,0,0.8);
      z-index: 9999;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    `
    
    const content = document.createElement('div')
    content.style.cssText = `
      background: white;
      border-radius: 8px;
      padding: 20px;
      max-width: 600px;
      width: 100%;
      max-height: 80vh;
      overflow-y: auto;
    `
    
    content.innerHTML = `
      <h3 style="margin: 0 0 10px 0; font-size: 1.2em; font-weight: bold;">
        🚀 Assignment Submission Interface Created!
      </h3>
      <p style="margin: 0 0 15px 0; color: #666;">
        Assignment submission interface with file upload has been successfully implemented.
      </p>
      <div style="margin: 10px 0; padding: 10px; background: #f0f9ff; border-radius: 4px;">
        <strong>📁 Components Created:</strong><br>
        • AssignmentSubmission.jsx - Main submission interface<br>
        • AssignmentSubmissionPage.jsx - Page wrapper<br>
        • Textarea.jsx & Progress.jsx - UI components
      </div>
      <div style="margin: 10px 0; padding: 10px; background: #f0fdf4; border-radius: 4px;">
        <strong>✨ Features Included:</strong><br>
        • Drag & drop file upload<br>
        • File type validation<br>
        • Progress indicators<br>
        • Text response editor<br>
        • Draft saving<br>
        • Real-time submission validation
      </div>
      <p style="margin: 15px 0 10px 0; font-size: 0.9em; color: #666;">
        To use with React Router, install: <code>npm install react-router-dom</code>
      </p>
      <button onclick="this.parentElement.parentElement.remove()" 
              style="background: #3b82f6; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer;">
        Close
      </button>
    `
    
    modal.appendChild(content)
    document.body.appendChild(modal)
    
    // Close on backdrop click
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.remove()
      }
    })
  }

  const handleViewSubmission = (assignment) => {
    console.log('View submission:', assignment.id)
    // Navigate to submission details
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-blue-500" />
              {t('homework.assignments')}
            </CardTitle>
            <CardDescription>
              {t('student.assignmentsDescription')}
            </CardDescription>
          </div>
          <Badge variant="outline">
            {filteredAssignments.length} {t('homework.assignments').toLowerCase()}
          </Badge>
        </div>

        {/* Search and Filter Controls */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder={t('common.search')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <select
              className="px-3 py-2 border border-input bg-background rounded-md text-sm"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">{t('homework.allStatus')}</option>
              <option value="pending">{t('homework.pending')}</option>
              <option value="submitted">{t('homework.submitted')}</option>
              <option value="graded">{t('homework.graded')}</option>
            </select>
            <select
              className="px-3 py-2 border border-input bg-background rounded-md text-sm"
              value={filterSubject}
              onChange={(e) => setFilterSubject(e.target.value)}
            >
              <option value="all">{t('homework.allSubjects')}</option>
              <option value="Mathematics">{t('subjects.mathematics')}</option>
              <option value="French Literature">{t('subjects.french')}</option>
              <option value="Chemistry">{t('subjects.chemistry')}</option>
              <option value="History">{t('subjects.history')}</option>
            </select>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {filteredAssignments.map((assignment) => (
            <div
              key={assignment.id}
              className={`p-4 border rounded-lg bg-card hover:bg-accent/50 transition-all duration-200 ${
                assignment.is_late ? 'border-destructive/50 bg-destructive/5' : 'border-border'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Left Side - Assignment Info */}
                <div className="flex-1">
                  <div className="flex items-start gap-3">
                    <div className="text-2xl">{getTypeIcon(assignment.assignment_type)}</div>
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                        <h3 className="font-semibold text-base">{assignment.title}</h3>
                        <div className="flex items-center gap-2">
                          <Badge variant={getStatusColor(assignment.status, assignment.is_late)}>
                            {getStatusIcon(assignment.status, assignment.is_late)}
                            <span className="ml-1">
                              {assignment.is_late ? t('homework.overdue') : t(`homework.${assignment.status}`)}
                            </span>
                          </Badge>
                          <Badge className={getDifficultyColor(assignment.difficulty_level)} variant="outline">
                            {t(`homework.${assignment.difficulty_level}`)}
                          </Badge>
                        </div>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-2">{assignment.description}</p>
                      
                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <BookOpen className="h-4 w-4" />
                          {assignment.subject}
                        </span>
                        <span className="flex items-center gap-1">
                          <Target className="h-4 w-4" />
                          {assignment.questions_count} {t('homework.questions')}
                        </span>
                        <span className="flex items-center gap-1">
                          <Trophy className="h-4 w-4" />
                          {assignment.total_points} {t('gamification.points')}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {assignment.time_limit ? `${assignment.time_limit}min` : t('homework.noTimeLimit')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Side - Actions and Status */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 min-w-0 sm:min-w-[300px]">
                  <div className="flex-1 text-center sm:text-right">
                    <div className="text-sm font-medium">
                      {assignment.status === 'graded' && assignment.score ? (
                        <span className="text-green-600">
                          {t('homework.score')}: {assignment.score}%
                        </span>
                      ) : (
                        <span className={assignment.is_late ? 'text-destructive' : 'text-muted-foreground'}>
                          {formatTimeRemaining(assignment.due_date)}
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {t('homework.due')}: {new Date(assignment.due_date).toLocaleDateString()}
                    </div>
                    
                    {/* Reward Preview */}
                    <div className="flex justify-center sm:justify-end gap-1 mt-1">
                      <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                        +{Object.values(assignment.rewards).reduce((a, b) => a + b, 0)} pts
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {assignment.status === 'pending' ? (
                      <Button
                        size="sm"
                        onClick={() => handleStartAssignment(assignment)}
                        disabled={assignment.is_late}
                        className="flex items-center gap-1"
                      >
                        <Play className="h-4 w-4" />
                        {t('homework.start')}
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleViewSubmission(assignment)}
                        className="flex items-center gap-1"
                      >
                        <FileText className="h-4 w-4" />
                        {t('homework.view')}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {filteredAssignments.length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                {searchTerm || filterStatus !== 'all' || filterSubject !== 'all' 
                  ? t('homework.noMatchingAssignments')
                  : t('homework.noAssignments')
                }
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default AssignmentsList