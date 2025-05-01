'use client'

import { useRouter } from 'next/navigation'
import { ReactNode, useEffect } from 'react'
import { ChatProvider as ChatProviderContext, useChatMessages } from './context'

export function ChatProvider({ children, chatId, selectedModel }: { children: ReactNode; chatId: string; selectedModel: string }) {
  const isNewChat = chatId === 'new'
  console.log('ChatProvider initialized with chatId:', chatId)

  return (
    <ChatProviderContext chatId={chatId} selectedModel={selectedModel}>
      <ChatRedirect chatId={chatId} isNewChat={isNewChat}>
        {children}
      </ChatRedirect>
    </ChatProviderContext>
  )
}

function ChatRedirect({ children, chatId, isNewChat }: { children: ReactNode; chatId: string; isNewChat: boolean }) {
  const router = useRouter()
  const { messages } = useChatMessages()

  useEffect(() => {
    if (isNewChat && messages.length > 0 && chatId === 'new') {
      console.log('Creating new chat with messages:', messages.length)
      try {
        const newChatId = crypto.randomUUID()
        const pathname = window.location.pathname
        let newPath = ''

        if (pathname.startsWith('/gpt.do')) {
          newPath = `/gpt.do/chat/${newChatId}`
        } else if (pathname.startsWith('/chat-ui')) {
          newPath = `/chat-ui/chat/${newChatId}`
        } else {
          newPath = `/chat/${newChatId}`
        }

        console.log('Redirecting to new chat path:', newPath)
        router.replace(newPath)
      } catch (error) {
        console.error('Error redirecting to new chat:', error)
      }
    }
  }, [isNewChat, messages.length, chatId, router])

  return <>{children}</>
}
