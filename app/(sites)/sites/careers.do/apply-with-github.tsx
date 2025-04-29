'use client'

import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import { CheckCircle2 } from 'lucide-react'
import { signIn, useSession } from 'next-auth/react'
import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { useApplication } from './application-context'
import { JobPosition } from './schema'
import { useGithubApply } from './use-github-apply'

export interface ApplyWithGitHubProps {
  position: JobPosition
  hasApplied?: boolean
}

export const ApplyWithGitHub = ({ hasApplied, position }: ApplyWithGitHubProps) => {
  const { data: session, status: sessionStatus } = useSession()
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const isCallback = searchParams.get('callback') === 'true'
  const callbackPosition = searchParams.get('position') as JobPosition | null

  const { isProcessingCallback, setIsProcessingCallback, hasProcessedCallback } = useApplication()

  const {
    form,
    action: { isPending, execute },
    handleSubmitWithAction,
  } = useGithubApply({ position })

  useEffect(() => {
    // If we've already processed a callback for this session, don't process again
    if (hasProcessedCallback || hasApplied) return

    // Only process if this button's position matches the callback position
    // and we aren't already processing a callback
    if (isCallback && callbackPosition === position && !isProcessingCallback) {
      setIsProcessingCallback(true)
      form.setValue('position', callbackPosition)
      execute({ position: callbackPosition })
    }
  }, [isCallback, callbackPosition, isProcessingCallback, hasProcessedCallback, hasApplied, position, setIsProcessingCallback, execute, form])

  const handleApply = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // If user is already authenticated, submit directly
    if (sessionStatus === 'authenticated' && session) {
      handleSubmitWithAction(e)
      return
    }

    // Otherwise redirect to GitHub auth
    await signIn('github', {
      callbackUrl: `${pathname}?callback=true&position=${position}`,
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={handleApply} className='space-y-8'>
        <Button type='submit' disabled={isPending || isProcessingCallback || hasApplied} className='h-10 w-[150px] cursor-pointer rounded-sm'>
          {isPending ? (
            'Applying...'
          ) : hasApplied ? (
            <div className='flex items-center space-x-2'>
              <CheckCircle2 className='h-5 w-5' />
              <span className='text-sm'>Applied</span>
            </div>
          ) : (
            'Apply with GitHub'
          )}
        </Button>
      </form>
    </Form>
  )
}
