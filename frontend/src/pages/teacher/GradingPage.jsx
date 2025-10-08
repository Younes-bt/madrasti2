import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { useLanguage } from '../../hooks/useLanguage'
import { TeacherPageLayout } from '../../components/teacher/layout'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select'
import { Badge } from '../../components/ui/badge'
import {
  Search,
  Filter,
  GraduationCap,
  Clock,
  CheckCircle,
  AlertCircle,
  Eye,
  Edit,
  Calendar,
  Target,
  Download,
  RefreshCw,
  Timer,
  Loader2,
  TrendingUp,
  TrendingDown,
  Minus,
  Coins,
  Trophy,
  BarChart3,
} from 'lucide-react'
import { cn } from '../../lib/utils'
import { homeworkService } from '../../services'

const GradingPage = () => {
  const { t, isRTL } = useLanguage()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(true)
  const [submissions, setSubmissions] = useState([])
  const [homeworks, setHomeworks] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedHomework, setSelectedHomework] = useState('all')
  const [selectedClass, setSelectedClass] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all') // Changed from 'submitted' to 'all'

  // Statistics
  const [stats, setStats] = useState({
    pending: 0,
    in_progress: 0,
    graded: 0,
    needs_review: 0
  })

  useEffect(() => {
    fetchData()
  }, [selectedHomework, selectedClass, selectedStatus])

  const fetchData = async () => {
    try {
      setLoading(true)

      // Fetch submissions - filter for submitted and late submissions by default
      const params = {}

      // Only add status filter if not 'all'
      if (selectedStatus !== 'all') {
        params.status = selectedStatus
      }

      if (selectedHomework !== 'all') {
        params.homework = selectedHomework
      }

      if (selectedClass !== 'all') {
        params.class = selectedClass
      }

      const [submissionsRes, homeworksRes] = await Promise.all([
        homeworkService.getStudentSubmissions(params),
        homeworkService.getHomeworks()
      ])

      if (submissionsRes.success) {
        setSubmissions(submissionsRes.data || [])

        // Calculate stats
        const allSubmissions = submissionsRes.data || []
        setStats({
          pending: allSubmissions.filter(s => s.status === 'submitted' || s.status === 'late').length,
          in_progress: allSubmissions.filter(s => s.status === 'in_progress').length,
          graded: allSubmissions.filter(s => s.status === 'auto_graded' || s.status === 'manually_graded').length,
          needs_review: allSubmissions.filter(s => s.status === 'late' || s.is_late).length
        })
      } else {
        toast.error(submissionsRes.error || 'Failed to fetch submissions')
      }

      if (homeworksRes.success) {
        setHomeworks(homeworksRes.data || [])
      }
    } catch (err) {
      console.error('Error fetching data:', err)
      toast.error('Failed to load grading data')
    } finally {
      setLoading(false)
    }
  }

  // Grading status types
  const gradingStatuses = [
    {
      id: 'submitted',
      name: 'Pending Review',
      icon: Clock,
      description: 'Awaiting teacher review',
      color: 'bg-yellow-500',
      count: stats.pending
    },
    {
      id: 'in_progress',
      name: 'In Progress',
      icon: Edit,
      description: 'Currently being graded',
      color: 'bg-blue-500',
      count: stats.in_progress
    },
    {
      id: 'manually_graded',
      name: 'Graded',
      icon: CheckCircle,
      description: 'Completed and scored',
      color: 'bg-green-500',
      count: stats.graded
    },
    {
      id: 'late',
      name: 'Needs Review',
      icon: AlertCircle,
      description: 'Late submissions',
      color: 'bg-red-500',
      count: stats.needs_review
    }
  ]

  const filteredSubmissions = submissions.filter(submission => {
    if (!submission) return false

    const studentName = submission.student?.full_name ||
                       `${submission.student?.first_name || ''} ${submission.student?.last_name || ''}`.trim()
    const homeworkTitle = submission.assignment_title || ''

    const matchesSearch = searchQuery === '' ||
      studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      homeworkTitle.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesSearch
  })

  const getStatusColor = (status) => {
    switch(status) {
      case 'submitted':
      case 'late': return 'bg-yellow-100 text-yellow-800'
      case 'in_progress': return 'bg-blue-100 text-blue-800'
      case 'auto_graded':
      case 'manually_graded': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status) => {
    switch(status) {
      case 'submitted':
      case 'late': return Clock
      case 'in_progress': return Edit
      case 'auto_graded':
      case 'manually_graded': return CheckCircle
      default: return Clock
    }
  }

  const getScoreColor = (score, maxScore) => {
    if (!score || !maxScore) return 'text-gray-500'
    const percentage = (parseFloat(score) / parseFloat(maxScore)) * 100
    if (percentage >= 90) return 'text-green-600'
    if (percentage >= 80) return 'text-blue-600'
    if (percentage >= 70) return 'text-yellow-600'
    if (percentage >= 60) return 'text-orange-600'
    return 'text-red-600'
  }

  const getPerformanceTrend = (score, maxScore) => {
    if (!score || !maxScore) return { icon: Minus, color: 'text-gray-400' }
    const percentage = (parseFloat(score) / parseFloat(maxScore)) * 100
    if (percentage >= 85) return { icon: TrendingUp, color: 'text-green-500' }
    if (percentage >= 70) return { icon: Minus, color: 'text-yellow-500' }
    return { icon: TrendingDown, color: 'text-red-500' }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleViewSubmission = (submissionId) => {
    navigate(`/teacher/grading/${submissionId}`)
  }

  if (loading) {
    return (
      <TeacherPageLayout
        title={t('teacherSidebar.assignments.grading')}
        subtitle="Grade student submissions, provide feedback, and calculate rewards"
        showRefreshButton={true}
      >
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </TeacherPageLayout>
    )
  }

  return (
    <TeacherPageLayout
      title={t('teacherSidebar.assignments.grading')}
      subtitle="Grade student submissions, provide feedback, and calculate rewards"
      showRefreshButton={true}
      onRefresh={fetchData}
    >
      {/* Grading Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {gradingStatuses.map((status) => (
          <Card
            key={status.id}
            className={cn(
              'hover:shadow-lg transition-shadow cursor-pointer',
              selectedStatus === status.id && 'ring-2 ring-primary'
            )}
            onClick={() => setSelectedStatus(status.id)}
          >
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

              {/* Homework Filter */}
              <div>
                <label className="text-sm font-medium mb-2 block">Assignment</label>
                <Select value={selectedHomework} onValueChange={setSelectedHomework}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select assignment" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Assignments</SelectItem>
                    {homeworks.map((homework) => (
                      <SelectItem key={homework.id} value={homework.id.toString()}>
                        {homework.title}
                      </SelectItem>
                    ))}
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
                <Button className="w-full" variant="outline" size="sm" onClick={fetchData}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
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
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredSubmissions.map((submission) => {
                  const StatusIcon = getStatusIcon(submission.status)
                  const studentName = submission.student?.full_name ||
                                     `${submission.student?.first_name || ''} ${submission.student?.last_name || ''}`.trim()
                  const score = submission.total_score || submission.auto_score
                  const scoreColor = getScoreColor(score, 100)
                  const trend = getPerformanceTrend(score, 100)
                  const TrendIcon = trend.icon

                  return (
                    <Card key={submission.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="pt-4">
                        <div className="flex items-start gap-4">
                          {/* Student Avatar */}
                          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
                            {studentName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                          </div>

                          {/* Submission Content */}
                          <div className="flex-1 min-w-0">
                            {/* Header */}
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h3 className="font-semibold text-lg leading-tight">
                                  {studentName}
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                  {submission.student?.email} • {submission.assignment_title}
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
                                {submission.is_late && (
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
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4 text-sm">
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <span>Submitted: {formatDate(submission.submitted_at)}</span>
                              </div>
                              {submission.time_taken && (
                                <div className="flex items-center gap-2">
                                  <Timer className="h-4 w-4 text-muted-foreground" />
                                  <span>Time: {submission.time_taken}m</span>
                                </div>
                              )}
                              <div className="flex items-center gap-2">
                                <RefreshCw className="h-4 w-4 text-muted-foreground" />
                                <span>Attempt {submission.attempt_number}</span>
                              </div>
                            </div>

                            {/* Score Display */}
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg mb-3">
                              <div className="flex items-center gap-4">
                                <div className="text-center">
                                  <div className={cn('text-2xl font-bold', scoreColor)}>
                                    {score || '—'}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    Score
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <TrendIcon className={cn('h-4 w-4', trend.color)} />
                                </div>
                                {submission.points_earned > 0 && (
                                  <div className="flex items-center gap-2 text-amber-600">
                                    <Coins className="h-4 w-4" />
                                    <span className="text-sm font-medium">
                                      {submission.points_earned} pts
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2">
                              <Button
                                variant="default"
                                size="sm"
                                onClick={() => handleViewSubmission(submission.id)}
                              >
                                <Edit className="h-4 w-4 mr-1" />
                                Grade Submission
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4 mr-1" />
                                View Details
                              </Button>
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
                      {searchQuery || selectedHomework !== 'all' || selectedStatus !== 'all'
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
            <div className="text-2xl font-bold">{submissions.length}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Pending Grading</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending}</div>
            <p className="text-xs text-muted-foreground">Requires attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Graded</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.graded}</div>
            <p className="text-xs text-muted-foreground">Completed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">In Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.in_progress}</div>
            <p className="text-xs text-muted-foreground">Being graded</p>
          </CardContent>
        </Card>
      </div>
    </TeacherPageLayout>
  )
}

export default GradingPage
