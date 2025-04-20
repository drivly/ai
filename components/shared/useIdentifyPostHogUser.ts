'use client'

import { useEffect } from 'react'
import { usePostHog } from 'posthog-js/react'

export const useIdentifyPostHogUser = () => {}

if (typeof window !== 'undefined') {
  import('./useIdentifyPostHogUserClient')
    .then((module) => {
      Object.assign(useIdentifyPostHogUser, module.useIdentifyPostHogUserClient)
    })
    .catch((error) => {
      console.error('Failed to load PostHog client module:', error)
    })
}
