'use client'

import { JoinWaitlistButton } from '@/components/shared/join-waitlist-button'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { GridPatternDashed } from '../magicui/grid-pattern-dashed'

export function CallToAction() {
  const pathname = usePathname()

  if (pathname === '/waitlist') {
    return null
  }

  return (
    <section className='relative mb-32 h-[400px] overflow-hidden rounded-t-[32px] border-t border-gray-800/50 py-24 inset-shadow-2xs sm:py-32'>
      <GridPatternDashed />
      <div className='relative z-10 container mx-auto mt-12 px-4 text-center sm:mt-0 sm:px-6 lg:px-8'>
        <h2 className='mb-8 text-4xl font-medium tracking-tight sm:mb-10 sm:text-5xl'>
          <span className='text-gray-400'>Do Work.</span> <span className='text-white'>With AI.</span>
        </h2>
        <div className='flex flex-col items-center justify-center gap-4 sm:flex-row'>
          <JoinWaitlistButton className='h-10 w-full text-base sm:w-[180px]' type='cta' />
          <Button
            variant='outline'
            className='text-primary h-10 w-full cursor-pointer rounded-sm border-gray-700 px-8 text-base hover:bg-[#1A1A1D] hover:text-white sm:w-[180px]'
            asChild
          >
            <Link href='/docs'>Learn more</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
