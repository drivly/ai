'use client'

import { buttonVariants } from '@/pkgs/ui/src/server/components/button'
import { cn } from '@/pkgs/ui/src/lib/utils'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { LlmsdoLogo } from '@/components/sites/navbar/llms-do-logo'
import { FaGithub, FaDiscord } from 'react-icons/fa'

export function StandaloneNavbar({ domain }: { domain?: string }) {
  const [isOpen, setIsOpen] = useState(false)
  const [hasScrolled, setHasScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setHasScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

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
          <div className='flex h-5 w-6 flex-col justify-between border border-transparent'>
            <span className={`h-0.5 w-full transform bg-current transition-transform ${isOpen ? 'translate-y-2 rotate-45' : ''}`}></span>
            <span className={`h-0.5 w-full bg-current transition-opacity ${isOpen ? 'opacity-0' : 'opacity-100'}`}></span>
            <span className={`h-0.5 w-full transform bg-current transition-transform ${isOpen ? '-translate-y-2 -rotate-45' : ''}`}></span>
          </div>
        </button>
      </div>

      {/* Mobile menu - simplified */}
      {isOpen && (
        <div className="fixed inset-0 top-14 z-50 bg-background/95 backdrop-blur-sm">
          <nav className="container mx-auto px-4 py-6">
            <ul className="space-y-4">
              <li>
                <Link 
                  href="/docs" 
                  className="block py-2 text-lg font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  Docs
                </Link>
              </li>
              <li>
                <Link 
                  href="https://github.com/drivly/ai" 
                  className="block py-2 text-lg font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  GitHub
                </Link>
              </li>
              <li>
                <Link 
                  href="https://discord.gg/qus39VeA" 
                  className="block py-2 text-lg font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  Discord
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      )}
    </header>
  )
}
