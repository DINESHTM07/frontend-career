import React from 'react'

/*
  WHY a class component (not a function component with hooks):
  Error boundaries MUST be class components. There is no hook equivalent
  for componentDidCatch or getDerivedStateFromError. This is a known limitation
  of the React hooks system — error boundaries are one of two things that still
  require class components (the other is getSnapshotBeforeUpdate).

  React team has confirmed they plan to add a useErrorBoundary hook, but as of
  React 18 it's still class-only. Libraries like react-error-boundary provide
  a hook-friendly wrapper.

  WHY use Error Boundaries at all:
  Without them, a single render error in ANY component crashes the ENTIRE React tree.
  The user sees a blank white screen with no explanation.
  With an error boundary, only the section that errored is replaced with a fallback.
  The rest of the app continues working.

  HOW it works:
  getDerivedStateFromError: Called when a child throws. Returns new state.
    → This is synchronous and causes a re-render with the fallback UI.
  componentDidCatch: Called after the re-render with error details.
    → This is where you'd send the error to a logging service (Sentry, etc.)
*/
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    }
  }

  // WHY static: getDerivedStateFromError is a static method. It cannot access
  // `this` because it's called before the component re-renders with the new state.
  // It receives the error and must RETURN the new state object.
  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  // WHY componentDidCatch: This is where you log the error externally.
  // errorInfo.componentStack shows the React component tree at the time of the error.
  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo })
    // In production, send to Sentry or similar:
    // Sentry.captureException(error, { extra: errorInfo })
    console.error('ErrorBoundary caught:', error, errorInfo)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null })
  }

  render() {
    if (this.state.hasError) {
      // If a custom fallback was provided via props, use it
      if (this.props.fallback) {
        return this.props.fallback
      }

      // Default fallback UI
      return (
        <div className="min-h-[400px] flex items-center justify-center p-8">
          <div className="max-w-md w-full text-center">
            {/* Icon */}
            <div className="w-20 h-20 mx-auto mb-6 bg-red-100 dark:bg-red-900/30
                            rounded-full flex items-center justify-center">
              <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                />
              </svg>
            </div>

            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Something went wrong
            </h2>

            <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm leading-relaxed">
              An unexpected error occurred in this part of the app.
              The rest of the page is still working.
            </p>

            {/* Show error details in development only */}
            {import.meta.env.DEV && this.state.error && (
              <details className="mb-6 text-left">
                <summary className="cursor-pointer text-sm font-medium text-red-600 dark:text-red-400 mb-2">
                  Error details (dev only)
                </summary>
                <pre className="text-xs bg-red-50 dark:bg-red-900/20 text-red-800
                                dark:text-red-300 p-3 rounded-lg overflow-auto max-h-40">
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}

            <div className="flex gap-3 justify-center">
              <button
                onClick={this.handleReset}
                className="btn-primary"
              >
                Try again
              </button>
              <button
                onClick={() => window.location.reload()}
                className="btn-ghost"
              >
                Reload page
              </button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
