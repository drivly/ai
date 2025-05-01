'use client'

import { ChatContent } from '@/components/chat/chat-content'
import { ChatHeader } from '@/components/chat/chat-header'
import { ChatProvider } from '@/components/chat/chat-provider'
import { useState } from 'react'

export interface ChatProps {
  id: string
  model: string
}

export const Chat = (props: ChatProps) => {
  const { id, model } = props
  const [modelValue, setModelValue] = useState(model)

  return (
    <ChatProvider chatId={id} selectedModel={model}>
      <div className='bg-background mx-auto flex h-screen w-full flex-col overflow-hidden'>
        <ChatHeader chatId={id} model={model} modelValue={modelValue} setModelValue={setModelValue} />
        <ChatContent />
      </div>
    </ChatProvider>
  )
}
