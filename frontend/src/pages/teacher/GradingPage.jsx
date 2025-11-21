import { useEffect, useState } from 'react'
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
      case 'late': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800'
      case 'in_progress': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800'
      case 'auto_graded':
      case 'manually_graded': return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800'
      default: return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300 border-gray-200 dark:border-gray-700'
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
    if (!score || !maxScore) return 'text-muted-foreground'
    const percentage = (parseFloat(score) / parseFloat(maxScore)) * 100
    if (percentage >= 90) return 'text-green-600 dark:text-green-400'
    if (percentage >= 80) return 'text-blue-600 dark:text-blue-400'
    if (percentage >= 70) return 'text-yellow-600 dark:text-yellow-400'
    if (percentage >= 60) return 'text-orange-600 dark:text-orange-400'
    return 'text-red-600 dark:text-red-400'
  }

  const getPerformanceTrend = (score, maxScore) => {
    if (!score || !maxScore) return { icon: Minus, color: 'text-muted-foreground' }
    const percentage = (parseFloat(score) / parseFloat(maxScore)) * 100
    if (percentage >= 85) return { icon: TrendingUp, color: 'text-green-500 dark:text-green-400' }
    if (percentage >= 70) return { icon: Minus, color: 'text-yellow-500 dark:text-yellow-400' }
    return { icon: TrendingDown, color: 'text-red-500 dark:text-red-400' }
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {gradingStatuses.map((status) => (
          <Card
            key={status.id}
            className={cn(
              'hover:shadow-lg transition-all cursor-pointer hover:scale-105',
              selectedStatus === status.id && 'ring-2 ring-primary shadow-md'
            )}
            onClick={() => setSelectedStatus(status.id)}
          >
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <div className={cn(
                  'p-3 rounded-lg text-white shadow-sm',
                  status.color
                )}>
                  <status.icon className="h-5 w-5" />
                </div>
                <Badge variant="secondary" className="text-base font-semibold px-3 py-1">
                  {status.count}
                </Badge>
              </div>
              <h3 className="font-semibold text-sm mb-1 text-foreground">{status.name}</h3>
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
              <div className="pt-4 border-t border-border space-y-2">
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
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <CardTitle className="flex flex-wrap items-center gap-2">
                  <GraduationCap className="h-5 w-5" />
                  <span>Student Submissions</span>
                  <Badge variant="outline">{filteredSubmissions.length} submissions</Badge>
                </CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <BarChart3 className="h-4 w-4 mr-1" />
                    <span className="hidden sm:inline">Grade Analytics</span>
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
                    <Card key={submission.id} className="hover:shadow-md transition-all hover:scale-[1.01] border-border">
                      <CardContent className="pt-4">
                        <div className="flex flex-col sm:flex-row items-start gap-4">
                          {/* Student Avatar */}
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0 shadow-md">
                            {studentName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                          </div>

                          {/* Submission Content */}
                          <div className="flex-1 min-w-0 w-full">
                            {/* Header */}
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-3 gap-2">
                              <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-lg leading-tight text-foreground">
                                  {studentName}
                                </h3>
                                <p className="text-sm text-muted-foreground truncate">
                                  {submission.student?.email} • {submission.assignment_title}
                                </p>
                              </div>
                              <div className="flex items-center gap-2 flex-shrink-0">
                                {submission.is_late && (
                                  <Badge variant="outline" className="text-xs text-red-600 dark:text-red-400 border-red-200 dark:border-red-800">
                                    Late
                                  </Badge>
                                )}
                                <Badge className={cn('flex items-center gap-1 border', getStatusColor(submission.status))}>
                                  <StatusIcon className="h-3 w-3" />
                                  <span className="capitalize">{submission.status.replace('_', ' ')}</span>
                                </Badge>
                              </div>
                            </div>

                            {/* Assignment Details */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4 text-sm">
                              <div className="flex items-center gap-2 p-2 rounded-md bg-muted/50">
                                <Calendar className="h-4 w-4 text-blue-500 dark:text-blue-400 flex-shrink-0" />
                                <span className="text-foreground truncate">
                                  <span className="hidden sm:inline">Submitted: </span>
                                  {formatDate(submission.submitted_at)}
                                </span>
                              </div>
                              {submission.time_taken && (
                                <div className="flex items-center gap-2 p-2 rounded-md bg-muted/50">
                                  <Timer className="h-4 w-4 text-amber-500 dark:text-amber-400 flex-shrink-0" />
                                  <span className="text-foreground">
                                    <span className="hidden sm:inline">Time: </span>
                                    {submission.time_taken}m
                                  </span>
                                </div>
                              )}
                              <div className="flex items-center gap-2 p-2 rounded-md bg-muted/50">
                                <RefreshCw className="h-4 w-4 text-purple-500 dark:text-purple-400 flex-shrink-0" />
                                <span className="text-foreground">Attempt {submission.attempt_number}</span>
                              </div>
                            </div>

                            {/* Score Display */}
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-900/50 rounded-lg mb-3 border border-border gap-3">
                              <div className="flex items-center gap-4 flex-wrap">
                                <div className="text-center">
                                  <div className={cn('text-3xl font-bold', scoreColor)}>
                                    {score || '—'}
                                  </div>
                                  <div className="text-xs text-muted-foreground font-medium">
                                    Score
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <TrendIcon className={cn('h-5 w-5', trend.color)} />
                                </div>
                                {submission.points_earned > 0 && (
                                  <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 px-3 py-1.5 rounded-full">
                                    <Coins className="h-4 w-4" />
                                    <span className="text-sm font-semibold">
                                      {submission.points_earned} pts
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                              <Button
                                variant="default"
                                size="sm"
                                onClick={() => handleViewSubmission(submission.id)}
                                className="w-full sm:w-auto"
                              >
                                <Edit className="h-4 w-4 mr-1" />
                                Grade Submission
                              </Button>
                              <Button variant="ghost" size="sm" className="w-full sm:w-auto">
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
                  <div className="text-center py-12 px-4">
                    <div className="bg-muted/50 dark:bg-muted/20 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4">
                      <GraduationCap className="h-12 w-12 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2 text-foreground">No submissions found</h3>
                    <p className="text-muted-foreground mb-4 max-w-md mx-auto">
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
        <Card className="border-border hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Total Submissions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{submissions.length}</div>
            <p className="text-xs text-muted-foreground mt-1">All time</p>
          </CardContent>
        </Card>

        <Card className="border-border hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Pending Grading</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">{stats.pending}</div>
            <p className="text-xs text-muted-foreground mt-1">Requires attention</p>
          </CardContent>
        </Card>

        <Card className="border-border hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">Graded</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600 dark:text-green-400">{stats.graded}</div>
            <p className="text-xs text-muted-foreground mt-1">Completed</p>
          </CardContent>
        </Card>

        <Card className="border-border hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="text-sm text-muted-foreground">In Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{stats.in_progress}</div>
            <p className="text-xs text-muted-foreground mt-1">Being graded</p>
          </CardContent>
        </Card>
      </div>
    </TeacherPageLayout>
  )
}

export default GradingPage
