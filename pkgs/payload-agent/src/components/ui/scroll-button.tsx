'use client'

import React, { useEffect, useState } from 'react'
import { ArrowDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from './button'

interface ScrollButtonProps {
  containerRef: React.RefObject<HTMLDivElement>
  scrollRef?: React.RefObject<HTMLDivElement>
  className?: string
}

export function ScrollButton({ containerRef, scrollRef, className }: ScrollButtonProps) {
  const [showButton, setShowButton] = useState(false)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleScroll = () => {
      if (!container) return
      const isScrolledToBottom = container.scrollHeight - container.scrollTop <= container.clientHeight + 100
      setShowButton(!isScrolledToBottom)
    }

    container.addEventListener('scroll', handleScroll)
    handleScroll()

    return () => {
      container.removeEventListener('scroll', handleScroll)
    }
  }, [containerRef])

  const scrollToBottom = () => {
    if (scrollRef?.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' })
    } else if (containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: 'smooth',
      })
    }
  }

  if (!showButton) return null

  return (
    <Button
      onClick={scrollToBottom}
      className={cn('bg-background flex h-8 w-8 items-center justify-center rounded-full border p-0 shadow-md', className)}
      aria-label='Scroll to bottom'
    >
      <ArrowDown className='h-4 w-4' />
    </Button>
  )
}
