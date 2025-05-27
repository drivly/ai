'use client'

import { useEffect, useState } from 'react'

/**
 * Hook to safely handle server-side rendering hydration mismatches.
 *
 * @param serverContent - Content to show on server and initial client render
 * @param clientContent - Content to show after hydration
 * @returns The appropriate content based on hydration state
 */
export function useHydrationSafe<T>(serverContent: T, clientContent: T): T {
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    setIsHydrated(true)
  }, [])

  return isHydrated ? clientContent : serverContent
}

/**
 * Simple hook to check if component has hydrated
 */
export function useIsHydrated(): boolean {
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    setIsHydrated(true)
  }, [])

  return isHydrated
}
