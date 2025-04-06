import { FaGithub } from 'react-icons/fa'
import { FaDiscord } from 'react-icons/fa'
import { cn } from '@/pkgs/ui/src/lib/utils'
import Link from 'next/link'
import { buttonVariants } from '@/pkgs/ui/src/server/components/button'

export interface MobileNavProps {
  isOpen: boolean
  handleClose: () => void
}

export const MobileNav = ({ isOpen, handleClose }: MobileNavProps) => {
  return (
    <div className='bg-background/95 backdrop-blur-md md:hidden'>
      <nav className='container px-4 py-6'>
        <ul className='flex flex-col space-y-6'>
          <li>
            <Link className='hover:text-primary flex items-center text-lg font-medium text-gray-200 transition-colors' href='/sites/blog' onClick={handleClose}>
              Blog
            </Link>
          </li>
          <li>
            <Link
              className='hover:text-primary flex items-center text-lg font-medium text-gray-200 transition-colors'
              href='https://github.com/drivly/ai'
              target='_blank'
              rel='noopener noreferrer'
              onClick={handleClose}>
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
              onClick={handleClose}>
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
              onClick={handleClose}>
              View Docs
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  )
}
