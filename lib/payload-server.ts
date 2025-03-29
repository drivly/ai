import 'server-only'

export const getServerPayload = async () => {
  try {
    const { getPayload } = await import('payload')
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
