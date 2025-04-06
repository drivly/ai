'use client'

import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { useState, useEffect, use } from 'react'
import { LlmsdoLogo } from './llms-do-logo'
import { FaGithub, FaDiscord } from 'react-icons/fa'
import { MobileNav } from './mobile-nav'

export function SitesNavbar({ params }: { params: Promise<{ domain?: string }> }) {
  const domain = use(params).domain

  const [isOpen, setIsOpen] = useState(false)
  const [hasScrolled, setHasScrolled] = useState(false)

  // Handle scroll detection
  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Handle body scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  return (
    <header
      className={cn(
        'fixed top-0 left-0 z-50 w-full backdrop-blur-[12px] transition-all duration-200',
        hasScrolled ? 'bg-background/80 border-b' : 'border-transparent bg-transparent',
      )}
    >
      <div className='container mx-auto flex h-14 items-center px-3 sm:px-8 md:px-8 lg:px-8'>
        <LlmsdoLogo domain={domain} />
        
        {/* Right-aligned navigation links - using ml-auto to push to the right */}
        <div className='hidden h-full items-center md:flex ml-auto'>
          <Link
            className='hover:text-primary mx-2 text-sm font-semibold text-gray-500 transition-colors'
            href={`/api`}
          >
            API
          </Link>
          <Link
            className='hover:text-primary mx-2 text-sm font-semibold text-gray-500 transition-colors'
            href={`/docs/sdks`}
          >
            SDK
          </Link>
          <Link
            className='hover:text-primary mx-2 text-sm font-semibold text-gray-500 transition-colors'
            href={`/docs`}
          >
            Docs
          </Link>
          <Link
            className='hover:text-primary mx-2 text-sm font-semibold text-gray-500 transition-colors'
            href={`/admin`}
          >
            Dashboard
          </Link>
          <Link
            className='hover:text-primary mx-2 text-sm font-semibold text-gray-500 transition-colors'
            href={`/blog`}
          >
            Blog
          </Link>

          <Link href='https://github.com/drivly/ai' className='hover:text-primary mx-2 text-sm text-gray-500 transition-colors'>
            <FaGithub className='h-5 w-5' />
            <span className='sr-only'>GitHub</span>
          </Link>
          <Link href='https://discord.gg/qus39VeA' className='hover:text-primary mx-2 text-sm text-gray-500 transition-colors'>
            <FaDiscord className='h-5 w-5' />
            <span className='sr-only'>Discord</span>
          </Link>

          <Link
            className={cn(
              buttonVariants({
                variant: 'ghost',
              }),
              'hover:text-primary mr-6 text-sm text-gray-500 transition-colors',
              hasScrolled && 'hover:text-primary bg-white text-black hover:bg-white',
            )}
            href='/waitlist'
          >
            Join Waitlist
          </Link>
        </div>

        {/* Mobile menu button */}
        <button className='ml-auto p-2 md:hidden' onClick={() => setIsOpen(!isOpen)} aria-label='Toggle menu' aria-expanded={isOpen}>
          <div className='flex h-5 w-6 flex-col justify-between border border-transparent'>
            <span className={`h-0.5 w-full transform bg-current transition-transform ${isOpen ? 'translate-y-2 rotate-45' : ''}`}></span>
            <span className={`h-0.5 w-full bg-current transition-opacity ${isOpen ? 'opacity-0' : 'opacity-100'}`}></span>
            <span className={`h-0.5 w-full transform bg-current transition-transform ${isOpen ? '-translate-y-2 -rotate-45' : ''}`}></span>
          </div>
        </button>
      </div>

      {/* Mobile menu - simplified */}
      {isOpen && <MobileNav isOpen={isOpen} handleClose={() => setIsOpen(false)} />}
    </header>
  )
}
