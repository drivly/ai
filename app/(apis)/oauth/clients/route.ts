import { NextRequest, NextResponse } from 'next/server'
import { API } from '@/lib/api'
import { getPayload } from '@/lib/auth/payload-auth'
import fs from 'fs'
import path from 'path'

const OAUTH_CLIENTS_FILE = path.join(process.cwd(), 'data', 'oauth-clients.json')

const loadOAuthClients = (): any[] => {
  const dataDir = path.join(process.cwd(), 'data')
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true })
  }
  
  if (!fs.existsSync(OAUTH_CLIENTS_FILE)) {
    return []
  }
  
  try {
    const data = fs.readFileSync(OAUTH_CLIENTS_FILE, 'utf8')
    return JSON.parse(data)
  } catch (error) {
    console.error('Error loading OAuth clients:', error)
    return []
  }
}

export async function GET(request: NextRequest) {
  try {
    const payload = await getPayload()
    const { betterAuth } = payload
    const session = await betterAuth.api.getSession({ headers: request.headers })
    
    if (!session?.user) {
      return NextResponse.json({ 
        error: 'unauthorized', 
        error_description: 'Authentication required' 
      }, { status: 401 })
    }
    
    const userDoc = await payload.findByID({
      collection: 'users',
      id: session.user.id,
    })
    
    if (!userDoc || userDoc.role !== 'admin') {
      return NextResponse.json({ 
        error: 'forbidden', 
        error_description: 'Admin access required' 
      }, { status: 403 })
    }
    
    const clients = loadOAuthClients()
    
    const maskedClients = clients.map(client => ({
      ...client,
      clientSecret: client.clientSecret 
        ? '****' + client.clientSecret.substring(client.clientSecret.length - 4) 
        : '',
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
