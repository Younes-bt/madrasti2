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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table'
import { cn } from '../../lib/utils'
import {
  Search,
  BookOpen,
  GraduationCap,
  Calendar,
  Clock,
  Lock,
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

          {!isLoading && lessons.length === 0 && (
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
          )}

          {!isLoading && lessons.length > 0 && (
            <Card className="mb-6">
              <CardContent className="pt-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[220px]">{t('lessons.lesson', 'Lesson')}</TableHead>
                      <TableHead>{t('lessons.subject', 'Subject')}</TableHead>
                      <TableHead>{t('common.grade', 'Grade')}</TableHead>
                      <TableHead>{t('lessons.cycle', 'Cycle')}</TableHead>
                      <TableHead>{t('lessons.difficulty', 'Difficulty')}</TableHead>
                      <TableHead className="text-center">{t('lessons.resources', 'Resources')}</TableHead>
                      <TableHead>{t('common.updated', 'Updated')}</TableHead>
                      <TableHead className="w-[180px]">{t('common.actions', 'Actions')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {lessons.map((lesson) => {
                      const isLessonAvailable = Boolean(
                        lesson?.is_available ??
                        lesson?.is_published_for_student ??
                        lesson?.is_published
                      )

                      const handleViewLesson = () => {
                        if (!isLessonAvailable) return
                        navigate(`/student/lessons/${lesson.id}`)
                      }

                      const handleToggleDetails = () => {
                        if (!isLessonAvailable) return
                        toggleLessonDetails(lesson.id)
                      }

                      return (
                        <TableRow key={lesson.id} className={cn(!isLessonAvailable && 'opacity-70')}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <BookOpen className="h-4 w-4 text-primary" />
                              <button
                                type="button"
                                className={cn(
                                  'font-medium hover:underline text-left',
                                  !isLessonAvailable && 'text-muted-foreground cursor-not-allowed hover:no-underline'
                                )}
                                onClick={handleViewLesson}
                                disabled={!isLessonAvailable}
                                aria-disabled={!isLessonAvailable}
                              >
                                {getLocalizedLessonTitle(lesson)}
                              </button>
                            </div>
                            <div className="mt-1 text-xs text-muted-foreground line-clamp-1">
                              {lesson.description || t('lessons.noDescription', 'No description available for this lesson.')}
                            </div>
                            {!isLessonAvailable && (
                              <div className="mt-2">
                                <Badge
                                  variant="outline"
                                  className="inline-flex items-center gap-1 border-dashed bg-muted/50 text-muted-foreground"
                                >
                                  <Lock className="h-3.5 w-3.5" />
                                  {t('lessons.comingSoon', 'Coming soon')}
                                </Badge>
                              </div>
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="text-xs">
                              {getLocalizedSubjectName(lesson.subject_details)}
                            </Badge>
                          </TableCell>
                          <TableCell>{localizedGradeName || lesson.grade_name}</TableCell>
                          <TableCell>{getCycleBadge(lesson.cycle)}</TableCell>
                          <TableCell>{getDifficultyBadge(lesson.difficulty_level)}</TableCell>
                          <TableCell className="text-center">{lesson.resources?.length || 0}</TableCell>
                          <TableCell>{lesson.updated_at ? new Date(lesson.updated_at).toLocaleDateString() : t('common.notAvailable', 'N/A')}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                onClick={handleViewLesson}
                                disabled={!isLessonAvailable}
                                className={cn(
                                  !isLessonAvailable && 'pointer-events-none bg-muted text-muted-foreground hover:bg-muted'
                                )}
                              >
                                {isLessonAvailable ? (
                                  <>
                                    <BookOpen className="h-4 w-4 mr-2" />
                                    {t('lessons.viewLesson', 'View lesson')}
                                  </>
                                ) : (
                                  <>
                                    <Clock className="h-4 w-4 mr-2" />
                                    {t('lessons.comingSoon', 'Coming soon')}
                                  </>
                                )}
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}



        {/* Pagination */}
        {pagination.count > 0 && (
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="text-sm text-muted-foreground">
                  <span>
                    {t('common.showing', 'Showing')} {startItem}-{endItem} {t('common.of', 'of')} {pagination.count} {t('lessons.lessons', 'lessons')}
                  </span>
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
    </div>
    </DashboardLayout>
  )
}

export default StudentLessonsPage
