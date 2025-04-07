'use client'

import { signIn } from '@/lib/auth/auth-client'
import { Button } from '@drivly/ui'
import { cn } from '@drivly/ui/lib'
import { useState } from 'react'

export interface JoinWaitlistButtonProps {
  children?: React.ReactNode
  className?: string
  domain?: string
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'link' | 'ghost' | null | undefined
}

export const JoinWaitlistButton = (props: JoinWaitlistButtonProps) => {
  const [isLoading, setIsLoading] = useState(false)

  const joinWaitlist = async () => {
    setIsLoading(true)
    await signIn.social({ provider: 'github', callbackURL: `/waitlist` })
  }

  return (
    <Button disabled={isLoading} variant={props.variant} className={cn('cursor-pointer', props.className)} onClick={joinWaitlist}>
      {props.children || 'Join Waitlist'}
    </Button>
  )
}
