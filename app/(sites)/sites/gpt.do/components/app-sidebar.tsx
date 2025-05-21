'use client'

import { Button } from '@/components/ui/button'
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, useSidebar } from '@/components/ui/sidebar'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { useAuthUser } from '@/hooks/use-auth-user'
import { PlusIcon } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Suspense } from 'react'
import { resolvePathname } from '../lib/utils'
import { SidebarHistory } from './sidebar-history'
import { SidebarUserNav } from './sidebar-user-nav'
import Spinner from './spinner'

export function AppSidebar() {
  const user = useAuthUser()
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
              className='flex flex-row items-center gap-3'
            >
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
                  }}
                >
                  <PlusIcon />
                </Button>
              </TooltipTrigger>
              <TooltipContent align='end'>New Chat</TooltipContent>
            </Tooltip>
          </div>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <Suspense fallback={<Spinner height={24} width={24} className='text-muted-foreground/50' />}>
          <SidebarHistory user={user} basePath={basePath} />
        </Suspense>
      </SidebarContent>
      <SidebarFooter>
        <Suspense fallback={<Spinner height={24} width={24} className='text-muted-foreground/50' />}>{user && <SidebarUserNav user={user} />}</Suspense>
      </SidebarFooter>
    </Sidebar>
  )
}
