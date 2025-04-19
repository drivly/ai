'use client'

import { UserAvatar } from '@/components/auth/user-profile-image'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { RiDiscordFill } from '@remixicon/react'
import Link from 'next/link'
import { use } from 'react'
import { siteConfig } from '../site-config'

export interface JoinWaitlistButtonProps {
  children?: React.ReactNode
  className?: string
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'link' | 'ghost' | null | undefined
  type: 'user' | 'cta'
}

export const JoinWaitlistButton = ({ children, className, variant = 'default', type = 'user' }: JoinWaitlistButtonProps) => {
  let currentUser = null
  
  try {
    const { useAuth } = require('@/lib/auth/context')
    try {
      const { currentUserPromise } = useAuth()
      currentUser = use(currentUserPromise)
    } catch (error) {
      console.error('Auth context not available during static generation:', error)
    }
  } catch (error) {
    console.error('Auth module not available during static generation:', error)
  }

  if (currentUser && 'image' in currentUser && type === 'user') {
    return <UserAvatar image={currentUser.image || ''} />
  }

  if (currentUser && type === 'cta') {
    return (
      <Button asChild className={cn('rounded-sm bg-[#7289da] text-black hover:bg-[#839AED]', className)}>
        <Link href={siteConfig.baseLinks.discord} className='flex items-center justify-center'>
          <RiDiscordFill className='mr-1 size-5' />
          Join Discord
        </Link>
      </Button>
    )
  }

  return (
    <Button variant={variant} className={cn('cursor-pointer rounded-sm bg-white text-base hover:bg-gray-200', className)} asChild>
      <Link href='/login?destination=waitlist'>{children || 'Join Waitlist'}</Link>
    </Button>
  )
}
