'use client'

import { cn } from '@drivly/ui/lib'
import Link from 'next/link'
import { use, useEffect, useState } from 'react'
import { FaDiscord, FaGithub } from 'react-icons/fa'
import { JoinWaitlistButton } from '@/components/shared/join-waitlist-button'
import { LlmsdoLogo } from './llms-do-logo'
import { MobileNav } from './mobile-nav'
import { navLinks } from './nav-config'

function linkFilter(link: (typeof navLinks)[number]) {
  return link.label !== 'GitHub' && link.label !== 'Discord'
}

export function SitesNavbar({ params }: { params: Promise<{ domain?: string }> }) {
  const domain = use(params).domain
  const navMenuLinks = navLinks.filter(linkFilter)

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
      <nav className='container mx-auto flex h-14 max-w-7xl items-center justify-between px-4 lg:px-8'>
        <LlmsdoLogo domain={domain} />

        <div className='absolute left-1/2 mr-6 hidden -translate-x-1/2 transform space-x-6 md:block'>
          {navMenuLinks.map((link) => {
            if (link.label === 'Blog' && domain) {
              return (
                <Link key={link.label} href={link.href} rel={link.rel} target={link.target} className='hover:text-primary text-sm font-semibold text-gray-500 transition-colors'>
                  {link.label}
                </Link>
              )
            } else if (link.label !== 'Blog') {
              return (
                <Link key={link.label} href={link.href} rel={link.rel} target={link.target} className='hover:text-primary text-sm font-semibold text-gray-500 transition-colors'>
                  {link.label}
                </Link>
              )
            }
          })}
        </div>

        {/* Desktop navigation */}
        <div className='hidden h-full items-center justify-end space-x-4 md:flex'>
          <Link href='https://github.com/drivly/ai' className='hover:text-primary text-sm text-gray-500 transition-colors' target='_blank' rel='noopener noreferrer'>
            <FaGithub className='h-5 w-5' />
            <span className='sr-only'>GitHub</span>
          </Link>
          <Link href='https://discord.gg/qus39VeA' className='hover:text-primary text-sm text-gray-500 transition-colors'>
            <FaDiscord className='h-5 w-5' />
            <span className='sr-only'>Discord</span>
          </Link>

          <JoinWaitlistButton variant='ghost' className='text-primary bg-white text-sm font-semibold text-gray-500 transition-colors'>
            Join waitlist
          </JoinWaitlistButton>
        </div>

        <MobileNav isOpen={isOpen} setOpen={setOpen} domain={domain} />
      </nav>
    </header>
  )
}
