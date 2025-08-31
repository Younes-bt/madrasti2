/**
 * Generic API Hooks
 * Provides reusable hooks for common API operations with error handling
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { handleError, ERROR_TYPES } from '../services/errorHandler.js';

/**
 * Generic API Hook for any API call
 * @param {Function} apiCall - API function to call
 * @param {Object} options - Hook options
 * @returns {Object} Hook state and methods
 */
export const useApi = (apiCall, options = {}) => {
  const {
    immediate = false,
    onSuccess,
    onError,
    dependencies = [],
    initialData = null,
    silent = false
  } = options;

  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastFetch, setLastFetch] = useState(null);
  const abortControllerRef = useRef(null);
  const mountedRef = useRef(true);

  // Cleanup on unmount
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const execute = useCallback(async (...args) => {
    if (!mountedRef.current) return;

    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller
    abortControllerRef.current = new AbortController();

    setLoading(true);
    setError(null);

    try {
      const result = await apiCall(...args);
      
      if (!mountedRef.current) return;

      setData(result);
      setLastFetch(new Date());
      
      if (onSuccess) {
        onSuccess(result);
      }

      return result;
    } catch (err) {
      if (!mountedRef.current) return;

      // Don't handle aborted requests
      if (err.name === 'AbortError') return;

      const errorInfo = handleError(err, { silent });
      setError(errorInfo);
      
      if (onError) {
        onError(errorInfo);
      }

      throw err;
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  }, [apiCall, onSuccess, onError, silent]);

  // Execute immediately if requested
  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, [immediate, ...dependencies]);

  const reset = useCallback(() => {
    setData(initialData);
    setError(null);
    setLoading(false);
    setLastFetch(null);
  }, [initialData]);

  const refetch = useCallback(() => {
    return execute();
  }, [execute]);

  return {
    data,
    loading,
    error,
    lastFetch,
    execute,
    refetch,
    reset
  };
};

/**
 * Hook for GET requests with automatic fetching
 * @param {Function} apiCall - API function to call
 * @param {Object} options - Hook options
 * @returns {Object} Hook state and methods
 */
export const useFetch = (apiCall, options = {}) => {
  return useApi(apiCall, { immediate: true, ...options });
};

/**
 * Hook for POST/PUT/PATCH requests (mutations)
 * @param {Function} apiCall - API function to call
 * @param {Object} options - Hook options
 * @returns {Object} Hook state and methods
 */
export const useMutation = (apiCall, options = {}) => {
  return useApi(apiCall, { immediate: false, ...options });
};

/**
 * Hook for DELETE requests
 * @param {Function} apiCall - API function to call
 * @param {Object} options - Hook options
 * @returns {Object} Hook state and methods
 */
export const useDelete = (apiCall, options = {}) => {
  const {
    onSuccess: originalOnSuccess,
    confirmMessage = 'Are you sure you want to delete this item?',
    requireConfirmation = true,
    ...restOptions
  } = options;

  const onSuccess = useCallback((result) => {
    if (originalOnSuccess) {
      originalOnSuccess(result);
    }
  }, [originalOnSuccess]);

  const mutation = useMutation(apiCall, { onSuccess, ...restOptions });

  const deleteWithConfirmation = useCallback(async (...args) => {
    if (requireConfirmation) {
      if (!window.confirm(confirmMessage)) {
        return;
      }
    }
    return mutation.execute(...args);
  }, [mutation.execute, confirmMessage, requireConfirmation]);

  return {
    ...mutation,
    execute: deleteWithConfirmation,
    deleteItem: deleteWithConfirmation
  };
};

/**
 * Hook for paginated data fetching
 * @param {Function} apiCall - API function to call
 * @param {Object} options - Hook options
 * @returns {Object} Hook state and methods
 */
export const usePagination = (apiCall, options = {}) => {
  const {
    initialPage = 1,
    pageSize = 20,
    ...restOptions
  } = options;

  const [currentPage, setCurrentPage] = useState(initialPage);
  const [allData, setAllData] = useState([]);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [hasPrevPage, setHasPrevPage] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const apiCallWithPagination = useCallback((params = {}) => {
    return apiCall({
      page: currentPage,
      page_size: pageSize,
      ...params
    });
  }, [apiCall, currentPage, pageSize]);

  const onSuccess = useCallback((result) => {
    if (result && typeof result === 'object') {
      // Handle paginated response
      if (result.results) {
        setAllData(result.results);
        setTotalCount(result.count || 0);
        setHasNextPage(!!result.next);
        setHasPrevPage(!!result.previous);
        
        if (result.page_info) {
          setTotalPages(result.page_info.total_pages || 0);
        } else {
          setTotalPages(Math.ceil((result.count || 0) / pageSize));
        }
      } else {
        // Handle non-paginated response
        setAllData(Array.isArray(result) ? result : [result]);
        setTotalCount(Array.isArray(result) ? result.length : 1);
        setHasNextPage(false);
        setHasPrevPage(false);
        setTotalPages(1);
      }
    }

    if (restOptions.onSuccess) {
      restOptions.onSuccess(result);
    }
  }, [pageSize, restOptions.onSuccess]);

  const {
    data,
    loading,
    error,
    execute,
    refetch,
    reset
  } = useApi(apiCallWithPagination, {
    immediate: true,
    onSuccess,
    dependencies: [currentPage],
    ...restOptions
  });

  const goToPage = useCallback((page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  }, [totalPages]);

  const nextPage = useCallback(() => {
    if (hasNextPage) {
      setCurrentPage(prev => prev + 1);
    }
  }, [hasNextPage]);

  const prevPage = useCallback(() => {
    if (hasPrevPage) {
      setCurrentPage(prev => prev - 1);
    }
  }, [hasPrevPage]);

  const resetPagination = useCallback(() => {
    setCurrentPage(initialPage);
    setAllData([]);
    setHasNextPage(false);
    setHasPrevPage(false);
    setTotalCount(0);
    setTotalPages(0);
    reset();
  }, [initialPage, reset]);

  return {
    // Data
    data: allData,
    rawData: data,
    loading,
    error,
    
    // Pagination state
    currentPage,
    pageSize,
    totalCount,
    totalPages,
    hasNextPage,
    hasPrevPage,
    
    // Methods
    execute,
    refetch,
    reset: resetPagination,
    goToPage,
    nextPage,
    prevPage
  };
};

