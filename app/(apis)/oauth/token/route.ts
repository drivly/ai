import { API } from '@/lib/api'
import { getPayload } from '@/lib/auth/payload-auth'
import fs from 'fs'
import path from 'path'
import crypto from 'crypto'

const OAUTH_CODES_FILE = path.join(process.cwd(), 'data', 'oauth-codes.json')
const OAUTH_CLIENTS_FILE = path.join(process.cwd(), 'data', 'oauth-clients.json')
const OAUTH_TOKENS_FILE = path.join(process.cwd(), 'data', 'oauth-tokens.json')

const ensureDataDir = () => {
  const dataDir = path.join(process.cwd(), 'data')
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true })
  }
}

interface OAuthCode {
  code: string;
  provider: string;
  redirectUri: string;
  userId: string;
  createdAt: string;
  expiresAt: string;
  used: boolean;
}

const loadOAuthCodes = (): OAuthCode[] => {
  ensureDataDir()
  if (!fs.existsSync(OAUTH_CODES_FILE)) {
    return []
  }
  
  try {
    const data = fs.readFileSync(OAUTH_CODES_FILE, 'utf8')
    return JSON.parse(data)
  } catch (error) {
    console.error('Error loading OAuth codes:', error)
    return []
  }
}

const saveOAuthCodes = (codes: OAuthCode[]) => {
  ensureDataDir()
  try {
    fs.writeFileSync(OAUTH_CODES_FILE, JSON.stringify(codes, null, 2))
  } catch (error) {
    console.error('Error saving OAuth codes:', error)
  }
}

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

interface OAuthToken {
  id: string;
  accessToken: string;
  refreshToken: string;
  clientId: string;
  userId: string;
  scope: string;
  createdAt: string;
  accessTokenExpiresAt: string;
  refreshTokenExpiresAt: string;
}

const loadOAuthTokens = (): OAuthToken[] => {
  ensureDataDir()
  if (!fs.existsSync(OAUTH_TOKENS_FILE)) {
    return []
  }
  
  try {
    const data = fs.readFileSync(OAUTH_TOKENS_FILE, 'utf8')
    return JSON.parse(data)
  } catch (error) {
    console.error('Error loading OAuth tokens:', error)
    return []
  }
}

const saveOAuthTokens = (tokens: OAuthToken[]) => {
  ensureDataDir()
  try {
    fs.writeFileSync(OAUTH_TOKENS_FILE, JSON.stringify(tokens, null, 2))
  } catch (error) {
    console.error('Error saving OAuth tokens:', error)
  }
}

const exchangeCodeForToken = async (code: string, redirectUri: string, clientId: string, clientSecret?: string) => {
  const codes = loadOAuthCodes()
  const clients = loadOAuthClients()
  
  const codeEntry = codes.find((c: OAuthCode) => c.code === code && !c.used)
  if (!codeEntry) {
    throw new Error('Invalid authorization code')
  }
  
  const expiresAt = new Date(codeEntry.expiresAt)
  if (expiresAt < new Date()) {
    throw new Error('Authorization code expired')
  }
  
  const client = clients.find((c: OAuthClient) => c.clientId === clientId)
  if (!client) {
    throw new Error('Invalid client ID')
  }
  
  if (clientSecret && client.clientSecret !== clientSecret) {
    throw new Error('Invalid client secret')
  }
  
  if (redirectUri && codeEntry.redirectUri !== redirectUri) {
    throw new Error('Redirect URI mismatch')
  }
  
  codeEntry.used = true
  saveOAuthCodes(codes)
  
  const accessToken = crypto.randomBytes(32).toString('hex')
  const refreshToken = crypto.randomBytes(32).toString('hex')
  
  const accessTokenExpiresAt = new Date()
  accessTokenExpiresAt.setHours(accessTokenExpiresAt.getHours() + 1)
  
  const refreshTokenExpiresAt = new Date()
  refreshTokenExpiresAt.setDate(refreshTokenExpiresAt.getDate() + 30)
  
  const token = {
    id: crypto.randomUUID(),
    accessToken,
    refreshToken,
    clientId,
    userId: codeEntry.userId,
    scope: 'read write',
    createdAt: new Date().toISOString(),
    accessTokenExpiresAt: accessTokenExpiresAt.toISOString(),
    refreshTokenExpiresAt: refreshTokenExpiresAt.toISOString()
  }
  
  const tokens = loadOAuthTokens()
  tokens.push(token)
  saveOAuthTokens(tokens)
  
  return {
    access_token: accessToken,
    token_type: 'Bearer',
    expires_in: 3600,
    refresh_token: refreshToken,
    scope: 'read write'
  }
}

export const POST = API(async (request, { url }) => {
  let body: any = {}
  const contentType = request.headers.get('content-type') || ''
  
  if (contentType.includes('application/json')) {
    body = await request.json()
  } else {
    const formData = await request.formData()
    for (const [key, value] of formData.entries()) {
      body[key] = value
    }
  }
  
  const { 
    grant_type, 
    code, 
    redirect_uri, 
    client_id, 
    client_secret 
  } = body
  
  if (!grant_type || !code || !client_id) {
    return { 
      error: 'invalid_request', 
      error_description: 'Missing required parameters' 
    }
  }
  
  if (grant_type !== 'authorization_code') {
    return { 
      error: 'unsupported_grant_type', 
      error_description: 'Only authorization_code grant type is supported' 
    }
  }
  
  try {
    const token = await exchangeCodeForToken(code, redirect_uri, client_id, client_secret)
    return token
  } catch (error) {
    console.error('Token exchange error:', error)
    return { 
      error: 'invalid_grant', 
      error_description: 'Invalid authorization code or client credentials' 
    }
  }
})
