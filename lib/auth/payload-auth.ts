'use server'

import configPromise from '@payload-config'

export const getPayloadWithAuth = async () => {
  const payload = await configPromise
  
  return payload
}
