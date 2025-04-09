import { RiArrowRightUpLine, RiDiscordFill, RiGithubFill, RiNpmjsFill, RiTwitterXFill } from '@remixicon/react'
import Link from 'next/link'
import { siteConfig } from '../site-config'

const navigation = {
  products: [
    { name: 'Workflows.do', href: 'https://workflows.do/', external: false },
    { name: 'Functions.do', href: 'https://functions.do/', external: false },
    { name: 'LLM.do', href: 'https://llm.do/', external: false },
    { name: 'APIs.do', href: 'https://apis.do/', external: false },
    { name: 'Directory', href: 'https://dotdo.ai/', external: false },
  ],
  developers: [
    { name: 'Docs', href: 'https://workflows.do/docs', external: true },
    { name: 'Changelog', href: 'https://dotdo.ai/careers', external: true },
    { name: 'Reference', href: 'https://docs.apis.do/reference#tag/functions', external: true },
    { name: 'Status', href: '#', external: true },
  ],
  resources: [
    { name: 'Blog', href: 'https://dotdo.ai/blog', external: false },
    { name: 'Pricing', href: 'https://dotdo.ai/pricing', external: false },
    { name: 'Enterprise', href: '#', external: true },
    { name: 'Privacy', href: '#', external: false },
    { name: 'Terms', href: '#', external: false },
  ],
  company: [
    { name: 'About', href: 'https://dotdo.ai/docs/manifesto', external: false },
    { name: 'Careers', href: 'https://dotdo.ai/careers', external: false },
    { name: 'Contact', href: '#', external: true },
    { name: 'Privacy', href: siteConfig.baseLinks.privacy, external: false },
    { name: 'Terms', href: siteConfig.baseLinks.terms, external: false },
  ],
}

export function Footer() {
  return (
    <footer id='footer' className='bg-black'>
      <div className='mx-auto max-w-6xl px-3 pt-16 pb-8 sm:pt-24 lg:pt-32'>
        <div className='xl:grid xl:grid-cols-3 xl:gap-20'>
          <div className='space-y-8'>
            <div className='flex items-center'>
              <div className='relative flex h-8 w-20 items-center justify-center'>
                {/* Use a direct SVG element instead of an img tag */}

                <svg width='268' height='148' viewBox='0 0 268 148' fill='none' xmlns='http://www.w3.org/2000/svg' className='h-full w-full'>
                  <path d='M181.102 0.127563L197.762 0.127563L231.083 73.8492L197.762 147.571H182.082L215.402 73.8492L181.102 0.127563Z' fill='#3063B6' />
                  <path
                    d='M162.917 147.203H147.938V0H162.917V147.203ZM158.294 147.203H120.753V134.628H158.294V147.203ZM158.294 12.5752H120.753V0H158.294V12.5752Z'
                    fill='#34D399'
                  />
                  <path
                    d='M65.8659 147.203H58.8386V134.628H64.5714C70.1193 134.628 74.5576 132.841 77.8863 129.265C81.215 125.69 82.8794 120.758 82.8794 114.471V97.6424C82.8794 90.7384 84.5438 85.1288 87.8725 80.8138C91.3245 76.4988 95.8244 73.6016 101.372 72.1222V75.4509C95.9477 73.9715 91.5094 71.0742 88.0574 66.7592C84.6054 62.4442 82.8794 56.7731 82.8794 49.7458V32.7323C82.8794 26.6913 81.215 21.8215 77.8863 18.1229C74.5576 14.4243 70.1193 12.575 64.5714 12.575H58.8386V0.184814H65.8659C72.2768 0.184814 77.8863 1.54096 82.6945 4.25324C87.5026 6.84225 91.2628 10.5408 93.9751 15.349C96.6874 20.0338 98.0436 25.5817 98.0436 31.9926V52.1498C98.0436 56.095 99.4614 59.6703 102.297 62.8757C105.133 65.9579 108.769 67.8688 113.208 68.6085V79.1495C108.769 79.8892 105.133 81.7385 102.297 84.6973C99.4614 87.5329 98.0436 91.0466 98.0436 95.2383V115.211C98.0436 121.868 96.6874 127.539 93.9751 132.224C91.2628 137.032 87.5026 140.731 82.6945 143.32C77.8863 145.909 72.2768 147.203 65.8659 147.203Z'
                    fill='#F87171'
                  />
                  <path
                    d='M15.719 147.203H0C7.64373 134.628 13.0683 122.361 16.2737 110.402C19.4792 98.3204 21.0819 86.1151 21.0819 73.7865C21.0819 61.3346 19.4792 49.1293 16.2737 37.1706C13.0683 25.0886 7.64373 12.76 0 0.184814H15.719C22.9928 13.1298 28.2325 25.5201 31.4379 37.3555C34.7666 49.0677 36.431 61.2114 36.431 73.7865C36.431 85.9918 34.7666 98.0122 31.4379 109.848C28.2325 121.683 22.9928 134.135 15.719 147.203Z'
                    fill='#FFC857'
                  />
                  <path d='M231.672 132.537H267.184V147.531H224.701L231.672 132.537Z' fill='#D1D5DB' />
                </svg>
              </div>
            </div>
            <p className='text-sm leading-6 text-gray-400'>{siteConfig.description}</p>

            <div className='mt-6 flex space-x-4'>
              <a href={siteConfig.baseLinks.github} target='_blank' rel='noopener noreferrer' className='text-gray-400 transition-colors hover:text-white'>
                <RiGithubFill className='size-6' aria-hidden='true' />
                <span className='sr-only'>GitHub</span>
              </a>
              <a href={siteConfig.baseLinks.discord} target='_blank' rel='noopener noreferrer' className='text-gray-400 transition-colors hover:text-white'>
                <RiDiscordFill className='size-6' aria-hidden='true' />
                <span className='sr-only'>Discord</span>
              </a>
              <a href={siteConfig.baseLinks.twitter} target='_blank' rel='noopener noreferrer' className='text-gray-400 transition-colors hover:text-white'>
                <RiTwitterXFill className='size-6' aria-hidden='true' />
                <span className='sr-only'>Twitter X</span>
              </a>
              <a href={siteConfig.baseLinks.npm} target='_blank' rel='noopener noreferrer' className='text-gray-400 transition-colors hover:text-white'>
                <RiNpmjsFill className='size-6' aria-hidden='true' />
                <span className='sr-only'>NPM</span>
              </a>
            </div>
          </div>
          <div className='mt-16 grid grid-cols-1 gap-14 sm:gap-8 md:grid-cols-2 xl:col-span-2 xl:mt-0'>
            <div className='grid grid-cols-2 gap-8'>
              <div>
                <h3 className='text-sm leading-6 font-semibold text-white'>
                  <span className='mr-1 rounded-md border-[.5px] border-slate-800/50 bg-slate-600/50 bg-[linear-gradient(_rgba(0,0,0,0)_0%,_rgb(0,0,0)_100%,_rgb(0,0,0)_100%)] px-2 py-1 font-normal text-slate-300 shadow-lg'>
                    .do
                  </span>
                  Products
                </h3>
                <ul role='list' className='mt-6 space-y-4' aria-label='Quick links Products'>
                  {navigation.products.map((item) => (
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
                  {navigation.developers.map((item) => (
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
                  {navigation.resources.map((item) => (
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
                  {navigation.company.map((item) => (
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
