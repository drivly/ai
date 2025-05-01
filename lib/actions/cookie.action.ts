'use server'

import { cookies } from 'next/headers'
import { EXPIRATION_TIMES, getExpirationDate } from '../utils/cookie'

export async function deleteCookies(data: string[]) {
  const cookieStore = await cookies()
  data.map((cookie) => (cookieStore.get(cookie) ? cookieStore.delete(cookie) : null))
  return true
}

export async function getCookie(name: string) {
  try {
    const cookieStore = await cookies()
    const storedCookie = cookieStore.get(name)

    // For auth tokens, don't try to parse them as JSON
    if (name === 'authjs.session-token' || name === '__Secure-authjs.session-token') {
      return storedCookie?.value || null
    }

    // For other cookies that actually contain JSON
    return storedCookie?.value ? JSON.parse(storedCookie.value) : []
  } catch (error) {
    console.error(`Error reading ${name} cookie:`, error)
    return []
  }
}

export const setCookie = async (
  name: string,
  value: string,
  options?: {
    expiration?: number // in milliseconds
    path?: string
    sameSite?: 'strict' | 'lax' | 'none'
    secure?: boolean
    httpOnly?: boolean
    maxAge?: number
  },
) => {
  try {
    const cookieStore = await cookies()
    const storedCookie = await getCookie(name)
    const expiration = options?.expiration || EXPIRATION_TIMES.ONE_YEAR

    // Add current position if not already applied
    if (!storedCookie.includes(value)) {
      storedCookie.push(value)
    }

    // Set cookie with updated positions - expires in 1 year
    cookieStore.set(name, JSON.stringify(storedCookie), {
      expires: getExpirationDate(expiration),
      path: options?.path || '/',
      sameSite: options?.sameSite || 'lax',
      secure: options?.secure ?? process.env.NODE_ENV === 'production',
      httpOnly: options?.httpOnly ?? true,
      maxAge: options?.maxAge,
    })

    return true
  } catch (error) {
    console.error(`Failed to set ${name} cookie:`, error)
    return false
  }
}
