'use client'

import { useChat } from '@ai-sdk/react'
import type { UIMessage } from 'ai'
import React, { useEffect } from 'react'
import { createRequiredContext } from '../hooks'
import { toast } from 'sonner'
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

function ChatProvider({ children, chatId, selectedModel }: { children: React.ReactNode; chatId: string; selectedModel: string }) {
  console.log('ChatProvider initialized with model:', selectedModel)

  const chat = useChat({
    id: chatId,
    maxSteps: 3,
    body: {
      model: selectedModel,
    },
    onError: (error) => {
      console.error('Chat error:', error)
      toast.error(error.message || 'Failed to send message')
    },
    onResponse: (response) => {
      console.log('Chat response status:', response.status)
    },
  })

  // Update body.model when selectedModel changes
  useEffect(() => {
    console.log('Model changed to:', selectedModel)
    // The useChat hook will automatically use the updated body in future requests
  }, [selectedModel])

  return <ChatContextProvider value={chat}>{children}</ChatContextProvider>
}

export { ChatProvider }
