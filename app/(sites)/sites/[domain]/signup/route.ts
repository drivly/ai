import { NextResponse, NextRequest } from 'next/server'
import { getCurrentURL } from '@/lib/utils/url'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ domain: string }> }
) {
  const { domain } = await params
  return NextResponse.redirect(new URL(`/api/auth/signin/github?callbackUrl=${encodeURIComponent(`/sites/${domain}`)}`, getCurrentURL(request.headers)))
}

// github login
