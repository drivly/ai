import { RiArrowRightUpLine } from '@remixicon/react'
import Link from 'next/link'
import { DotdoLogo } from '../shared/dotdo-logo'
import { footerNavigation, siteConfig } from '../site-config'
// import { ProjectStatus } from './project-status'

export function Footer({ minimal }: { minimal?: boolean }) {
  if (minimal) {
    return <MinimalFooter />
  }

  return (
    <footer id='footer' className='bg-black'>
      <div className='mx-auto max-w-6xl px-3 pt-16 pb-8 sm:pt-24 lg:pt-32 xl:px-0'>
        <div className='xl:grid xl:grid-cols-3 xl:gap-20'>
          <div className='flex flex-col space-y-8'>
            <DotdoLogo className='flex items-center justify-start' as={Link} />
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
          <p className='text-sm leading-5 text-gray-400'>
            &copy; {new Date().getFullYear()}{' '}
            <a href='https://dotdo.ai' className='hover:text-gray-300'>
              .do
            </a>
            , Inc. All rights reserved.
          </p>
          {/* <ProjectStatus /> */}
          <iframe
            src='https://status.workflows.do/badge?theme=dark'
            width='250'
            height='30'
            frameBorder='0'
            scrolling='no'
            style={{ colorScheme: 'normal' }}
            title='System Status'
          />
        </div>
      </div>
    </footer>
  )
}

function MinimalFooter() {
  return (
    <footer id='footer' className='bg-black'>
      <div className='mx-auto max-w-6xl px-3 py-8 xl:px-0'>
        <div className='grid grid-flow-row auto-rows-max items-center gap-y-8 sm:grid-cols-3 sm:gap-y-0'>
          <div className='flex items-center justify-center sm:justify-start'>
            <DotdoLogo className='flex items-center justify-center' as={Link} />
          </div>
          <p className='text-center text-sm leading-5 text-gray-400'>
            &copy; {new Date().getFullYear()}{' '}
            <a href='https://dotdo.ai' className='hover:text-gray-300'>
              .do AI
            </a>
            . All rights reserved.
          </p>
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
