'use client'

import { useAuth } from '@/lib/auth/context'
import { useEffect } from 'react'
import { usePostHog } from 'posthog-js/react'

export const useIdentifyPostHogUserClient = () => {
  const posthog = usePostHog()
  const auth = useAuth()

  useEffect(() => {
    if (typeof window === 'undefined') return

    const getCurrentUser = async () => {
      try {
        const currentUser = await auth.currentUserPromise

        if (!currentUser) return

        posthog.identify(currentUser.id, {
          name: currentUser?.name,
          email: currentUser.email,
          photo: null, // Don't use image property as it doesn't exist in type
          role: currentUser?.role,
          roles: currentUser?.roles,
          domain: window.location.hostname || 'unknown',
        })

        if (currentUser.tenants?.[0]?.id) {
          posthog?.group('tenant', currentUser.tenants[0].id)
        }
      } catch (error) {
        console.error('Error identifying user in PostHog:', error)
      }
    }

    getCurrentUser()
  }, [posthog, auth])
}
