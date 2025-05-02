import { requireAuthentication } from '../../action'
import { redirect, RedirectType } from 'next/navigation'
import { headers } from 'next/headers'

export default async function NewChatPage() {
  await requireAuthentication()

  const newChatId = crypto.randomUUID()

  const headersList = await headers()
  const host = headersList.get('host') || ''

  const isActualGptDomain = host === 'gpt.do' || (host === 'localhost:3000' && process.env.HOSTNAME_OVERRIDE === 'gpt.do')

  const redirectPath = isActualGptDomain
    ? `/chat/${newChatId}` // Direct path for gpt.do domain
    : `/sites/gpt.do/chat/${newChatId}` // Path with site prefix for all other domains

  redirect(redirectPath, RedirectType.push)
}
