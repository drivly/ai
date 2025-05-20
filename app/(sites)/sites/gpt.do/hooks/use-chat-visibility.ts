'use client'

import { useMemo } from 'react'
import useSWR from 'swr'
import type { VisibilityType } from '../components/visibility-selector'
import { useChatHistory } from './use-chat-history'

export function useChatVisibility({ chatId, initialVisibilityType }: { chatId: string; initialVisibilityType: VisibilityType }) {
  const { chatSessions, updateChatVisibility } = useChatHistory()

  // Use SWR just for local state management
  const { data: localVisibility, mutate: setLocalVisibility } = useSWR(`${chatId}-visibility`, null, {
    fallbackData: initialVisibilityType,
  })

  const visibilityType = useMemo(() => {
    // If chat exists in our local storage, use its visibility
    const chat = chatSessions[chatId]
    if (chat) {
      return chat.visibility as VisibilityType
    }
    // Fallback to local state or default to private
    return localVisibility || 'private'
  }, [chatSessions, chatId, localVisibility])

  const setVisibilityType = (updatedVisibilityType: VisibilityType) => {
    // Update local state
    setLocalVisibility(updatedVisibilityType)

    // Update visibility in chat history
    updateChatVisibility(chatId, updatedVisibilityType)
  }

  return { visibilityType, setVisibilityType }
}
