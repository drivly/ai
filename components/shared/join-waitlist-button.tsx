'use client'

import { signIn } from '@/lib/auth/auth-client'
import { Button } from '@drivly/ui'
import { cn } from '@drivly/ui/lib'
import Link from 'next/link'
import { useState } from 'react'
import { siteConfig } from '../site-config'

export interface JoinWaitlistButtonProps {
  children?: React.ReactNode
  className?: string
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'link' | 'ghost' | null | undefined
}

export const JoinWaitlistButton = (props: JoinWaitlistButtonProps) => {
  const [isLoading, setIsLoading] = useState(false)

  return (
    <Link href={siteConfig.baseLinks.waitlist} passHref>
      <Button variant={props.variant} className={cn('cursor-pointer', props.className)}>
        {props.children || 'Join Waitlist'}
      </Button>
    </Link>
  )
}


// if user logged in, show user icon same size as payloads user avatar
