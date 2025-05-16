import type { UIMessage } from 'ai'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useRef } from 'react'
import { useChatHistory } from '../hooks/use-chat-history'
import type { SearchOption } from '../lib/types'
import { resolvePathname } from '../lib/utils'

interface ChatRedirectProps {
  chatId: string
  isNewChat: boolean
  selectedModel: SearchOption
  initialDefaultMessages: UIMessage[]
}

export function ChatRedirect({ chatId, isNewChat, selectedModel, initialDefaultMessages }: ChatRedirectProps) {
  const router = useRouter()
  const pathname = usePathname()

  const { addChatSession, updateChatMessages, updateChatSession, getChatSession } = useChatHistory()
  const lastMessageCount = useRef(0)
  const initialized = useRef(false)

  useEffect(() => {
    if (isNewChat && initialDefaultMessages.length > 0 && chatId === 'new') {
      console.log('Creating new chat with messages:', initialDefaultMessages.length)
      const newChatId = crypto.randomUUID()

      // Create new chat session in localStorage
      addChatSession(newChatId, selectedModel)

      const newPath = resolvePathname(pathname) + `/${newChatId}`

      console.log('Redirecting to new chat path:', newPath)
      router.replace(newPath)
    }
  }, [chatId, isNewChat, initialDefaultMessages.length, pathname, router, addChatSession, selectedModel])

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
    if (initialDefaultMessages.length > 0 && initialDefaultMessages.length !== lastMessageCount.current) {
      lastMessageCount.current = initialDefaultMessages.length
      updateChatMessages(chatId, initialDefaultMessages)
    }
  }, [chatId, initialDefaultMessages, updateChatMessages])

  return null
}
