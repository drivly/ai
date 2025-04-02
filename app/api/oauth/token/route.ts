import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from '../../../../lib/auth/payload-auth'
import fs from 'fs'
import path from 'path'
import crypto from 'crypto'

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

export async function POST(request: NextRequest) {
  try {
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
    
    const { grant_type, code, redirect_uri, client_id, client_secret } = body
    
    if (!grant_type || !code || !client_id) {
      return NextResponse.json({ 
        error: 'invalid_request', 
        error_description: 'Missing required parameters' 
      }, { status: 400 })
    }
    
    if (grant_type !== 'authorization_code') {
      return NextResponse.json({ 
        error: 'unsupported_grant_type', 
        error_description: 'Only authorization_code grant type is supported' 
      }, { status: 400 })
    }
    
    const clients = loadOAuthClients()
    
    if (client_secret) {
      const client = clients.find(c => c.clientId === client_id && c.clientSecret === client_secret)
      
      if (!client) {
        return NextResponse.json({ 
          error: 'invalid_client', 
          error_description: 'Invalid client credentials' 
        }, { status: 401 })
      }
    }
    
    const accessToken = crypto.randomBytes(32).toString('hex')
    const refreshToken = crypto.randomBytes(32).toString('hex')
    const expiresIn = 3600 // 1 hour
    
    return NextResponse.json({
      access_token: accessToken,
      token_type: 'Bearer',
      expires_in: expiresIn,
      refresh_token: refreshToken,
      scope: 'profile',
    })
  } catch (error) {
    console.error('Token exchange error:', error)
    return NextResponse.json({ 
      error: 'server_error', 
      error_description: 'An error occurred exchanging the token' 
    }, { status: 500 })
  }
}
