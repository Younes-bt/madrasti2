import React, { useMemo } from 'react'
import { Eye, ArrowRight, AlertCircle } from 'lucide-react'
import { Alert, AlertDescription } from '../../ui/alert'
import { Button } from '../../ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card'
import { Badge } from '../../ui/badge'
import EnhancedMarkdown from '../../markdown/EnhancedMarkdown'
import BlockRenderer from '../../blocks/BlockRenderer'
import { cn } from '../../../lib/utils'

/**
 * Get localized lesson title
 */
const getLocalizedTitle = (lesson, language) => {
  switch (language) {
    case 'ar':
      return lesson.title_arabic || lesson.title
    case 'fr':
      return lesson.title_french || lesson.title
    default:
      return lesson.title
  }
}

/**
 * StudentPreviewWrapper Component
 *
 * Wraps the student view of a lesson for teacher preview.
 * Filters resources and exercises to show only what students see.
 *
 * @param {Object} props
 * @param {Object} props.lesson - Lesson object
 * @param {Array} [props.exercises] - Array of exercises
 * @param {string} props.language - Current language
 * @param {function} props.onExitPreview - Callback to exit preview mode
 * @param {string} [props.className] - Optional additional CSS classes
 */
export function StudentPreviewWrapper({
  lesson,
  exercises = [],
  language = 'ar',
  onExitPreview,
  className
}) {
  // Filter resources visible to students
  const visibleResources = useMemo(() => {
    if (!lesson?.resources) return []
    return lesson.resources.filter(r => r.is_visible_to_students !== false)
  }, [lesson])

  // Filter published exercises
  const publishedExercises = useMemo(() => {
    return exercises.filter(e => e.is_published)
  }, [exercises])

  // Group resources by type
  const markdownResources = visibleResources.filter(r =>
    r.resource_type?.toLowerCase() === 'markdown'
  )
  const blocksResources = visibleResources.filter(r =>
    r.resource_type?.toLowerCase() === 'blocks'
  )

  const lessonTitle = getLocalizedTitle(lesson, language)

  return (
    <div className={cn('min-h-screen bg-neutral-50', className)}>
      {/* Preview Mode Banner - Top */}
      <Alert className="rounded-none border-x-0 border-t-0 bg-blue-50 border-blue-200 sticky top-0 z-50">
        <Eye className="h-4 w-4" />
        <AlertDescription className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-medium">وضع المعاينة:</span>
            <span>أنت تشاهد ما يراه الطلاب</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onExitPreview}
            className="gap-2 shrink-0"
          >
            <ArrowRight className="h-4 w-4" />
            <span className="hidden sm:inline">العودة لعرض المعلم</span>
            <span className="sm:hidden">عودة</span>
          </Button>
        </AlertDescription>
      </Alert>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Lesson Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            {lessonTitle}
          </h1>
          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            {lesson.subject_name && (
              <Badge variant="outline">{lesson.subject_name}</Badge>
            )}
            {lesson.grade_name && (
              <Badge variant="outline">{lesson.grade_name}</Badge>
            )}
            {lesson.difficulty_display && (
              <Badge variant="outline">{lesson.difficulty_display}</Badge>
            )}
          </div>
        </div>

        {/* Description */}
        {lesson.description && (
          <Card className="mb-6">
            <CardContent className="pt-6">
              <p className="text-muted-foreground whitespace-pre-wrap">
                {lesson.description}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Learning Objectives */}
        {lesson.objectives && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">أهداف التعلم</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap">{lesson.objectives}</p>
            </CardContent>
          </Card>
        )}

        {/* Prerequisites */}
        {lesson.prerequisites && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">المتطلبات الأساسية</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap">{lesson.prerequisites}</p>
            </CardContent>
          </Card>
        )}

        {/* Markdown Resources */}
        {markdownResources.length > 0 && (
          <div className="mb-6 space-y-4">
            {markdownResources.map((resource) => (
              <Card key={resource.id}>
                <CardHeader>
                  <CardTitle className="text-lg">{resource.title}</CardTitle>
                  {resource.description && (
                    <p className="text-sm text-muted-foreground">
                      {resource.description}
                    </p>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="prose prose-sm max-w-none">
                    <EnhancedMarkdown
                      content={resource.markdown_content}
                      language={language}
                      showCopyButton={false}
                      collapsibleHeadings={true}
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Blocks Resources */}
        {blocksResources.length > 0 && (
          <div className="mb-6 space-y-4">
            {blocksResources.map((resource) => (
              <Card key={resource.id}>
                <CardHeader>
                  <CardTitle className="text-lg">{resource.title}</CardTitle>
                  {resource.description && (
                    <p className="text-sm text-muted-foreground">
                      {resource.description}
                    </p>
                  )}
                </CardHeader>
                <CardContent>
                  <BlockRenderer
                    blocksContent={resource.blocks_content}
                    language={language}
                  />
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* No Visible Resources Warning */}
        {visibleResources.length === 0 && (
          <Alert className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              لا توجد موارد مرئية للطلاب في هذا الدرس
            </AlertDescription>
          </Alert>
        )}

        {/* Published Exercises */}
        {publishedExercises.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">التمارين المتاحة</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {publishedExercises.map((exercise) => (
                  <div
                    key={exercise.id}
                    className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <h4 className="font-medium mb-2">{exercise.title}</h4>
                    {exercise.description && (
                      <p className="text-sm text-muted-foreground mb-3">
                        {exercise.description}
                      </p>
                    )}
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      {exercise.questions?.length > 0 && (
                        <span>{exercise.questions.length} أسئلة</span>
                      )}
                      {exercise.total_points && (
                        <span>{exercise.total_points} نقطة</span>
                      )}
                      {exercise.estimated_duration && (
                        <span>{exercise.estimated_duration} دقيقة</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* No Published Exercises Warning */}
        {publishedExercises.length === 0 && exercises.length > 0 && (
          <Alert className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              لا توجد تمارين منشورة للطلاب في هذا الدرس
            </AlertDescription>
          </Alert>
        )}

        {/* Exit Preview Button - Bottom */}
        <div className="sticky bottom-4 mt-8">
          <Button
            onClick={onExitPreview}
            className="w-full gap-2 shadow-lg"
            size="lg"
          >
            <ArrowRight className="h-5 w-5" />
            العودة لعرض المعلم
          </Button>
        </div>
      </div>
    </div>
  )
}

export default StudentPreviewWrapper
