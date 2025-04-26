'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { Markdown } from '@/components/ui/markdown'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { User, Bot } from 'lucide-react'
import type { UIMessage } from 'ai'

interface MessageProps {
  message: UIMessage
  isLoading?: boolean
}

export function Message({ message, isLoading }: MessageProps) {
  const isUser = message.role === 'user'

  return (
    <div
      className={cn('flex w-full items-start gap-4 py-4', {
        'justify-end': isUser,
      })}
    >
      {!isUser && (
        <Avatar className='h-8 w-8 rounded-full border'>
          <AvatarFallback>
            <Bot className='h-4 w-4' />
          </AvatarFallback>
        </Avatar>
      )}

      <div
        className={cn('flex max-w-[80%] flex-col gap-2', {
          'items-end': isUser,
        })}
      >
        <div
          className={cn('rounded-lg px-4 py-2', {
            'bg-primary text-primary-foreground': isUser,
            'bg-muted': !isUser,
          })}
        >
          {message.parts?.map((part, index) => {
            if (part.type === 'text') {
              return <Markdown key={`${message.id}-part-${index}`}>{part.text}</Markdown>
            }
            return null
          })}

          {/* Fallback to content if parts are not available */}
          {(!message.parts || message.parts.length === 0) && message.content && <Markdown>{message.content}</Markdown>}
        </div>
      </div>

      {isUser && (
        <Avatar className='h-8 w-8 rounded-full border'>
          <AvatarFallback>
            <User className='h-4 w-4' />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  )
}

export function ThinkingMessage() {
  return (
    <div className='flex w-full items-start gap-4 py-4'>
      <Avatar className='h-8 w-8 rounded-full border'>
        <AvatarFallback>
          <Bot className='h-4 w-4' />
        </AvatarFallback>
      </Avatar>

      <div className='flex flex-col gap-2'>
        <div className='bg-muted rounded-lg px-4 py-2'>
          <div className='flex items-center gap-1'>
            <div className='h-2 w-2 animate-pulse rounded-full bg-current' />
            <div className='h-2 w-2 animate-pulse rounded-full bg-current delay-150' />
            <div className='h-2 w-2 animate-pulse rounded-full bg-current delay-300' />
          </div>
        </div>
      </div>
    </div>
  )
}
