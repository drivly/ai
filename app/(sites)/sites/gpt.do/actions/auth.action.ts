'use server'

import { redirect, RedirectType } from 'next/navigation'
import { serverAuth } from '@/hooks/server-auth'
import { getCurrentURL } from '@/lib/utils/url'
import { headers } from 'next/headers'

/**
 * Determines if the current request is on the actual gpt.do domain
 */
export async function isGptDomain() {
  const headersList = await headers()
  const host = headersList.get('host') || ''

  // Check if we're on the actual gpt.do domain or using HOSTNAME_OVERRIDE
  return host === 'gpt.do' || (host === 'localhost:3000' && process.env.HOSTNAME_OVERRIDE === 'gpt.do')
}

/**
 * Returns the appropriate path based on whether we're on the gpt.do domain or not
 * @param basePath The path without the site prefix
 * @returns The path with or without the site prefix based on the domain
 */
export async function getGptPath(basePath: string) {
  const isActualGptDomain = await isGptDomain()

  // If we're on gpt.do, use the direct path, otherwise add the site prefix
  return isActualGptDomain
    ? basePath // Direct path for gpt.do domain
    : `/sites/gpt.do${basePath}` // Path with site prefix for all other domains
}

export const requireAuthentication = async () => {
  const user = await serverAuth()

  if (!user) {
    const headersList = await headers()
    const currentURL = getCurrentURL(headersList)

    // Use the new function to get the callback path
    const callbackPath = await getGptPath('/chat/new')

    const callbackUrl = new URL(callbackPath, currentURL).toString()
    const githubSignInUrl = new URL('/login', currentURL)
    githubSignInUrl.searchParams.set('callbackUrl', callbackUrl)

    console.log('Auth redirect', {
      currentURL,
      callbackPath,
      callbackUrl,
      redirect: githubSignInUrl.toString(),
    })

    redirect(githubSignInUrl.toString(), RedirectType.push)
  }
}
