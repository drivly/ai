import { API } from '@/lib/api'
import { getPayload } from '@/lib/auth/payload-auth'

export const GET = API(async (request, { url, user }) => {
  if (!user) {
    return { error: 'unauthorized', error_description: 'Authentication required' }
  }
  
  const payload = await getPayload()
  
  const userDoc = await payload.findByID({
    collection: 'users',
    id: user.id,
  })
  
  if (!userDoc || userDoc.role !== 'admin') {
    return { error: 'forbidden', error_description: 'Admin access required' }
  }
  
  try {
    const clientsResult = await payload.find({
      collection: 'oauth-clients' as 'oauth-clients',
      depth: 0
    })
    
    const maskedClients = clientsResult.docs.map(client => ({
      id: client.id,
      name: client.name,
      clientId: client.clientId,
      clientSecret: client.clientSecret 
        ? '****' + client.clientSecret.substring(client.clientSecret.length - 4) 
        : '',
      redirectURLs: client.redirectURLs.map((item: any) => item.url),
      disabled: client.disabled,
      createdBy: client.createdBy
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
