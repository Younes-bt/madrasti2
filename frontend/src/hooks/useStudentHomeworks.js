import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { toast } from 'sonner'

import { homeworkService } from '../services'

const COMPLETED_STATUSES = new Set(['completed', 'late'])
const PENDING_STATUSES = new Set(['pending', 'in_progress', 'draft', 'overdue'])

export const useStudentHomeworks = (defaultParams = {}) => {
  const [homeworks, setHomeworks] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const paramsRef = useRef({})
  const defaultParamsRef = useRef(defaultParams)
  const defaultParamsKeyRef = useRef(JSON.stringify(defaultParams ?? {}))
  const [params, setParamsState] = useState(() => {
    const initial = { ...defaultParams }
    paramsRef.current = initial
    return initial
  })

  useEffect(() => {
    paramsRef.current = params
  }, [params])

  const synchronizeDefaultParams = JSON.stringify(defaultParams ?? {})

  useEffect(() => {
    if (synchronizeDefaultParams !== defaultParamsKeyRef.current) {
      defaultParamsKeyRef.current = synchronizeDefaultParams
      defaultParamsRef.current = defaultParams
      setParamsState(prev => {
        const next = { ...defaultParams, ...prev }
        paramsRef.current = next
        return next
      })
    }
  }, [defaultParams, synchronizeDefaultParams])

  const loadHomeworks = useCallback(
    async (overrideParams = {}) => {
      try {
        setLoading(true)
        setError(null)

        const mergedParams = {
          ...defaultParamsRef.current,
          ...paramsRef.current,
          ...overrideParams,
        }
        const result = await homeworkService.getHomeworks(mergedParams)
        if (result.success) {
          const formatted = (result.data || []).map(item => homeworkService.formatHomeworkFromAPI(item)).filter(Boolean)
          setHomeworks(formatted)
        } else {
          setError(result.error || 'Failed to load homework')
          toast.error(result.error || 'Failed to load homework')
        }
      } catch (err) {
        console.error('Failed to load student homework:', err)
        setError('Failed to load homework')
        toast.error('Failed to load homework')
      } finally {
        setLoading(false)
      }
    },
    []
  )

  const updateParams = useCallback((value) => {
    setParamsState(prev => {
      const next = typeof value === 'function' ? value(prev) : value
      paramsRef.current = next
      return next
    })
  }, [])

  useEffect(() => {
    loadHomeworks()
  }, [loadHomeworks])

  const summary = useMemo(() => {
    const totals = {
      total: homeworks.length,
      pending: 0,
      completed: 0,
      overdue: 0,
    }

    homeworks.forEach(hw => {
      const normalized = hw?.studentStatusNormalized || (hw?.student_status ?? '').toLowerCase()
      if (COMPLETED_STATUSES.has(normalized)) {
        totals.completed += 1
        return
      }

      if (normalized === 'overdue') {
        totals.overdue += 1
      }

      if (PENDING_STATUSES.has(normalized)) {
        totals.pending += 1
      }
    })

    return totals
  }, [homeworks])

  return {
    homeworks,
    loading,
    error,
    refresh: loadHomeworks,
    setParams: updateParams,
    summary,
  }
}
