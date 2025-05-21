'use client'

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { ChevronUp, Info } from 'lucide-react'
import type { User } from 'next-auth'
import { signOut, useSession } from 'next-auth/react'
import { useTheme } from 'next-themes'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { useCreditQuery } from '../hooks/use-credit-query'
import { guestRegex } from '../lib/utils'
import { LoaderIcon } from './icons'

// TODO: add stripe add credits link
// TODO: add balance widget here

export function SidebarUserNav({ user }: { user: User }) {
  const { setTheme, theme } = useTheme()
  const router = useRouter()
  const { data: credit } = useCreditQuery(user.apiKey)
  const { status } = useSession()

  const isGuest = guestRegex.test(user?.email ?? '')

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            {status === 'loading' ? (
              <SidebarMenuButton className='data-[state=open]:bg-sidebar-accent bg-background data-[state=open]:text-sidebar-accent-foreground h-10 justify-between'>
                <div className='flex flex-row gap-2'>
                  <div className='size-6 animate-pulse rounded-full bg-zinc-500/30' />
                  <span className='animate-pulse rounded-md bg-zinc-500/30 text-transparent'>Loading auth status</span>
                </div>
                <div className='animate-spin text-zinc-500'>
                  <LoaderIcon />
                </div>
              </SidebarMenuButton>
            ) : (
              <SidebarMenuButton
                data-testid='user-nav-button'
                className='data-[state=open]:bg-sidebar-accent bg-background data-[state=open]:text-sidebar-accent-foreground h-10 cursor-pointer'
              >
                <Image src={user?.image ?? `https://avatar.vercel.sh/${user.email}`} alt={user.email ?? 'User Avatar'} width={24} height={24} className='rounded-full' />
                <span data-testid='user-email' className='truncate'>
                  {isGuest ? 'Guest' : user?.email}
                </span>
                <ChevronUp className='ml-auto' />
              </SidebarMenuButton>
            )}
          </DropdownMenuTrigger>
          <DropdownMenuContent data-testid='user-nav-menu' side='top' className='bg-background w-(--radix-popper-anchor-width)'>
            <DropdownMenuItem data-testid='user-nav-item-theme' className='cursor-pointer' asChild>
              <button type='button' className='w-full cursor-pointer' onClick={() => router.push('https://buy.stripe.com/test_14AdRbcyF6FU4qW6i28Vi00')}>
                Add Credits
              </button>
            </DropdownMenuItem>

            <TooltipProvider>
              <Tooltip>
                <DropdownMenuItem data-testid='user-nav-item-theme' className='cursor-pointer' asChild>
                  <TooltipTrigger asChild>
                    <span className='flex items-center justify-between gap-1'>
                      <span>
                        Balance:{' '}
                        {!credit ? (
                          <span className='animate-pulse text-zinc-400'>…</span>
                        ) : (
                          <span className={cn('text-primary font-ibm font-medium', credit && credit < 10 && 'text-destructive')}>{credit}</span>
                        )}
                      </span>
                      <Info className='ml-1 size-3 text-zinc-400' />
                      <TooltipContent side='right'>
                        <span>Your remaining API credits for this account.</span>
                      </TooltipContent>
                    </span>
                  </TooltipTrigger>
                </DropdownMenuItem>
              </Tooltip>
            </TooltipProvider>

            <DropdownMenuItem data-testid='user-nav-item-theme' className='cursor-pointer' onSelect={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
              {`Toggle ${theme === 'light' ? 'dark' : 'light'} mode`}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild data-testid='user-nav-item-auth'>
              <button
                type='button'
                className='w-full cursor-pointer'
                onClick={() => {
                  if (status === 'loading') {
                    toast.error('Checking authentication status, please try again!')

                    return
                  }

                  if (isGuest) {
                    router.push('/login')
                  } else {
                    signOut({
                      redirectTo: '/',
                    })
                  }
                }}
              >
                {isGuest ? 'Login to your account' : 'Sign out'}
              </button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
