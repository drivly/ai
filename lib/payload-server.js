import { getPayload } from 'payload'

export async function getServerPayload() {
  try {
    const config = await import('../payload.config')
    const payload = await getPayload({ 
      config: config.default 
    })
    
    return payload
  } catch (error) {
    console.error('Error initializing payload client:', error)
    throw error
  }
}
