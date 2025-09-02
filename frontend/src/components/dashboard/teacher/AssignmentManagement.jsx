import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card'
import { Badge } from '../../ui/badge'
import { Button } from '../../ui/button'
import { Input } from '../../ui/input'
import { useLanguage } from '../../../hooks/useLanguage'
import { 
  Plus,
  BookOpen,
  Search,
  Filter,
  Edit,
  Eye,
  Trash2,
  Clock,
  Users,
  CheckSquare,
  FileText,
  Target,
  BarChart3
} from 'lucide-react'

const AssignmentManagement = () => {
  const { t } = useLanguage()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all') // all, draft, published, closed
  const [filterClass, setFilterClass] = useState('all')

  const [assignments, setAssignments] = useState([
    {
      id: 1,
      title: 'Algebra Quiz Chapter 5',
      title_arabic: 'اختبار الجبر الفصل ٥',
      description: 'Complete exercises 1-15 from the algebra workbook',
      assignment_type: 'QCM',
      classes: ['1ère Année A', '1ère Année B'],
      due_date: '2024-09-05T23:59:00Z',
      created_at: '2024-09-01T08:00:00Z',
      status: 'published', // draft, published, closed
      total_points: 100,
      questions_count: 15,
      time_limit: 45,
      submissions_count: 28,
      total_students: 52,
      completion_rate: 53.8,
      average_score: 78.5,
      needs_grading: 5
    },
    {
      id: 2,
      title: 'Mathematics Final Exam',
      title_arabic: 'امتحان الرياضيات النهائي',
      description: 'Comprehensive exam covering all chapters',
      assignment_type: 'MIXED',
      classes: ['2ème Année A', '2ème Année B'],
      due_date: '2024-09-10T14:00:00Z',
      created_at: '2024-08-25T10:30:00Z',
      status: 'draft',
      total_points: 150,
      questions_count: 25,
      time_limit: 120,
      submissions_count: 0,
      total_students: 48,
      completion_rate: 0,
      average_score: 0,
      needs_grading: 0
    },
    {
      id: 3,
      title: 'Geometry Practice Quiz',
      title_arabic: 'اختبار ممارسة الهندسة',
      description: 'Practice quiz on geometric shapes and calculations',
      assignment_type: 'QCM',
      classes: ['1ère Année C'],
      due_date: '2024-09-03T23:59:00Z',
      created_at: '2024-08-30T15:00:00Z',
      status: 'closed',
      total_points: 75,
      questions_count: 12,
      time_limit: 30,
      submissions_count: 24,
      total_students: 24,
      completion_rate: 100,
      average_score: 85.2,
      needs_grading: 0
    },
    {
      id: 4,
      title: 'Calculus Problem Set',
      title_arabic: 'مجموعة مسائل التفاضل والتكامل',
      description: 'Advanced calculus problems for practice',
      assignment_type: 'OPEN',
      classes: ['3ème Année A'],
      due_date: '2024-09-08T23:59:00Z',
      created_at: '2024-09-01T09:00:00Z',
      status: 'published',
      total_points: 120,
      questions_count: 8,
      time_limit: null,
      submissions_count: 15,
      total_students: 28,
      completion_rate: 53.6,
      average_score: 0, // Not auto-graded
      needs_grading: 15
    }
  ])

  // Filter assignments
  const filteredAssignments = assignments.filter(assignment => {
    const matchesSearch = assignment.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || assignment.status === filterStatus
    const matchesClass = filterClass === 'all' || assignment.classes.some(c => c.includes(filterClass))
    
    return matchesSearch && matchesStatus && matchesClass
  })

  const getStatusColor = (status) => {
    switch(status) {
      case 'draft': return 'text-gray-700 bg-gray-100'
      case 'published': return 'text-green-700 bg-green-100'
      case 'closed': return 'text-red-700 bg-red-100'
      default: return 'text-gray-700 bg-gray-100'
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

  const formatDueDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = date - now
    
    if (diff < 0) return t('homework.overdue')
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    if (days === 0) return t('homework.dueToday')
    if (days === 1) return t('homework.dueTomorrow')
    return `${days} ${t('common.daysLeft')}`
  }

  const handleCreateAssignment = () => {
    console.log('Navigate to create assignment')
  }

  const handleEditAssignment = (assignment) => {
    console.log('Edit assignment:', assignment.id)
  }

  const handleViewAssignment = (assignment) => {
    console.log('View assignment:', assignment.id)
  }

  const handleDeleteAssignment = (assignment) => {
    console.log('Delete assignment:', assignment.id)
  }

  const handleGradeSubmissions = (assignment) => {
    console.log('Grade submissions for assignment:', assignment.id)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-blue-500" />
              {t('teacher.assignmentManagement')}
            </CardTitle>
            <CardDescription>
              {t('teacher.assignmentDescription')}
            </CardDescription>
          </div>
          <Button onClick={handleCreateAssignment}>
            <Plus className="h-4 w-4 mr-2" />
            {t('teacher.createAssignment')}
          </Button>
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
              <option value="all">{t('teacher.allStatus')}</option>
              <option value="draft">{t('teacher.draft')}</option>
              <option value="published">{t('teacher.published')}</option>
              <option value="closed">{t('teacher.closed')}</option>
            </select>
            <select
              className="px-3 py-2 border border-input bg-background rounded-md text-sm"
              value={filterClass}
              onChange={(e) => setFilterClass(e.target.value)}
            >
              <option value="all">{t('teacher.allClasses')}</option>
              <option value="1ère">1ère Année</option>
              <option value="2ème">2ème Année</option>
              <option value="3ème">3ème Année</option>
            </select>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {filteredAssignments.map((assignment) => (
            <div
              key={assignment.id}
              className="p-4 border rounded-lg bg-card hover:bg-accent/50 transition-colors"
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
                          <Badge className={getStatusColor(assignment.status)}>
                            {t(`teacher.${assignment.status}`)}
                          </Badge>
                          {assignment.needs_grading > 0 && (
                            <Badge variant="outline" className="text-orange-600 bg-orange-50">
                              {assignment.needs_grading} {t('teacher.needsGrading')}
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-2">{assignment.description}</p>
                      
                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {assignment.classes.join(', ')}
                        </span>
                        <span className="flex items-center gap-1">
                          <Target className="h-4 w-4" />
                          {assignment.questions_count} {t('homework.questions')}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {assignment.time_limit ? `${assignment.time_limit}min` : t('homework.noTimeLimit')}
                        </span>
                        <span className="flex items-center gap-1">
                          <CheckSquare className="h-4 w-4" />
                          {assignment.completion_rate.toFixed(1)}% {t('homework.completion')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Side - Stats and Actions */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 min-w-0 sm:min-w-[300px]">
                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-sm font-bold text-blue-600">
                        {assignment.submissions_count}/{assignment.total_students}
                      </div>
                      <div className="text-xs text-muted-foreground">{t('homework.submissions')}</div>
                    </div>
                    <div>
                      <div className="text-sm font-bold text-green-600">
                        {assignment.average_score > 0 ? `${assignment.average_score}%` : '-'}
                      </div>
                      <div className="text-xs text-muted-foreground">{t('homework.avgScore')}</div>
                    </div>
                  </div>

                  {/* Due Date */}
                  <div className="text-center sm:text-right">
                    <div className="text-sm font-medium">
                      {formatDueDate(assignment.due_date)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(assignment.due_date).toLocaleDateString()}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleViewAssignment(assignment)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    {assignment.status !== 'closed' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditAssignment(assignment)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    )}
                    {assignment.needs_grading > 0 && (
                      <Button
                        size="sm"
                        onClick={() => handleGradeSubmissions(assignment)}
                      >
                        <BarChart3 className="h-4 w-4" />
                      </Button>
                    )}
                    {assignment.status === 'draft' && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteAssignment(assignment)}
                      >
                        <Trash2 className="h-4 w-4" />
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
                {searchTerm || filterStatus !== 'all' || filterClass !== 'all' 
                  ? t('teacher.noMatchingAssignments')
                  : t('teacher.noAssignments')
                }
              </p>
              {searchTerm === '' && filterStatus === 'all' && filterClass === 'all' && (
                <Button className="mt-4" onClick={handleCreateAssignment}>
                  <Plus className="h-4 w-4 mr-2" />
                  {t('teacher.createFirstAssignment')}
                </Button>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default AssignmentManagement