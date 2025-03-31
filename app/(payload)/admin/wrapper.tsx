'use client'

import React from 'react'

/**
 * This wrapper component ensures that any date-fns functions
 * are properly handled before being passed to client components
 */
export function DateFunctionWrapper({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

/**
 * HOC to wrap components that might receive date-fns functions
 */
export function withDateFunctionHandling<P extends object>(
  Component: React.ComponentType<P>
): React.FC<P> {
  return function WrappedComponent(props: P) {
    const safeProps = Object.entries(props).reduce((acc, [key, value]) => {
      if (
        typeof value === 'function' &&
        (key === 'formatDistance' || 
         key === 'formatRelative' || 
         key === 'dateTime' || 
         key === 'date' || 
         key === 'time')
      ) {
        return { ...acc, [key]: '[Function]' }
      }
      
      return { ...acc, [key]: value }
    }, {} as P)
    
    return <Component {...safeProps} />
  }
}
