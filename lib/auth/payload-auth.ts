'use server'

import type { BetterAuthPlugins } from '@/lib/auth/types'
import { getPayloadWithAuth } from '@payload-auth/better-auth-plugin'
import configPromise from '@payload-config'

export const getPayload = async () => getPayloadWithAuth(configPromise) as any
