'use client'

import React from 'react'
import { PostHogProvider as PHProvider } from 'posthog-js/react'
import posthog from 'posthog-js'
import { usePostHogIdentification } from './usePostHogIdentification'

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  usePostHogIdentification()
  
  return (
    <PHProvider client={posthog}>
      {children}
    </PHProvider>
  )
}
