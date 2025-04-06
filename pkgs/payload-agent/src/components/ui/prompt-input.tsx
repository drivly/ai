'use client'

import React, { forwardRef, useRef, useEffect } from 'react'
import { cn } from '../../lib/utils'

export interface PromptInputProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string
  onValueChange: (value: string) => void
  isLoading?: boolean
  maxHeight?: number
}

export interface PromptInputTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

export interface PromptInputActionProps extends React.HTMLAttributes<HTMLDivElement> {
  tooltip?: string
  delayDuration?: number
}

export interface PromptInputActionsProps extends React.HTMLAttributes<HTMLDivElement> {}

const PromptInput = forwardRef<HTMLDivElement, PromptInputProps>(
  ({ className, children, value, onValueChange, isLoading, maxHeight = 200, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('relative flex w-full flex-col overflow-hidden', className)}
        {...props}
      >
        {children}
      </div>
    )
  }
)
PromptInput.displayName = 'PromptInput'

const PromptInputTextarea = forwardRef<HTMLTextAreaElement, PromptInputTextareaProps>(
  ({ className, ...props }, ref) => {
    const textareaRef = useRef<HTMLTextAreaElement | null>(null)

    useEffect(() => {
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto'
        textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
      }
    }, [props.value])

    return (
      <textarea
        ref={(node) => {
          if (ref) {
            if (typeof ref === 'function') {
              ref(node)
            } else {
              ref.current = node
            }
          }
          textareaRef.current = node
        }}
        className={cn(
          'flex w-full resize-none bg-transparent px-3 py-2 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        rows={1}
        {...props}
      />
    )
  }
)
PromptInputTextarea.displayName = 'PromptInputTextarea'

const PromptInputActions = forwardRef<HTMLDivElement, PromptInputActionsProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('flex items-center', className)}
        {...props}
      />
    )
  }
)
PromptInputActions.displayName = 'PromptInputActions'

const PromptInputAction = forwardRef<HTMLDivElement, PromptInputActionProps>(
  ({ className, tooltip, delayDuration = 300, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('flex items-center', className)}
        title={tooltip}
        {...props}
      />
    )
  }
)
PromptInputAction.displayName = 'PromptInputAction'

export { PromptInput, PromptInputTextarea, PromptInputActions, PromptInputAction }
