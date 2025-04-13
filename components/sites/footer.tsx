import { RiArrowRightUpLine } from '@remixicon/react'
import { cn } from '@/lib/utils'

import Link from 'next/link'
import { DotdoLogo } from '../shared/dotdo-logo'
import { footerNavigation, siteConfig } from '../site-config'

export function Footer({ minimal, className }: { minimal?: boolean; className?: string }) {
  if (minimal) {
    return <MinimalFooter />
  }

  return (
    <footer id='footer' className={cn('bg-black', className)}>
      <div className='mx-auto max-w-6xl px-3 pt-16 pb-8 sm:pt-24 lg:pt-32'>
        <div className='xl:grid xl:grid-cols-3 xl:gap-20'>
          <div className='space-y-8'>
            <DotdoLogo className='flex items-center justify-start' />
            <p className='text-sm leading-6 text-gray-400'>{siteConfig.description}</p>

            <div className='mt-6 flex space-x-4'>
              {footerNavigation.social.map((item) => (
                <a key={item.name} href={item.href} target='_blank' rel='noopener noreferrer' className='text-gray-400 transition-colors hover:text-white'>
                  <item.icon className='size-6' aria-hidden='true' />
                  <span className='sr-only'>{item.name}</span>
                </a>
              ))}
            </div>
          </div>
          <div className='mt-16 grid grid-cols-1 gap-14 sm:gap-8 md:grid-cols-2 xl:col-span-2 xl:mt-0'>
            <div className='grid grid-cols-2 gap-8'>
              <div>
                <h3 className='text-sm leading-6 font-semibold text-white'>
                  <span className='mr-1 rounded-sm border-[.5px] border-slate-800/50 bg-slate-600/50 bg-[linear-gradient(_rgba(0,0,0,0)_0%,_rgb(0,0,0)_100%,_rgb(0,0,0)_100%)] px-2 py-1 font-normal text-slate-300 shadow-lg'>
                    .do
                  </span>
                  Products
                </h3>
                <ul role='list' className='mt-6 space-y-4' aria-label='Quick links Products'>
                  {footerNavigation.products.map((item) => (
                    <li key={item.name} className='w-fit'>
                      <Link
                        className='flex rounded-md text-sm text-gray-400 transition hover:text-white'
                        href={item.href}
                        target={item.external ? '_blank' : undefined}
                        rel={item.external ? 'noopener noreferrer' : undefined}>
                        <span>{item.name}</span>
                        {item.external && (
                          <div className='ml-1 aspect-square size-3 rounded-full bg-gray-800 p-px'>
                            <RiArrowRightUpLine aria-hidden='true' className='size-full shrink-0 text-gray-300' />
                          </div>
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className='text-sm leading-6 font-semibold text-white'>Developers</h3>
                <ul role='list' className='mt-6 space-y-4' aria-label='Quick links Developers'>
                  {footerNavigation.developers.map((item) => (
                    <li key={item.name} className='w-fit'>
                      <Link
                        className='flex rounded-md text-sm text-gray-400 transition hover:text-white'
                        href={item.href}
                        target={item.external ? '_blank' : undefined}
                        rel={item.external ? 'noopener noreferrer' : undefined}>
                        <span>{item.name}</span>
                        {item.external && (
                          <div className='ml-0.5 aspect-square size-3 rounded-full bg-gray-800 p-px'>
                            <RiArrowRightUpLine aria-hidden='true' className='size-full shrink-0 text-gray-300' />
                          </div>
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className='grid grid-cols-2 gap-8'>
              <div>
                <h3 className='text-sm leading-6 font-semibold text-white'>Resources</h3>
                <ul role='list' className='mt-6 space-y-4' aria-label='Quick links Resources'>
                  {footerNavigation.resources.map((item) => (
                    <li key={item.name} className='w-fit'>
                      <Link
                        className='flex rounded-md text-sm text-gray-400 transition hover:text-white'
                        href={item.href}
                        target={item.external ? '_blank' : undefined}
                        rel={item.external ? 'noopener noreferrer' : undefined}>
                        <span>{item.name}</span>
                        {item.external && (
                          <div className='ml-1 aspect-square size-3 rounded-full bg-gray-800 p-px'>
                            <RiArrowRightUpLine aria-hidden='true' className='size-full shrink-0 text-gray-300' />
                          </div>
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className='text-sm leading-6 font-semibold text-white'>Company</h3>
                <ul role='list' className='mt-6 space-y-4' aria-label='Quick links Company'>
                  {footerNavigation.company.map((item) => (
                    <li key={item.name} className='w-fit'>
                      <Link
                        className='flex rounded-md text-sm text-gray-400 transition hover:text-white'
                        href={item.href}
                        target={item.external ? '_blank' : undefined}
                        rel={item.external ? 'noopener noreferrer' : undefined}>
                        <span>{item.name}</span>
                        {item.external && (
                          <div className='ml-1 aspect-square size-3 rounded-full bg-gray-800 p-px'>
                            <RiArrowRightUpLine aria-hidden='true' className='size-full shrink-0 text-gray-300' />
                          </div>
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className='mt-16 flex flex-col items-center justify-between gap-4 border-t border-gray-800 pt-8 sm:mt-20 sm:flex-row lg:mt-24'>
          <p className='text-sm leading-5 text-gray-400'>&copy; {new Date().getFullYear()} .do, Inc. All rights reserved.</p>
          <div className='rounded-full border border-gray-800 py-1 pr-2 pl-1'>
            <div className='flex items-center gap-1.5'>
              <div className='relative size-4 shrink-0'>
                <div className='absolute inset-[1px] rounded-full bg-emerald-500/20' />
                <div className='absolute inset-1 rounded-full bg-emerald-500' />
              </div>
              <span className='text-xs text-white'>All systems operational</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

function MinimalFooter({ className }: { className?: string }) {
  return (
    <footer id='footer' className={cn('bg-black', className)}>
      <div className='mx-auto max-w-6xl px-3 py-8'>
        <div className='grid grid-flow-row auto-rows-max items-center gap-y-8 sm:grid-cols-3 sm:gap-y-0'>
          <DotdoLogo className='flex items-center justify-center sm:justify-start' />
          <p className='text-center text-sm leading-5 text-gray-400'>&copy; {new Date().getFullYear()} .do, Inc. All rights reserved.</p>
          <div className='flex justify-center space-x-4 sm:justify-end'>
            {footerNavigation.social.map((item) => (
              <a key={item.name} href={item.href} target='_blank' rel='noopener noreferrer' className='text-gray-400 transition-colors hover:text-white'>
                <item.icon className='size-6' aria-hidden='true' />
                <span className='sr-only'>{item.name}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
