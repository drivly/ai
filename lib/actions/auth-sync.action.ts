'use server'

import { domains } from '@/.velite'
import { cookies, headers } from 'next/headers'

const trustedDomains = domains.map((domain) => domain.domain)

/**
 * Server action that retrieves the auth token and syncs it to other domains
 * This bypasses CORS restrictions since the requests happen server-side
 */
export async function syncAuthToken() {
  try {
    // Get the token from cookies
    const cookieStore = await cookies()

    // Check for both production and development token names
    let token = cookieStore.get('__Secure-authjs.session-token')?.value
    if (!token) {
      token = cookieStore.get('authjs.session-token')?.value
    }

    if (!token) {
      return { success: false, error: 'No auth token found' }
    }

    const headersList = await headers()
    const currentDomain = headersList.get('host') || ''

    // Sync to all domains except current one
    const results = await Promise.allSettled(
      trustedDomains.map(async (domain) => {
        // Skip current domain
        if (currentDomain.includes(domain)) return true

        // Server-side request bypasses CORS
        const response = await fetch(`https://${domain}/authsync`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            token,
            isProduction: process.env.NODE_ENV === 'production',
          }),
        })

        if (!response.ok) {
          throw new Error(`Failed to sync to ${domain}: ${response.status}`)
        }

        return true
      }),
    )

    // Check if all syncs were successful
    const allSuccessful = results.every((result) => result.status === 'fulfilled' && result.value === true)

    return {
      success: true,
      allSuccessful,
      results: results.map((r) => r.status),
    }
  } catch (error) {
    console.error('Auth token sync failed:', error)
    return { success: false, error: String(error) }
  }
}
