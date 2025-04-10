'use server'

import type { BetterAuthPlugins } from '@/lib/auth/types'
import { getPayloadAuth } from '@payload-auth/better-auth-plugin'
import configPromise from '@payload-config'

export const getPayloadWithAuth = async () => getPayloadAuth<BetterAuthPlugins>(configPromise)


