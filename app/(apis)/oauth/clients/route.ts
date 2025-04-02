import { API } from '@/lib/api'
import { getPayload } from '@/lib/auth/payload-auth'
import fs from 'fs'
import path from 'path'

const OAUTH_CLIENTS_FILE = path.join(process.cwd(), 'data', 'oauth-clients.json')

interface OAuthClient {
  id: string;
  name: string;
  clientId: string;
  clientSecret: string;
  redirectURLs: string[];
  createdBy: string;
  createdAt: string;
  disabled: boolean;
}

const loadOAuthClients = (): OAuthClient[] => {
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
    const clients = loadOAuthClients()
    
    const maskedClients = clients.map((client: OAuthClient) => ({
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
