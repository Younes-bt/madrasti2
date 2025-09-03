import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { useLanguage } from '../../hooks/useLanguage'
import { 
  BookOpen,
  Plus,
  Search,
  Filter,
  Grid3X3,
  List,
  Star,
  Eye,
  Clock,
  Users,
  Download,
  Share2,
  Copy,
  Edit,
  Trash2,
  Play,
  Pause,
  FileText,
  Image as ImageIcon,
  Video,
  Mic,
  Upload,
  Tag,
  Calendar,
  Target,
  TrendingUp,
  Award,
  Settings,
  MoreHorizontal,
  Heart,
  MessageSquare,
  Bookmark,
  ExternalLink,
  Zap,
  CheckCircle
} from 'lucide-react'

const LessonLibrary = () => {
  const { t } = useLanguage()
  const [viewMode, setViewMode] = useState('grid') // grid, list
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedSubject, setSelectedSubject] = useState('all')
  const [selectedGrade, setSelectedGrade] = useState('all')
  const [sortBy, setSortBy] = useState('recent') // recent, popular, title, duration
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedLessons, setSelectedLessons] = useState([])

  const categories = [
    { id: 'all', name: t('common.all'), count: 156 },
    { id: 'my_lessons', name: t('lessons.myLessons'), count: 24 },
    { id: 'shared', name: t('lessons.sharedWithMe'), count: 18 },
    { id: 'public', name: t('lessons.publicLibrary'), count: 89 },
    { id: 'favorites', name: t('lessons.favorites'), count: 12 },
    { id: 'drafts', name: t('lessons.drafts'), count: 8 },
    { id: 'archived', name: t('lessons.archived'), count: 5 }
  ]

  const subjects = [
    { id: 'all', name: t('common.all') },
    { id: 'math', name: 'Mathematics' },
    { id: 'physics', name: 'Physics' },
    { id: 'chemistry', name: 'Chemistry' },
    { id: 'arabic', name: 'Arabic' },
    { id: 'french', name: 'French' },
    { id: 'english', name: 'English' },
    { id: 'history', name: 'History' },
    { id: 'geography', name: 'Geography' }
  ]

  const grades = [
    { id: 'all', name: t('common.allGrades') },
    { id: '1ere', name: '1ère Année' },
    { id: '2eme', name: '2ème Année' },
    { id: '3eme', name: '3ème Année' },
    { id: 'terminale', name: 'Terminale' }
  ]

  const lessons = [
    {
      id: 1,
      title: 'Introduction to Algebra',
      description: 'Basic concepts of algebraic expressions and equations with practical examples',
      subject: 'Mathematics',
      grade: '1ère Année',
      author: 'Mr. Alami',
      author_avatar: null,
      duration_minutes: 45,
      type: 'video', // video, interactive, document, audio, mixed
      difficulty: 'medium',
      status: 'published', // draft, published, archived
      created_at: '2024-08-15T10:00:00Z',
      updated_at: '2024-09-01T14:30:00Z',
      thumbnail: null,
      views: 234,
      likes: 18,
      comments: 5,
      completions: 187,
      avg_rating: 4.6,
      total_ratings: 23,
      tags: ['algebra', 'equations', 'basics'],
      resources: [
        { type: 'video', name: 'Introduction Video', size: '125MB' },
        { type: 'pdf', name: 'Practice Exercises', size: '2.3MB' },
        { type: 'quiz', name: 'Knowledge Check', questions: 10 }
      ],
      learning_objectives: [
        'Understand basic algebraic concepts',
        'Solve simple linear equations',
        'Apply algebra to real-world problems'
      ],
      is_favorite: true,
      is_shared: false,
      completion_rate: 80.5,
      estimated_completion: 42
    },
    {
      id: 2,
      title: 'Chemical Reactions and Equations',
      description: 'Understanding different types of chemical reactions and how to balance equations',
      subject: 'Chemistry',
      grade: '2ème Année',
      author: 'Dr. Alaoui',
      author_avatar: null,
      duration_minutes: 38,
      type: 'interactive',
      difficulty: 'hard',
      status: 'published',
      created_at: '2024-08-20T09:15:00Z',
      updated_at: '2024-08-25T16:45:00Z',
      thumbnail: null,
      views: 156,
      likes: 24,
      comments: 8,
      completions: 142,
      avg_rating: 4.8,
      total_ratings: 19,
      tags: ['chemistry', 'reactions', 'equations', 'balancing'],
      resources: [
        { type: 'interactive', name: 'Virtual Lab', size: '45MB' },
        { type: 'pdf', name: 'Reaction Guide', size: '5.1MB' },
        { type: 'video', name: 'Demo Experiments', size: '89MB' }
      ],
      learning_objectives: [
        'Identify different reaction types',
        'Balance chemical equations',
        'Predict reaction products'
      ],
      is_favorite: false,
      is_shared: true,
      completion_rate: 91.0,
      estimated_completion: 35
    },
    {
      id: 3,
      title: 'Arabic Poetry Analysis',
      description: 'Deep dive into classical Arabic poetry with focus on meter and meaning',
      subject: 'Arabic',
      grade: '3ème Année',
      author: 'Mrs. Tazi',
      author_avatar: null,
      duration_minutes: 52,
      type: 'mixed',
      difficulty: 'hard',
      status: 'draft',
      created_at: '2024-09-01T11:30:00Z',
      updated_at: '2024-09-02T09:20:00Z',
      thumbnail: null,
      views: 0,
      likes: 0,
      comments: 0,
      completions: 0,
      avg_rating: 0,
      total_ratings: 0,
      tags: ['arabic', 'poetry', 'literature', 'analysis'],
      resources: [
        { type: 'pdf', name: 'Poetry Collection', size: '3.7MB' },
        { type: 'audio', name: 'Recitations', size: '67MB' }
      ],
      learning_objectives: [
        'Analyze poetic structure',
        'Understand classical meters',
        'Interpret literary meaning'
      ],
      is_favorite: false,
      is_shared: false,
      completion_rate: 0,
      estimated_completion: 50
    },
    {
      id: 4,
      title: 'Physics: Motion and Forces',
      description: 'Fundamental concepts of kinematics and dynamics with real-world applications',
      subject: 'Physics',
      grade: '1ère Année',
      author: 'Mrs. Bennani',
      author_avatar: null,
      duration_minutes: 41,
      type: 'video',
      difficulty: 'medium',
      status: 'published',
      created_at: '2024-08-10T14:20:00Z',
      updated_at: '2024-08-18T10:15:00Z',
      thumbnail: null,
      views: 298,
      likes: 31,
      comments: 12,
      completions: 256,
      avg_rating: 4.4,
      total_ratings: 34,
      tags: ['physics', 'motion', 'forces', 'kinematics'],
      resources: [
        { type: 'video', name: 'Main Lecture', size: '156MB' },
        { type: 'simulation', name: 'Motion Simulator', size: '23MB' },
        { type: 'pdf', name: 'Problem Set', size: '1.8MB' }
      ],
      learning_objectives: [
        'Define motion and displacement',
        'Calculate velocity and acceleration',
        'Apply Newton\'s laws of motion'
      ],
      is_favorite: true,
      is_shared: true,
      completion_rate: 85.9,
      estimated_completion: 39
    }
  ]

  const filteredLessons = lessons.filter(lesson => {
    const matchesCategory = selectedCategory === 'all' || 
      (selectedCategory === 'my_lessons' && lesson.author === 'Current User') ||
      (selectedCategory === 'favorites' && lesson.is_favorite) ||
      (selectedCategory === 'shared' && lesson.is_shared) ||
      (selectedCategory === 'drafts' && lesson.status === 'draft') ||
      (selectedCategory === 'archived' && lesson.status === 'archived') ||
      (selectedCategory === 'public' && lesson.status === 'published')
    
    const matchesSubject = selectedSubject === 'all' || lesson.subject.toLowerCase().includes(selectedSubject)
    const matchesGrade = selectedGrade === 'all' || lesson.grade.includes(selectedGrade)
    const matchesSearch = lesson.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lesson.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lesson.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    
    return matchesCategory && matchesSubject && matchesGrade && matchesSearch
  })

  const getTypeIcon = (type) => {
    const icons = {
      video: Video,
      interactive: Zap,
      document: FileText,
      audio: Mic,
      mixed: BookOpen
    }
    return icons[type] || BookOpen
  }

  const getTypeColor = (type) => {
    const colors = {
      video: 'bg-red-100 text-red-800',
      interactive: 'bg-blue-100 text-blue-800',
      document: 'bg-green-100 text-green-800',
      audio: 'bg-purple-100 text-purple-800',
      mixed: 'bg-orange-100 text-orange-800'
    }
    return colors[type] || colors.mixed
  }

  const getDifficultyColor = (difficulty) => {
    const colors = {
      easy: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      hard: 'bg-red-100 text-red-800'
    }
    return colors[difficulty] || colors.medium
  }

  const getStatusColor = (status) => {
    const colors = {
      draft: 'bg-gray-100 text-gray-800',
      published: 'bg-green-100 text-green-800',
      archived: 'bg-orange-100 text-orange-800'
    }
    return colors[status] || colors.draft
  }

  const handleSelectLesson = (lessonId) => {
    setSelectedLessons(prev => 
      prev.includes(lessonId)
        ? prev.filter(id => id !== lessonId)
        : [...prev, lessonId]
    )
  }

  const handleSelectAll = () => {
    if (selectedLessons.length === filteredLessons.length) {
      setSelectedLessons([])
    } else {
      setSelectedLessons(filteredLessons.map(l => l.id))
    }
  }

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-3 w-3 ${
          i < Math.floor(rating) 
            ? 'text-yellow-400 fill-current' 
            : 'text-gray-300'
        }`}
      />
    ))
  }

  return (
    <Card className="max-w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-blue-500" />
              {t('lessons.lessonLibrary')}
            </CardTitle>
            <CardDescription>
              {t('lessons.libraryDescription')}
            </CardDescription>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Upload className="h-4 w-4 mr-1" />
              {t('lessons.import')}
            </Button>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-1" />
              {t('lessons.createLesson')}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Filters and Search */}
        <div className="flex flex-col gap-4">
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
              >
                {category.name} ({category.count})
              </Button>
            ))}
          </div>

          {/* Search and Filters Row */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder={t('lessons.searchLessons')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border rounded-md w-80"
                />
              </div>
              
              <select 
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="border rounded-md px-3 py-2 text-sm"
              >
                {subjects.map((subject) => (
                  <option key={subject.id} value={subject.id}>
                    {subject.name}
                  </option>
                ))}
              </select>
              
              <select 
                value={selectedGrade}
                onChange={(e) => setSelectedGrade(e.target.value)}
                className="border rounded-md px-3 py-2 text-sm"
              >
                {grades.map((grade) => (
                  <option key={grade.id} value={grade.id}>
                    {grade.name}
                  </option>
                ))}
              </select>

              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border rounded-md px-3 py-2 text-sm"
              >
                <option value="recent">{t('lessons.mostRecent')}</option>
                <option value="popular">{t('lessons.mostPopular')}</option>
                <option value="title">{t('lessons.alphabetical')}</option>
                <option value="duration">{t('lessons.byDuration')}</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex border rounded-md">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedLessons.length > 0 && (
          <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-blue-800 font-medium">
                {selectedLessons.length} {t('lessons.selected')}
              </span>
              <div className="flex gap-2">
                <Button size="sm" variant="outline">
                  <Share2 className="h-4 w-4 mr-1" />
                  {t('lessons.share')}
                </Button>
                <Button size="sm" variant="outline">
                  <Copy className="h-4 w-4 mr-1" />
                  {t('lessons.duplicate')}
                </Button>
                <Button size="sm" variant="outline">
                  <Download className="h-4 w-4 mr-1" />
                  {t('lessons.export')}
                </Button>
                <Button size="sm" variant="outline" onClick={() => setSelectedLessons([])}>
                  {t('common.clearSelection')}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Results Summary */}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-4">
            <span>{filteredLessons.length} {t('lessons.lessonsFound')}</span>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={selectedLessons.length === filteredLessons.length && filteredLessons.length > 0}
                onChange={handleSelectAll}
                className="rounded"
              />
              <span>{t('common.selectAll')}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            <span>{t('lessons.sortedBy')} {t(`lessons.${sortBy}`)}</span>
          </div>
        </div>

        {/* Lessons Display */}
        {filteredLessons.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="font-medium text-lg mb-2">{t('lessons.noLessonsFound')}</h3>
            <p className="text-muted-foreground mb-4">{t('lessons.tryDifferentFilters')}</p>
            <Button>
              <Plus className="h-4 w-4 mr-1" />
              {t('lessons.createFirstLesson')}
            </Button>
          </div>
        ) : viewMode === 'grid' ? (
          // Grid View
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredLessons.map((lesson) => {
              const TypeIcon = getTypeIcon(lesson.type)
              
              return (
                <Card key={lesson.id} className={`transition-all hover:shadow-md ${
                  selectedLessons.includes(lesson.id) ? 'ring-2 ring-blue-400' : ''
                }`}>
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between mb-2">
                      <input
                        type="checkbox"
                        checked={selectedLessons.includes(lesson.id)}
                        onChange={() => handleSelectLesson(lesson.id)}
                        className="rounded"
                      />
                      <div className="flex items-center gap-1">
                        {lesson.is_favorite && (
                          <Heart className="h-4 w-4 text-red-500 fill-current" />
                        )}
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    {/* Thumbnail placeholder */}
                    <div className="w-full h-32 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg flex items-center justify-center mb-3">
                      <TypeIcon className="h-8 w-8 text-blue-500" />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Badge className={getTypeColor(lesson.type)}>
                          <TypeIcon className="h-3 w-3 mr-1" />
                          {t(`lessons.${lesson.type}`)}
                        </Badge>
                        <Badge className={getDifficultyColor(lesson.difficulty)}>
                          {t(`lessons.${lesson.difficulty}`)}
                        </Badge>
                      </div>
                      
                      <CardTitle className="text-sm line-clamp-2">{lesson.title}</CardTitle>
                      <CardDescription className="text-xs line-clamp-2">
                        {lesson.description}
                      </CardDescription>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{lesson.subject}</span>
                        <span>•</span>
                        <span>{lesson.grade}</span>
                        <span>•</span>
                        <Clock className="h-3 w-3" />
                        <span>{formatDuration(lesson.duration_minutes)}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-xs">
                        <Avatar className="h-5 w-5">
                          <AvatarFallback className="text-xs">
                            {lesson.author.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-muted-foreground">{lesson.author}</span>
                      </div>
                      
                      {lesson.status === 'published' && (
                        <div className="space-y-2">
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Eye className="h-3 w-3" />
                              <span>{lesson.views}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Heart className="h-3 w-3" />
                              <span>{lesson.likes}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <CheckCircle className="h-3 w-3" />
                              <span>{lesson.completions}</span>
                            </div>
                          </div>
                          
                          {lesson.avg_rating > 0 && (
                            <div className="flex items-center gap-1">
                              <div className="flex">
                                {renderStars(lesson.avg_rating)}
                              </div>
                              <span className="text-xs text-muted-foreground">
                                {lesson.avg_rating} ({lesson.total_ratings})
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                      
                      <Badge className={getStatusColor(lesson.status)} variant="outline">
                        {t(`lessons.${lesson.status}`)}
                      </Badge>
                    </div>
                    
                    <div className="flex gap-1 mt-3">
                      <Button size="sm" className="flex-1">
                        <Play className="h-3 w-3 mr-1" />
                        {lesson.status === 'draft' ? t('lessons.edit') : t('lessons.view')}
                      </Button>
                      <Button variant="outline" size="sm">
                        <Share2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        ) : (
          // List View
          <div className="space-y-2">
            {filteredLessons.map((lesson) => {
              const TypeIcon = getTypeIcon(lesson.type)
              
              return (
                <Card key={lesson.id} className={`p-4 transition-all hover:shadow-sm ${
                  selectedLessons.includes(lesson.id) ? 'ring-2 ring-blue-400' : ''
                }`}>
                  <div className="flex items-center gap-4">
                    <input
                      type="checkbox"
                      checked={selectedLessons.includes(lesson.id)}
                      onChange={() => handleSelectLesson(lesson.id)}
                      className="rounded"
                    />
                    
                    <div className="w-16 h-12 bg-gradient-to-br from-blue-50 to-blue-100 rounded flex items-center justify-center flex-shrink-0">
                      <TypeIcon className="h-5 w-5 text-blue-500" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium text-sm truncate">{lesson.title}</h3>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <Badge className={getTypeColor(lesson.type)}>
                            {t(`lessons.${lesson.type}`)}
                          </Badge>
                          <Badge className={getDifficultyColor(lesson.difficulty)}>
                            {t(`lessons.${lesson.difficulty}`)}
                          </Badge>
                          <Badge className={getStatusColor(lesson.status)} variant="outline">
                            {t(`lessons.${lesson.status}`)}
                          </Badge>
                        </div>
                      </div>
                      
                      <p className="text-sm text-muted-foreground truncate mb-2">
                        {lesson.description}
                      </p>
                      
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Avatar className="h-4 w-4">
                            <AvatarFallback className="text-xs">
                              {lesson.author.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <span>{lesson.author}</span>
                        </div>
                        <span>{lesson.subject} • {lesson.grade}</span>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{formatDuration(lesson.duration_minutes)}</span>
                        </div>
                        {lesson.status === 'published' && (
                          <>
                            <div className="flex items-center gap-1">
                              <Eye className="h-3 w-3" />
                              <span>{lesson.views}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              <span>{lesson.completions}</span>
                            </div>
                            {lesson.avg_rating > 0 && (
                              <div className="flex items-center gap-1">
                                <Star className="h-3 w-3 text-yellow-400 fill-current" />
                                <span>{lesson.avg_rating}</span>
                              </div>
                            )}
                          </>
                        )}
                        <span>{formatDate(lesson.updated_at)}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1 flex-shrink-0">
                      {lesson.is_favorite && (
                        <Heart className="h-4 w-4 text-red-500 fill-current" />
                      )}
                      <Button size="sm">
                        <Play className="h-4 w-4 mr-1" />
                        {lesson.status === 'draft' ? t('lessons.edit') : t('lessons.view')}
                      </Button>
                      <Button variant="outline" size="sm">
                        <Share2 className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        )}

        {/* Pagination */}
        {filteredLessons.length > 0 && (
          <div className="flex items-center justify-center gap-2 pt-4">
            <Button variant="outline" size="sm" disabled>
              {t('common.previous')}
            </Button>
            <Button variant="outline" size="sm" className="bg-blue-50">
              1
            </Button>
            <Button variant="outline" size="sm">
              2
            </Button>
            <Button variant="outline" size="sm">
              3
            </Button>
            <Button variant="outline" size="sm">
              {t('common.next')}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default LessonLibrary