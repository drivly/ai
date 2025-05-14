'use client'

import type { Chat } from '@/components/chat/types'
import { useChatHistory } from '@/components/chat/use-chat-history'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { SidebarGroup, SidebarGroupContent, SidebarMenu, useSidebar } from '@/components/ui/sidebar'
import { isToday, isYesterday, subMonths, subWeeks } from 'date-fns'
import { motion } from 'framer-motion'
import type { User } from 'next-auth'
import { useParams, useRouter } from 'next/navigation'
import { useCallback, useState } from 'react'
import { toast } from 'sonner'
import { ChatItem } from './sidebar-history-item'

type GroupedChats = {
  today: Chat[]
  yesterday: Chat[]
  lastWeek: Chat[]
  lastMonth: Chat[]
  older: Chat[]
}

export interface ChatHistory {
  chats: Array<Chat>
  hasMore: boolean
}

// const PAGE_SIZE = 20

const groupChatsByDate = (chats: Chat[]): GroupedChats => {
  const now = new Date()
  const oneWeekAgo = subWeeks(now, 1)
  const oneMonthAgo = subMonths(now, 1)

  return chats.reduce(
    (groups, chat) => {
      const chatDate = new Date(chat.createdAt)

      if (isToday(chatDate)) {
        groups.today.push(chat)
      } else if (isYesterday(chatDate)) {
        groups.yesterday.push(chat)
      } else if (chatDate > oneWeekAgo) {
        groups.lastWeek.push(chat)
      } else if (chatDate > oneMonthAgo) {
        groups.lastMonth.push(chat)
      } else {
        groups.older.push(chat)
      }

      return groups
    },
    {
      today: [],
      yesterday: [],
      lastWeek: [],
      lastMonth: [],
      older: [],
    } as GroupedChats,
  )
}

export function SidebarHistory({ user, basePath }: { user: User | undefined; basePath: string }) {
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const router = useRouter()
  const { id } = useParams()

  const { setOpenMobile } = useSidebar()
  const { getAllChatSessions, removeChatSession } = useChatHistory()

  const chatSessions = getAllChatSessions()

  const handleDelete = useCallback(async () => {
    const deletePromise = new Promise((resolve, reject) => {
      setTimeout(() => {
        if (deleteId) {
          removeChatSession(deleteId)
          resolve('Chat deleted successfully')
        } else {
          reject('No chat ID to delete')
        }
      }, 1000)
    })

    toast.promise(deletePromise, {
      loading: 'Deleting chat...',
      success: 'Chat deleted successfully',
      error: 'Failed to delete chat',
    })

    setShowDeleteDialog(false)

    if (deleteId === id) {
      router.push(basePath + '/new')
    }
  }, [deleteId, id, basePath, router, removeChatSession])

  if (!user) {
    return (
      <SidebarGroup>
        <SidebarGroupContent>
          <div className='flex w-full flex-row items-center justify-center gap-2 px-2 text-sm text-zinc-500'>Login to save and revisit previous chats!</div>
        </SidebarGroupContent>
      </SidebarGroup>
    )
  }

  if (chatSessions.length === 0) {
    return (
      <SidebarGroup>
        <SidebarGroupContent>
          <div className='flex w-full flex-row items-center justify-center gap-2 px-2 text-sm text-zinc-500'>Your conversations will appear here once you start chatting!</div>
        </SidebarGroupContent>
      </SidebarGroup>
    )
  }

  return (
    <>
      <SidebarGroup>
        <SidebarGroupContent>
          <SidebarMenu>
            {chatSessions &&
              (() => {
                const chatsFromHistory = chatSessions.flatMap((chatHistory) => chatHistory)

                const groupedChats = groupChatsByDate(chatsFromHistory)

                return (
                  <div className='flex flex-col gap-6'>
                    {groupedChats.today.length > 0 && (
                      <div>
                        <div className='text-sidebar-foreground/50 px-2 py-1 text-xs'>Today</div>
                        {groupedChats.today.map((chat) => (
                          <ChatItem
                            key={chat.id}
                            chat={chat}
                            isActive={chat.id === id}
                            onDelete={(chatId) => {
                              setDeleteId(chatId)
                              setShowDeleteDialog(true)
                            }}
                            setOpenMobile={setOpenMobile}
                            basePath={basePath}
                          />
                        ))}
                      </div>
                    )}

                    {groupedChats.yesterday.length > 0 && (
                      <div>
                        <div className='text-sidebar-foreground/50 px-2 py-1 text-xs'>Yesterday</div>
                        {groupedChats.yesterday.map((chat) => (
                          <ChatItem
                            key={chat.id}
                            chat={chat}
                            isActive={chat.id === id}
                            onDelete={(chatId) => {
                              setDeleteId(chatId)
                              setShowDeleteDialog(true)
                            }}
                            setOpenMobile={setOpenMobile}
                            basePath={basePath}
                          />
                        ))}
                      </div>
                    )}

                    {groupedChats.lastWeek.length > 0 && (
                      <div>
                        <div className='text-sidebar-foreground/50 px-2 py-1 text-xs'>Last 7 days</div>
                        {groupedChats.lastWeek.map((chat) => (
                          <ChatItem
                            key={chat.id}
                            chat={chat}
                            isActive={chat.id === id}
                            onDelete={(chatId) => {
                              setDeleteId(chatId)
                              setShowDeleteDialog(true)
                            }}
                            setOpenMobile={setOpenMobile}
                            basePath={basePath}
                          />
                        ))}
                      </div>
                    )}

                    {groupedChats.lastMonth.length > 0 && (
                      <div>
                        <div className='text-sidebar-foreground/50 px-2 py-1 text-xs'>Last 30 days</div>
                        {groupedChats.lastMonth.map((chat) => (
                          <ChatItem
                            key={chat.id}
                            chat={chat}
                            isActive={chat.id === id}
                            onDelete={(chatId) => {
                              setDeleteId(chatId)
                              setShowDeleteDialog(true)
                            }}
                            setOpenMobile={setOpenMobile}
                            basePath={basePath}
                          />
                        ))}
                      </div>
                    )}

                    {groupedChats.older.length > 0 && (
                      <div>
                        <div className='text-sidebar-foreground/50 px-2 py-1 text-xs'>Older than last month</div>
                        {groupedChats.older.map((chat) => (
                          <ChatItem
                            key={chat.id}
                            chat={chat}
                            isActive={chat.id === id}
                            onDelete={(chatId) => {
                              setDeleteId(chatId)
                              setShowDeleteDialog(true)
                            }}
                            setOpenMobile={setOpenMobile}
                            basePath={basePath}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )
              })()}
          </SidebarMenu>

          <motion.div className='h-10' />
        </SidebarGroupContent>
      </SidebarGroup>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone. This will permanently delete your chat and remove it from our servers.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
