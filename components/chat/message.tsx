'use client'

import { Attachment } from '@/components/ui/attachment'
import { Button } from '@/components/ui/button'
import { Markdown } from '@/components/ui/markdown'
import { MessageAvatar, MessageContent } from '@/components/ui/message'
import { useAuthUser } from '@/hooks/use-auth-user'
import { cn } from '@/lib/utils'
import type { UIMessage } from 'ai'
import { AnimatePresence, motion } from 'motion/react'
import { nanoid } from 'nanoid'
import { Fragment } from 'react'
import { useChatMessages } from './context'
import { ThinkingIndicator } from './thinking'
import { ErrorMessage } from './error-message'

export interface ChatMessageProps {
  chatId: string
  role: UIMessage['role']
  parts: UIMessage['parts']
  attachments: UIMessage['experimental_attachments']
  content: UIMessage['content']
}

type Message = {
  id: string
  chatId: string
  role: string
  parts: UIMessage['parts']
  attachments: UIMessage['experimental_attachments']
  createdAt: Date
}

export const ChatMessage = ({ chatId, attachments, parts, role, content }: ChatMessageProps) => {
  const user = useAuthUser()
  const { error, reload } = useChatMessages()
  const isAssistant = role === 'assistant'
  const isThinking = chatId === 'thinking'

  if (isThinking) {
    return <ThinkingIndicator key={chatId} type='cursor' className='mx-auto flex w-full max-w-4xl gap-4 px-4' />
  }

  return (
    <AnimatePresence>
      <motion.div
        data-testid={`message-${role}`}
        className='group/message mx-auto flex w-full max-w-4xl gap-4 px-4'
        initial={{ y: 5, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        data-role={role}>
        <MessageAvatar
          src={isAssistant ? '' : user?.image || ''}
          alt={isAssistant ? 'AI Assistant' : 'User'}
          fallback={isAssistant ? 'AI' : 'Me'}
          className='size-7 bg-transparent font-bold'
        />

        <div className={cn('text-primary flex max-w-[90%] flex-1 flex-col space-y-3')}>
          {parts.map((part, index) => {
            switch (part.type) {
              case 'text': {
                return (
                  <Fragment key={index}>
                    {isAssistant ? (
                      <Markdown className='prose dark:prose-invert prose-headings:text-primary prose-h1:text-xl prose-h2:text-lg prose-h3:text-base prose-p:text-[14px] prose-p:leading-[24px] max-w-none text-[14px]'>
                        {part.text}
                      </Markdown>
                    ) : (
                      <MessageContent className='text-primary bg-transparent p-0 text-[14px] leading-[24px]'>{part.text}</MessageContent>
                    )}

                    {attachments?.map((attachment, index) => (
                      <Attachment
                        key={index}
                        id={nanoid()}
                        url={attachment.url}
                        thumbnailUrl={attachment.url}
                        name={attachment.name || ''}
                        type={attachment.contentType?.includes('image') ? 'image' : 'pdf'}
                        size={0}
                        className='mt-3'
                      />
                    ))}
                  </Fragment>
                )
              }
            }
          })}

          {(!parts || parts.length === 0) && content && <Markdown>{content}</Markdown>}

          {error && <ErrorMessage onReload={reload} />}
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

 
