import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react'
import toast from 'react-hot-toast'
import lessonsService from '@/services/lessons'

const EditorContext = createContext()

const MAX_HISTORY = 50

// Simple UUID generator
const generateId = () => {
  return 'block_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
}

export const EditorProvider = ({ children, initialBlocks = [], lessonId, resourceId, initialVersion = 1 }) => {
  // Content state
  const [blocks, setBlocks] = useState(initialBlocks)
  const [selectedBlockId, setSelectedBlockId] = useState(null)

  // History for undo/redo
  const [history, setHistory] = useState([initialBlocks])
  const [historyIndex, setHistoryIndex] = useState(0)

  // Editor mode
  const [mode, setMode] = useState('edit') // 'edit' | 'preview'
  const [language, setLanguage] = useState('en')

  // Dirty state
  const [isDirty, setIsDirty] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState(null)

  // Version control
  const [contentVersion, setContentVersion] = useState(initialVersion)

  // Conflict resolution
  const [hasConflict, setHasConflict] = useState(false)
  const [conflictData, setConflictData] = useState(null)

  // Track if we should record history (prevent recording during undo/redo)
  const isUndoRedoAction = useRef(false)
  const autoSaveTimerRef = useRef(null)

  // Add to history when blocks change
  useEffect(() => {
    if (!isUndoRedoAction.current && blocks.length > 0) {
      addToHistory(blocks)
      setIsDirty(true)
    }
    isUndoRedoAction.current = false
  }, [blocks])

  // Auto-save with debouncing
  useEffect(() => {
    if (isDirty && lessonId && resourceId) {
      // Clear existing timer
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current)
      }

      // Set new timer for auto-save (2 seconds after last change)
      autoSaveTimerRef.current = setTimeout(() => {
        save()
      }, 2000)
    }

    // Cleanup on unmount
    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current)
      }
    }
  }, [isDirty, blocks])

  // LocalStorage backup (every change)
  useEffect(() => {
    if (lessonId && resourceId && blocks.length > 0) {
      const backupKey = `lesson_${lessonId}_resource_${resourceId}_backup`
      localStorage.setItem(backupKey, JSON.stringify({
        blocks,
        timestamp: new Date().toISOString()
      }))
    }
  }, [blocks, lessonId, resourceId])

  // Clear localStorage backup when saved successfully
  useEffect(() => {
    if (!isDirty && lessonId && resourceId) {
      const backupKey = `lesson_${lessonId}_resource_${resourceId}_backup`
      localStorage.removeItem(backupKey)
    }
  }, [isDirty, lessonId, resourceId])

  const addToHistory = useCallback((newState) => {
    setHistory(prev => {
      const newHistory = prev.slice(0, historyIndex + 1)
      newHistory.push(JSON.parse(JSON.stringify(newState))) // Deep clone

      if (newHistory.length > MAX_HISTORY) {
        newHistory.shift()
        return newHistory
      }

      return newHistory
    })
    setHistoryIndex(prev => Math.min(prev + 1, MAX_HISTORY - 1))
  }, [historyIndex])

  // Add block
  const addBlock = useCallback((type, position = null, initialContent = {}) => {
    const newBlock = {
      id: generateId(),
      type,
      content: initialContent,
      properties: {}
    }

    // Add level for headings
    if (type === 'heading') {
      newBlock.level = 2
    }

    // Add listType for lists
    if (type === 'list') {
      newBlock.listType = 'bulleted'
      newBlock.content = { items: [{ text: '', text_ar: '', text_en: '', text_fr: '' }] }
    }

    setBlocks(prev => {
      if (position === null || position >= prev.length) {
        return [...prev, newBlock]
      }
      const updated = [...prev]
      updated.splice(position + 1, 0, newBlock)
      return updated
    })

    setSelectedBlockId(newBlock.id)
    return newBlock.id
  }, [])

  // Update block
  const updateBlock = useCallback((id, data) => {
    setBlocks(prev => prev.map(block => {
      if (block.id === id) {
        return {
          ...block,
          ...data,
          content: data.content ? { ...block.content, ...data.content } : block.content,
          properties: data.properties ? { ...block.properties, ...data.properties } : block.properties
        }
      }
      return block
    }))
  }, [])

  // Delete block
  const deleteBlock = useCallback((id) => {
    setBlocks(prev => {
      const filtered = prev.filter(block => block.id !== id)
      // If we deleted the last block, add an empty paragraph
      if (filtered.length === 0) {
        return [{
          id: generateId(),
          type: 'paragraph',
          content: { text: '', text_ar: '', text_en: '', text_fr: '' },
          properties: {}
        }]
      }
      return filtered
    })

    if (selectedBlockId === id) {
      setSelectedBlockId(null)
    }
  }, [selectedBlockId])

  // Reorder blocks (for drag-and-drop)
  const reorderBlocks = useCallback((oldIndex, newIndex) => {
    setBlocks(prev => {
      const updated = [...prev]
      const [movedBlock] = updated.splice(oldIndex, 1)
      updated.splice(newIndex, 0, movedBlock)
      return updated
    })
  }, [])

  // Duplicate block
  const duplicateBlock = useCallback((id) => {
    setBlocks(prev => {
      const index = prev.findIndex(block => block.id === id)
      if (index === -1) return prev

      const blockToDuplicate = prev[index]
      const duplicated = {
        ...JSON.parse(JSON.stringify(blockToDuplicate)),
        id: generateId()
      }

      const updated = [...prev]
      updated.splice(index + 1, 0, duplicated)
      return updated
    })
  }, [])

  // Undo
  const undo = useCallback(() => {
    if (historyIndex > 0) {
      isUndoRedoAction.current = true
      const newIndex = historyIndex - 1
      setHistoryIndex(newIndex)
      setBlocks(JSON.parse(JSON.stringify(history[newIndex])))
      setIsDirty(true)
    }
  }, [historyIndex, history])

  // Redo
  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      isUndoRedoAction.current = true
      const newIndex = historyIndex + 1
      setHistoryIndex(newIndex)
      setBlocks(JSON.parse(JSON.stringify(history[newIndex])))
      setIsDirty(true)
    }
  }, [historyIndex, history])

  // Save
  const save = useCallback(async (forceSave = false) => {
    if (!lessonId || !resourceId) {
      toast.error('Missing lesson or resource ID')
      return false
    }

    setIsSaving(true)
    try {
      const response = await lessonsService.patchLessonResource(
        lessonId,
        resourceId,
        {
          blocks_content: { blocks },
          content_version: forceSave ? null : contentVersion // null bypasses version check
        }
      )

      setContentVersion(response.content_version || contentVersion + 1)
      setLastSaved(new Date())
      setIsDirty(false)
      setHasConflict(false)
      setConflictData(null)
      toast.success('Saved successfully')
      return true
    } catch (error) {
      console.error('Save failed:', error)

      if (error.response?.status === 409) {
        // Fetch the latest version to show in conflict dialog
        try {
          const latestResource = await lessonsService.getLessonResourceById(lessonId, resourceId)
          setConflictData({
            theirBlocks: latestResource.blocks_content?.blocks || [],
            theirVersion: latestResource.content_version,
            myBlocks: blocks,
            myVersion: contentVersion
          })
          setHasConflict(true)
          toast.error('Content conflict detected. Please resolve.')
        } catch (fetchError) {
          console.error('Failed to fetch latest version:', fetchError)
          toast.error('Someone else has updated this content. Please refresh the page.')
        }
      } else {
        toast.error('Failed to save changes')
      }
      return false
    } finally {
      setIsSaving(false)
    }
  }, [blocks, lessonId, resourceId, contentVersion])

  // Conflict resolution handlers
  const resolveConflictKeepMine = useCallback(async () => {
    setHasConflict(false)
    setConflictData(null)
    // Force save bypassing version check
    return await save(true)
  }, [save])

  const resolveConflictKeepTheirs = useCallback(() => {
    if (!conflictData) return

    // Replace current blocks with their version
    setBlocks(conflictData.theirBlocks)
    setContentVersion(conflictData.theirVersion)
    setIsDirty(false)
    setHasConflict(false)
    setConflictData(null)

    // Clear history and restart with their version
    setHistory([conflictData.theirBlocks])
    setHistoryIndex(0)

    toast.success('Loaded latest version')
  }, [conflictData])

  const dismissConflict = useCallback(() => {
    setHasConflict(false)
    setConflictData(null)
  }, [])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Cmd/Ctrl + Z for undo
      if ((e.metaKey || e.ctrlKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault()
        undo()
      }

      // Cmd/Ctrl + Shift + Z for redo
      if ((e.metaKey || e.ctrlKey) && e.key === 'z' && e.shiftKey) {
        e.preventDefault()
        redo()
      }

      // Cmd/Ctrl + S for save
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault()
        save()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [undo, redo, save])

  const value = {
    // State
    blocks,
    selectedBlockId,
    mode,
    language,
    isDirty,
    isSaving,
    lastSaved,
    contentVersion,
    historyIndex,
    historyLength: history.length,
    hasConflict,
    conflictData,

    // Actions
    addBlock,
    updateBlock,
    deleteBlock,
    reorderBlocks,
    duplicateBlock,
    undo,
    redo,
    save,
    setSelectedBlockId,
    setMode,
    setLanguage,
    setBlocks,
    resolveConflictKeepMine,
    resolveConflictKeepTheirs,
    dismissConflict
  }

  return (
    <EditorContext.Provider value={value}>
      {children}
    </EditorContext.Provider>
  )
}

export const useEditor = () => {
  const context = useContext(EditorContext)
  if (!context) {
    throw new Error('useEditor must be used within EditorProvider')
  }
  return context
}
