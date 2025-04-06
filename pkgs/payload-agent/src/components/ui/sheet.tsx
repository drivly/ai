'use client'

import * as React from 'react'
import { cn } from '../../lib/utils'

interface SheetProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  children: React.ReactNode
}

export function Sheet({ open, onOpenChange, children }: SheetProps) {
  return (
    <div data-state={open ? 'open' : 'closed'}>
      {children}
    </div>
  )
}

interface SheetContentProps extends React.HTMLAttributes<HTMLDivElement> {
  closeButton?: boolean
  overlay?: boolean
}

export function SheetContent({ 
  className, 
  children, 
  closeButton = true,
  overlay = true,
  ...props 
}: SheetContentProps) {
  return (
    <div
      className={cn(
        'fixed inset-y-0 right-0 z-50 flex max-w-full flex-col border-l bg-background shadow-lg',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function SheetTitle({ 
  className, 
  ...props 
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2
      className={cn(
        'text-lg font-semibold',
        className
      )}
      {...props}
    />
  )
}

export function SheetDescription({ 
  className, 
  ...props 
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn(
        'text-sm text-muted-foreground',
        className
      )}
      {...props}
    />
  )
}
