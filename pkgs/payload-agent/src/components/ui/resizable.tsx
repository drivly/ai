'use client'

import * as React from 'react'
import { cn } from '../../lib/utils'

interface ResizablePanelGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  direction?: 'horizontal' | 'vertical'
  autoSaveId?: string
  autoSave?: string
}

const ResizablePanelGroup = ({ className, children, direction = 'horizontal', autoSaveId, autoSave, ...props }: ResizablePanelGroupProps) => {
  return (
    <div className={cn('flex', direction === 'horizontal' ? 'flex-row' : 'flex-col', className)} {...props}>
      {children}
    </div>
  )
}

interface ResizablePanelProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultSize?: number
  minSize?: number
  maxSize?: number
}

const ResizablePanel = ({ className, children, defaultSize = 50, minSize = 10, maxSize = 90, ...props }: ResizablePanelProps) => {
  return (
    <div className={cn('flex', className)} style={{ flexBasis: `${defaultSize}%` }} {...props}>
      {children}
    </div>
  )
}

interface ResizableHandleProps extends React.HTMLAttributes<HTMLDivElement> {
  withHandle?: boolean
}

const ResizableHandle = ({ className, withHandle = false, ...props }: ResizableHandleProps) => {
  return (
    <div
      className={cn(
        'bg-border relative flex w-px items-center justify-center after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2 after:cursor-ew-resize after:content-[""]',
        className,
      )}
      {...props}
    >
      {withHandle && (
        <div className='bg-border z-10 flex h-4 w-3 items-center justify-center rounded-sm border'>
          <div className='bg-muted-foreground h-1.5 w-0.5 rounded-full' />
        </div>
      )}
    </div>
  )
}

export { ResizablePanelGroup, ResizablePanel, ResizableHandle }
