'use client'

import { UserAvatar } from '@/components/auth/user-profile-image'
import { Button } from '@/components/ui/button'
import { useAuthUser } from '@/hooks/use-auth-user'
import { assertUnreachable } from '@/lib/guards/assert-unreachable'
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
  const user = useAuthUser()

  if (user) {
    switch (type) {
      case 'user':
        return <UserAvatar image={user.image || ''} />
      case 'cta':
        return (
          <Button asChild className={cn('rounded-sm bg-[#7289da] text-black hover:bg-[#839AED]', className)}>
            <Link href={siteConfig.baseLinks.discord} className='flex items-center justify-center'>
              <RiDiscordFill className='mr-1 size-5' />
              Join Discord
            </Link>
          </Button>
        )
      default:
        assertUnreachable(type)
    }
  }

  return (
    <Button variant={variant} className={cn('cursor-pointer rounded-sm bg-white text-base hover:bg-gray-200', className)} asChild>
      <Link href='/waitlist'>{children || 'Join Waitlist'}</Link>
    </Button>
  )
}
