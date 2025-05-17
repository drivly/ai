'use client'

import { ChatContainer } from '@/components/ui/chat-container'
import { useAuthUser } from '@/hooks/use-auth-user'
import { useChat } from '@ai-sdk/react'
import type { UIMessage } from 'ai'
import { useEffect, useRef } from 'react'
import { toast } from 'sonner'
import type { IntegrationPromise } from '../actions/composio.action'
import { useChatHistory } from '../hooks/use-chat-history'
import { useChatVisibility } from '../hooks/use-chat-visibility'
import { useCustomQuery } from '../hooks/use-custom-query'
import { formatOutput } from '../lib/constants'
import type { SearchOption } from '../lib/types'
import { getSelectedModel } from '../lib/utils'
import { ChatHeader } from './chat-header'
import { ChatOptionsSelector } from './chat-options-selector'
import { ChatWrapper } from './chat-wrapper'
import { Greeting } from './greeting'
import { ChatMessage } from './message'
import { MobileSelectionBanner } from './mobile-selection-banner'
import { MultimodalInput } from './multimodal-input'
import type { VisibilityType } from './visibility-selector'

export interface ChatProps {
  id: string
  initialChatModel: SearchOption
  initialVisibilityType: VisibilityType
  availableModels: SearchOption[]
  toolsPromise: IntegrationPromise
}

export const Chat = ({ id, initialChatModel, initialVisibilityType, availableModels, toolsPromise }: ChatProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const user = useAuthUser()
  const { getChatSession, updateChatMessages, addChatSession } = useChatHistory()
  const { model, tool, output, q, system, temp, seed, setQueryState } = useCustomQuery()

  const selectedModelId = getSelectedModel(model, availableModels, initialChatModel)
  const currentChat = getChatSession(id)
  const isReadonly = user?.id !== currentChat?.userId
  const initialMessages = currentChat?.messages ?? []

  const { append, error, input, messages, status, handleInputChange, handleSubmit, reload, setMessages, stop } = useChat({
    id,
    initialMessages,
    maxSteps: 3,
    body: {
      model: selectedModelId.value,
      modelOptions: {
        tools: tool ? [tool] : undefined,
        outputFormat: formatOutput(output),
      },
      system,
      temp,
      seed,
    },
    onError: (error) => {
      console.error('Chat error:', error)
      toast.error('An error occurred while processing your request. Please try again.')
    },
    onFinish: (response) => {
      console.log('Chat response:', response)
      // Save all messages when a response is complete
      if (messages.length > 0 && !isReadonly) {
        updateChatMessages(id, messages)
      }
    },
  })

  const { visibilityType } = useChatVisibility({
    chatId: id,
    initialVisibilityType,
  })

  useEffect(() => {
    if (!currentChat && !isReadonly) {
      addChatSession(id, selectedModelId)
    }
  }, [id, selectedModelId, currentChat, isReadonly, addChatSession])

  const displayMessages: UIMessage[] =
    status === 'submitted' ? [...messages, { role: 'assistant', content: '', id: 'thinking', experimental_attachments: [], parts: [] }] : messages

  return (
    <ChatWrapper chatId={id} selectedModel={selectedModelId} messages={initialMessages}>
      <section className='mx-auto grid w-full'>
        <div className='bg-background flex h-dvh min-w-0 flex-1 flex-col'>
          <ChatHeader
            chatId={id}
            selectedModelId={selectedModelId}
            setSelectedModelId={(model) => setQueryState({ model: model.value })}
            selectedVisibilityType={visibilityType}
            isReadonly={isReadonly}
            modelOptions={availableModels}
            tool={tool}
            output={output}
            setQueryState={setQueryState}
          />
          <MobileSelectionBanner toolsPromise={toolsPromise} modelOptions={availableModels} selectedModelId={selectedModelId} />
          <ChatContainer data-chat-widget='chat-container' className='scrollbar-hide relative flex min-w-0 flex-1 flex-col gap-6 overflow-y-scroll pt-6' ref={containerRef}>
            {messages.length === 0 && (
              <Greeting
                title='Welcome to GPT.do'
                description='Select your model, tool, and output format to get started.'
                config={<ChatOptionsSelector toolsPromise={toolsPromise} availableModels={availableModels} initialChatModel={initialChatModel} />}
              />
            )}
            {displayMessages?.map((message, index) => (
              <ChatMessage
                data-chat-widget='chat-message'
                key={message.id}
                message={message}
                error={index === displayMessages.length - 1 && error ? error : undefined}
                reload={reload}
              />
            ))}
          </ChatContainer>
          <MultimodalInput
            bottomRef={bottomRef}
            containerRef={containerRef}
            error={error}
            input={input}
            messages={messages}
            status={status}
            selectedModelId={selectedModelId}
            modelOptions={availableModels}
            toolsPromise={toolsPromise}
            append={append}
            handleInputChange={handleInputChange}
            handleSubmit={handleSubmit}
            setMessages={setMessages}
            stop={stop}
          />
        </div>
      </section>
    </ChatWrapper>
  )
}
