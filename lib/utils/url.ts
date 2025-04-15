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
  // Debug logging for INVALID_ORIGIN troubleshooting

  if (headers?.get('host')) {
    const host = headers.get('host')
    const protocol = host?.includes('localhost') ? 'http' : 'https'
    const url = `${protocol}://${host}`
    console.log('getCurrentURL debug - using host, protocol, and url:', url)
    return url
  }

  if (process.env.NODE_ENV === 'development') {
    console.log('getCurrentURL debug - using development URL: http://localhost:3000')
    return 'http://localhost:3000'
  }

  if (typeof window !== 'undefined') {
    console.log('getCurrentURL debug - using client-side window.location.origin:', window.location.origin)
    return window.location.origin
  }

  if (process.env.NEXT_PUBLIC_SERVER_URL) {
    console.log('getCurrentURL debug - using NEXT_PUBLIC_SERVER_URL:', process.env.NEXT_PUBLIC_SERVER_URL)
    return process.env.NEXT_PUBLIC_SERVER_URL
  }

  if (process.env.SITE_URL) {
    console.log('getCurrentURL debug - using SITE_URL:', process.env.SITE_URL)
    return process.env.SITE_URL
  }

  if (process.env.NEXT_PUBLIC_SITE_URL) {
    console.log('getCurrentURL debug - using NEXT_PUBLIC_SITE_URL:', process.env.NEXT_PUBLIC_SITE_URL)
    return process.env.NEXT_PUBLIC_SITE_URL
  }

  if (process.env.VERCEL_URL) {
    const url = `https://${process.env.VERCEL_URL}`
    console.log('getCurrentURL debug - using VERCEL_URL:', url)
    return url
  }

  if (process.env.NEXT_PUBLIC_VERCEL_URL) {
    const url = `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
    console.log('getCurrentURL debug - using NEXT_PUBLIC_VERCEL_URL:', url)
    return url
  }

  if (process.env.VERCEL_BRANCH_URL) {
    console.log('getCurrentURL debug - using VERCEL_BRANCH_URL:', process.env.VERCEL_BRANCH_URL)
    return process.env.VERCEL_BRANCH_URL
  }

  if (process.env.VERCEL_PREVIEW_URL) {
    console.log('getCurrentURL debug - using VERCEL_PREVIEW_URL:', process.env.VERCEL_PREVIEW_URL)
    return process.env.VERCEL_PREVIEW_URL
  }

  console.log('getCurrentURL debug - using fallback URL: https://apis.do')
  return 'https://apis.do'
}

/**
 * Returns the domain part of a URL
 * This is used for creating proper redirect URIs that work across multiple domains
 */
export const getDomainFromURL = (url?: string): string => {
  // Use the provided URL or get the current URL
  const currentUrl = url || getCurrentURL()

  try {
    // Extract just the hostname
    const urlObj = new URL(currentUrl)

    // Include port with domain if it exists, otherwise just return the hostname
    return urlObj.port ? `${urlObj.hostname}:${urlObj.port}` : urlObj.hostname
  } catch (e) {
    console.error('Error parsing URL:', e)
    return 'apis.do' // Fallback to default domain
  }
}

/**
 * Generates a proper OAuth callback URL for the current domain
 * Works across multiple domains (apis.do, workflows.do, etc.)
 */
export const getOAuthCallbackURL = (provider: string, url?: string): string => {
  const domain = getDomainFromURL(url)
  console.log('🚀 ~ getOAuthCallbackURL ~ domain:', domain)

  // Use localhost URL for development, otherwise use the detected domain
  if (domain === 'localhost' || domain.includes('localhost:')) {
    return `http://${domain}/api/auth/callback/${provider}`
  }

  return `https://${domain}/api/auth/callback/${provider}`
}
