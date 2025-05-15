'use client'

import * as React from 'react'
import * as ScrollAreaPrimitive from '@radix-ui/react-scroll-area'

import { cn } from '@/lib/utils'

function ScrollArea({ className, children, ...props }: React.ComponentProps<typeof ScrollAreaPrimitive.Root>) {
  return (
    <ScrollAreaPrimitive.Root data-slot='scroll-area' className={cn('relative overflow-hidden', className)} {...props}>
      <ScrollAreaPrimitive.Viewport
        data-slot='scroll-area-viewport'
        className='focus-visible:ring-ring/50 size-full rounded-[inherit] transition-[color,box-shadow] outline-none focus-visible:ring-[3px] focus-visible:outline-1 [&>div]:flex! [&>div]:flex-col'>
        {children}
      </ScrollAreaPrimitive.Viewport>
      <ScrollBar />
      <ScrollAreaPrimitive.Corner />
    </ScrollAreaPrimitive.Root>
  )
}

function ScrollBar({ className, orientation = 'vertical', ...props }: React.ComponentProps<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>) {
  return (
    <ScrollAreaPrimitive.ScrollAreaScrollbar
      data-slot='scroll-area-scrollbar'
      orientation={orientation}
      className={cn(
        'flex touch-none p-px transition-colors select-none',
        orientation === 'vertical' && 'h-full w-2.5 border-l border-l-transparent',
        orientation === 'horizontal' && 'h-2.5 flex-col border-t border-t-transparent',
        className,
      )}
      {...props}>
      <ScrollAreaPrimitive.ScrollAreaThumb data-slot='scroll-area-thumb' className='bg-border relative flex-1 rounded-full' />
    </ScrollAreaPrimitive.ScrollAreaScrollbar>
  )
}

// Create and export ScrollAreaViewport that forwards its ref
const ScrollAreaViewport = ({ className, children, ...props }: React.ComponentProps<typeof ScrollAreaPrimitive.Viewport>) => (
  <ScrollAreaPrimitive.Viewport
      className={cn(
        'focus-visible:ring-ring/50 size-full rounded-[inherit] transition-[color,box-shadow] outline-none focus-visible:ring-[3px] focus-visible:outline-1 [&>div]:flex! [&>div]:flex-col',
        className,
      )}
      {...props}>
      {children}
  </ScrollAreaPrimitive.Viewport>
)
ScrollAreaViewport.displayName = ScrollAreaPrimitive.Viewport.displayName


function ScrollAreaRoot({ className, children, ...props }: React.ComponentProps<typeof ScrollAreaPrimitive.Root>) {
  return (
    <ScrollAreaPrimitive.Root data-slot='scroll-area' className={cn('relative overflow-hidden', className)} {...props}>
      {children}
      <ScrollBar />
      <ScrollAreaPrimitive.Corner />
    </ScrollAreaPrimitive.Root>
  )
}

export { ScrollArea, ScrollAreaViewport, ScrollAreaRoot, ScrollBar }
