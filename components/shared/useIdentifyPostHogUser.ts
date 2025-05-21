'use client'

import { useAuthUser } from '@/hooks/use-auth-user'
import { usePostHog } from 'posthog-js/react'
import { useEffect } from 'react'

export const useIdentifyPostHogUser = () => {
  const posthog = usePostHog()
  const user = useAuthUser()

  useEffect(() => {
    if (!user) return

    posthog.identify(user.id, {
      name: user?.name,
      email: user.email,
      photo: null, // Don't use image property as it doesn't exist in type
      domain: window.location.hostname || 'unknown',
    })
  }, [posthog, user])
}
