'use client'

import React, { forwardRef } from 'react'
import { cn } from '../../lib/utils'

export interface MessageProps extends React.HTMLAttributes<HTMLDivElement> {}

export interface MessageAvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string
  alt?: string
  fallback?: string
}

export interface MessageContentProps extends React.HTMLAttributes<HTMLDivElement> {}

const Message = forwardRef<HTMLDivElement, MessageProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('flex w-full items-start gap-3', className)}
        {...props}
      >
        {children}
      </div>
    )
  }
)
Message.displayName = 'Message'

const MessageAvatar = forwardRef<HTMLDivElement, MessageAvatarProps>(
  ({ className, src, alt, fallback, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-full bg-muted', className)}
        {...props}
      >
        {src ? (
          <img src={src} alt={alt || 'Avatar'} className="h-full w-full rounded-full object-cover" />
        ) : (
          <span className="text-xs font-medium">{fallback || alt?.charAt(0) || '?'}</span>
        )}
      </div>
    )
  }
)
MessageAvatar.displayName = 'MessageAvatar'

const MessageContent = forwardRef<HTMLDivElement, MessageContentProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('flex-1 space-y-2 overflow-hidden', className)}
        {...props}
      >
        {children}
      </div>
    )
  }
)
MessageContent.displayName = 'MessageContent'

export { Message, MessageAvatar, MessageContent }
