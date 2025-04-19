import { useAuth } from '@/lib/auth/context'
import { use, useEffect } from 'react'
import { usePostHog } from 'posthog-js/react'

export const useIdentifyPostHogUser = () => {
  const posthog = usePostHog()
  
  try {
    const { currentUserPromise } = useAuth()
    const currentUser = use(currentUserPromise)

    useEffect(() => {
      if (currentUser) {
        posthog.identify(currentUser.id, {
          name: currentUser?.name,
          email: currentUser.email,
          photo: currentUser?.image || null,
          role: currentUser?.role,
          roles: currentUser?.roles,
          domain: typeof window !== 'undefined' ? window.location.hostname : 'unknown',
        })
        if (currentUser.tenants?.[0]?.id) {
          posthog?.group('tenant', currentUser.tenants[0].id)
        }
      }
    }, [currentUser, posthog])
  } catch (error) {
    console.error('Auth not available during static generation:', error)
  }
}
