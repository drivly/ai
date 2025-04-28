'use client'

import React from 'react'
import { Button } from '../ui/button'
import { X } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function ChatHeader({ chatId }: { chatId: string }) {
  const pathname = usePathname()
  const isHomePage = pathname === '/'

  return (
    <header className='flex h-14 shrink-0 items-center border-b px-4 md:px-6'>
      <div className='flex flex-1 items-center gap-2'>
        <h1 className='text-xl font-semibold'>Chat</h1>
      </div>
      <div className='flex items-center gap-2'>
        <Button variant='ghost' size='icon' asChild>
          <Link href={isHomePage ? '/chat' : '/'}>
            <X className='h-5 w-5' />
            <span className='sr-only'>Close</span>
          </Link>
        </Button>
      </div>
    </header>
  )
}
