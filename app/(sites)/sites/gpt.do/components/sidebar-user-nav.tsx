'use client'

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar'
import { ChevronUp } from 'lucide-react'
import type { User } from 'next-auth'
import { signOut, useSession } from 'next-auth/react'
import { useTheme } from 'next-themes'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { guestRegex } from '../lib/utils'
import { LoaderIcon } from './icons'

export function SidebarUserNav({ user }: { user: User }) {
  const { setTheme, theme } = useTheme()
  const router = useRouter()
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
              <Link
                href={`${process.env.NEXT_PUBLIC_STRIPE_BUY_CREDITS_URL}${user.email ? '?prefilled_email=' + encodeURIComponent(user.email) : ''}`}
                target='_blank'
                rel='noopener noreferrer'
                className='w-full cursor-pointer'
              >
                Add Credits
              </Link>
            </DropdownMenuItem>

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
