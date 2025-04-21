'use client'

import { UserAvatar } from '@/components/auth/user-profile-image'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { RiDiscordFill } from '@remixicon/react'
import Link from 'next/link'
import { siteConfig } from '../site-config'

export interface JoinWaitlistButtonProps {
  children?: React.ReactNode
  className?: string
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'link' | 'ghost' | null | undefined
  type: 'user' | 'cta'
}

export const JoinWaitlistButton = ({ children, className, variant = 'default', type = 'user' }: JoinWaitlistButtonProps) => {
  return (
    <Button variant={variant} className={cn('cursor-pointer rounded-sm bg-white text-base hover:bg-gray-200', className)} asChild>
      <Link href='/waitlist'>{children || 'Join Waitlist'}</Link>
    </Button>
  )
}
