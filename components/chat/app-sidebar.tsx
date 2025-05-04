'use client'

import type { User } from 'next-auth'
import { usePathname, useRouter } from 'next/navigation'
import { SidebarHistory } from '@/components/chat/sidebar-history'
import { SidebarUserNav } from '@/components/chat/sidebar-user-nav'
import { Button } from '@/components/ui/button'
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, useSidebar } from '@/components/ui/sidebar'
import { PlusIcon } from 'lucide-react'
import Link from 'next/link'
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'
import { resolvePathname } from './utils'

export function AppSidebar({ user }: { user: User | undefined }) {
  const pathname = usePathname()
  const router = useRouter()
  const basePath = resolvePathname(pathname)

  const { setOpenMobile } = useSidebar()

  return (
    <Sidebar className='group-data-[side=left]:border-r-0'>
      <SidebarHeader>
        <SidebarMenu>
          <div className='flex flex-row items-center justify-between'>
            <Link
              href='/'
              onClick={() => {
                setOpenMobile(false)
              }}
              className='flex flex-row items-center gap-3'>
              <span className='hover:bg-muted cursor-pointer rounded-md px-2 text-lg font-semibold'>GPT.do</span>
            </Link>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant='ghost'
                  type='button'
                  className='h-fit cursor-pointer p-2'
                  onClick={() => {
                    setOpenMobile(false)
                    router.push(basePath + '/new')
                    router.refresh()
                  }}>
                  <PlusIcon />
                </Button>
              </TooltipTrigger>
              <TooltipContent align='end'>New Chat</TooltipContent>
            </Tooltip>
          </div>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarHistory user={user} basePath={basePath} />
      </SidebarContent>
      <SidebarFooter>{user && <SidebarUserNav user={user} />}</SidebarFooter>
    </Sidebar>
  )
}
