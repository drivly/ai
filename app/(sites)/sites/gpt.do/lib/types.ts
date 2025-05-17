import type { UIMessage } from 'ai'

export interface ChatSearchParams {
  model?: string
  q?: string
  system?: string
  tool?: string
  tools?: string
  output?: string
  temp?: number
  seed?: number
}

export interface Chat {
  id: string
  title: string
  model: SearchOption
  userId: string
  visibility: 'public' | 'private'
  createdAt: string
  updatedAt: string
}

export interface Chats {
  [id: string]: Chat
}

export interface Message {
  id: string
  chatId: string
  role: 'data' | 'system' | 'user' | 'assistant'
  parts: UIMessage['parts']
  attachments: UIMessage['experimental_attachments']
  createdAt: Date
}

export interface Messages {
  [chatId: string]: Message[]
}

export interface SearchOption {
  value: string
  label: string
  [key: string]: any // Allow for other properties if needed
}
