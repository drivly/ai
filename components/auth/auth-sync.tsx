'use client'

import { useEffect, useRef, useState } from 'react'
import { useSession } from 'next-auth/react'
import { syncAuthToDomains } from '@/lib/auth/utils'

export function AuthSync() {
  const { status } = useSession()
  const [syncAttempted, setSyncAttempted] = useState(false)
  const syncInProgress = useRef(false)
  const syncTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Cleanup function for any timeouts
  useEffect(() => {
    return () => {
      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current)
      }
    }
  }, [])

  // Main sync effect
  useEffect(() => {
    const performSync = async () => {
      // Only sync when authenticated and not already attempted
      if (status === 'authenticated' && !syncAttempted && !syncInProgress.current) {
        syncInProgress.current = true

        try {
          // Get token from helper endpoint
          const response = await fetch('/authsync')

          if (!response.ok) {
            throw new Error('Failed to get auth token')
          }

          const data = await response.json()

          if (data.token) {
            // Sync the token to other domains
            await syncAuthToDomains(data.token)

            // Mark sync as attempted and successful
            setSyncAttempted(true)

            // Set a cookie to track that sync was done
            document.cookie = 'auth_sync_completed=true; path=/; max-age=3600'
          }
        } catch (error) {
          console.error('Auth sync failed:', error)
        } finally {
          // Always reset the in-progress flag
          syncInProgress.current = false
        }
      }
    }

    // Add a small delay to avoid rapid syncing during navigation or session changes
    syncTimeoutRef.current = setTimeout(performSync, 300)
  }, [status, syncAttempted])

  // Cross-tab coordination
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'auth_sync_trigger' && status === 'authenticated') {
        setSyncAttempted(false) // Allow re-sync when triggered from another tab
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [status])

  return null // This component doesn't render anything
}
