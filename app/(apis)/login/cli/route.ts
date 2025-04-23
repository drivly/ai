import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const state = searchParams.get('state')
  const callback = searchParams.get('callback')

  if (!state || !callback) {
    return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 })
  }

  try {
    return NextResponse.redirect(new URL(`/cli/auth?state=${state}&callback=${encodeURIComponent(callback)}`, request.url))
  } catch (error) {
    console.error('Error during CLI login:', error)
    return NextResponse.json(
      { error: 'Failed to process CLI login', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
