"use client"

import React from 'react'
import { Button } from './ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card'
import { AlertTriangle, RefreshCw } from 'lucide-react'

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
  errorInfo?: React.ErrorInfo
  retryCount: number
}

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ComponentType<{ error?: Error; errorInfo?: React.ErrorInfo; retry?: () => void }>
  maxRetries?: number
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { 
      hasError: false, 
      retryCount: 0 
    }
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
    
    // Call custom error handler if provided
    this.props.onError?.(error, errorInfo)
    
    // Store error info for debugging
    this.setState({ errorInfo })
    
    // Report to error tracking service in production
    if (process.env.NODE_ENV === 'production') {
      // Example: reportError(error, errorInfo)
    }
  }

  retry = () => {
    const maxRetries = this.props.maxRetries || 3
    
    if (this.state.retryCount < maxRetries) {
      this.setState(prevState => ({ 
        hasError: false, 
        error: undefined, 
        errorInfo: undefined,
        retryCount: prevState.retryCount + 1
      }))
    }
  }

  render() {
    if (this.state.hasError) {
      const FallbackComponent = this.props.fallback || DefaultErrorFallback
      return (
        <FallbackComponent 
          error={this.state.error} 
          errorInfo={this.state.errorInfo}
          retry={this.state.retryCount < (this.props.maxRetries || 3) ? this.retry : undefined}
        />
      )
    }

    return this.props.children
  }
}

function DefaultErrorFallback({ 
  error, 
  errorInfo, 
  retry 
}: { 
  error?: Error; 
  errorInfo?: React.ErrorInfo; 
  retry?: () => void 
}) {
  const [showDetails, setShowDetails] = React.useState(false)
  
  return (
    <Card className="w-full max-w-md mx-auto" role="alert" aria-live="assertive">
      <CardHeader className="text-center">
        <div className="mx-auto w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-4">
          <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" aria-hidden="true" />
        </div>
        <CardTitle className="text-red-900 dark:text-red-100">Something went wrong</CardTitle>
        <CardDescription>
          {error?.message || 'An unexpected error occurred while loading this component.'}
        </CardDescription>
      </CardHeader>
      <CardContent className="text-center space-y-3">
        <div className="flex gap-2 justify-center">
          {retry && (
            <Button onClick={retry} variant="outline" className="gap-2">
              <RefreshCw className="w-4 h-4" />
              Try again
            </Button>
          )}
          
          <Button 
            onClick={() => setShowDetails(!showDetails)} 
            variant="ghost" 
            size="sm"
            className="gap-2"
          >
            {showDetails ? 'Hide' : 'Show'} Details
          </Button>
        </div>
        
        {showDetails && (
          <details className="text-left">
            <summary className="cursor-pointer text-sm font-medium mb-2">
              Technical Details
            </summary>
            <div className="bg-gray-100 dark:bg-gray-800 p-3 rounded text-xs font-mono overflow-auto max-h-32">
              <div className="mb-1">
                <strong>Error:</strong> {error?.name}
              </div>
              <div className="mb-1">
                <strong>Message:</strong> {error?.message}
              </div>
              {error?.stack && (
                <div>
                  <strong>Stack:</strong>
                  <pre className="whitespace-pre-wrap mt-1 text-xs">{error.stack.slice(0, 500)}...</pre>
                </div>
              )}
            </div>
          </details>
        )}
        
        <p className="text-xs text-muted-foreground">
          If this problem persists, please refresh the page.
        </p>
      </CardContent>
    </Card>
  )
}

// Chart-specific error fallback
export function ChartErrorFallback({ 
  error, 
  retry 
}: { 
  error?: Error; 
  retry?: () => void 
}) {
  return (
    <div 
      className="flex flex-col items-center justify-center p-8 border rounded-lg bg-muted/50 min-h-[300px]"
      role="alert"
      aria-live="polite"
    >
      <AlertTriangle className="w-8 h-8 text-muted-foreground mb-4" aria-hidden="true" />
      <h3 className="font-medium text-muted-foreground mb-2">Chart failed to load</h3>
      <p className="text-sm text-muted-foreground mb-4 text-center max-w-sm">
        {error?.message || 'Unable to render the chart data. This might be due to invalid data or a rendering issue.'}
      </p>
      <div className="flex gap-2">
        {retry && (
          <Button onClick={retry} variant="outline" size="sm" className="gap-2">
            <RefreshCw className="w-4 h-4" />
            Retry
          </Button>
        )}
        <Button 
          onClick={() => window.location.reload()} 
          variant="ghost" 
          size="sm"
          className="gap-2"
        >
          Refresh Page
        </Button>
      </div>
    </div>
  )
}

// Table-specific error fallback
export function TableErrorFallback({ 
  error, 
  retry 
}: { 
  error?: Error; 
  retry?: () => void 
}) {
  return (
    <div 
      className="flex flex-col items-center justify-center p-8 border rounded-lg bg-muted/50"
      role="alert"
      aria-live="polite"
    >
      <AlertTriangle className="w-8 h-8 text-muted-foreground mb-4" aria-hidden="true" />
      <h3 className="font-medium text-muted-foreground mb-2">Table failed to load</h3>
      <p className="text-sm text-muted-foreground mb-4 text-center">
        {error?.message || 'Unable to display the monitor data.'}
      </p>
      {retry && (
        <Button onClick={retry} variant="outline" size="sm" className="gap-2">
          <RefreshCw className="w-4 h-4" />
          Retry
        </Button>
      )}
    </div>
  )
}

export default ErrorBoundary