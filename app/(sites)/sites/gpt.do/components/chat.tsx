'use client'

import { ChatContainer } from '@/components/ui/chat-container'
import { useAuthUser } from '@/hooks/use-auth-user'
import type { LLMChatCompletionBody } from '@/sdks/llm.do/src'
import { useChat } from '@ai-sdk/react'
import type { UIMessage } from 'ai'
import { useEffect, useRef } from 'react'
import { toast } from 'sonner'
import { useChatHistory } from '../hooks/use-chat-history'
import { useChatVisibility } from '../hooks/use-chat-visibility'
import { useCustomQuery } from '../hooks/use-custom-query'
import { DEFAULT_CHAT_MODEL } from '../lib/constants'
import type { ComposioDataPromise, SearchOption } from '../lib/types'
import { getSelectedModel } from '../lib/utils'
import { ChatHeader } from './chat-header'
import { ChatMessage } from './chat-message/message'
import { ChatOptionsSelector } from './chat-options-selector'
import { ChatWrapper } from './chat-wrapper'
import { Greeting } from './greeting'
import { MobileSelectionBanner } from './mobile-selection-banner'
import { MultimodalInput } from './multimodal-input'
import type { VisibilityType } from './visibility-selector'

export interface ChatProps {
  id: string
  initialChatModel: SearchOption | null
  initialVisibilityType: VisibilityType
  availableModels: SearchOption[]
  toolsPromise: ComposioDataPromise
}

export const Chat = ({ id, initialChatModel, initialVisibilityType, availableModels, toolsPromise }: ChatProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const user = useAuthUser()
  const { chatSessions, getChatSession, updateChatMessages, addChatSession } = useChatHistory()
  const chatSessionCount = Object.keys(chatSessions).length
  const { model, tool, output, q, system, temp, setQueryState } = useCustomQuery()

  const selectedModelOption = getSelectedModel(model, availableModels, initialChatModel)
  const shouldDefaultModel = selectedModelOption == null && chatSessionCount === 1
  const effectiveSelectedModelOption = shouldDefaultModel ? DEFAULT_CHAT_MODEL : selectedModelOption

  const currentChat = getChatSession(id)
  const isReadonly = user?.id !== currentChat?.userId
  const initialMessages = currentChat?.messages ?? []

  const { append, error, input, messages, status, handleInputChange, handleSubmit, reload, setMessages, stop } = useChat({
    id,
    initialMessages,
    maxSteps: 3,
    body: {
      model: effectiveSelectedModelOption?.value ?? '',
      modelOptions: {
        tools: tool ? tool.split(',') : undefined,
        outputFormat: output,
      },
      system,
      temperature: temp,
    } satisfies LLMChatCompletionBody,
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
      addChatSession(id, effectiveSelectedModelOption)
    }
  }, [id, effectiveSelectedModelOption, currentChat, isReadonly, addChatSession])

  const displayMessages: UIMessage[] =
    status === 'submitted' ? [...messages, { role: 'assistant', content: '', id: 'thinking', experimental_attachments: [], parts: [] }] : messages

  return (
    <ChatWrapper chatId={id} selectedModel={effectiveSelectedModelOption} messages={initialMessages}>
      <section className='mx-auto grid w-full'>
        <div className='bg-background flex h-dvh min-w-0 flex-1 flex-col'>
          <ChatHeader
            chatId={id}
            selectedModelOption={effectiveSelectedModelOption}
            setSelectedModelOption={(model) => setQueryState({ model: model.value })}
            selectedVisibilityType={visibilityType}
            isReadonly={isReadonly}
            modelOptions={availableModels}
            tool={tool}
            output={output}
            setQueryState={setQueryState}
          />
          <MobileSelectionBanner toolsPromise={toolsPromise} modelOptions={availableModels} selectedModelOption={effectiveSelectedModelOption} />
          <ChatContainer data-chat-widget='chat-container' className='scrollbar-hide relative flex min-w-0 flex-1 flex-col gap-6 overflow-y-scroll pt-6' ref={containerRef}>
            {messages.length === 0 && (
              <Greeting
                title='Welcome to GPT.do'
                description='Select your model, tool, and output format to get started.'
                config={<ChatOptionsSelector toolsPromise={toolsPromise} availableModels={availableModels} selectedModelOption={effectiveSelectedModelOption} />}
              />
            )}
            {displayMessages?.map((message, index) => (
              <ChatMessage
                data-chat-widget='chat-message'
                key={message.id}
                message={message}
                error={index === displayMessages.length - 1 && error ? error : undefined}
                reload={reload}
                tool={tool}
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
            selectedModelOption={effectiveSelectedModelOption}
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
