import { NextRequest, NextResponse } from 'next/server'
import { API } from '@/lib/api'
import { getPayload } from '@/lib/auth/payload-auth'
import crypto from 'crypto'
import fs from 'fs'
import path from 'path'

const OAUTH_CLIENTS_FILE = path.join(process.cwd(), 'data', 'oauth-clients.json')

const ensureDataDir = () => {
  const dataDir = path.join(process.cwd(), 'data')
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true })
  }
}

const loadOAuthClients = () => {
  ensureDataDir()
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

const saveOAuthClients = (clients: any[]) => {
  ensureDataDir()
  try {
    fs.writeFileSync(OAUTH_CLIENTS_FILE, JSON.stringify(clients, null, 2))
  } catch (error) {
    console.error('Error saving OAuth clients:', error)
  }
}

export async function POST(request: NextRequest) {
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
    
    const body = await request.json()
    const { name, redirectURLs, type = 'web' } = body
    
    if (!name || !redirectURLs || !Array.isArray(redirectURLs) || redirectURLs.length === 0) {
      return NextResponse.json({ 
        error: 'invalid_request', 
        error_description: 'Name and redirectURLs array are required' 
      }, { status: 400 })
    }
    
    const clients = loadOAuthClients()
    
    const existingClient = clients.find((client: any) => client.name === name)
    if (existingClient) {
      return NextResponse.json({ 
        error: 'client_exists', 
        error_description: 'A client with this name already exists' 
      }, { status: 409 })
    }
    
    const clientId = crypto.randomBytes(16).toString('hex')
    const clientSecret = crypto.randomBytes(32).toString('hex')
    
    const client = {
      id: crypto.randomUUID(),
      name,
      clientId,
      clientSecret,
      redirectURLs: redirectURLs.join(', '),
      type,
      disabled: false,
      userId: session.user.id,
      createdAt: new Date().toISOString(),
    }
    
    clients.push(client)
    saveOAuthClients(clients)
    
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
