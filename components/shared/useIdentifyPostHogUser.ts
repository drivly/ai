import { useAuth } from '@/lib/auth/context'
import { use, useEffect } from 'react'
import { usePostHog } from 'posthog-js/react'

export const useIdentifyPostHogUser = () => {
  const posthog = usePostHog()
  const { currentUserPromise } = useAuth()
  const currentUser = use(currentUserPromise)

  useEffect(() => {
    if (currentUser) {
      posthog.identify(currentUser.id, {
        name: currentUser?.name,
        email: currentUser.email,
        photo: currentUser?.image,
        role: currentUser?.role,
        roles: currentUser?.roles,
        domain: window.location.hostname || 'unknown',
      })
      posthog?.group('tenant', currentUser.tenants?.[0]?.id || 'unknown')
    }
  }, [currentUser, posthog])
}
