import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.redirect(new URL('/api/auth/signin/github?callbackUrl=/admin', process.env.NEXT_PUBLIC_SERVER_URL || 'https://apis.do'))
}
