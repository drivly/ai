import type { UIMessage } from 'ai'
import { Fragment, type ReactNode, useEffect } from 'react'
import type { SearchOption } from '../lib/types'
import { ChatRedirect } from './chat-redirect'

interface ChatWrapperProps {
  children: ReactNode
  chatId: string
  messages: Array<UIMessage>
  selectedModel: SearchOption | null
}

declare global {
  interface Window {
    currentModel: string
  }
}

export function ChatWrapper({ children, chatId, selectedModel, messages }: ChatWrapperProps) {
  const isNewChat = chatId === 'new'

  useEffect(() => {
    if (window && selectedModel) {
      window.currentModel = selectedModel.value
    }
  }, [selectedModel])

  return (
    <Fragment>
      <ChatRedirect chatId={chatId} isNewChat={isNewChat} selectedModel={selectedModel} initialDefaultMessages={messages} />
      {children}
    </Fragment>
  )
}
