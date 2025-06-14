import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { SidebarMenuAction, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar'
import Link from 'next/link'
import { memo } from 'react'
import { useChatVisibility } from '../hooks/use-chat-visibility'
import type { Chat } from '../lib/types'
import { CheckCircleFillIcon, GlobeIcon, LockIcon, MoreHorizontalIcon, ShareIcon, TrashIcon } from './icons'

interface SidebarHistoryItemProps {
  chat: Chat
  basePath: string
  isActive: boolean
  onDelete: (chatId: string) => void
  setOpenMobile: (open: boolean) => void
}

const PureChatItem = ({ chat, isActive, onDelete, setOpenMobile, basePath }: SidebarHistoryItemProps) => {
  const { visibilityType, setVisibilityType } = useChatVisibility({
    chatId: chat.id,
    initialVisibilityType: chat.visibility,
  })

  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild isActive={isActive}>
        <Link href={`${basePath}/${chat.id}`} onClick={() => setOpenMobile(false)}>
          <span>{chat.title}</span>
        </Link>
      </SidebarMenuButton>

      <DropdownMenu modal={true}>
        <DropdownMenuTrigger asChild>
          <SidebarMenuAction className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground mr-0.5' showOnHover={!isActive}>
            <MoreHorizontalIcon />
            <span className='sr-only'>More</span>
          </SidebarMenuAction>
        </DropdownMenuTrigger>

        <DropdownMenuContent side='bottom' align='end'>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger className='cursor-pointer'>
              <ShareIcon />
              <span>Share</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuItem
                  className='cursor-pointer flex-row justify-between'
                  onClick={() => {
                    setVisibilityType('private')
                  }}>
                  <div className='flex flex-row items-center gap-2'>
                    <LockIcon size={12} />
                    <span>Private</span>
                  </div>
                  {visibilityType === 'private' ? <CheckCircleFillIcon /> : null}
                </DropdownMenuItem>
                <DropdownMenuItem
                  className='cursor-pointer flex-row justify-between'
                  onClick={() => {
                    setVisibilityType('public')
                  }}>
                  <div className='flex flex-row items-center gap-2'>
                    <GlobeIcon />
                    <span>Public</span>
                  </div>
                  {visibilityType === 'public' ? <CheckCircleFillIcon /> : null}
                </DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>

          <DropdownMenuItem className='text-destructive focus:bg-destructive/15 focus:text-destructive cursor-pointer dark:text-red-500' onSelect={() => onDelete(chat.id)}>
            <TrashIcon />
            <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  )
}

export const ChatItem = memo(PureChatItem, (prevProps, nextProps) => {
  if (prevProps.isActive !== nextProps.isActive) return false
  return true
})
