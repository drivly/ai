import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from '../../../../lib/auth/payload-auth'
import crypto from 'crypto'

export async function POST(request: NextRequest) {
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
    
    const body = await request.json()
    const { name, redirectURLs, type = 'web' } = body
    
    if (!name || !redirectURLs || !Array.isArray(redirectURLs) || redirectURLs.length === 0) {
      return NextResponse.json({ 
        error: 'invalid_request', 
        error_description: 'Name and redirectURLs array are required' 
      }, { status: 400 })
    }
    
    const existingClient = await betterAuth.database.findOne(betterAuth.oauthApplication?.modelName || 'oauthApplications', {
      where: { name }
    })
    
    if (existingClient) {
      return NextResponse.json({ 
        error: 'client_exists', 
        error_description: 'A client with this name already exists' 
      }, { status: 409 })
    }
    
    const clientId = crypto.randomBytes(16).toString('hex')
    const clientSecret = crypto.randomBytes(32).toString('hex')
    
    const client = await betterAuth.database.create(betterAuth.oauthApplication?.modelName || 'oauthApplications', {
      data: {
        name,
        clientId,
        clientSecret,
        redirectURLs: redirectURLs.join(', '),
        type,
        disabled: false,
        user: session.user.id,
      }
    })
    
    return NextResponse.json({
      id: client.id,
      name: client.name,
      clientId: client.clientId,
      clientSecret: client.clientSecret,
      redirectURLs: client.redirectURLs,
    })
  } catch (error) {
    console.error('Client registration error:', error)
    return NextResponse.json({ 
      error: 'server_error', 
      error_description: 'An error occurred registering the client' 
    }, { status: 500 })
  }
}
