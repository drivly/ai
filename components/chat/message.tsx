'use client'

import { Attachment } from '@/components/ui/attachment'
import { Markdown } from '@/components/ui/markdown'
import { Message, MessageAvatar, MessageContent } from '@/components/ui/message'
import { useAuthUser } from '@/hooks/use-auth-user'
import { cn } from '@/lib/utils'
import type { UIMessage } from 'ai'
import { motion } from 'motion/react'
import { nanoid } from 'nanoid'
import { Fragment } from 'react'
import { useChatMessages } from './context'
import { ThinkingIndicator } from './thinking'
import { Button } from '@/components/ui/button'

export interface ChatMessageProps {
  chatId: string
  role: UIMessage['role']
  parts: UIMessage['parts']
  attachments: UIMessage['experimental_attachments']
  content: UIMessage['content']
}

export const ChatMessage = ({ chatId, attachments, parts, role, content }: ChatMessageProps) => {
  const user = useAuthUser()
  const { error, reload } = useChatMessages()
  const isAssistant = role === 'assistant'
  const isThinking = chatId === 'thinking'

  if (isThinking) {
    return <ThinkingIndicator key={chatId} type='cursor' />
  }

  return (
    <Message className='w-full items-start justify-start gap-2 px-4 py-3'>
      <MessageAvatar
        src={isAssistant ? '' : user?.image || ''}
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

        {(!parts || parts.length === 0) && content && <Markdown>{content}</Markdown>}

        {error && <ErrorMessage onReload={reload} />}
      </motion.div>
    </Message>
  )
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

// case 'tool-invocation': {
//   return (
//     <div key={index} className='bg-neutral-900/80 rounded-md p-2 text-sm overflow-hidden'>
//       <b>
//         Tool: { part.toolInvocation.toolName }
//       </b>
//       <br/>
//       <p className='text-muted-foreground text-xs font-mono font-medium mt-1'>
//         {JSON.stringify(part.toolInvocation.args)}
//       </p>

//       { part.toolInvocation.state === 'result' && (
//         <div className='mt-2'>
//           <div className='prose dark:prose-invert prose-headings:text-primary prose-h1:text-xl prose-h2:text-lg prose-h3:text-base prose-p:text-[14px] prose-p:leading-[24px] max-w-none text-[14px] whitespace-pre-wrap'>
//             <b>
//               Results:
//             </b>
//             <br/>
//             <p className='text-muted-foreground text-xs font-mono font-medium mt-1'>
//               { part.toolInvocation.result.slice(0, 250) }
//             </p>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }
