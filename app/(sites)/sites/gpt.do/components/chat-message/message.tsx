import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Attachment } from '@/components/ui/attachment'
import { Markdown } from '@/components/ui/markdown'
import { MessageAvatar, MessageContent } from '@/components/ui/message'
import { useAuthUser } from '@/hooks/use-auth-user'
import { cn } from '@/lib/utils'
import gptAvatar from '@/public/gptAvatar.png'
import type { UseChatHelpers } from '@ai-sdk/react'
import { AnimatePresence, motion } from 'framer-motion'
import { nanoid } from 'nanoid'
import { Fragment } from 'react'
import prettyMilliseconds from 'pretty-ms'
import type { DataUsageFrame } from '@/sdks/llm.do/src/types/api/streaming'
import { formatToolResult, snakeToHumanCase } from '../../lib/utils'
import { ErrorMessage } from './error-message'
import { MessageReasoning } from './message-reasoning'

export interface ChatMessageProps {
  message: UseChatHelpers['messages'][number]
  error: UseChatHelpers['error']
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
          {message.parts.map((part, index) => {
            const { type } = part
            const key = `message-${message.id}-part-${index}`

            if (type === 'file') {
              return (
                <Attachment
                  key={index}
                  id={nanoid()}
                  url={part.url}
                  thumbnailUrl={part.url}
                  name={part.filename || ''}
                  type={part.mediaType?.includes('image') ? 'image' : 'pdf'}
                  size={0}
                  className='mt-3'
                />
              )
            }

            if (type === 'reasoning') {
              return <MessageReasoning key={key} isLoading={isLoading} reasoning={part.text} />
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

            if (type === 'data-usage') {
              const { timeToComplete, inputTokens, outputTokens, reasoningTokens, totalTokens, tokensPerSecond } = part.data as DataUsageFrame

              return (
                <div className='text-xs text-zinc-800 dark:text-zinc-600 inline-block font-medium font-mono' key={`${message.id}-usage`}>
                  {prettyMilliseconds(timeToComplete)} | {(tokensPerSecond || 0).toFixed(2)}t/s | Input: {inputTokens}t, Output: {outputTokens}t{reasoningTokens ? `, Reasoning: ${reasoningTokens}t` : ''}, Total: {totalTokens}t
                </div>
              )
            }
          })}

          {(!message.parts || message.parts.length === 0) && message.parts[0].type == 'text' && <Markdown>{message.parts[0].text}</Markdown>}

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
