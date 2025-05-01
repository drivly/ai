import { ChatContainer } from '@/components/ui/chat-container'
import type { UIMessage } from 'ai'
import { ChatMessage } from './message'

export interface MessagesProps {
  containerRef: React.RefObject<HTMLDivElement>
  messages: UIMessage[]
}

export const Messages = (props: MessagesProps) => {
  const { containerRef, messages } = props

  return (
    <ChatContainer data-chat-widget='chat-container' className='flex flex-1 flex-col overflow-y-auto px-2 py-4 scrollbar-hide' ref={containerRef}>
      {messages.length === 0 && <DefaultMessage />}
      {messages.map((message) => (
        <ChatMessage
          data-chat-widget='chat-message'
          key={message.id}
          chatId={message.id}
          role={message.role}
          parts={message.parts}
          attachments={message.experimental_attachments}
          content={message.content}
        />
      ))}
    </ChatContainer>
  )
}

export function DefaultMessage({ message = 'No messages yet. Start a conversation by typing a message below.' }: { message?: string }) {
  return (
    <div className='flex h-full items-center justify-center'>
      <p className='text-muted-foreground text-center text-base leading-[24px] font-medium'>{message}</p>
    </div>
  )
}
