import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Attachment } from '@/components/ui/attachment'
import { Markdown } from '@/components/ui/markdown'
import { MessageAvatar, MessageContent } from '@/components/ui/message'
import { useAuthUser } from '@/hooks/use-auth-user'
import { cn } from '@/lib/utils'
import gptAvatar from '@/public/gptAvatar.png'
import type { UseChatHelpers } from '@ai-sdk/react'
import type { UIMessage } from 'ai'
import { nanoid } from 'nanoid'
import { Fragment } from 'react'
import { formatToolResult, snakeToHumanCase } from '../../lib/utils'
import { ErrorMessage } from './error-message'
import { MessageReasoning } from './message-reasoning'
import { AnimatePresence } from 'framer-motion'
import { motion } from 'framer-motion'

export interface ChatMessageProps {
  message: UIMessage
  error: Error | undefined
  isLoading: boolean
  reload: UseChatHelpers['reload']
  handleCancel: () => void
}

export const ChatMessage = ({ message, error, isLoading, handleCancel, reload }: ChatMessageProps) => {
  const user = useAuthUser()
  const isAssistant = message.role === 'assistant'

  return (
    <AnimatePresence>
      <motion.div className='mx-auto flex w-full max-w-4xl gap-4 px-4' initial={{ y: 5, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 5, opacity: 0 }}>
        <MessageAvatar
          src={isAssistant ? gptAvatar.src : user?.image || ''}
          alt={isAssistant ? 'AI Assistant' : 'User'}
          fallback={isAssistant ? undefined : 'Me'}
          className='size-7 bg-transparent font-bold'
        />
        <div className={cn('text-primary flex max-w-[90%] flex-1 flex-col space-y-3')}>
          {message.experimental_attachments?.map((attachment, index) => (
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
          {message.parts.map((part, index) => {
            const { type } = part
            const key = `message-${message.id}-part-${index}`

            if (type === 'reasoning') {
              return <MessageReasoning key={key} isLoading={isLoading} reasoning={part.reasoning} />
            }

            if (type === 'text') {
              return (
                <Fragment key={key}>
                  {isAssistant ? (
                    <Markdown className='prose dark:prose-invert prose-headings:text-primary prose-h1:text-xl prose-h2:text-lg prose-h3:text-base prose-p:text-[14px] prose-p:leading-[24px] max-w-none text-[14px]'>
                      {part.text}
                    </Markdown>
                  ) : (
                    <MessageContent className='text-primary bg-transparent p-0 text-[14px] leading-[24px]'>{part.text}</MessageContent>
                  )}
                </Fragment>
              )
            }

            if (type === 'tool-invocation') {
              const { toolInvocation } = part
              const { toolName, toolCallId, state, args } = toolInvocation
              const name = snakeToHumanCase(toolName)
              const loadingMessage = formatToolLoadingMessage(name, args)
              const isLoading = state !== 'result'
              const toolResult = !isLoading ? formatToolResult(toolInvocation.result) : ''

              return (
                <div key={toolCallId}>
                  {isLoading ? (
                    <MessageContent className='text-primary bg-transparent p-0 text-sm'>{loadingMessage}</MessageContent>
                  ) : (
                    <Accordion type='single' collapsible className='w-full'>
                      <AccordionItem value='result'>
                        <AccordionTrigger className='cursor-pointer pt-1.5'>
                          <span>
                            {name} <span className='text-muted-foreground italic'>{isLoading ? 'loading...' : 'results'}</span>
                          </span>
                        </AccordionTrigger>
                        <AccordionContent className='w-full'>
                          <Markdown className='prose dark:prose-invert prose-headings:text-primary prose-h1:text-xl prose-h2:text-lg prose-h3:text-base prose-p:text-[14px] max-w-none text-xs leading-5 whitespace-pre-line'>
                            {toolResult}
                          </Markdown>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  )}
                </div>
              )
            }
          })}

          {(!message.parts || message.parts.length === 0) && message.content && <Markdown>{message.content}</Markdown>}

          {error && <ErrorMessage error={error} onReload={reload} onCancel={handleCancel} />}
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

function formatToolLoadingMessage<TArgs extends Record<string, unknown>>(toolName: string, args: TArgs) {
  return `Loading ${toolName} for ${snakeToHumanCase(
    Object.entries(args)
      .map(([key, value]) => `${key}: ${value}`)
      .join(', '),
  )}...`
}
