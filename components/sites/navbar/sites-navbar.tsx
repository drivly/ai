'use client'

import { JoinWaitlistButton } from '@/components/shared/join-waitlist-button'
import { navigation, siteConfig } from '@/components/site-config'
import { cn } from '@drivly/ui/lib'
import Link from 'next/link'
import { use, useEffect, useState } from 'react'
import { FaDiscord, FaGithub } from 'react-icons/fa'
import { LlmsdoLogo } from './llms-do-logo'
import { MobileNav } from './mobile-nav'

function linkFilter(link: (typeof navigation)[number]) {
  return link.name !== 'GitHub' && link.name !== 'Discord'
}

export function SitesNavbar({ params, minimal }: { params: Promise<{ domain?: string }>; minimal?: boolean }) {
  const domain = use(params).domain
  const navMenuLinks = navigation.filter(linkFilter)

  const [isOpen, setOpen] = useState(false)
  const [hasScrolled, setHasScrolled] = useState(false)

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
      <nav className='container mx-auto flex h-14 max-w-6xl items-center justify-between px-3 xl:px-0'>
        <LlmsdoLogo domain={domain} minimal={minimal} />

        {!minimal && (
          <div className='absolute left-1/2 mr-6 hidden -translate-x-1/2 transform space-x-6 md:block'>
            {navMenuLinks.map((link) => {
              if (link.name !== 'Blog') {
                return (
                  <Link key={link.name} href={link.href} className='hover:text-primary text-sm font-semibold text-gray-400 transition-colors'>
                    {link.name}
                  </Link>
                )
              }
            })}
          </div>
        )}

        {/* Desktop navigation */}
        <div
          className={cn('hidden h-full items-center justify-end space-x-4 md:flex', {
            flex: minimal,
          })}>
          <Link href={siteConfig.baseLinks.github} className='hover:text-primary text-sm text-gray-400 transition-colors' target='_blank' rel='noopener noreferrer'>
            <FaGithub className='h-5 w-5' />
            <span className='sr-only'>GitHub</span>
          </Link>
          <Link href={siteConfig.baseLinks.discord} className='hover:text-primary text-sm text-gray-400 transition-colors' target='_blank' rel='noopener noreferrer'>
            <FaDiscord className='h-5 w-5' />
            <span className='sr-only'>Discord</span>
          </Link>

          <JoinWaitlistButton className='rounded-sm bg-white text-sm transition-colors' type='user' />
        </div>

        {!minimal && <MobileNav isOpen={isOpen} setOpen={setOpen} domain={domain} />}
      </nav>
    </header>
  )
}
