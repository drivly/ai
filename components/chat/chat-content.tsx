'use client'

import { ScrollButton } from '@/components/ui/scroll-button'
import { useRef } from 'react'
import { useChatMessages } from './context'
import { Messages } from './messages'
import { MultimodalInput } from './multimodal-input'

export function ChatContent() {
  const { messages } = useChatMessages()

  const containerRef = useRef<HTMLDivElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  return (
    <div className='mx-auto flex h-full w-full max-w-4xl flex-1 flex-col overflow-y-auto'>
      <Messages containerRef={containerRef} messages={messages} />
      <MultimodalInput />
      <div data-chat-widget='scroll-button' className='absolute right-4 bottom-[56px] mr-px'>
        <ScrollButton containerRef={containerRef} scrollRef={bottomRef} />
      </div>
    </div>
  )
}
