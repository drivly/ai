/**
 * Gets the current URL based on the execution environment
 * Supports request headers, Vercel preview deployments, client-side detection, and fallbacks
 * Handles all possible URL patterns for Vercel deployments including:
 * - Standard pattern: ai-git-{branch-name}.dev.driv.ly
 * - Short hash pattern: ai-kexlbudi2.dev.driv.ly
 * 
 * This function is critical for OAuth proxy configuration to ensure
 * authentication works correctly across all environments.
 */
export const getCurrentURL = (headers?: Headers) => {
  const traceId = Math.random().toString(36).substring(2, 8)
  console.log(`[URL:${traceId}] getCurrentURL called with headers:`, headers ? 'Headers present' : 'No headers')
  
  if (headers?.get('host')) {
    const host = headers.get('host')
    const protocol = host?.includes('localhost') ? 'http' : 'https'
    const url = `${protocol}://${host}`
    console.log(`[URL:${traceId}] Using host from headers: ${host}, returning: ${url}`)
    return url
  }

  if (typeof window !== 'undefined') {
    const url = window.location.origin
    console.log(`[URL:${traceId}] Using client-side window.location.origin: ${url}`)
    return url
  }

  console.log(`[URL:${traceId}] Environment variables:`, {
    NEXT_PUBLIC_SERVER_URL: process.env.NEXT_PUBLIC_SERVER_URL,
    SITE_URL: process.env.SITE_URL,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    VERCEL_URL: process.env.VERCEL_URL,
    NEXT_PUBLIC_VERCEL_URL: process.env.NEXT_PUBLIC_VERCEL_URL,
    VERCEL_BRANCH_URL: process.env.VERCEL_BRANCH_URL,
    VERCEL_PREVIEW_URL: process.env.VERCEL_PREVIEW_URL,
    NODE_ENV: process.env.NODE_ENV
  })

  if (process.env.NEXT_PUBLIC_SERVER_URL) {
    console.log(`[URL:${traceId}] Using NEXT_PUBLIC_SERVER_URL: ${process.env.NEXT_PUBLIC_SERVER_URL}`)
    return process.env.NEXT_PUBLIC_SERVER_URL
  }
  if (process.env.SITE_URL) {
    console.log(`[URL:${traceId}] Using SITE_URL: ${process.env.SITE_URL}`)
    return process.env.SITE_URL
  }
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    console.log(`[URL:${traceId}] Using NEXT_PUBLIC_SITE_URL: ${process.env.NEXT_PUBLIC_SITE_URL}`)
    return process.env.NEXT_PUBLIC_SITE_URL
  }

  if (process.env.VERCEL_URL) {
    const url = `https://${process.env.VERCEL_URL}`
    console.log(`[URL:${traceId}] Using VERCEL_URL: ${url}`)
    return url
  }
  if (process.env.NEXT_PUBLIC_VERCEL_URL) {
    const url = `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
    console.log(`[URL:${traceId}] Using NEXT_PUBLIC_VERCEL_URL: ${url}`)
    return url
  }
  if (process.env.VERCEL_BRANCH_URL) {
    console.log(`[URL:${traceId}] Using VERCEL_BRANCH_URL: ${process.env.VERCEL_BRANCH_URL}`)
    return process.env.VERCEL_BRANCH_URL
  }
  if (process.env.VERCEL_PREVIEW_URL) {
    console.log(`[URL:${traceId}] Using VERCEL_PREVIEW_URL: ${process.env.VERCEL_PREVIEW_URL}`)
    return process.env.VERCEL_PREVIEW_URL
  }
  
  if (process.env.NODE_ENV === 'development') {
    console.log(`[URL:${traceId}] Using development fallback: http://localhost:3000`)
    return 'http://localhost:3000'
  }

  console.log(`[URL:${traceId}] Using production fallback: https://apis.do`)
  return 'https://apis.do'
}
