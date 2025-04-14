'use client'

import { useEffect } from 'react'
import posthog from 'posthog-js'

import { useIdentifyPostHogUser } from './useIdentifyPostHogUser'

export const usePostHogIdentification = () => {
  useIdentifyPostHogUser()
}
