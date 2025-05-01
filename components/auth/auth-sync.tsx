'use client'

import { syncAuthToken } from '@/lib/actions/auth-sync.action'
import { useSession } from 'next-auth/react'
import { useEffect, useRef, useState } from 'react'

export function AuthSync() {
  const { status } = useSession()
  const [syncAttempted, setSyncAttempted] = useState(false)
  const syncInProgress = useRef(false)
  const syncTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const prevStatus = useRef(status)

  // Cleanup function for any timeouts
  useEffect(() => {
    return () => {
      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current)
      }
    }
  }, [])

  // Detect status changes to trigger sync across tabs
  useEffect(() => {
    // If status changed from unauthenticated to authenticated
    if (prevStatus.current !== 'authenticated' && status === 'authenticated') {
      // Notify other tabs that auth state changed
      try {
        localStorage.setItem('auth_sync_trigger', `login:${Date.now()}`)
      } catch (e) {
        // Handle localStorage errors (e.g., private browsing mode)
        console.error('Failed to update localStorage:', e)
      }
    }

    prevStatus.current = status
  }, [status])

  // Main sync effect
  useEffect(() => {
    const performSync = async () => {
      // Only sync when authenticated and not already attempted
      if (status === 'authenticated' && !syncAttempted && !syncInProgress.current) {
        syncInProgress.current = true

        try {
          // Use server action to get and sync token (avoids CORS)
          const result = await syncAuthToken()

          if (result.success) {
            // Mark sync as attempted and successful
            setSyncAttempted(true)
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
      if (!e.key || !e.newValue) return

      if (e.key === 'auth_sync_trigger' && e.newValue.startsWith('login:') && status === 'authenticated') {
        setSyncAttempted(false) // Trigger re-sync when login detected in another tab
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [status])

  return null // This component doesn't render anything
}
