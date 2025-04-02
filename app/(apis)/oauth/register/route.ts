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
    
    const clients = loadOAuthClients()
    
    const client = {
      id: crypto.randomUUID(),
      name,
      clientId,
      clientSecret,
      redirectURLs,
      createdBy: user.id,
      createdAt: new Date().toISOString(),
      disabled: false
    }
    
    clients.push(client)
    saveOAuthClients(clients)
    
    return { success: true, ...client }
  } catch (error) {
    console.error('Client registration error:', error)
    return { error: 'server_error', error_description: 'An error occurred registering the client' }
  }
})
