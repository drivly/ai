'use client'

import { ChatContainer } from '@/components/ui/chat-container'
import { useAuthUser } from '@/hooks/use-auth-user'
import { createChatStore, useChat } from '@ai-sdk/react'
import type { UIMessage } from 'ai'
import { TextStreamChatTransport } from 'ai'
import dynamic from 'next/dynamic'
import { type ElementRef, useEffect, useRef } from 'react'
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
import { MultimodalInput } from './multimodal-input'
import { ThinkingIndicator } from './thinking'
import type { VisibilityType } from './visibility-selector'

const Greeting = dynamic(() => import('./greeting').then((mod) => mod.Greeting), {
  ssr: false,
})

export interface ChatProps {
  id: string
  initialChatModel: SearchOption | null
  initialVisibilityType: VisibilityType
  availableModels: SearchOption[]
  toolsPromise: ComposioDataPromise
}

export const Chat = ({ id, initialChatModel, initialVisibilityType, availableModels, toolsPromise }: ChatProps) => {
  const containerRef = useRef<ElementRef<'div'>>(null)
  const endRef = useRef<ElementRef<'div'>>(null)
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
    chatId: id,
    chatStore: createChatStore({
      maxSteps: 3,
      chats: {
        [id]: {
          messages: initialMessages as UIMessage[],
        },
      },
      transport: new TextStreamChatTransport({
        api: '/api/chat',
        body: {
          model: effectiveSelectedModelOption?.value ?? '',
          modelOptions: {
            tools: tool ? tool.split(',').map((t) => t.trim()) : undefined,
            outputFormat: output,
          },
          system,
          temperature: temp,
        },
      }),
    }),
    onError: (error) => {
      console.log('🚀 ~ Chat ~ error:', error)
      toast.error('An error occurred while processing your request. Please try again.')
    },
    onFinish: (response) => {
      console.log('🚀 ~ Chat ~ response:', response)
      // Save all messages when a response is complete
      if (messages.length > 0 && !isReadonly) {
        updateChatMessages(id, messages as UIMessage[])
      }
    },
  })

  console.log('🚀 ~ Chat ~ messages:', messages)

  const { visibilityType } = useChatVisibility({
    chatId: id,
    initialVisibilityType,
  })

  useEffect(() => {
    if (!currentChat && !isReadonly) {
      addChatSession(id, effectiveSelectedModelOption)
    }
  }, [id, effectiveSelectedModelOption, currentChat, isReadonly, addChatSession])

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
            toolsPromise={toolsPromise}
            tool={tool}
            output={output}
            setQueryState={setQueryState}
          />
          <ChatContainer ref={containerRef} className='scrollbar-hide relative flex min-w-0 flex-1 flex-col gap-6 overflow-y-scroll pt-6'>
            {messages.length === 0 ? (
              <Greeting
                title='Welcome to GPT.do'
                description='Select your model, tool, and output format to get started.'
                config={<ChatOptionsSelector toolsPromise={toolsPromise} availableModels={availableModels} selectedModelOption={effectiveSelectedModelOption} />}
              />
            ) : (
              messages?.map((message, index) => (
                <ChatMessage
                  key={message.id}
                  message={message}
                  error={index === messages.length - 1 && error ? error : undefined}
                  reload={reload}
                  handleCancel={() => setMessages((prev) => prev.slice(0, -1))}
                  isLoading={status === 'streaming' && messages.length - 1 === index}
                />
              ))
            )}

            {status === 'submitted' && messages.length > 0 && messages[messages.length - 1].role === 'user' && (
              <ThinkingIndicator type='cursor' className='mx-auto flex w-full max-w-4xl gap-4 px-4' />
            )}
          </ChatContainer>
          <MultimodalInput
            bottomRef={endRef}
            containerRef={containerRef}
            error={error}
            input={input}
            messages={messages}
            status={status}
            selectedModelOption={effectiveSelectedModelOption}
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

// ------------------------------------------------------------ //
// id,
// initialMessages: initialMessages as Message[],
// maxSteps: 3,
// body: {
//   model: effectiveSelectedModelOption?.value ?? '',
//   modelOptions: {
//     tools: tool ? tool.split(',').map((t) => t.trim()) : undefined,
//     outputFormat: output,
//   },
//   system,
//   temperature: temp,
// } satisfies LLMChatCompletionBody,

// onError: (error) => {
//   console.log('🚀 ~ Chat ~ error:', error)
//   toast.error('An error occurred while processing your request. Please try again.')
// },
// onFinish: (response) => {
//   console.log('🚀 ~ Chat ~ response:', response)
//   // Save all messages when a response is complete
//   if (messages.length > 0 && !isReadonly) {
//     updateChatMessages(id, messages as UIMessage[])
//   }
// },

//   defaultChatStoreOptions({
//     api: '/api/chat',
//     chats: {
//       [id]: {
//         messages: initialMessages as UIMessage[],
//       },
//     },
//     maxSteps: 3,
//     body: {
//       model: effectiveSelectedModelOption?.value ?? '',
//       modelOptions: {
//         tools: tool ? tool.split(',').map((t) => t.trim()) : undefined,
//         outputFormat: output,
//       },
//       system,
//       temperature: temp,
//     },
//   }),
//   onError: (error) => {
//     console.log('🚀 ~ Chat ~ error:', error)
//     toast.error('An error occurred while processing your request. Please try again.')
//   },
//   onFinish: (response) => {
//     console.log('🚀 ~ Chat ~ response:', response)
//     // Save all messages when a response is complete
//     if (messages.length > 0 && !isReadonly) {
//       updateChatMessages(id, messages as UIMessage[])
//     }
//   },
// })
// createChatStore({
//   maxSteps: 3,
// chats: {
//   [id]: {
//     messages: initialMessages as UIMessage[],
//   },
// },
//   transport: new TextStreamChatTransport({
//     api: '/api/chat',
//     body: {
//       model: effectiveSelectedModelOption?.value ?? '',
//       modelOptions: {
//         tools: tool ? tool.split(',').map((t) => t.trim()) : undefined,
//         outputFormat: output,
//       },
//       system,
//       temperature: temp,
//     },
//   }),
// }),
// onError: (error) => {
//   console.log('🚀 ~ Chat ~ error:', error)
//   toast.error('An error occurred while processing your request. Please try again.')
// },
// onFinish: (response) => {
//   console.log('🚀 ~ Chat ~ response:', response)
//   // Save all messages when a response is complete
//   if (messages.length > 0 && !isReadonly) {
//     updateChatMessages(id, messages as UIMessage[])
//   }
// },
