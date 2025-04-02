import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from '../../../../lib/auth/payload-auth'

export async function GET(request: NextRequest) {
  try {
    const payload = await getPayload()
    const { betterAuth } = payload
    const session = await betterAuth.sessions.getSessionFromRequest(request)
    
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json({ 
        error: 'unauthorized', 
        error_description: 'Admin access required' 
      }, { status: 401 })
    }
    
    const clients = await betterAuth.database.find(betterAuth.oauthApplication?.modelName || 'oauthApplications', {})
    
    const maskedClients = clients.map(client => ({
      ...client,
      clientSecret: client.clientSecret ? '****' + client.clientSecret.substring(client.clientSecret.length - 4) : '',
    }))
    
    return NextResponse.json({ clients: maskedClients })
  } catch (error) {
    console.error('Fetch clients error:', error)
    return NextResponse.json({ 
      error: 'server_error', 
      error_description: 'An error occurred fetching clients' 
    }, { status: 500 })
  }
}
