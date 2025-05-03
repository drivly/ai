'use client'

import { useChat } from '@ai-sdk/react'
import type { UIMessage } from 'ai'
import React from 'react'
import { toast } from 'sonner'
import { createRequiredContext } from '../hooks'
import { VisibilityType } from './visibility-selector'

/** Type representing all values returned by Vercel's useChat hook */
type ChatContextValue = ReturnType<typeof useChat>
const [_useChatContext, ChatContextProvider] = createRequiredContext<ChatContextValue>()

/**
 * Hook to access chat status and control
 */
export function useChatStatus() {
  const { status, stop } = _useChatContext()
  const isThinking = status === 'submitted'
  const isLoading = status === 'streaming' || status === 'submitted'
  return { status, stop, isThinking, isLoading }
}

/**
 * Hook to access chat messages and message-related functionality
 */
export function useChatMessages() {
  const { error, messages, reload } = _useChatContext()
  const { isThinking } = useChatStatus()

  const displayMessages: UIMessage[] = isThinking ? [...messages, { role: 'assistant', content: '', id: 'thinking', experimental_attachments: [], parts: [] }] : messages

  return { error, messages: displayMessages, reload }
}

/**
 * Hook to access chat input functionality and state
 */
export function useChatInput() {
  const { input, handleInputChange, handleSubmit, append } = _useChatContext()

  return { input, append, handleInputChange, handleSubmit }
}

export interface ChatProviderProps {
  children: React.ReactNode
  chatId: string
  initialMessages: Array<UIMessage>
  selectedModel: string
  initialVisibilityType: VisibilityType
}

function ChatProvider({ children, chatId, selectedModel, initialMessages, initialVisibilityType }: ChatProviderProps) {
  console.log('ChatProvider initialized with model:', selectedModel)
  
  if (window) {
    // @ts-expect-error - This is bad. Very bad. But i lack the React knowledge to make it work right.
    window.currentModel = selectedModel
  }

  const chat = useChat({
    id: chatId,
    initialMessages,
    maxSteps: 3,
    body: {
      model: selectedModel,
      selectedVisibilityType: initialVisibilityType,
    },
    onError: (error) => {
      console.error('Chat error:', error)
      toast.error(error.message || 'Failed to send message')
    },
    onResponse: (response) => {
      console.log('Chat response status:', response.status)
    },
  })

  return <ChatContextProvider value={chat}>{children}</ChatContextProvider>
}

export { ChatProvider }
