import { API } from '@/lib/api'
import { getPayload } from '@/lib/auth/payload-auth'
import crypto from 'crypto'
import fs from 'fs'
import path from 'path'

const OAUTH_CODES_FILE = path.join(process.cwd(), 'data', 'oauth-codes.json')

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

const generateAuthCode = async (provider: string, redirectUri: string, userId: string) => {
  const code = crypto.randomBytes(16).toString('hex')
  const codes = loadOAuthCodes()
  
  const expiresAt = new Date()
  expiresAt.setMinutes(expiresAt.getMinutes() + 10)
  
  codes.push({
    code,
    provider,
    redirectUri,
    userId,
    createdAt: new Date().toISOString(),
    expiresAt: expiresAt.toISOString(),
    used: false
  })
  
  saveOAuthCodes(codes)
  return code
}

export const GET = API(async (request, { url, user }) => {
  const provider = url.searchParams.get('provider')
  const redirectUri = url.searchParams.get('redirect_uri')
  const state = url.searchParams.get('state')
  
  if (!provider) {
    return { error: 'invalid_request', error_description: 'Missing provider parameter' }
  }
  
  if (!redirectUri) {
    return { error: 'invalid_request', error_description: 'Missing redirect_uri parameter' }
  }
  
  const payload = await getPayload()
  
  if (user) {
    const code = await generateAuthCode(provider, redirectUri, user.id)
    
    const redirectUrl = new URL(redirectUri)
    redirectUrl.searchParams.set('code', code)
    if (state) {
      redirectUrl.searchParams.set('state', state)
    }
    
    return { redirect: redirectUrl.toString() }
  } else {
    const loginUrl = new URL('/api/auth/login', url.origin)
    
    const oauthState = JSON.stringify({
      provider,
      redirect_uri: redirectUri,
      state
    })
    
    loginUrl.searchParams.set('redirect', `/api/oauth?provider=${provider}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${state ? encodeURIComponent(state) : ''}`)
    
    return { redirect: loginUrl.toString() }
  }
})
