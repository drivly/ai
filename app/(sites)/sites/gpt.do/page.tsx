import { requireAuthentication, getGptPath } from './gpt.action'
import { redirect, RedirectType } from 'next/navigation'

export default async function ChatPage() {
  await requireAuthentication()

  const redirectPath = await getGptPath('/chat/new')

  redirect(redirectPath, RedirectType.push)
}
