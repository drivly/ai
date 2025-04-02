/**
 * Gets the current URL based on the execution environment
 * Supports request headers, Vercel preview deployments, client-side detection, and fallbacks
 * Properly handles gateway domains like do.com.ai
 */
export const getCurrentURL = (headers?: Headers) => {
  if (headers?.get('host')) {
    const host = headers.get('host')
    return `https://${host}`
  }
  
  if (typeof window !== 'undefined') return window.location.origin
  
  if (process.env.NEXT_PUBLIC_SERVER_URL) return process.env.NEXT_PUBLIC_SERVER_URL
  if (process.env.SITE_URL) return process.env.SITE_URL
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL
  
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`
  if (process.env.NEXT_PUBLIC_VERCEL_URL) return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
  if (process.env.VERCEL_BRANCH_URL) return process.env.VERCEL_BRANCH_URL
  if (process.env.VERCEL_PREVIEW_URL) return process.env.VERCEL_PREVIEW_URL
  
  return 'https://apis.do'
}
