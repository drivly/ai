/**
 * Gets the current URL based on the execution environment
 * Supports Vercel preview deployments, client-side detection, and fallbacks
 */
export const getCurrentURL = () => {
  if (typeof window !== 'undefined') return window.location.origin // Client-side detection
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`
  if (process.env.NEXT_PUBLIC_VERCEL_URL) return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
  if (process.env.VERCEL_BRANCH_URL) return process.env.VERCEL_BRANCH_URL
  if (process.env.VERCEL_PREVIEW_URL) return process.env.VERCEL_PREVIEW_URL
  return process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || 'https://apis.do'
}
