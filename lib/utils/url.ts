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
  // In server components or API routes where headers are available, use the host
  if (headers?.get('host')) {
    const proto = headers.get('x-forwarded-proto') || 'https'
    const host = headers.get('host')
    const url = `${proto}://${host}`
    console.log('🚀 ~ derived from headers:', url)
    return url
  }

  // For development environment
  if (process.env.NODE_ENV === 'development') {
    console.log('🚀 ~ localhost URL: http://localhost:3000')
    return 'http://localhost:3000'
  }

  if (process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL) {
    const url = `https://${process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}`
    console.log('🚀 ~ NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL:', url)
    return url
  }

  if (process.env.NEXT_PUBLIC_VERCEL_URL) {
    const url = `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
    console.log('🚀 ~ NEXT_PUBLIC_VERCEL_URL:', url)
    return url
  }

  // Fallback to primary API domain
  console.log('🚀 ~ fallback URL: https://apis.do')
  return 'https://apis.do'
}

/**
 * Gets the appropriate redirect path after authentication based on the domain
 */
export const getAuthRedirectForDomain = (hostname: string, destination: string) => {
  switch (destination) {
    case 'admin':
      if (hostname.endsWith('.do') && !hostname.includes('apis.do')) {
        return `/admin/collections/${hostname.replace('.do', '')}`
      }
      return '/admin'
    case 'waitlist':
      return '/waitlist'
    default:
      return '/'
  }
}

export const getOAuthCallbackURL = (provider: 'google' | 'github' | 'workos' | 'linear', url?: string): string => {
  if (process.env.NODE_ENV === 'development') {
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
    return `${baseUrl}/api/auth/callback/${provider}`
  }

  const baseUrl = url ? new URL(url).origin : getCurrentURL()
  return `${baseUrl}/api/auth/callback/${provider}`
}
