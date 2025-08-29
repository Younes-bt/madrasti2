import React from 'react'
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react'
import { Button } from '../ui/button'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0,
    }
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    // Log error details for debugging
    console.error('Error Boundary caught an error:', error, errorInfo)
    
    this.setState({
      error,
      errorInfo,
    })

    // Send error to monitoring service if available
    this.logErrorToService(error, errorInfo)
  }

  logErrorToService = (error, errorInfo) => {
    // In a real app, you would send this to an error monitoring service
    // like Sentry, LogRocket, or Rollbar
    const errorData = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      userId: this.getUserId(),
      retryCount: this.state.retryCount,
    }

    // Example: sendToErrorService(errorData)
    console.warn('Error logged:', errorData)
  }

  getUserId = () => {
    // Get user ID from localStorage or context
    try {
      const userData = JSON.parse(localStorage.getItem('madrasti_user_data') || '{}')
      return userData.id || 'anonymous'
    } catch {
      return 'anonymous'
    }
  }

  handleRetry = () => {
    this.setState(prevState => ({
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: prevState.retryCount + 1,
    }))
  }

  handleGoHome = () => {
    window.location.href = '/'
  }

  handleReload = () => {
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      const { fallback: CustomFallback, showDetails = false, level = 'component' } = this.props
      
      // Use custom fallback if provided
      if (CustomFallback) {
        return (
          <CustomFallback
            error={this.state.error}
            errorInfo={this.state.errorInfo}
            retry={this.handleRetry}
            goHome={this.handleGoHome}
            reload={this.handleReload}
            retryCount={this.state.retryCount}
          />
        )
      }

      // Default error UI based on error level
      return this.renderDefaultErrorUI(level, showDetails)
    }

    return this.props.children
  }

  renderDefaultErrorUI = (level, showDetails) => {
    const isProduction = process.env.NODE_ENV === 'production'

    if (level === 'page') {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="max-w-md w-full mx-auto p-8 text-center">
            <div className="mb-6">
              <div className="mx-auto w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-4">
                <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
              </div>
              <h1 className="text-2xl font-bold text-foreground mb-2">
                خطأ في الصفحة | Page Error
              </h1>
              <p className="text-muted-foreground">
                عذراً، حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.
                <br />
                Sorry, an unexpected error occurred. Please try again.
              </p>
            </div>

            <div className="space-y-3">
              <Button onClick={this.handleRetry} className="w-full" variant="default">
                <RefreshCw className="w-4 h-4 mr-2" />
                إعادة المحاولة | Retry
              </Button>
              
              <Button onClick={this.handleGoHome} className="w-full" variant="outline">
                <Home className="w-4 h-4 mr-2" />
                العودة للرئيسية | Go Home
              </Button>

              {this.state.retryCount > 2 && (
                <Button onClick={this.handleReload} className="w-full" variant="secondary">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  إعادة تحميل الصفحة | Reload Page
                </Button>
              )}
            </div>

            {(showDetails || !isProduction) && this.renderErrorDetails()}
          </div>
        </div>
      )
    }

    // Component level error
    return (
      <div className="border border-red-200 dark:border-red-800 rounded-lg p-6 bg-red-50 dark:bg-red-900/10">
        <div className="flex items-start space-x-3 rtl:space-x-reverse">
          <div className="flex-shrink-0">
            <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
              خطأ في المكون | Component Error
            </h3>
            <p className="mt-1 text-sm text-red-700 dark:text-red-300">
              عذراً، حدث خطأ في هذا الجزء من الصفحة.
              <br />
              Something went wrong with this part of the page.
            </p>
            
            <div className="mt-3 flex space-x-2 rtl:space-x-reverse">
              <Button onClick={this.handleRetry} size="sm" variant="outline">
                <RefreshCw className="w-3 h-3 mr-1" />
                إعادة المحاولة
              </Button>
            </div>

            {(showDetails || !isProduction) && this.renderErrorDetails()}
          </div>
        </div>
      </div>
    )
  }

  renderErrorDetails = () => {
    const isProduction = process.env.NODE_ENV === 'production'
    
    if (isProduction && !this.props.showDetails) {
      return null
    }

    return (
      <details className="mt-4 text-left">
        <summary className="cursor-pointer text-sm font-medium text-muted-foreground hover:text-foreground">
          <Bug className="w-4 h-4 inline mr-1" />
          Show Technical Details
        </summary>
        <div className="mt-2 p-3 bg-gray-100 dark:bg-gray-900 rounded text-xs font-mono overflow-auto max-h-40">
          <div className="space-y-2">
            <div>
              <strong>Error:</strong> {this.state.error?.message}
            </div>
            {this.state.error?.stack && (
              <div>
                <strong>Stack:</strong>
                <pre className="whitespace-pre-wrap text-xs mt-1">
                  {this.state.error.stack}
                </pre>
              </div>
            )}
            {this.state.errorInfo?.componentStack && (
              <div>
                <strong>Component Stack:</strong>
                <pre className="whitespace-pre-wrap text-xs mt-1">
                  {this.state.errorInfo.componentStack}
                </pre>
              </div>
            )}
            <div>
              <strong>Retry Count:</strong> {this.state.retryCount}
            </div>
            <div>
              <strong>Timestamp:</strong> {new Date().toISOString()}
            </div>
          </div>
        </div>
      </details>
    )
  }
}

// HOC for wrapping components with error boundary
export const withErrorBoundary = (Component, errorBoundaryProps = {}) => {
  const WrappedComponent = (props) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  )
  
  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`
  
  return WrappedComponent
}

// Hook for handling errors in functional components
export const useErrorHandler = () => {
  const [error, setError] = React.useState(null)

  const handleError = React.useCallback((error) => {
    setError(error)
    console.error('Error handled by useErrorHandler:', error)
  }, [])

  const clearError = React.useCallback(() => {
    setError(null)
  }, [])

  React.useEffect(() => {
    if (error) {
      throw error
    }
  }, [error])

  return { handleError, clearError, error }
}

// Async error boundary hook
export const useAsyncError = () => {
  const { handleError } = useErrorHandler()
  
  return React.useCallback((error) => {
    handleError(error)
  }, [handleError])
}

// Pre-configured error boundaries for common use cases
export const PageErrorBoundary = ({ children, showDetails = false }) => (
  <ErrorBoundary level="page" showDetails={showDetails}>
    {children}
  </ErrorBoundary>
)

export const ComponentErrorBoundary = ({ children, showDetails = false }) => (
  <ErrorBoundary level="component" showDetails={showDetails}>
    {children}
  </ErrorBoundary>
)

// Custom fallback components
export const MinimalErrorFallback = ({ error, retry, retryCount }) => (
  <div className="p-4 text-center">
    <p className="text-sm text-muted-foreground mb-2">حدث خطأ | Something went wrong</p>
    <Button onClick={retry} size="sm" variant="outline">
      إعادة المحاولة {retryCount > 0 && `(${retryCount})`}
    </Button>
  </div>
)

export const InlineErrorFallback = ({ error, retry }) => (
  <div className="flex items-center justify-between p-2 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded">
    <span className="text-sm text-red-700 dark:text-red-300">
      خطأ في التحميل | Loading error
    </span>
    <Button onClick={retry} size="sm" variant="ghost">
      <RefreshCw className="w-3 h-3" />
    </Button>
  </div>
)

export default ErrorBoundary