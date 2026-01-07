import React, { useState, useEffect, useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import i18n from '../../lib/i18n'
import { TeacherPageLayout } from '../../components/teacher/layout'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import { Badge } from '../../components/ui/badge'
import { Dialog, DialogContent } from '../../components/ui/dialog'
import 'katex/dist/katex.min.css'
import {
  BookOpen,
  Users,
  Calendar,
  Target,
  Loader2,
  Tags,
  User,
  Globe,
  Eye,
  FileText,
  File,
  FileVideo,
  Brain,
  HelpCircle,
  Trophy,
  PlayCircle,
  Clock,
  Award,
  X,
  ExternalLink,
  Edit
} from 'lucide-react'
import lessonsService from '../../services/lessons'
import { exerciseService } from '../../services/exercises'
import { toast } from 'sonner'
import LessonAvailabilityDialog from '../../components/lessons/LessonAvailabilityDialog'

// Import new components
import StickyActionToolbar from '../../components/teacher/lessons/StickyActionToolbar'
import LessonOverviewStats from '../../components/teacher/lessons/LessonOverviewStats'

const getLocalizedLessonTitle = (lesson) => {
  const currentLanguage = i18n.language
  switch (currentLanguage) {
    case 'ar':
      return lesson.title_arabic || lesson.title
    case 'fr':
      return lesson.title_french || lesson.title
    default:
      return lesson.title
  }
}

const getResourceIcon = (type) => {
  switch (type) {
    case 'video':
      return FileVideo
    case 'pdf':
    case 'presentation':
      return FileText
    default:
      return File
  }
}

// ========================================
// STUDENT PREVIEW MODAL COMPONENT
// ========================================
const StudentPreviewModal = ({ open, onClose, lesson, exercises, language }) => {
  const { t } = useTranslation()
  const isRTL = language === 'ar'

  const learningObjectives = useMemo(() => {
    if (!lesson?.objectives) return []
    return lesson.objectives
      .split(/[\n•]/)
      .map(obj => obj.trim())
      .filter(obj => obj.length > 0)
  }, [lesson])

  const visibleResources = useMemo(() => {
    if (!lesson?.resources) return []
    return lesson.resources.filter((resource) => resource.is_visible_to_students !== false)
  }, [lesson])

  const videoResources = useMemo(() => {
    return visibleResources.filter(r => r.resource_type?.toLowerCase() === 'video')
  }, [visibleResources])

  const blocksResources = useMemo(() => {
    return visibleResources.filter(r => r.resource_type?.toLowerCase() === 'blocks')
  }, [visibleResources])

  const otherResources = useMemo(() => {
    return visibleResources.filter(r =>
      !['video', 'blocks'].includes(r.resource_type?.toLowerCase())
    )
  }, [visibleResources])

  // Simple block renderer for preview
  const renderBlock = (block) => {
    switch (block.type) {
      case 'heading': {
        const level = block.level || 2
        const headingClasses = {
          1: 'text-4xl font-bold text-indigo-900 mb-6',
          2: 'text-3xl font-bold text-indigo-800 mb-6 border-r-4 border-indigo-600 pr-4',
          3: 'text-2xl font-bold text-indigo-700 mb-4',
          4: 'text-xl font-semibold text-indigo-700 mb-3',
        }
        const className = headingClasses[level]
        const dir = isRTL ? 'rtl' : 'ltr'
        const content = block.content?.text || ''

        return React.createElement(
          `h${level}`,
          { key: block.id, className, dir },
          content
        )
      }

      case 'paragraph':
        return (
          <p
            key={block.id}
            className="text-lg text-gray-700 leading-relaxed mb-6"
            dir={isRTL ? 'rtl' : 'ltr'}
          >
            {block.content?.text || ''}
          </p>
        )

      case 'image': {
        const imageSrc = block.content?.data || block.content?.url
        if (!imageSrc) return null

        return (
          <div key={block.id} className="mb-6">
            <div className="rounded-xl overflow-hidden bg-gray-50 p-6">
              {imageSrc.startsWith('<svg') ? (
                <div
                  className="w-full max-w-2xl mx-auto"
                  dangerouslySetInnerHTML={{ __html: imageSrc }}
                />
              ) : (
                <img
                  src={imageSrc}
                  alt={block.content?.alt_text || ''}
                  className="w-full max-w-2xl mx-auto"
                />
              )}
            </div>
          </div>
        )
      }

      case 'table':
        if (!block.content?.html) return null
        return (
          <div key={block.id} className="mb-6 overflow-x-auto">
            <div
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: block.content.html }}
              dir={isRTL ? 'rtl' : 'ltr'}
            />
          </div>
        )

      default:
        return null
    }
  }

  if (!lesson) return null

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] p-0 overflow-hidden">
        {/* Modal Header */}
        <div className="sticky top-0 z-50 bg-white border-b shadow-sm px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Eye className="h-5 w-5 text-indigo-600" />
              <div>
                <h2 className="font-semibold text-lg">{t('lessons.studentPreview', 'معاينة الطالب')}</h2>
                <p className="text-sm text-muted-foreground">{getLocalizedLessonTitle(lesson)}</p>
              </div>
            </div>
            <Button onClick={onClose} variant="ghost" size="icon">
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-80px)] bg-gradient-to-br from-blue-50 to-indigo-50" dir={isRTL ? 'rtl' : 'ltr'}>
          <div className="max-w-5xl mx-auto px-6 py-8">
            {/* Header */}
            <header className="mb-8 text-center">
              <h1 className="text-3xl md:text-4xl font-bold text-indigo-900 mb-4">
                {getLocalizedLessonTitle(lesson)}
              </h1>
              <div className="w-24 h-1 bg-indigo-600 mx-auto rounded-full"></div>
              
              {/* Meta Information */}
              <div className="mt-6 flex flex-wrap justify-center gap-3 text-sm text-gray-600">
                {lesson?.estimated_duration && (
                  <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-full shadow-sm">
                    <Clock className="h-4 w-4 text-indigo-600" />
                    <span>{lesson.estimated_duration} {t('lessons.minutes', 'دقيقة')}</span>
                  </div>
                )}
                {lesson?.difficulty_display && (
                  <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-full shadow-sm">
                    <Award className="h-4 w-4 text-indigo-600" />
                    <span>{lesson.difficulty_display}</span>
                  </div>
                )}
                {lesson?.subject_name && (
                  <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-full shadow-sm">
                    <BookOpen className="h-4 w-4 text-indigo-600" />
                    <span>{lesson.subject_name}</span>
                  </div>
                )}
              </div>
            </header>

            {/* Learning Objectives */}
            {learningObjectives.length > 0 && (
              <section className="mb-8 bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-indigo-800 mb-4 flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  {t('lessons.learningObjectives', 'أهداف التعلم')}
                </h2>
                <ul className="space-y-2">
                  {learningObjectives.map((objective, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-indigo-500 mt-1">•</span>
                      <span className="text-gray-700">{objective}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Description */}
            {lesson?.description && (
              <section className="mb-8 bg-white rounded-2xl shadow-lg p-6">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {lesson.description}
                </p>
              </section>
            )}

            {/* Video Resources */}
            {videoResources.map((video) => (
              <section key={video.id} className="mb-8 bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-indigo-800 mb-4 flex items-center gap-2">
                  <FileVideo className="h-5 w-5" />
                  {video.title || t('lessons.videoContent', 'محتوى الفيديو')}
                </h2>
                <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
                  <video
                    src={video.file_url || video.external_url}
                    controls
                    className="w-full h-full"
                  />
                </div>
                {video.description && (
                  <p className="mt-3 text-gray-600 text-sm">{video.description}</p>
                )}
              </section>
            ))}

            {/* Blocks Content */}
            {blocksResources.map((resource) => (
              <section key={resource.id} className="mb-8 bg-white rounded-2xl shadow-lg p-6">
                {resource.title && (
                  <h2 className="text-xl font-bold text-indigo-800 mb-4 flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    {resource.title}
                  </h2>
                )}
                <div className="space-y-4">
                  {resource.blocks_content?.blocks?.map(block => renderBlock(block))}
                </div>
              </section>
            ))}

            {/* Other Resources */}
            {otherResources.length > 0 && (
              <section className="mb-8 bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-indigo-800 mb-4 flex items-center gap-2">
                  <File className="h-5 w-5" />
                  {t('lessons.additionalResources', 'موارد إضافية')}
                </h2>
                <div className="space-y-2">
                  {otherResources.map((resource) => {
                    const ResourceIcon = getResourceIcon(resource.resource_type)
                    return (
                      <div 
                        key={resource.id} 
                        className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <div className="p-2 bg-indigo-50 rounded-lg">
                            <ResourceIcon className="h-4 w-4 text-indigo-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-sm text-gray-900">
                              {resource.title || t('lessons.resource', 'مورد')}
                            </h3>
                            {resource.description && (
                              <p className="text-xs text-gray-600">{resource.description}</p>
                            )}
                          </div>
                        </div>
                        {(resource.file_url || resource.external_url) && (
                          <Button 
                            size="sm" 
                            onClick={() => window.open(resource.file_url || resource.external_url, '_blank')}
                            className="gap-2"
                          >
                            <ExternalLink className="h-4 w-4" />
                            {t('common.open', 'فتح')}
                          </Button>
                        )}
                      </div>
                    )
                  })}
                </div>
              </section>
            )}

            {/* Exercises */}
            {exercises.length > 0 && (
              <section className="bg-gradient-to-br from-indigo-900 to-purple-900 rounded-2xl shadow-lg p-6 text-white">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <Brain className="h-6 w-6" />
                  {t('lessons.practiceExercises', 'تمارين تطبيقية')}
                </h2>
                
                <div className="space-y-3">
                  {exercises.map((exercise) => (
                    <div 
                      key={exercise.id} 
                      className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20"
                    >
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                        <div className="flex-1">
                          <h3 className="text-lg font-bold mb-2">{exercise.title}</h3>
                          {exercise.description && (
                            <p className="text-white/80 text-sm mb-2">{exercise.description}</p>
                          )}
                          <div className="flex flex-wrap gap-3 text-sm text-white/70">
                            {exercise.questions_count && (
                              <span className="flex items-center gap-1">
                                <HelpCircle className="h-4 w-4" />
                                {exercise.questions_count} {t('lessons.questions', 'أسئلة')}
                              </span>
                            )}
                            {exercise.total_points && (
                              <span className="flex items-center gap-1">
                                <Trophy className="h-4 w-4" />
                                {exercise.total_points} {t('lessons.points', 'نقطة')}
                              </span>
                            )}
                          </div>
                        </div>
                        <Button
                          size="lg"
                          className="bg-white text-indigo-900 hover:bg-gray-100 gap-2"
                        >
                          <PlayCircle className="h-5 w-5" />
                          {t('lessons.start', 'ابدأ')}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// ========================================
// LESSON INFORMATION MODAL COMPONENT
// ========================================
const LessonInformationModal = ({ open, onClose, lesson, language }) => {
  const { t } = useTranslation()
  const isRTL = language === 'ar'

  const learningObjectives = useMemo(() => {
    if (!lesson?.objectives) return []
    return lesson.objectives
      .split(/[\n•]/)
      .map(obj => obj.trim())
      .filter(obj => obj.length > 0)
  }, [lesson])

  if (!lesson) return null

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="space-y-6">
          {/* Header */}
          <div className="border-b pb-4">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <FileText className="h-6 w-6 text-indigo-600" />
              {t('lessons.information', 'معلومات الدرس')}
            </h2>
          </div>

          {/* Learning Objectives */}
          {learningObjectives.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-900">
                <Target className="h-5 w-5 text-indigo-600" />
                {t('lessons.objectives', 'أهداف التعلم')}
              </h3>
              <ul className="space-y-2 bg-indigo-50 rounded-lg p-4" dir={isRTL ? 'rtl' : 'ltr'}>
                {learningObjectives.map((objective, index) => (
                  <li key={index} className="flex items-start gap-2 text-gray-700">
                    <span className="text-indigo-600 mt-1">•</span>
                    <span>{objective}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Prerequisites */}
          {lesson.prerequisites && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-900">
                <BookOpen className="h-5 w-5 text-indigo-600" />
                {t('lessons.prerequisites', 'المتطلبات الأساسية')}
              </h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700 whitespace-pre-wrap" dir={isRTL ? 'rtl' : 'ltr'}>
                  {lesson.prerequisites}
                </p>
              </div>
            </div>
          )}

          {/* Description */}
          {lesson.description && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-900">
                <FileText className="h-5 w-5 text-indigo-600" />
                {t('lessons.description', 'الوصف')}
              </h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700 whitespace-pre-wrap" dir={isRTL ? 'rtl' : 'ltr'}>
                  {lesson.description}
                </p>
              </div>
            </div>
          )}

          {/* Tags */}
          {lesson.tags && lesson.tags.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-900">
                <Tags className="h-5 w-5 text-indigo-600" />
                {t('lessons.tags', 'الوسوم')}
              </h3>
              <div className="flex flex-wrap gap-2">
                {lesson.tags.map((tag) => (
                  <Badge
                    key={tag.id}
                    variant="outline"
                    style={{ backgroundColor: `${tag.color}20`, borderColor: tag.color }}
                  >
                    {tag.name}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Metadata */}
          <div className="space-y-3 border-t pt-4">
            <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-900">
              <Calendar className="h-5 w-5 text-indigo-600" />
              {t('lessons.metadata', 'البيانات الوصفية')}
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-xs text-gray-500 mb-1">{t('lessons.created', 'تاريخ الإنشاء')}</div>
                <div className="font-medium text-gray-900">
                  {new Date(lesson.created_at).toLocaleDateString()}
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-xs text-gray-500 mb-1">{t('lessons.updated', 'تاريخ التحديث')}</div>
                <div className="font-medium text-gray-900">
                  {new Date(lesson.updated_at).toLocaleDateString()}
                </div>
              </div>
              {lesson.created_by_name && (
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-xs text-gray-500 mb-1">{t('lessons.createdBy', 'أنشئ بواسطة')}</div>
                  <div className="font-medium text-gray-900 flex items-center gap-1">
                    <User className="h-4 w-4" />
                    {lesson.created_by_name}
                  </div>
                </div>
              )}
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-xs text-gray-500 mb-1">{t('lessons.status', 'الحالة')}</div>
                <Badge variant={lesson.is_active ? "default" : "secondary"}>
                  {lesson.is_active ? (t('common.active', 'نشط') || 'Active') : (t('common.inactive', 'غير نشط') || 'Inactive')}
                </Badge>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-xs text-gray-500 mb-1">{t('lessons.cycle', 'الدورة')}</div>
                <Badge variant="outline">{lesson.cycle_display}</Badge>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <div className="text-xs text-gray-500 mb-1">{t('lessons.difficulty', 'المستوى')}</div>
                <Badge variant="outline">{lesson.difficulty_display}</Badge>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// ========================================
// RESOURCES MODAL COMPONENT
// ========================================
const ResourcesModal = ({ open, onClose, lesson, language }) => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const isRTL = language === 'ar'

  const resources = useMemo(() => {
    if (!lesson?.resources) return []
    return lesson.resources
  }, [lesson])

  const handleEditContent = (resource) => {
    navigate(`/teacher/content/lessons/${lesson.id}/resources/${resource.id}/edit`)
  }

  if (!lesson) return null

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="space-y-6">
          {/* Header */}
          <div className="border-b pb-4">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <FileText className="h-6 w-6 text-indigo-600" />
              {t('lessons.resources', 'الموارد')} ({resources.length})
            </h2>
          </div>

          {/* Resources List */}
          {resources.length > 0 ? (
            <div className="space-y-3">
              {resources.map((resource, index) => {
                const ResourceIcon = getResourceIcon(resource.resource_type)
                return (
                  <div
                    key={resource.id || index}
                    className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                    dir={isRTL ? 'rtl' : 'ltr'}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3 flex-1">
                        <div className="p-2 bg-indigo-50 rounded-lg">
                          <ResourceIcon className="h-5 w-5 text-indigo-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-1">
                            {resource.title || t('lessons.resource', 'مورد')}
                          </h3>
                          {resource.description && (
                            <p className="text-sm text-gray-600 mb-2">{resource.description}</p>
                          )}
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {resource.resource_type || 'file'}
                            </Badge>
                            {resource.is_visible_to_students !== false ? (
                              <Badge variant="default" className="text-xs bg-green-100 text-green-800">
                                <Eye className="h-3 w-3 mr-1" />
                                {t('lessons.visibleToStudents', 'مرئي للطلاب')}
                              </Badge>
                            ) : (
                              <Badge variant="secondary" className="text-xs">
                                {t('lessons.hiddenFromStudents', 'مخفي عن الطلاب')}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {resource.resource_type === 'blocks' && (
                          <Button
                            size="sm"
                            onClick={() => handleEditContent(resource)}
                            className="gap-2"
                            variant="default"
                          >
                            <Edit className="h-4 w-4" />
                            {t('common.edit', 'تعديل')} {t('lessons.content', 'المحتوى')}
                          </Button>
                        )}
                        {(resource.file_url || resource.external_url) && (
                          <Button
                            size="sm"
                            onClick={() => window.open(resource.file_url || resource.external_url, '_blank')}
                            className="gap-2"
                            variant="outline"
                          >
                            <ExternalLink className="h-4 w-4" />
                            {t('common.open', 'فتح')}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>{t('lessons.noResources', 'لا توجد موارد متاحة')}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

// ========================================
// EXERCISES MODAL COMPONENT
// ========================================
const ExercisesModal = ({ open, onClose, exercises, onAddExercise, onViewExercise, onEditExercise, language }) => {
  const { t } = useTranslation()
  const isRTL = language === 'ar'

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="space-y-6">
          {/* Header */}
          <div className="border-b pb-4 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Brain className="h-6 w-6 text-indigo-600" />
              {t('lessons.exercises', 'التمارين')} ({exercises.length})
            </h2>
            <Button onClick={onAddExercise} className="gap-2">
              <Brain className="h-4 w-4" />
              {t('lessons.addExercise', 'إضافة تمرين')}
            </Button>
          </div>

          {/* Exercises List */}
          {exercises.length > 0 ? (
            <div className="space-y-3">
              {exercises.map((exercise) => (
                <div
                  key={exercise.id}
                  className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                  dir={isRTL ? 'rtl' : 'ltr'}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-2">{exercise.title}</h3>
                      {exercise.description && (
                        <p className="text-sm text-gray-600 mb-3">{exercise.description}</p>
                      )}
                      <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                        {exercise.questions_count && (
                          <span className="flex items-center gap-1">
                            <HelpCircle className="h-4 w-4" />
                            {exercise.questions_count} {t('lessons.questions', 'أسئلة')}
                          </span>
                        )}
                        {exercise.total_points && (
                          <span className="flex items-center gap-1">
                            <Trophy className="h-4 w-4" />
                            {exercise.total_points} {t('lessons.points', 'نقطة')}
                          </span>
                        )}
                        {exercise.difficulty && (
                          <Badge variant="outline">{exercise.difficulty}</Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onViewExercise(exercise.id)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onEditExercise(exercise.id)}
                      >
                        {t('common.edit', 'تعديل')}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <Brain className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p className="mb-4">{t('lessons.noExercises', 'لا توجد تمارين متاحة')}</p>
              <Button onClick={onAddExercise} className="gap-2">
                <Brain className="h-4 w-4" />
                {t('lessons.addFirstExercise', 'إضافة أول تمرين')}
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

// ========================================
// MAIN VIEW LESSON PAGE COMPONENT
// ========================================
const ViewLessonPage = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { id } = useParams()

  const [loading, setLoading] = useState(true)
  const [lesson, setLesson] = useState(null)
  const [exercises, setExercises] = useState([])
  const [exercisesLoading, setExercisesLoading] = useState(false)
  const [availabilityDialogOpen, setAvailabilityDialogOpen] = useState(false)
  const [availability, setAvailability] = useState([])
  const [availabilityLoading, setAvailabilityLoading] = useState(false)
  const [availabilityError, setAvailabilityError] = useState(null)

  // Modal states
  const [previewModalOpen, setPreviewModalOpen] = useState(false)
  const [informationModalOpen, setInformationModalOpen] = useState(false)
  const [resourcesModalOpen, setResourcesModalOpen] = useState(false)
  const [exercisesModalOpen, setExercisesModalOpen] = useState(false)

  useEffect(() => {
    if (id) {
      loadLesson()
    }
  }, [id])

  useEffect(() => {
    if (lesson?.id) {
      loadExercises()
      loadAvailability()
    }
  }, [lesson?.id])

  const loadLesson = async () => {
    try {
      setLoading(true)
      const response = await lessonsService.getLessonById(id)
      setLesson(response)
    } catch (error) {
      console.error('Error loading lesson:', error)
      toast.error(t('error.loadingData') || 'Error loading lesson data')
      navigate('/teacher/content/lessons')
    } finally {
      setLoading(false)
    }
  }

  const loadAvailability = async () => {
    if (!id) return

    try {
      setAvailabilityLoading(true)
      setAvailabilityError(null)

      const response = await lessonsService.getLessonAvailability(id)
      const records = Array.isArray(response)
        ? response
        : response?.results || response?.data || []

      setAvailability(records)
    } catch (error) {
      console.error('Error loading lesson availability:', error)
      setAvailability([])
      setAvailabilityError(
        t('lessons.availability.loadError') || 'Failed to load class availability.'
      )
    } finally {
      setAvailabilityLoading(false)
    }
  }

  const loadExercises = async () => {
    try {
      setExercisesLoading(true)
      const response = await exerciseService.getExercisesByLesson(id)
      if (response.success) {
        setExercises(response.data || [])
      } else {
        console.error('Failed to load exercises:', response.error)
        setExercises([])
      }
    } catch (error) {
      console.error('Error loading exercises:', error)
      setExercises([])
    } finally {
      setExercisesLoading(false)
    }
  }

  const handleEdit = () => {
    navigate(`/teacher/content/lessons/edit/${id}`)
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: getLocalizedLessonTitle(lesson),
        url: window.location.href
      })
    } else {
      const url = window.location.href
      navigator.clipboard.writeText(url)
      toast.success('Link copied to clipboard')
    }
  }

  const handleDuplicate = async () => {
    try {
      await lessonsService.duplicateLesson(id)
      toast.success(t('lessons.duplicated') || 'Lesson duplicated successfully')
      navigate('/teacher/content/lessons')
    } catch (error) {
      console.error('Error duplicating lesson:', error)
      toast.error(t('error.duplicating') || 'Error duplicating lesson')
    }
  }

  const handleDelete = async () => {
    if (window.confirm(t('lessons.confirmDelete') || 'Are you sure you want to delete this lesson?')) {
      try {
        await lessonsService.deleteLesson(id)
        toast.success(t('lessons.deleted') || 'Lesson deleted successfully')
        navigate('/teacher/content/lessons')
      } catch (error) {
        console.error('Error deleting lesson:', error)
        toast.error(t('error.deleting') || 'Error deleting lesson')
      }
    }
  }

  const handleAddExercise = () => {
    navigate(`/teacher/content/exercises/create?lesson=${id}`)
  }

  const handleViewExercise = (exerciseId) => {
    navigate(`/teacher/content/exercises/${exerciseId}`)
  }

  const handleEditExercise = (exerciseId) => {
    navigate(`/teacher/content/exercises/edit/${exerciseId}`)
  }

  const handleManageAvailability = () => {
    setAvailabilityDialogOpen(true)
  }

  const handleAvailabilityUpdate = () => {
    loadAvailability()
  }

  const stats = useMemo(() => {
    if (!lesson) return null

    const resourcesCount = lesson.resources?.length || 0
    const exercisesCount = exercises.length
    const objectivesCount = lesson.objectives
      ? lesson.objectives.split(/[\n•]/).filter(o => o.trim()).length
      : 0

    const publishedClassesCount = availability.filter(a => a.is_published).length
    const totalClassesCount = availability.length

    return {
      resourcesCount,
      exercisesCount,
      objectivesCount,
      publishedClassesCount,
      totalClassesCount
    }
  }, [lesson, exercises, availability])

  if (loading) {
    return (
      <TeacherPageLayout
        title={t('lessons.viewLesson') || 'View Lesson'}
        subtitle={t('lessons.loading') || 'Loading lesson details...'}
        showBackButton={true}
        backButtonPath="/teacher/content/lessons"
      >
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">{t('lessons.loading') || 'Loading lesson details...'}</span>
        </div>
      </TeacherPageLayout>
    )
  }

  if (!lesson) {
    return (
      <TeacherPageLayout
        title={t('lessons.viewLesson') || 'View Lesson'}
        subtitle={t('lessons.notFound') || 'Lesson not found'}
        showBackButton={true}
        backButtonPath="/teacher/content/lessons"
      >
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">{t('lessons.notFound') || 'Lesson Not Found'}</h3>
              <p className="text-muted-foreground">
                {t('lessons.notFoundDescription') || 'The lesson you\'re looking for doesn\'t exist.'}
              </p>
            </div>
          </CardContent>
        </Card>
      </TeacherPageLayout>
    )
  }

  return (
    <TeacherPageLayout
      title={getLocalizedLessonTitle(lesson)}
      subtitle={`${lesson.subject_name} • ${lesson.grade_name}${lesson.track_name ? ` • ${lesson.track_name}` : ''}`}
      showBackButton={true}
      backButtonPath="/teacher/content/lessons"
    >
      <StickyActionToolbar
        onEdit={handleEdit}
        onAddExercise={handleAddExercise}
        onManageAvailability={handleManageAvailability}
        onPreview={() => setPreviewModalOpen(true)}
        onShare={handleShare}
        onDuplicate={handleDuplicate}
        onDelete={handleDelete}
      />

      <div className="space-y-8 mt-6">
        {/* Overview Stats Header */}
        {stats && (
          <LessonOverviewStats
            lesson={lesson}
            resourcesCount={stats.resourcesCount}
            exercisesCount={stats.exercisesCount}
            objectivesCount={stats.objectivesCount}
            publishedClassesCount={stats.publishedClassesCount}
            totalClassesCount={stats.totalClassesCount}
          />
        )}

        {/* Action Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {/* Student Preview Card */}
          <Card
            className="cursor-pointer hover:shadow-lg transition-all hover:scale-105 border-2 border-indigo-100"
            onClick={() => setPreviewModalOpen(true)}
          >
            <CardContent className="pt-6 text-center">
              <div className="flex flex-col items-center gap-4">
                <div className="p-4 bg-indigo-100 rounded-full">
                  <Eye className="h-8 w-8 text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">
                    {t('lessons.viewLesson', 'معاينة الدرس')}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {t('lessons.previewDesc', 'كما يراه الطلاب')}
                  </p>
                </div>
                <Badge variant="outline" className="mt-2">
                  {stats?.resourcesCount || 0} {t('lessons.resources', 'موارد')}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Lesson Information Card */}
          <Card
            className="cursor-pointer hover:shadow-lg transition-all hover:scale-105 border-2 border-blue-100"
            onClick={() => setInformationModalOpen(true)}
          >
            <CardContent className="pt-6 text-center">
              <div className="flex flex-col items-center gap-4">
                <div className="p-4 bg-blue-100 rounded-full">
                  <FileText className="h-8 w-8 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">
                    {t('lessons.information', 'معلومات الدرس')}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {t('lessons.infoDesc', 'الأهداف والتفاصيل')}
                  </p>
                </div>
                <Badge variant="outline" className="mt-2">
                  {stats?.objectivesCount || 0} {t('lessons.objectives', 'أهداف')}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Resources Card */}
          <Card
            className="cursor-pointer hover:shadow-lg transition-all hover:scale-105 border-2 border-green-100"
            onClick={() => setResourcesModalOpen(true)}
          >
            <CardContent className="pt-6 text-center">
              <div className="flex flex-col items-center gap-4">
                <div className="p-4 bg-green-100 rounded-full">
                  <FileVideo className="h-8 w-8 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">
                    {t('lessons.resources', 'الموارد')}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {t('lessons.resourcesDesc', 'الملفات والمحتوى')}
                  </p>
                </div>
                <Badge variant="outline" className="mt-2">
                  {stats?.resourcesCount || 0} {t('lessons.items', 'عنصر')}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Exercises Card */}
          <Card
            className="cursor-pointer hover:shadow-lg transition-all hover:scale-105 border-2 border-purple-100"
            onClick={() => setExercisesModalOpen(true)}
          >
            <CardContent className="pt-6 text-center">
              <div className="flex flex-col items-center gap-4">
                <div className="p-4 bg-purple-100 rounded-full">
                  <Brain className="h-8 w-8 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">
                    {t('lessons.exercises', 'التمارين')}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {t('lessons.exercisesDesc', 'الأسئلة والاختبارات')}
                  </p>
                </div>
                <Badge variant="outline" className="mt-2">
                  {stats?.exercisesCount || 0} {t('lessons.items', 'عنصر')}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Class Availability Card */}
          <Card
            className="cursor-pointer hover:shadow-lg transition-all hover:scale-105 border-2 border-amber-100"
            onClick={handleManageAvailability}
          >
            <CardContent className="pt-6 text-center">
              <div className="flex flex-col items-center gap-4">
                <div className="p-4 bg-amber-100 rounded-full">
                  <Users className="h-8 w-8 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">
                    {t('lessons.availability.title', 'إتاحة الصفوف')}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {t('lessons.availabilityDesc', 'إدارة النشر للصفوف')}
                  </p>
                </div>
                {availabilityLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin mt-2" />
                ) : (
                  <Badge variant="outline" className="mt-2">
                    {stats?.publishedClassesCount || 0} / {stats?.totalClassesCount || 0} {t('lessons.published', 'منشور')}
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modals */}
      <StudentPreviewModal
        open={previewModalOpen}
        onClose={() => setPreviewModalOpen(false)}
        lesson={lesson}
        exercises={exercises}
        language={i18n.language}
      />

      <LessonInformationModal
        open={informationModalOpen}
        onClose={() => setInformationModalOpen(false)}
        lesson={lesson}
        language={i18n.language}
      />

      <ResourcesModal
        open={resourcesModalOpen}
        onClose={() => setResourcesModalOpen(false)}
        lesson={lesson}
        language={i18n.language}
      />

      <ExercisesModal
        open={exercisesModalOpen}
        onClose={() => setExercisesModalOpen(false)}
        exercises={exercises}
        onAddExercise={handleAddExercise}
        onViewExercise={handleViewExercise}
        onEditExercise={handleEditExercise}
        language={i18n.language}
      />

      <LessonAvailabilityDialog
        lessonId={id}
        lessonTitle={getLocalizedLessonTitle(lesson)}
        open={availabilityDialogOpen}
        onOpenChange={setAvailabilityDialogOpen}
        onUpdate={handleAvailabilityUpdate}
      />
    </TeacherPageLayout>
  )
}

export default ViewLessonPage