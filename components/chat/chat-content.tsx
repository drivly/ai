'use client'

import { ScrollButton } from '@/components/ui/scroll-button'
import { Fragment, useRef } from 'react'
import { useChatMessages } from './context'
import { Messages } from './messages'
import { MultimodalInput } from './multimodal-input'

export function ChatContent() {
  const { messages } = useChatMessages()

  const containerRef = useRef<HTMLDivElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  return (
    <Fragment>
      <Messages containerRef={containerRef} messages={messages} />
      <MultimodalInput />
      <div data-chat-widget='scroll-button' className='absolute inset-x-0 bottom-[74px] mx-auto flex w-full max-w-4xl justify-end px-[30px] md:bottom-[84px]'>
        <ScrollButton containerRef={containerRef} scrollRef={bottomRef} />
      </div>
    </Fragment>
  )
}
