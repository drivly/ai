import { API } from '@/lib/api'
import { getPayload } from '@/lib/auth/payload-auth'

export const GET = API(async (request, { url, user }) => {
  if (!user) {
    return { error: 'unauthorized', error_description: 'Authentication required' }
  }
  
  const payload = await getPayload()
  const { betterAuth } = payload
  
  const userDoc = await payload.findByID({
    collection: 'users',
    id: user.id,
  })
  
  if (!userDoc || userDoc.role !== 'admin') {
    return { error: 'forbidden', error_description: 'Admin access required' }
  }
  
  try {
    const clients = await betterAuth.api.oAuthProxy.listClients(user.id)
    
    const maskedClients = clients.map(client => ({
      ...client,
      clientSecret: client.clientSecret 
        ? '****' + client.clientSecret.substring(client.clientSecret.length - 4) 
        : '',
    }))
    
    return { 
      success: true, 
      clients: maskedClients 
    }
  } catch (error) {
    console.error('Fetch clients error:', error)
    return { error: 'server_error', error_description: 'An error occurred fetching clients' }
  }
})
