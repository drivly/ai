import { auth } from '@/auth'
import { Chat } from '@/components/chat/chat'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { requireAuthentication } from '../../gpt.action'

const DEFAULT_CHAT_MODEL = 'openai/gpt-4.1'

async function ChatPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAuthentication()

  const session = await auth()

  const { id } = await params

  const cookieStore = await cookies()
  const chatModelFromCookie = cookieStore.get('chat-model')

  if (!session) {
    redirect('/login')
  }

  if (!chatModelFromCookie) {
    return <Chat id={id} initialChatModel={DEFAULT_CHAT_MODEL} initialVisibilityType='private' session={session} />
  }

  return <Chat id={id} initialChatModel={chatModelFromCookie.value} initialVisibilityType='private' session={session} />
}
export default ChatPage
