import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../../hooks/useLanguage'
import { useAuth } from '../../hooks/useAuth'
import { TeacherPageLayout } from '../../components/teacher/layout'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Badge } from '../../components/ui/badge'
import lessonsService from '../../services/lessons'
import schoolsService from '../../services/schools'
import { apiMethods } from '../../services/api'
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  BookOpen,
  Users,
  Clock,
  Calendar,
  Play,
  FileText,
  Target,
  Settings,
  Zap
} from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select'
import { cn } from '../../lib/utils'

const LessonsPage = () => {
  const { t, isRTL, currentLanguage } = useLanguage()
  const { user, token } = useAuth() // Assuming token is provided by the auth context
  const navigate = useNavigate()

  // Utility function to get localized lesson title
  const getLocalizedTitle = (lesson) => {
    if (!lesson) return ''

    switch (currentLanguage) {
      case 'ar':
        return lesson.title_arabic || lesson.title
      case 'fr':
        return lesson.title_french || lesson.title
      default:
        return lesson.title
    }
  }

  // Utility function to get localized subject name
  const getLocalizedSubjectName = (subject) => {
    if (!subject) return ''

    switch (currentLanguage) {
      case 'ar':
        return subject.name_arabic || subject.name
      case 'fr':
        return subject.name_french || subject.name
      default:
        return subject.name
    }
  }

  // Utility function to get localized grade name
  const getLocalizedGradeName = (grade) => {
    if (!grade) return ''

    switch (currentLanguage) {
      case 'ar':
        return grade.name_arabic || grade.name
      case 'fr':
        return grade.name_french || grade.name
      default:
        return grade.name
    }
  }

  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSubject, setSelectedSubject] = useState('all')
  const [selectedGrade, setSelectedGrade] = useState('all')
  const [selectedCycle, setSelectedCycle] = useState('all')
  const [selectedDifficulty, setSelectedDifficulty] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [pagination, setPagination] = useState({ count: 0, next: null, previous: null, pageSize: 20 })

  const [lessons, setLessons] = useState([])
  const [subjects, setSubjects] = useState([])
  const [grades, setGrades] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    firstCycle: 0,
    secondCycle: 0
  })

  // Load lessons data
  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)

      const params = {
        page: currentPage,
        search: searchTerm || undefined,
        grade: selectedGrade !== 'all' ? selectedGrade : undefined,
        subject: selectedSubject !== 'all' ? selectedSubject : undefined,
        cycle: selectedCycle !== 'all' ? selectedCycle : undefined,
        difficulty_level: selectedDifficulty !== 'all' ? selectedDifficulty : undefined,
        page_size: 20,
      }

      console.log('Loading lessons with params:', params)

      const response = await lessonsService.getLessons(params)
      console.log('Lessons response:', response)

      const lessonsData = response.results || []
      setLessons(lessonsData)
      setPagination({
        count: response.count,
        next: response.next,
        previous: response.previous,
        pageSize: 20,
      })

      // Update total count from pagination, other stats are for the current page
      setStats(prevStats => ({
        ...prevStats,
        total: response.count || 0,
        active: lessonsData.filter(l => l.is_active).length,
        firstCycle: lessonsData.filter(l => l.cycle === 'first').length,
        secondCycle: lessonsData.filter(l => l.cycle === 'second').length,
      }))

    } catch (err) {
      console.error('Error loading lessons:', err)
      setError('Failed to load lessons. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Load dropdown options
  const loadOptions = async () => {
    try {
      if (!user || !token) {
        console.error("User or authentication token not found, cannot fetch teacher info.");
        setSubjects([]);
        setGrades([]);
        return;
      }

      console.log('Loading teacher info...');
      const data = await apiMethods.get('lessons/teacher-info/');
      console.log('Teacher info loaded:', data);

      const teacherSubject = data.school_subject;
      const teacherGrades = data.teachable_grades;

      if (teacherSubject) {
        setSubjects([teacherSubject]);
        setSelectedSubject(teacherSubject.id.toString());
      } else {
        setSubjects([]);
      }

      if (teacherGrades && teacherGrades.length > 0) {
        setGrades(teacherGrades);
        console.log('Teacher grades loaded:', teacherGrades);
      } else {
        setGrades([]);
        console.log('No teachable grades found for teacher');
      }
    } catch (error) {
      console.error('Error loading dropdown options:', error);
      // Set to empty on error to avoid stale data
      setSubjects([]);
      setGrades([]);
    }
  }

  // Reset page to 1 when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, selectedSubject, selectedGrade, selectedCycle, selectedDifficulty])

  // Load options when user is available
  useEffect(() => {
    if (user) {
      loadOptions()
    }
  }, [user])

  // Load data when page or filters change
  useEffect(() => {
    if (user) {
      loadData()
    }
  }, [currentPage, searchTerm, selectedSubject, selectedGrade, selectedCycle, selectedDifficulty, user])

  const getStatusBadge = (lesson) => {
    const isActive = lesson.is_active
    return (
      <Badge className={cn('text-xs', isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800')}>
        {isActive ? t('status.active') : t('status.inactive')}
      </Badge>
    )
  }

  const getCycleBadge = (cycle) => {
    const cycleConfig = {
      first: { label: t('lessons.firstCycle'), color: 'bg-blue-100 text-blue-800' },
      second: { label: t('lessons.secondCycle'), color: 'bg-purple-100 text-purple-800' }
    }

    const config = cycleConfig[cycle] || { label: cycle, color: 'bg-gray-100 text-gray-800' }
    return (
      <Badge className={cn('text-xs', config.color)}>
        {config.label}
      </Badge>
    )
  }

  const getDifficultyBadge = (difficulty) => {
    const difficultyConfig = {
      easy: { label: t('difficulty.easy'), color: 'bg-green-100 text-green-800' },
      medium: { label: t('difficulty.medium'), color: 'bg-yellow-100 text-yellow-800' },
      hard: { label: t('difficulty.hard'), color: 'bg-red-100 text-red-800' }
    }

    const config = difficultyConfig[difficulty] || { label: difficulty, color: 'bg-gray-100 text-gray-800' }
    return (
      <Badge className={cn('text-xs', config.color)}>
        {config.label}
      </Badge>
    )
  }

  const handleCreateLesson = () => {
    navigate('/teacher/content/lessons/add')
  }

  const handleViewLesson = (lessonId) => {
    navigate(`/teacher/content/lessons/view/${lessonId}`)
  }

  const handleEditLesson = (lessonId) => {
    navigate(`/teacher/content/lessons/edit/${lessonId}`)
  }

  const handleManageExercises = (lessonId) => {
    navigate(`/teacher/content/lessons/${lessonId}/exercises`)
  }

  const handleCreateExercise = (lessonId) => {
    navigate(`/teacher/content/exercises/add?lesson=${lessonId}`)
  }

  const handleDeleteLesson = async (lessonId) => {
    if (window.confirm(t('lessons.confirmDelete'))) {
      try {
        await lessonsService.deleteLesson(lessonId)
        loadData() // Reload data after deletion
      } catch (err) {
        console.error('Failed to delete lesson:', err)
        alert(t('lessons.deleteError'))
      }
    }
  }

  const handleToggleStatus = async (lesson) => {
    try {
      await lessonsService.patchLesson(lesson.id, { is_active: !lesson.is_active })
      loadData() // Reload data after status change
    } catch (err) {
      console.error('Failed to toggle lesson status:', err)
      alert(t('lessons.updateError'))
    }
  }

  if (loading) {
    return (
      <TeacherPageLayout
        title={t('teacherSidebar.content.lessons')}
        subtitle="Create and manage your lesson content and course materials"
      >
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">{t('common.loading')}</p>
          </div>
        </div>
      </TeacherPageLayout>
    )
  }

  if (error) {
    return (
      <TeacherPageLayout
        title={t('teacherSidebar.content.lessons')}
        subtitle="Create and manage your lesson content and course materials"
      >
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <p className="text-red-600 mb-4">{error}</p>
              <Button onClick={loadData} variant="outline">
                {t('common.tryAgain')}
              </Button>
            </div>
          </CardContent>
        </Card>
      </TeacherPageLayout>
    )
  }

  return (
    <TeacherPageLayout
      title={t('teacherSidebar.content.lessons')}
      subtitle={t('teacherSidebar.content.tooltip')}
      actions={[
        <Button key="create" onClick={handleCreateLesson} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          {t('lessons.createLesson')}
        </Button>
      ]}
      showRefreshButton={true}
      onRefresh={loadData}
    >
      {/* Search and Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className={cn(
                  'absolute top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground',
                  isRTL ? 'right-3' : 'left-3'
                )} />
                <Input
                  placeholder={t('lessons.searchPlaceholder')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={cn(isRTL ? 'pr-10' : 'pl-10')}
                />
              </div>
            </div>

            {/* Subject Filter */}
            <Select value={selectedSubject} onValueChange={setSelectedSubject}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder={t('lessons.subject')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('lessons.allSubjects')}</SelectItem>
                {subjects.map(subject => (
                  <SelectItem key={subject.id} value={subject.id.toString()}>
                    {getLocalizedSubjectName(subject)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Grade Filter */}
            <Select value={selectedGrade} onValueChange={setSelectedGrade}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder={t('lessons.grade')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('lessons.allGrades')}</SelectItem>
                {grades.map(grade => (
                  <SelectItem key={grade.id} value={grade.id.toString()}>
                    {getLocalizedGradeName(grade)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Cycle Filter */}
            <Select value={selectedCycle} onValueChange={setSelectedCycle}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder={t('lessons.cycle')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('lessons.allCycles')}</SelectItem>
                <SelectItem value="first">{t('lessons.firstCycle')}</SelectItem>
                <SelectItem value="second">{t('lessons.secondCycle')}</SelectItem>
              </SelectContent>
            </Select>

            {/* Difficulty Filter */}
            <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder={t('lessons.difficulty')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('lessons.allDifficulties')}</SelectItem>
                <SelectItem value="easy">{t('difficulty.easy')}</SelectItem>
                <SelectItem value="medium">{t('difficulty.medium')}</SelectItem>
                <SelectItem value="hard">{t('difficulty.hard')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{stats.total}</p>
                <p className="text-sm text-muted-foreground">{t('lessons.totalLessons')}</p>
              </div>
              <BookOpen className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{stats.active}</p>
                <p className="text-sm text-muted-foreground">{t('lessons.activeLessons')}</p>
              </div>
              <Play className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{stats.firstCycle}</p>
                <p className="text-sm text-muted-foreground">{t('lessons.firstCycle')}</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{stats.secondCycle}</p>
                <p className="text-sm text-muted-foreground">{t('lessons.secondCycle')}</p>
              </div>
              <Users className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lessons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {lessons.map((lesson) => (
          <Card key={lesson.id} className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  <CardTitle className="text-lg line-clamp-1">{getLocalizedTitle(lesson)}</CardTitle>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleViewLesson(lesson.id)}>
                      <Eye className="h-4 w-4 mr-2" />
                      {t('common.view')}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleEditLesson(lesson.id)}>
                      <Edit className="h-4 w-4 mr-2" />
                      {t('lessons.editLesson')}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleManageExercises(lesson.id)}>
                      <Target className="h-4 w-4 mr-2" />
                      {t('lessons.manageExercises')}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleCreateExercise(lesson.id)}>
                      <Zap className="h-4 w-4 mr-2" />
                      {t('lessons.createExercise')}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleToggleStatus(lesson)}
                    >
                      {lesson.is_active ? (
                        <>
                          <Eye className="h-4 w-4 mr-2" />
                          {t('common.deactivate')}
                        </>
                      ) : (
                        <>
                          <Play className="h-4 w-4 mr-2" />
                          {t('common.activate')}
                        </>
                      )}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleDeleteLesson(lesson.id)}
                      className="text-red-600"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      {t('common.delete')}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                {getStatusBadge(lesson)}
                <Badge variant="outline" className="text-xs">
                  {lesson.subject_details ? getLocalizedSubjectName(lesson.subject_details) : lesson.subject_name}
                </Badge>
                {getCycleBadge(lesson.cycle)}
                {getDifficultyBadge(lesson.difficulty_level)}
              </div>
            </CardHeader>

            <CardContent>
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                {lesson.description}
              </p>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>{lesson.grade_details ? getLocalizedGradeName(lesson.grade_details) : lesson.grade_name} • {t('lessons.order')}: {lesson.order}</span>
                </div>

                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                  <span>{lesson.cycle_display}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>{t('common.updated')} {new Date(lesson.updated_at).toLocaleDateString()}</span>
                </div>

                {lesson.resources && lesson.resources.length > 0 && (
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span>{lesson.resources.length} {t('lessons.resources')}</span>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-green-600" />
                  <span>{lesson.exercise_count || 0} {t('lessons.practiceExercises')}</span>
                </div>
              </div>

              <div className="flex gap-2 mt-4">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleViewLesson(lesson.id)}
                  className="flex-1"
                >
                  <Eye className="h-4 w-4 mr-1" />
                  {t('common.view')}
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleEditLesson(lesson.id)}
                  className="flex-1"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  {t('common.edit')}
                </Button>
              </div>

              {/* Exercise Management Section */}
              <div className="flex gap-2 mt-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleManageExercises(lesson.id)}
                  className="flex-1 border-green-200 text-green-700 hover:bg-green-50"
                >
                  <Target className="h-4 w-4 mr-1" />
                  {t('lessons.manageExercises')}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleCreateExercise(lesson.id)}
                  className="flex-1 border-green-200 text-green-700 hover:bg-green-50"
                >
                  <Zap className="h-4 w-4 mr-1" />
                  {t('lessons.addExercise')}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {lessons.length === 0 && (
        <Card className="mt-6">
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">{t('lessons.noLessons')}</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm || selectedSubject !== 'all' || selectedGrade !== 'all' || selectedCycle !== 'all' || selectedDifficulty !== 'all'
                  ? t('lessons.tryAdjustingFilters')
                  : t('lessons.getStartedCreate')
                }
              </p>
              {!searchTerm && selectedSubject === 'all' && selectedGrade === 'all' && selectedCycle === 'all' && selectedDifficulty === 'all' && (
                <Button onClick={handleCreateLesson}>
                  <Plus className="h-4 w-4 mr-2" />
                  {t('lessons.createFirstLesson')}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {pagination.count > pagination.pageSize && (
        <div className="flex items-center justify-center space-x-2 mt-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(p => p - 1)}
            disabled={!pagination.previous}
          >
            {t('common.previous')}
          </Button>
          <span className="text-sm text-muted-foreground">
            {t('common.page')} {currentPage} {t('common.of')} {Math.ceil(pagination.count / pagination.pageSize)}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(p => p + 1)}
            disabled={!pagination.next}
          >
            {t('common.next')}
          </Button>
        </div>
      )}
    </TeacherPageLayout>
  )
}

export default LessonsPage