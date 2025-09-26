import React, { useState, useEffect } from 'react'
import { useLanguage } from '../../hooks/useLanguage'
import { useAuth } from '../../hooks/useAuth'
import { TeacherPageLayout } from '../../components/teacher/layout'
import { questionService } from '../../services/questions'
import QuestionCreator from '../../components/teacher/QuestionCreator'
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
  HelpCircle,
  CheckSquare,
  FileText,
  ToggleLeft,
  Type,
  Link,
  ArrowUpDown,
  Eye,
  Edit,
  Trash2,
  BookOpen,
  Target,
  Clock,
  AlertCircle,
  RefreshCw
} from 'lucide-react'
import { cn } from '../../lib/utils'

const AssessmentToolsPage = () => {
  const { t, isRTL } = useLanguage()
  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSubject, setSelectedSubject] = useState('all')
  const [selectedType, setSelectedType] = useState('all')
  const [selectedDifficulty, setSelectedDifficulty] = useState('all')

  // API State Management
  const [questions, setQuestions] = useState([])
  const [questionBank, setQuestionBank] = useState(null)
  const [subjects, setSubjects] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [refreshing, setRefreshing] = useState(false)

  // Question Creator Modal State
  const [showQuestionCreator, setShowQuestionCreator] = useState(false)
  const [selectedQuestionType, setSelectedQuestionType] = useState('qcm_single')
  const [editingQuestion, setEditingQuestion] = useState(null)

  // Get question types from service
  const questionTypesConfig = questionService.getQuestionTypes()

  // Map icons from strings to components
  const iconMap = {
    CheckSquare,
    FileText,
    ToggleLeft,
    Type,
    Link,
    ArrowUpDown
  }

  // Enhanced question types with counts from API data
  const questionTypes = questionTypesConfig.map(type => ({
    ...type,
    icon: iconMap[type.icon] || HelpCircle,
    count: questionBank?.statistics?.byType?.find(stat => stat.type === type.id)?.count || 0
  }))

  // Data fetching functions
  const fetchQuestionBank = async () => {
    setLoading(true)
    setError(null)

    try {
      const filters = {}

      // Apply filters if selected
      if (selectedSubject !== 'all') {
        filters.subject = selectedSubject
      }
      if (selectedType !== 'all') {
        filters.question_type = selectedType
      }

      const result = await questionService.getQuestionBank(filters)

      if (result.success) {
        setQuestionBank(result.data)
        setQuestions(result.data.questions)
      } else {
        setError(result.error)
      }
    } catch (error) {
      console.error('Error fetching question bank:', error)
      setError('Failed to load question bank')
    } finally {
      setLoading(false)
    }
  }

  const fetchSubjects = async () => {
    try {
      const result = await questionService.getSubjects()
      if (result.success) {
        setSubjects(result.data)
      }
    } catch (error) {
      console.error('Error fetching subjects:', error)
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchQuestionBank()
    setRefreshing(false)
  }

  // Question management handlers
  const handleCreateQuestion = (questionType = 'qcm_single') => {
    setSelectedQuestionType(questionType)
    setEditingQuestion(null)
    setShowQuestionCreator(true)
  }

  const handleEditQuestion = (question) => {
    const formattedQuestion = questionService.formatQuestionFromAPI(question)
    setEditingQuestion(formattedQuestion)
    setSelectedQuestionType(question.question_type)
    setShowQuestionCreator(true)
  }

  const handleQuestionSaved = (savedQuestion) => {
    // Refresh the question bank to show the new/updated question
    fetchQuestionBank()
  }

  const handleDeleteQuestion = async (questionId) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      const result = await questionService.deleteQuestion(questionId)
      if (result.success) {
        fetchQuestionBank() // Refresh the list
      } else {
        alert(result.error || 'Failed to delete question')
      }
    }
  }

  // Load data on component mount
  useEffect(() => {
    fetchQuestionBank()
    fetchSubjects()
  }, [selectedSubject, selectedType]) // Refetch when filters change

  // Filter questions based on search and filters
  const filteredQuestions = questions.filter(question => {
    const matchesSearch = question.question_text?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         question.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesDifficulty = selectedDifficulty === 'all' ||
                            (questionBank?.statistics?.byDifficulty?.find(d => d.difficulty === selectedDifficulty)?.questions || [])
                            .some(q => q.id === question.id)

    return matchesSearch && matchesDifficulty
  })


  const getDifficultyColor = (difficulty) => {
    switch(difficulty) {
      case 'easy': return 'bg-green-100 text-green-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'hard': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getQuestionTypeInfo = (typeId) => {
    return questionTypes.find(type => type.id === typeId) || questionTypes[0]
  }

  return (
    <TeacherPageLayout
      title={t('teacherSidebar.assignments.assessmentTools')}
      subtitle="Create and manage questions, question banks, and assessment rubrics"
      showRefreshButton={true}
      onRefresh={handleRefresh}
      refreshing={refreshing}
    >
      {/* Question Types Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {questionTypes.map((type) => (
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
              <p className="text-xs text-muted-foreground">{type.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters and Search */}
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
                <label className="text-sm font-medium mb-2 block">Search Questions</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search questions or tags..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={cn('pl-9', isRTL && 'pr-9 pl-3')}
                  />
                </div>
              </div>

              {/* Subject Filter */}
              <div>
                <label className="text-sm font-medium mb-2 block">Subject</label>
                <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Subjects</SelectItem>
                    {subjects.map((subject) => (
                      <SelectItem key={subject.id} value={subject.name}>
                        {subject.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Question Type Filter */}
              <div>
                <label className="text-sm font-medium mb-2 block">Question Type</label>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    {questionTypes.map((type) => (
                      <SelectItem key={type.id} value={type.id}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Difficulty Filter */}
              <div>
                <label className="text-sm font-medium mb-2 block">Difficulty</label>
                <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Quick Actions */}
              <div className="pt-4 border-t">
                <Button className="w-full mb-2" onClick={() => handleCreateQuestion()}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Question
                </Button>
                <Button variant="outline" className="w-full">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Create Rubric
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Question Bank */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <HelpCircle className="h-5 w-5" />
                  Question Bank
                  <Badge variant="outline">{filteredQuestions.length} questions</Badge>
                </CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    Import Questions
                  </Button>
                  <Button size="sm" onClick={() => handleCreateQuestion()}>
                    <Plus className="h-4 w-4 mr-1" />
                    New Question
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {loading && (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading questions...</p>
                  </div>
                )}

                {error && (
                  <div className="text-center py-12">
                    <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-red-600 mb-2">Error Loading Questions</h3>
                    <p className="text-muted-foreground mb-4">{error}</p>
                    <Button onClick={handleRefresh}>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Try Again
                    </Button>
                  </div>
                )}

                {!loading && !error && filteredQuestions.map((question) => {
                  const typeInfo = getQuestionTypeInfo(question.question_type)
                  const subject = question.assignment?.subject?.name || 'Unknown'
                  const difficulty = 'medium' // Would be calculated from question usage stats

                  return (
                    <Card key={question.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="pt-4">
                        <div className="flex items-start gap-4">
                          {/* Question Type Icon */}
                          <div className={cn(
                            'p-2 rounded-lg text-white flex-shrink-0',
                            typeInfo?.color || 'bg-gray-500'
                          )}>
                            <typeInfo.icon className="h-4 w-4" />
                          </div>

                          {/* Question Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-2">
                              <h3 className="font-medium text-sm leading-relaxed">
                                {question.question_text}
                              </h3>
                              <div className="flex items-center gap-1 ml-4">
                                <Button variant="ghost" size="sm" title="View Question">
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm" onClick={() => handleEditQuestion(question)} title="Edit Question">
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm" onClick={() => handleDeleteQuestion(question.id)} title="Delete Question" className="text-red-500 hover:text-red-700">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>

                            {/* Question Metadata */}
                            <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                              <span className="flex items-center gap-1">
                                <BookOpen className="h-3 w-3" />
                                {subject}
                              </span>
                              <Badge className={getDifficultyColor(difficulty)} size="sm">
                                {difficulty}
                              </Badge>
                              <span className="flex items-center gap-1">
                                <Target className="h-3 w-3" />
                                {question.points} pts
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {new Date(question.created_at).toLocaleDateString()}
                              </span>
                            </div>

                            {/* Question Info */}
                            {question.explanation && (
                              <div className="mb-3">
                                <p className="text-xs text-muted-foreground italic">
                                  {question.explanation.length > 100
                                    ? `${question.explanation.substring(0, 100)}...`
                                    : question.explanation
                                  }
                                </p>
                              </div>
                            )}

                            {/* Question Type Badge */}
                            <div className="flex items-center gap-2 flex-wrap">
                              <Badge variant="secondary" className="text-xs">
                                {typeInfo?.name || question.question_type}
                              </Badge>
                              {question.choices?.length > 0 && (
                                <Badge variant="outline" className="text-xs">
                                  {question.choices.length} choices
                                </Badge>
                              )}
                              {question.is_required && (
                                <Badge variant="outline" className="text-xs text-red-600">
                                  Required
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}

                {filteredQuestions.length === 0 && (
                  <div className="text-center py-12">
                    <HelpCircle className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No questions found</h3>
                    <p className="text-muted-foreground mb-4">
                      {searchQuery || selectedSubject !== 'all' || selectedType !== 'all' || selectedDifficulty !== 'all'
                        ? 'Try adjusting your filters to find more questions.'
                        : 'Start building your question bank by creating your first question.'
                      }
                    </p>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Your First Question
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Assessment Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Total Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {questionBank?.statistics?.total || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {questionBank?.statistics?.byType?.length || 0} different types
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Question Types</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {questionBank?.statistics?.byType?.length || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Most used: {questionBank?.statistics?.byType?.[0]?.type || 'N/A'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Subjects Covered</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {questionBank?.statistics?.bySubject?.length || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Across all question bank
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Question Creator Modal */}
      <QuestionCreator
        isOpen={showQuestionCreator}
        onClose={() => setShowQuestionCreator(false)}
        questionType={selectedQuestionType}
        onSave={handleQuestionSaved}
        initialData={editingQuestion}
        assignmentId={null} // Standalone questions for question bank
      />
    </TeacherPageLayout>
  )
}

export default AssessmentToolsPage