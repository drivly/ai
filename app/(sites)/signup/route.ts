import { NextResponse } from 'next/server'
import { getCurrentURL } from '../../../lib/utils/url'

export async function GET() {
  return NextResponse.redirect(new URL('/api/auth/signin/github?callbackUrl=/admin', getCurrentURL()))
}
