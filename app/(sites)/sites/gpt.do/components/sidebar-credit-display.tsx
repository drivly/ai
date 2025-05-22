'use client'

import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { CreditCard, Info } from 'lucide-react'
import { useCreditQuery } from '../hooks/use-credit-query'

interface SidebarCreditDisplayProps {
  apiKey?: string
  email?: string | null
  className?: string
}

export function SidebarCreditDisplay({ apiKey, email, className }: SidebarCreditDisplayProps) {
  const { data: credit } = useCreditQuery(apiKey)

  const handleAddCredits = () => {
    const url = new URL(process.env.NEXT_PUBLIC_STRIPE_BUY_CREDITS_URL || '')
    if (email) url.searchParams.set('prefilled_email', email)
    window.open(url.toString(), '_blank')
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem className={className}>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <SidebarMenuButton className='h-10 cursor-pointer justify-between bg-transparent transition-colors' onClick={handleAddCredits}>
                <div className='flex items-center gap-2'>
                  <CreditCard className='size-4' />
                  <span>
                    Credits:{' '}
                    {!credit ? (
                      <span className='animate-pulse text-zinc-400'>…</span>
                    ) : (
                      <span className={cn('font-ibm', credit && credit < 1 ? 'text-destructive' : 'text-emerald-700 dark:text-emerald-400')}>${credit}</span>
                    )}
                  </span>
                </div>
                <Info className='!size-3 shrink-0 text-zinc-400' />
              </SidebarMenuButton>
            </TooltipTrigger>
            <TooltipContent side='top'>
              <p className='flex flex-col'>
                <span className='font-medium'>API Credit Balance</span>
                <span className='text-muted-foreground text-xs'>Click to add more credits to your account</span>
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
