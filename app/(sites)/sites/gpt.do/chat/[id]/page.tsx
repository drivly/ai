import { Chat } from '@/components/chat/chat'
import { cookies } from 'next/headers'
import { requireAuthentication } from '../../action'

const DEFAULT_CHAT_MODEL = 'openai/gpt-4.1'

async function ChatPage({ params }: { params: Promise<{ id: string }> }) {
  // Use the server action to handle authexport default entication
  await requireAuthentication()

  const { id } = await params

  const cookieStore = await cookies()
  const chatModelFromCookie = cookieStore.get('chat-model')

  if (!chatModelFromCookie) {
    return <Chat id={id} model={DEFAULT_CHAT_MODEL} />
  }

  return <Chat id={id} model={chatModelFromCookie.value} />
}
export default ChatPage
