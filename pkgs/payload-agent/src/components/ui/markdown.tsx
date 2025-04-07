'use client'

import React from 'react'
import { cn } from '../../lib/utils'

export interface MarkdownProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Markdown({ className, children, ...props }: MarkdownProps) {
  return (
    <div className={cn('prose dark:prose-invert max-w-none', className)} {...props}>
      {children}
    </div>
  )
}
