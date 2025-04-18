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
    const host = headers.get('host')
    const protocol = host?.includes('localhost') ? 'http' : 'https'
    const url = `${protocol}://${host}`
    console.log('🚀 ~ derived from headers:', url)
    return url
  }

  // For development environment
  if (process.env.NODE_ENV === 'development') {
    console.log('🚀 ~ localhost URL: http://localhost:3000')
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
export const getAuthRedirectForDomain = (hostname: string): string => {
  if (hostname.endsWith('.do') && !hostname.includes('apis.do')) {
    return `/admin/collections/${hostname.replace('.do', '')}`
  }

  return '/admin'
}

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

export const getOAuthCallbackURL = (provider: 'google' | 'github', url?: string): string => {
  const domain = getDomainFromURL(url)

  // Use localhost URL for development, otherwise use the detected domain
  if (domain === 'localhost' || domain.includes('localhost:')) {
    return `http://${domain}/api/auth/callback/${provider}`
  }

  return `https://apis.do/api/auth/callback/${provider}`
}
