import React from 'react'
import { EditorProvider, useEditor } from './EditorContext'
import { BlockList } from './BlockList'
import { EditorToolbar } from './EditorToolbar'
import BlockRenderer from '@/components/blocks/BlockRenderer'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { AlertTriangle } from 'lucide-react'

const BlockEditorContent = ({ onDirtyChange }) => {
  const {
    mode,
    blocks,
    language,
    isDirty,
    hasConflict,
    conflictData,
    resolveConflictKeepMine,
    resolveConflictKeepTheirs,
    dismissConflict
  } = useEditor()

  // Notify parent about dirty state changes
  React.useEffect(() => {
    if (onDirtyChange) {
      onDirtyChange(isDirty)
    }
  }, [isDirty, onDirtyChange])

  return (
    <div className="min-h-screen bg-gray-50">
      <EditorToolbar />

      <div className="max-w-4xl mx-auto px-4 py-8">
        {mode === 'edit' ? (
          <BlockList />
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-8">
            <BlockRenderer blocksContent={{ blocks }} language={language} />
          </div>
        )}
      </div>

      {/* Version Conflict Resolution Dialog */}
      <Dialog open={hasConflict} onOpenChange={(open) => !open && dismissConflict()}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              <DialogTitle>Content Conflict Detected</DialogTitle>
            </div>
            <DialogDescription>
              Someone else has modified this content while you were editing.
              You need to choose which version to keep.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {/* My Version */}
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-2 text-indigo-600">Your Version</h3>
                <div className="text-sm text-gray-600 mb-2">
                  {conflictData?.myBlocks?.length || 0} blocks
                </div>
                <div className="max-h-60 overflow-y-auto bg-gray-50 rounded p-2">
                  {conflictData?.myBlocks?.slice(0, 3).map((block, idx) => (
                    <div key={idx} className="text-xs mb-1 truncate">
                      {block.type}: {block.content?.text || block.content?.text_en || block.content?.formula || '(content)'}
                    </div>
                  ))}
                  {conflictData?.myBlocks?.length > 3 && (
                    <div className="text-xs text-gray-400 mt-1">
                      ...and {conflictData.myBlocks.length - 3} more blocks
                    </div>
                  )}
                </div>
              </div>

              {/* Their Version */}
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-2 text-green-600">Latest Version</h3>
                <div className="text-sm text-gray-600 mb-2">
                  {conflictData?.theirBlocks?.length || 0} blocks
                </div>
                <div className="max-h-60 overflow-y-auto bg-gray-50 rounded p-2">
                  {conflictData?.theirBlocks?.slice(0, 3).map((block, idx) => (
                    <div key={idx} className="text-xs mb-1 truncate">
                      {block.type}: {block.content?.text || block.content?.text_en || block.content?.formula || '(content)'}
                    </div>
                  ))}
                  {conflictData?.theirBlocks?.length > 3 && (
                    <div className="text-xs text-gray-400 mt-1">
                      ...and {conflictData.theirBlocks.length - 3} more blocks
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
              <p className="text-sm text-yellow-800">
                <strong>Warning:</strong> Choosing a version will overwrite the other.
                Make sure to save your work elsewhere if needed.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={dismissConflict}>
              Cancel
            </Button>
            <Button
              variant="default"
              onClick={resolveConflictKeepTheirs}
              className="bg-green-600 hover:bg-green-700"
            >
              Use Latest Version
            </Button>
            <Button
              variant="default"
              onClick={resolveConflictKeepMine}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              Keep My Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export const BlockEditor = ({ initialBlocks, lessonId, resourceId, initialVersion, onDirtyChange }) => {
  return (
    <EditorProvider
      initialBlocks={initialBlocks}
      lessonId={lessonId}
      resourceId={resourceId}
      initialVersion={initialVersion}
    >
      <BlockEditorContent onDirtyChange={onDirtyChange} />
    </EditorProvider>
  )
}
