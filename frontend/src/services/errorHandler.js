/**
 * Comprehensive Error Handling System
 * Centralizes error handling, logging, and user notification
 */

import { toast } from 'react-hot-toast';

/**
 * Error Types Enum
 */
export const ERROR_TYPES = {
  NETWORK: 'NETWORK',
  AUTHENTICATION: 'AUTHENTICATION',
  AUTHORIZATION: 'AUTHORIZATION',
  VALIDATION: 'VALIDATION',
  SERVER: 'SERVER',
  NOT_FOUND: 'NOT_FOUND',
  RATE_LIMIT: 'RATE_LIMIT',
  UNKNOWN: 'UNKNOWN'
};

/**
 * Error Severity Levels
 */
export const ERROR_SEVERITY = {
  LOW: 'LOW',
  MEDIUM: 'MEDIUM',
  HIGH: 'HIGH',
  CRITICAL: 'CRITICAL'
};

/**
 * Error Handler Class
 */
class ErrorHandler {
  constructor() {
    this.errorLog = [];
    this.maxLogSize = 100;
    this.setupGlobalErrorHandling();
  }

  /**
   * Setup Global Error Handling
   */
  setupGlobalErrorHandling() {
    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      console.error('Unhandled promise rejection:', event.reason);
      this.handleError(event.reason, {
        context: 'unhandledRejection',
        severity: ERROR_SEVERITY.HIGH
      });
    });

    // Handle general JavaScript errors
    window.addEventListener('error', (event) => {
      console.error('JavaScript error:', event.error);
      this.handleError(event.error, {
        context: 'javascriptError',
        severity: ERROR_SEVERITY.MEDIUM
      });
    });

    // Handle authentication errors from API interceptor
    window.addEventListener('auth-error', (event) => {
      this.handleAuthError(event.detail);
    });
  }

  /**
   * Main Error Handler
   * @param {Error} error - Error object
   * @param {Object} options - Error handling options
   */
  handleError(error, options = {}) {
    const errorInfo = this.categorizeError(error);
    const errorContext = {
      ...errorInfo,
      ...options,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent
    };

    // Log error
    this.logError(errorContext);

    // Show user notification based on severity and type
    this.showUserNotification(errorInfo, options);

    // Send error to monitoring service (if configured)
    this.reportError(errorContext);

    return errorContext;
  }

  /**
   * Categorize Error Type and Extract Information
   * @param {Error} error - Error object
   * @returns {Object} Error information
   */
  categorizeError(error) {
    // Network errors
    if (!error.response && error.isNetworkError) {
      return {
        type: ERROR_TYPES.NETWORK,
        severity: ERROR_SEVERITY.HIGH,
        message: error.userMessage || 'Network connection failed',
        originalMessage: error.message,
        code: 'NETWORK_ERROR'
      };
    }

    // HTTP errors
    if (error.response) {
      const status = error.response.status;
      const data = error.response.data || {};

      switch (status) {
        case 400:
          return {
            type: ERROR_TYPES.VALIDATION,
            severity: ERROR_SEVERITY.MEDIUM,
            message: data.error || 'Invalid request data',
            details: data.details || {},
            code: data.error_code || 'VALIDATION_ERROR'
          };

        case 401:
          return {
            type: ERROR_TYPES.AUTHENTICATION,
            severity: ERROR_SEVERITY.HIGH,
            message: data.error || 'Authentication required',
            code: data.error_code || 'AUTHENTICATION_REQUIRED'
          };

        case 403:
          return {
            type: ERROR_TYPES.AUTHORIZATION,
            severity: ERROR_SEVERITY.MEDIUM,
            message: data.error || 'Permission denied',
            requiredPermissions: data.details?.required_permissions || [],
            userRole: data.details?.user_role,
            code: data.error_code || 'PERMISSION_DENIED'
          };

        case 404:
          return {
            type: ERROR_TYPES.NOT_FOUND,
            severity: ERROR_SEVERITY.LOW,
            message: data.error || 'Resource not found',
            resource: data.details?.resource,
            code: data.error_code || 'RESOURCE_NOT_FOUND'
          };

        case 422:
          return {
            type: ERROR_TYPES.VALIDATION,
            severity: ERROR_SEVERITY.MEDIUM,
            message: data.error || 'Validation failed',
            details: data.details || {},
            code: data.error_code || 'VALIDATION_ERROR'
          };

        case 429:
          return {
            type: ERROR_TYPES.RATE_LIMIT,
            severity: ERROR_SEVERITY.MEDIUM,
            message: data.error || 'Too many requests',
            retryAfter: data.details?.retry_after,
            limit: data.details?.limit,
            code: data.error_code || 'RATE_LIMIT_EXCEEDED'
          };

        case 500:
        case 502:
        case 503:
        case 504:
          return {
            type: ERROR_TYPES.SERVER,
            severity: ERROR_SEVERITY.HIGH,
            message: data.error || 'Server error occurred',
            errorId: data.details?.error_id,
            code: data.error_code || 'INTERNAL_ERROR'
          };

        default:
          return {
            type: ERROR_TYPES.UNKNOWN,
            severity: ERROR_SEVERITY.MEDIUM,
            message: data.error || `HTTP ${status} error`,
            status,
            code: data.error_code || 'HTTP_ERROR'
          };
      }
    }

    // JavaScript errors
    return {
      type: ERROR_TYPES.UNKNOWN,
      severity: ERROR_SEVERITY.MEDIUM,
      message: error.message || 'An unexpected error occurred',
      stack: error.stack,
      code: 'JAVASCRIPT_ERROR'
    };
  }

  /**
   * Show User Notification
   * @param {Object} errorInfo - Error information
   * @param {Object} options - Display options
   */
  showUserNotification(errorInfo, options = {}) {
    if (options.silent) return;

    const { type, severity, message } = errorInfo;
    
    // Don't show notification for authentication errors (handled separately)
    if (type === ERROR_TYPES.AUTHENTICATION) return;

    // Choose notification method based on severity
    switch (severity) {
      case ERROR_SEVERITY.CRITICAL:
      case ERROR_SEVERITY.HIGH:
        toast.error(message, {
          duration: 6000,
          position: 'top-right',
          icon: '🚨'
        });
        break;

      case ERROR_SEVERITY.MEDIUM:
        toast.error(message, {
          duration: 4000,
          position: 'top-right'
        });
        break;

      case ERROR_SEVERITY.LOW:
        if (type !== ERROR_TYPES.NOT_FOUND) {
          toast(message, {
            duration: 3000,
            position: 'top-right',
            icon: '⚠️'
          });
        }
        break;
    }
  }

  /**
   * Handle Authentication Errors
   * @param {Object} authError - Authentication error details
   */
  handleAuthError(authError) {
    console.warn('Authentication error:', authError);
    
    // Clear any existing auth-related toasts
    toast.dismiss();
    
    // Show authentication error message
    toast.error('Session expired. Please log in again.', {
      duration: 5000,
      position: 'top-center',
      icon: '🔐'
    });

    // Log the auth error
    this.logError({
      type: ERROR_TYPES.AUTHENTICATION,
      severity: ERROR_SEVERITY.HIGH,
      message: authError.message || 'Authentication failed',
      timestamp: new Date().toISOString(),
      context: 'authError'
    });
  }

  /**
   * Log Error to Internal Store
   * @param {Object} errorContext - Error context information
   */
  logError(errorContext) {
    this.errorLog.push(errorContext);
    
    // Keep log size manageable
    if (this.errorLog.length > this.maxLogSize) {
      this.errorLog.shift();
    }

    // Log to console in development
    if (import.meta.env.DEV) {
      console.error('Error logged:', errorContext);
    }
  }

  /**
   * Report Error to Monitoring Service
   * @param {Object} errorContext - Error context information
   */
  reportError(errorContext) {
    // Only report high and critical severity errors in production
    if (!import.meta.env.PROD || 
        ![ERROR_SEVERITY.HIGH, ERROR_SEVERITY.CRITICAL].includes(errorContext.severity)) {
      return;
    }

    // Here you would integrate with error monitoring services like:
    // - Sentry
    // - Bugsnag
    // - LogRocket
    // - Custom error reporting endpoint

    try {
      // Example: Send to custom error reporting endpoint
      // fetch('/api/errors/report', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(errorContext)
      // }).catch(() => {
      //   // Fail silently for error reporting failures
      // });
    } catch (reportingError) {
      console.warn('Failed to report error:', reportingError);
    }
  }

  /**
   * Get Error Log
   * @param {Object} filters - Log filters
   * @returns {Array} Filtered error log
   */
  getErrorLog(filters = {}) {
    let log = [...this.errorLog];

    if (filters.type) {
      log = log.filter(error => error.type === filters.type);
    }

    if (filters.severity) {
      log = log.filter(error => error.severity === filters.severity);
    }

    if (filters.since) {
      const sinceDate = new Date(filters.since);
      log = log.filter(error => new Date(error.timestamp) >= sinceDate);
    }

    return log.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }

  /**
   * Clear Error Log
   */
  clearErrorLog() {
    this.errorLog = [];
  }

  /**
   * Get Error Statistics
   * @returns {Object} Error statistics
   */
  getErrorStats() {
    const stats = {
      total: this.errorLog.length,
      byType: {},
      bySeverity: {},
      recent: this.errorLog.filter(error => 
        new Date() - new Date(error.timestamp) < 3600000 // Last hour
      ).length
    };

    this.errorLog.forEach(error => {
      stats.byType[error.type] = (stats.byType[error.type] || 0) + 1;
      stats.bySeverity[error.severity] = (stats.bySeverity[error.severity] || 0) + 1;
    });

    return stats;
  }

  /**
   * Handle Validation Errors for Forms
   * @param {Object} validationErrors - Validation error details
   * @returns {Object} Formatted validation errors
   */
  handleValidationErrors(validationErrors) {
    const formattedErrors = {};
    
    if (validationErrors.details) {
      Object.entries(validationErrors.details).forEach(([field, messages]) => {
        formattedErrors[field] = Array.isArray(messages) ? messages[0] : messages;
      });
    }

    return formattedErrors;
  }

  /**
   * Create User-Friendly Error Message
   * @param {Error} error - Error object
   * @returns {string} User-friendly message
   */
  getUserFriendlyMessage(error) {
    const errorInfo = this.categorizeError(error);
    
    switch (errorInfo.type) {
      case ERROR_TYPES.NETWORK:
        return 'Unable to connect to the server. Please check your internet connection.';
      
      case ERROR_TYPES.AUTHENTICATION:
        return 'Your session has expired. Please log in again.';
      
      case ERROR_TYPES.AUTHORIZATION:
        return 'You don\'t have permission to perform this action.';
      
      case ERROR_TYPES.VALIDATION:
        return errorInfo.message || 'Please check your input and try again.';
      
      case ERROR_TYPES.NOT_FOUND:
        return 'The requested resource was not found.';
      
      case ERROR_TYPES.RATE_LIMIT:
        return 'Too many requests. Please try again in a few minutes.';
      
      case ERROR_TYPES.SERVER:
        return 'A server error occurred. Please try again later.';
      
      default:
        return errorInfo.message || 'An unexpected error occurred.';
    }
  }
}

// Create and export singleton instance
const errorHandler = new ErrorHandler();

// Export convenience functions
export const handleError = (error, options = {}) => errorHandler.handleError(error, options);
export const getErrorLog = (filters = {}) => errorHandler.getErrorLog(filters);
export const clearErrorLog = () => errorHandler.clearErrorLog();
export const getErrorStats = () => errorHandler.getErrorStats();
export const handleValidationErrors = (errors) => errorHandler.handleValidationErrors(errors);
export const getUserFriendlyMessage = (error) => errorHandler.getUserFriendlyMessage(error);

export default errorHandler;