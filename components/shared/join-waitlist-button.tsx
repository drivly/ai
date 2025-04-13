'use client'

import { signIn } from '@/lib/auth/auth-client'
import { Button } from '@drivly/ui'
import { cn } from '@drivly/ui/lib'
import Link from 'next/link'
import { use, useState } from 'react'
import { siteConfig } from '../site-config'
import { useBetterAuth } from '@/lib/auth/context'
import { UserAvatar } from '@/components/auth/user-profile-image'
import { RiDiscordFill } from '@remixicon/react'

export interface JoinWaitlistButtonProps {
  children?: React.ReactNode
  className?: string
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'link' | 'ghost' | null | undefined
  type: 'user' | 'cta'
}

export const JoinWaitlistButton = ({ children, className, variant = 'default', type = 'user' }: JoinWaitlistButtonProps) => {
  const { currentUserPromise } = useBetterAuth()
  const currentUser = use(currentUserPromise)

  const [isLoading, setLoading] = useState(false)

  const handleJoinWaitlist = async () => {
    setLoading(true)
    await signIn.social({
      provider: 'github',
      callbackURL: siteConfig.baseLinks.waitlist,
      fetchOptions: {
        onSuccess: () => {
          setLoading(false)
        },
        onError: () => {
          setLoading(false)
        },
      },
    })
    setLoading(false)
  }

  if (currentUser && type === 'user') {
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
    <Button variant={variant} disabled={isLoading} className={cn('cursor-pointer rounded-sm bg-white text-base hover:bg-gray-200', className)} onClick={handleJoinWaitlist}>
      {children || 'Join Waitlist'}
    </Button>
  )
}
