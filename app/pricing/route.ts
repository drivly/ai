import { NextResponse } from 'next/server'

/**
 * Special route handler for /pricing path
 * This ensures that /pricing is always redirected to /sites/functions.do/pricing
 * regardless of the hostname or environment
 */
export async function GET() {
  console.log('Direct route handler for /pricing path')
  return NextResponse.redirect(new URL('/sites/functions.do/pricing', 'https://functions.do'))
}
