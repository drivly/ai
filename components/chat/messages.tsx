import { ChatContainer } from '@/components/ui/chat-container'
import type { UIMessage } from 'ai'
import { ChatMessage } from './message'
import { Greeting } from './greeting'

export interface MessagesProps {
  containerRef: React.RefObject<HTMLDivElement>
  messages: UIMessage[]
}

export const Messages = (props: MessagesProps) => {
  const { containerRef, messages } = props

  return (
    <ChatContainer data-chat-widget='chat-container' className='scrollbar-hide relative flex min-w-0 flex-1 flex-col gap-6 overflow-y-scroll pt-6' ref={containerRef}>
      {messages.length === 0 && <Greeting />}
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
