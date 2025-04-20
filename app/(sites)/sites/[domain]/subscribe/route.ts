import { NextResponse } from 'next/server.js'

//
export async function GET(request: Request) {
  return NextResponse.redirect(new URL(`/sites/subscribe`, request.url))
}

// redirect to Stripe subscribe
// dynamic either pricing page stripe or credit card payment page

// Pre-paid
// 1 dollar credits on login
// Pay as you go page
