import { createContext, useContext, useReducer, useEffect } from 'react'

const LessonContext = createContext()

const initialState = {
  lessonId: null,
  progress: {
    overall: 0,
    sections: {},
    videoWatched: false,
    practiceCompleted: [],
    resourcesViewed: []
  },
  bookmarked: false,
  startTime: null,
  completedSections: new Set()
}

function lessonReducer(state, action) {
  switch (action.type) {
    case 'INIT_LESSON':
      return {
        ...state,
        lessonId: action.payload.lessonId,
        startTime: Date.now(),
        progress: action.payload.savedProgress || state.progress,
        bookmarked: action.payload.bookmarked || false
      }

    case 'UPDATE_SECTION_PROGRESS':
      const newSections = {
        ...state.progress.sections,
        [action.payload.sectionId]: action.payload.progress
      }

      // Calculate overall progress
      const sectionValues = Object.values(newSections)
      const overallProgress = sectionValues.length > 0
        ? Math.round(sectionValues.reduce((a, b) => a + b, 0) / sectionValues.length)
        : 0

      return {
        ...state,
        progress: {
          ...state.progress,
          sections: newSections,
          overall: overallProgress
        }
      }

    case 'MARK_VIDEO_WATCHED':
      return {
        ...state,
        progress: {
          ...state.progress,
          videoWatched: true
        }
      }

    case 'COMPLETE_PRACTICE':
      return {
        ...state,
        progress: {
          ...state.progress,
          practiceCompleted: [
            ...state.progress.practiceCompleted,
            action.payload.practiceId
          ]
        }
      }

    case 'VIEW_RESOURCE':
      if (state.progress.resourcesViewed.includes(action.payload.resourceId)) {
        return state
      }
      return {
        ...state,
        progress: {
          ...state.progress,
          resourcesViewed: [
            ...state.progress.resourcesViewed,
            action.payload.resourceId
          ]
        }
      }

    case 'TOGGLE_BOOKMARK':
      return {
        ...state,
        bookmarked: !state.bookmarked
      }

    case 'COMPLETE_SECTION':
      const newCompleted = new Set(state.completedSections)
      newCompleted.add(action.payload.sectionId)
      return {
        ...state,
        completedSections: newCompleted
      }

    default:
      return state
  }
}

export function LessonProvider({ children, lessonId }) {
  const [state, dispatch] = useReducer(lessonReducer, initialState)

  // Load saved progress on mount
  useEffect(() => {
    async function loadProgress() {
      if (!lessonId) return

      try {
        // TODO: Replace with actual API call
        const savedData = localStorage.getItem(`lesson_progress_${lessonId}`)
        if (savedData) {
          const { progress, bookmarked } = JSON.parse(savedData)
          dispatch({
            type: 'INIT_LESSON',
            payload: { lessonId, savedProgress: progress, bookmarked }
          })
        } else {
          dispatch({
            type: 'INIT_LESSON',
            payload: { lessonId }
          })
        }
      } catch (error) {
        console.error('Failed to load lesson progress:', error)
        dispatch({
          type: 'INIT_LESSON',
          payload: { lessonId }
        })
      }
    }

    loadProgress()
  }, [lessonId])

  // Auto-save progress periodically
  useEffect(() => {
    if (!state.lessonId) return

    const saveProgress = () => {
      try {
        // TODO: Replace with actual API call
        localStorage.setItem(
          `lesson_progress_${state.lessonId}`,
          JSON.stringify({
            progress: state.progress,
            bookmarked: state.bookmarked,
            lastUpdated: new Date().toISOString()
          })
        )
      } catch (error) {
        console.error('Failed to save lesson progress:', error)
      }
    }

    const interval = setInterval(saveProgress, 30000) // Every 30 seconds

    // Also save on unmount
    return () => {
      clearInterval(interval)
      saveProgress()
    }
  }, [state.progress, state.bookmarked, state.lessonId])

  return (
    <LessonContext.Provider value={{ state, dispatch }}>
      {children}
    </LessonContext.Provider>
  )
}

export const useLesson = () => {
  const context = useContext(LessonContext)
  if (!context) {
    throw new Error('useLesson must be used within a LessonProvider')
  }
  return context
}
