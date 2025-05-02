import { requireAuthentication } from '../../action'
import { redirect, RedirectType } from 'next/navigation'

export default async function NewChatPage() {
  // Use the server action to handle authentication
  await requireAuthentication()

  // Generate new chat ID and redirect
  const newChatId = crypto.randomUUID()
  redirect(`/chat/${newChatId}`, RedirectType.push)
}
