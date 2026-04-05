import { Component } from 'react'

// ErrorBoundary
// TODO (Day 7): Build the error boundary component.
//
// What to build:
//   - A React class component (error boundaries MUST be class components)
//   - Catches render errors in its children
//   - Shows a friendly fallback UI instead of a blank/broken page
//   - Includes a "Try again" button that resets the error state
//
// React lifecycle methods to use:
//   - static getDerivedStateFromError(error): update state.hasError = true
//   - componentDidCatch(error, info): log the error (console.error)
//
// Fallback UI should include:
//   - An error icon or emoji
//   - "Something went wrong" heading
//   - The error message (error.message)
//   - A "Try again" button that calls this.setState({ hasError: false })
//
// Note: this.props.children renders the wrapped content when no error.

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    // TODO: initialize state with hasError: false
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error) {
    // TODO: return { hasError: true, error }
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    // TODO: log error details
    console.error('ErrorBoundary caught:', error, info)
  }

  render() {
    if (this.state.hasError) {
      // TODO: replace with a proper fallback UI
      return (
        <div className="flex flex-col items-center justify-center min-h-[40vh] text-center px-4">
          <div className="text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Something went wrong
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-4 text-sm">
            {this.state.error?.message}
          </p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="btn-primary"
          >
            Try again
          </button>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