/**
 * Hook for search functionality with debouncing
 * @param {Function} apiCall - API function to call
 * @param {Object} options - Hook options
 * @returns {Object} Hook state and methods
 */
export const useSearch = (apiCall, options = {}) => {
  const {
    debounceMs = 300,
    minSearchLength = 2,
    immediate = false,
    ...restOptions
  } = options;

  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const debounceTimerRef = useRef(null);

  // Debounce search query
  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, debounceMs);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [searchQuery, debounceMs]);

  const apiCallWithSearch = useCallback((params = {}) => {
    const searchParams = debouncedQuery.length >= minSearchLength 
      ? { search: debouncedQuery, ...params }
      : params;
    
    return apiCall(searchParams);
  }, [apiCall, debouncedQuery, minSearchLength]);

  const shouldFetch = immediate || (debouncedQuery.length >= minSearchLength);

  const {
    data,
    loading,
    error,
    execute,
    refetch,
    reset
  } = useApi(apiCallWithSearch, {
    immediate: shouldFetch,
    dependencies: [debouncedQuery],
    ...restOptions
  });

  const search = useCallback((query) => {
    setSearchQuery(query);
  }, []);

  const clearSearch = useCallback(() => {
    setSearchQuery('');
    setDebouncedQuery('');
  }, []);

  return {
    data,
    loading,
    error,
    searchQuery,
    debouncedQuery,
    search,
    clearSearch,
    execute,
    refetch,
    reset,
    isSearching: loading && debouncedQuery.length >= minSearchLength
  };
};

/**
 * Hook for form submissions with validation
 * @param {Function} apiCall - API function to call
 * @param {Object} options - Hook options
 * @returns {Object} Hook state and methods
 */
export const useFormSubmission = (apiCall, options = {}) => {
  const {
    validationSchema,
    onSuccess: originalOnSuccess,
    resetOnSuccess = true,
    ...restOptions
  } = options;

  const [formData, setFormData] = useState({});
  const [validationErrors, setValidationErrors] = useState({});
  const [isValid, setIsValid] = useState(true);

  const onSuccess = useCallback((result) => {
    if (resetOnSuccess) {
      setFormData({});
      setValidationErrors({});
    }
    
    if (originalOnSuccess) {
      originalOnSuccess(result);
    }
  }, [originalOnSuccess, resetOnSuccess]);

  const onError = useCallback((errorInfo) => {
    if (errorInfo.type === ERROR_TYPES.VALIDATION && errorInfo.details) {
      setValidationErrors(errorInfo.details);
      setIsValid(false);
    }
    
    if (restOptions.onError) {
      restOptions.onError(errorInfo);
    }
  }, [restOptions.onError]);

  const {
    data,
    loading,
    error,
    execute,
    reset
  } = useMutation(apiCall, {
    onSuccess,
    onError,
    ...restOptions
  });

  const updateField = useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear field validation error when user starts typing
    if (validationErrors[field]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  }, [validationErrors]);

  const validateForm = useCallback(() => {
    if (!validationSchema) return true;

    try {
      validationSchema.parse(formData);
      setValidationErrors({});
      setIsValid(true);
      return true;
    } catch (err) {
      const errors = {};
      err.errors?.forEach(error => {
        errors[error.path[0]] = error.message;
      });
      setValidationErrors(errors);
      setIsValid(false);
      return false;
    }
  }, [formData, validationSchema]);

  const submit = useCallback(async (additionalData = {}) => {
    const dataToSubmit = { ...formData, ...additionalData };
    
    if (validationSchema && !validateForm()) {
      return;
    }

    return execute(dataToSubmit);
  }, [formData, validationSchema, validateForm, execute]);

  const resetForm = useCallback(() => {
    setFormData({});
    setValidationErrors({});
    setIsValid(true);
    reset();
  }, [reset]);

  return {
    data,
    loading,
    error,
    formData,
    validationErrors,
    isValid,
    updateField,
    validateForm,
    submit,
    reset: resetForm
  };
};

export default {
  useApi,
  useFetch,
  useMutation,
  useDelete,
  usePagination,
  useSearch,
  useFormSubmission
};