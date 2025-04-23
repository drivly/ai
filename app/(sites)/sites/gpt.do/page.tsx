import { auth } from '@/auth'
import { getCurrentURL } from '@/lib/utils/url'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function ChatPage() {
  const session = await auth()

  if (!session) {
    const headersList = await headers()
    const currentURL = getCurrentURL(headersList)
    const callbackUrl = new URL('/gpt.do/chat/new', currentURL).toString()
    const githubSignInUrl = new URL('/api/auth/signin/github', currentURL)
    githubSignInUrl.searchParams.set('callbackUrl', callbackUrl)

    redirect(githubSignInUrl.toString())
  }

  redirect('/gpt.do/chat/new')
}
