import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { DashboardLayout } from '../../components/layout/Layout'
import { useLanguage } from '../../hooks/useLanguage'
import { useAuth } from '../../hooks/useAuth'
import lessonsService from '../../services/lessons'
import usersService from '../../services/users'
import schoolsService from '../../services/schools'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import { Input } from '../../components/ui/input'
import { Button } from '../../components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select'
import { cn } from '../../lib/utils'
import {
  Search,
  BookOpen,
  GraduationCap,
  Calendar,
  Clock,
  Filter,
  RefreshCw,
  FileText,
  Layers,
  Loader2,
} from 'lucide-react'

const PAGE_SIZE = 12

const StudentLessonsPage = () => {
  const { t, isRTL, currentLanguage } = useLanguage()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [profileLoading, setProfileLoading] = useState(true)
  const [lessonsLoading, setLessonsLoading] = useState(false)
  const [studentGrade, setStudentGrade] = useState(null)
  const [subjects, setSubjects] = useState([])
  const [lessons, setLessons] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [selectedSubject, setSelectedSubject] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [pagination, setPagination] = useState({
    count: 0,
    next: null,
    previous: null,
    pageSize: PAGE_SIZE,
  })
  const [error, setError] = useState(null)
  const [expandedLessonId, setExpandedLessonId] = useState(null)
  const [refreshToken, setRefreshToken] = useState(0)

  const isLoading = profileLoading || lessonsLoading

  // Debounce search input to avoid spamming the API
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm.trim())
    }, 350)

    return () => clearTimeout(handler)
  }, [searchTerm])

  useEffect(() => {
    const loadProfileAndGrade = async () => {
      try {
        setProfileLoading(true)
        setError(null)

        const [profileResponse, gradesResponse] = await Promise.all([
          usersService.getProfile(),
          schoolsService.getGrades({ page_size: 1000 }),
        ])

        const gradesList = gradesResponse?.results || gradesResponse || []
        const normalize = (value) => (value || '').toString().trim().toLowerCase()

        const candidateNames = [
          normalize(profileResponse?.grade),
          normalize(profileResponse?.grade_name_arabic),
          normalize(profileResponse?.grade_name_french),
        ].filter(Boolean)

        const matchedGrade = gradesList.find((grade) => {
          const gradeNames = [
            normalize(grade?.name),
            normalize(grade?.name_arabic),
            normalize(grade?.name_french),
          ].filter(Boolean)

          return gradeNames.some((gradeName) => candidateNames.includes(gradeName))
        })

        if (matchedGrade) {
          setStudentGrade(matchedGrade)
        } else {
          setStudentGrade(null)
        }
      } catch (err) {
        console.error('Failed to load student profile or grade:', err)
        setError(t('errors.loadData', 'Unable to load your lessons right now.'))
      } finally {
        setProfileLoading(false)
      }
    }

    loadProfileAndGrade()
  }, [t])

  useEffect(() => {
    const loadSubjects = async () => {
      if (!studentGrade?.id) {
        setSubjects([])
        return
      }

      try {
        const response = await schoolsService.getSubjectsForGrade(studentGrade.id)
        const subjectList = response?.results || response || []
        setSubjects(subjectList)
      } catch (err) {
        console.warn('Failed to load subjects for grade, falling back to lesson data.', err)
        setSubjects([])
      }
    }

    loadSubjects()
  }, [studentGrade?.id])

  // Reset subject filter and page when grade changes
  useEffect(() => {
    setSelectedSubject('all')
    setCurrentPage(1)
  }, [studentGrade?.id])

  // Reset pagination when search term changes
  useEffect(() => {
    setCurrentPage(1)
  }, [debouncedSearch])

  useEffect(() => {
    const loadLessons = async () => {
      if (profileLoading) return

      try {
        setLessonsLoading(true)
        setError(null)

        const params = {
          page: currentPage,
          page_size: PAGE_SIZE,
          ordering: 'order',
          is_active: true,
        }

        if (studentGrade?.id) {
          params.grade = studentGrade.id
        }

        if (selectedSubject !== 'all') {
          params.subject = selectedSubject
        }

        if (debouncedSearch) {
          params.search = debouncedSearch
        }

        const response = await lessonsService.getLessons(params)
        const lessonList = response?.results || response || []
        setLessons(lessonList)

        setPagination({
          count: response?.count ?? lessonList.length,
          next: response?.next || null,
          previous: response?.previous || null,
          pageSize: PAGE_SIZE,
        })

        // Populate subjects from lessons if grade-based fetch failed
        if (subjects.length === 0) {
          const subjectMap = new Map()
          lessonList.forEach((lesson) => {
            const subjectDetails = lesson.subject_details || {
              id: lesson.subject,
              name: lesson.subject_name,
            }
            if (subjectDetails?.id && !subjectMap.has(subjectDetails.id)) {
              subjectMap.set(subjectDetails.id, subjectDetails)
            }
          })
          if (subjectMap.size > 0) {
            setSubjects(Array.from(subjectMap.values()))
          }
        }
      } catch (err) {
        console.error('Failed to load lessons:', err)
        setLessons([])
        setPagination({ count: 0, next: null, previous: null, pageSize: PAGE_SIZE })
        setError(t('lessons.loadError', 'Unable to load lessons. Please try again.'))
      } finally {
        setLessonsLoading(false)
      }
    }

    loadLessons()
  }, [profileLoading, studentGrade?.id, selectedSubject, debouncedSearch, currentPage, refreshToken, subjects.length, t])

  const totalPages = useMemo(() => {
    if (!pagination.count) return 1
    return Math.max(1, Math.ceil(pagination.count / PAGE_SIZE))
  }, [pagination.count])

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

  const getLocalizedLessonTitle = (lesson) => {
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

  const localizedGradeName = useMemo(() => {
    if (!studentGrade) return null
    switch (currentLanguage) {
      case 'ar':
        return studentGrade.name_arabic || studentGrade.name
      case 'fr':
        return studentGrade.name_french || studentGrade.name
      default:
        return studentGrade.name
    }
  }, [studentGrade, currentLanguage])

  const getCycleBadge = (cycle) => {
    if (!cycle) return null

    const cycleConfig = {
      first: { label: t('lessons.firstCycle', 'First Cycle'), color: 'bg-blue-100 text-blue-800' },
      second: { label: t('lessons.secondCycle', 'Second Cycle'), color: 'bg-purple-100 text-purple-800' },
    }

    const config = cycleConfig[cycle] || { label: cycle, color: 'bg-slate-100 text-slate-800' }

    return (
      <Badge className={cn('text-xs', config.color)}>{config.label}</Badge>
    )
  }

  const getDifficultyBadge = (difficulty) => {
    if (!difficulty) return null

    const difficultyConfig = {
      easy: { label: t('difficulty.easy', 'Easy'), color: 'bg-emerald-100 text-emerald-700' },
      medium: { label: t('difficulty.medium', 'Medium'), color: 'bg-amber-100 text-amber-700' },
      hard: { label: t('difficulty.hard', 'Hard'), color: 'bg-rose-100 text-rose-700' },
    }

    const config = difficultyConfig[difficulty] || { label: difficulty, color: 'bg-slate-100 text-slate-800' }

    return (
      <Badge className={cn('text-xs', config.color)}>{config.label}</Badge>
    )
  }

  const toggleLessonDetails = (lessonId) => {
    setExpandedLessonId((current) => (current === lessonId ? null : lessonId))
  }

  const handleRefresh = () => {
    setRefreshToken((prev) => prev + 1)
  }

  const startItem = useMemo(() => {
    if (!pagination.count || lessons.length === 0) return 0
    return (currentPage - 1) * PAGE_SIZE + 1
  }, [pagination.count, lessons.length, currentPage])

  const endItem = useMemo(() => {
    if (!pagination.count || lessons.length === 0) return 0
    return (currentPage - 1) * PAGE_SIZE + lessons.length
  }, [pagination.count, lessons.length, currentPage])

  return (
    <DashboardLayout user={user}>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {t('studentSidebar.lessons.allLessons', 'My Lessons')}
            </h1>
            <p className="text-muted-foreground mt-1">
              {t('studentSidebar.lessons.tooltip', 'Explore the lessons prepared for your grade and track the subjects you are studying.')}
            </p>
            {localizedGradeName && (
              <div className="flex items-center gap-2 mt-3 text-sm text-muted-foreground">
                <GraduationCap className="h-4 w-4" />
                <span>
                  {t('common.grade', 'Grade')}: {localizedGradeName || t('common.notAvailable', 'Not available')}
                </span>
              </div>
            )}
          </div>

          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={isLoading}
            className="self-start md:self-auto"
          >
            <RefreshCw className={cn('h-4 w-4', isLoading && 'animate-spin mr-2', !isLoading && 'mr-2')} />
            {isLoading ? t('common.refreshing', 'Refreshing...') : t('common.refresh', 'Refresh')}
          </Button>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Filter className="h-4 w-4" />
              {t('lessons.filtersTitle', 'Filter lessons')}
            </CardTitle>
            <CardDescription>
              {t('lessons.filtersDescription', 'Search and filter lessons by subject to focus on what you need next.')}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search
                    className={cn(
                      'absolute top-1/2 h-4 w-4 text-muted-foreground -translate-y-1/2',
                      isRTL ? 'right-3' : 'left-3'
                    )}
                  />
                  <Input
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    placeholder={t('lessons.searchPlaceholder', 'Search lessons by title or description...')}
                    className={cn(isRTL ? 'pr-10' : 'pl-10')}
                  />
                </div>
              </div>

              <div className="w-full md:w-[240px]">
                <Select
                  value={selectedSubject}
                  onValueChange={(value) => {
                    setSelectedSubject(value)
                    setCurrentPage(1)
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('lessons.subject', 'Subject')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">
                      {t('lessons.allSubjects', 'All subjects')}
                    </SelectItem>
                    {subjects.map((subject) => (
                      <SelectItem key={subject.id} value={subject.id.toString()}>
                        {getLocalizedSubjectName(subject)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {error && (
          <Card className="border-destructive">
            <CardContent className="pt-6">
              <p className="text-sm text-destructive mb-4">{error}</p>
              <Button onClick={handleRefresh} variant="outline">
                {t('common.tryAgain', 'Try again')}
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Lessons */}
        <div className="relative">
          {isLoading && (
            <div className="absolute inset-0 bg-background/60 backdrop-blur-sm flex items-center justify-center z-10 rounded-lg">
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">
                  {t('common.loading', 'Loading...')}
                </p>
              </div>
            </div>
          )}

          {(!isLoading && lessons.length === 0) ? (
            <Card>
              <CardContent className="pt-10 pb-10 text-center space-y-4">
                <Layers className="h-10 w-10 mx-auto text-muted-foreground" />
                <h3 className="text-lg font-semibold">
                  {t('lessons.noLessonsFound', 'No lessons found for your filters')}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {t('lessons.noLessonsDescription', 'Try adjusting your filters or check back later for new lessons.')}
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {lessons.map((lesson) => (
                <Card key={lesson.id} className="flex flex-col">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-2">
                        <BookOpen className="h-5 w-5 text-primary" />
                        <div>
                          <CardTitle className="text-lg leading-tight">
                            {getLocalizedLessonTitle(lesson)}
                          </CardTitle>
                          <p className="text-sm text-muted-foreground mt-1">
                            {lesson.created_by_name && (
                              <span>{t('lessons.createdBy', 'Created by')}: {lesson.created_by_name}</span>
                            )}
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {getLocalizedSubjectName(lesson.subject_details)}
                      </Badge>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-3">
                      {getCycleBadge(lesson.cycle)}
                      {getDifficultyBadge(lesson.difficulty_level)}
                    </div>
                  </CardHeader>

                  <CardContent className="flex-1 flex flex-col gap-4">
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {lesson.description || t('lessons.noDescription', 'No description available for this lesson.')}
                    </p>

                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <GraduationCap className="h-4 w-4" />
                        <span>
                          {t('common.grade', 'Grade')}: {localizedGradeName || lesson.grade_name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {t('common.updated', 'Updated')}{' '}
                          {lesson.updated_at ? new Date(lesson.updated_at).toLocaleDateString() : t('common.notAvailable', 'N/A')}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        <span>
                          {t('lessons.order', 'Order')} #{lesson.order}
                        </span>
                      </div>
                      {lesson.resources && lesson.resources.length > 0 && (
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          <span>
                            {lesson.resources.length} {t('lessons.resources', 'Resources')}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-2 pt-2 mt-auto sm:flex-row sm:gap-3">

                      <Button

                        size="sm"

                        className="w-full sm:flex-1"

                        onClick={() => navigate(`/student/lessons/${lesson.id}`)}

                      >

                        <BookOpen className="h-4 w-4 mr-2" />

                        {t('lessons.viewLesson', 'View lesson')}

                      </Button>

                      <Button

                        variant="outline"

                        size="sm"

                        className="w-full sm:flex-1"

                        onClick={(event) => {

                          event.stopPropagation()

                          toggleLessonDetails(lesson.id)

                        }}

                      >

                        {expandedLessonId === lesson.id

                          ? t('common.hideDetails', 'Hide details')

                          : t('common.quickPreview', 'Quick preview')}

                      </Button>

                    </div>

                    {expandedLessonId === lesson.id && (
                      <div className="mt-4 space-y-4 border rounded-md p-4 bg-muted/30">
                        {lesson.objectives && (
                          <div>
                            <h4 className="text-sm font-semibold mb-2">
                              {t('lessons.objectives', 'Learning objectives')}
                            </h4>
                            <p className="text-sm text-muted-foreground whitespace-pre-line">
                              {lesson.objectives}
                            </p>
                          </div>
                        )}
                        {lesson.prerequisites && (
                          <div>
                            <h4 className="text-sm font-semibold mb-2">
                              {t('lessons.prerequisites', 'Prerequisites')}
                            </h4>
                            <p className="text-sm text-muted-foreground whitespace-pre-line">
                              {lesson.prerequisites}
                            </p>
                          </div>
                        )}
                        {lesson.resources && lesson.resources.length > 0 && (
                          <div>
                            <h4 className="text-sm font-semibold mb-2">
                              {t('lessons.resources', 'Resources')}
                            </h4>
                            <ul className="space-y-2 text-sm">
                              {lesson.resources.map((resource) => (
                                <li key={resource.id} className="flex items-center justify-between gap-2">
                                  <span className="truncate">
                                    {resource.title || t('lessons.resourceUntitled', 'Untitled resource')}
                                  </span>
                                  {resource.file_url && (
                                    <Button asChild variant="link" size="sm" className="px-0">
                                      <a href={resource.file_url} target="_blank" rel="noopener noreferrer">
                                        {t('common.open', 'Open')}
                                      </a>
                                    </Button>
                                  )}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        {pagination.count > 0 && (
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="text-sm text-muted-foreground">
                  {pagination.count > 0 ? (
                    <span>
                      {t('common.showing', 'Showing')} {startItem}-{endItem} {t('common.of', 'of')} {pagination.count} {t('lessons.lessons', 'lessons')}
                    </span>
                  ) : (
                    <span>{t('lessons.noResults', 'No lessons to display')}</span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                    disabled={currentPage === 1 || isLoading}
                  >
                    {t('common.previous', 'Previous')}
                  </Button>
                  <div className="text-sm font-medium">
                    {t('common.page', 'Page')} {currentPage} {t('common.of', 'of')} {totalPages}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                    disabled={currentPage >= totalPages || isLoading}
                  >
                    {t('common.next', 'Next')}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}

export default StudentLessonsPage









