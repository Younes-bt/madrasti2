import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import lessonsService from '@/services/lessons'
import { BlockEditor } from '@/components/editor/BlockEditor'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Loader2, AlertTriangle } from 'lucide-react'
import toast from 'react-hot-toast'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

export const EditLessonContentPage = () => {
  const { lessonId, resourceId } = useParams()
  const navigate = useNavigate()
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  const [loading, setLoading] = useState(true)
  const [resource, setResource] = useState(null)
  const [lesson, setLesson] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadLessonAndResource()
  }, [lessonId, resourceId])

  // Warn before leaving page with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasUnsavedChanges) {
        e.preventDefault()
        e.returnValue = ''
        return ''
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [hasUnsavedChanges])

  const loadLessonAndResource = async () => {
    try {
      setLoading(true)
      setError(null)

      // Load lesson details
      const lessonData = await lessonsService.getLessonById(lessonId)
      setLesson(lessonData)

      // Find the resource in the lesson's resources
      const resourceData = lessonData.resources?.find(r => r.id === parseInt(resourceId))

      if (!resourceData) {
        throw new Error('Resource not found')
      }

      if (resourceData.resource_type !== 'blocks') {
        throw new Error('This resource is not a block-based resource')
      }

      setResource(resourceData)
    } catch (err) {
      console.error('Failed to load lesson/resource:', err)
      setError(err.message || 'Failed to load lesson content')
      toast.error('Failed to load lesson content')
    } finally {
      setLoading(false)
    }
  }

  const handleGoBack = () => {
    navigate(`/teacher/lessons/${lessonId}`)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
        <span className="ml-3 text-lg">Loading editor...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button onClick={handleGoBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    )
  }

  if (!resource) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">Resource not found</p>
      </div>
    )
  }

  const initialBlocks = resource.blocks_content?.blocks || []
  const initialVersion = resource.content_version || 1

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={handleGoBack} className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold">{lesson?.title}</h1>
              <p className="text-sm text-gray-600">{resource.title}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Block Editor */}
      <BlockEditor
        initialBlocks={initialBlocks}
        lessonId={parseInt(lessonId)}
        resourceId={parseInt(resourceId)}
        initialVersion={initialVersion}
      />
    </div>
  )
}
