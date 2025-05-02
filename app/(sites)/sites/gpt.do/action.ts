'use server'

import { serverAuth } from '@/hooks/server-auth'
import { getCurrentURL } from '@/lib/utils/url'
import { headers } from 'next/headers'
import { redirect, RedirectType } from 'next/navigation'

export const requireAuthentication = async () => {
  const user = await serverAuth()

  if (!user) {
    const headersList = await headers()
    const currentURL = getCurrentURL(headersList)
    const callbackUrl = new URL('/chat/new', currentURL).toString()
    const githubSignInUrl = new URL('/login', currentURL)
    githubSignInUrl.searchParams.set('callbackUrl', callbackUrl)

    redirect(githubSignInUrl.toString(), RedirectType.push)
  }
}
