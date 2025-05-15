import { UIMessage } from 'ai'
import { Fragment, useEffect } from 'react'
import { ChatRedirect } from './chat-redirect'
import { SearchOption } from '../lib/types'

interface ChatWrapperProps {
  children: React.ReactNode
  chatId: string
  messages: Array<UIMessage>
  selectedModel: SearchOption
}

declare global {
  interface Window {
    currentModel: string
  }
}

export function ChatWrapper({ children, chatId, selectedModel, messages }: ChatWrapperProps) {
  const isNewChat = chatId === 'new'

  useEffect(() => {
    if (window) {
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
