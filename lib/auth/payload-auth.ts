'use server'

import type { BetterAuthPlugins } from '@/lib/auth/types'
import { getPayloadAuth } from '@drivly/better-payload-auth'
import configPromise from '@payload-config'

export const getPayloadWithAuth = async () => getPayloadAuth<BetterAuthPlugins>(configPromise)
