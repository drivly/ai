'use client'

import { setChatModelCookie } from '@/app/(sites)/sites/gpt.do/gpt.action'
import { PlusIcon } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import React, { useCallback } from 'react'
import { useWindowSize } from 'usehooks-ts'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'
import { SidebarToggle } from './sidebar-toggle'
import { resolvePathname } from './utils'
import { VisibilitySelector, VisibilityType } from './visibility-selector'
// import { ModelSelector } from './model-selector'

import { Session } from 'next-auth'
import { useSidebar } from '../ui/sidebar'

interface ChatHeaderProps {
  chatId: string
  selectedModelId: string
  setSelectedModelId: (value: string) => void
  selectedVisibilityType: VisibilityType
  isReadonly: boolean
  session: Session
}

export function ChatHeader({ chatId, selectedModelId, setSelectedModelId, selectedVisibilityType, isReadonly, session }: ChatHeaderProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { width: windowWidth } = useWindowSize()
  const { open } = useSidebar()

  const handleModelChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      setSelectedModelId(e.target.value)
      await setChatModelCookie(e.target.value)
    },
    [setSelectedModelId],
  )

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.currentTarget.blur()
    }
  }, [])

  const basePath = resolvePathname(pathname)

  return (
    <header className='bg-background sticky top-0 flex items-center gap-2 px-2 py-1.5 md:px-2'>
      <SidebarToggle />

      {(!open || windowWidth < 768) && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='outline'
              className='order-2 ml-auto px-2 md:order-1 md:ml-0 md:h-fit md:px-2'
              onClick={() => {
                router.push(basePath + '/new')
                router.refresh()
              }}>
              <PlusIcon />
              <span className='md:sr-only'>New Chat</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>New Chat</TooltipContent>
        </Tooltip>
      )}

      {/* TODO: model selector currently input but should be dropdown */}
      <Input
        type='text'
        value={selectedModelId}
        onChange={handleModelChange}
        onKeyDown={handleKeyDown}
        placeholder='Enter model name (e.g. gpt-4o)'
        className='order-1 w-full min-w-[200px] md:order-2'
        style={{ width: `${Math.max(200, selectedModelId.length * 10)}px` }}
        spellCheck={false}
      />
      {/* {!isReadonly && <ModelSelector session={session} selectedModelId={modelValue} className='order-1 md:order-2' />} */}

      {!isReadonly && <VisibilitySelector chatId={chatId} selectedVisibilityType={selectedVisibilityType} className='order-1 md:order-3' />}
    </header>
  )
}

//  Deploy with Vercel button
// import { VercelIcon } from './icons'
//  ;<Button
//   className='order-4 hidden h-fit bg-zinc-900 px-2 py-1.5 text-zinc-50 hover:bg-zinc-800 md:ml-auto md:flex md:h-[34px] dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200'
//   asChild>
//   <Link
//     href={`https://vercel.com/new/clone?repository-url=https://github.com/vercel/ai-chatbot&env=AUTH_SECRET&envDescription=Learn more about how to get the API Keys for the application&envLink=https://github.com/vercel/ai-chatbot/blob/main/.env.example&demo-title=AI Chatbot&demo-description=An Open-Source AI Chatbot Template Built With Next.js and the AI SDK by Vercel.&demo-url=https://chat.vercel.ai&products=[{"type":"integration","protocol":"ai","productSlug":"grok","integrationSlug":"xai"},{"type":"integration","protocol":"storage","productSlug":"neon","integrationSlug":"neon"},{"type":"blob"}]`}
//     target='_noblank'>
//     <VercelIcon size={16} />
//     Deploy with Vercel
//   </Link>
// </Button>
