'use client'

import { ChatHeader } from '@/app/(sites)/sites/gpt.do/components/chat-header'
import { ChatWrapper } from '@/app/(sites)/sites/gpt.do/components/chat-wrapper'
import { VisibilityType } from '@/app/(sites)/sites/gpt.do/components/visibility-selector'
import { useChatHistory } from '@/app/(sites)/sites/gpt.do/hooks/use-chat-history'
import { useChatVisibility } from '@/app/(sites)/sites/gpt.do/hooks/use-chat-visibility'
import { ChatContainer } from '@/components/ui/chat-container'
import { useAuthUser } from '@/hooks/use-auth-user'
import { useChat } from '@ai-sdk/react'
import { UIMessage } from 'ai'
import { Session } from 'next-auth'
import { useSearchParams } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import { IntegrationPromise } from '../actions/composio.action'
import { SearchOption } from '../lib/types'
import { ChatMessage } from './message'
import { MultimodalInput } from './multimodal-input'

export interface ChatProps {
  id: string
  initialChatModel: SearchOption
  initialVisibilityType: VisibilityType
  availableModels: SearchOption[]
  toolsPromise: IntegrationPromise
  session: Session | null
  greeting: React.ReactNode
}

export const Chat = ({ id, initialChatModel, initialVisibilityType, availableModels, toolsPromise, session, greeting }: ChatProps) => {
  const [selectedModelId, setSelectedModelId] = useState(initialChatModel)
  const searchParams = useSearchParams()
  const containerRef = useRef<HTMLDivElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const { getChatSession, updateChatMessages, addChatSession } = useChatHistory()
  const user = useAuthUser()

  // Get format and tools directly from URL
  const outputFormat = searchParams.get('output') || 'markdown'
  const tools = searchParams.get('tool') || ''
  const systemPrompt = searchParams.get('system') || ''
  const tempParam = searchParams.get('temp')
  const seedParam = searchParams.get('seed')

  // Convert parameters with appropriate defaults
  const temperature = tempParam ? parseFloat(tempParam) : 0.7
  const seed = seedParam ? parseInt(seedParam, 10) : 6

  const currentChat = getChatSession(id)
  const isReadonly = user?.id !== currentChat?.userId
  const initialMessages = currentChat?.messages ?? []

  useEffect(() => {
    if (!currentChat && !isReadonly) {
      addChatSession(id, selectedModelId)
    }
  }, [id, selectedModelId, currentChat, isReadonly, addChatSession])

  const { append, error, input, messages, status, handleInputChange, handleSubmit, reload, stop } = useChat({
    id,
    initialMessages,
    maxSteps: 3,
    body: {
      model: selectedModelId.value,
      selectedVisibilityType: initialVisibilityType,
      output: outputFormat,
      modelOptions: {
        tools: tools ? tools.split(',') : undefined
      },
      system: systemPrompt,
      temp: temperature,
      seed: seed,
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to send message')
    },
    onFinish: (response) => {
      console.log('Chat response:', response)
      // Save all messages when a response is complete
      if (messages.length > 0 && !isReadonly) {
        updateChatMessages(id, messages)
      }
    },
  })

  // Keep model value updated if prop changes
  useEffect(() => {
    setSelectedModelId(initialChatModel)
  }, [initialChatModel])

  const { visibilityType } = useChatVisibility({
    chatId: id,
    initialVisibilityType,
  })

  const displayMessages: UIMessage[] =
    status === 'submitted' ? [...messages, { role: 'assistant', content: '', id: 'thinking', experimental_attachments: [], parts: [] }] : messages

  return (
    <ChatWrapper chatId={id} selectedModel={selectedModelId} messages={initialMessages}>
      <section className='mx-auto grid w-full'>
        <div className='bg-background flex h-dvh min-w-0 flex-1 flex-col'>
          <ChatHeader
            chatId={id}
            selectedModelId={selectedModelId}
            setSelectedModelId={setSelectedModelId}
            selectedVisibilityType={visibilityType}
            isReadonly={isReadonly}
            modelOptions={availableModels}
          />
          <ChatContainer data-chat-widget='chat-container' className='scrollbar-hide relative flex min-w-0 flex-1 flex-col gap-6 overflow-y-scroll pt-6' ref={containerRef}>
            {messages.length === 0 && greeting}
            {displayMessages?.map((message) => (
              <ChatMessage
                data-chat-widget='chat-message'
                key={message.id}
                chatId={message.id}
                role={message.role}
                parts={message.parts}
                attachments={message.experimental_attachments}
                content={message.content}
                error={error}
                reload={reload}
              />
            ))}
          </ChatContainer>
          <MultimodalInput
            bottomRef={bottomRef}
            containerRef={containerRef}
            toolsPromise={toolsPromise}
            messages={messages}
            isDisabled={status !== 'ready'}
            isLoading={status === 'streaming' || status === 'submitted'}
            stop={stop}
            input={input}
            append={append}
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmit}
            modelOptions={availableModels}
            selectedModelId={selectedModelId}
          />
        </div>
      </section>
    </ChatWrapper>
  )
}
