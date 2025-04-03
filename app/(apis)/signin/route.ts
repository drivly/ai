import { NextResponse, NextRequest } from 'next/server'
import { getCurrentURL } from '@/lib/utils/url'
import { API } from '@/lib/api'

export const GET = API(async (request: NextRequest) => {
  const currentURL = getCurrentURL(request.headers)
  const hostname = request.headers.get('host') || ''
  const callbackUrl = hostname.endsWith('.do') && !hostname.includes('apis.do') ? 
    `/admin/collections/${hostname.replace('.do', '')}` : 
    '/admin'
  
  return NextResponse.redirect(new URL(`/api/auth/signin/github?callbackUrl=${callbackUrl}`, currentURL))
})
