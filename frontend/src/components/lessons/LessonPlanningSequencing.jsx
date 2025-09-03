import React, { useState, useRef } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { useLanguage } from '../../hooks/useLanguage'
import { 
  BookOpen,
  Plus,
  GripVertical,
  Play,
  Pause,
  Clock,
  Users,
  Target,
  CheckCircle,
  Circle,
  Edit,
  Trash2,
  Copy,
  Move,
  Eye,
  Settings,
  Calendar,
  Timer,
  Activity,
  FileText,
  Video,
  HelpCircle,
  Lightbulb,
  Award,
  Flag,
  ArrowRight,
  ArrowDown,
  Shuffle,
  RotateCcw,
  Save,
  Share2,
  Download,
  Upload,
  Zap,
  AlertCircle,
  ChevronRight,
  ChevronDown,
  MoreHorizontal
} from 'lucide-react'

const LessonPlanningSequencing = () => {
  const { t } = useLanguage()
  const [selectedUnit, setSelectedUnit] = useState(1)
  const [draggedItem, setDraggedItem] = useState(null)
  const [expandedSections, setExpandedSections] = useState(['unit_1', 'lesson_1'])
  const [editingItem, setEditingItem] = useState(null)
  const [viewMode, setViewMode] = useState('tree') // tree, timeline, kanban

  const learningUnits = [
    {
      id: 1,
      title: 'Algebra Fundamentals',
      description: 'Introduction to algebraic concepts and basic operations',
      subject: 'Mathematics',
      grade: '1ère Année C',
      duration_weeks: 4,
      total_lessons: 12,
      completed_lessons: 5,
      status: 'in_progress', // planned, in_progress, completed, paused
      start_date: '2024-09-01',
      end_date: '2024-09-30',
      learning_objectives: [
        'Understand algebraic expressions',
        'Solve linear equations',
        'Apply algebraic concepts to real-world problems'
      ],
      lessons: [
        {
          id: 1,
          title: 'Introduction to Variables',
          description: 'Understanding what variables are and how they work',
          type: 'concept', // concept, practice, assessment, review, project
          duration_minutes: 45,
          order: 1,
          status: 'completed',
          activities: [
            {
              id: 1,
              title: 'Warm-up: Number Patterns',
              type: 'warmup',
              duration_minutes: 5,
              description: 'Students identify patterns in number sequences',
              resources: ['worksheet_patterns.pdf'],
              order: 1
            },
            {
              id: 2,
              title: 'Variable Introduction Video',
              type: 'instruction',
              duration_minutes: 15,
              description: 'Watch introductory video about variables',
              resources: ['intro_variables.mp4'],
              order: 2
            },
            {
              id: 3,
              title: 'Guided Practice',
              type: 'practice',
              duration_minutes: 20,
              description: 'Work through examples together',
              resources: ['practice_examples.pdf'],
              order: 3
            },
            {
              id: 4,
              title: 'Exit Ticket',
              type: 'assessment',
              duration_minutes: 5,
              description: 'Quick check for understanding',
              resources: ['exit_ticket.pdf'],
              order: 4
            }
          ],
          prerequisites: [],
          learning_outcomes: [
            'Define what a variable is',
            'Identify variables in expressions',
            'Use variables in simple contexts'
          ],
          differentiation: {
            support: 'Visual aids and manipulatives for struggling students',
            extension: 'Advanced variable manipulation for gifted students'
          }
        },
        {
          id: 2,
          title: 'Writing Algebraic Expressions',
          description: 'Learn to translate word problems into algebraic expressions',
          type: 'practice',
          duration_minutes: 45,
          order: 2,
          status: 'completed',
          activities: [
            {
              id: 5,
              title: 'Review Previous Lesson',
              type: 'review',
              duration_minutes: 10,
              description: 'Quick review of variables',
              resources: [],
              order: 1
            },
            {
              id: 6,
              title: 'Translation Practice',
              type: 'practice',
              duration_minutes: 25,
              description: 'Convert word problems to expressions',
              resources: ['translation_practice.pdf'],
              order: 2
            },
            {
              id: 7,
              title: 'Peer Review Activity',
              type: 'collaboration',
              duration_minutes: 10,
              description: 'Students check each other\'s work',
              resources: [],
              order: 3
            }
          ],
          prerequisites: [1],
          learning_outcomes: [
            'Translate word problems into expressions',
            'Identify key mathematical operations',
            'Write expressions using proper notation'
          ]
        },
        {
          id: 3,
          title: 'Solving Simple Equations',
          description: 'Introduction to solving basic linear equations',
          type: 'concept',
          duration_minutes: 50,
          order: 3,
          status: 'in_progress',
          activities: [
            {
              id: 8,
              title: 'Equation Introduction',
              type: 'instruction',
              duration_minutes: 20,
              description: 'What are equations and how to solve them',
              resources: ['equations_intro.pptx'],
              order: 1
            },
            {
              id: 9,
              title: 'Balance Method Demo',
              type: 'demonstration',
              duration_minutes: 15,
              description: 'Show equation solving as balance',
              resources: ['balance_demo.mp4'],
              order: 2
            },
            {
              id: 10,
              title: 'Practice Problems',
              type: 'practice',
              duration_minutes: 15,
              description: 'Students solve practice equations',
              resources: ['practice_equations.pdf'],
              order: 3
            }
          ],
          prerequisites: [1, 2],
          learning_outcomes: [
            'Understand equation solving process',
            'Apply balance method to solve equations',
            'Check solutions for accuracy'
          ]
        },
        {
          id: 4,
          title: 'Assessment: Algebra Basics',
          description: 'Comprehensive assessment of algebra fundamentals',
          type: 'assessment',
          duration_minutes: 45,
          order: 4,
          status: 'planned',
          activities: [
            {
              id: 11,
              title: 'Written Assessment',
              type: 'assessment',
              duration_minutes: 35,
              description: 'Individual assessment covering all topics',
              resources: ['assessment_algebra_basics.pdf'],
              order: 1
            },
            {
              id: 12,
              title: 'Reflection Discussion',
              type: 'reflection',
              duration_minutes: 10,
              description: 'Students reflect on their learning',
              resources: [],
              order: 2
            }
          ],
          prerequisites: [1, 2, 3],
          learning_outcomes: [
            'Demonstrate understanding of variables',
            'Write and solve basic equations',
            'Apply concepts to word problems'
          ]
        }
      ]
    }
  ]

  const activityTypes = {
    warmup: { color: 'bg-blue-100 text-blue-800', icon: Play },
    instruction: { color: 'bg-green-100 text-green-800', icon: BookOpen },
    practice: { color: 'bg-yellow-100 text-yellow-800', icon: Edit },
    assessment: { color: 'bg-red-100 text-red-800', icon: CheckCircle },
    review: { color: 'bg-purple-100 text-purple-800', icon: RotateCcw },
    collaboration: { color: 'bg-orange-100 text-orange-800', icon: Users },
    demonstration: { color: 'bg-pink-100 text-pink-800', icon: Eye },
    reflection: { color: 'bg-gray-100 text-gray-800', icon: Lightbulb }
  }

  const lessonTypes = {
    concept: { color: 'bg-blue-100 text-blue-800', icon: Lightbulb },
    practice: { color: 'bg-green-100 text-green-800', icon: Edit },
    assessment: { color: 'bg-red-100 text-red-800', icon: Target },
    review: { color: 'bg-purple-100 text-purple-800', icon: RotateCcw },
    project: { color: 'bg-orange-100 text-orange-800', icon: Flag }
  }

  const getStatusColor = (status) => {
    const colors = {
      planned: 'bg-gray-100 text-gray-800',
      in_progress: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      paused: 'bg-yellow-100 text-yellow-800'
    }
    return colors[status] || colors.planned
  }

  const toggleSection = (sectionId) => {
    setExpandedSections(prev => 
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    )
  }

  const handleDragStart = (e, item, type) => {
    setDraggedItem({ item, type })
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (e, targetId, targetType) => {
    e.preventDefault()
    
    if (!draggedItem) return
    
    console.log('Reorder:', draggedItem, 'to', targetId, targetType)
    // Handle reordering logic here
    
    setDraggedItem(null)
  }

  const addActivity = (lessonId) => {
    console.log('Add activity to lesson:', lessonId)
    // Add new activity logic
  }

  const addLesson = (unitId) => {
    console.log('Add lesson to unit:', unitId)
    // Add new lesson logic
  }

  const duplicateItem = (item, type) => {
    console.log('Duplicate:', item, type)
    // Duplication logic
  }

  const deleteItem = (itemId, type) => {
    console.log('Delete:', itemId, type)
    // Deletion logic
  }

  const estimateTotalDuration = (activities) => {
    return activities.reduce((sum, activity) => sum + activity.duration_minutes, 0)
  }

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
  }

  const calculateProgress = (lessons) => {
    const completed = lessons.filter(l => l.status === 'completed').length
    return lessons.length > 0 ? Math.round((completed / lessons.length) * 100) : 0
  }

  const currentUnit = learningUnits.find(u => u.id === selectedUnit)
  
  return (
    <Card className="max-w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-blue-500" />
              {t('lessons.lessonPlanningSequencing')}
            </CardTitle>
            <CardDescription>
              {t('lessons.planningDescription')}
            </CardDescription>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="flex border rounded">
              <Button
                variant={viewMode === 'tree' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('tree')}
              >
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'timeline' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('timeline')}
              >
                <Calendar className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'kanban' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('kanban')}
              >
                <Activity className="h-4 w-4" />
              </Button>
            </div>
            <Button variant="outline" size="sm">
              <Upload className="h-4 w-4 mr-1" />
              {t('lessons.import')}
            </Button>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-1" />
              {t('lessons.createUnit')}
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Unit Overview */}
        {currentUnit && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">{currentUnit.title}</CardTitle>
                  <CardDescription>{currentUnit.description}</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getStatusColor(currentUnit.status)}>
                    {t(`lessons.${currentUnit.status}`)}
                  </Badge>
                  <Button variant="ghost" size="sm">
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="grid grid-cols-4 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {calculateProgress(currentUnit.lessons)}%
                  </div>
                  <div className="text-sm text-muted-foreground">{t('lessons.progress')}</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {currentUnit.completed_lessons}/{currentUnit.total_lessons}
                  </div>
                  <div className="text-sm text-muted-foreground">{t('lessons.lessons')}</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {currentUnit.duration_weeks}
                  </div>
                  <div className="text-sm text-muted-foreground">{t('lessons.weeks')}</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {currentUnit.learning_objectives.length}
                  </div>
                  <div className="text-sm text-muted-foreground">{t('lessons.objectives')}</div>
                </div>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all"
                  style={{ width: `${calculateProgress(currentUnit.lessons)}%` }}
                ></div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">{t('lessons.subject')}: </span>
                  <span>{currentUnit.subject}</span>
                </div>
                <div>
                  <span className="font-medium">{t('lessons.grade')}: </span>
                  <span>{currentUnit.grade}</span>
                </div>
                <div>
                  <span className="font-medium">{t('lessons.startDate')}: </span>
                  <span>{new Date(currentUnit.start_date).toLocaleDateString()}</span>
                </div>
                <div>
                  <span className="font-medium">{t('lessons.endDate')}: </span>
                  <span>{new Date(currentUnit.end_date).toLocaleDateString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tree View */}
        {viewMode === 'tree' && currentUnit && (
          <div className="space-y-3">
            {currentUnit.lessons.map((lesson, lessonIndex) => {
              const LessonTypeIcon = lessonTypes[lesson.type]?.icon || BookOpen
              const sectionKey = `lesson_${lesson.id}`
              const isExpanded = expandedSections.includes(sectionKey)
              
              return (
                <Card key={lesson.id} className="transition-all">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <GripVertical 
                          className="h-4 w-4 text-muted-foreground cursor-move"
                          draggable
                          onDragStart={(e) => handleDragStart(e, lesson, 'lesson')}
                        />
                        <Badge variant="outline" className="w-8 h-8 rounded-full p-0 flex items-center justify-center">
                          {lessonIndex + 1}
                        </Badge>
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <CardTitle className="text-base">{lesson.title}</CardTitle>
                          <Badge className={lessonTypes[lesson.type]?.color}>
                            <LessonTypeIcon className="h-3 w-3 mr-1" />
                            {t(`lessons.${lesson.type}`)}
                          </Badge>
                          <Badge className={getStatusColor(lesson.status)}>
                            {t(`lessons.${lesson.status}`)}
                          </Badge>
                        </div>
                        <CardDescription className="text-sm">
                          {lesson.description}
                        </CardDescription>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <div className="text-right text-sm">
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span>{formatDuration(lesson.duration_minutes)}</span>
                          </div>
                          <div className="flex items-center gap-1 text-muted-foreground">
                            <Activity className="h-3 w-3" />
                            <span>{lesson.activities.length} {t('lessons.activities')}</span>
                          </div>
                        </div>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleSection(sectionKey)}
                        >
                          {isExpanded ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </Button>
                        
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  
                  {isExpanded && (
                    <CardContent className="pt-0">
                      {/* Learning Outcomes */}
                      {lesson.learning_outcomes && lesson.learning_outcomes.length > 0 && (
                        <div className="mb-4">
                          <h4 className="font-medium text-sm mb-2 flex items-center gap-1">
                            <Target className="h-4 w-4 text-blue-500" />
                            {t('lessons.learningOutcomes')}
                          </h4>
                          <ul className="space-y-1">
                            {lesson.learning_outcomes.map((outcome, index) => (
                              <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                                <Circle className="h-3 w-3 mt-1 flex-shrink-0" />
                                <span>{outcome}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Prerequisites */}
                      {lesson.prerequisites && lesson.prerequisites.length > 0 && (
                        <div className="mb-4">
                          <h4 className="font-medium text-sm mb-2 flex items-center gap-1">
                            <AlertCircle className="h-4 w-4 text-orange-500" />
                            {t('lessons.prerequisites')}
                          </h4>
                          <div className="flex gap-1">
                            {lesson.prerequisites.map((prereqId) => {
                              const prereqLesson = currentUnit.lessons.find(l => l.id === prereqId)
                              return (
                                <Badge key={prereqId} variant="outline" className="text-xs">
                                  {prereqLesson ? prereqLesson.title : `Lesson ${prereqId}`}
                                </Badge>
                              )
                            })}
                          </div>
                        </div>
                      )}

                      {/* Activities */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-sm flex items-center gap-1">
                            <Activity className="h-4 w-4 text-green-500" />
                            {t('lessons.activities')} ({lesson.activities.length})
                          </h4>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => addActivity(lesson.id)}
                          >
                            <Plus className="h-4 w-4 mr-1" />
                            {t('lessons.addActivity')}
                          </Button>
                        </div>
                        
                        <div className="space-y-2">
                          {lesson.activities.map((activity, activityIndex) => {
                            const ActivityIcon = activityTypes[activity.type]?.icon || Activity
                            
                            return (
                              <div
                                key={activity.id}
                                className="flex items-center gap-3 p-3 border rounded-lg bg-card hover:bg-accent/50 transition-colors"
                                draggable
                                onDragStart={(e) => handleDragStart(e, activity, 'activity')}
                                onDragOver={handleDragOver}
                                onDrop={(e) => handleDrop(e, activity.id, 'activity')}
                              >
                                <div className="flex items-center gap-2">
                                  <GripVertical className="h-3 w-3 text-muted-foreground cursor-move" />
                                  <Badge variant="outline" className="w-6 h-6 rounded-full p-0 flex items-center justify-center text-xs">
                                    {activityIndex + 1}
                                  </Badge>
                                </div>
                                
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="font-medium text-sm">{activity.title}</span>
                                    <Badge className={activityTypes[activity.type]?.color}>
                                      <ActivityIcon className="h-3 w-3 mr-1" />
                                      {t(`lessons.${activity.type}`)}
                                    </Badge>
                                  </div>
                                  <p className="text-xs text-muted-foreground">{activity.description}</p>
                                  {activity.resources && activity.resources.length > 0 && (
                                    <div className="flex items-center gap-1 mt-1">
                                      <FileText className="h-3 w-3 text-blue-500" />
                                      <span className="text-xs text-blue-600">
                                        {activity.resources.length} {t('lessons.resources')}
                                      </span>
                                    </div>
                                  )}
                                </div>
                                
                                <div className="flex items-center gap-2">
                                  <div className="text-xs text-muted-foreground flex items-center gap-1">
                                    <Timer className="h-3 w-3" />
                                    <span>{formatDuration(activity.duration_minutes)}</span>
                                  </div>
                                  
                                  <Button variant="ghost" size="sm">
                                    <Edit className="h-3 w-3" />
                                  </Button>
                                  <Button variant="ghost" size="sm">
                                    <Copy className="h-3 w-3" />
                                  </Button>
                                  <Button variant="ghost" size="sm">
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                            )
                          })}
                        </div>

                        {/* Activity Summary */}
                        <div className="bg-muted/30 p-3 rounded-lg">
                          <div className="flex items-center justify-between text-sm">
                            <span>{t('lessons.totalDuration')}: {formatDuration(estimateTotalDuration(lesson.activities))}</span>
                            <span>{t('lessons.estimatedTime')}: {formatDuration(lesson.duration_minutes)}</span>
                            <span className={estimateTotalDuration(lesson.activities) > lesson.duration_minutes ? 'text-red-600' : 'text-green-600'}>
                              {estimateTotalDuration(lesson.activities) > lesson.duration_minutes 
                                ? `+${formatDuration(estimateTotalDuration(lesson.activities) - lesson.duration_minutes)} over`
                                : `${formatDuration(lesson.duration_minutes - estimateTotalDuration(lesson.activities))} buffer`
                              }
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Differentiation */}
                      {lesson.differentiation && (
                        <div className="mt-4 space-y-2">
                          <h4 className="font-medium text-sm flex items-center gap-1">
                            <Users className="h-4 w-4 text-purple-500" />
                            {t('lessons.differentiation')}
                          </h4>
                          <div className="grid grid-cols-2 gap-3">
                            {lesson.differentiation.support && (
                              <div className="p-2 bg-blue-50 border border-blue-200 rounded text-sm">
                                <div className="font-medium text-blue-800 mb-1">{t('lessons.support')}:</div>
                                <div className="text-blue-700">{lesson.differentiation.support}</div>
                              </div>
                            )}
                            {lesson.differentiation.extension && (
                              <div className="p-2 bg-green-50 border border-green-200 rounded text-sm">
                                <div className="font-medium text-green-800 mb-1">{t('lessons.extension')}:</div>
                                <div className="text-green-700">{lesson.differentiation.extension}</div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  )}
                </Card>
              )
            })}
            
            {/* Add Lesson Button */}
            <Card className="border-2 border-dashed border-gray-200 hover:border-blue-300 transition-colors">
              <CardContent className="flex items-center justify-center p-8">
                <Button
                  variant="ghost"
                  onClick={() => addLesson(currentUnit.id)}
                  className="flex items-center gap-2"
                >
                  <Plus className="h-5 w-5" />
                  <span>{t('lessons.addLesson')}</span>
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 pt-4 border-t">
          <Button>
            <Save className="h-4 w-4 mr-1" />
            {t('lessons.saveSequence')}
          </Button>
          <Button variant="outline">
            <Share2 className="h-4 w-4 mr-1" />
            {t('lessons.shareUnit')}
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-1" />
            {t('lessons.exportPlan')}
          </Button>
          <Button variant="outline">
            <Shuffle className="h-4 w-4 mr-1" />
            {t('lessons.reorderLessons')}
          </Button>
          <Button variant="outline">
            <Copy className="h-4 w-4 mr-1" />
            {t('lessons.duplicateUnit')}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default LessonPlanningSequencing