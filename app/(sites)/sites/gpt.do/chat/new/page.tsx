import { redirect, RedirectType } from 'next/navigation'
import { requireAuthentication, getGptPath } from '../../gpt.action'

export default async function NewChatPage() {
  await requireAuthentication()

  const newChatId = crypto.randomUUID()
  const redirectPath = await getGptPath(`/chat/${newChatId}`)

  redirect(redirectPath, RedirectType.push)
}
