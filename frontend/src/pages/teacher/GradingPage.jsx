import React, { useState } from 'react'
import { useLanguage } from '../../hooks/useLanguage'
import { TeacherPageLayout } from '../../components/teacher/layout'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Textarea } from '../../components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select'
import { Badge } from '../../components/ui/badge'
import { Label } from '../../components/ui/label'
import {
  Search,
  Filter,
  GraduationCap,
  Clock,
  CheckCircle,
  AlertCircle,
  XCircle,
  Eye,
  Edit,
  MessageSquare,
  Star,
  ThumbsUp,
  ThumbsDown,
  Calendar,
  Users,
  BarChart3,
  Target,
  FileText,
  Download,
  Upload,
  Trophy,
  Award,
  TrendingUp,
  TrendingDown,
  Minus,
  Save,
  Send,
  RefreshCw,
  Timer,
  BookOpen,
  Paperclip
} from 'lucide-react'
import { cn } from '../../lib/utils'

const GradingPage = () => {
  const { t, isRTL } = useLanguage()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedAssignment, setSelectedAssignment] = useState('all')
  const [selectedClass, setSelectedClass] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('pending')

  // Grading status types
  const gradingStatuses = [
    {
      id: 'pending',
      name: 'Pending Review',
      icon: Clock,
      description: 'Awaiting teacher review',
      color: 'bg-yellow-500',
      count: 47
    },
    {
      id: 'in_progress',
      name: 'In Progress',
      icon: Edit,
      description: 'Currently being graded',
      color: 'bg-blue-500',
      count: 12
    },
    {
      id: 'graded',
      name: 'Graded',
      icon: CheckCircle,
      description: 'Completed and scored',
      color: 'bg-green-500',
      count: 156
    },
    {
      id: 'needs_review',
      name: 'Needs Review',
      icon: AlertCircle,
      description: 'Requires additional attention',
      color: 'bg-red-500',
      count: 8
    }
  ]

  // Mock submissions data for grading
  const submissions = [
    {
      id: 1,
      studentName: 'Ahmed Hassan',
      studentId: 'S2024001',
      assignmentTitle: 'Algebra Practice Problems',
      assignmentType: 'homework',
      class: 'Grade 10A',
      subject: 'Mathematics',
      submittedAt: '2024-01-20T14:30:00Z',
      dueDate: '2024-01-22T23:59:00Z',
      status: 'pending',
      autoScore: 75,
      finalScore: null,
      maxScore: 100,
      timeSpent: 45,
      questionCount: 15,
      correctAnswers: 11,
      feedback: null,
      files: [],
      attempts: 1,
      isLate: false,
      flagged: false
    },
    {
      id: 2,
      studentName: 'Fatima Al-Zahra',
      studentId: 'S2024015',
      assignmentTitle: 'Biology Chapter 5 Quiz',
      assignmentType: 'quiz',
      class: 'Grade 11B',
      subject: 'Biology',
      submittedAt: '2024-01-20T10:15:00Z',
      dueDate: '2024-01-20T11:00:00Z',
      status: 'graded',
      autoScore: 90,
      finalScore: 88,
      maxScore: 50,
      timeSpent: 18,
      questionCount: 10,
      correctAnswers: 9,
      feedback: 'Excellent work! Minor error in question 7 about cellular respiration.',
      files: [],
      attempts: 1,
      isLate: false,
      flagged: false
    },
    {
      id: 3,
      studentName: 'Omar Khalil',
      studentId: 'S2024032',
      assignmentTitle: 'Chemistry Lab Data Analysis',
      assignmentType: 'file_submission',
      class: 'Grade 12A',
      subject: 'Chemistry',
      submittedAt: '2024-01-18T16:45:00Z',
      dueDate: '2024-01-18T23:59:00Z',
      status: 'in_progress',
      autoScore: null,
      finalScore: null,
      maxScore: 50,
      timeSpent: null,
      questionCount: null,
      correctAnswers: null,
      feedback: 'Partial feedback: Good data collection methodology...',
      files: [
        { name: 'lab_data.xlsx', size: '2.3MB', type: 'excel' },
        { name: 'analysis_report.pdf', size: '1.8MB', type: 'pdf' }
      ],
      attempts: 1,
      isLate: false,
      flagged: true
    },
    {
      id: 4,
      studentName: 'Layla Mahmoud',
      studentId: 'S2024048',
      assignmentTitle: 'Physics Problem Set',
      assignmentType: 'homework',
      class: 'Grade 11C',
      subject: 'Physics',
      submittedAt: '2024-01-26T02:30:00Z',
      dueDate: '2024-01-25T23:59:00Z',
      status: 'needs_review',
      autoScore: 45,
      finalScore: null,
      maxScore: 120,
      timeSpent: 95,
      questionCount: 12,
      correctAnswers: 5,
      feedback: null,
      files: [],
      attempts: 1,
      isLate: true,
      flagged: true
    }
  ]

  // Mock assignments for filter
  const assignments = [
    { id: 1, title: 'Algebra Practice Problems', type: 'homework' },
    { id: 2, title: 'Biology Chapter 5 Quiz', type: 'quiz' },
    { id: 3, title: 'Chemistry Lab Data Analysis', type: 'file_submission' },
    { id: 4, title: 'Physics Problem Set', type: 'homework' }
  ]

  const filteredSubmissions = submissions.filter(submission => {
    const matchesSearch = submission.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         submission.assignmentTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         submission.studentId.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesAssignment = selectedAssignment === 'all' || submission.assignmentTitle === selectedAssignment
    const matchesClass = selectedClass === 'all' || submission.class === selectedClass
    const matchesStatus = selectedStatus === 'all' || submission.status === selectedStatus

    return matchesSearch && matchesAssignment && matchesClass && matchesStatus
  })

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'in_progress': return 'bg-blue-100 text-blue-800'
      case 'graded': return 'bg-green-100 text-green-800'
      case 'needs_review': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status) => {
    switch(status) {
      case 'pending': return Clock
      case 'in_progress': return Edit
      case 'graded': return CheckCircle
      case 'needs_review': return AlertCircle
      default: return Clock
    }
  }

  const getScoreColor = (score, maxScore) => {
    if (!score || !maxScore) return 'text-gray-500'
    const percentage = (score / maxScore) * 100
    if (percentage >= 90) return 'text-green-600'
    if (percentage >= 80) return 'text-blue-600'
    if (percentage >= 70) return 'text-yellow-600'
    if (percentage >= 60) return 'text-orange-600'
    return 'text-red-600'
  }

  const getPerformanceTrend = (score, maxScore) => {
    if (!score || !maxScore) return { icon: Minus, color: 'text-gray-400' }
    const percentage = (score / maxScore) * 100
    if (percentage >= 85) return { icon: TrendingUp, color: 'text-green-500' }
    if (percentage >= 70) return { icon: Minus, color: 'text-yellow-500' }
    return { icon: TrendingDown, color: 'text-red-500' }
  }

  const formatTimeSpent = (minutes) => {
    if (!minutes) return 'N/A'
    if (minutes < 60) return `${minutes}m`
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getFileIcon = (type) => {
    switch(type) {
      case 'pdf': return FileText
      case 'excel': return BarChart3
      case 'image': return Eye
      default: return Paperclip
    }
  }

  return (
    <TeacherPageLayout
      title={t('teacherSidebar.assignments.grading')}
      subtitle="Grade student submissions, provide feedback, and calculate rewards"
      showRefreshButton={true}
    >
      {/* Grading Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {gradingStatuses.map((status) => (
          <Card key={status.id} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <div className={cn(
                  'p-2 rounded-lg text-white',
                  status.color
                )}>
                  <status.icon className="h-5 w-5" />
                </div>
                <Badge variant="secondary">{status.count}</Badge>
              </div>
              <h3 className="font-semibold text-sm mb-1">{status.name}</h3>
              <p className="text-xs text-muted-foreground">{status.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filters
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Search */}
              <div>
                <label className="text-sm font-medium mb-2 block">Search Submissions</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search student or assignment..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={cn('pl-9', isRTL && 'pr-9 pl-3')}
                  />
                </div>
              </div>

              {/* Assignment Filter */}
              <div>
                <label className="text-sm font-medium mb-2 block">Assignment</label>
                <Select value={selectedAssignment} onValueChange={setSelectedAssignment}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select assignment" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Assignments</SelectItem>
                    {assignments.map((assignment) => (
                      <SelectItem key={assignment.id} value={assignment.title}>
                        {assignment.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Class Filter */}
              <div>
                <label className="text-sm font-medium mb-2 block">Class</label>
                <Select value={selectedClass} onValueChange={setSelectedClass}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select class" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Classes</SelectItem>
                    <SelectItem value="Grade 10A">Grade 10A</SelectItem>
                    <SelectItem value="Grade 11B">Grade 11B</SelectItem>
                    <SelectItem value="Grade 11C">Grade 11C</SelectItem>
                    <SelectItem value="Grade 12A">Grade 12A</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Status Filter */}
              <div>
                <label className="text-sm font-medium mb-2 block">Status</label>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    {gradingStatuses.map((status) => (
                      <SelectItem key={status.id} value={status.id}>
                        {status.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Quick Actions */}
              <div className="pt-4 border-t space-y-2">
                <Button className="w-full" variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export Grades
                </Button>
                <Button className="w-full" variant="outline" size="sm">
                  <Upload className="h-4 w-4 mr-2" />
                  Bulk Grade
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Submissions List */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5" />
                  Student Submissions
                  <Badge variant="outline">{filteredSubmissions.length} submissions</Badge>
                </CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <BarChart3 className="h-4 w-4 mr-1" />
                    Grade Analytics
                  </Button>
                  <Button size="sm">
                    <RefreshCw className="h-4 w-4 mr-1" />
                    Auto-Grade All
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredSubmissions.map((submission) => {
                  const StatusIcon = getStatusIcon(submission.status)
                  const scoreColor = getScoreColor(submission.finalScore || submission.autoScore, submission.maxScore)
                  const trend = getPerformanceTrend(submission.finalScore || submission.autoScore, submission.maxScore)
                  const TrendIcon = trend.icon

                  return (
                    <Card key={submission.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="pt-4">
                        <div className="flex items-start gap-4">
                          {/* Student Avatar Placeholder */}
                          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
                            {submission.studentName.split(' ').map(n => n[0]).join('')}
                          </div>

                          {/* Submission Content */}
                          <div className="flex-1 min-w-0">
                            {/* Header */}
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h3 className="font-semibold text-lg leading-tight">
                                  {submission.studentName}
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                  {submission.studentId} • {submission.class} • {submission.assignmentTitle}
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
                                {submission.flagged && (
                                  <Badge variant="destructive" className="text-xs">
                                    <AlertCircle className="h-3 w-3 mr-1" />
                                    Flagged
                                  </Badge>
                                )}
                                {submission.isLate && (
                                  <Badge variant="outline" className="text-xs text-red-600">
                                    Late
                                  </Badge>
                                )}
                                <Badge className={cn('flex items-center gap-1', getStatusColor(submission.status))}>
                                  <StatusIcon className="h-3 w-3" />
                                  {submission.status.replace('_', ' ')}
                                </Badge>
                              </div>
                            </div>

                            {/* Assignment Details */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <span>Submitted: {formatDate(submission.submittedAt)}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Timer className="h-4 w-4 text-muted-foreground" />
                                <span>Time: {formatTimeSpent(submission.timeSpent)}</span>
                              </div>
                              {submission.questionCount && (
                                <div className="flex items-center gap-2">
                                  <Target className="h-4 w-4 text-muted-foreground" />
                                  <span>{submission.correctAnswers}/{submission.questionCount} correct</span>
                                </div>
                              )}
                              <div className="flex items-center gap-2">
                                <RefreshCw className="h-4 w-4 text-muted-foreground" />
                                <span>Attempt {submission.attempts}</span>
                              </div>
                            </div>

                            {/* Score Display */}
                            <div className="flex items-center justify-between mb-4 p-3 bg-gray-50 rounded-lg">
                              <div className="flex items-center gap-4">
                                <div className="text-center">
                                  <div className={cn('text-2xl font-bold', scoreColor)}>
                                    {submission.finalScore || submission.autoScore || '—'}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    out of {submission.maxScore}
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <TrendIcon className={cn('h-4 w-4', trend.color)} />
                                  <span className="text-sm">
                                    {submission.autoScore && submission.finalScore !== submission.autoScore && (
                                      <span className="text-muted-foreground">
                                        Auto: {submission.autoScore} → Manual: {submission.finalScore}
                                      </span>
                                    )}
                                  </span>
                                </div>
                              </div>

                              {/* Quick Grade Input */}
                              {submission.status === 'pending' || submission.status === 'in_progress' ? (
                                <div className="flex items-center gap-2">
                                  <Input
                                    type="number"
                                    placeholder="Score"
                                    min="0"
                                    max={submission.maxScore}
                                    className="w-20"
                                  />
                                  <Button size="sm">
                                    <Save className="h-3 w-3" />
                                  </Button>
                                </div>
                              ) : (
                                <div className="flex items-center gap-2">
                                  <Badge variant={submission.finalScore >= submission.maxScore * 0.9 ? "default" : "secondary"}>
                                    {Math.round((submission.finalScore / submission.maxScore) * 100)}%
                                  </Badge>
                                </div>
                              )}
                            </div>

                            {/* Files (if any) */}
                            {submission.files.length > 0 && (
                              <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                                <div className="flex items-center gap-2 mb-2">
                                  <Paperclip className="h-4 w-4 text-blue-600" />
                                  <span className="font-medium text-blue-800 text-sm">Submitted Files</span>
                                </div>
                                <div className="space-y-1">
                                  {submission.files.map((file, index) => {
                                    const FileIcon = getFileIcon(file.type)
                                    return (
                                      <div key={index} className="flex items-center gap-2 text-sm text-blue-700">
                                        <FileIcon className="h-3 w-3" />
                                        <span>{file.name}</span>
                                        <span className="text-xs">({file.size})</span>
                                        <Button variant="ghost" size="sm" className="h-auto p-1">
                                          <Download className="h-3 w-3" />
                                        </Button>
                                      </div>
                                    )
                                  })}
                                </div>
                              </div>
                            )}

                            {/* Feedback */}
                            <div className="mb-4">
                              <Label className="text-sm font-medium">Feedback</Label>
                              <Textarea
                                placeholder="Provide feedback to the student..."
                                value={submission.feedback || ''}
                                className="mt-2 min-h-[80px]"
                                readOnly={submission.status === 'graded'}
                              />
                              {submission.status !== 'graded' && (
                                <div className="flex gap-2 mt-2">
                                  <Button size="sm" variant="outline">
                                    <Save className="h-3 w-3 mr-1" />
                                    Save Draft
                                  </Button>
                                  <Button size="sm">
                                    <Send className="h-3 w-3 mr-1" />
                                    Send Feedback
                                  </Button>
                                </div>
                              )}
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4 mr-1" />
                                View Details
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4 mr-1" />
                                Grade
                              </Button>
                              <Button variant="ghost" size="sm">
                                <MessageSquare className="h-4 w-4 mr-1" />
                                Message Student
                              </Button>
                              {submission.status === 'graded' && (
                                <Button variant="ghost" size="sm">
                                  <Trophy className="h-4 w-4 mr-1" />
                                  Award Badge
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}

                {filteredSubmissions.length === 0 && (
                  <div className="text-center py-12">
                    <GraduationCap className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No submissions found</h3>
                    <p className="text-muted-foreground mb-4">
                      {searchQuery || selectedAssignment !== 'all' || selectedClass !== 'all' || selectedStatus !== 'all'
                        ? 'Try adjusting your filters to find more submissions.'
                        : 'No submissions are waiting to be graded.'
                      }
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Grading Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Total Submissions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">223</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Pending Grading</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">47</div>
            <p className="text-xs text-muted-foreground">Requires attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Average Grade</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">81%</div>
            <p className="text-xs text-muted-foreground">↑ 3% improvement</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Grading Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.2m</div>
            <p className="text-xs text-muted-foreground">Avg per submission</p>
          </CardContent>
        </Card>
      </div>
    </TeacherPageLayout>
  )
}

export default GradingPage