'use server'

import configPromise from '@payload-config'

export const getPayloadWithAuth = async () => {
  const payload = await configPromise
  
  return {
    ...payload,
    betterAuth: {
      handler: async () => new Response('Auth migrated to next-auth', { status: 200 })
    }
  }
}
