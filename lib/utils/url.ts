/**
 * Gets the current URL based on the execution environment
 * Supports request headers, Vercel preview deployments, client-side detection, and fallbacks
 * Handles all possible URL patterns for Vercel deployments including:
 * - Standard pattern: ai-git-{branch-name}.dev.driv.ly
 * - Short hash pattern: ai-kexlbudi2.dev.driv.ly
 */
export const getCurrentURL = (headers?: Headers) => {
  if (headers?.get('host')) return `https://${headers.get('host')}`
  
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
