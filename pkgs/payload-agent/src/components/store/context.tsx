'use client'

import { useChat } from '@ai-sdk/react'
import { createRequiredContext } from '../ui/hooks'
import type { UIMessage } from 'ai'
import React from 'react'

/** Type representing all values returned by Vercel's useChat hook */
type ChatContextValue = ReturnType<typeof useChat>

const [_useChatContext, ChatContextProvider] = createRequiredContext<ChatContextValue>()

/**
 * Hook to access chat messages and message-related functionality
 * @returns Object containing messages, error state, and reload function
 * @example
 * ```tsx
 * function ChatMessages() {
 *   const { messages, error, reload } = useChatMessages()
 *   if (error) return <ErrorDisplay error={error} onRetry={reload} />
 *   return messages.map(...)
 * }
 * ```
 */
export function useChatMessages() {
  const { error, messages, reload } = _useChatContext()
  const { isThinking } = useChatStatus()

  const displayMessages: UIMessage[] = isThinking ? [...messages, { role: 'assistant', content: '', id: 'thinking', experimental_attachments: [], parts: [] }] : messages

  return { error, messages: displayMessages, reload }
}

/**
 * Hook to access chat input functionality and state
 * @returns Object containing input value, handlers, and attachment state
 * @example
 * ```tsx
 * function ChatInput() {
 *   const { input, handleInputChange, handleSubmit, isLoading } = useChatInput()
 *   return <textarea disabled={isLoading} ... />
 * }
 * ```
 */
export function useChatInput() {
  const { input, handleInputChange, handleSubmit, append } = _useChatContext()

  return { input, append, handleInputChange, handleSubmit }
}

/**
 * Hook to access chat status and control
 * @returns Object containing status, stop function, and loading state
 * @example
 * ```tsx
 * function ChatControl() {
 *   const { status, stop, isLoading } = useChatStatus()
 *   return isLoading ? <StopButton onClick={stop} /> : null
 * }
 * ```
 */
export function useChatStatus() {
  const { status, stop } = _useChatContext()
  const isThinking = status === 'submitted'
  const isLoading = status === 'streaming' || status === 'submitted'
  return { status, stop, isThinking, isLoading }
}

function ChatProvider({ children }: { children: React.ReactNode }) {
  const chat = useChat({
    maxSteps: 3,
    onError: (error) => console.error('Chat error:', error),
  })

  return <ChatContextProvider value={chat}>{children}</ChatContextProvider>
}

export { ChatProvider }
