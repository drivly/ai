'use client'

import React, { forwardRef } from 'react'
import { cn } from '../../lib/utils'

export interface ChatContainerProps extends React.HTMLAttributes<HTMLDivElement> {}

const ChatContainer = forwardRef<HTMLDivElement, ChatContainerProps>(({ className, children, ...props }, ref) => {
  return (
    <div className={cn('flex flex-col overflow-y-auto', className)} ref={ref} {...props}>
      {children}
    </div>
  )
})

ChatContainer.displayName = 'ChatContainer'

export { ChatContainer }
