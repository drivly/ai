'use client'

import { useChatHistory } from '@/components/chat/use-chat-history'
import { UIMessage } from 'ai'
import { ChatRedirect } from './chat-redirect'
import { ChatProvider, ChatProviderProps } from './context'

interface ChatWrapperProps extends Omit<ChatProviderProps, 'initialMessages'> {
  initialDefaultMessages?: Array<UIMessage>
}

export function ChatWrapper({ children, chatId, selectedModel, initialVisibilityType, initialDefaultMessages }: ChatWrapperProps) {
  const isNewChat = chatId === 'new'
  const { getChatSession } = useChatHistory()
  console.log('ChatWrapper initialized with chatId:', chatId)

  // Get existing messages from localStorage for this chat (if any)
  const existingSession = !isNewChat ? getChatSession(chatId) : null
  const initialMessages = existingSession?.messages ?? initialDefaultMessages ?? []

  return (
    <ChatProvider chatId={chatId} selectedModel={selectedModel} initialMessages={initialMessages} initialVisibilityType={initialVisibilityType}>
      <ChatRedirect chatId={chatId} isNewChat={isNewChat} selectedModel={selectedModel} />
      {children}
    </ChatProvider>
  )
}
