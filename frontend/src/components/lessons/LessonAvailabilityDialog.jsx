import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog'
import { Button } from '../ui/button'
import { Switch } from '../ui/switch'
import { Badge } from '../ui/badge'
import { Loader2, CheckCircle, XCircle, Users, School, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'
import lessonsService from '../../services/lessons'
import attendanceService from '../../services/attendance'
import { cn } from '../../lib/utils'

/**
 * LessonAvailabilityDialog Component
 * Allows teachers/admins to publish or unpublish lessons for specific classes
 */
const LessonAvailabilityDialog = ({ lessonId, lessonTitle, open, onOpenChange, onUpdate }) => {
  const { t } = useTranslation()

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [availabilities, setAvailabilities] = useState([])
  const [classes, setClasses] = useState([])
  const [changes, setChanges] = useState({}) // Track local changes

  // Load availability data when dialog opens
  useEffect(() => {
    if (open && lessonId) {
      loadData()
    }
  }, [open, lessonId])

  const loadData = async () => {
    try {
      setLoading(true)

      // Load both availability data and teacher's classes in parallel
      const [availabilityData, teacherClassesData] = await Promise.all([
        lessonsService.getLessonAvailability(lessonId),
        attendanceService.getTeacherClasses()
      ])

      console.log('Availability data:', availabilityData)
      console.log('Teacher classes data:', teacherClassesData)

      setAvailabilities(availabilityData || [])

      // Extract classes from the response
      // Backend returns { classes: [...] } or { results: [...] }
      const classesArray = teacherClassesData.classes || teacherClassesData.results || teacherClassesData.data || teacherClassesData || []

      // Format classes for the dialog
      const formattedClasses = classesArray.map(cls => ({
        id: cls.id,
        name: cls.name || 'Unknown Class',
        grade_name: cls.grade?.name || '',
        track_name: cls.track?.name || ''
      }))

      console.log('Formatted classes:', formattedClasses)
      console.log('Availabilities:', availabilityData)

      setClasses(formattedClasses)
      setChanges({}) // Reset changes
    } catch (error) {
      console.error('Error loading availability data:', error)
      toast.error(t('lessons.availability.loadError') || 'Failed to load availability data')
    } finally {
      setLoading(false)
    }
  }

  // Get current published state (considering local changes)
  const getPublishedState = (classId) => {
    // Check if there's a local change
    if (changes[classId] !== undefined) {
      return changes[classId]
    }

    // Otherwise check the server data
    const availability = availabilities.find(a => a.school_class === classId)
    const isPublished = availability?.is_published || false

    console.log(`getPublishedState for class ${classId}:`, {
      availability,
      isPublished,
      allAvailabilities: availabilities
    })

    return isPublished
  }

  // Toggle publish state for a class
  const handleToggle = (classId) => {
    const currentState = getPublishedState(classId)
    setChanges(prev => ({
      ...prev,
      [classId]: !currentState
    }))
  }

  // Check if there are unsaved changes
  const hasChanges = () => {
    return Object.keys(changes).length > 0
  }

  // Get count of changes
  const getChangesSummary = () => {
    const toPublish = Object.entries(changes).filter(([_, value]) => value === true).length
    const toUnpublish = Object.entries(changes).filter(([_, value]) => value === false).length
    return { toPublish, toUnpublish }
  }

  // Save all changes
  const handleSave = async () => {
    if (!hasChanges()) {
      onOpenChange(false)
      return
    }

    try {
      setSaving(true)

      // Group changes by publish/unpublish
      const toPublish = Object.entries(changes)
        .filter(([_, value]) => value === true)
        .map(([classId]) => parseInt(classId))

      const toUnpublish = Object.entries(changes)
        .filter(([_, value]) => value === false)
        .map(([classId]) => parseInt(classId))

      console.log('Saving changes:', { toPublish, toUnpublish, changes })

      // Execute bulk operations
      const promises = []

      if (toPublish.length > 0) {
        console.log('Publishing to classes:', toPublish)
        promises.push(lessonsService.bulkPublishLesson(lessonId, toPublish, true))
      }

      if (toUnpublish.length > 0) {
        console.log('Unpublishing from classes:', toUnpublish)
        promises.push(lessonsService.bulkPublishLesson(lessonId, toUnpublish, false))
      }

      const results = await Promise.all(promises)
      console.log('Save results:', results)

      const { toPublish: publishCount, toUnpublish: unpublishCount } = getChangesSummary()

      toast.success(
        t('lessons.availability.saveSuccess', {
          published: publishCount,
          unpublished: unpublishCount
        }) || `Successfully updated: ${publishCount} published, ${unpublishCount} unpublished`
      )

      // Wait a bit before reloading to ensure backend has processed
      await new Promise(resolve => setTimeout(resolve, 500))

      // Refresh data and notify parent
      await loadData()
      onUpdate?.()

      // Don't close the dialog immediately so user can see the updated state
      // onOpenChange(false)
    } catch (error) {
      console.error('Error saving availability:', error)
      toast.error(t('lessons.availability.saveError') || 'Failed to save changes')
    } finally {
      setSaving(false)
    }
  }

  // Bulk actions
  const handlePublishAll = () => {
    const newChanges = {}
    classes.forEach(cls => {
      if (!getPublishedState(cls.id)) {
        newChanges[cls.id] = true
      }
    })
    setChanges(prev => ({ ...prev, ...newChanges }))
  }

  const handleUnpublishAll = () => {
    const newChanges = {}
    classes.forEach(cls => {
      if (getPublishedState(cls.id)) {
        newChanges[cls.id] = false
      }
    })
    setChanges(prev => ({ ...prev, ...newChanges }))
  }

  // Get statistics
  const getStats = () => {
    const published = classes.filter(cls => getPublishedState(cls.id)).length
    const total = classes.length
    return { published, unpublished: total - published, total }
  }

  const stats = getStats()
  const changesSummary = getChangesSummary()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-hidden flex flex-col gap-0">
        <DialogHeader className="pb-4 border-b">
          <DialogTitle className="flex items-center gap-2 text-xl">
            <div className="p-2 rounded-lg bg-primary/10">
              <Users className="h-5 w-5 text-primary" />
            </div>
            {t('lessons.availability.title') || 'Manage Lesson Availability'}
          </DialogTitle>
          <DialogDescription className="text-base pt-1">
            {t('lessons.availability.description') || 'Control which classes can access this lesson'}
            {lessonTitle && (
              <span className="block mt-2 text-sm font-semibold text-foreground bg-muted px-3 py-1.5 rounded-md">
                {lessonTitle}
              </span>
            )}
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-3 text-muted-foreground">{t('common.loading') || 'Loading...'}</span>
          </div>
        ) : (
          <>
            {/* Statistics */}
            <div className="grid grid-cols-3 gap-4 py-4">
              <div className="text-center p-4 rounded-lg bg-green-500/10 dark:bg-green-500/20 border border-green-500/20">
                <div className="text-3xl font-bold text-green-600 dark:text-green-400">{stats.published}</div>
                <div className="text-sm text-muted-foreground mt-1">
                  {t('lessons.availability.published') || 'Published'}
                </div>
              </div>
              <div className="text-center p-4 rounded-lg bg-muted/50 dark:bg-muted/20 border border-border">
                <div className="text-3xl font-bold text-muted-foreground">{stats.unpublished}</div>
                <div className="text-sm text-muted-foreground mt-1">
                  {t('lessons.availability.unpublished') || 'Unpublished'}
                </div>
              </div>
              <div className="text-center p-4 rounded-lg bg-primary/10 dark:bg-primary/20 border border-primary/20">
                <div className="text-3xl font-bold text-primary">{stats.total}</div>
                <div className="text-sm text-muted-foreground mt-1">
                  {t('lessons.availability.total') || 'Total Classes'}
                </div>
              </div>
            </div>

            {/* Bulk Actions */}
            <div className="flex items-center gap-2 pb-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePublishAll}
                disabled={saving}
                className="flex-1"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                {t('lessons.availability.publishAll') || 'Publish All'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleUnpublishAll}
                disabled={saving}
                className="flex-1"
              >
                <XCircle className="h-4 w-4 mr-2" />
                {t('lessons.availability.unpublishAll') || 'Unpublish All'}
              </Button>
            </div>

            {/* Changes Summary */}
            {hasChanges() && (
              <div className="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 rounded-lg mb-3">
                <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-500 mt-0.5 flex-shrink-0" />
                <div className="text-sm flex-1">
                  <span className="font-semibold text-amber-900 dark:text-amber-200 block mb-1">
                    {t('lessons.availability.unsavedChanges') || 'Unsaved Changes:'}
                  </span>
                  <div className="flex gap-4 text-amber-700 dark:text-amber-300">
                    {changesSummary.toPublish > 0 && (
                      <span className="flex items-center gap-1">
                        <CheckCircle className="h-3.5 w-3.5" />
                        +{changesSummary.toPublish} {t('lessons.availability.toPublish') || 'to publish'}
                      </span>
                    )}
                    {changesSummary.toUnpublish > 0 && (
                      <span className="flex items-center gap-1">
                        <XCircle className="h-3.5 w-3.5" />
                        -{changesSummary.toUnpublish} {t('lessons.availability.toUnpublish') || 'to unpublish'}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Classes List */}
            <div className="flex-1 overflow-y-auto space-y-2 py-2 min-h-[200px] max-h-[400px]">
              {classes.length === 0 ? (
                <div className="text-center py-12">
                  <div className="inline-flex p-4 rounded-full bg-muted/50 mb-4">
                    <School className="h-12 w-12 text-muted-foreground opacity-50" />
                  </div>
                  <p className="text-muted-foreground font-medium">
                    {t('lessons.availability.noClasses') || 'No classes found'}
                  </p>
                </div>
              ) : (
                classes.map((cls) => {
                  const isPublished = getPublishedState(cls.id)
                  const hasChange = changes[cls.id] !== undefined

                  return (
                    <div
                      key={cls.id}
                      className={cn(
                        "flex items-center justify-between p-4 border rounded-lg transition-all duration-200",
                        hasChange && "bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900/50 shadow-sm",
                        !hasChange && "hover:bg-muted/50 dark:hover:bg-muted/20 hover:shadow-sm",
                        "group"
                      )}
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div className={cn(
                          "p-2 rounded-md transition-colors",
                          isPublished
                            ? "bg-green-100 dark:bg-green-950/50 text-green-600 dark:text-green-400"
                            : "bg-muted text-muted-foreground"
                        )}>
                          <School className="h-4 w-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-foreground truncate">{cls.name}</div>
                          {cls.grade_name && (
                            <div className="text-xs text-muted-foreground flex items-center gap-1">
                              <span>{cls.grade_name}</span>
                              {cls.track_name && (
                                <>
                                  <span>•</span>
                                  <span>{cls.track_name}</span>
                                </>
                              )}
                            </div>
                          )}
                        </div>
                        {hasChange && (
                          <Badge variant="secondary" className="text-xs font-medium bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                            {t('common.modified') || 'Modified'}
                          </Badge>
                        )}
                      </div>

                      <div className="flex items-center gap-3 ml-4">
                        <Switch
                          checked={isPublished}
                          onCheckedChange={() => handleToggle(cls.id)}
                          disabled={saving}
                          className="data-[state=checked]:bg-green-600"
                        />
                        {isPublished ? (
                          <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                        ) : (
                          <XCircle className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                        )}
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </>
        )}

        <DialogFooter className="pt-4 border-t mt-4">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={saving}
            className="min-w-[100px]"
          >
            {t('common.cancel') || 'Cancel'}
          </Button>
          <Button
            onClick={handleSave}
            disabled={loading || saving || !hasChanges()}
            className="min-w-[140px] bg-primary hover:bg-primary/90"
          >
            {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            {!saving && hasChanges() && <CheckCircle className="h-4 w-4 mr-2" />}
            {t('common.save') || 'Save Changes'}
            {hasChanges() && !saving && (
              <span className="ml-1.5 px-1.5 py-0.5 rounded bg-primary-foreground/20 text-xs font-semibold">
                {Object.keys(changes).length}
              </span>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default LessonAvailabilityDialog
