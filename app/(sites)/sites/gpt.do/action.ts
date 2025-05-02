'use server'

import { serverAuth } from '@/hooks/server-auth'
import { getCurrentURL } from '@/lib/utils/url'
import { headers } from 'next/headers'
import { redirect, RedirectType } from 'next/navigation'

export const requireAuthentication = async () => {
  const user = await serverAuth()

  if (!user) {
    const headersList = await headers()
    const host = headersList.get('host') || ''
    const currentURL = getCurrentURL(headersList)

    // Determine if we're on the actual gpt.do domain or using HOSTNAME_OVERRIDE
    const isActualGptDomain = host === 'gpt.do' || (host === 'localhost:3000' && process.env.HOSTNAME_OVERRIDE === 'gpt.do')

    // Simple logic - two cases only
    const callbackPath = isActualGptDomain
      ? '/chat/new' // Direct path for gpt.do domain
      : '/sites/gpt.do/chat/new' // Path with site prefix for all other cases

    const callbackUrl = new URL(callbackPath, currentURL).toString()
    const githubSignInUrl = new URL('/login', currentURL)
    githubSignInUrl.searchParams.set('callbackUrl', callbackUrl)

    console.log('Auth redirect', {
      host,
      currentURL,
      isActualGptDomain,
      callbackPath,
      callbackUrl,
      redirect: githubSignInUrl.toString(),
    })

    redirect(githubSignInUrl.toString(), RedirectType.push)
  }
}
