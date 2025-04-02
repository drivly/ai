import { NextResponse, NextRequest } from 'next/server'
import { getCurrentURL } from '../../../lib/utils/url'

export async function GET(request: NextRequest) {
  return NextResponse.redirect(new URL('/api/auth/signin/github?callbackUrl=/admin', getCurrentURL(request.headers)))
}
