'use client'

import { buttonVariants } from '@drivly/ui/button'
import { cn } from '@drivly/ui/lib'
import Link from 'next/link'
import { useState, useEffect, use } from 'react'
import { LlmsdoLogo } from './llms-do-logo'
import { FaGithub, FaDiscord } from 'react-icons/fa'

export function Navbar({ params }: { params: Promise<{ domain?: string }> }) {
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
      )}>
      <div className='container mx-auto flex h-14 items-center justify-between px-3 sm:px-8 md:px-8 lg:px-8'>
        <LlmsdoLogo domain={domain} />
        {domain && (
          <Link
            className='hover:text-primary absolute left-1/2 mr-6 hidden -translate-x-1/2 transform text-sm font-semibold text-gray-500 transition-colors md:block'
            href={`/sites/${domain}/blog`}>
            Blog
          </Link>
        )}

        {/* Desktop navigation */}
        <div className='hidden h-full items-center justify-end space-x-4 md:flex'>
          <Link href='https://github.com/drivly/ai' className='hover:text-primary mr-4 text-sm text-gray-500 transition-colors' target='_blank' rel='noopener noreferrer'>
            <FaGithub className='h-5 w-5' />
            <span className='sr-only'>GitHub</span>
          </Link>
          <Link href='https://discord.gg/qus39VeA' className='hover:text-primary mr-6 text-sm text-gray-500 transition-colors' target='_blank' rel='noopener noreferrer'>
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
            href='/docs'
            target='_blank'
            rel='noopener noreferrer'>
            View Docs
          </Link>
        </div>

        {/* Mobile menu button */}
        <button className='ml-auto p-2 md:hidden' onClick={() => setIsOpen(!isOpen)} aria-label='Toggle menu' aria-expanded={isOpen}>
          <div className='flex h-5 w-6 flex-col justify-between'>
            <span className={`h-0.5 w-full transform bg-current transition-transform ${isOpen ? 'translate-y-2 rotate-45' : ''}`}></span>
            <span className={`h-0.5 w-full bg-current transition-opacity ${isOpen ? 'opacity-0' : 'opacity-100'}`}></span>
            <span className={`h-0.5 w-full transform bg-current transition-transform ${isOpen ? '-translate-y-2 -rotate-45' : ''}`}></span>
          </div>
        </button>
      </div>

      {/* Mobile menu - simplified */}
      {isOpen && (
        <div className='bg-background/95 backdrop-blur-md md:hidden'>
          <nav className='container px-4 py-6'>
            <ul className='flex flex-col space-y-6'>
              <li>
                <Link className='hover:text-primary flex items-center text-lg font-medium text-gray-200 transition-colors' href='/sites/blog' onClick={() => setIsOpen(false)}>
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  className='hover:text-primary flex items-center text-lg font-medium text-gray-200 transition-colors'
                  href='https://github.com/drivly/ai'
                  target='_blank'
                  rel='noopener noreferrer'
                  onClick={() => setIsOpen(false)}>
                  <FaGithub className='mr-2 h-5 w-5' />
                  GitHub
                </Link>
              </li>
              <li>
                <Link
                  className='hover:text-primary flex items-center text-lg font-medium text-gray-200 transition-colors'
                  href='https://discord.gg/qus39VeA'
                  target='_blank'
                  rel='noopener noreferrer'
                  onClick={() => setIsOpen(false)}>
                  <FaDiscord className='mr-2 h-5 w-5' />
                  Discord
                </Link>
              </li>
              <li className='pt-4'>
                <Link
                  className={cn(
                    buttonVariants({
                      variant: 'default',
                    }),
                    'w-full justify-center text-sm',
                  )}
                  href='https://apis.do/'
                  target='_blank'
                  rel='noopener noreferrer'
                  onClick={() => setIsOpen(false)}>
                  View Docs
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      )}
    </header>
  )
}
