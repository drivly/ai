import { NextResponse, NextRequest } from 'next/server'
import { getCurrentURL } from '@/lib/utils/url'
import { API } from '@/lib/api'

export const GET = API(async (request: NextRequest) => {
  const url = getCurrentURL(request.headers)
  const domain = new URL(url).hostname
  return NextResponse.redirect(new URL(`/api/auth/signin/github?callbackUrl=${encodeURIComponent(`/${domain}`)}`, url))
})
