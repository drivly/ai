'use client'

import { Button } from '@/components/ui/button'
import { useAuthUser } from '@/hooks/use-auth-user'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

export function SidebarHistory() {
  const user = useAuthUser()
  const pathname = usePathname()
  const [chats, setChats] = useState<any[]>([])

  useEffect(() => {
    const fetchChats = async () => {
      try {
      } catch (error) {
        console.error('Failed to fetch chat history', error)
      }
    }

    if (user) {
      fetchChats()
    }
  }, [user])

  return (
    <div className='flex flex-col gap-2 p-4'>
      <Button className='w-full' asChild>
        <Link href='/chat/new'>New Chat</Link>
      </Button>
      <div className='mt-4 flex flex-col gap-1'>
        {chats.map((chat) => (
          <Button key={chat.id} variant={pathname === `/chat/${chat.id}` ? 'secondary' : 'ghost'} className='h-auto justify-start px-3 py-2 text-sm' asChild>
            <Link href={`/chat/${chat.id}`}>{chat.title || 'Untitled Chat'}</Link>
          </Button>
        ))}
      </div>
    </div>
  )
}
