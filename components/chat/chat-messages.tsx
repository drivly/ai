'use client'

import React, { useRef, useEffect } from 'react'
import { Message, ThinkingMessage } from '@/components/chat/message'
import { useChatMessages, useChatStatus } from './chat-context'

export function ChatMessages() {
  const { messages } = useChatMessages()
  const { isThinking, isLoading } = useChatStatus()
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  return (
    <div className='flex w-full flex-col space-y-4 overflow-y-auto p-4'>
      {messages.length === 0 ? (
        <div className='flex h-full flex-col items-center justify-center'>
          <h2 className='text-2xl font-bold'>Welcome to Chat</h2>
          <p className='text-muted-foreground'>Start a conversation by typing a message below.</p>
        </div>
      ) : (
        <>
          {messages.map((message) => (
            <Message key={message.id} message={message} isLoading={isLoading && message.role === 'assistant' && message.id === messages[messages.length - 1]?.id} />
          ))}

          {isThinking && <ThinkingMessage />}

          <div ref={messagesEndRef} />
        </>
      )}
    </div>
  )
}
