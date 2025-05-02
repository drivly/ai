import { Button } from '../ui/button'
import { Markdown } from '../ui/markdown'
import { Message, MessageAvatar, MessageContent } from '../ui/message'
import { cn } from '@/lib/utils'
import type { UIMessage } from 'ai'
import { motion } from 'motion/react'
import { nanoid } from 'nanoid'
import React, { Fragment } from 'react'
import { useChatMessages } from '../store/context'
import { useModalConfig, useModalUser } from '../store/modal-store'
import { Attachment, ThinkingIndicator } from '../ui'
// import { CollectionList } from './tool-ui/collection-list'
// import type { ChatTools } from '@/app/api/chat/tools'
// import { FindDeals } from './tool-ui/find-deals'
// import { GetDocument } from './tool-ui/get-document'
// import { SearchCollection } from './tool-ui/search-collection'
// import { SearchUsers } from './tool-ui/search-users'

export interface ChatMessageProps {
  chatId: string
  role: UIMessage['role']
  parts: UIMessage['parts']
  attachments: UIMessage['experimental_attachments']
}

export const ChatMessage = ({ chatId, attachments, parts, role }: ChatMessageProps) => {
  const { user } = useModalUser()
  const { config } = useModalConfig()
  const { error, reload } = useChatMessages()
  const isAssistant = role === 'assistant'
  const isThinking = chatId === 'thinking'

  if (isThinking) {
    return <ThinkingIndicator key={chatId} type='cursor' />
  }

  return (
    <Message className='w-full items-start justify-start gap-2 px-4 py-3'>
      <MessageAvatar
        src={isAssistant ? config.aiAvatar || '' : user.avatar || ''}
        alt={isAssistant ? 'AI Assistant' : 'User'}
        fallback={isAssistant ? 'AI' : 'Me'}
        className='size-7 bg-transparent font-bold'
      />

      <motion.div initial={{ y: 5, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className={cn('text-primary flex max-w-[90%] flex-1 flex-col space-y-3')}>
        {parts.map((part, index) => {
          switch (part.type) {
            case 'text': {
              return (
                <Fragment key={index}>
                  {isAssistant ? (
                    <Markdown className='prose dark:prose-invert prose-headings:text-primary prose-h1:text-xl prose-h2:text-lg prose-h3:text-base prose-p:text-[14px] prose-p:leading-[24px] max-w-none text-[14px] whitespace-pre-wrap'>
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

        {error && <ErrorMessage onReload={reload} />}
      </motion.div>
    </Message>
  )
}

function toolLoadingMessage<TArgs extends Record<string, unknown>>(toolName: string, args: TArgs) {
  switch (toolName) {
    case 'getDocument':
      return `Getting document information for ${args.id} from ${args.collection}`
    case 'searchCollection':
      return `Searching ${args.collection} for ${args.query}`
    case 'permissions':
      return 'Listing collections you have access to'
    case 'findDeals':
      return `Searching deals for ${Object.keys(args)
        .map((key) => args[key])
        .join(', ')}`
    case 'searchUsers':
      return `Searching users for ${args.query}${args.role ? ` with role ${args.role}` : ''} ${args.email ? ` with email ${args.email}` : ''}`
    default:
      return 'Loading...'
  }
}

function ErrorMessage({ onReload }: { onReload: () => void }) {
  return (
    <div className='mt-3 flex flex-col items-start justify-start gap-2'>
      <p className='text-muted-foreground text-center text-[14px] leading-[24px] font-medium'>Something went wrong. Please try again.</p>
      <Button onClick={onReload} className='border-border border-2 outline-none' variant='default'>
        Reload
      </Button>
    </div>
  )
}
