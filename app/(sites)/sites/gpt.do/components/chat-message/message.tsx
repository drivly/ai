import { Attachment } from '@/components/ui/attachment'
import { Markdown } from '@/components/ui/markdown'
import { MessageAvatar, MessageContent } from '@/components/ui/message'
import { useAuthUser } from '@/hooks/use-auth-user'
import { cn } from '@/lib/utils'
import gptAvatar from '@/public/gptAvatar.png'
import type { ChatRequestOptions, UIMessage } from 'ai'
import { AnimatePresence, motion } from 'motion/react'
import { nanoid } from 'nanoid'
import { Fragment } from 'react'
import Spinner from '../spinner'
import { ThinkingIndicator } from '../thinking'
import { ErrorMessage } from './error-message'

export interface ChatMessageProps {
  message: UIMessage
  error: Error | undefined
  reload: (chatRequestOptions?: ChatRequestOptions) => Promise<string | null | undefined>
  handleCancel: () => void
}

export const ChatMessage = ({ message, error, handleCancel, reload }: ChatMessageProps) => {
  const user = useAuthUser()

  const isAssistant = message.role === 'assistant'
  const isThinking = message.id === 'thinking'

  if (isThinking) {
    return <ThinkingIndicator key={message.id} type='cursor' className='mx-auto flex w-full max-w-4xl gap-4 px-4' />
  }

  return (
    <AnimatePresence>
      <motion.div
        data-testid={`message-${message.role}`}
        className='group/message mx-auto flex w-full max-w-4xl gap-4 px-4'
        initial={{ y: 5, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        data-role={message.role}
      >
        <MessageAvatar
          src={isAssistant ? gptAvatar.src : user?.image || ''}
          alt={isAssistant ? 'AI Assistant' : 'User'}
          fallback={isAssistant ? 'AI' : 'Me'}
          className='size-7 bg-transparent font-bold'
        />
        <div className={cn('text-primary flex max-w-[90%] flex-1 flex-col space-y-3')}>
          {message.parts.map((part, index) => {
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
                  </Fragment>
                )
              }
              case 'tool-invocation': {
                const callId = part.toolInvocation.toolCallId + '-' + index
                const toolName = part.toolInvocation.toolName
                const toolState = part.toolInvocation.state
                const toolArgs = part.toolInvocation.args

                if (toolState !== 'result') {
                  const loadingMessage = ToolLoading(toolName, {
                    id: part.toolInvocation.args?.id,
                    collection: part.toolInvocation.args?.collection,
                    args: part.toolInvocation.args,
                  })
                  return (
                    <MessageContent key={index} className='text-primary bg-transparent p-0 text-[14px] leading-[24px]'>
                      {loadingMessage}
                    </MessageContent>
                  )
                }

                return (
                  <div key={callId} className='overflow-hidden rounded-md bg-neutral-900/80 p-3 text-sm'>
                    <div className='mb-0 flex items-center gap-3'>
                      <div className='flex flex-col gap-0'>
                        <b>{toolName.replaceAll('_', ' ')}</b>
                        <p className='mt-1 font-mono text-xs font-medium text-neutral-200/80'>{JSON.stringify(toolArgs)}</p>
                      </div>
                    </div>

                    {/* Spinner while loading... */}
                    {toolState != 'result' && (
                      <div className='mt-2'>
                        <Spinner height={24} width={24} className='text-muted-foreground/50' />
                      </div>
                    )}

                    {toolState === 'result' && (
                      <div className='mt-2'>
                        <Markdown className='prose dark:prose-invert prose-headings:text-primary prose-h1:text-xl prose-h2:text-lg prose-h3:text-base prose-p:text-[14px] prose-p:leading-[24px] max-w-none text-[14px]'>
                          {part.toolInvocation.result.slice(0, 250)}
                        </Markdown>
                      </div>
                    )}
                  </div>
                )
              }
            }
          })}

          {(!message.parts || message.parts.length === 0) && message.content && <Markdown>{message.content}</Markdown>}

          {error && <ErrorMessage error={error} onReload={reload} onCancel={handleCancel} />}
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

function ToolLoading<TArgs extends Record<string, unknown>>(toolName: string, args: TArgs) {
  return `Loading ${toolName} for ${Object.keys(args)
    .map((key) => args[key])
    .join(', ')}...`
}
