'use server'

import { jwtVerify } from 'jose'

const AUTH_SECRET = process.env.AUTH_SECRET 

// Verify a token is valid
export async function verifyToken(token: string) {
  try {
    const secret = new TextEncoder().encode(AUTH_SECRET)
    await jwtVerify(token, secret)
    return true
  } catch {
    return false
  }
}
