import { useChatHistory } from '@/components/chat/use-chat-history'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useRef } from 'react'
import { useChatMessages } from './context'
import { resolvePathname } from './utils'

export function ChatRedirect({ chatId, isNewChat, selectedModel }: { chatId: string; isNewChat: boolean; selectedModel: string }) {
  const router = useRouter()
  const pathname = usePathname()
  const { messages } = useChatMessages()
  const { addChatSession, updateChatMessages, updateChatSession, getChatSession } = useChatHistory()
  const lastMessageCount = useRef(0)
  const initialized = useRef(false)

  useEffect(() => {
    if (isNewChat && messages.length > 0 && chatId === 'new') {
      console.log('Creating new chat with messages:', messages.length)
      const newChatId = crypto.randomUUID()

      // Create new chat session in localStorage
      addChatSession(newChatId, selectedModel)

      const newPath = resolvePathname(pathname) + `/${newChatId}`

      console.log('Redirecting to new chat path:', newPath)
      router.replace(newPath)
    }
  }, [chatId, isNewChat, messages.length, pathname, router, addChatSession, selectedModel])

  // Initialize existing chat session or update model if needed
  useEffect(() => {
    if (chatId === 'new' || initialized.current) return

    initialized.current = true
    const existingSession = getChatSession(chatId)

    if (!existingSession) {
      addChatSession(chatId, selectedModel)
    } else if (existingSession.model !== selectedModel) {
      updateChatSession(chatId, { model: selectedModel })
    }
  }, [chatId, selectedModel, addChatSession, getChatSession, updateChatSession])

  // Persist messages to localStorage
  useEffect(() => {
    if (chatId === 'new') return

    // Only update if messages have actually changed
    if (messages.length > 0 && messages.length !== lastMessageCount.current) {
      lastMessageCount.current = messages.length
      updateChatMessages(chatId, messages)
    }
  }, [chatId, messages, updateChatMessages])

  return null
}
