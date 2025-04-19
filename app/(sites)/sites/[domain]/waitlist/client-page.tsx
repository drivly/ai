'use client'

import { useAuth } from '@/lib/auth/context'
import { Waitlist } from './waitlist'
import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'

export default function WaitlistClientPage({ email, name }: { email: string; name: string }) {
  const [isLoading, setIsLoading] = useState(true)
  const { sessionPromise } = useAuth()
  const [sessionLoaded, setSessionLoaded] = useState(false)

  useEffect(() => {
    sessionPromise.then(() => {
      setSessionLoaded(true)
      setIsLoading(false)
    })
  }, [sessionPromise])

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    )
  }

  return <Waitlist email={email} name={name} />
}
