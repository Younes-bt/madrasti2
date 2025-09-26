import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../../hooks/useLanguage'
import { useAuth } from '../../hooks/useAuth'
import { TeacherPageLayout } from '../../components/teacher/layout'
import homeworkService from '../../services/homework'
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
  Plus,
  Filter,
  ClipboardList,
  Clock,
  Users,
  BookOpen,
  CheckCircle,
  AlertCircle,
  Calendar,
  Edit,
  Eye,
  Trash2,
  Copy,
  Share2,
  BarChart3,
  Settings,
  FileText,
  Target,
  Trophy,
  Timer,
  RefreshCw,
  Loader2
} from 'lucide-react'
import { cn } from '../../lib/utils'

const HomeworkPage = () => {
  const { t, isRTL } = useLanguage()
  const { user } = useAuth()
  const navigate = useNavigate()

  // State management
  const [homeworks, setHomeworks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [refreshing, setRefreshing] = useState(false)

  // Filter states
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedClass, setSelectedClass] = useState('all')
  const [selectedType, setSelectedType] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')

  // Statistics
  const [statistics, setStatistics] = useState({
    total: 0,
    active: 0,
    completion_rate: 0,
    average_score: 0
  })

  const homeworkTypesConfig = [
      {
        id: 'homework',
        name: 'Homework',
        icon: BookOpen,
        color: 'bg-blue-500',
      },
      {
        id: 'classwork',
        name: 'Classwork',
        icon: Users,
        color: 'bg-green-500',
      },
      {
        id: 'quiz',
        name: 'Quiz',
        icon: Clock,
        color: 'bg-orange-500',
      },
      {
        id: 'exam',
        name: 'Exam',
        icon: FileText,
        color: 'bg-red-500',
      },
      {
        id: 'project',
        name: 'Project',
        icon: Trophy,
        color: 'bg-purple-500',
      },
      {
        id: 'practical',
        name: 'Practical',
        icon: Settings,
        color: 'bg-cyan-500',
      }
    ]

  const homeworkTypes = homeworkTypesConfig.map(type => ({
    ...type,
    count: homeworks.filter(a => a.type === type.id).length
  }))


  // API Functions
  const fetchHomeworks = async () => {
    try {
      setLoading(true)
      setError(null)

      const result = await homeworkService.getHomeworks()
      if (result.success) {
        const formattedHomeworks = result.data.map(hw => ({
          ...homeworkService.formatHomeworkFromAPI(hw),
          status: homeworkService.calculateHomeworkStatus(hw),
        }))
        setHomeworks(formattedHomeworks)
        calculateStatistics(formattedHomeworks)
      } else {
        setError(result.error)
      }
    } catch (err) {
      console.error('Error fetching homework:', err)
      setError('Failed to load homework')
    } finally {
      setLoading(false)
    }
  }

  const calculateStatistics = (homeworkList) => {
    const total = homeworkList.length
    const active = homeworkList.filter(a => a.status === 'active').length
    
    setStatistics({
      total,
      active,
      completion_rate: 0, // Simplified for now
      average_score: 0 // Simplified for now
    })
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchHomeworks()
    setRefreshing(false)
  }

  const handleCreateHomework = () => {
    navigate('/teacher/homework/create')
  }

  const handleViewHomework = (homework) => {
    navigate(`/teacher/homework/view/${homework.id}`)
  }

  const handleEditHomework = (homework) => {
    navigate(`/teacher/homework/edit/${homework.id}`)
  }

  const handleDeleteHomework = async (homeworkId) => {
    if (window.confirm('Are you sure you want to delete this homework?')) {
      const result = await homeworkService.deleteHomework(homeworkId)
      if (result.success) {
        await fetchHomeworks()
      } else {
        alert(result.error)
      }
    }
  }

  const handleDuplicateHomework = async (homework) => {
    const duplicateData = {
      new_title: `${homework.title} (Copy)`,
      new_due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      school_class_id: homework.class.id
    }

    const result = await homeworkService.duplicateHomework(homework.id, duplicateData)
    if (result.success) {
      await fetchHomeworks()
    } else {
      alert(result.error)
    }
  }


  // Load data on component mount
  useEffect(() => {
    fetchHomeworks()
  }, [])

  const filteredHomeworks = homeworks.filter(homework => {
    const matchesSearch = homework.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (homework.subject?.name || '').toLowerCase().includes(searchQuery.toLowerCase())
    const matchesClass = selectedClass === 'all' || homework.class?.name === selectedClass
    const matchesType = selectedType === 'all' || homework.type === selectedType
    const matchesStatus = selectedStatus === 'all' || homework.status === selectedStatus

    return matchesSearch && matchesClass && matchesType && matchesStatus
  })

  const getStatusColor = (status) => {
    switch(status) {
      case 'draft': return 'bg-gray-100 text-gray-800'
      case 'active': return 'bg-green-100 text-green-800'
      case 'completed': return 'bg-blue-100 text-blue-800'
      case 'expired': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status) => {
    switch(status) {
      case 'draft': return AlertCircle
      case 'active': return Clock
      case 'completed': return CheckCircle
      case 'expired': return AlertCircle
      default: return Clock
    }
  }

  const getTypeInfo = (typeId) => {
    return homeworkTypes.find(type => type.id === typeId) || homeworkTypes[0]
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const calculateProgress = (submissions, total) => {
    return total > 0 ? Math.round((submissions / total) * 100) : 0
  }

  return (
    <TeacherPageLayout
      title={t('teacherSidebar.assignments.homework')}
      subtitle="Create, manage, and track student homework and assessments"
      showRefreshButton={true}
    >
      {/* Homework Types Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
        {homeworkTypes.map((type) => (
          <Card key={type.id} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <div className={cn(
                  'p-2 rounded-lg text-white',
                  type.color
                )}>
                  <type.icon className="h-4 w-4" />
                </div>
                <Badge variant="secondary">{type.count}</Badge>
              </div>
              <h3 className="font-semibold text-sm mb-1">{type.name}</h3>
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
                <label className="text-sm font-medium mb-2 block">Search Homework</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search homework..."
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
                    {/* Add class options here */}
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
                    {homeworkTypes.map((type) => (
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
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="expired">Expired</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Quick Actions */}
              <div className="pt-4 border-t">
                <Button className="w-full" onClick={handleCreateHomework}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Homework
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Homework List */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <ClipboardList className="h-5 w-5" />
                  Homework
                  <Badge variant="outline">{filteredHomeworks.length} items</Badge>
                </CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <BarChart3 className="h-4 w-4 mr-1" />
                    Analytics
                  </Button>
                  <Button size="sm" onClick={handleCreateHomework}>
                    <Plus className="h-4 w-4 mr-1" />
                    Create Homework
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {loading && (
                <div className="text-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">Loading homework...</p>
                </div>
              )}

              {error && (
                <div className="text-center py-12">
                  <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-red-600 mb-2">Error Loading Homework</h3>
                  <p className="text-muted-foreground mb-4">{error}</p>
                  <Button onClick={handleRefresh} disabled={refreshing}>
                    <RefreshCw className={cn("h-4 w-4 mr-2", refreshing && "animate-spin")} />
                    Try Again
                  </Button>
                </div>
              )}

              {!loading && !error && (
                <div className="space-y-4">
                  {filteredHomeworks.map((homework) => {
                  const typeInfo = getTypeInfo(homework.type)
                  const StatusIcon = getStatusIcon(homework.status)
                  const progress = calculateProgress(homework.submissions_count, 30) // Placeholder for total students

                  return (
                    <Card key={homework.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="pt-4">
                        <div className="flex items-start gap-4">
                          {/* Homework Type Icon */}
                          <div className={cn(
                            'p-2 rounded-lg text-white flex-shrink-0',
                            typeInfo.color
                          )}>
                            <typeInfo.icon className="h-5 w-5" />
                          </div>

                          {/* Homework Content */}
                          <div className="flex-1 min-w-0">
                            {/* Title and Status */}
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h3 className="font-semibold text-lg leading-tight">
                                  {homework.title}
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                  {homework.class?.name} • {homework.subject?.name}
                                </p>
                              </div>
                              <div className="flex items-center gap-1 ml-4">
                                <Badge className={cn('flex items-center gap-1', getStatusColor(homework.status))}>
                                  <StatusIcon className="h-3 w-3" />
                                  {homework.status}
                                </Badge>
                              </div>
                            </div>

                            {/* Homework Details */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                <span>Due: {formatDate(homework.due_date)}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Target className="h-4 w-4 text-muted-foreground" />
                                <span>{homework.total_points} pts</span>
                              </div>
                              {homework.time_limit && (
                                <div className="flex items-center gap-2">
                                  <Timer className="h-4 w-4 text-muted-foreground" />
                                  <span>{homework.time_limit} min</span>
                                </div>
                              )}
                              {homework.questions?.length > 0 && (
                                <div className="flex items-center gap-2">
                                  <FileText className="h-4 w-4 text-muted-foreground" />
                                  <span>{homework.questions.length} questions</span>
                                </div>
                              )}
                            </div>

                            {/* Progress and Stats */}
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center gap-4 text-sm">
                                <div className="flex items-center gap-1">
                                  <Users className="h-4 w-4 text-muted-foreground" />
                                  <span>{homework.submissions_count || 0}/30 submitted</span>
                                </div>
                              </div>

                              {/* Progress Bar */}
                              <div className="flex items-center gap-2">
                                <div className="w-24 bg-gray-200 rounded-full h-2">
                                  <div
                                    className="bg-blue-500 h-2 rounded-full transition-all"
                                    style={{ width: `${progress}%` }}
                                  ></div>
                                </div>
                                <span className="text-xs text-muted-foreground">{progress}%</span>
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="sm" onClick={() => handleViewHomework(homework)}>
                                <Eye className="h-4 w-4 mr-1" />
                                View
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => handleEditHomework(homework)}>
                                <Edit className="h-4 w-4 mr-1" />
                                Edit
                              </Button>
                              <Button variant="ghost" size="sm" onClick={() => handleDuplicateHomework(homework)}>
                                <Copy className="h-4 w-4 mr-1" />
                                Duplicate
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Share2 className="h-4 w-4 mr-1" />
                                Share
                              </Button>
                              <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700" onClick={() => handleDeleteHomework(homework.id)}>
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

                  {filteredHomeworks.length === 0 && (
                    <div className="text-center py-12">
                      <ClipboardList className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">No homework found</h3>
                      <p className="text-muted-foreground mb-4">
                        {searchQuery || selectedClass !== 'all' || selectedType !== 'all' || selectedStatus !== 'all'
                          ? 'Try adjusting your filters to find more homework.'
                          : 'Start creating homework for your students.'
                        }
                      </p>
                      <Button onClick={handleCreateHomework}>
                        <Plus className="h-4 w-4 mr-2" />
                        Create Your First Homework
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Homework Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Total Homework</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.total}</div>
            <p className="text-xs text-muted-foreground">All homework</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Active Homework</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.active}</div>
            <p className="text-xs text-muted-foreground">Currently open</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Average Completion</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.completion_rate}%</div>
            <p className="text-xs text-muted-foreground">Submission rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Average Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statistics.average_score}%</div>
            <p className="text-xs text-muted-foreground">Class performance</p>
          </CardContent>
        </Card>
      </div>

    </TeacherPageLayout>
  )
}

export default HomeworkPage