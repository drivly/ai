import type { ReactNode } from 'react'
import type { PayloadAgentAuthResult } from './auth'
import type { Suggestion as StoreSuggestion } from '../components/store/modal-store'

export type ChatWidgetHeaderProps = { logo: string; title?: never } | { logo?: never; title: string }

export type ChatWidgetClassNameProps = {
  rootStyle?: string
  triggerStyle?: string
  containerStyle?: string
  headerStyle?: string
  headerButtonStyle?: string
  headerLogoStyle?: string
  headerTitleStyle?: string
}

export type ResizableChatOptions = {
  type: 'resizable'
  direction: 'horizontal' | 'vertical'
  withOverlay?: never
  withOutsideClick?: never
}

export type ModalChatOptions = {
  type: 'modal'
  direction?: never
  withOverlay?: boolean
  withOutsideClick?: boolean
}

export type PanelChatOptions = {
  type: 'panel'
  direction?: never
  withOverlay?: boolean
  withOutsideClick?: boolean
}

export type ChatWidgetOptions = ResizableChatOptions | ModalChatOptions | PanelChatOptions

// Re-export the Suggestion type from the store
export type Suggestion = StoreSuggestion

export type DefaultChatOptions = {
  aiAvatar?: string | null
  children?: ReactNode
  defaultMessage?: string
  chatOptions?: ChatWidgetClassNameProps
  suggestions?: Suggestion[]
  getAuthResult?: () => Promise<PayloadAgentAuthResult>
  requireAuth?: boolean
  enabled?: boolean
} & ChatWidgetHeaderProps &
  ChatWidgetOptions

// Add specific client props interface
export interface ClientContainerProps extends Omit<DefaultChatOptions, 'getAuthResult' | 'requireAuth'> {
  initialAuthResult: PayloadAgentAuthResult | { user: null; permissions: any[] }
}
