'use client'

import { ChatContent } from '@/components/chat/chat-content'
import { ChatHeader } from '@/components/chat/chat-header'
import { ChatWrapper } from '@/components/chat/chat-wrapper'
import { useChatHistory } from '@/components/chat/use-chat-history'
import { useChatVisibility } from '@/components/chat/use-chat-visibility'
import { VisibilityType } from '@/components/chat/visibility-selector'
import { useAuthUser } from '@/hooks/use-auth-user'
import { Session } from 'next-auth'
import { useEffect, useState } from 'react'

export interface ChatProps {
  id: string
  initialChatModel: string
  initialVisibilityType: VisibilityType
  session: Session
}

export const Chat = (props: ChatProps) => {
  const { id, initialChatModel, initialVisibilityType, session } = props
  const [selectedModelId, setSelectedModelId] = useState(initialChatModel)
  const user = useAuthUser()
  const { getChatSession } = useChatHistory()
  const currentChat = getChatSession(id)
  const isReadonly = user?.id !== currentChat?.userId

  // Keep model value updated if prop changes
  useEffect(() => {
    setSelectedModelId(initialChatModel)
  }, [initialChatModel])

  const { visibilityType } = useChatVisibility({
    chatId: id,
    initialVisibilityType,
  })

  return (
    <ChatWrapper chatId={id} selectedModel={selectedModelId} initialVisibilityType={initialVisibilityType}>
      <div className='bg-background flex h-dvh min-w-0 flex-col'>
        <ChatHeader
          chatId={id}
          selectedModelId={selectedModelId}
          setSelectedModelId={setSelectedModelId}
          selectedVisibilityType={visibilityType}
          isReadonly={isReadonly}
          session={session}
        />
        <ChatContent />
      </div>
    </ChatWrapper>
  )
}
