'use client'

import { useAuth } from '@/lib/auth/context'
import { use, useEffect } from 'react'
import { usePostHog } from 'posthog-js/react'

export const useIdentifyPostHogUserClient = () => {
  const posthog = usePostHog()
  
  let currentUser = null
  
  let authError = false
  
  try {
    const { currentUserPromise } = useAuth()
    currentUser = use(currentUserPromise)
  } catch (error) {
    authError = true
    console.error('Auth not available:', error)
  }
  
  useEffect(() => {
    if (authError || !currentUser) return
    
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
  }, [currentUser, posthog, authError])
}
