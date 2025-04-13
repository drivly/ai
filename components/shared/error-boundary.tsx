'use client'

import * as Sentry from '@sentry/nextjs'
import React, { Component, ErrorInfo, ReactNode } from 'react'
import { captureError } from './post-hog-provider'

interface Props {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
  componentName?: string
}

interface State {
  hasError: boolean
  error: Error | null
}

/**
 * Error boundary component that reports errors to both PostHog and Sentry
 * This enables more granular error reporting beyond just global errors
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    Sentry.captureException(error, {
      contexts: {
        react: {
          componentStack: errorInfo.componentStack,
        },
      },
      tags: {
        component: this.props.componentName || 'unknown',
      },
    })

    captureError(error, {
      source: 'error-boundary',
      component: this.props.componentName || 'unknown',
      componentStack: errorInfo.componentStack,
      url: typeof window !== 'undefined' ? window.location.href : undefined,
    })

    if (this.props.onError) {
      this.props.onError(error, errorInfo)
    }
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="p-4 border border-red-300 bg-red-50 rounded-md">
          <h2 className="text-lg font-semibold text-red-800">Something went wrong</h2>
          <p className="text-red-600">
            The error has been reported to our team. Please try again later.
          </p>
        </div>
      )
    }

    return this.props.children
  }
}

/**
 * Functional component wrapper for the ErrorBoundary class component
 */
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  options: Omit<Props, 'children'> = {}
): React.FC<P> {
  const displayName = Component.displayName || Component.name || 'Component'
  
  const WrappedComponent: React.FC<P> = (props) => {
    return (
      <ErrorBoundary {...options} componentName={displayName}>
        <Component {...props} />
      </ErrorBoundary>
    )
  }
  
  WrappedComponent.displayName = `withErrorBoundary(${displayName})`
  
  return WrappedComponent
}
