import React, { useState, useEffect } from 'react'
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
import { Switch } from '../../components/ui/switch'
import { Label } from '../../components/ui/label'
import {
  Search,
  Plus,
  Filter,
  Clock,
  FileText,
  Zap,
  Users,
  Calendar,
  Timer,
  Target,
  CheckCircle,
  AlertCircle,
  XCircle,
  Edit,
  Eye,
  Trash2,
  Copy,
  Play,
  Pause,
  Square,
  BarChart3,
  Settings,
  Shield,
  Shuffle,
  Lock,
  Unlock,
  RefreshCw,
  Trophy,
  Loader2
} from 'lucide-react'
import { cn } from '../../lib/utils'
import homeworkService from '../../services/homework'
import { toast } from 'react-hot-toast'

const ExamsPage = () => {
  const { t, isRTL } = useLanguage()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedClass, setSelectedClass] = useState('all')
  const [selectedType, setSelectedType] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')

  // API state
  const [exams, setExams] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [statistics, setStatistics] = useState(null)
  const [refreshing, setRefreshing] = useState(false)

  // Get exam types from service
  const examTypes = homeworkService.getExamTypes()

  // API functions
  const fetchExams = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await homeworkService.getExams({
        assignment_type__in: 'quiz,exam'
      })

      if (response.success) {
        const formattedExams = response.data.map(exam =>
          homeworkService.formatExamFromAPI(exam)
        )
        setExams(formattedExams)

        // Update exam type counts
        updateExamTypeCounts(formattedExams)
      } else {
        setError(response.error)
        toast.error(response.error)
      }
    } catch (error) {
      setError('Failed to fetch exams')
      toast.error('Failed to fetch exams')
    } finally {
      setLoading(false)
    }
  }

  const fetchStatistics = async () => {
    try {
      const response = await homeworkService.getExamStatistics()
      if (response.success) {
        setStatistics(response.data)
      }
    } catch (error) {
      console.error('Failed to fetch statistics:', error)
    }
  }

  const updateExamTypeCounts = (examsList) => {
    examTypes.forEach(type => {
      type.count = examsList.filter(exam => exam.type === type.id).length
    })
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchExams()
    await fetchStatistics()
    setRefreshing(false)
    toast.success('Data refreshed successfully')
  }

  const handleDeleteExam = async (examId) => {
    if (!confirm('Are you sure you want to delete this exam?')) return

    try {
      const response = await homeworkService.deleteHomework(examId)
      if (response.success) {
        setExams(prev => prev.filter(exam => exam.id !== examId))
        toast.success('Exam deleted successfully')
      } else {
        toast.error(response.error)
      }
    } catch (error) {
      toast.error('Failed to delete exam')
    }
  }

  const handleDuplicateExam = async (examId) => {
    try {
      const exam = exams.find(e => e.id === examId)
      if (!exam) return

      const response = await homeworkService.duplicateHomework(examId, {
        new_title: `${exam.title} (Copy)`,
        new_due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        school_class_id: exam.class.id
      })

      if (response.success) {
        const formattedExam = homeworkService.formatExamFromAPI(response.data)
        setExams(prev => [formattedExam, ...prev])
        toast.success('Exam duplicated successfully')
      } else {
        toast.error(response.error)
      }
    } catch (error) {
      toast.error('Failed to duplicate exam')
    }
  }

  const handlePublishExam = async (examId) => {
    try {
      const response = await homeworkService.publishHomework(examId)
      if (response.success) {
        setExams(prev => prev.map(exam =>
          exam.id === examId ? { ...exam, status: 'active', is_published: true } : exam
        ))
        toast.success('Exam published successfully')
      } else {
        toast.error(response.error)
      }
    } catch (error) {
      toast.error('Failed to publish exam')
    }
  }

  // Load data on component mount
  useEffect(() => {
    fetchExams()
    fetchStatistics()
  }, [])

  const filteredExams = exams.filter(exam => {
    const matchesSearch = exam.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         exam.subject?.name?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesClass = selectedClass === 'all' || exam.class?.name === selectedClass
    const matchesType = selectedType === 'all' || exam.type === selectedType
    const matchesStatus = selectedStatus === 'all' || exam.status === selectedStatus

    return matchesSearch && matchesClass && matchesType && matchesStatus
  })

  const getStatusColor = (status) => {
    switch(status) {
      case 'draft': return 'bg-gray-100 text-gray-800'
      case 'scheduled': return 'bg-yellow-100 text-yellow-800'
      case 'active': return 'bg-green-100 text-green-800'
      case 'completed': return 'bg-blue-100 text-blue-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status) => {
    switch(status) {
      case 'draft': return AlertCircle
      case 'scheduled': return Calendar
      case 'active': return Play
      case 'completed': return CheckCircle
      case 'cancelled': return XCircle
      default: return Clock
    }
  }

  const getTypeInfo = (typeId) => {
    return examTypes.find(type => type.id === typeId) || examTypes[0]
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'Not scheduled'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatDuration = (minutes) => {
    if (minutes < 60) return `${minutes} min`
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}min` : `${hours}h`
  }

  const calculateParticipation = (participants, total) => {
    return total > 0 ? Math.round((participants / total) * 100) : 0
  }

  return (
    <TeacherPageLayout
      title={t('teacherSidebar.assignments.exams')}
      subtitle="Create and manage timed exams, tests, and quizzes with security features"
      showRefreshButton={true}
      onRefresh={handleRefresh}
      isRefreshing={refreshing}
    >
      {/* Exam Types Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {examTypes.map((type) => (
          <Card key={type.id} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <div className={cn(
                  'p-2 rounded-lg text-white',
                  type.color
                )}>
                  <type.icon className="h-5 w-5" />
                </div>
                <Badge variant="secondary">{type.count}</Badge>
              </div>
              <h3 className="font-semibold text-sm mb-1">{type.name}</h3>
              <p className="text-xs text-muted-foreground mb-2">{type.description}</p>
              <p className="text-xs text-blue-600">Avg: {type.avgDuration}</p>
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
                <label className="text-sm font-medium mb-2 block">Search Exams</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search exams..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={cn('pl-9', isRTL && 'pr-9 pl-3')}
                  />
                </div>
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

              {/* Type Filter */}
              <div>
                <label className="text-sm font-medium mb-2 block">Type</label>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    {examTypes.map((type) => (
                      <SelectItem key={type.id} value={type.id}>
                        {type.name}
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
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Quick Actions */}
              <div className="pt-4 border-t">
                <Button className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  New Exam
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Exams List */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Exams & Quizzes
                  <Badge variant="outline">{filteredExams.length} exams</Badge>
                </CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <BarChart3 className="h-4 w-4 mr-1" />
                    Analytics
                  </Button>
                  <Button size="sm">
                    <Plus className="h-4 w-4 mr-1" />
                    Create Exam
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  <span className="ml-2 text-muted-foreground">Loading exams...</span>
                </div>
              ) : error ? (
                <div className="text-center py-12">
                  <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2 text-red-700">Failed to load exams</h3>
                  <p className="text-red-600 mb-4">{error}</p>
                  <Button onClick={handleRefresh} variant="outline">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Try Again
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredExams.map((exam) => {
                  const typeInfo = getTypeInfo(exam.type)
                  const StatusIcon = getStatusIcon(exam.status)
                  const participation = calculateParticipation(exam.participants, exam.totalStudents)

                  return (
                    <Card key={exam.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="pt-4">
                        <div className="flex items-start gap-4">
                          {/* Exam Type Icon */}
                          <div className={cn(
                            'p-2 rounded-lg text-white flex-shrink-0',
                            typeInfo.color
                          )}>
                            <typeInfo.icon className="h-5 w-5" />
                          </div>

                          {/* Exam Content */}
                          <div className="flex-1 min-w-0">
                            {/* Title and Status */}
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h3 className="font-semibold text-lg leading-tight">
                                  {exam.title}
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                  {exam.class?.name} • {exam.subject?.name}
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge className={cn('flex items-center gap-1', getStatusColor(exam.status))}>
                                  <StatusIcon className="h-3 w-3" />
                                  {exam.status}
                                </Badge>
                              </div>
                            </div>

                            {/* Exam Details */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <span>{formatDate(exam.scheduledDate)}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Timer className="h-4 w-4 text-muted-foreground" />
                                <span>{formatDuration(exam.timeLimit)}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <FileText className="h-4 w-4 text-muted-foreground" />
                                <span>{exam.totalQuestions} questions</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Target className="h-4 w-4 text-muted-foreground" />
                                <span>{exam.totalPoints} pts</span>
                              </div>
                            </div>

                            {/* Exam Settings */}
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4 text-xs">
                              <div className="flex items-center gap-2">
                                <RefreshCw className="h-3 w-3 text-muted-foreground" />
                                <span>{exam.attempts} attempt{exam.attempts !== 1 ? 's' : ''}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                {exam.randomizeQuestions ? <Shuffle className="h-3 w-3 text-green-500" /> : <Lock className="h-3 w-3 text-gray-400" />}
                                <span>Random order</span>
                              </div>
                              <div className="flex items-center gap-2">
                                {exam.proctored ? <Shield className="h-3 w-3 text-blue-500" /> : <Unlock className="h-3 w-3 text-gray-400" />}
                                <span>Proctored</span>
                              </div>
                            </div>

                            {/* Security Features */}
                            {exam.security && (
                              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-2 mb-2">
                                  <Shield className="h-4 w-4 text-gray-600" />
                                  <span className="font-medium text-gray-800 text-sm">Security Features</span>
                                </div>
                                <div className="flex flex-wrap gap-2 text-xs">
                                  {exam.security.preventCopyPaste && (
                                    <Badge variant="outline" className="text-xs">No Copy/Paste</Badge>
                                  )}
                                  {exam.security.fullScreen && (
                                    <Badge variant="outline" className="text-xs">Full Screen</Badge>
                                  )}
                                  {exam.security.autoSubmit && (
                                    <Badge variant="outline" className="text-xs">Auto Submit</Badge>
                                  )}
                                  {exam.security.timeWarnings.length > 0 && (
                                    <Badge variant="outline" className="text-xs">
                                      Time Warnings: {exam.security.timeWarnings.join(', ')}min
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            )}

                            {/* Participation Stats */}
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center gap-4 text-sm">
                                <div className="flex items-center gap-1">
                                  <Users className="h-4 w-4 text-muted-foreground" />
                                  <span>{exam.participants}/{exam.totalStudents} participated</span>
                                </div>
                                {exam.avgScore !== null && (
                                  <div className="flex items-center gap-1">
                                    <BarChart3 className="h-4 w-4 text-muted-foreground" />
                                    <span>Avg: {exam.avgScore}%</span>
                                  </div>
                                )}
                              </div>

                              {/* Participation Progress Bar */}
                              <div className="flex items-center gap-2">
                                <div className="w-24 bg-gray-200 rounded-full h-2">
                                  <div
                                    className="bg-blue-500 h-2 rounded-full transition-all"
                                    style={{ width: `${participation}%` }}
                                  ></div>
                                </div>
                                <span className="text-xs text-muted-foreground">{participation}%</span>
                              </div>
                            </div>

                            {/* Result Display Settings */}
                            <div className="mb-4 p-2 bg-blue-50 rounded text-sm">
                              <span className="text-blue-800">
                                Results: <strong>
                                  {exam.showResults === 'immediately' ? 'Show immediately' :
                                   exam.showResults === 'after_submission' ? 'After submission' :
                                   'After deadline'}
                                </strong>
                                {exam.allowReview && ' • Review allowed'}
                              </span>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="sm">
                                <Eye className="h-4 w-4 mr-1" />
                                View
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4 mr-1" />
                                Edit
                              </Button>
                              {exam.status === 'draft' && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-green-600"
                                  onClick={() => handlePublishExam(exam.id)}
                                >
                                  <Play className="h-4 w-4 mr-1" />
                                  Publish
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDuplicateExam(exam.id)}
                              >
                                <Copy className="h-4 w-4 mr-1" />
                                Duplicate
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-500 hover:text-red-700"
                                onClick={() => handleDeleteExam(exam.id)}
                              >
                                <Trash2 className="h-4 w-4 mr-1" />
                                Delete
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                  })}

                  {filteredExams.length === 0 && !loading && (
                    <div className="text-center py-12">
                      <Clock className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">No exams found</h3>
                      <p className="text-muted-foreground mb-4">
                        {searchQuery || selectedClass !== 'all' || selectedType !== 'all' || selectedStatus !== 'all'
                          ? 'Try adjusting your filters to find more exams.'
                          : 'Start creating timed assessments for your students.'
                        }
                      </p>
                      <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        Create Your First Exam
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Exam Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Total Exams</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : exams.length}
            </div>
            <p className="text-xs text-muted-foreground">
              {statistics?.monthly_growth || 'All time'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Active Exams</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? <Loader2 className="h-6 w-6 animate-spin" /> :
                exams.filter(exam => exam.status === 'active').length}
            </div>
            <p className="text-xs text-muted-foreground">Currently running</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Average Participation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? <Loader2 className="h-6 w-6 animate-spin" /> :
                statistics?.average_participation ? `${statistics.average_participation}%` : '--'}
            </div>
            <p className="text-xs text-muted-foreground">
              {statistics?.participation_trend || 'Overall rate'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Average Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? <Loader2 className="h-6 w-6 animate-spin" /> :
                statistics?.average_score ? `${statistics.average_score}%` : '--'}
            </div>
            <p className="text-xs text-muted-foreground">
              {statistics?.score_trend || 'Overall average'}
            </p>
          </CardContent>
        </Card>
      </div>
    </TeacherPageLayout>
  )
}

export default ExamsPage