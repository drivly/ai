import { JoinWaitlistButton } from '@/components/shared/join-waitlist-button'
import { cn } from '@/lib/utils'
import React from 'react'
import { FaGithub } from 'react-icons/fa'
import { CodeWindow } from '../code-window'
import Balancer from 'react-wrap-balancer'

type HeroSectionProps = Omit<React.HTMLAttributes<HTMLDivElement>, 'title' | 'description'> & {
  badge?: string
  buttonText?: string
  codeExample?: string | object
  codeLang?: string
  description: React.ReactNode
  title: React.ReactNode
  domain?: string
}

export function HeroSection({ className, badge, buttonText, codeExample, codeLang = 'json', description, title, domain }: HeroSectionProps) {
  return (
    <section id='hero' className={cn('relative mx-auto mt-32 max-w-[80rem] px-3 text-center lg:mt-48', className)}>
      {badge && (
        <div className='group inline-flex h-7 items-center justify-between gap-1 rounded-full border border-white/5 bg-white/10 px-3 text-xs text-white backdrop-filter-[16px] dark:text-black'>
          <p className='mx-auto inline-flex max-w-md items-center justify-center text-gray-400'>
            <span>{badge}</span>
          </p>
        </div>
      )}
      <h1 className='mx-auto max-w-4xl bg-gradient-to-br from-black from-30% to-black/40 bg-clip-text py-6 text-[46px] leading-none font-medium tracking-tight text-transparent sm:text-7xl sm:text-balance dark:from-white dark:to-white/40'>
        <Balancer>{title}</Balancer>
      </h1>
      <p className='mx-auto mb-12 max-w-3xl text-lg text-gray-400 md:text-xl'><Balancer>{description}</Balancer></p>
      {buttonText && (
        <JoinWaitlistButton className='h-10 w-full gap-2 rounded-sm text-base ease-in-out has-[>svg]:px-10 sm:w-auto sm:text-sm' type='cta'>
          <FaGithub className='h-4 w-4' />
          <span>{buttonText}</span>
        </JoinWaitlistButton>
      )}

      {/* Code window with glow effect */}
      {codeExample && (
        <div className='relative mt-[2rem] -mr-[20%] w-[120%] sm:mt-[4rem] md:mx-auto md:w-auto md:max-w-3xl'>
          {/* Add the green glow effect directly behind the code window */}
          <div
            className='absolute -inset-10 -z-10 opacity-70 blur-2xl'
            style={{
              background: 'radial-gradient(circle at center, var(--glow-color), transparent 70%)',
              transform: 'translateY(20px)',
            }}
          />

          <div>
            {/* If json, url or code, show code file */}
            <CodeWindow code={codeExample} language={codeLang} title={domain} />
          </div>
        </div>
      )}
    </section>
  )
}
