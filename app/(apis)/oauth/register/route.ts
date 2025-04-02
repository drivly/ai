import { API } from '@/lib/api'
import { getPayload } from '@/lib/auth/payload-auth'
import crypto from 'crypto'

export const POST = API(async (request, { url, user }) => {
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
  
  const { name, redirectURLs } = await request.json()
  
  if (!name || !redirectURLs || !Array.isArray(redirectURLs) || !redirectURLs.length) {
    return { error: 'invalid_request', error_description: 'Name and redirectURLs are required' }
  }
  
  try {
    const clientId = `client_${crypto.randomBytes(16).toString('hex')}`
    const clientSecret = crypto.randomBytes(32).toString('hex')
    
    const client = await payload.create({
      collection: 'oauth-clients' as 'oauth-clients',
      data: {
        name,
        clientId,
        clientSecret,
        redirectURLs: redirectURLs.map(url => ({ url })),
        disabled: false,
        createdBy: user.id
      }
    })
    
    return { 
      success: true, 
      name: client.name,
      clientId: client.clientId,
      clientSecret: client.clientSecret,
      redirectURLs: client.redirectURLs.map((item: any) => item.url),
      disabled: client.disabled
    }
  } catch (error) {
    console.error('Client registration error:', error)
    return { error: 'server_error', error_description: 'An error occurred registering the client' }
  }
})
