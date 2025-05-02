import { requireAuthentication } from './action'
import { redirect, RedirectType } from 'next/navigation'
import { headers } from 'next/headers'

export default async function ChatPage() {
  await requireAuthentication()

  const headersList = await headers()
  const host = headersList.get('host') || ''

  const isActualGptDomain = host === 'gpt.do' || (host === 'localhost:3000' && process.env.HOSTNAME_OVERRIDE === 'gpt.do')

  const redirectPath = isActualGptDomain
    ? '/chat/new' // Direct path for gpt.do domain
    : '/sites/gpt.do/chat/new' // Path with site prefix for all other domains

  redirect(redirectPath, RedirectType.push)
}
