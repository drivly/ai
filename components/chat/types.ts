import { UIMessage } from 'ai'

export interface Message {
  id: string
  chatId: string
  role: 'data' | 'system' | 'user' | 'assistant'
  parts: UIMessage['parts']
  attachments: UIMessage['experimental_attachments']
  createdAt: Date
}

export interface Chat {
  id: string
  title: string
  model: string
  userId: string
  visibility: 'public' | 'private'
  createdAt: string
  updatedAt: string
}

export interface Chats {
  [id: string]: Chat
}

export interface Messages {
  [chatId: string]: Message[]
}
