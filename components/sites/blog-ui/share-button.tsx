'use client'

import { FaXTwitter, FaLinkedin } from 'react-icons/fa6'
import { FaHackerNews } from 'react-icons/fa'
import { LinkIcon, CheckIcon } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

interface ShareButtonsProps {
  title: string
  url: string
  hideLabel?: boolean
}

export function ShareButtons({ title, url, hideLabel = false }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false)

  const encodedTitle = encodeURIComponent(title)
  const encodedUrl = encodeURIComponent(url)

  const shareLinks = [
    {
      name: 'X',
      icon: <FaXTwitter className='h-5 w-5' />,
      href: `https://x.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
    },
    {
      name: 'LinkedIn',
      icon: <FaLinkedin className='h-5 w-5' />,
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    },
    {
      name: 'HackerNews',
      icon: <FaHackerNews className='h-5 w-5' />,
      href: `https://news.ycombinator.com/submitlink?u=${encodedUrl}&t=${encodedTitle}`,
    },
  ]

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy: ', err)
    }
  }

  return (
    <div className='flex items-center space-x-3 sm:space-x-2'>
      <span className={cn('text-muted-foreground text-sm', hideLabel ? 'hidden sm:inline' : 'inline')}>Share:</span>
      {shareLinks.map((link) => (
        <a
          key={link.name}
          href={link.href}
          target='_blank'
          rel='noopener noreferrer'
          className='hover:text-primary text-gray-500 transition-colors'
          aria-label={`Share on ${link.name}`}
        >
          {link.icon}
        </a>
      ))}
      <button onClick={copyToClipboard} className='hover:text-primary cursor-pointer text-gray-500 transition-colors' aria-label='Copy link'>
        {copied ? <CheckIcon className='h-5 w-5 text-green-500 sm:h-4 sm:w-4' /> : <LinkIcon className='h-5 w-5 sm:h-4 sm:w-4' />}
      </button>
    </div>
  )
}
