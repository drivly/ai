import { siteConfig } from '@/components/site-config'
import Link from 'next/link'
import { Fragment } from 'react'
import { FaDiscord, FaGithub } from 'react-icons/fa'

export const SocialIcons = () => {
  return (
    <Fragment>
      <Link href={siteConfig.baseLinks.github} className='hover:text-primary text-sm text-gray-400 transition-colors' target='_blank' rel='noopener noreferrer'>
        <FaGithub className='h-5 w-5' />
        <span className='sr-only'>GitHub</span>
      </Link>
      <Link href={siteConfig.baseLinks.discord} className='hover:text-primary text-sm text-gray-400 transition-colors' target='_blank' rel='noopener noreferrer'>
        <FaDiscord className='h-5 w-5' />
        <span className='sr-only'>Discord</span>
      </Link>
    </Fragment>
  )
}
