'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { useAuth } from '@/lib/auth/context'
import { withSitesWrapper } from '@/components/sites/with-sites-wrapper'
import { handleWaitlistActions } from '@/lib/auth/actions/waitlist.action'
import { User } from '@/payload.types'
import { Waitlist } from './waitlist'

export const dynamic = 'force-dynamic'

function WaitlistPage({ params }: { params: { domain: string } }) {
  const { domain } = params
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const { currentUserPromise } = useAuth()
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = await currentUserPromise
        if (!currentUser) {
          router.push('/login?destination=waitlist')
        } else {
          setUser(currentUser)
          const validDomain = domain && domain !== '[domain]' ? domain : 'default'
          try {
            await handleWaitlistActions(currentUser, validDomain)
          } catch (error) {
            console.error('Waitlist actions failed:', error)
          }
        }
        setIsLoading(false)
      } catch (error) {
        console.error('Authentication check failed', error)
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [currentUserPromise, router, domain])

  return (
    <>
      {isLoading ? (
        <div className='flex flex-col items-center justify-center py-20'>
          <Loader2 className='h-8 w-8 animate-spin' />
          <p className='text-muted-foreground mt-4'>Checking authentication status...</p>
        </div>
      ) : user ? (
        <Waitlist email={user.email} name={user.name || user.email.split('@')[0]} />
      ) : (
        <div className='min-h-[200px]'></div>
      )}
    </>
  )
}

export default withSitesWrapper({ WrappedPage: WaitlistPage, withFaqs: false, withCallToAction: false })
