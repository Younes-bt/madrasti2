import { useState, useCallback } from 'react'
import { useAuth } from './useAuth'

export const useApi = () => {
  const { token } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const makeRequest = useCallback(async (url, options = {}) => {
    setLoading(true)
    setError(null)

    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
          ...options.headers,
        },
        ...options,
      }

      const response = await fetch(url, config)
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      return data
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [token])

  const get = useCallback((url, options = {}) => {
    return makeRequest(url, { ...options, method: 'GET' })
  }, [makeRequest])

  const post = useCallback((url, data, options = {}) => {
    return makeRequest(url, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
    })
  }, [makeRequest])

  const put = useCallback((url, data, options = {}) => {
    return makeRequest(url, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }, [makeRequest])

  const patch = useCallback((url, data, options = {}) => {
    return makeRequest(url, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  }, [makeRequest])

  const del = useCallback((url, options = {}) => {
    return makeRequest(url, { ...options, method: 'DELETE' })
  }, [makeRequest])

  return {
    loading,
    error,
    get,
    post,
    put,
    patch,
    delete: del,
    makeRequest,
  }
}

// Specialized hooks for common API patterns
export const useFetch = (url, options = {}) => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { get } = useApi()

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const result = await get(url, options)
      setData(result)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [url, get, options])

  const refetch = useCallback(() => {
    fetchData()
  }, [fetchData])

  return { data, loading, error, refetch }
}

export const useMutation = (mutationFn) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [data, setData] = useState(null)

  const mutate = useCallback(async (...args) => {
    try {
      setLoading(true)
      setError(null)
      const result = await mutationFn(...args)
      setData(result)
      return result
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [mutationFn])

  return {
    mutate,
    loading,
    error,
    data,
  }
}