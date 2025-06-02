import type { UIMessage } from 'ai'
import { SELECTION_STEP_MAP } from './constants'

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
  model: SearchOption | null
  userId: string
  visibility: 'public' | 'private'
  createdAt: string
  updatedAt: string
}

export interface Chats {
  [id: string]: Chat
}

export interface Messages {
  [chatId: string]: UIMessage[]
}

export interface GetComposioToolsParams {
  integrationName?: string
}

export type SearchOption = {
  value: string
  label: string
  [key: string]: any
}

export type Integration = SearchOption & {
  logoUrl?: string
  actionsCount?: number
}

export type IntegrationAction = SearchOption & {
  createdBy: string
}

export type ComposioDataPromise = Promise<Integration[] | IntegrationAction[]>

export type ConfigOption = SearchOption | IntegrationAction

export type ChatConfigChangeType = keyof typeof SELECTION_STEP_MAP
