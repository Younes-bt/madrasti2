import React from 'react'
import { useEditor } from './EditorContext'
import { Button } from '@/components/ui/button'
import { Save, Undo, Redo, Eye, Edit, Loader2 } from 'lucide-react'

const getTimeAgo = (date) => {
  const seconds = Math.floor((new Date() - date) / 1000)
  if (seconds < 60) return 'just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

export const EditorToolbar = () => {
  const {
    mode,
    setMode,
    save,
    undo,
    redo,
    isSaving,
    isDirty,
    lastSaved,
    historyIndex,
    historyLength
  } = useEditor()

  const canUndo = historyIndex > 0
  const canRedo = historyIndex < historyLength - 1

  return (
    <div className="sticky top-0 z-50 bg-white border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Left side - Save status */}
        <div className="flex items-center gap-4">
          <Button
            onClick={save}
            disabled={isSaving || !isDirty}
            className="gap-2"
          >
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save
              </>
            )}
          </Button>

          {lastSaved && !isDirty && (
            <span className="text-sm text-gray-500">
              Saved {getTimeAgo(lastSaved)}
            </span>
          )}

          {isDirty && !isSaving && (
            <span className="text-sm text-orange-600">
              Unsaved changes
            </span>
          )}
        </div>

        {/* Center - Undo/Redo */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={undo}
            disabled={!canUndo}
            title="Undo (Cmd+Z)"
          >
            <Undo className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={redo}
            disabled={!canRedo}
            title="Redo (Cmd+Shift+Z)"
          >
            <Redo className="h-4 w-4" />
          </Button>
        </div>

        {/* Right side - Preview toggle */}
        <div className="flex items-center gap-2">
          <Button
            variant={mode === 'edit' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setMode('edit')}
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>

          <Button
            variant={mode === 'preview' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setMode('preview')}
          >
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
        </div>
      </div>
    </div>
  )
}
