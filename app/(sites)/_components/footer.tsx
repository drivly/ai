import { FaDiscord, FaGithub, FaXTwitter } from 'react-icons/fa6'
import Link from 'next/link'

const footerSocials = [
  {
    href: 'https://github.com',
    name: 'GitHub',
    icon: <FaGithub className='h-5 w-5' />,
  },
  {
    href: 'https://discord.gg/qus39VeA',
    name: 'Discord',
    icon: <FaDiscord className='h-5 w-5' />,
  },
  // {
  //   href: 'https://x.com',
  //   name: 'X',
  //   icon: <FaXTwitter className='h-5 w-5' />,
  // },
]

export function Footer() {
  return (
    <footer className='mt-auto'>
      <div className='container mx-auto px-3 sm:px-8 md:px-8 lg:px-8'>
        <div className='flex flex-col gap-4 rounded-md border-neutral-700/20 py-8 sm:flex-row sm:items-center sm:justify-between sm:py-12'>
          {/* Social icons on the left */}
          <div className='flex justify-center space-x-5 sm:justify-start'>
            {footerSocials.map((social) => (
              <Link key={social.name} href={social.href} className='hover:text-primary text-gray-500 transition-colors' target='_blank' rel='noopener noreferrer'>
                {social.icon}
                <span className='sr-only'>{social.name}</span>
              </Link>
            ))}
          </div>

          <span className='order-3 text-center text-sm text-gray-500 sm:order-2 dark:text-gray-400'>
            Copyright © {new Date().getFullYear()}{' '}
            <Link href='/' className='cursor-pointer'>
              llm.do
            </Link>
            . All Rights Reserved.
          </span>

          {/* Terms, Privacy, and Jobs */}
          <div className='order-2 flex justify-center space-x-6 sm:order-3 sm:justify-end'>
            <Link href='https://careers.do' className='hover:text-primary text-sm text-gray-500 transition-colors' target='_blank' rel='noopener noreferrer'>
              Jobs
            </Link>
            <Link href='/terms' className='hover:text-primary text-sm text-gray-500 transition-colors'>
              Terms
            </Link>
            <Link href='/privacy' className='hover:text-primary text-sm text-gray-500 transition-colors'>
              Privacy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
