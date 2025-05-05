'use client'

import { startTransition, useMemo, useOptimistic, useState } from 'react'

import { setChatModelCookie } from '@/app/(sites)/sites/gpt.do/gpt.action'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { chatModels } from './models'
import { cn } from '@/lib/utils'

import { CheckCircleFillIcon, ChevronDownIcon } from './icons'
import { entitlementsByUserType } from './entitlements'
import type { Session } from 'next-auth'

export function ModelSelector({
  session,
  selectedModelId,
  className,
}: {
  session: Session
  selectedModelId: string
} & React.ComponentProps<typeof Button>) {
  const [open, setOpen] = useState(false)
  const [optimisticModelId, setOptimisticModelId] = useOptimistic(selectedModelId)

  const userType = session.user.type
  const { availableChatModelIds } = entitlementsByUserType[userType ?? 'guest']

  const availableChatModels = chatModels.filter((chatModel) => availableChatModelIds.includes(chatModel.id))

  const selectedChatModel = useMemo(() => availableChatModels.find((chatModel) => chatModel.id === optimisticModelId), [optimisticModelId, availableChatModels])

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild className={cn('data-[state=open]:bg-accent data-[state=open]:text-accent-foreground w-fit', className)}>
        <Button data-testid='model-selector' variant='outline' className='md:h-[34px] md:px-2'>
          {selectedChatModel?.name}
          <ChevronDownIcon />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align='start' className='min-w-[300px]'>
        {availableChatModels.map((chatModel) => {
          const { id } = chatModel

          return (
            <DropdownMenuItem
              data-testid={`model-selector-item-${id}`}
              key={id}
              onSelect={() => {
                setOpen(false)

                startTransition(() => {
                  setOptimisticModelId(id)
                  setChatModelCookie(id)
                })
              }}
              data-active={id === optimisticModelId}
              asChild>
              <button type='button' className='group/item flex w-full flex-row items-center justify-between gap-4'>
                <div className='flex flex-col items-start gap-1'>
                  <div>{chatModel.name}</div>
                  <div className='text-muted-foreground text-xs'>{chatModel.description}</div>
                </div>

                <div className='text-foreground dark:text-foreground opacity-0 group-data-[active=true]/item:opacity-100'>
                  <CheckCircleFillIcon />
                </div>
              </button>
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
