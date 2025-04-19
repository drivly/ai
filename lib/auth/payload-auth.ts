'use server'

import configPromise from '@payload-config'

export const getPayloadWithAuth = async () => {
  const config = await configPromise
  return { 
    payload: config,
    betterAuth: {
      handler: async () => new Response('Auth migrated to next-auth', { status: 200 })
    }
  }
}
