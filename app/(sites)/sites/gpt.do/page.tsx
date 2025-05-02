import { requireAuthentication } from './action'
import { redirect, RedirectType } from 'next/navigation'

export default async function ChatPage() {
  // Use the server action to handle authentication
  await requireAuthentication()

  // If authentication passes, redirect to chat/new
  redirect('/chat/new', RedirectType.push)
}
