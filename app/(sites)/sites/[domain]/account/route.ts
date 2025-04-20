import { getCurrentURL } from '@/lib/utils/url'
import { NextRequest, NextResponse } from 'next/server.js'

// stripe account page
export async function GET(request: NextRequest) {
  return NextResponse.redirect(new URL('/api/auth/signin/github?callbackUrl=/admin', getCurrentURL(request.headers)))
}
