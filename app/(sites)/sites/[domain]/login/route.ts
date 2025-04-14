import { NextResponse, NextRequest } from 'next/server'
import { getCurrentURL } from '@/lib/utils/url'
import crypto from 'crypto'

export async function GET(request: NextRequest) {
  const baseURL = getCurrentURL(request.headers)
  const state = crypto.randomBytes(16).toString('hex')
  
  const redirectURI = process.env.NODE_ENV === 'production' 
    ? 'https://apis.do/api/auth/callback/github' 
    : 'http://localhost:3000/api/auth/callback/github'
  
  const githubAuthURL = new URL('https://github.com/login/oauth/authorize')
  githubAuthURL.searchParams.append('client_id', process.env.GITHUB_CLIENT_ID as string)
  githubAuthURL.searchParams.append('redirect_uri', redirectURI)
  githubAuthURL.searchParams.append('scope', 'user:email')
  githubAuthURL.searchParams.append('state', state)
  
  const response = NextResponse.redirect(githubAuthURL)
  
  response.cookies.set('github_oauth_state', state, { 
    httpOnly: true, 
    secure: process.env.NODE_ENV !== 'development',
    sameSite: 'lax',
    maxAge: 60 * 10 // 10 minutes
  })
  
  return response
}
