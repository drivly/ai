'use server'

import { getPayload } from 'payload'
import config from '@payload-config'

export const getPayloadWithAuth = async () => {
  try {
    const payload = await getPayload({
      config,
    })

    return payload
  } catch (error) {
    console.error('Error initializing Payload:', error)
    throw error
  }
}
